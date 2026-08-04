#!/usr/bin/env bash
# Reclaim disk on a multi-site Next.js VPS. Safe to run from cron.
#
#   sudo bash deploy/disk-cleanup.sh --dry-run    # show what would go
#   sudo bash deploy/disk-cleanup.sh              # safe tier only
#   sudo bash deploy/disk-cleanup.sh --aggressive # + node_modules, npm cache, docker
#
# Safe tier never touches anything a running site needs: it removes build
# caches, stale releases, oversized runtime caches, rotated logs and temp files.
# Aggressive additionally removes node_modules (rebuilt by `npm ci` on the next
# deploy) and prunes Docker.
set -uo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

DRY_RUN=0
AGGRESSIVE=0
for arg in "$@"; do
  case "$arg" in
  --dry-run | -n) DRY_RUN=1 ;;
  --aggressive) AGGRESSIVE=1 ;;
  -h | --help)
    sed -n '2,12p' "$0"
    exit 0
    ;;
  *) die "unknown option: $arg" ;;
  esac
done

RECLAIMED_MB=0

# Available column is NF-2: the mount point is last, capacity second to last.
before_free_mb() { df -Pm / | awk 'NR==2 {print $(NF-2)}'; }
FREE_BEFORE="$(before_free_mb)"

# drop <path> [reason]
drop() {
  local target="$1" reason="${2:-}" mb
  [ -e "$target" ] || return 0
  mb="$(size_mb "$target")"
  [ "$mb" -gt 0 ] 2>/dev/null || mb=0
  if [ "$DRY_RUN" = 1 ]; then
    printf '    would free %6s MB  %s %s\n' "$mb" "$target" "${reason:+($reason)}"
    return 0
  fi
  rm -rf -- "$target"
  RECLAIMED_MB=$((RECLAIMED_MB + mb))
  printf '    freed      %6s MB  %s %s\n' "$mb" "$target" "${reason:+($reason)}"
}

run() {
  if [ "$DRY_RUN" = 1 ]; then
    printf '    would run: %s\n' "$*"
  else
    "$@" >/dev/null 2>&1 || warn "failed: $*"
  fi
}

[ "$DRY_RUN" = 1 ] && log "DRY RUN — nothing will be deleted"

# ---------------------------------------------------------------- build caches
log "Next.js build caches (.next/cache) — regenerated on next build"
for base in "$AP_ROOT" /var/www /srv/sites; do
  [ -d "$base" ] || continue
  while IFS= read -r cache; do
    case "$cache" in
    */shared/cache | */current/.next/cache) continue ;; # runtime cache, handled below
    esac
    drop "$cache" "build cache"
  done < <(find "$base" -maxdepth 5 -type d -name cache -path '*/.next/*' 2>/dev/null)
  # Turbopack / SWC / webpack scratch dirs
  while IFS= read -r d; do drop "$d" "compiler cache"; done \
    < <(find "$base" -maxdepth 4 -type d \( -name '.turbo' -o -name '.swc' \) 2>/dev/null)
done

# ------------------------------------------------------------ stale releases
log "Stale releases (keeping $AP_KEEP_RELEASES per site)"
# The live release is always kept, so only KEEP_OTHERS non-live ones are held
# back for rollback.
KEEP_OTHERS=$((AP_KEEP_RELEASES - 1))
[ "$KEEP_OTHERS" -lt 0 ] && KEEP_OTHERS=0

