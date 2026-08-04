#!/usr/bin/env bash
# Read-only disk forensics for a multi-site Next.js VPS.
# Answers "which of my 7 sites ate 200 GB, and what inside it".
#
#   sudo bash deploy/disk-audit.sh            # full report
#   sudo bash deploy/disk-audit.sh --quick    # skip the slow whole-disk walks
set -uo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

QUICK=0
[ "${1:-}" = "--quick" ] && QUICK=1

hr() { printf '\n────────────────────────────────────────────────────────\n%s\n\n' "$1"; }

hr "1. Filesystem usage"
df -h -x tmpfs -x devtmpfs 2>/dev/null || df -h

hr "2. Inode usage (a full inode table looks like a full disk)"
df -i -x tmpfs -x devtmpfs 2>/dev/null || df -i

hr "3. Deleted-but-still-open files"
# The classic phantom: someone rm'd a 200 GB log but node still holds the fd,
# so du shows nothing and df shows the disk full. Fix = restart that process.
if command -v lsof >/dev/null 2>&1; then
  lsof -nP +L1 2>/dev/null | awk 'NR==1 || $7+0 > 104857600 {print}' |
    awk '{ if (NR==1) print; else printf "%-12s %-8s %10.1f MB  %s\n", $1, $2, $7/1048576, $NF }'
  info "(nothing above the header means no large phantom files)"
else
  warn "lsof not installed — skipping. apt install lsof"
fi

hr "4. Top-level directories on the root filesystem"
du -x -h --max-depth=1 / 2>/dev/null | sort -rh | head -20

hr "5. Usual suspects"
for p in \
  /var/lib/docker /var/lib/containerd /var/lib/snapd \
  /var/log /var/log/journal /var/log/nginx \
  /root/.npm /root/.cache /root/.pm2/logs /home \
  /var/lib/postgresql /var/backups /tmp /var/tmp \
  "$AP_ROOT" /var/www; do
  [ -e "$p" ] && printf '%8s  %s\n' "$(size_of "$p")" "$p"
done

hr "6. Per-site breakdown"
scan_site() {
  local dir="$1" label="$2"
  printf '%s  %s\n' "$(printf '%8s' "$(size_of "$dir")")" "$label"
  local sub
  for sub in node_modules .next .next/cache .next/standalone .git \
    build releases shared shared/cache shared/logs public; do
    [ -e "$dir/$sub" ] || continue
    printf '          %8s  %s\n' "$(size_of "$dir/$sub")" "$sub"
  done
}

found=0
while read -r slug; do
  [ -n "$slug" ] || continue
  found=1
  scan_site "$(site_dir "$slug")" "$slug  [registry]"
done < <(list_slugs)

# Also scan un-migrated sites sitting in the classic locations.
for base in /var/www /srv/sites /opt/sites /home/*/apps; do
  [ -d "$base" ] || continue
  for dir in "$base"/*; do
    [ -d "$dir" ] || continue
    case "$dir" in "$AP_ROOT"/*) continue ;; esac
    found=1
    scan_site "$dir" "$dir"
  done
done
[ "$found" = 1 ] || info "no site directories found — set AP_ROOT or check paths"

hr "7. PM2"
if command -v pm2 >/dev/null 2>&1; then
  pm2 status 2>/dev/null || true
  printf '\nPM2 log sizes:\n'
  for d in /root/.pm2/logs /home/*/.pm2/logs "$AP_ROOT"/*/shared/logs; do
    [ -d "$d" ] || continue
    du -sh "$d" 2>/dev/null
    find "$d" -type f -size +50M -printf '    %10s bytes  %p\n' 2>/dev/null |
      sort -rn | head -10
  done
  pm2 describe pm2-logrotate >/dev/null 2>&1 ||
    warn "pm2-logrotate NOT installed — PM2 logs grow without limit. Run deploy/server-setup.sh"
else
  warn "pm2 not on PATH"
fi

hr "8. Docker / containerd (should be absent on the PM2 setup)"
if command -v docker >/dev/null 2>&1; then
  docker system df 2>/dev/null || warn "docker present but not responding"
  warn "Docker is installed. If you migrated to PM2, reclaim with: docker system prune -af --volumes"
else
  info "docker not installed (good — no /var/lib/containerd growth)"
fi

hr "9. Logs and journal"
command -v journalctl >/dev/null 2>&1 && journalctl --disk-usage 2>/dev/null
find /var/log -type f -size +100M -printf '%10s bytes  %p\n' 2>/dev/null | sort -rn | head -15

hr "10. PostgreSQL"
if command -v psql >/dev/null 2>&1; then
  sudo -u postgres psql -Atc \
    "select pg_size_pretty(pg_database_size(datname)) || '  ' || datname
     from pg_database order by pg_database_size(datname) desc;" 2>/dev/null ||
    warn "could not query postgres sizes (run as a user that can sudo -u postgres)"
else
  info "psql not present — DB may be managed/remote"
fi

if [ "$QUICK" = 0 ]; then
  hr "11. Every file larger than 1 GB (slow)"
  find / -xdev -type f -size +1G -printf '%10s bytes  %p\n' 2>/dev/null |
    sort -rn | head -30

  hr "12. Largest directories anywhere (slow)"
  du -x --max-depth=4 / 2>/dev/null | sort -rn | head -30 |
    awk '{ printf "%8.1f GB  %s\n", $1/1048576, $2 }'
fi

hr "Done"
cat <<'EOF'
Reading the report:

  Section 3 non-empty ......... phantom deleted file; restart the listed process
  Section 6 huge .next/cache .. build + ISR + image cache; safe to delete
  Section 6 huge node_modules . not needed at runtime with output:"standalone"
  Section 7 huge PM2 logs ..... install pm2-logrotate (server-setup.sh)
  Section 8 docker non-zero ... old images/volumes; prune them
  Section 9 huge journal ...... cap SystemMaxUse (server-setup.sh)

Reclaim with:  sudo bash deploy/disk-cleanup.sh --dry-run
EOF
