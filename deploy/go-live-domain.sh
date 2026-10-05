#!/usr/bin/env bash
# Find which registered slug nginx uses for a domain, then optionally deploy it.
#
#   bash deploy/go-live-domain.sh hiranayaenterprises.in
#   bash deploy/go-live-domain.sh hiranayaenterprises.in --deploy
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

WANT="${1:-}"
MODE="${2:-}"
[ -n "$WANT" ] || die "usage: go-live-domain.sh <domain> [--deploy]"

log "Looking up $WANT"

MATCHES=()
for f in "$AP_REGISTRY"/*.env; do
  [ -f "$f" ] || continue
  slug="$(basename "$f" .env)"
  if grep -Eq "^DOMAIN=${WANT}$|^ALIASES=.*${WANT}" "$f"; then
    MATCHES+=("$slug")
  fi
done

if [ "${#MATCHES[@]}" -eq 0 ]; then
  die "no registry entry has DOMAIN/ALIASES=$WANT — check $AP_REGISTRY"
fi

echo "    registry match(es): ${MATCHES[*]}"

NGINX_FILES="$(grep -l "$WANT" "$AP_NGINX_ENABLED"/* "$AP_NGINX_AVAILABLE"/* 2>/dev/null || true)"
if [ -z "$NGINX_FILES" ]; then
  warn "no nginx vhost mentions $WANT"
else
  echo "    nginx files:"
  # shellcheck disable=SC2086
  printf '      %s\n' $NGINX_FILES
  echo "    nginx listen/upstream:"
  # shellcheck disable=SC2086
  grep -hE 'listen |server_name |upstream |server \[|server 127|proxy_pass ' $NGINX_FILES |
    sed 's/^/      /' || true
fi

SLUG="${MATCHES[0]}"
if [ "${#MATCHES[@]}" -gt 1 ]; then
  warn "multiple slugs match this domain. Using the first: $SLUG"
  warn "other match(es): ${MATCHES[*]:1}"
fi

load_site "$SLUG"
SITE_PORT="$PORT"
SITE_BRANCH="$BRANCH"
CURRENT_REL="$(readlink "$(site_dir "$SLUG")/current" 2>/dev/null || echo none)"
echo "    slug=$SLUG port=$SITE_PORT branch=$SITE_BRANCH"
echo "    current=$CURRENT_REL"

SMOKE="/locations/andhra-pradesh/visakhapatnam/children-safety-nets/"

log "Local app vs public HTTPS"
echo "    --- localhost:$SITE_PORT/sitemap.xml ---"
curl -s "http://localhost:${SITE_PORT}/sitemap.xml" 2>/dev/null | head -6 | sed 's/^/      /' || true
echo "    --- https://$WANT/sitemap.xml ---"
curl -s "https://${WANT}/sitemap.xml" 2>/dev/null | head -6 | sed 's/^/      /' || true
echo "    --- localhost $SMOKE ---"
curl -sI "http://localhost:${SITE_PORT}${SMOKE}" 2>/dev/null | head -3 | sed 's/^/      /' || true
echo "    --- https $SMOKE ---"
curl -sI "https://${WANT}${SMOKE}" 2>/dev/null | head -3 | sed 's/^/      /' || true

if [ "$MODE" != "--deploy" ]; then
  cat <<EOF

    Diagnose only. Public HTTPS is the old build until you deploy THIS slug:

      sed -i 's|^BRANCH=.*|BRANCH=seo/andhra-pradesh-full-index|' $AP_REGISTRY/$SLUG.env
      cd /root/ap-all-areas
      git fetch origin && git checkout seo/andhra-pradesh-full-index
      git pull --ff-only origin seo/andhra-pradesh-full-index
      rm -rf $(site_dir "$SLUG")/shared/cache/fetch-cache
      bash deploy/site-deploy.sh $SLUG

    Or:

      bash deploy/go-live-domain.sh $WANT --deploy
EOF
  exit 0
fi

log "Pinning $SLUG to seo/andhra-pradesh-full-index"
sed -i 's|^BRANCH=.*|BRANCH=seo/andhra-pradesh-full-index|' "$(site_conf "$SLUG")"

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"
git fetch origin
git checkout seo/andhra-pradesh-full-index
git pull --ff-only origin seo/andhra-pradesh-full-index

rm -rf "$(site_dir "$SLUG")/shared/cache/fetch-cache"
bash "$REPO_ROOT/deploy/site-deploy.sh" "$SLUG"

log "Verify"
curl -sI "https://${WANT}${SMOKE}" | head -8
echo "--- sitemap ---"
curl -s "https://${WANT}/sitemap.xml" | head -8
