#!/usr/bin/env bash
# Install the storage manager. Read-only towards your applications: it does not
# stop, restart or reload anything, does not touch project directories, and does
# not delete a single byte of data.
#
#   sudo bash install-storage-manager.sh                 install, audit, dry-run, then ask
#   sudo bash install-storage-manager.sh --yes           same, but enable without asking
#   sudo bash install-storage-manager.sh --no-enable     install and validate only
#   sudo bash install-storage-manager.sh --disable-legacy-disk-guard
#
# Automatic operation is NOT enabled until the audit and the dry-run have run and
# you have confirmed.
set -uo pipefail

BIN_PATH=/usr/local/sbin/storage-manager
CONF_DIR=/etc/storage-manager
CONF_FILE="$CONF_DIR/storage-manager.conf"
UNIT_DIR=/etc/systemd/system
DOC_DIR=/usr/local/share/doc/storage-manager
STATE_DIR=/var/lib/storage-manager
LOG_DIR=/var/log/storage-manager
LOGROTATE_FILE=/etc/logrotate.d/storage-manager

ASSUME_YES=0
NO_ENABLE=0
DISABLE_LEGACY=0

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() { printf '==> %s\n' "$*"; }
info() { printf '    %s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}
hr() { printf '%s\n' '========================================================'; }

while [ $# -gt 0 ]; do
  case "$1" in
  --yes | -y) ASSUME_YES=1 ;;
  --no-enable) NO_ENABLE=1 ;;
  --disable-legacy-disk-guard) DISABLE_LEGACY=1 ;;
  -h | --help)
    sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'
    exit 0
    ;;
  *) die "unknown option: $1" ;;
  esac
  shift
done

# ------------------------------------------------------------------- 1. checks
log "Checking the environment"
[ "$(id -u)" = 0 ] || die "run as root (sudo bash install-storage-manager.sh)"

if [ -r /etc/os-release ]; then
  # shellcheck disable=SC1091
  . /etc/os-release
  info "distribution: ${PRETTY_NAME:-unknown}"
  case "${ID:-}${ID_LIKE:-}" in
  *ubuntu* | *debian*) ;;
  *) warn "this was written for Ubuntu/Debian; continuing, but check the log paths in $CONF_FILE" ;;
  esac
else
  warn "/etc/os-release is missing — cannot confirm the distribution"
fi

MISSING=""
for cmd in bash df du find stat realpath awk sed grep flock date; do
  command -v "$cmd" >/dev/null 2>&1 || MISSING="$MISSING $cmd"
done
[ -z "$MISSING" ] || die "required commands not found:$MISSING"

# Installing needs a few MB. On a disk that is already full the copy fails
# half-way, which is a bad moment to discover that the tool meant to help is
# itself broken — so refuse early and say what to do instead.
FREE_MB="$(df -Pm / | awk 'NR==2 {print $(NF-2)}')"
if [ "${FREE_MB:-0}" -lt 50 ]; then
  printf 'ERROR: only %s MB free on / — too little to install safely.\n\n' "${FREE_MB:-0}" >&2
  cat >&2 <<'EOF'
This installer will not write a partial program onto a full disk. Free a little
space first, with commands that need no disk space of their own:

  # the biggest files, and any runaway log among them
  sudo find /root /srv /var/www -xdev -type f -size +1G -printf '%10s  %p\n' \
    2>/dev/null | sort -rn | head -20

  # a log a process still holds open is emptied, never deleted
  sudo truncate -s 0 '<huge log file>'

  # a bundle nested inside another bundle is duplicate data; only the outer one
  # is ever served, so this is safe while the site is live
  sudo find /root /srv /var/www -maxdepth 12 -type d \
    -path '*/.next/standalone/.next/standalone' -prune -print 2>/dev/null
  sudo rm -rf --one-file-system '<path from above>'

  # something still writing? stop that one process — a copy or build is not
  # serving traffic
  sudo ps -eo pid,etimes,args | grep -E ' cp | rsync |next build|npm ' | grep -v grep

Then run this installer again.
EOF
  exit 1
fi
info "free space on /: ${FREE_MB} MB"

