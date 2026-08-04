#!/usr/bin/env bash
# Fleet overview: port, PM2 state, HTTP check and disk per site.
#
#   bash deploy/site-list.sh
#   bash deploy/site-list.sh --no-size   # skip du (much faster on 50 sites)
set -uo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

SHOW_SIZE=1
[ "${1:-}" = "--no-size" ] && SHOW_SIZE=0

printf '%-24s %-26s %-6s %-10s %-6s %-9s %s\n' \
  SLUG DOMAIN PORT PM2 HTTP DISK RELEASE
printf '%.0s─' {1..104}
printf '\n'

total_mb=0
count=0

while read -r slug; do
  [ -n "$slug" ] || continue
  # shellcheck disable=SC2034
  load_site "$slug"
  count=$((count + 1))

  pm2_state="-"
  if command -v pm2 >/dev/null 2>&1; then
    pm2_state="$(pm2 jlist 2>/dev/null |
      node -e '
        let raw = "";
        process.stdin.on("data", (c) => (raw += c)).on("end", () => {
          try {
            const app = JSON.parse(raw).find((a) => a.name === process.argv[1]);
            process.stdout.write(app ? app.pm2_env.status : "stopped");
          } catch {
            process.stdout.write("?");
          }
        });
      ' "$slug" 2>/dev/null || printf '?')"
    [ -n "$pm2_state" ] || pm2_state="stopped"
  fi

  http="down"
  curl -fsS -o /dev/null -m 5 "http://127.0.0.1:$PORT/" 2>/dev/null && http="ok"

  disk="-"
  if [ "$SHOW_SIZE" = 1 ]; then
    mb="$(size_mb "$(site_dir "$slug")")"
    total_mb=$((total_mb + mb))
    disk="${mb}M"
  fi

  release="none"
  target="$(readlink "$(site_dir "$slug")/current" 2>/dev/null || true)"
  [ -n "$target" ] && release="$(basename "$target")"

  printf '%-24s %-26s %-6s %-10s %-6s %-9s %s\n' \
    "$slug" "$DOMAIN" "$PORT" "$pm2_state" "$http" "$disk" "$release"
done < <(list_slugs)

printf '\n'
log "$count site(s) registered"
if [ "$SHOW_SIZE" = 1 ] && [ "$count" -gt 0 ]; then
  info "total site disk: $((total_mb / 1024)) GB (avg $((total_mb / count)) MB per site)"
fi
info "next free port: $(next_free_port)"
df -h / | awk 'NR==2 {printf "    disk /: %s used of %s (%s), %s free\n", $(NF-3), $(NF-4), $(NF-1), $(NF-2)}'