while read -r slug; do
  [ -n "$slug" ] || continue
  dir="$(site_dir "$slug")"
  releases="$dir/releases"
  [ -d "$releases" ] || continue

  live="$(readlink -f "$dir/current" 2>/dev/null || true)"
  # If current cannot be resolved we cannot tell which release is serving
  # traffic, so pruning any of them could take the site down. Skip the site.
  if [ -z "$live" ] || [ ! -d "$live" ]; then
    warn "$slug: cannot resolve $dir/current — leaving its releases alone"
    continue
  fi

  kept=0
  # Sorted by name, not mtime: release dirs are timestamps, and mtimes get
  # rewritten by copies and rollbacks.
  while read -r name; do
    [ -n "$name" ] || continue
    old="$releases/$name"
    [ "$(readlink -f "$old")" = "$live" ] && continue
    kept=$((kept + 1))
    [ "$kept" -le "$KEEP_OTHERS" ] && continue
    drop "$old" "old release of $slug"
  done < <(find "$releases" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' 2>/dev/null | sort -r)
done < <(list_slugs)

# --------------------------------------------------------- runtime ISR cache
log "Runtime caches over ${AP_CACHE_MAX_MB} MB (ISR pages + optimised images)"
while read -r slug; do
  [ -n "$slug" ] || continue
  cache="$(site_dir "$slug")/shared/cache"
  [ -d "$cache" ] || continue
  mb="$(size_mb "$cache")"
  if [ "$mb" -gt "$AP_CACHE_MAX_MB" ]; then
    info "$slug runtime cache is ${mb} MB — clearing image + fetch cache"
    drop "$cache/images" "image optimiser cache"
    drop "$cache/fetch-cache" "fetch cache"
  fi
done < <(list_slugs)

# ------------------------------------------------------------------- PM2 logs
log "PM2 logs"
if command -v pm2 >/dev/null 2>&1; then
  # flush truncates the active logs; rotated .gz files are deleted outright.
  run pm2 flush
  for d in /root/.pm2/logs /home/*/.pm2/logs "$AP_ROOT"/*/shared/logs; do
    [ -d "$d" ] || continue
    while IFS= read -r f; do drop "$f" "rotated log"; done \
      < <(find "$d" -type f \( -name '*.gz' -o -name '*__*.log' \) -mtime +3 2>/dev/null)
  done
fi

# ---------------------------------------------------------- system logs, temp
log "System logs, journal and temp files"
command -v journalctl >/dev/null 2>&1 && run journalctl --vacuum-size=300M
while IFS= read -r f; do drop "$f" "old log"; done \
  < <(find /var/log -type f \( -name '*.gz' -o -name '*.1' -o -name '*.old' \) -mtime +7 2>/dev/null)
while IFS= read -r f; do drop "$f" "stale temp"; done \
  < <(find /tmp /var/tmp -mindepth 1 -maxdepth 1 -mtime +7 2>/dev/null)
drop /var/cache/apt/archives "apt package cache"

# ------------------------------------------------------------------ aggressive
if [ "$AGGRESSIVE" = 1 ]; then
  log "AGGRESSIVE: node_modules — restored by npm ci on the next deploy"
  for base in "$AP_ROOT" /var/www /srv/sites; do
    [ -d "$base" ] || continue
    while IFS= read -r nm; do
      # Never touch the node_modules bundled inside a live standalone release.
      case "$nm" in */current/* | */releases/*) continue ;; esac
      drop "$nm" "rebuildable"
    done < <(find "$base" -maxdepth 4 -type d -name node_modules -prune 2>/dev/null)
  done

  log "AGGRESSIVE: package manager caches"
  for c in /root/.npm/_cacache /home/*/.npm/_cacache /root/.cache/yarn /root/.cache/ms-playwright; do
    drop "$c" "package cache"
  done

  if command -v docker >/dev/null 2>&1; then
    log "AGGRESSIVE: Docker images, containers, volumes and build cache"
    run docker system prune -af --volumes
    run docker builder prune -af
  fi
fi

# ---------------------------------------------------------------------- report
FREE_AFTER="$(before_free_mb)"
log "Result"
if [ "$DRY_RUN" = 1 ]; then
  info "dry run — re-run without --dry-run to reclaim the space listed above"
else
  info "removed by this script: ${RECLAIMED_MB} MB"
  info "free on / : ${FREE_BEFORE} MB -> ${FREE_AFTER} MB"
fi
df -h /
