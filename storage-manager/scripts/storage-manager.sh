#!/usr/bin/env bash
# storage-manager — automatic, zero-disturbance disk management for an Ubuntu
# VPS running many Node/Next.js sites behind nginx under PM2.
#
#   storage-manager status              one-screen disk + level
#   storage-manager report              full read-only audit
#   storage-manager projects            discovered projects and their state
#   storage-manager cleanup --dry-run   decide everything, change nothing
#   storage-manager cleanup --safe      system-level safe cleanup only
#   storage-manager cleanup --auto      threshold driven (what the timer runs)
#   storage-manager cleanup --full      every enabled category, ignore thresholds
#   storage-manager large-files         biggest files, never deleted automatically
#   storage-manager investigate         where the space actually is, and what is
#                                       still writing (read-only forensics)
#   storage-manager open-deleted        deleted-but-still-open files
#   storage-manager health              self check
#   storage-manager explain             why it would do what it would do
#   storage-manager config              effective configuration
#   storage-manager logs                tail the manager's own log
#   storage-manager version
#
# The one rule this program is built around: it never touches a running
# application. It does not stop, restart, reload or signal PM2, nginx or node;
# it does not build, install or deploy; it does not delete application data.
# When anything is uncertain it skips the work and records why.
#
# `set -e` is deliberately absent: one failing cleanup step must never abort the
# run or fall through into a more destructive path.
set -uo pipefail

SM_VERSION="1.0.0"
SM_PROGRAM="storage-manager"

# ---------------------------------------------------------------- defaults
# Every value here can be overridden in the config file. Nothing is hardcoded
# at the point of use.

SM_CONF="${SM_CONF:-/etc/storage-manager/storage-manager.conf}"

# Thresholds, in percent used of DISK_PATH.
MAX_USAGE_PERCENT=70       # the ceiling we try to stay under
WARNING_USAGE_PERCENT=70   # preventive cleanup starts here
CLEANUP_USAGE_PERCENT=80   # + temp files
AGGRESSIVE_USAGE_PERCENT=85
CRITICAL_USAGE_PERCENT=90
EMERGENCY_USAGE_PERCENT=95
TARGET_FREE_GB=60
DISK_PATH=/

# Retention.
LOG_RETENTION_DAYS=14
TEMP_RETENTION_DAYS=7
JOURNAL_MAX_SIZE=300M
JOURNAL_MAX_AGE=14d

# Project discovery.
PROJECT_DISCOVERY=true
DISCOVERY_ROOTS="/srv/sites /var/www /opt /home /root"
DISCOVERY_MAX_DEPTH=3
# Fleet registry written by deploy/server-setup.sh; authoritative when present.
SITE_REGISTRY=/etc/ap-sites/sites.d
SITE_ROOT=/srv/sites
# Space separated project directories or slugs that must never be touched even
# when an opt-in cleanup is enabled.
CRITICAL_PROJECTS=""

# Safe, system-level cleanup categories.
ENABLE_APT_CLEANUP=true
ENABLE_JOURNAL_CLEANUP=true
ENABLE_PM2_LOG_ROTATION=true
ENABLE_NGINX_LOG_ROTATION=true
ENABLE_SYSTEM_LOG_CLEANUP=true
ENABLE_TEMP_CLEANUP=true
ENABLE_PKG_CACHE_CLEANUP=true
# Invoke the system logrotate (which reopens nginx logs via its own postrotate,
# never a restart) once the disk is under real pressure.
RUN_LOGROTATE_ON_PRESSURE=true
# apt autoremove uninstalls packages. Off, and only ever run by an admin.
ENABLE_APT_AUTOREMOVE=false
# Writes pm2-logrotate module settings. Does not restart applications, but it
# does change PM2 state, so it stays opt-in and never runs from the timer.
PM2_LOGROTATE_AUTOCONFIGURE=false

# A live Next.js site writes its rendered pages and optimised images into
# .next/cache and never removes them. On a site with millions of crawlable URLs
# that grows without a ceiling: this fleet lost a 193 GB disk to one project's
# cache reaching 156 GB, while every other category reported nothing to reclaim.
#
# Enabling this puts a ceiling on it. What gets removed is only ever the
# regeneratable subdirectories of a cache that is already over the cap — Next.js
# rebuilds each entry on the next request that needs it, so a running site keeps
# serving. .next itself, the standalone bundle and everything else are untouched.
#
# It defaults to off because it is the one action here that reaches into a
# directory belonging to an ONLINE project. Turn it on if a runtime cache is what
# fills your disk; deploy/disk-cleanup.sh already does the same thing for sites
# under /srv/sites, and this covers the ones outside that layout too.
ALLOW_ONLINE_CACHE_TRIM=false
ISR_CACHE_MAX_MB=4096
# The same problem in its other location, and the one that actually filled the
# disk: rendered pages accumulating under .next/server/app as .html/.rsc/.meta.
# A build without prerender caps writes the full city x area x keyword
# cross-product there, and ISR keeps adding to it at runtime. One project reached
# 156 GB this way, 71 GB of it under a single city.
#
# Over this cap, the oldest generated page files are removed until the directory
# is back under it. Only those three extensions are ever touched: the compiled
# .js, the manifests and everything else the server loads stay. With
# dynamicParams a missing page is re-rendered on the next request.
PRERENDER_CACHE_MAX_MB=8192
# Ceiling on how many page files one pass will consider, so a run stays cheap on
# a project with millions of them. Passes converge over successive runs.
PRERENDER_TRIM_BATCH=500000

# Project-level cleanup. All default to false. Enabling one does not make it
# unconditional: every guard in sm_project_cleanup_allowed still has to pass.
ALLOW_NEXT_CACHE_CLEANUP=false
ALLOW_NEXT_BUILD_CLEANUP=false
ALLOW_NODE_MODULES_CLEANUP=false
ALLOW_STALE_RELEASE_CLEANUP=false
KEEP_RELEASES=2

# Paths.
STATE_DIR=/var/lib/storage-manager
LOG_DIR=/var/log/storage-manager
LOCK_FILE=/var/lock/storage-manager.lock
# Per-project deployment locks are looked for as <DEPLOY_LOCK_DIR>/<slug>.deploy.lock
DEPLOY_LOCK_DIR=/var/lock
# Locks that mean "a deployment is in progress somewhere" for the whole fleet.
GLOBAL_DEPLOY_LOCKS="/var/lock/ap-sites-build.lock"
PM2_LOG_DIRS="/root/.pm2/logs /home/*/.pm2/logs /srv/sites/*/shared/logs"
NGINX_LOG_DIR=/var/log/nginx
SYSTEM_LOG_DIR=/var/log
TEMP_DIRS="/tmp /var/tmp"
PKG_CACHE_PATHS="/root/.npm/_cacache /home/*/.npm/_cacache"
# Never deleted, never modified, not even when nested inside a cleanup target.
PROTECTED_PATHS="/etc /usr /bin /sbin /lib /lib64 /boot /root/.ssh /var/lib/postgresql /var/lib/mysql /var/backups /etc/nginx /etc/letsencrypt /etc/ssl"

# Timings. A full project analysis every 15 minutes would be pure waste.
PROJECT_SCAN_INTERVAL_MIN=360
LARGE_FILE_SCAN_INTERVAL_MIN=1440
LARGE_FILE_MIN_MB=500
LARGE_FILE_SCAN_ROOTS="/"
# Seconds `investigate` samples for, to measure whether the disk is still
# filling and which process is writing.
INVESTIGATE_SAMPLE_SEC=10
# A recently touched build/release tree means a deploy may still be running.
DEPLOY_RECENT_MIN=10
NICE_LEVEL=19

# The manager's own logs must not become the next disk problem.
LOG_MAX_SIZE_MB=20
LOG_KEEP=5

# Optional admin hook, called as: ALERT_COMMAND "<subject>" "<body file>"
ALERT_COMMAND=""

# ------------------------------------------------------------ runtime state
SM_DRY_RUN=1          # fail safe: every entry point sets this explicitly
SM_MODE="auto"
SM_QUIET=0
SM_RUN_ID="$(date +%Y%m%d%H%M%S)-$$"
SM_STARTED_AT="$(date '+%F %T')"
SM_RECLAIMED_MB=0
SM_ACTION_COUNT=0
SM_SKIPPED_COUNT=0
SM_PROTECTED_COUNT=0
SM_FAILED_COUNT=0
SM_LSOF_WARNED=0
SM_LOG_FILE=""
SM_HISTORY_FILE=""
SM_SELF_PATHS=""
SM_CAT_FREE_BEFORE=0
SM_CAT_RECLAIMED_BEFORE=0
SM_OPTIN_MB=0
SM_TRIM_MB=0
SM_VERBOSE="${SM_VERBOSE:-0}"
declare -a SM_ACTIONS=()
declare -a SM_CATEGORY_NAMES=()
declare -a SM_CATEGORY_MB=()
declare -a SM_PROJECT_ROWS=()

PROTECTED_NAME_PATTERNS=(
  '.git' '.gitignore' '.env' '.env.*' 'package.json' 'package-lock.json'
  'yarn.lock' 'pnpm-lock.yaml' 'npm-shrinkwrap.json' 'ecosystem.config.js'
  'ecosystem.config.cjs' 'next.config.*' 'public' 'uploads' 'storage'
  'database' 'db' 'backups' 'backup' '*.pem' '*.key' '*.crt' '*.sql'
  '*.sqlite' '*.sqlite3' '*.dump' 'id_rsa' 'id_ed25519' 'authorized_keys'
)

# =========================================================================
# configuration
# =========================================================================

# Every key the config file may set. Anything else is reported and ignored,
# which stops a typo from silently doing nothing and stops a config from
# reaching into the program's own variables.
SM_CONF_KEYS="DISK_PATH MAX_USAGE_PERCENT WARNING_USAGE_PERCENT
CLEANUP_USAGE_PERCENT AGGRESSIVE_USAGE_PERCENT CRITICAL_USAGE_PERCENT
EMERGENCY_USAGE_PERCENT TARGET_FREE_GB LOG_RETENTION_DAYS TEMP_RETENTION_DAYS
JOURNAL_MAX_SIZE JOURNAL_MAX_AGE PROJECT_DISCOVERY DISCOVERY_ROOTS
DISCOVERY_MAX_DEPTH SITE_REGISTRY SITE_ROOT CRITICAL_PROJECTS
ENABLE_APT_CLEANUP ENABLE_JOURNAL_CLEANUP ENABLE_PM2_LOG_ROTATION
ENABLE_NGINX_LOG_ROTATION ENABLE_SYSTEM_LOG_CLEANUP ENABLE_TEMP_CLEANUP
ENABLE_PKG_CACHE_CLEANUP RUN_LOGROTATE_ON_PRESSURE ENABLE_APT_AUTOREMOVE
PM2_LOGROTATE_AUTOCONFIGURE ALLOW_ONLINE_CACHE_TRIM ISR_CACHE_MAX_MB
PRERENDER_CACHE_MAX_MB PRERENDER_TRIM_BATCH
ALLOW_NEXT_CACHE_CLEANUP ALLOW_NEXT_BUILD_CLEANUP
ALLOW_NODE_MODULES_CLEANUP ALLOW_STALE_RELEASE_CLEANUP KEEP_RELEASES
STATE_DIR LOG_DIR LOCK_FILE DEPLOY_LOCK_DIR GLOBAL_DEPLOY_LOCKS PM2_LOG_DIRS
NGINX_LOG_DIR SYSTEM_LOG_DIR TEMP_DIRS PKG_CACHE_PATHS PROTECTED_PATHS
PROJECT_SCAN_INTERVAL_MIN LARGE_FILE_SCAN_INTERVAL_MIN LARGE_FILE_MIN_MB
LARGE_FILE_SCAN_ROOTS INVESTIGATE_SAMPLE_SEC DEPLOY_RECENT_MIN NICE_LEVEL
LOG_MAX_SIZE_MB LOG_KEEP ALERT_COMMAND"

sm_conf_key_known() {
  local key="$1" known
  for known in $SM_CONF_KEYS; do
    [ "$key" = "$known" ] && return 0
  done
  return 1
}

# The config file is parsed, never sourced. Nothing in it can execute, and a
# value may contain spaces (as several path lists do) without being quoted.
sm_load_config() {
  if [ -f "$SM_CONF" ]; then
    local line key value lineno=0
    while IFS= read -r line || [ -n "$line" ]; do
      lineno=$((lineno + 1))
      line="${line#"${line%%[![:space:]]*}"}"
      line="${line%"${line##*[![:space:]]}"}"
      case "$line" in '' | '#'*) continue ;; esac
      case "$line" in
      [A-Za-z_]*=*) ;;
      *)
        printf 'ERROR: %s line %s: only KEY=VALUE assignments are allowed, got: %s\n' \
          "$SM_CONF" "$lineno" "$line" >&2
        return 1
        ;;
      esac
      key="${line%%=*}"
      value="${line#*=}"
      case "$key" in *[!A-Za-z0-9_]*)
        printf 'ERROR: %s line %s: %s is not a valid setting name\n' "$SM_CONF" "$lineno" "$key" >&2
        return 1
        ;;
      esac
      # Optional surrounding quotes are accepted and stripped.
      case "$value" in
      \"*\") value="${value#\"}" && value="${value%\"}" ;;
      \'*\') value="${value#\'}" && value="${value%\'}" ;;
      esac
      if ! sm_conf_key_known "$key"; then
        printf 'WARN: %s line %s: unknown setting %s (ignored)\n' "$SM_CONF" "$lineno" "$key" >&2
        continue
      fi
      printf -v "$key" '%s' "$value"
    done <"$SM_CONF"
  fi
  sm_validate_config
}

sm_is_true() {
  case "${1:-}" in
  true | TRUE | yes | YES | 1 | on | ON) return 0 ;;
  *) return 1 ;;
  esac
}

sm_is_int() { case "${1:-}" in '' | *[!0-9]*) return 1 ;; *) return 0 ;; esac; }

