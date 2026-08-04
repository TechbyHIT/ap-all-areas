#!/usr/bin/env bash
# One-time VPS setup for the multi-site PM2 fleet. Idempotent — safe to re-run.
#
#   sudo bash deploy/server-setup.sh
#
# This is the part that stops disk usage running away again: unbounded PM2 logs,
# an uncapped systemd journal and unrotated nginx logs are the three things that
# most often turn a 200 GB disk into a full one.
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

[ "$(id -u)" = 0 ] || die "run as root (sudo bash deploy/server-setup.sh)"
require_cmd node
require_cmd npm

log "Creating directories"
mkdir -p /etc/ap-sites/sites.d "$AP_ROOT" /var/lock
chmod 755 /etc/ap-sites

log "Installing fleet config to $AP_CONFIG_FILE"
if [ ! -f "$AP_CONFIG_FILE" ]; then
  cat >"$AP_CONFIG_FILE" <<EOF
# Fleet-wide settings, read by every script in deploy/.
AP_ROOT=$AP_ROOT
AP_REGISTRY=/etc/ap-sites/sites.d
AP_PORT_BASE=3000
AP_PORT_MAX=3200
# Releases kept per site (1 saves ~250 MB per site, at the cost of instant rollback).
AP_KEEP_RELEASES=2
# Per-site runtime cache ceiling in MB, enforced by disk-cleanup.sh.
AP_CACHE_MAX_MB=512
AP_NODE_MAX_OLD_SPACE=2048
EOF
else
  info "already present, leaving as-is"
fi

log "Installing PM2 ecosystem to /etc/ap-sites/ecosystem.multisite.cjs"
install -m 644 "$AP_DEPLOY_DIR/ecosystem.multisite.cjs" \
  /etc/ap-sites/ecosystem.multisite.cjs

log "Installing deploy scripts to /opt/ap-deploy"
mkdir -p /opt/ap-deploy/lib
install -m 755 "$AP_DEPLOY_DIR"/*.sh /opt/ap-deploy/
install -m 644 "$AP_DEPLOY_DIR/lib/sites.sh" /opt/ap-deploy/lib/sites.sh
install -m 644 "$AP_DEPLOY_DIR/nginx-site.conf.template" /opt/ap-deploy/
info "fleet commands can now be run from /opt/ap-deploy regardless of checkout"

# ------------------------------------------------------------------------- pm2
if ! command -v pm2 >/dev/null 2>&1; then
  log "Installing PM2 globally"
  npm install -g pm2
fi

log "Configuring pm2-logrotate (the #1 cause of runaway disk)"
pm2 install pm2-logrotate >/dev/null 2>&1 || warn "pm2 install pm2-logrotate failed"
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 3
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:workerInterval 60
pm2 set pm2-logrotate:rotateInterval '0 2 * * *'
info "PM2 logs capped at ~10 MB x 3 rotations per app"

log "Enabling PM2 on boot"
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || warn "run 'pm2 startup' manually"

# -------------------------------------------------------------------- journald
log "Capping the systemd journal at 300 MB"
mkdir -p /etc/systemd/journald.conf.d
cat >/etc/systemd/journald.conf.d/ap-sites.conf <<'EOF'
[Journal]
SystemMaxUse=300M
SystemMaxFileSize=50M
MaxRetentionSec=2week
EOF
systemctl restart systemd-journald 2>/dev/null || warn "restart systemd-journald manually"

# ------------------------------------------------------------------- logrotate
log "Adding logrotate rules for nginx and site logs"
cat >/etc/logrotate.d/ap-sites <<EOF
$AP_ROOT/*/shared/logs/*.log {
    daily
    rotate 3
    maxsize 10M
    missingok
    notifempty
    compress
    delaycompress
    copytruncate
}

/var/log/nginx/*.log {
    daily
    rotate 5
    maxsize 20M
    missingok
    notifempty
    compress
    delaycompress
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 \$(cat /var/run/nginx.pid) || true
    endscript
}
EOF

# ----------------------------------------------------------------------- nginx
if command -v nginx >/dev/null 2>&1; then
  log "Tuning nginx for many vhosts"
  mkdir -p /etc/nginx/conf.d
  # Default bucket/hash sizes overflow somewhere around 30-40 server_names.
  cat >/etc/nginx/conf.d/00-ap-sites.conf <<'EOF'
# Managed by deploy/server-setup.sh — sized for 50+ vhosts.
server_names_hash_bucket_size 128;
server_names_hash_max_size 2048;
proxy_headers_hash_bucket_size 128;
types_hash_max_size 4096;

# Shared proxy cache is deliberately NOT enabled here: on a 200 GB disk with 50
# sites, per-site Next.js caching plus immutable asset headers is the safer
# trade-off. Enable it only with a hard max_size.
EOF
  nginx -t 2>/dev/null && systemctl reload nginx || warn "nginx -t failed, review config"
else
  warn "nginx not installed — apt install nginx"
fi

# ------------------------------------------------------------------------ cron
log "Scheduling nightly cleanup and a disk guard"
cat >/etc/cron.d/ap-sites <<'EOF'
# Managed by deploy/server-setup.sh
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# Nightly safe cleanup: build caches, stale releases, oversized runtime caches.
30 3 * * * root /opt/ap-deploy/disk-cleanup.sh >> /var/log/ap-sites-cleanup.log 2>&1

# Every 30 min: if the disk is over 85% full, run the aggressive tier.
*/30 * * * * root [ "$(df -P / | awk 'NR==2 {print $5+0}')" -ge 85 ] && /opt/ap-deploy/disk-cleanup.sh --aggressive >> /var/log/ap-sites-cleanup.log 2>&1
EOF
chmod 644 /etc/cron.d/ap-sites

cat >/etc/logrotate.d/ap-sites-cleanup <<'EOF'
/var/log/ap-sites-cleanup.log {
    weekly
    rotate 2
    maxsize 5M
    missingok
    notifempty
    compress
}
EOF

# ------------------------------------------------------------------------- npm
log "Trimming npm defaults"
npm config set fund false --global
npm config set audit false --global
npm config set update-notifier false --global

# ----------------------------------------------------------------------- docker
if command -v docker >/dev/null 2>&1; then
  warn "Docker is still installed."
  info "This fleet does not need it. To reclaim /var/lib/docker and containerd:"
  info "  docker system prune -af --volumes"
  info "  systemctl disable --now docker docker.socket containerd"
  info "  apt purge -y docker-ce docker-ce-cli containerd.io && rm -rf /var/lib/docker /var/lib/containerd"
fi

log "Server setup complete"
cat <<EOF

Registry : /etc/ap-sites/sites.d/
Sites    : $AP_ROOT/<slug>/
Commands : /opt/ap-deploy/{site-add,site-deploy,site-list,site-remove,deploy-all,disk-audit,disk-cleanup}.sh

Next:
  sudo bash /opt/ap-deploy/disk-audit.sh          # find the current 200 GB
  sudo bash /opt/ap-deploy/site-add.sh --slug site-a --domain site-a.com --repo <git-url>
EOF