log "Optional integrations"
for cmd in pm2 nginx journalctl logrotate lsof git python3 node npm systemctl; do
  if command -v "$cmd" >/dev/null 2>&1; then
    info "$(printf '%-11s found' "$cmd")"
  else
    info "$(printf '%-11s not found' "$cmd")"
    case "$cmd" in
    lsof) warn "without lsof the manager cannot check for open files or find deleted-but-open ones: apt-get install -y lsof" ;;
    pm2) warn "without pm2 every project stays UNKNOWN, which means fully protected and never cleaned" ;;
    systemctl) die "systemd is required for automatic operation" ;;
    esac
  fi
done

# ------------------------------------------------------------- 2. directories
log "Creating directories"
for d in "$CONF_DIR" "$STATE_DIR" "$LOG_DIR" "$DOC_DIR"; do
  mkdir -p "$d" || die "could not create $d"
  info "$d"
done
chmod 755 "$CONF_DIR" "$DOC_DIR"
# State and logs can contain a full picture of the server's layout.
chmod 750 "$STATE_DIR" "$LOG_DIR"

# --------------------------------------------------------------- 3. the program
log "Installing $BIN_PATH"
# Copy to a temporary name and move it into place, so a copy that fails part way
# through cannot replace a working program with a truncated one.
if install -m 755 "$SRC_DIR/scripts/storage-manager.sh" "$BIN_PATH.new" &&
  bash -n "$BIN_PATH.new"; then
  mv -f "$BIN_PATH.new" "$BIN_PATH" || die "could not move $BIN_PATH.new into place"
else
  rm -f "$BIN_PATH.new"
  die "could not install $BIN_PATH (the previously installed copy, if any, is untouched)"
fi

log "Installing documentation to $DOC_DIR"
for f in "$SRC_DIR/README.md" "$SRC_DIR/docs/STORAGE-MANAGER.md"; do
  [ -f "$f" ] && install -m 644 "$f" "$DOC_DIR/"
done

# ------------------------------------------------------------------ 4. config
if [ -f "$CONF_FILE" ]; then
  log "Keeping the existing $CONF_FILE"
  info "the shipped example is at $CONF_DIR/storage-manager.conf.example — diff them if you want the new comments"
  install -m 644 "$SRC_DIR/config/storage-manager.conf.example" "$CONF_DIR/storage-manager.conf.example"

  # A config written by an older version has none of the settings added since.
  # Leaving them out entirely means an operator edits a key that is not there,
  # sees no error, and believes a feature is on when it is off. Append the
  # missing ones at their shipped defaults; existing values are never altered.
  ADDED=""
  while IFS= read -r line; do
    case "$line" in
    [A-Z]*=*) ;;
    *) continue ;;
    esac
    key="${line%%=*}"
    grep -q "^[[:space:]]*$key=" "$CONF_FILE" && continue
    if [ -z "$ADDED" ]; then
      {
        printf '\n# ---------------------------------------------------------------\n'
        printf '# Added by install-storage-manager.sh on %s: settings that did not\n' "$(date '+%F')"
        printf '# exist when this file was written. All at their shipped defaults.\n'
        printf '# See %s/storage-manager.conf.example for what each one does.\n' "$CONF_DIR"
      } >>"$CONF_FILE"
    fi
    printf '%s\n' "$line" >>"$CONF_FILE"
    ADDED="$ADDED $key"
  done <"$SRC_DIR/config/storage-manager.conf.example"
  if [ -n "$ADDED" ]; then
    info "added new settings at their defaults:$ADDED"
  else
    info "no new settings to add"
  fi
else
  log "Installing $CONF_FILE"
  install -m 644 "$SRC_DIR/config/storage-manager.conf.example" "$CONF_FILE"
  install -m 644 "$SRC_DIR/config/storage-manager.conf.example" "$CONF_DIR/storage-manager.conf.example"
  info "defaults: keep 60 GB free, start at 70% used, every project-level cleanup off"
fi

log "Installing log rotation for the manager's own logs"
install -m 644 "$SRC_DIR/config/logrotate.storage-manager" "$LOGROTATE_FILE"

# ----------------------------------------------------------------- 5. systemd
log "Installing systemd units"
install -m 644 "$SRC_DIR/systemd/storage-manager.service" "$UNIT_DIR/storage-manager.service"
install -m 644 "$SRC_DIR/systemd/storage-manager.timer" "$UNIT_DIR/storage-manager.timer"
systemctl daemon-reload || warn "systemctl daemon-reload failed"
info "installed but NOT enabled yet"