sm_validate_config() {
  local ok=0 name value
  for name in MAX_USAGE_PERCENT WARNING_USAGE_PERCENT CLEANUP_USAGE_PERCENT \
    AGGRESSIVE_USAGE_PERCENT CRITICAL_USAGE_PERCENT EMERGENCY_USAGE_PERCENT \
    TARGET_FREE_GB LOG_RETENTION_DAYS TEMP_RETENTION_DAYS DISCOVERY_MAX_DEPTH \
    KEEP_RELEASES PROJECT_SCAN_INTERVAL_MIN LARGE_FILE_SCAN_INTERVAL_MIN \
    LARGE_FILE_MIN_MB DEPLOY_RECENT_MIN NICE_LEVEL LOG_MAX_SIZE_MB LOG_KEEP \
    INVESTIGATE_SAMPLE_SEC ISR_CACHE_MAX_MB PRERENDER_CACHE_MAX_MB \
    PRERENDER_TRIM_BATCH; do
    value="${!name}"
    if ! sm_is_int "$value"; then
      printf 'ERROR: %s must be a whole number, got "%s"\n' "$name" "$value" >&2
      ok=1
    fi
  done
  [ "$ok" = 0 ] || return 1

  if [ "$WARNING_USAGE_PERCENT" -gt "$CLEANUP_USAGE_PERCENT" ] ||
    [ "$CLEANUP_USAGE_PERCENT" -gt "$AGGRESSIVE_USAGE_PERCENT" ] ||
    [ "$AGGRESSIVE_USAGE_PERCENT" -gt "$CRITICAL_USAGE_PERCENT" ] ||
    [ "$CRITICAL_USAGE_PERCENT" -gt "$EMERGENCY_USAGE_PERCENT" ]; then
    printf 'ERROR: thresholds must ascend: warning <= cleanup <= aggressive <= critical <= emergency\n' >&2
    return 1
  fi
  [ "$EMERGENCY_USAGE_PERCENT" -le 100 ] || {
    printf 'ERROR: EMERGENCY_USAGE_PERCENT must be <= 100\n' >&2
    return 1
  }
  [ "$KEEP_RELEASES" -ge 1 ] || {
    printf 'ERROR: KEEP_RELEASES must be at least 1\n' >&2
    return 1
  }

  # A discovery root of "/" would make every system directory a cleanup
  # candidate. Refuse it outright rather than relying on later guards.
  local root
  for root in $DISCOVERY_ROOTS; do
    case "$root" in
    / | /etc | /usr | /bin | /sbin | /lib | /lib64 | /boot | /var | /var/lib | /proc | /sys | /dev)
      printf 'ERROR: DISCOVERY_ROOTS may not contain %s\n' "$root" >&2
      return 1
      ;;
    /*) ;;
    *)
      printf 'ERROR: DISCOVERY_ROOTS entries must be absolute paths, got "%s"\n' "$root" >&2
      return 1
      ;;
    esac
  done
  return 0
}

sm_effective_config() {
  local name
  for name in $SM_CONF_KEYS; do
    printf '%s=%s\n' "$name" "${!name}"
  done
}

# =========================================================================
# output, logging, audit
# =========================================================================

sm_say() { printf '%s\n' "$*"; }
sm_hr() { printf '%s\n' '--------------------------------------------------------'; }
sm_rule() { printf '%s\n' '========================================================'; }

sm_log_init() {
  SM_LOG_FILE="$LOG_DIR/$SM_PROGRAM.log"
  SM_HISTORY_FILE="$LOG_DIR/$SM_PROGRAM-history.log"
  mkdir -p "$LOG_DIR" 2>/dev/null || true
  if ! { [ -d "$LOG_DIR" ] && [ -w "$LOG_DIR" ]; }; then
    SM_LOG_FILE=""
    SM_HISTORY_FILE=""
    return 0
  fi
  sm_rotate_own_log "$LOG_DIR/$SM_PROGRAM.log"
  sm_rotate_own_log "$LOG_DIR/$SM_PROGRAM-history.log"
}

# Size based self-rotation. logrotate is installed too, but the manager cannot
# depend on it: its own log must be bounded even if logrotate is absent.
sm_rotate_own_log() {
  local f="$1" mb i
  [ -f "$f" ] || return 0
  mb="$(sm_du_mb "$f")"
  [ "$mb" -ge "$LOG_MAX_SIZE_MB" ] 2>/dev/null || return 0
  for ((i = LOG_KEEP - 1; i >= 1; i--)); do
    [ -f "$f.$i" ] && mv -f "$f.$i" "$f.$((i + 1))" 2>/dev/null
  done
  mv -f "$f" "$f.1" 2>/dev/null
  : >"$f" 2>/dev/null
}

# sm_log <LEVEL> <message>
sm_log() {
  local level="$1"
  shift
  local line
  line="$(printf '%s [%s] [%s] %s' "$(date '+%F %T')" "$level" "$SM_RUN_ID" "$*")"
  [ -n "$SM_LOG_FILE" ] && printf '%s\n' "$line" >>"$SM_LOG_FILE" 2>/dev/null
  case "$level" in
  # Warnings and errors go to stderr so systemd records them even when the log
  # directory is unwritable. INFO stays in the log file: it must never break up
  # a report on stdout.
  WARN | ERROR | CRITICAL) printf '%s\n' "$line" >&2 ;;
  *) [ "$SM_VERBOSE" = 1 ] && printf '%s\n' "$line" ;;
  esac
  return 0
}

# sm_action <STATUS> <category> <size_mb> <target> <reason>
# STATUS is SAFE | SKIPPED | PROTECTED | FAILED | NOTE.
# Every decision, taken or refused, goes through here. Dry-run and real runs
# emit identical records, which is what makes --dry-run trustworthy.
sm_action() {
  local status="$1" category="$2" mb="$3" target="$4" reason="$5"
  local size="-"
  [ "$mb" != "-" ] && [ "$mb" != "0" ] && size="$(sm_mb_human "$mb")"
  SM_ACTIONS+=("$(printf '%-10s %-16s %10s  %s|%s' "[$status]" "$category" "$size" "$target" "$reason")")
  case "$status" in
  SAFE) SM_ACTION_COUNT=$((SM_ACTION_COUNT + 1)) ;;
  SKIPPED) SM_SKIPPED_COUNT=$((SM_SKIPPED_COUNT + 1)) ;;
  PROTECTED) SM_PROTECTED_COUNT=$((SM_PROTECTED_COUNT + 1)) ;;
  FAILED) SM_FAILED_COUNT=$((SM_FAILED_COUNT + 1)) ;;
  esac
  [ -n "$SM_LOG_FILE" ] &&
    printf '%s [%s] [%s] %s %s mb=%s reason=%s\n' \
      "$(date '+%F %T')" "$status" "$SM_RUN_ID" "$category" "$target" "$mb" "$reason" \
      >>"$SM_LOG_FILE" 2>/dev/null
  if [ "$SM_QUIET" = 0 ]; then
    printf '%-11s %-16s %10s  %s\n' "[$status]" "$category" "$size" "$target"
    printf '%-11s %-16s %10s  reason: %s\n' '' '' '' "$reason"
  fi
}

sm_alert() {
  local subject="$1" body="$2" file
  sm_log CRITICAL "$subject"
  file="$LOG_DIR/CRITICAL-ALERT.txt"
  if [ -n "$SM_LOG_FILE" ]; then
    {
      printf '%s\n%s\n\n' "$SM_STARTED_AT" "$subject"
      printf '%s\n' "$body"
    } >"$file" 2>/dev/null
  fi
  if [ -n "$ALERT_COMMAND" ]; then
    # Admin supplied hook. Failure here must not affect the run.
    "$ALERT_COMMAND" "$subject" "$file" >/dev/null 2>&1 ||
      sm_log WARN "ALERT_COMMAND failed: $ALERT_COMMAND"
  fi
}

# =========================================================================
# small helpers
# =========================================================================

sm_mb_human() {
  awk -v mb="${1:-0}" 'BEGIN {
    if (mb + 0 >= 1024) printf "%.1f GB", mb / 1024; else printf "%d MB", mb + 0
  }'
}

sm_du_mb() {
  local p="${1:-}"
  [ -e "$p" ] || {
    printf '0'
    return 0
  }
  local mb
  mb="$(du -sm --one-file-system -- "$p" 2>/dev/null | cut -f1)"
  sm_is_int "$mb" || mb=0
  printf '%s' "$mb"
}

sm_nice() {
  if command -v ionice >/dev/null 2>&1; then
    nice -n "$NICE_LEVEL" ionice -c3 "$@"
  else
    nice -n "$NICE_LEVEL" "$@"
  fi
}

# Expand a whitespace separated list that may contain globs, dropping entries
# that match nothing, and canonicalise what is left.
#
# Canonicalising matters: on a VPS with a data volume, /srv/sites is often a
# symlink. The deletion gate requires a candidate to resolve to itself, so
# scanning through the symlink would make every file below it unremovable —
# safe, but silently useless. Resolving the root instead keeps the strict check
# meaningful for symlinks found *below* it, which is where the risk actually is.
sm_expand() {
  local pattern match real
  local -a matches
  for pattern in $1; do
    # Unquoted on purpose: this is where the glob expands.
    # shellcheck disable=SC2206
    matches=($pattern)
    for match in "${matches[@]}"; do
      [ -e "$match" ] || continue
      real="$(sm_realpath "$match")"
      printf '%s\n' "${real:-$match}"
    done
  done | awk '!seen[$0]++'
}

sm_realpath() { realpath -q -- "${1:-}" 2>/dev/null; }

# True when $1 equals $2 or lies below it.
sm_path_within() {
  local child="${1:-}" parent="${2:-}"
  [ -n "$child" ] && [ -n "$parent" ] || return 1
  [ "$child" = "$parent" ] && return 0
  case "$child" in "${parent%/}"/*) return 0 ;; esac
  return 1
}

sm_is_mount_point() {
  local p="$1" parent
  parent="$(dirname -- "$p")"
  [ "$p" = "/" ] && return 0
  local d1 d2
  d1="$(stat -c %d -- "$p" 2>/dev/null)" || return 1
  d2="$(stat -c %d -- "$parent" 2>/dev/null)" || return 1
  [ "$d1" != "$d2" ]
}

sm_name_is_protected() {
  local base="$1" pattern
  for pattern in "${PROTECTED_NAME_PATTERNS[@]}"; do
    # shellcheck disable=SC2254
    case "$base" in $pattern) return 0 ;; esac
  done
  return 1
}

sm_file_is_open() {
  local p="$1"
  if ! command -v lsof >/dev/null 2>&1; then
    if [ "$SM_LSOF_WARNED" = 0 ]; then
      sm_log WARN "lsof is not installed — open-file checks are unavailable, relying on age rules only"
      SM_LSOF_WARNED=1
    fi
    return 1
  fi
  [ -n "$(lsof -t -- "$p" 2>/dev/null)" ]
}

sm_self_paths() {
  [ -n "$SM_SELF_PATHS" ] && {
    printf '%s' "$SM_SELF_PATHS"
    return 0
  }
  local script_dir top out=""
  script_dir="$(sm_realpath "$(dirname -- "${BASH_SOURCE[0]}")")"
  out="$script_dir"
  # The repository this program is developed in is not a cleanup target either.
  if command -v git >/dev/null 2>&1; then
    top="$(git -c safe.directory='*' -C "$script_dir" rev-parse --show-toplevel 2>/dev/null)"
    [ -n "$top" ] && out="$out $top"
  fi
  out="$out /opt/ap-deploy $STATE_DIR $LOG_DIR"
  SM_SELF_PATHS="$out"
  printf '%s' "$out"
}

# =========================================================================
# the deletion gate
# =========================================================================
#
# Nothing in this program removes a path except through sm_safe_remove, and
# nothing gets past it without an explicit allowlist plus every check below.

# sm_validate_target <path> <expect: file|dir|any> <allowlist...>
# Prints a refusal reason and returns non-zero when the path must not be touched.
sm_validate_target() {
  local path="$1" expect="$2"
  shift 2
  local -a allow=("$@")

  [ -n "$path" ] || {
    printf 'empty path'
    return 1
  }
  case "$path" in
  /*) ;;
  *)
    printf 'not an absolute path'
    return 1
    ;;
  esac
  case "$path" in
  *'*'* | *'?'* | *'['*)
    printf 'unexpanded glob in path'
    return 1
    ;;
  esac
  [ "${#allow[@]}" -gt 0 ] || {
    printf 'no allowlist supplied'
    return 1
  }
  [ -e "$path" ] || {
    printf 'path no longer exists'
    return 1
  }
  # A symlink is never followed and never deleted: the target may be anything.
  [ -L "$path" ] && {
    printf 'symlink'
    return 1
  }

  local rp
  rp="$(sm_realpath "$path")" || true
  [ -n "$rp" ] || {
    printf 'path does not resolve'
    return 1
  }
  [ "$rp" = "$path" ] || {
    printf 'path resolves elsewhere (%s)' "$rp"
    return 1
  }
  [ "$rp" = "/" ] && {
    printf 'refusing the filesystem root'
    return 1
  }
  # Depth guard: /var, /home and friends have one component.
  local depth
  depth="$(printf '%s' "${rp#/}" | awk -F/ '{print NF}')"
  [ "${depth:-0}" -ge 2 ] || {
    printf 'top level directory'
    return 1
  }
  sm_is_mount_point "$rp" && {
    printf 'mount point'
    return 1
  }

  case "$expect" in
  file) [ -f "$rp" ] || {
    printf 'not a regular file'
    return 1
  } ;;
  dir) [ -d "$rp" ] || {
    printf 'not a directory'
    return 1
  } ;;
  esac

  local p
  for p in $PROTECTED_PATHS; do
    if sm_path_within "$rp" "$p"; then
      printf 'inside protected path %s' "$p"
      return 1
    fi
  done
  for p in $(sm_self_paths); do
    if sm_path_within "$rp" "$p" || sm_path_within "$p" "$rp"; then
      printf 'belongs to the storage manager itself (%s)' "$p"
      return 1
    fi
  done
  if sm_name_is_protected "$(basename -- "$rp")"; then
    printf 'protected name'
    return 1
  fi

  local within=1 root
  for root in "${allow[@]}"; do
    [ -n "$root" ] || continue
    local rroot
    rroot="$(sm_realpath "$root")" || continue
    [ -n "$rroot" ] || continue
    if sm_path_within "$rp" "$rroot" && [ "$rp" != "$rroot" ]; then
      within=0
      break
    fi
  done
  [ "$within" = 0 ] || {
    printf 'outside every allowed directory'
    return 1
  }
  return 0
}

# sm_safe_remove <path> <category> <reason> -- <allowlist...>
sm_safe_remove() {
  local path="$1" category="$2" reason="$3" expect="${4:-any}"
  shift 4
  local -a allow=("$@")
  local refusal mb

  if ! refusal="$(sm_validate_target "$path" "$expect" "${allow[@]}")"; then
    sm_action SKIPPED "$category" - "$path" "refused by safety gate: $refusal"
    return 1
  fi

  mb="$(sm_du_mb "$path")"
  if [ "$SM_DRY_RUN" = 1 ]; then
    sm_action SAFE "$category" "$mb" "$path" "would remove: $reason"
    return 0
  fi
  if [ -d "$path" ]; then
    rm -rf --one-file-system -- "$path" 2>/dev/null
  else
    rm -f -- "$path" 2>/dev/null
  fi
  if [ -e "$path" ]; then
    sm_action FAILED "$category" "$mb" "$path" "removal failed: $reason"
    return 1
  fi
  SM_RECLAIMED_MB=$((SM_RECLAIMED_MB + mb))
  sm_action SAFE "$category" "$mb" "$path" "removed: $reason"
  return 0
}

# sm_run <category> <reason> <command...>
sm_run() {
  local category="$1" reason="$2"
  shift 2
  if [ "$SM_DRY_RUN" = 1 ]; then
    sm_action SAFE "$category" - "$*" "would run: $reason"
    return 0
  fi
  if ! command -v "$1" >/dev/null 2>&1; then
    sm_action SKIPPED "$category" - "$1" "command not installed"
    return 1
  fi
  local out
  if out="$("$@" 2>&1)"; then
    sm_action SAFE "$category" - "$*" "ran: $reason"
    [ -n "$out" ] && [ -n "$SM_LOG_FILE" ] &&
      printf '%s\n' "$out" | sed "s/^/    /" >>"$SM_LOG_FILE" 2>/dev/null
    return 0
  fi
  sm_action FAILED "$category" - "$*" "command failed: ${out:0:200}"
  return 1
}

sm_need_root() {
  local category="$1"
  [ "$(id -u)" = 0 ] && return 0
  # A dry run executes nothing, so it can still show what a root run would do.
  [ "$SM_DRY_RUN" = 1 ] && return 0
  sm_action SKIPPED "$category" - "-" "needs root privileges (running as uid $(id -u))"
  return 1
}

# =========================================================================
# disk state and the decision engine
# =========================================================================

SM_DISK_SIZE_MB=0
SM_DISK_USED_MB=0
SM_DISK_FREE_MB=0
SM_DISK_PCT=0

sm_disk_read() {
  local line
  line="$(df -Pm "$DISK_PATH" 2>/dev/null |
    awk 'NR==2 {gsub(/%/,"",$(NF-1)); print $(NF-4), $(NF-3), $(NF-2), $(NF-1)+0}')"
  [ -n "$line" ] || {
    sm_log ERROR "could not read disk usage for $DISK_PATH"
    return 1
  }
  read -r SM_DISK_SIZE_MB SM_DISK_USED_MB SM_DISK_FREE_MB SM_DISK_PCT <<<"$line"
  sm_is_int "$SM_DISK_PCT" || {
    sm_log ERROR "unparseable df output for $DISK_PATH: $line"
    return 1
  }
  return 0
}

sm_free_gb() { printf '%s' "$((SM_DISK_FREE_MB / 1024))"; }

sm_level() {
  local pct="$SM_DISK_PCT"
  if [ "$pct" -ge "$EMERGENCY_USAGE_PERCENT" ]; then
    printf '5'
  elif [ "$pct" -ge "$CRITICAL_USAGE_PERCENT" ]; then
    printf '4'
  elif [ "$pct" -ge "$AGGRESSIVE_USAGE_PERCENT" ]; then
    printf '3'
  elif [ "$pct" -ge "$CLEANUP_USAGE_PERCENT" ]; then
    printf '2'
  elif [ "$pct" -ge "$WARNING_USAGE_PERCENT" ]; then
    printf '1'
  elif [ "$(sm_free_gb)" -lt "$TARGET_FREE_GB" ]; then
    # Usage is fine but the absolute free-space target is not met.
    printf '1'
  else
    printf '0'
  fi
}

sm_level_name() {
  case "$1" in
  0) printf 'NORMAL' ;;
  1) printf 'PREVENTIVE' ;;
  2) printf 'SAFE-CLEANUP' ;;
  3) printf 'AGGRESSIVE-SAFE' ;;
  4) printf 'CRITICAL' ;;
  5) printf 'EMERGENCY' ;;
  *) printf 'UNKNOWN' ;;
  esac
}

sm_status_word() {
  case "$1" in
  0) printf 'HEALTHY' ;;
  1) printf 'WATCH' ;;
  2) printf 'CLEANING' ;;
  3) printf 'PRESSURE' ;;
  4) printf 'CRITICAL' ;;
  5) printf 'EMERGENCY' ;;
  esac
}

# True once both the usage ceiling and the free-space target are satisfied.
sm_target_met() {
  sm_disk_read || return 1
  [ "$SM_DISK_PCT" -lt "$MAX_USAGE_PERCENT" ] &&
    [ "$(sm_free_gb)" -ge "$TARGET_FREE_GB" ]
}

# Categories for a level. 4 and 5 are deliberately *narrower* than 3: under
# real pressure the manager does less, not more, because that is when a wrong
# deletion is most likely to take a site down.
sm_categories_for_level() {
  local level="$1"
  case "$level" in
  0) : ;;
  1) printf 'apt journal pm2_logs nginx_logs system_logs isr_cache\n' ;;
  2) printf 'apt journal pm2_logs nginx_logs system_logs isr_cache temp\n' ;;
  3) printf 'apt journal pm2_logs nginx_logs system_logs isr_cache temp pkg_caches logrotate project_optin\n' ;;
  4 | 5) printf 'apt journal pm2_logs nginx_logs system_logs temp pkg_caches logrotate\n' ;;
  esac
}

# =========================================================================
# PM2
# =========================================================================

SM_PM2_AVAILABLE=0
SM_PM2_TSV=""
SM_PM2_CLAIMED=" "
declare -A SM_PM2_MATCH=()

sm_pm2_load() {
  SM_PM2_TSV=""
  SM_PM2_AVAILABLE=0
  command -v pm2 >/dev/null 2>&1 || {
    sm_log INFO "pm2 not found on PATH — every project stays UNKNOWN and protected"
    return 1
  }
  local json
  json="$(timeout 30 pm2 jlist 2>/dev/null)"
  [ -n "$json" ] || {
    sm_log WARN "pm2 is installed but 'pm2 jlist' returned nothing — treating all projects as UNKNOWN"
    return 1
  }
  SM_PM2_TSV="$(printf '%s' "$json" | sm_pm2_parse)" || {
    sm_log WARN "could not parse 'pm2 jlist' output — treating all projects as UNKNOWN"
    return 1
  }
  SM_PM2_AVAILABLE=1
  return 0
}

# name status pid cwd uptime_ms restarts exec_path
sm_pm2_parse() {
  if command -v python3 >/dev/null 2>&1; then
    python3 -c '
import json, sys
raw = sys.stdin.read()
start = raw.find("[")
if start < 0:
    sys.exit(3)
try:
    apps = json.loads(raw[start:])
except Exception:
    sys.exit(3)
if not isinstance(apps, list):
    sys.exit(3)
for app in apps:
    env = app.get("pm2_env") or {}
    row = [
        app.get("name", ""),
        env.get("status", ""),
        app.get("pid", ""),
        env.get("pm_cwd") or env.get("cwd") or "",
        env.get("pm_uptime", ""),
        env.get("restart_time", ""),
        env.get("pm_exec_path") or "",
    ]
    print("\t".join(str(c).replace("\t", " ").replace("\n", " ") for c in row))
'
    return $?
  fi
  if command -v node >/dev/null 2>&1; then
    node -e '
let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  const start = raw.indexOf("[");
  if (start < 0) process.exit(3);
  let apps;
  try { apps = JSON.parse(raw.slice(start)); } catch { process.exit(3); }
  if (!Array.isArray(apps)) process.exit(3);
  for (const app of apps) {
    const env = app.pm2_env || {};
    const row = [app.name, env.status, app.pid, env.pm_cwd || env.cwd || "",
      env.pm_uptime, env.restart_time, env.pm_exec_path || ""];
    console.log(row.map((c) => String(c ?? "").replace(/[\t\n]/g, " ")).join("\t"));
  }
});
'
    return $?
  fi
  return 2
}

# Echoes "name status pid uptime restarts" (tab separated) for the PM2 app that
# belongs to directory $1, or nothing.
#
# mode=strict  only a real match: the app's cwd or executable lives in the tree
# mode=name    the weaker fallback of app name == directory name, used only for
#              a directory nothing claimed and an app nobody claimed
#
# The distinction matters on a server where the same site exists in two places
# (say /root/x and /srv/sites/x): matching on name alone would report both as
# ONLINE, inflate the project counts, and hide which copy is actually served.
sm_pm2_for_dir() {
  local dir="$1" mode="${2:-strict}"
  local rdir name status pid cwd uptime restarts exec_path rcwd rexec
  [ "$SM_PM2_AVAILABLE" = 1 ] || return 1
  rdir="$(sm_realpath "$dir")"
  [ -n "$rdir" ] || return 1
  while IFS=$'\t' read -r name status pid cwd uptime restarts exec_path; do
    [ -n "$name" ] || continue
    if [ "$mode" = "strict" ]; then
      if [ -n "$cwd" ]; then
        rcwd="$(sm_realpath "$cwd")"
        if [ -n "$rcwd" ] && sm_path_within "$rcwd" "$rdir"; then
          printf '%s\t%s\t%s\t%s\t%s\n' "$name" "$status" "$pid" "$uptime" "$restarts"
          return 0
        fi
      fi
      if [ -n "$exec_path" ]; then
        rexec="$(sm_realpath "$exec_path")"
        if [ -n "$rexec" ] && sm_path_within "$rexec" "$rdir"; then
          printf '%s\t%s\t%s\t%s\t%s\n' "$name" "$status" "$pid" "$uptime" "$restarts"
          return 0
        fi
      fi
      continue
    fi
    if [ "$name" = "$(basename -- "$rdir")" ]; then
      case "$SM_PM2_CLAIMED" in *" $name "*) continue ;; esac
      printf '%s\t%s\t%s\t%s\t%s\n' "$name" "$status" "$pid" "$uptime" "$restarts"
      return 0
    fi
  done <<<"$SM_PM2_TSV"
  return 1
}

# Assigns PM2 apps to directories in two passes so that a real cwd match always
# wins over a name coincidence. Fills SM_PM2_MATCH, keyed by directory.
sm_pm2_assign() {
  SM_PM2_MATCH=()
  SM_PM2_CLAIMED=" "
  local dir row name
  for dir in "$@"; do
    [ -n "$dir" ] || continue
    if row="$(sm_pm2_for_dir "$dir" strict)"; then
      SM_PM2_MATCH["$dir"]="$row"
      name="${row%%$'\t'*}"
      SM_PM2_CLAIMED="$SM_PM2_CLAIMED$name "
    fi
  done
  for dir in "$@"; do
    [ -n "$dir" ] || continue
    [ -n "${SM_PM2_MATCH[$dir]:-}" ] && continue
    if row="$(sm_pm2_for_dir "$dir" name)"; then
      SM_PM2_MATCH["$dir"]="$row"
      name="${row%%$'\t'*}"
      SM_PM2_CLAIMED="$SM_PM2_CLAIMED$name "
    fi
  done
}

sm_pm2_count() {
  local state="$1" n=0 name status rest
  [ "$SM_PM2_AVAILABLE" = 1 ] || {
    printf '0'
    return 0
  }
  while IFS=$'\t' read -r name status rest; do
    [ -n "$name" ] || continue
    [ "$status" = "$state" ] && n=$((n + 1))
  done <<<"$SM_PM2_TSV"
  printf '%s' "$n"
}

# =========================================================================
# git
# =========================================================================

# Echoes "repo_dir branch dirty commit" (tab separated). dirty is
# yes | no | unknown. Read-only: no fetch, no checkout, no reset, no clean.
sm_git_info() {
  local dir="$1" candidate repo="" branch="-" dirty="unknown" commit="-"
  command -v git >/dev/null 2>&1 || {
    printf -- '-\t-\tunknown\t-\n'
    return 1
  }
  for candidate in "$dir" "$dir/build" "$dir/current" "$dir/src"; do
    [ -e "$candidate/.git" ] || continue
    if timeout 15 git -c safe.directory='*' -C "$candidate" rev-parse --git-dir >/dev/null 2>&1; then
      repo="$candidate"
      break
    fi
  done
  [ -n "$repo" ] || {
    printf -- '-\t-\tno-repo\t-\n'
    return 1
  }
  branch="$(timeout 15 git -c safe.directory='*' -C "$repo" branch --show-current 2>/dev/null)"
  [ -n "$branch" ] || branch="detached"
  commit="$(timeout 15 git -c safe.directory='*' -C "$repo" log -1 --format=%h 2>/dev/null)"
  [ -n "$commit" ] || commit="-"
  local porcelain rc
  porcelain="$(timeout 60 git -c safe.directory='*' -C "$repo" status --porcelain 2>/dev/null)"
  rc=$?
  if [ "$rc" -ne 0 ]; then
    dirty="unknown"
  elif [ -n "$porcelain" ]; then
    dirty="yes"
  else
    dirty="no"
  fi
  printf '%s\t%s\t%s\t%s\n' "$repo" "$branch" "$dirty" "$commit"
}

# =========================================================================
# deployment detection
# =========================================================================

SM_DEPLOY_PROCS=""
SM_GLOBAL_DEPLOY=0

sm_deploy_scan() {
  SM_DEPLOY_PROCS=""
  SM_GLOBAL_DEPLOY=0

  # Fleet-wide build lock: if it is held, some site is mid-deploy.
  local lock
  for lock in $GLOBAL_DEPLOY_LOCKS; do
    [ -f "$lock" ] || continue
    if command -v flock >/dev/null 2>&1; then
      if ! flock -n "$lock" true 2>/dev/null; then
        SM_GLOBAL_DEPLOY=1
        sm_log INFO "global deploy lock held: $lock"
      fi
    else
      SM_GLOBAL_DEPLOY=1
    fi
  done

  # Deployment-ish processes, with the cwd we can attribute them to.
  local pid args cwd
  while read -r pid args; do
    [ -n "$pid" ] || continue
    case "$args" in
    *'git clone'* | *'git pull'* | *'git fetch'* | *'npm ci'* | *'npm install'* | \
      *'npm run build'* | *'next build'* | *'yarn install'* | *'pnpm install'* | \
      *'pnpm i '* | *'site-deploy.sh'* | *'deploy-all.sh'* | *'build-artifact.sh'* | \
      *'pm2 reload'* | *'pm2 restart'* | *'pm2 start'* | *'prisma migrate'* | \
      *'prepare-standalone'*) ;;
    *) continue ;;
    esac
    cwd="$(sm_realpath "/proc/$pid/cwd")"
    SM_DEPLOY_PROCS="${SM_DEPLOY_PROCS}${pid}|${cwd}|${args}"$'\n'
  done < <(ps -eo pid=,args= 2>/dev/null)

  [ -n "$SM_DEPLOY_PROCS" ] &&
    sm_log INFO "deployment-like processes running: $(printf '%s' "$SM_DEPLOY_PROCS" | grep -c .)"
  return 0
}

# Echoes the reason a project counts as deploying, or nothing.
sm_deploy_reason() {
  local dir="$1" slug="$2" lock rdir line pid cwd args
  rdir="$(sm_realpath "$dir")"

  for lock in "$DEPLOY_LOCK_DIR/$slug.deploy.lock" "$dir/.deploy.lock" "$dir/.deploying"; do
    [ -e "$lock" ] && {
      printf 'deployment lock present (%s)' "$lock"
      return 0
    }
  done
  if [ "$SM_GLOBAL_DEPLOY" = 1 ]; then
    printf 'fleet build lock is held by another process'
    return 0
  fi
  while IFS='|' read -r pid cwd args; do
    [ -n "$pid" ] || continue
    if [ -n "$cwd" ] && [ -n "$rdir" ] && sm_path_within "$cwd" "$rdir"; then
      printf 'deploy process %s running in the project (%s)' "$pid" "${args:0:60}"
      return 0
    fi
    case "$args" in *"$rdir"* | *" $slug"*)
      printf 'deploy process %s references the project (%s)' "$pid" "${args:0:60}"
      return 0
      ;;
    esac
  done <<<"$SM_DEPLOY_PROCS"

  # A build or release tree touched moments ago means a deploy may still be
  # mid-flight even if its process has not been caught above.
  local p
  for p in "$dir/build" "$dir/releases" "$dir/current" "$dir/.next"; do
    [ -e "$p" ] || continue
    if [ -n "$(find "$p" -maxdepth 0 -mmin "-$DEPLOY_RECENT_MIN" 2>/dev/null)" ]; then
      printf '%s changed in the last %s minutes' "$p" "$DEPLOY_RECENT_MIN"
      return 0
    fi
  done
  return 1
}

# =========================================================================
# project discovery and classification
# =========================================================================

sm_registry_slugs() {
  [ -d "$SITE_REGISTRY" ] || return 0
  local f
  for f in "$SITE_REGISTRY"/*.env; do
    [ -e "$f" ] || continue
    basename -- "$f" .env
  done
}

# Candidate project directories, one per line, deduplicated, parents winning
# over nested matches.
sm_project_dirs() {
  local -a found=()
  local slug dir root marker

  # 1. The fleet registry is authoritative when it exists.
  while read -r slug; do
    [ -n "$slug" ] || continue
    dir="$SITE_ROOT/$slug"
    [ -d "$dir" ] && found+=("$dir")
  done < <(sm_registry_slugs)

  # 2. Marker-file discovery under the configured roots.
  if sm_is_true "$PROJECT_DISCOVERY"; then
    while read -r root; do
      [ -d "$root" ] || continue
      while read -r marker; do
        [ -n "$marker" ] || continue
        dir="$(dirname -- "$marker")"
        found+=("$dir")
      done < <(sm_nice find "$root" -mindepth 1 -maxdepth "$DISCOVERY_MAX_DEPTH" \
        \( -name node_modules -o -name .next -o -name .git -o -name releases \
        -o -name vendor -o -name '.*' \) -prune -o \
        -type f \( -name package.json -o -name 'next.config.*' \
        -o -name 'vite.config.*' -o -name 'ecosystem.config.*' \) -print 2>/dev/null)
      # Fleet-shaped directories with no registry entry and no marker at the top.
      for dir in "$root"/*; do
        [ -d "$dir" ] || continue
        if [ -e "$dir/current" ] || [ -d "$dir/releases" ] || [ -d "$dir/shared" ]; then
          found+=("$dir")
        fi
      done
    done < <(sm_expand "$DISCOVERY_ROOTS")
  fi

  [ "${#found[@]}" -gt 0 ] || return 0

  # Normalise, sort, then drop any directory nested inside an earlier one so a
  # site is reported once, as its top directory.
  local -a sorted=()
  while read -r dir; do
    [ -n "$dir" ] && sorted+=("$dir")
  done < <(printf '%s\n' "${found[@]}" | while read -r dir; do sm_realpath "$dir"; done | sort -u)

  local -a kept=()
  local candidate keeper skip
  for candidate in "${sorted[@]}"; do
    skip=0
    for keeper in "${kept[@]:-}"; do
      [ -n "$keeper" ] || continue
      if sm_path_within "$candidate" "$keeper"; then
        skip=1
        break
      fi
    done
    [ "$skip" = 1 ] && continue
    kept+=("$candidate")
  done
  printf '%s\n' "${kept[@]}"
}

sm_project_kind() {
  local dir="$1" base
  for base in "$dir" "$dir/build" "$dir/current"; do
    if compgen -G "$base/next.config.*" >/dev/null 2>&1; then
      printf 'nextjs'
      return
    fi
  done
  for base in "$dir" "$dir/build" "$dir/current"; do
    if compgen -G "$base/vite.config.*" >/dev/null 2>&1; then
      printf 'vite'
      return
    fi
  done
  if [ -f "$dir/current/server.js" ] || [ -f "$dir/build/package.json" ]; then
    printf 'node'
    return
  fi
  [ -f "$dir/package.json" ] && {
    printf 'node'
    return
  }
  printf 'unknown'
}

sm_is_critical_project() {
  local dir="$1" slug entry
  slug="$(basename -- "$dir")"
  for entry in $CRITICAL_PROJECTS; do
    [ "$entry" = "$slug" ] && return 0
    [ "$entry" = "$dir" ] && return 0
  done
  [ -e "$dir/.storage-manager-protect" ] && return 0
  return 1
}

# Fills SM_PROJECT_ROWS with tab separated records:
# dir kind slug state pm2_name pm2_status pm2_pid restarts branch dirty commit size_mb protect_reasons
sm_projects_analyze() {
  SM_PROJECT_ROWS=()
  local dir slug kind state pm2_row pm2_name pm2_status pm2_pid pm2_uptime
  local restarts git_row repo branch dirty commit size protect reason
  local -a dirs=()

  while read -r dir; do
    [ -n "$dir" ] && dirs+=("$dir")
  done < <(sm_project_dirs)
  sm_pm2_assign "${dirs[@]:-}"

  for dir in "${dirs[@]:-}"; do
    [ -n "$dir" ] || continue
    slug="$(basename -- "$dir")"
    kind="$(sm_project_kind "$dir")"
    pm2_name="-"
    pm2_status="-"
    pm2_pid="-"
    restarts="-"
    state="UNKNOWN"
    protect=""

    if reason="$(sm_deploy_reason "$dir" "$slug")"; then
      state="DEPLOYING"
      protect="deploying: $reason"
    fi

    pm2_row="${SM_PM2_MATCH[$dir]:-}"
    if [ -n "$pm2_row" ]; then
      IFS=$'\t' read -r pm2_name pm2_status pm2_pid pm2_uptime restarts <<<"$pm2_row"
      if [ "$state" != "DEPLOYING" ]; then
        case "$pm2_status" in
        online | launching) state="ONLINE" ;;
        stopped | stopping | errored | "one-launch-status") state="OFFLINE" ;;
        *) state="UNKNOWN" ;;
        esac
      fi
    elif [ "$state" != "DEPLOYING" ]; then
      if [ "$SM_PM2_AVAILABLE" = 1 ]; then
        # PM2 answered and does not manage this directory. It may be a plain
        # site, a checkout, or a project between deploys: not ours to judge.
        state="OFFLINE"
        protect="${protect:+$protect; }no PM2 process maps to this directory"
      else
        state="UNKNOWN"
        protect="${protect:+$protect; }PM2 state could not be determined"
      fi
    fi

    git_row="$(sm_git_info "$dir")"
    IFS=$'\t' read -r repo branch dirty commit <<<"$git_row"
    case "$dirty" in
    yes) protect="${protect:+$protect; }uncommitted git changes" ;;
    unknown) protect="${protect:+$protect; }git state unknown" ;;
    esac

    if sm_is_critical_project "$dir"; then
      protect="${protect:+$protect; }marked critical"
    fi
    local self
    for self in $(sm_self_paths); do
      if sm_path_within "$dir" "$self" || sm_path_within "$self" "$dir"; then
        protect="${protect:+$protect; }holds the storage manager itself"
        break
      fi
    done

    size="$(sm_du_mb "$dir")"
    [ -n "$protect" ] || protect="application data is always protected"

    SM_PROJECT_ROWS+=("$(printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s' \
      "$dir" "$kind" "$slug" "$state" "$pm2_name" "${pm2_status:--}" "${pm2_pid:--}" \
      "${restarts:--}" "${branch:--}" "${dirty:--}" "${commit:--}" "$size" "$protect")")
  done < <(sm_project_dirs)
}

sm_projects_cache_file() { printf '%s/projects.tsv' "$STATE_DIR"; }

# Uses the cache when it is younger than PROJECT_SCAN_INTERVAL_MIN, unless
# forced. Discovery walks the disk, so it must not run every 15 minutes.
sm_projects_load() {
  local force="${1:-0}" cache
  cache="$(sm_projects_cache_file)"
  mkdir -p "$STATE_DIR" 2>/dev/null || true
  if [ "$force" = 0 ] && [ -f "$cache" ] &&
    [ -z "$(find "$cache" -maxdepth 0 -mmin "+$PROJECT_SCAN_INTERVAL_MIN" 2>/dev/null)" ]; then
    SM_PROJECT_ROWS=()
    local line
    while IFS= read -r line; do
      [ -n "$line" ] && SM_PROJECT_ROWS+=("$line")
    done <"$cache"
    # PM2 and deployment state are volatile, so they are always re-read even
    # when the (expensive) directory walk is served from cache.
    sm_projects_refresh_volatile
    sm_log INFO "loaded ${#SM_PROJECT_ROWS[@]} projects from cache, refreshed live state"
    return 0
  fi
  sm_projects_analyze
  if [ "${#SM_PROJECT_ROWS[@]}" -gt 0 ] && [ -d "$STATE_DIR" ] && [ -w "$STATE_DIR" ]; then
    printf '%s\n' "${SM_PROJECT_ROWS[@]}" >"$cache" 2>/dev/null
  fi
  sm_log INFO "discovered ${#SM_PROJECT_ROWS[@]} projects"
  return 0
}

sm_projects_refresh_volatile() {
  local -a out=() dirs=()
  local row dir kind slug state pm2_name pm2_status pm2_pid restarts branch dirty commit size protect
  local pm2_row reason pm2_uptime
  for row in "${SM_PROJECT_ROWS[@]:-}"; do
    [ -n "$row" ] || continue
    dirs+=("$(printf '%s' "$row" | cut -f1)")
  done
  sm_pm2_assign "${dirs[@]:-}"
  for row in "${SM_PROJECT_ROWS[@]:-}"; do
    [ -n "$row" ] || continue
    IFS=$'\t' read -r dir kind slug state pm2_name pm2_status pm2_pid restarts branch dirty commit size protect <<<"$row"
    if [ ! -d "$dir" ]; then
      continue
    fi
    state="UNKNOWN"
    pm2_name="-"
    pm2_status="-"
    pm2_pid="-"
    restarts="-"
    protect=""
    if reason="$(sm_deploy_reason "$dir" "$slug")"; then
      state="DEPLOYING"
      protect="deploying: $reason"
    fi
    pm2_row="${SM_PM2_MATCH[$dir]:-}"
    if [ -n "$pm2_row" ]; then
      IFS=$'\t' read -r pm2_name pm2_status pm2_pid pm2_uptime restarts <<<"$pm2_row"
      if [ "$state" != "DEPLOYING" ]; then
        case "$pm2_status" in
        online | launching) state="ONLINE" ;;
        stopped | stopping | errored | "one-launch-status") state="OFFLINE" ;;
        *) state="UNKNOWN" ;;
        esac
      fi
    elif [ "$state" != "DEPLOYING" ]; then
      if [ "$SM_PM2_AVAILABLE" = 1 ]; then
        state="OFFLINE"
        protect="${protect:+$protect; }no PM2 process maps to this directory"
      else
        state="UNKNOWN"
        protect="${protect:+$protect; }PM2 state could not be determined"
      fi
    fi
    case "$dirty" in
    yes) protect="${protect:+$protect; }uncommitted git changes" ;;
    unknown) protect="${protect:+$protect; }git state unknown" ;;
    esac
    sm_is_critical_project "$dir" && protect="${protect:+$protect; }marked critical"
    [ -n "$protect" ] || protect="application data is always protected"
    out+=("$(printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s' \
      "$dir" "$kind" "$slug" "$state" "$pm2_name" "$pm2_status" "$pm2_pid" \
      "$restarts" "$branch" "$dirty" "$commit" "$size" "$protect")")
  done
  SM_PROJECT_ROWS=("${out[@]:-}")
}

sm_state_count() {
  local want="$1" n=0 row dir kind slug state rest
  for row in "${SM_PROJECT_ROWS[@]:-}"; do
    [ -n "$row" ] || continue
    IFS=$'\t' read -r dir kind slug state rest <<<"$row"
    [ "$state" = "$want" ] && n=$((n + 1))
  done
  printf '%s' "$n"
}

sm_project_count() {
  local n=0 row
  for row in "${SM_PROJECT_ROWS[@]:-}"; do [ -n "$row" ] && n=$((n + 1)); done
  printf '%s' "$n"
}

# =========================================================================
# cleanup categories — system level, always safe
# =========================================================================

sm_category_begin() {
  sm_disk_read >/dev/null 2>&1
  SM_CAT_FREE_BEFORE="$SM_DISK_FREE_MB"
  SM_CAT_RECLAIMED_BEFORE="$SM_RECLAIMED_MB"
}

sm_category_end() {
  local name="$1" estimate="${2:-0}" delta=0 removed=0 df_delta=0
  if [ "$SM_DRY_RUN" = 1 ]; then
    delta="$estimate"
  else
    # Bytes this category actually removed are exact. A category that removes
    # nothing itself but hands the work to a tool (apt, journalctl, logrotate)
    # is credited with the change in free space instead.
    removed=$((SM_RECLAIMED_MB - SM_CAT_RECLAIMED_BEFORE))
    sm_disk_read >/dev/null 2>&1
    df_delta=$((SM_DISK_FREE_MB - SM_CAT_FREE_BEFORE))
    [ "$df_delta" -lt 0 ] && df_delta=0
    if [ "$removed" -gt 0 ]; then
      delta="$removed"
    else
      delta="$df_delta"
    fi
  fi
  SM_CATEGORY_NAMES+=("$name")
  SM_CATEGORY_MB+=("$delta")
}

sm_clean_apt() {
  sm_is_true "$ENABLE_APT_CLEANUP" || {
    sm_action SKIPPED apt - "-" "ENABLE_APT_CLEANUP=false"
    return 0
  }
  command -v apt-get >/dev/null 2>&1 || {
    sm_action SKIPPED apt - "-" "apt-get not installed"
    return 0
  }
  sm_category_begin
  local mb
  mb="$(sm_du_mb /var/cache/apt)"
  if [ "$mb" -lt 50 ]; then
    sm_action NOTE apt "$mb" /var/cache/apt "below the 50 MB worth-doing floor"
    sm_category_end apt 0
    return 0
  fi
  sm_need_root apt || {
    sm_category_end apt 0
    return 0
  }
  # clean/autoclean only drop downloaded .deb archives. No package is removed,
  # nothing is reconfigured, and nothing on the system stops working.
  sm_run apt "drop downloaded package archives" apt-get -qq clean
  sm_run apt "drop superseded package archives" apt-get -qq autoclean
  if sm_is_true "$ENABLE_APT_AUTOREMOVE"; then
    sm_action NOTE apt - "-" "ENABLE_APT_AUTOREMOVE is on, but autoremove uninstalls packages and is never run automatically"
  fi
  sm_category_end apt "$mb"
}

# Megabytes the journal currently occupies, parsed out of
# "Archived and active journals take up 1.1G in the file system."
sm_journal_mb() {
  command -v journalctl >/dev/null 2>&1 || {
    printf '0'
    return 0
  }
  journalctl --disk-usage 2>/dev/null | awk '
    {
      for (i = 1; i <= NF; i++) {
        if ($i ~ /^[0-9]+(\.[0-9]+)?[KMGT]?$/) {
          v = $i; unit = substr(v, length(v), 1); num = v + 0
          if (unit == "K") mb = num / 1024
          else if (unit == "M") mb = num
          else if (unit == "G") mb = num * 1024
          else if (unit == "T") mb = num * 1048576
          else mb = num / 1048576
          printf "%d", mb; exit
        }
      }
      print 0
    }'
}

sm_clean_journal() {
  sm_is_true "$ENABLE_JOURNAL_CLEANUP" || {
    sm_action SKIPPED journal - "-" "ENABLE_JOURNAL_CLEANUP=false"
    return 0
  }
  command -v journalctl >/dev/null 2>&1 || {
    sm_action SKIPPED journal - "-" "journalctl not installed"
    return 0
  }
  sm_category_begin
  local mb cap excess
  mb="$(sm_journal_mb)"
  sm_is_int "$mb" || mb=0
  cap="$(awk -v s="$JOURNAL_MAX_SIZE" 'BEGIN {
    u = toupper(substr(s, length(s), 1)); n = s + 0
    if (u == "K") printf "%d", n / 1024
    else if (u == "M") printf "%d", n
    else if (u == "G") printf "%d", n * 1024
    else printf "%d", n
  }')"
  excess=$((mb - cap))
  [ "$excess" -lt 0 ] && excess=0
  if [ "$excess" -le 0 ]; then
    sm_action NOTE journal "$mb" "systemd journal" "already within the ${JOURNAL_MAX_SIZE} cap"
    sm_category_end journal 0
    return 0
  fi
  sm_need_root journal || {
    sm_category_end journal 0
    return 0
  }
  # Vacuuming is the only supported way to shrink the journal. Deleting
  # /var/log/journal by hand corrupts it, so this program never does that.
  sm_run journal "vacuum the journal to $JOURNAL_MAX_SIZE" journalctl --vacuum-size="$JOURNAL_MAX_SIZE"
  sm_run journal "drop journal older than $JOURNAL_MAX_AGE" journalctl --vacuum-time="$JOURNAL_MAX_AGE"
  sm_category_end journal "$excess"
}

# Rotated log files only: never an active log, never a truncation.
sm_rotated_log_candidates() {
  local dir="$1" days="$2"
  sm_nice find "$dir" -maxdepth 2 -type f \
    \( -name '*.gz' -o -name '*.xz' -o -name '*.zst' -o -name '*.old' \
    -o -name '*.[0-9]' -o -name '*.[0-9][0-9]' -o -name '*.log.[0-9]*' \
    -o -name '*__*.log' \) \
    -mtime "+$days" -print 2>/dev/null
}

sm_clean_pm2_logs() {
  sm_is_true "$ENABLE_PM2_LOG_ROTATION" || {
    sm_action SKIPPED pm2_logs - "-" "ENABLE_PM2_LOG_ROTATION=false"
    return 0
  }
  sm_category_begin
  local -a dirs=()
  local d
  while read -r d; do [ -n "$d" ] && dirs+=("$d"); done < <(sm_expand "$PM2_LOG_DIRS")
  if [ "${#dirs[@]}" -eq 0 ]; then
    sm_action NOTE pm2_logs - "-" "no PM2 log directory found"
    sm_category_end pm2_logs 0
    return 0
  fi
  local estimate=0 f mb
  for d in "${dirs[@]}"; do
    while read -r f; do
      [ -n "$f" ] || continue
      mb="$(sm_du_mb "$f")"
      estimate=$((estimate + mb))
      sm_safe_remove "$f" pm2_logs "rotated PM2 log older than ${LOG_RETENTION_DAYS}d" file "$d"
    done < <(sm_rotated_log_candidates "$d" "$LOG_RETENTION_DAYS")
  done
  # Active logs are left strictly alone. Report drift instead of acting on it.
  if command -v pm2 >/dev/null 2>&1; then
    if ! pm2 describe pm2-logrotate >/dev/null 2>&1; then
      if sm_is_true "$PM2_LOGROTATE_AUTOCONFIGURE" && [ "$SM_MODE" = "admin" ]; then
        sm_run pm2_logs "install the pm2-logrotate module" pm2 install pm2-logrotate
        sm_run pm2_logs "cap PM2 log size" pm2 set pm2-logrotate:max_size 10M
        sm_run pm2_logs "keep 3 rotations" pm2 set pm2-logrotate:retain 3
        sm_run pm2_logs "compress rotations" pm2 set pm2-logrotate:compress true
      else
        sm_action NOTE pm2_logs - "pm2-logrotate" "not installed: PM2 logs can grow without limit. Fix with: storage-manager pm2-logrotate --apply"
      fi
    fi
  fi
  sm_category_end pm2_logs "$estimate"
}

sm_clean_nginx_logs() {
  sm_is_true "$ENABLE_NGINX_LOG_ROTATION" || {
    sm_action SKIPPED nginx_logs - "-" "ENABLE_NGINX_LOG_ROTATION=false"
    return 0
  }
  sm_category_begin
  local dir
  dir="$(sm_realpath "$NGINX_LOG_DIR")"
  [ -n "$dir" ] && [ -d "$dir" ] || {
    sm_action NOTE nginx_logs - "$NGINX_LOG_DIR" "directory not present"
    sm_category_end nginx_logs 0
    return 0
  }
  local estimate=0 f mb
  while read -r f; do
    [ -n "$f" ] || continue
    mb="$(sm_du_mb "$f")"
    estimate=$((estimate + mb))
    sm_safe_remove "$f" nginx_logs "rotated nginx log older than ${LOG_RETENTION_DAYS}d" file "$dir"
  done < <(sm_rotated_log_candidates "$dir" "$LOG_RETENTION_DAYS")
  sm_category_end nginx_logs "$estimate"
}

sm_clean_system_logs() {
  sm_is_true "$ENABLE_SYSTEM_LOG_CLEANUP" || {
    sm_action SKIPPED system_logs - "-" "ENABLE_SYSTEM_LOG_CLEANUP=false"
    return 0
  }
  sm_category_begin
  local dir
  dir="$(sm_realpath "$SYSTEM_LOG_DIR")"
  [ -n "$dir" ] && [ -d "$dir" ] || {
    sm_category_end system_logs 0
    return 0
  }
  local estimate=0 f mb rnginx
  rnginx="$(sm_realpath "$NGINX_LOG_DIR")"
  while read -r f; do
    [ -n "$f" ] || continue
    # nginx logs have their own category above; the journal is only ever changed
    # through journalctl, never through the filesystem.
    case "$f" in "$rnginx"/* | "$dir"/journal/*) continue ;; esac
    mb="$(sm_du_mb "$f")"
    estimate=$((estimate + mb))
    sm_safe_remove "$f" system_logs "rotated system log older than ${LOG_RETENTION_DAYS}d" file "$dir"
  done < <(sm_rotated_log_candidates "$dir" "$LOG_RETENTION_DAYS")
  sm_category_end system_logs "$estimate"
}

sm_clean_temp() {
  sm_is_true "$ENABLE_TEMP_CLEANUP" || {
    sm_action SKIPPED temp - "-" "ENABLE_TEMP_CLEANUP=false"
    return 0
  }
  sm_category_begin
  local estimate=0 dir entry base mb
  while read -r dir; do
    [ -d "$dir" ] || continue
    while read -r entry; do
      [ -n "$entry" ] || continue
      base="$(basename -- "$entry")"
      # Sockets, X11 and systemd's private mounts belong to running services.
      case "$base" in
      systemd-private-* | snap-private-* | .X11-unix | .XIM-unix | .font-unix | \
        .ICE-unix | .Test-unix | systemd-* | tmp*.sock | *.sock | .storage-manager*)
        sm_action SKIPPED temp - "$entry" "belongs to a running service"
        continue
        ;;
      esac
      if [ -f "$entry" ] && sm_file_is_open "$entry"; then
        sm_action SKIPPED temp - "$entry" "still open by a running process"
        continue
      fi
      mb="$(sm_du_mb "$entry")"
      estimate=$((estimate + mb))
      sm_safe_remove "$entry" temp "unused for more than ${TEMP_RETENTION_DAYS} days" any "$dir"
    done < <(sm_nice find "$dir" -mindepth 1 -maxdepth 1 \
      -mtime "+$TEMP_RETENTION_DAYS" -mmin "+$((TEMP_RETENTION_DAYS * 1440))" -print 2>/dev/null)
  done < <(sm_expand "$TEMP_DIRS")
  sm_category_end temp "$estimate"
}

sm_clean_pkg_caches() {
  sm_is_true "$ENABLE_PKG_CACHE_CLEANUP" || {
    sm_action SKIPPED pkg_caches - "-" "ENABLE_PKG_CACHE_CLEANUP=false"
    return 0
  }
  sm_category_begin
  local estimate=0 p mb
  while read -r p; do
    [ -n "$p" ] && estimate=$((estimate + $(sm_du_mb "$p")))
  done < <(sm_expand "$PKG_CACHE_PATHS")

  # Package manager CLIs know how to empty their own cache safely; that is
  # preferable to removing directories underneath them.
  if command -v npm >/dev/null 2>&1 && [ "$estimate" -gt 0 ]; then
    sm_run pkg_caches "empty the npm cache (re-downloaded on the next install)" npm cache clean --force
  fi
  if command -v yarn >/dev/null 2>&1; then
    mb="$(sm_du_mb "${HOME:-/root}/.cache/yarn")"
    [ "$mb" -gt 50 ] && {
      estimate=$((estimate + mb))
      sm_run pkg_caches "empty the yarn cache" yarn cache clean
    }
  fi
  if command -v pnpm >/dev/null 2>&1; then
    sm_run pkg_caches "prune the pnpm store" pnpm store prune
  fi
  sm_category_end pkg_caches "$estimate"
}

# Puts a ceiling on the runtime cache of a live site. Only the regeneratable
# subdirectories of an over-cap cache go, never .next, never the bundle, never
# the cache directory itself — a release may have it symlinked to shared storage.
sm_clean_isr_cache() {
  if ! sm_is_true "$ALLOW_ONLINE_CACHE_TRIM"; then
    sm_action NOTE isr_cache - "-" "ALLOW_ONLINE_CACHE_TRIM=false: a runtime cache is never trimmed by default"
    return 0
  fi
  sm_category_begin
  local row dir kind slug state rest cache sub mb total=0
  for row in "${SM_PROJECT_ROWS[@]:-}"; do
    [ -n "$row" ] || continue
    IFS=$'\t' read -r dir kind slug state rest <<<"$row"
    case "$state" in
    DEPLOYING)
      sm_action PROTECTED isr_cache - "$dir" "a deployment is in progress"
      continue
      ;;
    UNKNOWN)
      sm_action PROTECTED isr_cache - "$dir" "project state could not be determined"
      continue
      ;;
    esac
    if sm_is_critical_project "$dir"; then
      sm_action PROTECTED isr_cache - "$dir" "marked critical"
      continue
    fi
    for cache in "$dir/.next/cache" "$dir/.next/standalone/.next/cache" \
      "$dir/build/.next/cache" "$dir/shared/cache"; do
      [ -d "$cache" ] || continue
      mb="$(sm_du_mb "$cache")"
      if [ "$mb" -le "$ISR_CACHE_MAX_MB" ]; then
        sm_action NOTE isr_cache "$mb" "$cache" "within the ${ISR_CACHE_MAX_MB} MB cap"
        continue
      fi
      sm_action NOTE isr_cache "$mb" "$cache" "over the ${ISR_CACHE_MAX_MB} MB cap — trimming its regeneratable parts"
      for sub in images fetch-cache; do
        [ -d "$cache/$sub" ] || continue
        [ -L "$cache/$sub" ] && continue
        mb="$(sm_du_mb "$cache/$sub")"
        sm_safe_remove "$cache/$sub" isr_cache \
          "regeneratable $sub of a cache over its cap; Next.js rebuilds entries on demand" \
          dir "$dir" && total=$((total + mb))
      done
    done

    # Rendered pages, which is where the 156 GB actually was.
    for cache in "$dir/.next/standalone/.next/server/app" "$dir/.next/server/app" \
      "$dir/build/.next/server/app" "$dir/current/.next/server/app"; do
      [ -d "$cache" ] || continue
      [ -L "$cache" ] && continue
      mb="$(sm_du_mb "$cache")"
      if [ "$mb" -le "$PRERENDER_CACHE_MAX_MB" ]; then
        sm_action NOTE isr_pages "$mb" "$cache" "within the ${PRERENDER_CACHE_MAX_MB} MB cap"
        continue
      fi
      sm_trim_prerendered "$cache" "$((mb - PRERENDER_CACHE_MAX_MB))" "$dir"
      total=$((total + SM_TRIM_MB))
    done
  done
  sm_category_end isr_cache "$total"
}

# Removes generated page files under an over-cap directory, oldest first, until
# the excess is gone. Sets SM_TRIM_MB.
#
# The safety model differs from sm_safe_remove by necessity: validating each of
# a million files individually would cost more than the cleanup saves. Instead
# the *directory* goes through the same gate, and what may be removed inside it
# is constrained to three extensions that are always regenerated output — never
# .js, never a manifest, never anything the running server loads.
sm_trim_prerendered() {
  local base="$1" need_mb="$2" project="$3"
  SM_TRIM_MB=0
  local refusal
  if ! refusal="$(sm_validate_target "$base" dir "$project")"; then
    sm_action SKIPPED isr_pages - "$base" "refused by safety gate: $refusal"
    return 0
  fi
  local budget=$((need_mb * 1048576)) freed=0 count=0 ts size path
  while IFS=$'\t' read -r ts size path; do
    [ "$freed" -ge "$budget" ] && break
    [ -n "$path" ] || continue
    # Belt and braces: nothing outside the validated directory, whatever find said.
    case "$path" in "$base"/*) ;; *) continue ;; esac
    if [ "$SM_DRY_RUN" = 1 ]; then
      freed=$((freed + size))
      count=$((count + 1))
      continue
    fi
    if rm -f -- "$path" 2>/dev/null; then
      freed=$((freed + size))
      count=$((count + 1))
    fi
  done < <(sm_nice find "$base" -type f \
    \( -name '*.html' -o -name '*.rsc' -o -name '*.meta' \) \
    -printf '%T@\t%s\t%p\n' 2>/dev/null | sort -n | head -n "$PRERENDER_TRIM_BATCH")

  SM_TRIM_MB=$((freed / 1048576))
  [ "$SM_DRY_RUN" = 0 ] && SM_RECLAIMED_MB=$((SM_RECLAIMED_MB + SM_TRIM_MB))
  local verb="removed"
  [ "$SM_DRY_RUN" = 1 ] && verb="would remove"
  sm_action SAFE isr_pages "$SM_TRIM_MB" "$base" \
    "$verb $count rendered page files (.html/.rsc/.meta), oldest first, to get under the ${PRERENDER_CACHE_MAX_MB} MB cap"
  return 0
}

sm_run_logrotate() {
  sm_is_true "$RUN_LOGROTATE_ON_PRESSURE" || {
    sm_action SKIPPED logrotate - "-" "RUN_LOGROTATE_ON_PRESSURE=false"
    return 0
  }
  command -v logrotate >/dev/null 2>&1 || {
    sm_action SKIPPED logrotate - "-" "logrotate not installed"
    return 0
  }
  sm_need_root logrotate || return 0
  sm_category_begin
  # The system's own logrotate config decides what rotates and how nginx is
  # told to reopen its files (a USR1 signal, not a restart). This program does
  # not add, edit or force any rule here.
  sm_run logrotate "run the system log rotation" logrotate /etc/logrotate.conf
  sm_category_end logrotate 0
}

# =========================================================================
# cleanup categories — project level, opt-in only
# =========================================================================

# Every guard that must hold before a project directory may be touched at all.
# Returns non-zero and prints the reason when it must not be.
sm_project_cleanup_allowed() {
  local dir="$1" state="$2" dirty="$3" protect="$4"
  case "$state" in
  ONLINE)
    printf 'PM2 reports it ONLINE'
    return 1
    ;;
  DEPLOYING)
    printf 'a deployment is in progress'
    return 1
    ;;
  UNKNOWN)
    printf 'project state could not be determined'
    return 1
    ;;
  OFFLINE) ;;
  *)
    printf 'unrecognised state %s' "$state"
    return 1
    ;;
  esac
  [ "$dirty" = "no" ] || {
    printf 'git working tree is %s' "$dirty"
    return 1
  }
  sm_is_critical_project "$dir" && {
    printf 'marked critical'
    return 1
  }
  case "$protect" in *"storage manager itself"*)
    printf 'holds the storage manager itself'
    return 1
    ;;
  esac
  # A restorable project needs its manifest and lock file present.
  local base found=1 b
  for b in "$dir" "$dir/build"; do
    if [ -f "$b/package.json" ]; then
      base="$b"
      found=0
      break
    fi
  done
  [ "$found" = 0 ] || {
    printf 'no package.json to restore dependencies from'
    return 1
  }
  if [ ! -f "$base/package-lock.json" ] && [ ! -f "$base/yarn.lock" ] &&
    [ ! -f "$base/pnpm-lock.yaml" ] && [ ! -f "$base/npm-shrinkwrap.json" ]; then
    printf 'no lock file, so dependencies could not be restored exactly'
    return 1
  fi
  return 0
}

sm_clean_projects_optin() {
  local any=0
  sm_is_true "$ALLOW_NEXT_CACHE_CLEANUP" && any=1
  sm_is_true "$ALLOW_NEXT_BUILD_CLEANUP" && any=1
  sm_is_true "$ALLOW_NODE_MODULES_CLEANUP" && any=1
  sm_is_true "$ALLOW_STALE_RELEASE_CLEANUP" && any=1
  if [ "$any" = 0 ]; then
    sm_action NOTE project - "-" "every project-level cleanup is disabled (the default)"
    return 0
  fi

  sm_category_begin
  SM_OPTIN_MB=0
  local row dir kind slug state pm2_name pm2_status pm2_pid restarts
  local branch dirty commit size protect refusal
  for row in "${SM_PROJECT_ROWS[@]:-}"; do
    [ -n "$row" ] || continue
    IFS=$'\t' read -r dir kind slug state pm2_name pm2_status pm2_pid restarts \
      branch dirty commit size protect <<<"$row"
    if ! refusal="$(sm_project_cleanup_allowed "$dir" "$state" "$dirty" "$protect")"; then
      sm_action PROTECTED project "$size" "$dir" "$refusal"
      continue
    fi
    sm_is_true "$ALLOW_NEXT_CACHE_CLEANUP" && sm_project_next_cache "$dir"
    sm_is_true "$ALLOW_NEXT_BUILD_CLEANUP" && sm_project_next_build "$dir"
    sm_is_true "$ALLOW_NODE_MODULES_CLEANUP" && sm_project_node_modules "$dir"
    sm_is_true "$ALLOW_STALE_RELEASE_CLEANUP" && sm_project_releases "$dir"
  done
  sm_category_end project "$SM_OPTIN_MB"
}

# These add to SM_OPTIN_MB rather than echoing a total: they have to run in this
# shell, or the audit records their safety gate emits would be lost in a subshell.
sm_project_next_cache() {
  local dir="$1" p mb
  for p in "$dir/.next/cache" "$dir/build/.next/cache" "$dir/shared/cache"; do
    [ -d "$p" ] || continue
    [ -L "$p" ] && continue
    mb="$(sm_du_mb "$p")"
    sm_safe_remove "$p" project_next_cache "regeneratable Next.js cache of an inactive project" dir "$dir" &&
      SM_OPTIN_MB=$((SM_OPTIN_MB + mb))
  done
}

sm_project_next_build() {
  local dir="$1" p mb
  for p in "$dir/.next" "$dir/build/.next"; do
    [ -d "$p" ] || continue
    [ -L "$p" ] && continue
    # A standalone bundle inside .next is what actually serves traffic on this
    # fleet, so .next is only ever removed from a build tree, never a release.
    if [ -d "$p/standalone" ] && [ -f "$p/standalone/server.js" ]; then
      sm_action PROTECTED project_next_build - "$p" "contains the standalone bundle that serves traffic"
      continue
    fi
    mb="$(sm_du_mb "$p")"
    sm_safe_remove "$p" project_next_build "rebuildable Next.js build output of an inactive project" dir "$dir" &&
      SM_OPTIN_MB=$((SM_OPTIN_MB + mb))
  done
}

sm_project_node_modules() {
  local dir="$1" p mb
  for p in "$dir/node_modules" "$dir/build/node_modules"; do
    [ -d "$p" ] || continue
    [ -L "$p" ] && continue
    # Anything a release resolves through must stay: standalone bundles resolve
    # upward out of .next/standalone into the project root.
    if [ -e "$dir/current" ] && [ "$p" = "$dir/node_modules" ]; then
      sm_action PROTECTED project_node_modules - "$p" "a live release may resolve modules through it"
      continue
    fi
    mb="$(sm_du_mb "$p")"
    sm_safe_remove "$p" project_node_modules "restored by npm ci on the next deploy" dir "$dir" &&
      SM_OPTIN_MB=$((SM_OPTIN_MB + mb))
  done
}

sm_project_releases() {
  local dir="$1" releases="$dir/releases" live kept=0 keep_others name old mb
  [ -d "$releases" ] || return 0
  live="$(sm_realpath "$dir/current")"
  if [ -z "$live" ] || [ ! -d "$live" ]; then
    sm_action PROTECTED project_releases - "$releases" "cannot resolve which release is live"
    return 0
  fi
  keep_others=$((KEEP_RELEASES - 1))
  [ "$keep_others" -lt 0 ] && keep_others=0
  while read -r name; do
    [ -n "$name" ] || continue
    old="$releases/$name"
    [ "$(sm_realpath "$old")" = "$live" ] && continue
    kept=$((kept + 1))
    [ "$kept" -le "$keep_others" ] && continue
    if [ -n "$(sm_processes_under "$old")" ]; then
      sm_action PROTECTED project_releases - "$old" "a running process is inside this release"
      continue
    fi
    mb="$(sm_du_mb "$old")"
    sm_safe_remove "$old" project_releases "superseded release, keeping $KEEP_RELEASES" dir "$releases" &&
      SM_OPTIN_MB=$((SM_OPTIN_MB + mb))
  done < <(find "$releases" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' 2>/dev/null | sort -r)
}

# PIDs whose cwd or executable lives under $1.
sm_processes_under() {
  local dir="$1" rdir pid cwd
  rdir="$(sm_realpath "$dir")"
  [ -n "$rdir" ] || return 0
  for pid in /proc/[0-9]*; do
    cwd="$(sm_realpath "$pid/cwd")"
    [ -n "$cwd" ] || continue
    if sm_path_within "$cwd" "$rdir"; then
      printf '%s\n' "${pid#/proc/}"
    fi
  done
}

# =========================================================================
# cleanup orchestration
# =========================================================================

sm_cleanup() {
  local level level_name category free_before pct_before name
  sm_disk_read || {
    sm_log ERROR "aborting: disk usage for $DISK_PATH is unreadable"
    return 1
  }
  free_before="$SM_DISK_FREE_MB"
  pct_before="$SM_DISK_PCT"
  level="$(sm_level)"
  level_name="$(sm_level_name "$level")"

  sm_log INFO "run start mode=$SM_MODE dry_run=$SM_DRY_RUN disk=$DISK_PATH used=${pct_before}% free=$((free_before / 1024))GB level=$level_name"

  sm_pm2_load || true
  sm_deploy_scan
  sm_projects_load 0

  # Under critical or emergency pressure the opt-ins are refused regardless of
  # configuration: that is the moment to alert a human, not to delete more.
  if [ "$level" -ge 4 ]; then
    for name in ALLOW_NEXT_CACHE_CLEANUP ALLOW_NEXT_BUILD_CLEANUP \
      ALLOW_NODE_MODULES_CLEANUP ALLOW_STALE_RELEASE_CLEANUP ALLOW_ONLINE_CACHE_TRIM; do
      if sm_is_true "${!name}"; then
        sm_action PROTECTED policy - "$name" "force-disabled at $level_name: application data is never deleted under pressure"
        printf -v "$name" '%s' false
      fi
    done
  fi

  local -a categories=()
  case "$SM_MODE" in
  safe)
    categories=(apt journal pm2_logs nginx_logs system_logs temp)
    ;;
  full | admin)
    categories=(apt journal pm2_logs nginx_logs system_logs isr_cache temp pkg_caches logrotate project_optin)
    ;;
  auto | *)
    if [ "$level" = 0 ]; then
      sm_say "Usage ${pct_before}% and $((free_before / 1024)) GB free — under every threshold, nothing to do."
      sm_log INFO "no cleanup required: ${pct_before}% used, $((free_before / 1024))GB free, target ${TARGET_FREE_GB}GB"
      # A healthy run gets one line of history, not a full record: 96 runs a day
      # of "nothing to do" must not bury the runs that did something.
      sm_audit_line "$pct_before" "$free_before" "$level_name" "no cleanup required"
      sm_write_last_run "$level_name"
      return 0
    fi
    while read -r category; do
      [ -n "$category" ] && categories+=("$category")
    done < <(sm_categories_for_level "$level" | tr ' ' '\n')
    ;;
  esac

  [ "$SM_DRY_RUN" = 1 ] && sm_say "DRY RUN — no file is removed and no command is run."
  sm_say ""

  for category in "${categories[@]:-}"; do
    [ -n "$category" ] || continue
    # In auto mode, stop as soon as the target is met: cleanup is a means, not
    # a goal.
    if [ "$SM_MODE" = "auto" ] && [ "$SM_DRY_RUN" = 0 ] && sm_target_met; then
      sm_log INFO "target reached (${SM_DISK_PCT}% used, $(sm_free_gb)GB free) — skipping remaining categories"
      sm_action NOTE policy - "$category" "not needed: usage ${SM_DISK_PCT}% and $(sm_free_gb) GB free already meet the target"
      break
    fi
    case "$category" in
    apt) sm_clean_apt ;;
    journal) sm_clean_journal ;;
    pm2_logs) sm_clean_pm2_logs ;;
    nginx_logs) sm_clean_nginx_logs ;;
    system_logs) sm_clean_system_logs ;;
    isr_cache) sm_clean_isr_cache ;;
    temp) sm_clean_temp ;;
    pkg_caches) sm_clean_pkg_caches ;;
    logrotate) sm_run_logrotate ;;
    project_optin) sm_clean_projects_optin ;;
    esac
  done

  sm_disk_read || true
  sm_say ""
  sm_cleanup_summary "$pct_before" "$free_before" "$level_name"
  sm_audit_record "$pct_before" "$free_before" "$level_name" "level $level_name"
  sm_write_last_run "$level_name"

  if [ "$level" -ge 4 ] && [ "$SM_DRY_RUN" = 0 ]; then
    if [ "$SM_DISK_PCT" -ge "$CRITICAL_USAGE_PERCENT" ]; then
      sm_alert "$SM_PROGRAM: $DISK_PATH still ${SM_DISK_PCT}% full after safe cleanup" \
        "$(sm_critical_report)"
      sm_say ""
      sm_say "CRITICAL: safe cleanup was not enough. No application was touched and none will be."
      sm_say "Next step is a human decision — see: $LOG_DIR/CRITICAL-ALERT.txt"
      return 2
    fi
  fi
  return 0
}

sm_cleanup_summary() {
  local pct_before="$1" free_before="$2" level_name="$3" i
  sm_hr
  sm_say "RESULT"
  sm_hr
  printf 'Level:        %s\n' "$level_name"
  printf 'Before:       %s%% used, %s free\n' "$pct_before" "$(sm_mb_human "$free_before")"
  printf 'After:        %s%% used, %s free\n' "$SM_DISK_PCT" "$(sm_mb_human "$SM_DISK_FREE_MB")"
  if [ "$SM_DRY_RUN" = 1 ]; then
    local total=0
    for i in "${!SM_CATEGORY_NAMES[@]}"; do
      total=$((total + SM_CATEGORY_MB[i]))
    done
    printf 'Would free:   %s (estimate)\n' "$(sm_mb_human "$total")"
  else
    printf 'Reclaimed:    %s (measured %s)\n' \
      "$(sm_mb_human "$SM_RECLAIMED_MB")" \
      "$(sm_mb_human "$((SM_DISK_FREE_MB - free_before < 0 ? 0 : SM_DISK_FREE_MB - free_before))")"
  fi
  printf 'Actions:      %s taken, %s skipped, %s protected, %s failed\n' \
    "$SM_ACTION_COUNT" "$SM_SKIPPED_COUNT" "$SM_PROTECTED_COUNT" "$SM_FAILED_COUNT"
  printf 'Applications: %s projects, %s stopped, %s restarted, %s killed\n' \
    "$(sm_project_count)" 0 0 0
  if [ "${#SM_CATEGORY_NAMES[@]}" -gt 0 ]; then
    sm_say ""
    sm_say "By category:"
    for i in "${!SM_CATEGORY_NAMES[@]}"; do
      printf '  %-16s %10s\n' "${SM_CATEGORY_NAMES[$i]}" "$(sm_mb_human "${SM_CATEGORY_MB[$i]}")"
    done
  fi
}

sm_audit_line() {
  local pct_before="$1" free_before="$2" level_name="$3" note="$4"
  [ -n "$SM_HISTORY_FILE" ] || return 0
  printf '%s  run=%s  level=%-11s usage=%s%%  free=%s  %s\n' \
    "$(date '+%F %T')" "$SM_RUN_ID" "$level_name" "$pct_before" \
    "$(sm_mb_human "$free_before")" "$note" >>"$SM_HISTORY_FILE" 2>/dev/null
  sm_rotate_own_log "$SM_HISTORY_FILE"
}

sm_audit_record() {
  local pct_before="$1" free_before="$2" level_name="$3" note="$4" i
  [ -n "$SM_HISTORY_FILE" ] || return 0
  {
    printf '%s\n' '--------------------------------------------------------'
    printf 'run        %s\n' "$SM_RUN_ID"
    printf 'started    %s\n' "$SM_STARTED_AT"
    printf 'finished   %s\n' "$(date '+%F %T')"
    printf 'mode       %s%s\n' "$SM_MODE" "$([ "$SM_DRY_RUN" = 1 ] && printf ' (dry-run)')"
    printf 'level      %s (%s)\n' "$level_name" "$note"
    printf 'before     usage=%s%% free=%s\n' "$pct_before" "$(sm_mb_human "$free_before")"
    printf 'after      usage=%s%% free=%s\n' "$SM_DISK_PCT" "$(sm_mb_human "$SM_DISK_FREE_MB")"
    printf 'reclaimed  %s\n' "$(sm_mb_human "$SM_RECLAIMED_MB")"
    printf 'actions    taken=%s skipped=%s protected=%s failed=%s\n' \
      "$SM_ACTION_COUNT" "$SM_SKIPPED_COUNT" "$SM_PROTECTED_COUNT" "$SM_FAILED_COUNT"
    printf 'projects   total=%s online=%s offline=%s deploying=%s unknown=%s\n' \
      "$(sm_project_count)" "$(sm_state_count ONLINE)" "$(sm_state_count OFFLINE)" \
      "$(sm_state_count DEPLOYING)" "$(sm_state_count UNKNOWN)"
    printf 'apps       stopped=0 restarted=0 killed=0 (this program never does any of these)\n'
    for i in "${!SM_CATEGORY_NAMES[@]}"; do
      printf 'category   %-16s %s\n' "${SM_CATEGORY_NAMES[$i]}" "$(sm_mb_human "${SM_CATEGORY_MB[$i]}")"
    done
    for i in "${!SM_ACTIONS[@]}"; do
      printf 'action     %s\n' "${SM_ACTIONS[$i]//|/ :: }"
    done
  } >>"$SM_HISTORY_FILE" 2>/dev/null
  sm_rotate_own_log "$SM_HISTORY_FILE"
}

sm_critical_report() {
  printf 'Disk %s is %s%% full with %s free (target %s GB).\n\n' \
    "$DISK_PATH" "$SM_DISK_PCT" "$(sm_mb_human "$SM_DISK_FREE_MB")" "$TARGET_FREE_GB"
  printf 'Every safe system-level cleanup has already run. Nothing further will be\n'
  printf 'deleted automatically, and no application has been stopped, restarted or\n'
  printf 'killed.\n\n'
  printf 'Investigate, in this order:\n'
  printf '  storage-manager open-deleted   space held by deleted-but-open files\n'
  printf '  storage-manager large-files    biggest files on disk\n'
  printf '  storage-manager projects       per project sizes and state\n\n'
  printf 'Projects: total=%s online=%s offline=%s deploying=%s unknown=%s\n' \
    "$(sm_project_count)" "$(sm_state_count ONLINE)" "$(sm_state_count OFFLINE)" \
    "$(sm_state_count DEPLOYING)" "$(sm_state_count UNKNOWN)"
}

# =========================================================================
# reporting commands
# =========================================================================

sm_cmd_status() {
  sm_disk_read || return 1
  local level
  level="$(sm_level)"
  printf '%-12s %s\n' 'Disk:' "$DISK_PATH"
  printf '%-12s %s\n' 'Size:' "$(sm_mb_human "$SM_DISK_SIZE_MB")"
  printf '%-12s %s\n' 'Used:' "$(sm_mb_human "$SM_DISK_USED_MB") (${SM_DISK_PCT}%)"
  printf '%-12s %s\n' 'Free:' "$(sm_mb_human "$SM_DISK_FREE_MB")"
  printf '%-12s %s GB\n' 'Target free:' "$TARGET_FREE_GB"
  printf '%-12s %s (%s)\n' 'Status:' "$(sm_status_word "$level")" "$(sm_level_name "$level")"
  if [ -f "$STATE_DIR/last-run" ]; then
    printf '%-12s %s\n' 'Last run:' "$(cat "$STATE_DIR/last-run" 2>/dev/null)"
  else
    printf '%-12s %s\n' 'Last run:' 'never (or state directory not writable)'
  fi
}

sm_write_last_run() {
  [ -d "$STATE_DIR" ] && [ -w "$STATE_DIR" ] || return 0
  printf '%s  mode=%s%s  level=%s  usage=%s%%  free=%s  reclaimed=%s\n' \
    "$(date '+%F %T')" "$SM_MODE" "$([ "$SM_DRY_RUN" = 1 ] && printf '(dry-run)')" \
    "$1" "$SM_DISK_PCT" "$(sm_mb_human "$SM_DISK_FREE_MB")" \
    "$(sm_mb_human "$SM_RECLAIMED_MB")" >"$STATE_DIR/last-run" 2>/dev/null
}

sm_cmd_report() {
  sm_disk_read || return 1
  sm_pm2_load || true
  sm_deploy_scan
  sm_projects_load "${1:-0}"

  local level
  level="$(sm_level)"

  # The reclaimable figures come from running the real decision path in
  # dry-run: the report cannot claim space that cleanup would refuse to take.
  local saved_quiet="$SM_QUIET" saved_mode="$SM_MODE" saved_dry="$SM_DRY_RUN"
  SM_QUIET=1
  SM_DRY_RUN=1
  SM_MODE="report"
  SM_CATEGORY_NAMES=()
  SM_CATEGORY_MB=()
  sm_clean_apt
  sm_clean_journal
  sm_clean_pm2_logs
  sm_clean_nginx_logs
  sm_clean_system_logs
  sm_clean_isr_cache
  sm_clean_temp
  sm_clean_pkg_caches
  SM_QUIET="$saved_quiet"
  SM_MODE="$saved_mode"
  SM_DRY_RUN="$saved_dry"

  sm_rule
  printf ' AUTOMATIC STORAGE MANAGER %s\n' "$SM_VERSION"
  printf ' %s   host %s\n' "$(date '+%F %T')" "$(hostname 2>/dev/null || printf 'unknown')"
  sm_rule
  sm_say ""
  printf '%-14s %s\n' 'Disk' "$DISK_PATH"
  printf '%-14s %s\n' 'Size' "$(sm_mb_human "$SM_DISK_SIZE_MB")"
  printf '%-14s %s\n' 'Used' "$(sm_mb_human "$SM_DISK_USED_MB")"
  printf '%-14s %s\n' 'Free' "$(sm_mb_human "$SM_DISK_FREE_MB")"
  printf '%-14s %s%%\n' 'Usage' "$SM_DISK_PCT"
  printf '%-14s %s (%s)\n' 'Status' "$(sm_status_word "$level")" "$(sm_level_name "$level")"
  printf '%-14s under %s%% used and at least %s GB free\n' 'Target' "$MAX_USAGE_PERCENT" "$TARGET_FREE_GB"
  sm_say ""
  sm_hr
  sm_say "PROJECTS"
  sm_hr
  printf 'Total detected: %s\n\n' "$(sm_project_count)"
  printf '  ONLINE:     %s\n' "$(sm_state_count ONLINE)"
  printf '  OFFLINE:    %s\n' "$(sm_state_count OFFLINE)"
  printf '  DEPLOYING:  %s\n' "$(sm_state_count DEPLOYING)"
  printf '  UNKNOWN:    %s\n' "$(sm_state_count UNKNOWN)"
  printf '\n  PROTECTED:  %s (every discovered project)\n' "$(sm_project_count)"
  sm_say ""
  sm_hr
  sm_say "SAFE RECLAIMABLE (estimate, from a real dry run)"
  sm_hr
  local i total=0
  for i in "${!SM_CATEGORY_NAMES[@]}"; do
    printf '  %-16s %10s\n' "${SM_CATEGORY_NAMES[$i]}" "$(sm_mb_human "${SM_CATEGORY_MB[$i]}")"
    total=$((total + SM_CATEGORY_MB[i]))
  done
  printf '\n  %-16s %10s\n' "TOTAL SAFE" "$(sm_mb_human "$total")"

  # A report that stops here is useless in the situation that matters most: the
  # disk full of application data, safe categories offering nothing. Say so, and
  # say where the space actually is.
  local need=$((TARGET_FREE_GB * 1024 - SM_DISK_FREE_MB))
  if [ "$need" -gt 0 ] && [ "$total" -lt "$need" ]; then
    sm_say ""
    printf '  Safe cleanup cannot reach the target on its own: %s short, %s available.\n' \
      "$(sm_mb_human "$need")" "$(sm_mb_human "$total")"
    sm_say "  The rest of the disk is application data, which is never removed"
    sm_say "  automatically. The largest of it:"
    sm_say ""
    local row dir kind slug state rest size
    while IFS=$'\t' read -r size dir slug state; do
      [ -n "$dir" ] || continue
      printf '    %10s  %-24s %-9s %s\n' "$(sm_mb_human "$size")" "${slug:0:24}" "$state" "$dir"
    done < <(
      for row in "${SM_PROJECT_ROWS[@]:-}"; do
        [ -n "$row" ] || continue
        IFS=$'\t' read -r dir kind slug state rest <<<"$row"
        size="$(printf '%s' "$row" | cut -f12)"
        printf '%s\t%s\t%s\t%s\n' "${size:-0}" "$dir" "$slug" "$state"
      done | sort -rn | head -5
    )
    sm_say ""
    sm_say "  For what is inside those, whether the disk is still filling, which"
    sm_say "  process is writing, and which parts are duplicates:"
    sm_say "      storage-manager investigate"
  fi
  sm_say ""
  sm_hr
  sm_say "PROTECTED — never removed automatically"
  sm_hr
  cat <<'EOF'
  Application source and public assets
  .env and .env.* files
  Git repositories and working trees
  node_modules of every project
  .next of every online project, and any standalone bundle
  Uploads, storage, databases and backups
  nginx configuration and SSL certificates
  PM2 configuration and runtime state
EOF
  sm_say ""
  sm_hr
  sm_say "GUARANTEES"
  sm_hr
  cat <<'EOF'
  0 applications stopped
  0 applications restarted or reloaded
  0 processes killed
  0 project directories deleted
  0 configuration files modified
EOF
  sm_rule
}

sm_cmd_projects() {
  sm_pm2_load || true
  sm_deploy_scan
  sm_projects_load "${1:-0}"
  local row dir kind slug state pm2_name pm2_status pm2_pid restarts branch dirty commit size protect
  printf '%-24s %-8s %-10s %-16s %-9s %-10s %-9s %9s\n' \
    PROJECT KIND STATE 'PM2 APP' 'PM2 STATE' BRANCH 'GIT DIRTY' SIZE
  printf '%s\n' "$(printf '%.0s-' {1..112})"
  for row in "${SM_PROJECT_ROWS[@]:-}"; do
    [ -n "$row" ] || continue
    IFS=$'\t' read -r dir kind slug state pm2_name pm2_status pm2_pid restarts \
      branch dirty commit size protect <<<"$row"
    printf '%-24s %-8s %-10s %-16s %-9s %-10s %-9s %9s\n' \
      "${slug:0:24}" "$kind" "$state" "${pm2_name:0:16}" "${pm2_status:0:9}" \
      "${branch:0:10}" "$dirty" "$(sm_mb_human "$size")"
    printf '    path: %s\n' "$dir"
    printf '    protected: %s\n' "$protect"
  done
  [ "$(sm_project_count)" = 0 ] && sm_say "No projects discovered. Check DISCOVERY_ROOTS in $SM_CONF."
  sm_say ""
  printf 'total=%s online=%s offline=%s deploying=%s unknown=%s protected=%s\n' \
    "$(sm_project_count)" "$(sm_state_count ONLINE)" "$(sm_state_count OFFLINE)" \
    "$(sm_state_count DEPLOYING)" "$(sm_state_count UNKNOWN)" "$(sm_project_count)"
}

sm_cmd_large_files() {
  local force="${1:-0}" cache="$STATE_DIR/large-files.txt" root
  mkdir -p "$STATE_DIR" 2>/dev/null || true
  if [ "$force" = 0 ] && [ -f "$cache" ] &&
    [ -z "$(find "$cache" -maxdepth 0 -mmin "+$LARGE_FILE_SCAN_INTERVAL_MIN" 2>/dev/null)" ]; then
    sm_say "Cached scan from $(date -r "$cache" '+%F %T') (rescan with --force)"
    sm_say ""
    cat "$cache"
    return 0
  fi
  sm_pm2_load || true
  sm_projects_load 0

  local tmp
  tmp="$(mktemp "${TMPDIR:-/tmp}/storage-manager-large.XXXXXX")" || return 1
  {
    printf 'Files larger than %s MB. Nothing here is ever deleted automatically.\n\n' "$LARGE_FILE_MIN_MB"
    printf '%10s  %-12s %-10s %-16s %s\n' SIZE OWNER MODIFIED PROJECT PATH
    while read -r root; do
      [ -d "$root" ] || continue
      sm_nice find "$root" -xdev -type f -size "+${LARGE_FILE_MIN_MB}M" \
        -printf '%s\t%u\t%TY-%Tm-%Td\t%p\n' 2>/dev/null
    done < <(sm_expand "$LARGE_FILE_SCAN_ROOTS") | sort -rn | head -100 |
      while IFS=$'\t' read -r bytes owner mtime path; do
        local project protect open
        project="$(sm_project_for_path "$path")"
        protect="$(sm_large_file_verdict "$path" "$project")"
        open=""
        command -v lsof >/dev/null 2>&1 && [ -n "$(lsof -t -- "$path" 2>/dev/null)" ] && open=" [open]"
        printf '%10s  %-12s %-10s %-16s %s\n' \
          "$(sm_mb_human "$((bytes / 1048576))")" "$owner" "$mtime" "${project:0:16}" "$path$open"
        printf '%10s  %s\n' '' "-> $protect"
      done
  } >"$tmp" 2>/dev/null
  cat "$tmp"
  [ -d "$STATE_DIR" ] && [ -w "$STATE_DIR" ] && mv -f "$tmp" "$cache" 2>/dev/null || rm -f "$tmp"
}

sm_project_for_path() {
  local path="$1" row dir rest
  for row in "${SM_PROJECT_ROWS[@]:-}"; do
    [ -n "$row" ] || continue
    IFS=$'\t' read -r dir rest <<<"$row"
    if sm_path_within "$path" "$dir"; then
      basename -- "$dir"
      return 0
    fi
  done
  printf -- '-'
}

sm_large_file_verdict() {
  local path="$1" project="$2" p
  for p in $PROTECTED_PATHS; do
    sm_path_within "$path" "$p" && {
      printf 'protected: system path %s' "$p"
      return 0
    }
  done
  if sm_name_is_protected "$(basename -- "$path")"; then
    printf 'protected: protected filename'
    return 0
  fi
  if [ "$project" != "-" ]; then
    printf 'protected: belongs to project %s — large does not mean unnecessary' "$project"
    return 0
  fi
  case "$path" in
  */.next/cache/*) printf 'regeneratable cache, but only ever removed for a verified inactive project' ;;
  */node_modules/*) printf 'dependency file, restored by npm ci — opt-in cleanup only' ;;
  *.gz | *.log.[0-9]* | */journal/*) printf 'log data, handled by the log categories' ;;
  *) printf 'review by hand: not a category this program cleans' ;;
  esac
}

# Read-only forensics for the case safe cleanup cannot solve: the disk is full
# of application data. It answers two questions the report deliberately will not
# act on — where the space actually is, and whether something is still writing.
# It deletes nothing and prints the command for each finding instead.
sm_cmd_investigate() {
  local sample="${1:-$INVESTIGATE_SAMPLE_SEC}"
  sm_disk_read || return 1
  local free_before="$SM_DISK_FREE_MB"

  sm_rule
  sm_say " INVESTIGATE — where the space is, and what is taking it"
  sm_say " Read-only. Nothing here is deleted; each finding prints its own fix."
  sm_rule

  # ------------------------------------------------------------------ growth
  sm_say ""
  sm_say "DISK"
  printf '  %s total, %s used, %s free (%s%%)\n' \
    "$(sm_mb_human "$SM_DISK_SIZE_MB")" "$(sm_mb_human "$SM_DISK_USED_MB")" \
    "$(sm_mb_human "$SM_DISK_FREE_MB")" "$SM_DISK_PCT"

  local -A io_before=()
  local pid io_pid bytes
  if [ -r /proc/self/io ]; then
    for pid in /proc/[0-9]*; do
      io_pid="${pid#/proc/}"
      [ -r "$pid/io" ] || continue
      bytes="$(awk '/^write_bytes:/ {print $2}' "$pid/io" 2>/dev/null)"
      [ -n "$bytes" ] && io_before[$io_pid]="$bytes"
    done
  fi

  sleep "$sample"
  sm_disk_read || true
  local delta=$((free_before - SM_DISK_FREE_MB))
  local rate
  rate="$(awk -v d="$delta" -v s="$sample" 'BEGIN { printf "%.1f", (d * 1024) / s }')"
  if [ "$delta" -gt 0 ]; then
    printf '  growth:  %s MB used in %ss  =  %s KB/s still being written\n' \
      "$delta" "$sample" "$rate"
    if [ "$delta" -gt 0 ]; then
      local eta
      eta="$(awk -v free="$SM_DISK_FREE_MB" -v d="$delta" -v s="$sample" \
        'BEGIN { printf "%.0f", (free / d) * s / 60 }')"
      printf '  FULL IN ABOUT %s MINUTES at this rate — find the writer below first\n' "$eta"
    fi
  elif [ "$delta" -lt 0 ]; then
    printf '  trend:   %s MB freed during the %ss sample\n' "$((-delta))" "$sample"
  else
    printf '  trend:   flat over %ss — nothing is writing hard right now\n' "$sample"
  fi

  # ----------------------------------------------------------- top writers
  if [ "${#io_before[@]}" -gt 0 ]; then
    sm_say ""
    sm_say "TOP WRITERS (bytes written during the sample)"
    local out_lines
    out_lines="$(
      for pid in /proc/[0-9]*; do
        io_pid="${pid#/proc/}"
        [ -r "$pid/io" ] || continue
        bytes="$(awk '/^write_bytes:/ {print $2}' "$pid/io" 2>/dev/null)"
        [ -n "$bytes" ] || continue
        local prev="${io_before[$io_pid]:-}"
        [ -n "$prev" ] || continue
        local diff=$((bytes - prev))
        [ "$diff" -gt 0 ] || continue
        local args
        args="$(tr '\0' ' ' <"$pid/cmdline" 2>/dev/null | cut -c1-90)"
        [ -n "$args" ] || args="$(cat "$pid/comm" 2>/dev/null)"
        printf '%s\t%s\t%s\n' "$diff" "$io_pid" "$args"
      done | sort -rn | head -8
    )"
    if [ -n "$out_lines" ]; then
      printf '%s\n' "$out_lines" | while IFS=$'\t' read -r diff io_pid args; do
        printf '  %8s KB/s  pid %-7s %s\n' \
          "$(awk -v d="$diff" -v s="$sample" 'BEGIN { printf "%.0f", d / 1024 / s }')" \
          "$io_pid" "$args"
      done
      sm_say "  A deploy, build or copy at the top of this list is the thing to stop."
      sm_say "  A serving node process near the top is usually writing its own log."
    else
      sm_say "  nothing measurable"
    fi
  else
    sm_say ""
    sm_say "TOP WRITERS: /proc/<pid>/io is unreadable — run this as root to see them"
  fi

  # -------------------------------------------------------- biggest projects
  sm_pm2_load || true
  sm_deploy_scan
  sm_projects_load "${2:-0}"
  sm_say ""
  sm_say "LARGEST PROJECTS (application data — never touched automatically)"
  local row dir kind slug state rest size
  local -a biggest=()
  while IFS=$'\t' read -r size dir slug state; do
    [ -n "$dir" ] || continue
    printf '  %10s  %-26s %-9s %s\n' "$(sm_mb_human "$size")" "${slug:0:26}" "$state" "$dir"
    biggest+=("$dir")
  done < <(
    for row in "${SM_PROJECT_ROWS[@]:-}"; do
      [ -n "$row" ] || continue
      IFS=$'\t' read -r dir kind slug state rest <<<"$row"
      size="$(printf '%s' "$row" | cut -f12)"
      printf '%s\t%s\t%s\t%s\n' "${size:-0}" "$dir" "$slug" "$state"
    done | sort -rn | head -8
  )

  # ------------------------------------------- what is big inside the biggest
  local target="${biggest[0]:-}"
  if [ -n "$target" ]; then
    sm_say ""
    printf 'INSIDE %s (largest first)\n' "$target"
    sm_nice du -xm --max-depth=3 "$target" 2>/dev/null | sort -rn | head -12 |
      while read -r mb path; do
        printf '  %10s  %s\n' "$(sm_mb_human "$mb")" "$path"
      done
  fi

  # ------------------------------------------------ nested standalone bundles
  # A standalone bundle inside another standalone bundle is always an artifact:
  # a prepare step copied its destination into itself, so each build wrapped the
  # previous copy in another layer. Only the outermost bundle is ever served.
  sm_say ""
  sm_say "NESTED STANDALONE BUNDLES (a bundle inside a bundle)"
  local found=0 nested root
  while read -r root; do
    [ -d "$root" ] || continue
    while read -r nested; do
      [ -n "$nested" ] || continue
      found=1
      printf '  %10s  %s\n' "$(sm_mb_human "$(sm_du_mb "$nested")")" "$nested"
    done < <(sm_nice find "$root" -maxdepth 10 -type d \
      -path '*/.next/standalone/.next/standalone' -prune -print 2>/dev/null)
  done < <(sm_expand "$DISCOVERY_ROOTS")
  if [ "$found" = 1 ]; then
    cat <<'EOF'
  These are duplicates of the bundle already being served, and they grow by one
  layer on every build. Only the outermost bundle is ever loaded, so removing
  the nested copies does not affect a running site. This is not done for you:
  it is inside a live project, so it stays an operator decision.

      sudo rm -rf --one-file-system <path from the list above>

  Then fix the cause, or it comes back on the next build: the project's
  prepare/copy step is copying .next/standalone into itself. It must copy
  .next/static and public INTO the bundle, never the bundle into itself.
