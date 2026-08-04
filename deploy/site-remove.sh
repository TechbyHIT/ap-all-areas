#!/usr/bin/env bash
# Take a site offline and optionally delete its files.
#
#   sudo bash deploy/site-remove.sh <slug>            # stop + disable vhost, keep files
#   sudo bash deploy/site-remove.sh <slug> --purge    # also delete /srv/sites/<slug>
#
# --purge does not touch the database; drop it yourself if you meant to.
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

[ $# -ge 1 ] || die "usage: site-remove.sh <slug> [--purge]"
SLUG_ARG="$1"
shift
PURGE=0
[ "${1:-}" = "--purge" ] && PURGE=1

load_site "$SLUG_ARG"
DIR="$(site_dir "$SLUG")"

log "Stopping PM2 app $SLUG"
if pm2_app_exists "$SLUG"; then
  pm2 delete "$SLUG" || warn "pm2 delete failed"
  pm2 save >/dev/null 2>&1 || true
else
  info "not running"
fi

if [ -L "$AP_NGINX_ENABLED/$SLUG.conf" ] || [ -f "$AP_NGINX_ENABLED/$SLUG.conf" ]; then
  log "Disabling nginx vhost"
  rm -f "$AP_NGINX_ENABLED/$SLUG.conf"
  nginx -t 2>/dev/null && systemctl reload nginx 2>/dev/null || warn "reload nginx manually"
fi

if [ "$PURGE" = 1 ]; then
  SIZE="$(size_of "$DIR")"
  log "Deleting $DIR ($SIZE) and registry entry"
  rm -rf "$DIR"
  rm -f "$(site_conf "$SLUG")"
  rm -f "$AP_NGINX_AVAILABLE/$SLUG.conf"
  log "$SLUG purged — reclaimed $SIZE"
  info "database for $SLUG was NOT dropped"
else
  log "$SLUG stopped. Files kept at $DIR ($(size_of "$DIR"))"
  info "purge later with: sudo bash deploy/site-remove.sh $SLUG --purge"
fi
