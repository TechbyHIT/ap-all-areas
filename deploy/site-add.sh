#!/usr/bin/env bash
# Register a new site: allocate a port, create the directory layout, write the
# registry entry and the nginx vhost. Does NOT build — run site-deploy.sh next.
#
#   sudo bash deploy/site-add.sh --slug site-b --domain site-b.com \
#        --repo git@github.com:you/repo.git [--branch main] \
#        [--aliases "www.site-b.com"] [--port 3007] [--no-nginx]
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

SLUG=""
DOMAIN=""
REPO=""
BRANCH="main"
BRANCH_EXPLICIT=0
ALIASES=""
PORT=""
WITH_NGINX=1

while [ $# -gt 0 ]; do
  case "$1" in
  --slug)
    SLUG="$2"
    shift 2
    ;;
  --domain)
    DOMAIN="$2"
    shift 2
    ;;
  --repo)
    REPO="$2"
    shift 2
    ;;
  --branch)
    BRANCH="$2"
    BRANCH_EXPLICIT=1
    shift 2
    ;;
  --aliases)
    ALIASES="$2"
    shift 2
    ;;
  --port)
    PORT="$2"
    shift 2
    ;;
  --no-nginx)
    WITH_NGINX=0
    shift
    ;;
  -h | --help)
    sed -n '2,9p' "$0"
    exit 0
    ;;
  *) die "unknown option: $1" ;;
  esac
done

[ -n "$SLUG" ] || die "--slug is required"
[ -n "$DOMAIN" ] || die "--domain is required"
slug_ok "$SLUG" || die "--slug must be lowercase letters, digits and hyphens"

# Default www alias, since that is what certbot and nginx will expect.
if [ -z "$ALIASES" ] && ! printf '%s' "$DOMAIN" | grep -q '^www\.'; then
  ALIASES="www.$DOMAIN"
fi

CONF="$(site_conf "$SLUG")"
[ -f "$CONF" ] && die "site '$SLUG' already registered at $CONF"

# Ask the remote which branch it actually uses rather than assuming "main".
if [ "$BRANCH_EXPLICIT" = 0 ] && [ -n "$REPO" ] && command -v git >/dev/null 2>&1; then
  DETECTED="$(detect_default_branch "$REPO")"
  if [ -n "$DETECTED" ]; then
    [ "$DETECTED" != "$BRANCH" ] && info "remote default branch is '$DETECTED'"
    BRANCH="$DETECTED"
  fi
fi

mkdir -p "$AP_REGISTRY"
[ -n "$PORT" ] || PORT="$(next_free_port)"

DIR="$(site_dir "$SLUG")"
log "Creating layout at $DIR"
mkdir -p "$DIR"/{build,releases,shared/logs,shared/cache}

log "Writing registry entry $CONF"
cat >"$CONF" <<EOF
# Site: $SLUG   (managed by deploy/site-add.sh)
DOMAIN=$DOMAIN
ALIASES=$ALIASES
PORT=$PORT
REPO=$REPO
BRANCH=$BRANCH
MAX_MEMORY=300M
EOF

ENV_FILE="$DIR/shared/.env"
if [ ! -f "$ENV_FILE" ]; then
  log "Creating $ENV_FILE"
  cat >"$ENV_FILE" <<EOF
# Runtime env for $SLUG. PM2 loads this on start/reload.
NEXT_PUBLIC_SITE_URL=https://$DOMAIN

# Optional. The public pages are built from src/data and never query the
# database — only /admin and the scripts/ tools do. Leave DATABASE_URL unset
# unless you need them.
# DATABASE_URL=postgresql://user:pass@localhost:5432/dbname?connection_limit=3
EOF
  chmod 600 "$ENV_FILE"
fi

if [ "$WITH_NGINX" = 1 ]; then
  if [ -d "$AP_NGINX_AVAILABLE" ]; then
    VHOST="$AP_NGINX_AVAILABLE/$SLUG.conf"
    log "Writing nginx vhost $VHOST (port $PORT)"
    render_template "$AP_DEPLOY_DIR/nginx-site.conf.template" "$VHOST" \
      "SLUG=$SLUG" "DOMAIN=$DOMAIN" "ALIASES=$ALIASES" "PORT=$PORT"
    ln -sfn "$VHOST" "$AP_NGINX_ENABLED/$SLUG.conf"
    nginx_reload || info "the site will still work once the config error above is fixed"
  else
    warn "$AP_NGINX_AVAILABLE not found — skipping nginx config"
  fi
fi

log "Registered '$SLUG' on port $PORT"

# Warn now rather than letting certbot fail later: Let's Encrypt rejects the
# whole order when one requested name returns NXDOMAIN.
for host in $DOMAIN $ALIASES; do
  [ -n "$host" ] || continue
  dns_resolves "$host" || warn "$host does not resolve yet — add its DNS record before requesting TLS"
done

cat <<EOF

Next steps:

  1. Review env:    $ENV_FILE  (DATABASE_URL only needed for /admin)
  2. Deploy:        sudo bash deploy/site-deploy.sh $SLUG
  3. TLS:           sudo bash deploy/site-tls.sh $SLUG

Fleet: $(list_slugs | wc -l | tr -d ' ') site(s) registered, next free port $(next_free_port)
EOF