EOF
  else
    sm_say "  none found"
  fi

  # ------------------------------------------------------------- duplicates
  sm_say ""
  sm_say "DUPLICATE PROJECT DIRECTORIES (same name under more than one root)"
  local -A seen_slug=()
  local dup=0
  for row in "${SM_PROJECT_ROWS[@]:-}"; do
    [ -n "$row" ] || continue
    IFS=$'\t' read -r dir kind slug state rest <<<"$row"
    if [ -n "${seen_slug[$slug]:-}" ]; then
      dup=1
      printf '  %s\n' "$slug"
      printf '      %s\n' "${seen_slug[$slug]}"
      printf '      %s (%s)\n' "$dir" "$state"
    else
      seen_slug[$slug]="$dir ($state)"
    fi
  done
  if [ "$dup" = 1 ]; then
    sm_say "  Two copies of the same site cost twice the disk. Confirm which one PM2"
    sm_say "  actually serves before touching either:"
    sm_say "      pm2 describe <app> | grep -E 'script path|exec cwd'"
  else
    sm_say "  none found"
  fi

  # ------------------------------------------------------- phantom space
  sm_say ""
  sm_say "DELETED BUT STILL OPEN"
  sm_cmd_open_deleted | sed 's/^/  /'

  sm_say ""
  sm_rule
  sm_say " SUGGESTED ORDER OF WORK"
  sm_rule
  cat <<'EOF'
  1. If a copy, build or deploy process is at the top of TOP WRITERS, stop that
     one process. It is not serving traffic; the sites keep running.
  2. Remove any nested standalone bundle listed above. That is usually the whole
     problem, and it is duplicate data by definition.
  3. Re-check:  storage-manager status
  4. Only then consider the duplicate project directories, one at a time, after
     confirming which copy PM2 serves.
  5. When there is headroom again, enable the timer so preventive cleanup keeps
     the disk from reaching this state:
         systemctl enable --now storage-manager.timer
