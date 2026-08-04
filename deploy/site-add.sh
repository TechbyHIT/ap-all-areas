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
# Fill in before the first deploy.
DATABASE_URL=
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
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
    if nginx -t 2>/dev/null; then
      systemctl reload nginx 2>/dev/null || warn "could not reload nginx"
    else
      warn "nginx -t failed — vhost written but not reloaded. Run: nginx -t"
    fi
  else
    warn "$AP_NGINX_AVAILABLE not found — skipping nginx config"
  fi
fi

log "Registered '$SLUG' on port $PORT"
cat <<EOF

Next steps:

  1. Fill in secrets:   $ENV_FILE
  2. First deploy:      sudo bash deploy/site-deploy.sh $SLUG
  3. TLS:               sudo certbot --nginx -d $DOMAIN${ALIASES:+ -d $ALIASES}

Fleet: $(list_slugs | wc -l | tr -d ' ') site(s) registered, next free port $(next_free_port)
EOF
