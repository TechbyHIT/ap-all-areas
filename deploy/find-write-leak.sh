#!/usr/bin/env bash
# Find which process is writing to disk, and where, by sampling the kernel's
# per-process I/O counters. Answers "what is filling the disk at MB/s".
#
#   sudo bash deploy/find-write-leak.sh              # sample for 60s
#   sudo bash deploy/find-write-leak.sh --duration 120
#
# Needs no extra packages: /proc/<pid>/io is maintained by the kernel. Run it
# while the disk is actually growing, and give it at least 60s so short bursts
# do not dominate the average.
set -uo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

DURATION=60
while [ $# -gt 0 ]; do
  case "$1" in
  --duration)
    DURATION="$2"
    shift 2
    ;;
  -h | --help)
    sed -n '2,12p' "$0"
    exit 0
    ;;
  *) die "unknown option: $1" ;;
  esac
done

[ "$(id -u)" = 0 ] || die "run as root — /proc/<pid>/io is not readable otherwise"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

hr() { printf '\n──── %s ────\n' "$1"; }

# write_bytes is what actually reached storage, per process.
snapshot_io() {
  local d pid wb
  for d in /proc/[0-9]*; do
    pid="${d#/proc/}"
    [ -r "$d/io" ] || continue
    wb="$(awk '/^write_bytes:/ {print $2; exit}' "$d/io" 2>/dev/null)" || continue
    [ -n "$wb" ] || continue
    printf '%s %s\n' "$pid" "$wb"
  done
}

proc_name() {
  local pid="$1" comm args
  comm="$(cat "/proc/$pid/comm" 2>/dev/null || echo '?')"
  args="$(tr '\0' ' ' <"/proc/$pid/cmdline" 2>/dev/null | cut -c1-70)"
  [ -n "$args" ] && printf '%s' "$args" || printf '%s' "$comm"
}

proc_rss_mb() {
  awk '/^VmRSS:/ {printf "%d", $2/1024; exit}' "/proc/$1/status" 2>/dev/null || printf '0'
}