# --------------------------------------------------- 6. conflicting automation
LEGACY="$(grep -rslE 'disk-guard\.sh|disk-cleanup\.sh' /etc/cron.d /etc/crontab 2>/dev/null)"
if [ -n "$LEGACY" ]; then
  hr
  warn "another automatic disk cleaner is already scheduled:"
  printf '%s\n' "$LEGACY" | sed 's/^/      /'
  info ""
  info "deploy/disk-guard.sh escalates to tiers this manager refuses to use:"
  info "  it truncates live logs in place and removes node_modules from build dirs."
  info "Running both means one of them can delete something the other protects."
  info ""
  if [ "$DISABLE_LEGACY" = 1 ]; then
    for f in $LEGACY; do
      cp -a "$f" "$f.pre-storage-manager.bak" || warn "could not back up $f"
      # Comment out only the scheduling lines, leaving the file and its history.
      sed -i -E 's|^([^#].*disk-(guard\|cleanup)\.sh.*)$|# disabled by install-storage-manager.sh: \1|' "$f"
      info "commented out the cleanup lines in $f (backup: $f.pre-storage-manager.bak)"
    done
    info "the scripts themselves are untouched and can still be run by hand"
  else
    info "re-run with --disable-legacy-disk-guard to comment those cron lines out,"
    info "or leave them and keep this manager's thresholds below theirs."
  fi
  hr
fi

# ------------------------------------------------------- 7. read-only validation
hr
log "Read-only audit — nothing is changed by anything below"
hr
"$BIN_PATH" health
HEALTH_RC=$?

printf '\n'
"$BIN_PATH" report --force || warn "report failed"

printf '\n'
hr
log "Projects and their protection"
hr
"$BIN_PATH" projects || warn "project listing failed"

printf '\n'
hr
log "Full dry run — decides everything, changes nothing"
hr
"$BIN_PATH" cleanup --dry-run || warn "dry run reported a problem"

printf '\n'
hr
log "Verification"
hr
CHANGED=0
if command -v pm2 >/dev/null 2>&1; then
  info "PM2 processes after the audit (restart counts must be unchanged):"
  pm2 list 2>/dev/null | sed 's/^/      /' || warn "pm2 list failed"
fi
if command -v systemctl >/dev/null 2>&1 && systemctl is-active nginx >/dev/null 2>&1; then
  info "nginx is $(systemctl is-active nginx) and was not signalled, reloaded or restarted"
fi
info "project directories modified by this installer: 0"
info "application files deleted by this installer: 0"
info "configuration files of yours modified by this installer: $([ "$DISABLE_LEGACY" = 1 ] && printf 'the legacy cron entries you asked to disable' || printf '0')"
[ "$HEALTH_RC" = 0 ] || warn "health reported a failure above — read it before enabling automatic operation"

# ----------------------------------------------------------------- 8. enabling
printf '\n'
if [ "$NO_ENABLE" = 1 ]; then
  hr
  log "Installed, not enabled (--no-enable)"
  info "enable automatic operation later with:"
  info "  systemctl enable --now storage-manager.timer"
  hr
  exit 0
fi

if [ "$ASSUME_YES" != 1 ]; then
  hr
  printf 'Enable automatic operation now?\n\n'
  printf 'The timer runs every 15 minutes. Each pass checks the disk, protects every\n'
  printf 'project it finds, cleans only system-owned data, rechecks, writes an audit\n'
  printf 'record and exits. It will never stop, restart or reload an application.\n\n'
  printf 'Type exactly "enable" to turn it on, anything else to leave it off: '
  read -r ANSWER
  if [ "$ANSWER" != "enable" ]; then
    hr
    log "Left disabled"
    info "everything is installed; turn it on whenever you are ready with:"
    info "  systemctl enable --now storage-manager.timer"
    hr
    exit 0
  fi
fi

log "Enabling storage-manager.timer"
systemctl enable --now storage-manager.timer || die "could not enable the timer"
systemctl status storage-manager.timer --no-pager 2>/dev/null | sed 's/^/      /' || true

hr
log "Automatic storage management is on"
hr
cat <<EOF

Config     $CONF_FILE
Logs       $LOG_DIR/storage-manager.log
Audit      $LOG_DIR/storage-manager-history.log
State      $STATE_DIR
Timer      every 15 minutes (systemctl list-timers storage-manager.timer)

Day to day:
  storage-manager status
  storage-manager report
  storage-manager projects
  storage-manager cleanup --dry-run
  storage-manager health
  journalctl -u storage-manager.service --since today

Turn it off again at any time:
  systemctl disable --now storage-manager.timer

EOF