EOF
}

sm_cmd_open_deleted() {
  if ! command -v lsof >/dev/null 2>&1; then
    sm_say "lsof is not installed, so deleted-but-open files cannot be detected."
    sm_say "Install it with: apt-get install -y lsof"
    return 1
  fi
  sm_say "Deleted files still held open. The space is only released when the"
  sm_say "process closes them — and this program never kills a process to do it."
  sm_say ""
  local out
  # lsof appends "(deleted)" after the path, so the path is the field before it.
  out="$(lsof -nP +L1 2>/dev/null | awk 'NR > 1 && $7 + 0 > 10485760 {
    path = ($NF == "(deleted)" && NF > 1) ? $(NF - 1) : $NF
    printf "%-14s %-8s %12.1f MB  %s\n", $1, $2, $7 / 1048576, path
  }' | sort -k3 -rn | head -40)"
  if [ -z "$out" ]; then
    sm_say "None over 10 MB."
    return 0
  fi
  printf '%-14s %-8s %15s  %s\n' PROCESS PID SIZE FILE
  printf '%s\n' "$out"
  sm_say ""
  sm_say "To reclaim this space an operator must restart the listed process at a"
  sm_say "time of their choosing. That is a human decision, not an automatic one."
}

sm_cmd_health() {
  local rc=0 detail
  sm_disk_read
  check() {
    local name="$1" status="$2" note="${3:-}"
    printf '%-22s %-8s %s\n' "$name" "$status" "$note"
    [ "$status" = "FAIL" ] && rc=1
    return 0
  }

  if [ "$SM_DISK_PCT" -gt 0 ]; then
    if [ "$SM_DISK_PCT" -ge "$CRITICAL_USAGE_PERCENT" ]; then
      check DISK WARN "${SM_DISK_PCT}% used, $(sm_mb_human "$SM_DISK_FREE_MB") free"
    else
      check DISK OK "${SM_DISK_PCT}% used, $(sm_mb_human "$SM_DISK_FREE_MB") free"
    fi
  else
    check DISK FAIL "cannot read df for $DISK_PATH"
  fi

  if sm_pm2_load; then
    check PM2 OK "$(sm_pm2_count online) online, $(sm_pm2_count stopped) stopped"
  elif command -v pm2 >/dev/null 2>&1; then
    check PM2 WARN "installed but not answering — every project stays protected"
  else
    check PM2 WARN "not installed — every project stays protected"
  fi

  if command -v nginx >/dev/null 2>&1; then
    if [ "$(id -u)" = 0 ] && nginx -t >/dev/null 2>&1; then
      check NGINX OK "config test passes (read-only check)"
    else
      check NGINX OK "installed (config not tested without root)"
    fi
  else
    check NGINX WARN "not installed"
  fi

  sm_deploy_scan
  sm_projects_load 0
  if [ "$(sm_project_count)" -gt 0 ]; then
    check 'PROJECT DISCOVERY' OK "$(sm_project_count) projects found"
  else
    check 'PROJECT DISCOVERY' WARN "no projects found under: $DISCOVERY_ROOTS"
  fi

  local unit_file="/etc/systemd/system/$SM_PROGRAM.timer"
  if command -v systemctl >/dev/null 2>&1 && systemctl is-system-running >/dev/null 2>&1; then
    if systemctl is-enabled "$SM_PROGRAM.timer" >/dev/null 2>&1; then
      detail="$(systemctl show -p NextElapseUSecRealtime --value "$SM_PROGRAM.timer" 2>/dev/null)"
      check 'SYSTEMD TIMER' OK "enabled${detail:+, next run $detail}"
    elif [ -f "$unit_file" ]; then
      check 'SYSTEMD TIMER' WARN "installed but not enabled (automatic operation is off)"
    else
      check 'SYSTEMD TIMER' WARN "not installed — run install-storage-manager.sh"
    fi
  elif [ -f "$unit_file" ]; then
    # Containers and chroots have systemctl without a reachable systemd.
    check 'SYSTEMD TIMER' WARN "unit installed, but systemd is not reachable from here"
  else
    check 'SYSTEMD TIMER' WARN "not installed and systemd is not reachable"
  fi

  if [ -f "$SM_CONF" ]; then
    if (sm_load_config >/dev/null 2>&1); then
      check CONFIG OK "$SM_CONF"
    else
      check CONFIG FAIL "$SM_CONF is invalid"
    fi
  else
    check CONFIG WARN "$SM_CONF missing — built-in defaults in use"
  fi

  if [ -n "$SM_LOG_FILE" ]; then
    check LOGGING OK "$LOG_DIR"
  else
    check LOGGING WARN "$LOG_DIR is not writable — running without an audit trail"
  fi

  if [ -e "$LOCK_FILE" ] && ! flock -n "$LOCK_FILE" true 2>/dev/null; then
    check LOCK WARN "held: another run is in progress"
  else
    check LOCK OK "free"
  fi

  if [ -d "$STATE_DIR" ] && [ -w "$STATE_DIR" ]; then
    check STATE OK "$STATE_DIR"
  else
    check STATE WARN "$STATE_DIR is not writable — caches disabled, scans run every time"
  fi

  # A second automatic cleaner fighting this one is worth flagging loudly: the
  # legacy cron entry escalates to tiers this program refuses to use.
  if grep -rslE 'disk-guard\.sh|disk-cleanup\.sh' /etc/cron.d /etc/crontab 2>/dev/null | grep -q .; then
    check 'LEGACY CRON' WARN "disk-guard/disk-cleanup cron found — see docs/STORAGE-MANAGER.md"
  else
    check 'LEGACY CRON' OK "no conflicting cleanup cron"
  fi

  sm_say ""
  printf '%s PROJECTS DETECTED\n' "$(sm_project_count)"
  printf '%s PROJECTS PROTECTED\n' "$(sm_project_count)"
  printf 'ONLINE %s   OFFLINE %s   DEPLOYING %s   UNKNOWN %s\n' \
    "$(sm_state_count ONLINE)" "$(sm_state_count OFFLINE)" \
    "$(sm_state_count DEPLOYING)" "$(sm_state_count UNKNOWN)"
  return $rc
}

