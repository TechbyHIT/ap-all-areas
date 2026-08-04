#!/usr/bin/env bash
# Triage "502 Bad Gateway on every site". Works whether or not the sites have
# been migrated into the registry layout.
#
#   sudo bash deploy/emergency-502.sh          # diagnose only, changes nothing
#   sudo bash deploy/emergency-502.sh --fix    # free space and restart the stack
#
# A 502 means nginx is up but the Node process behind it is not answering. This
# checks the five reasons that take down every site at once, in the order they
# actually cause outages, and prints a ranked verdict.
set -uo pipefail

LIB="$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"
if [ -f "$LIB" ]; then
  # shellcheck disable=SC1090
  . "$LIB"
else
  AP_ROOT="${AP_ROOT:-/srv/sites}"
  log() { printf '==> %s\n' "$*"; }
  info() { printf '    %s\n' "$*"; }
  warn() { printf 'WARN: %s\n' "$*" >&2; }
  list_slugs() { :; }
fi

FIX=0
[ "${1:-}" = "--fix" ] && FIX=1

# Ranked findings, most likely root cause first.
VERDICT=()
add_verdict() { VERDICT+=("$1"); }

hr() { printf '\n──── %s ────\n' "$1"; }

# ------------------------------------------------------------------ 1. disk
hr "1. Disk"
# Columns are counted from the right: the mount point is last, so capacity is
# NF-1 and available is NF-2. Indexing from the left breaks on filesystem names
# that contain spaces.
df -h / | awk 'NR==2 {printf "    / is %s full — %s free of %s\n", $(NF-1), $(NF-2), $(NF-4)}'
DISK_PCT="$(df -P / | awk 'NR==2 {gsub(/%/, "", $(NF-1)); print $(NF-1)+0}')"

if [ "$DISK_PCT" -ge 98 ]; then
  add_verdict "DISK FULL (${DISK_PCT}%). Node cannot write, Postgres shuts down to protect its WAL, and every app crashes on boot. This alone explains 502 on all sites."
elif [ "$DISK_PCT" -ge 90 ]; then
  add_verdict "Disk at ${DISK_PCT}% — close enough to full to be the cause within the hour."
fi

# Space held by deleted files is invisible to du and is NOT freed by rm.
if command -v lsof >/dev/null 2>&1; then
  PHANTOM_MB="$(lsof -nP +L1 2>/dev/null | awk '$7+0 > 0 {s+=$7} END {printf "%d", s/1048576}')"
  [ -n "$PHANTOM_MB" ] && [ "$PHANTOM_MB" -gt 500 ] 2>/dev/null && {
    info "${PHANTOM_MB} MB is held by deleted-but-open files:"
    lsof -nP +L1 2>/dev/null | awk '$7+0 > 104857600 {printf "      %-10s pid %-7s %8.1f MB  %s\n", $1, $2, $7/1048576, $NF}'
    add_verdict "${PHANTOM_MB} MB is locked in deleted files still held open. 'rm' will not return this space — the writing process must be restarted or the file truncated."
  }
else
  info "lsof not installed (apt install lsof) — cannot check for deleted-but-open files"
fi

printf '\n    Largest log files:\n'
find /root/.pm2/logs /home/*/.pm2/logs "$AP_ROOT"/*/shared/logs /var/log \
  -type f -size +100M 2>/dev/null |
  head -10 | while read -r f; do
  printf '      %8s  %s\n' "$(du -h "$f" 2>/dev/null | cut -f1)" "$f"
done

# ---------------------------------------------------------------- 2. memory
hr "2. Memory"
free -h 2>/dev/null | sed 's/^/    /'
if command -v dmesg >/dev/null 2>&1; then
  OOM="$(dmesg -T 2>/dev/null | grep -iE 'out of memory|oom-kill' | tail -5)"
  if [ -n "$OOM" ]; then
    printf '\n    Recent OOM kills:\n'
    printf '%s\n' "$OOM" | sed 's/^/      /'
    add_verdict "The kernel OOM killer has been killing processes. Each Next.js app needs ~100-150 MB; too many on this VPS means PM2 restarts them forever."
  fi
fi
SWAP_KB="$(awk '/SwapTotal/ {print $2}' /proc/meminfo 2>/dev/null || echo 0)"
[ "${SWAP_KB:-0}" -eq 0 ] && info "no swap configured — an OOM kill is instant death rather than a slowdown"

