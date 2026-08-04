#!/usr/bin/env bash
# Deploy every registered site, one at a time, cleaning up between builds.
# Sequential on purpose: parallel `next build` runs exhaust RAM and disk.
#
#   sudo bash deploy/deploy-all.sh
#   sudo bash deploy/deploy-all.sh --only site-a,site-b
#   sudo bash deploy/deploy-all.sh --artifact /tmp/app.tar.gz   # same code everywhere
#   sudo bash deploy/deploy-all.sh --continue-on-error
set -uo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

ONLY=""
ARTIFACT=""
CONTINUE=0

while [ $# -gt 0 ]; do
  case "$1" in
  --only)
    ONLY="$2"
    shift 2
    ;;
  --artifact)
    ARTIFACT="$2"
    shift 2
    ;;
  --continue-on-error)
    CONTINUE=1
    shift
    ;;
  -h | --help)
    sed -n '2,9p' "$0"
    exit 0
    ;;
  *) die "unknown option: $1" ;;
  esac
done

if [ -n "$ONLY" ]; then
  SLUGS="$(printf '%s' "$ONLY" | tr ',' '\n')"
else
  SLUGS="$(list_slugs)"
fi

TOTAL="$(printf '%s\n' "$SLUGS" | grep -c . || true)"
[ "$TOTAL" -gt 0 ] || die "no sites to deploy"

log "Deploying $TOTAL site(s) sequentially"
OK=0
FAILED=""
INDEX=0

while read -r slug; do
  [ -n "$slug" ] || continue
  INDEX=$((INDEX + 1))
  printf '\n════ [%s/%s] %s ════\n' "$INDEX" "$TOTAL" "$slug"

  if bash "$AP_DEPLOY_DIR/site-deploy.sh" "$slug" ${ARTIFACT:+--artifact "$ARTIFACT"}; then
    OK=$((OK + 1))
  else
    FAILED="$FAILED $slug"
    warn "$slug failed"
    [ "$CONTINUE" = 1 ] || {
      warn "stopping (use --continue-on-error to keep going)"
      break
    }
  fi

  # Keep the working set small so site 50 has as much room as site 1.
  bash "$AP_DEPLOY_DIR/disk-cleanup.sh" >/dev/null 2>&1 || true
done < <(printf '%s\n' "$SLUGS")

printf '\n'
log "Deployed $OK/$TOTAL"
[ -n "$FAILED" ] && {
  warn "failed:$FAILED"
  exit 1
}
df -h / | awk 'NR==2 {printf "    disk /: %s free of %s\n", $4, $2}'