sm_cmd_explain() {
  sm_disk_read || return 1
  local level category
  level="$(sm_level)"
  sm_rule
  sm_say " Why $SM_PROGRAM would do what it would do"
  sm_rule
  sm_say ""
  printf 'Disk %s is %s%% used with %s free.\n' "$DISK_PATH" "$SM_DISK_PCT" "$(sm_mb_human "$SM_DISK_FREE_MB")"
  printf 'Target: stay under %s%% used and keep at least %s GB free.\n\n' "$MAX_USAGE_PERCENT" "$TARGET_FREE_GB"
  cat <<EOF
Thresholds, in percent used:
  < $WARNING_USAGE_PERCENT            NORMAL           nothing runs
  >= $WARNING_USAGE_PERCENT           PREVENTIVE       apt cache, journal, rotated logs
  >= $CLEANUP_USAGE_PERCENT           SAFE-CLEANUP     + old temp files
  >= $AGGRESSIVE_USAGE_PERCENT           AGGRESSIVE-SAFE  + package caches, logrotate, enabled opt-ins
  >= $CRITICAL_USAGE_PERCENT           CRITICAL         system categories only, opt-ins force-disabled, alert
  >= $EMERGENCY_USAGE_PERCENT           EMERGENCY        system categories only, opt-ins force-disabled, alert

Levels 4 and 5 do LESS than level 3 on purpose. A nearly full disk is when a
wrong deletion is most likely to take a site down, so under real pressure this
program narrows to system-owned data and asks for a human instead.

The free-space target alone can also trigger PREVENTIVE: usage may be under
$WARNING_USAGE_PERCENT% while free space is still below $TARGET_FREE_GB GB.

Right now the level is $(sm_level_name "$level"), so an automatic run would consider:
EOF
  if [ "$level" = 0 ]; then
    sm_say "  (nothing — the disk is healthy)"
  else
    for category in $(sm_categories_for_level "$level"); do
      printf '  %s\n' "$category"
    done
  fi
  cat <<EOF

In auto mode each category is followed by a fresh df, and the run stops as soon
as usage is under $MAX_USAGE_PERCENT% and free space is at least $TARGET_FREE_GB GB.

Never done, at any level, for any reason:
  stop, restart, reload, kill or signal PM2, nginx or node
  npm install / npm ci / npm run build / next build
  git pull / reset / clean / checkout
  delete .env, .git, uploads, databases, backups, public assets or source
  delete node_modules or .next of an online, deploying or unknown project
  modify nginx config, SSL certificates, DNS or the firewall
  reboot

Project-level cleanup is opt-in and currently:
  ALLOW_ONLINE_CACHE_TRIM=$ALLOW_ONLINE_CACHE_TRIM
    .next/cache cap        ${ISR_CACHE_MAX_MB} MB
    rendered pages cap     ${PRERENDER_CACHE_MAX_MB} MB
  ALLOW_NEXT_CACHE_CLEANUP=$ALLOW_NEXT_CACHE_CLEANUP
  ALLOW_NEXT_BUILD_CLEANUP=$ALLOW_NEXT_BUILD_CLEANUP
  ALLOW_NODE_MODULES_CLEANUP=$ALLOW_NODE_MODULES_CLEANUP
  ALLOW_STALE_RELEASE_CLEANUP=$ALLOW_STALE_RELEASE_CLEANUP

Even when enabled, a project must be OFFLINE, not deploying, git-clean, not
critical, and have a manifest plus a lock file before anything of its own is
touched. Anything uncertain is skipped and logged.
EOF
  sm_rule
}