# The largest file this process currently holds open, which is usually the thing
# it is filling. Deleted files are flagged: those hold disk that rm cannot free.
biggest_open_file() {
  local pid="$1" fd target size best_size=0 best=""
  for fd in "/proc/$pid/fd"/*; do
    target="$(readlink "$fd" 2>/dev/null)" || continue
    case "$target" in /*) ;; *) continue ;; esac
    size="$(stat -Lc %s "$fd" 2>/dev/null)" || continue
    case "$size" in *[!0-9]* | '') continue ;; esac
    if [ "$size" -gt "$best_size" ]; then
      best_size="$size"
      best="$target"
    fi
  done
  [ -n "$best" ] && printf '%s MB  %s' "$((best_size / 1048576))" "$best"
}

# Directories worth watching for growth during the sample.
watch_dirs() {
  local d
  for d in /root/.pm2/logs /var/log /var/log/journal /var/lib/docker \
    /var/lib/containerd /var/lib/postgresql /tmp; do
    [ -d "$d" ] && printf '%s\n' "$d"
  done
  for d in "$AP_ROOT"/*/shared/cache "$AP_ROOT"/*/shared/logs \
    /var/www/*/.next/cache /srv/*/.next/cache; do
    [ -d "$d" ] && printf '%s\n' "$d"
  done
}

hr "Baseline"
df -h / | awk 'NR==2 {printf "    / %s full, %s free\n", $(NF-1), $(NF-2)}'
FREE_BEFORE_MB="$(df -Pm / | awk 'NR==2 {print $(NF-2)}')"
printf '    top CPU right now:\n'
ps -eo pcpu,pmem,rss,comm --sort=-pcpu 2>/dev/null | head -6 |
  awk '{printf "      %5s%%cpu %5s%%mem %7.0fMB  %s\n", $1, $2, $3/1024, $4}'

log "Sampling disk writes for ${DURATION}s — leave this running"

snapshot_io | sort >"$TMP/io_before"
watch_dirs | while read -r d; do
  printf '%s %s\n' "$(size_mb "$d")" "$d"
done >"$TMP/dirs_before"

sleep "$DURATION"

snapshot_io | sort >"$TMP/io_after"
watch_dirs | while read -r d; do
  printf '%s %s\n' "$(size_mb "$d")" "$d"
done >"$TMP/dirs_after"

hr "Top writers over ${DURATION}s"
join "$TMP/io_before" "$TMP/io_after" 2>/dev/null |
  awk -v dur="$DURATION" '{ delta = $3 - $2; if (delta > 0) printf "%d %s\n", delta, $1 }' |
  sort -rn | head -10 >"$TMP/top"

if [ ! -s "$TMP/top" ]; then
  info "no process wrote anything measurable — the disk may not be growing now"
  info "re-run while the graph is climbing"
else
  printf '    %-12s %-9s %-8s %s\n' "MB WRITTEN" "MB/s" "RSS" "PROCESS"
  while read -r delta pid; do
    mb=$((delta / 1048576))
    rate="$(awk -v d="$delta" -v t="$DURATION" 'BEGIN {printf "%.2f", d/1048576/t}')"
    printf '    %-12s %-9s %-8s %s\n' "$mb" "$rate" "$(proc_rss_mb "$pid")MB" "$(proc_name "$pid")"
    open="$(biggest_open_file "$pid")"
    [ -n "$open" ] && printf '                 largest open file: %s\n' "$open"
  done <"$TMP/top"
fi

hr "Directories that grew"
join -j 2 <(sort -k2 "$TMP/dirs_before") <(sort -k2 "$TMP/dirs_after") 2>/dev/null |
  awk '{ growth = $3 - $2; if (growth > 0) printf "%d %s\n", growth, $1 }' |
  sort -rn | head -12 | awk '{ printf "    +%-8s MB  %s\n", $1, $2 }'

FREE_AFTER_MB="$(df -Pm / | awk 'NR==2 {print $(NF-2)}')"
USED_MB=$((FREE_BEFORE_MB - FREE_AFTER_MB))
hr "Disk delta"
printf '    free: %s MB -> %s MB (%s MB consumed in %ss)\n' \
  "$FREE_BEFORE_MB" "$FREE_AFTER_MB" "$USED_MB" "$DURATION"
if [ "$USED_MB" -gt 0 ]; then
  awk -v u="$USED_MB" -v t="$DURATION" \
    'BEGIN {printf "    rate: %.2f MB/s, %.1f GB/hour\n", u/t, u*3600/t/1024}'
fi

hr "Deleted files still held open"
# Space in these cannot be freed by rm — only by restarting the holder or
# truncating the file in place with `: > file`.
found=0
for d in /proc/[0-9]*; do
  pid="${d#/proc/}"
  for fd in "$d/fd"/*; do
    target="$(readlink "$fd" 2>/dev/null)" || continue
    case "$target" in *"(deleted)"*) ;; *) continue ;; esac
    size="$(stat -Lc %s "$fd" 2>/dev/null)" || continue
    case "$size" in *[!0-9]* | '') continue ;; esac
    [ "$size" -lt 104857600 ] && continue
    found=1
    printf '    %6s MB  pid %-7s %-24s %s\n' \
      "$((size / 1048576))" "$pid" "$(cat "$d/comm" 2>/dev/null)" "$target"
  done
done
[ "$found" = 0 ] && info "none over 100 MB"

hr "Interpreting this"
cat <<'EOF'
    Match the top writer against the directory that grew:

    log file under .pm2/logs ....... the app is logging in a loop. Read it:
                                     pm2 logs <app> --lines 100
    .next/cache/images ............. Next.js is transcoding images on demand.
                                     High CPU plus steady writes points here.
                                     Fix by narrowing images.deviceSizes /
                                     imageSizes, or pre-sizing the source files.
    .next/cache/fetch-cache ........ ISR revalidation churn. Check `revalidate`
                                     values are not near zero.
    /var/lib/docker ................ leftover container layers: prune them
    /var/log/journal ............... uncapped journal: server-setup.sh caps it
    postgresql ..................... WAL or a table growing; check autovacuum

    A process with RSS far above ~120 MB is also worth restarting on its own:
      pm2 restart <app>
    and if RSS climbs straight back, cap it so PM2 recycles it automatically:
      MAX_MEMORY=400M in /etc/ap-sites/sites.d/<slug>.env
EOF