# ------------------------------------------------------------------- 3. pm2
hr "3. PM2 processes"
if command -v pm2 >/dev/null 2>&1; then
  pm2 status 2>/dev/null | sed 's/^/    /'
  CRASHY="$(pm2 jlist 2>/dev/null | node -e '
    let raw = "";
    process.stdin.on("data", (c) => (raw += c)).on("end", () => {
      try {
        for (const a of JSON.parse(raw)) {
          const r = a.pm2_env.restart_time || 0;
          const s = a.pm2_env.status;
          if (r > 50 || s !== "online") console.log(`${a.name}\t${s}\t${r}`);
        }
      } catch {}
    });
  ' 2>/dev/null)"
  if [ -n "$CRASHY" ]; then
    printf '\n    Not online, or restarting in a loop:\n'
    printf '%s\n' "$CRASHY" | sed 's/^/      /'
    add_verdict "PM2 apps are crash-looping or stopped. A restart counter in the hundreds means the app throws on boot — that is both the 502 and the log firehose filling the disk."
  fi
else
  add_verdict "pm2 is not on PATH. If PM2 is not running, nothing is listening behind nginx and every site is a 502."
fi

# ------------------------------------------------------- 4. listening ports
hr "4. Ports 3000-3200"
LISTENING="$(ss -ltnH 2>/dev/null | awk '{print $4}' | sed 's/.*://' |
  awk '$1 >= 3000 && $1 <= 3200' | sort -n | tr '\n' ' ')"
if [ -n "$LISTENING" ]; then
  info "listening: $LISTENING"
else
  info "nothing is listening on 3000-3200"
  add_verdict "No Node process is bound to any site port, so nginx has no upstream to reach. This is the direct cause of the 502."
fi

# Anything bound to 0.0.0.0 is publicly reachable, bypassing nginx and TLS.
PUBLIC="$(ss -ltnH 2>/dev/null | awk '$4 ~ /^(0\.0\.0\.0|\*|\[::\]):(3[01][0-9][0-9])$/ {print $4}' | tr '\n' ' ')"
[ -n "$PUBLIC" ] && warn "publicly bound app ports: $PUBLIC — should be 127.0.0.1 only"

# ------------------------------------------------------------- 5. postgres
hr "5. PostgreSQL"
PG_OK=1
if command -v pg_isready >/dev/null 2>&1; then
  if pg_isready -q 2>/dev/null; then
    info "accepting connections"
  else
    PG_OK=0
    info "NOT accepting connections"
    add_verdict "PostgreSQL is down. Every site fails on its first query and crashes, which is why all of them 502 together. Postgres stops itself when the disk fills."
  fi
elif command -v systemctl >/dev/null 2>&1; then
  systemctl is-active --quiet postgresql && info "service active" || {
    PG_OK=0
    add_verdict "The postgresql service is not active."
  }
else
  info "no local postgres detected (managed or remote database?)"
fi
[ "$PG_OK" = 0 ] && command -v journalctl >/dev/null 2>&1 &&
  journalctl -u postgresql -n 8 --no-pager 2>/dev/null | sed 's/^/      /'

# ---------------------------------------------------------------- 6. nginx
hr "6. nginx"
if command -v nginx >/dev/null 2>&1; then
  systemctl is-active --quiet nginx 2>/dev/null &&
    info "service active" || add_verdict "nginx is not running."
  nginx -t 2>&1 | sed 's/^/    /'
  UPSTREAM_ERR="$(grep -hiE 'connect\(\) failed|no live upstreams|upstream prematurely closed' \
    /var/log/nginx/*error*.log 2>/dev/null | tail -5)"
  if [ -n "$UPSTREAM_ERR" ]; then
    printf '\n    Recent upstream errors:\n'
    printf '%s\n' "$UPSTREAM_ERR" | sed 's/^/      /'
  fi
fi

# ----------------------------------------------------------- 7. app errors
hr "7. What the apps are logging"
for f in /root/.pm2/logs/*error*.log "$AP_ROOT"/*/shared/logs/error.log; do
  [ -f "$f" ] || continue
  [ -s "$f" ] || continue
  printf '    --- %s\n' "$f"
  tail -n 6 "$f" 2>/dev/null | sed 's/^/      /'
done

# Known fatal boot errors. These throw at module load, so the process dies
# before it can listen, and PM2 restarts it forever.
scan_logs() { # pattern
  grep -lh "$1" /root/.pm2/logs/*error*.log "$AP_ROOT"/*/shared/logs/error.log 2>/dev/null | head -3
}

