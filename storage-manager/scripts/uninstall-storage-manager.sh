#!/usr/bin/env bash
# Remove the storage manager. Your applications, data, git repositories, nginx
# configuration and PM2 processes are not touched in any way.
#
#   sudo bash uninstall-storage-manager.sh                  keep config and logs
#   sudo bash uninstall-storage-manager.sh --purge-config
#   sudo bash uninstall-storage-manager.sh --purge-logs
#   sudo bash uninstall-storage-manager.sh --purge          both
set -uo pipefail

BIN_PATH=/usr/local/sbin/storage-manager
CONF_DIR=/etc/storage-manager
UNIT_DIR=/etc/systemd/system
DOC_DIR=/usr/local/share/doc/storage-manager
STATE_DIR=/var/lib/storage-manager
LOG_DIR=/var/log/storage-manager
LOGROTATE_FILE=/etc/logrotate.d/storage-manager

PURGE_CONFIG=0
PURGE_LOGS=0

log() { printf '==> %s\n' "$*"; }
info() { printf '    %s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
  --purge-config) PURGE_CONFIG=1 ;;
  --purge-logs) PURGE_LOGS=1 ;;
  --purge)
    PURGE_CONFIG=1
    PURGE_LOGS=1
    ;;
  -h | --help)
    sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'
    exit 0
    ;;
  *) die "unknown option: $1" ;;
  esac
  shift
done

[ "$(id -u)" = 0 ] || die "run as root (sudo bash uninstall-storage-manager.sh)"

log "Stopping automatic operation"
if command -v systemctl >/dev/null 2>&1; then
  systemctl disable --now storage-manager.timer 2>/dev/null && info "timer disabled and stopped" ||
    info "timer was not enabled"
  # The service is oneshot; stopping it only affects a pass that is running now.
  systemctl stop storage-manager.service 2>/dev/null || true
else
  warn "systemctl not available — remove the units by hand"
fi

log "Removing units and the program"
for f in "$UNIT_DIR/storage-manager.timer" "$UNIT_DIR/storage-manager.service" \
  "$LOGROTATE_FILE" "$BIN_PATH"; do
  if [ -e "$f" ]; then
    rm -f "$f" && info "removed $f"
  fi
done
rm -rf "$DOC_DIR" 2>/dev/null && info "removed $DOC_DIR"
command -v systemctl >/dev/null 2>&1 && systemctl daemon-reload 2>/dev/null

log "Removing the manager's own state"
if [ -d "$STATE_DIR" ]; then
  rm -rf "$STATE_DIR" && info "removed $STATE_DIR (discovery cache only)"
fi
rm -f /var/lock/storage-manager.lock 2>/dev/null

if [ "$PURGE_CONFIG" = 1 ]; then
  rm -rf "$CONF_DIR" && log "Removed $CONF_DIR"
else
  log "Keeping $CONF_DIR"
  info "remove it with --purge-config if you are not reinstalling"
fi

if [ "$PURGE_LOGS" = 1 ]; then
  rm -rf "$LOG_DIR" && log "Removed $LOG_DIR"
else
  log "Keeping $LOG_DIR"
  info "the audit trail of every past run stays in $LOG_DIR/storage-manager-history.log"
fi

log "Untouched, as promised"
info "project directories, source code, node_modules and .next"
info ".env files, uploads, databases and backups"
info "git repositories and their working trees"
info "nginx configuration, SSL certificates, PM2 processes and their logs"
printf '\n'
log "Done — nothing now manages disk space automatically"
if grep -rslE 'disk-guard\.sh|disk-cleanup\.sh' /etc/cron.d /etc/crontab 2>/dev/null | grep -q .; then
  info "note: a disk-guard/disk-cleanup cron entry still exists and will keep running"
else
  info "watch the disk yourself, or reinstall: the box will fill up again otherwise"
fi
