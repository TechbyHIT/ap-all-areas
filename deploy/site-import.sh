#!/usr/bin/env bash
# Adopt an existing site (e.g. /var/www/foo run by hand or by Docker) into the
# registry layout, reusing its .env. Nothing is deleted until you pass --purge.
#
#   sudo bash deploy/site-import.sh --slug site-a --domain site-a.com \
#        --from /var/www/site-a [--repo <git-url>] [--branch main] [--port 3001]
#
# Then:  sudo bash deploy/site-deploy.sh site-a     # first clean release
#        sudo rm -rf /var/www/site-a                # once the new one serves traffic
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

SLUG=""
DOMAIN=""
FROM=""
REPO=""
BRANCH="main"
PORT=""

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
  --from)
    FROM="$2"
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
  --port)
    PORT="$2"
    shift 2
    ;;
  -h | --help)
    sed -n '2,10p' "$0"
    exit 0
    ;;
  *) die "unknown option: $1" ;;
  esac
done

[ -n "$SLUG" ] || die "--slug is required"
[ -n "$DOMAIN" ] || die "--domain is required"
[ -n "$FROM" ] || die "--from <existing site dir> is required"
[ -d "$FROM" ] || die "not a directory: $FROM"

log "Importing $FROM ($(size_of "$FROM")) as '$SLUG'"

# Recover the git remote and branch from the old checkout when not supplied.
if [ -z "$REPO" ] && [ -d "$FROM/.git" ]; then
  REPO="$(git -C "$FROM" remote get-url origin 2>/dev/null || true)"
  [ -n "$REPO" ] && info "detected repo: $REPO"
  DETECTED_BRANCH="$(git -C "$FROM" rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
  [ -n "$DETECTED_BRANCH" ] && [ "$DETECTED_BRANCH" != "HEAD" ] && BRANCH="$DETECTED_BRANCH"
fi

bash "$AP_DEPLOY_DIR/site-add.sh" --slug "$SLUG" --domain "$DOMAIN" \
  ${REPO:+--repo "$REPO"} --branch "$BRANCH" ${PORT:+--port "$PORT"} --no-nginx

DIR="$(site_dir "$SLUG")"

for candidate in "$FROM/.env.production" "$FROM/.env"; do
  if [ -f "$candidate" ]; then
    log "Copying $candidate -> $DIR/shared/.env"
    cp "$candidate" "$DIR/shared/.env"
    chmod 600 "$DIR/shared/.env"
    break
  fi
done
grep -q '^DATABASE_URL=.\+' "$DIR/shared/.env" 2>/dev/null ||
  warn "DATABASE_URL looks empty in $DIR/shared/.env — fill it before deploying"

# Uploaded/user files that are not in git and would be lost on rebuild.
if [ -d "$FROM/public/uploads" ]; then
  log "Copying public/uploads to shared/"
  mkdir -p "$DIR/shared/uploads"
  cp -a "$FROM/public/uploads/." "$DIR/shared/uploads/"
  warn "symlink shared/uploads into the release yourself if the app writes there"
fi

load_site "$SLUG"

# The imported site almost certainly has a live vhost for this domain already,
# and two enabled server blocks for one server_name would clash. Write the new
# one but leave enabling to the operator.
VHOST=""
if [ -d "$AP_NGINX_AVAILABLE" ]; then
  VHOST="$AP_NGINX_AVAILABLE/$SLUG.conf"
  log "Writing (not enabling) nginx vhost $VHOST"
  render_template "$AP_DEPLOY_DIR/nginx-site.conf.template" "$VHOST" \
    "SLUG=$SLUG" "DOMAIN=$DOMAIN" "ALIASES=$ALIASES" "PORT=$PORT"
fi

log "Imported '$SLUG' on port $PORT"
cat <<EOF

The old directory is untouched. To finish:

  1. Review env:      $DIR/shared/.env
  2. Clean release:   sudo bash deploy/site-deploy.sh $SLUG
  3. Cut over nginx:  disable the old vhost for $DOMAIN, then
                      ln -sfn $VHOST $AP_NGINX_ENABLED/$SLUG.conf
                      nginx -t && systemctl reload nginx
  4. Verify the site, then:  sudo rm -rf $FROM

Step 4 is where the disk comes back — $FROM is currently $(size_of "$FROM").
EOF