sm_cmd_logs() {
  local n="${1:-60}"
  [ -n "$SM_LOG_FILE" ] && [ -f "$SM_LOG_FILE" ] || {
    sm_say "No log yet at $LOG_DIR/$SM_PROGRAM.log"
    return 1
  }
  tail -n "$n" "$SM_LOG_FILE"
}

sm_cmd_pm2_logrotate() {
  local apply="${1:-0}"
  command -v pm2 >/dev/null 2>&1 || {
    sm_say "pm2 is not installed."
    return 1
  }
  if pm2 describe pm2-logrotate >/dev/null 2>&1; then
    sm_say "pm2-logrotate is installed. Current settings:"
    pm2 conf pm2-logrotate 2>/dev/null | sed 's/^/  /'
    return 0
  fi
  if [ "$apply" != 1 ]; then
    sm_say "pm2-logrotate is NOT installed, so PM2 logs can grow without limit."
    sm_say "Install and configure it with:"
    sm_say "  storage-manager pm2-logrotate --apply"
    sm_say ""
    sm_say "This installs a PM2 module and sets its options. It does not restart,"
    sm_say "reload or stop any application."
    return 0
  fi
  SM_DRY_RUN=0
  SM_MODE=admin
  sm_run pm2_logs "install the pm2-logrotate module" pm2 install pm2-logrotate
  sm_run pm2_logs "cap each log at 10M" pm2 set pm2-logrotate:max_size 10M
  sm_run pm2_logs "keep 3 rotations" pm2 set pm2-logrotate:retain 3
  sm_run pm2_logs "compress rotations" pm2 set pm2-logrotate:compress true
  sm_run pm2_logs "check every 60s" pm2 set pm2-logrotate:workerInterval 60
}

