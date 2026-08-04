#!/usr/bin/env bash
# Keep free space on / above a floor without being asked. Cron runs this every
# 15 minutes. It does nothing and prints nothing until usage crosses the first
# threshold, so it can be scheduled often without burying the log.
#
#   sudo bash deploy/disk-guard.sh
#   sudo bash deploy/disk-guard.sh --dry-run
#   sudo bash deploy/disk-guard.sh --warn 80 --critical 90 --panic 95
#
# Tiers escalate only as far as they need to:
#   warn      safe cleanup   build caches, stale releases, rotated logs
#   critical  aggressive     + node_modules of old releases, npm cache, docker
#   panic     last resort    truncate live logs in place, vacuum the journal
#
# Exits non-zero if it is still above the panic threshold afterwards, because at
# that point something is actively writing and deleting more will not help.
set -uo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

WARN=80
CRITICAL=90
PANIC=95
DRY_RUN=0

while [ $# -gt 0 ]; do
  case "$1" in
  --warn)
    WARN="$2"
    shift 2
    ;;
  --critical)
    CRITICAL="$2"
    shift 2
    ;;
  --panic)
    PANIC="$2"
    shift 2
    ;;
  --dry-run | -n)
    DRY_RUN=1
    shift
    ;;
  -h | --help)
    sed -n '2,17p' "$0"
    exit 0
    ;;
  *) die "unknown option: $1" ;;
  esac
done

# Capacity is the second-to-last column; the mount point is last.
disk_pct() { df -P / | awk 'NR==2 {gsub(/%/, "", $(NF - 1)); print $(NF - 1) + 0}'; }
free_mb() { df -Pm / | awk 'NR==2 {print $(NF - 2)}'; }

PCT="$(disk_pct)"
[ -n "$PCT" ] || die "could not read disk usage for /"

if [ "$PCT" -lt "$WARN" ]; then
  # Silent under cron; only speak up when a human ran it.
  [ -t 1 ] && info "/ is ${PCT}% full, under the ${WARN}% threshold — nothing to do"
  exit 0
fi

DRY=""
[ "$DRY_RUN" = 1 ] && DRY="--dry-run"

FREE_BEFORE="$(free_mb)"
log "$(date '+%F %T') / is ${PCT}% full (warn $WARN, critical $CRITICAL, panic $PANIC)"

log "Safe cleanup"
# shellcheck disable=SC2086
bash "$AP_DEPLOY_DIR/disk-cleanup.sh" $DRY
PCT="$(disk_pct)"

if [ "$PCT" -ge "$CRITICAL" ]; then
  log "Still ${PCT}% full — aggressive cleanup"
  # shellcheck disable=SC2086
  bash "$AP_DEPLOY_DIR/disk-cleanup.sh" --aggressive $DRY
  PCT="$(disk_pct)"
fi

if [ "$PCT" -ge "$PANIC" ]; then
  warn "Still ${PCT}% full — reclaiming what the earlier tiers leave alone"

  # Space inside a file a process still holds open is not released by rm, only
  # by emptying the file in place. This is why a crash-looping app can fill a
  # disk that looks nearly empty in du.
  for f in /root/.pm2/logs/*.log /var/log/nginx/*.log "$AP_ROOT"/*/shared/logs/*.log; do
    [ -f "$f" ] || continue
    mb="$(size_mb "$f")"
    [ "${mb:-0}" -ge 10 ] 2>/dev/null || continue
    if [ "$DRY_RUN" = 1 ]; then
      printf '    would empty %6s MB  %s\n' "$mb" "$f"
    else
      : >"$f"
      printf '    emptied     %6s MB  %s\n' "$mb" "$f"
    fi
  done

  if [ "$DRY_RUN" = 1 ]; then
    printf '    would run: journalctl --vacuum-size=100M\n'
    printf '    would run: nginx reopen logs\n'
  else
    journalctl --vacuum-size=100M >/dev/null 2>&1 || warn "journal vacuum failed"
    # nginx keeps writing to the old inode until told to reopen.
    for pidfile in /run/nginx.pid /var/run/nginx.pid; do
      [ -f "$pidfile" ] && kill -USR1 "$(cat "$pidfile")" 2>/dev/null && break
    done
  fi
  PCT="$(disk_pct)"
fi

FREE_AFTER="$(free_mb)"
log "/ is now ${PCT}% full — ${FREE_AFTER} MB free, $((FREE_AFTER - FREE_BEFORE)) MB reclaimed"

if [ "$PCT" -ge "$PANIC" ]; then
  warn "still above ${PANIC}% after every tier — something is actively writing"
  info "identify it with:"
  info "  sudo bash $AP_DEPLOY_DIR/find-write-leak.sh --duration 60"
  exit 1
fi