if [ -n "$(scan_logs 'DATABASE_URL is not set')" ]; then
  add_verdict "An app is throwing 'DATABASE_URL is not set'. src/lib/prisma.ts builds the client at module load, so a missing .env kills the process on boot before it can listen — every request is a 502 and every restart writes a stack trace. Create shared/.env with DATABASE_URL."
fi
if [ -n "$(scan_logs 'ECONNREFUSED')" ]; then
  add_verdict "An app cannot reach its database (ECONNREFUSED). Check that Postgres is running and that the host and port in DATABASE_URL are right."
fi
if [ -n "$(scan_logs 'EADDRINUSE')" ]; then
  add_verdict "Port already in use (EADDRINUSE). Two PM2 apps are configured on the same PORT, so one of them can never start."
fi
if [ -n "$(scan_logs 'password authentication failed')" ]; then
  add_verdict "Postgres rejected the credentials in DATABASE_URL."
fi
if [ -n "$(scan_logs 'ENOSPC')" ]; then
  add_verdict "An app hit ENOSPC — it could not write because the disk was full."
fi

# --------------------------------------------------------------- verdict
hr "VERDICT"
if [ "${#VERDICT[@]}" -eq 0 ]; then
  info "No single obvious cause found. Check one site by hand:"
  info "  curl -v http://127.0.0.1:3000/     # does the app answer at all?"
  info "  pm2 logs --lines 100"
else
  i=1
  for v in "${VERDICT[@]}"; do
    printf '    %s. %s\n\n' "$i" "$v"
    i=$((i + 1))
  done
fi

# ------------------------------------------------------------------- fix
if [ "$FIX" = 0 ]; then
  cat <<'EOF'
    Nothing was changed. To recover now:

      sudo bash deploy/emergency-502.sh --fix

    That truncates oversized logs (truncating, not deleting, is what actually
    returns space held by open files), vacuums the journal, restarts
    PostgreSQL if it is down, and restarts PM2.
EOF
  exit 0
fi

hr "APPLYING FIXES"

log "Truncating logs over 100 MB"
# ': >' empties the file in place, so space is returned even while a process
# holds it open. Deleting these files would not free anything.
find /root/.pm2/logs /home/*/.pm2/logs "$AP_ROOT"/*/shared/logs /var/log/nginx \
  -type f -name '*.log' -size +100M 2>/dev/null | while read -r f; do
  sz="$(du -h "$f" 2>/dev/null | cut -f1)"
  : >"$f" && info "emptied $f ($sz)"
done

log "Vacuuming the systemd journal to 200 MB"
command -v journalctl >/dev/null 2>&1 && journalctl --vacuum-size=200M >/dev/null 2>&1

log "Clearing build caches"
for base in "$AP_ROOT" /var/www /srv/sites; do
  [ -d "$base" ] || continue
  find "$base" -maxdepth 5 -type d -path '*/.next/cache' -prune \
    -exec rm -rf {} + 2>/dev/null
done

df -h / | awk 'NR==2 {printf "    / now %s full, %s free\n", $(NF-1), $(NF-2)}'

if [ "$PG_OK" = 0 ]; then
  log "Restarting PostgreSQL"
  systemctl restart postgresql 2>/dev/null && sleep 3
  pg_isready -q 2>/dev/null && info "accepting connections" ||
    warn "still down — check: journalctl -u postgresql -n 50"
fi

log "Restarting all PM2 apps"
if command -v pm2 >/dev/null 2>&1; then
  pm2 reset all >/dev/null 2>&1
  pm2 restart all --update-env 2>/dev/null | tail -n 20 | sed 's/^/    /'
  sleep 5
fi

log "Reloading nginx"
nginx -t 2>/dev/null && systemctl reload nginx 2>/dev/null && info "reloaded" ||
  warn "nginx config test failed — not reloaded"

hr "RESULT"
for port in $(seq 3000 3010); do
  ss -ltnH "sport = :$port" 2>/dev/null | grep -q . || continue
  if curl -fsS -o /dev/null -m 5 "http://127.0.0.1:$port/"; then
    printf '    port %s  OK\n' "$port"
  else
    printf '    port %s  still failing\n' "$port"
  fi
done

cat <<'EOF'

    This buys hours, not a fix. The disk refills because something writes a few
    MB per second. Do these next, in order:

      1. pm2 status            — any app with a large restart count is the loop
      2. pm2 logs <app> --lines 100   — read the error it repeats on every boot
      3. Fix that error (usually DATABASE_URL, a failed migration, or a port
         already in use), then:
      4. sudo bash deploy/server-setup.sh   — caps PM2 logs so a repeat costs
         megabytes instead of the whole disk
EOF