sm_usage() {
  sed -n '2,26p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
}

# =========================================================================
# entry point
# =========================================================================

sm_main() {
  local command="${1:-status}"
  shift || true

  sm_load_config || exit 2
  sm_log_init

  local force=0
  case "$command" in
  status) sm_cmd_status ;;
  report)
    for arg in "$@"; do [ "$arg" = "--force" ] && force=1; done
    SM_DRY_RUN=1
    sm_cmd_report "$force"
    ;;
  projects)
    for arg in "$@"; do [ "$arg" = "--force" ] && force=1; done
    SM_DRY_RUN=1
    sm_cmd_projects "$force"
    ;;
  cleanup)
    # Two independent flags: which categories to consider, and whether to act.
    # Acting has to be asked for, and --dry-run wins whatever the order.
    local explicit=0 dry_asked=0
    SM_MODE="auto"
    SM_DRY_RUN=1
    for arg in "$@"; do
      case "$arg" in
      --dry-run | -n) dry_asked=1 ;;
      --safe)
        SM_MODE="safe"
        explicit=1
        ;;
      --full)
        SM_MODE="full"
        explicit=1
        ;;
      --auto)
        SM_MODE="auto"
        explicit=1
        ;;
      --quiet) SM_QUIET=1 ;;
      *)
        printf 'unknown option for cleanup: %s\n' "$arg" >&2
        return 2
        ;;
      esac
    done
    if [ "$explicit" = 1 ] && [ "$dry_asked" = 0 ]; then
      SM_DRY_RUN=0
    fi
    if [ "$explicit" = 0 ] && [ "$SM_DRY_RUN" = 1 ]; then
      sm_say "No mode given, so this is a dry run. Use --safe, --auto or --full to act."
      sm_say ""
    fi
    sm_locked_cleanup
    return $?
    ;;
  large-files)
    for arg in "$@"; do [ "$arg" = "--force" ] && force=1; done
    sm_cmd_large_files "$force"
    ;;
  investigate)
    for arg in "$@"; do [ "$arg" = "--force" ] && force=1; done
    local sample="$INVESTIGATE_SAMPLE_SEC"
    for arg in "$@"; do
      case "$arg" in --sample=*) sample="${arg#--sample=}" ;; esac
    done
    SM_DRY_RUN=1
    sm_cmd_investigate "$sample" "$force"
    ;;
  open-deleted | deleted-open) sm_cmd_open_deleted ;;
  health) sm_cmd_health ;;
  explain) sm_cmd_explain ;;
  config)
    sm_say "# effective configuration (file: $SM_CONF$([ -f "$SM_CONF" ] || printf ' — missing, using defaults'))"
    sm_effective_config
    ;;
  logs) sm_cmd_logs "${1:-60}" ;;
  pm2-logrotate)
    local apply=0
    for arg in "$@"; do [ "$arg" = "--apply" ] && apply=1; done
    sm_cmd_pm2_logrotate "$apply"
    ;;
  version) printf '%s %s\n' "$SM_PROGRAM" "$SM_VERSION" ;;
  help | -h | --help) sm_usage ;;
  *)
    printf 'unknown command: %s\n\n' "$command" >&2
    sm_usage >&2
    return 2
    ;;
  esac
}

# Only one instance may act at a time. A second one exits quietly rather than
# racing the first.
sm_locked_cleanup() {
  mkdir -p "$(dirname -- "$LOCK_FILE")" 2>/dev/null || true
  # Probe first: a failed redirection on `exec` would terminate the shell.
  if ! : >>"$LOCK_FILE" 2>/dev/null; then
    sm_log WARN "cannot open lock file $LOCK_FILE — running without a lock"
    sm_cleanup
    return $?
  fi
  exec 9>>"$LOCK_FILE"
  if ! flock -n 9; then
    sm_log INFO "another $SM_PROGRAM run holds $LOCK_FILE — exiting without doing anything"
    sm_say "Another $SM_PROGRAM run is in progress. Exiting safely."
    return 0
  fi
  sm_cleanup
  local rc=$?
  flock -u 9
  return $rc
}

sm_main "$@"
