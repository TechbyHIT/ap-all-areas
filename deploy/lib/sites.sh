# shellcheck shell=bash
#
# Shared config + helpers for the multi-site PM2 deploy scripts.
# Source this from any script in deploy/:  . "$(dirname "$0")/lib/sites.sh"
#
# Every path below can be overridden by exporting the variable first, or by
# putting assignments in /etc/ap-sites/config (read automatically).

AP_CONFIG_FILE="${AP_CONFIG_FILE:-/etc/ap-sites/config}"
if [ -f "$AP_CONFIG_FILE" ]; then
  # shellcheck disable=SC1090
  . "$AP_CONFIG_FILE"
fi

# Where each site lives: $AP_ROOT/<slug>/{build,releases,current,shared}
AP_ROOT="${AP_ROOT:-/srv/sites}"
# One <slug>.env per site. This is the single source of truth for the fleet.
AP_REGISTRY="${AP_REGISTRY:-/etc/ap-sites/sites.d}"
AP_PORT_BASE="${AP_PORT_BASE:-3000}"
AP_PORT_MAX="${AP_PORT_MAX:-3200}"
# Releases kept per site. Each standalone release is ~200-350 MB, so on a
# 200 GB disk with 50 sites keep this at 2 (or 1 if space gets tight).
AP_KEEP_RELEASES="${AP_KEEP_RELEASES:-2}"
# Cap for a site's runtime .next/cache (ISR + optimised images), in MB.
AP_CACHE_MAX_MB="${AP_CACHE_MAX_MB:-512}"
AP_NGINX_AVAILABLE="${AP_NGINX_AVAILABLE:-/etc/nginx/sites-available}"
AP_NGINX_ENABLED="${AP_NGINX_ENABLED:-/etc/nginx/sites-enabled}"
AP_NODE_MAX_OLD_SPACE="${AP_NODE_MAX_OLD_SPACE:-2048}"
# Builds are serialised through this lock: 50 parallel `next build` runs will
# OOM any VPS.
AP_BUILD_LOCK="${AP_BUILD_LOCK:-/var/lock/ap-sites-build.lock}"

AP_DEPLOY_DIR="${AP_DEPLOY_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

log() { printf '==> %s\n' "$*"; }
info() { printf '    %s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "required command not found: $1"
}

# Human-readable size of a path, "-" when missing.
size_of() {
  [ -e "$1" ] || {
    printf -- '-'
    return 0
  }
  du -sh "$1" 2>/dev/null | cut -f1
}

# Size in MB as an integer, 0 when missing.
size_mb() {
  [ -e "$1" ] || {
    printf '0'
    return 0
  }
  du -sm "$1" 2>/dev/null | cut -f1
}

slug_ok() { printf '%s' "$1" | grep -Eq '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'; }

site_dir() { printf '%s/%s' "$AP_ROOT" "$1"; }
site_conf() { printf '%s/%s.env' "$AP_REGISTRY" "$1"; }

# The PM2 ecosystem is installed to /etc/ap-sites by server-setup.sh so that it
# does not depend on any single site's checkout. Fall back to the repo copy.
#
# The filename must keep its `.config.cjs` suffix: PM2 identifies config files by
# name, and anything else is executed as a script instead of being read.
AP_ECOSYSTEM_NAME="ecosystem.multisite.config.cjs"

ecosystem_path() {
  if [ -n "${AP_ECOSYSTEM:-}" ]; then
    printf '%s' "$AP_ECOSYSTEM"
  elif [ -f "/etc/ap-sites/$AP_ECOSYSTEM_NAME" ]; then
    printf '/etc/ap-sites/%s' "$AP_ECOSYSTEM_NAME"
  else
    printf '%s/%s' "$AP_DEPLOY_DIR" "$AP_ECOSYSTEM_NAME"
  fi
}

list_slugs() {
  [ -d "$AP_REGISTRY" ] || return 0
  local f
  for f in "$AP_REGISTRY"/*.env; do
    [ -e "$f" ] || continue
    basename "$f" .env
  done
}

# Populates SLUG DOMAIN PORT REPO BRANCH ALIASES MAX_MEMORY from the registry.
load_site() {
  local slug="$1" conf
  conf="$(site_conf "$slug")"
  [ -f "$conf" ] || die "unknown site '$slug' (expected $conf)"
  SLUG="$slug"
  DOMAIN=""
  PORT=""
  REPO=""
  BRANCH="main"
  ALIASES=""
  MAX_MEMORY="300M"
  # shellcheck disable=SC1090
  . "$conf"
  [ -n "$DOMAIN" ] || die "$conf: DOMAIN is required"
  [ -n "$PORT" ] || die "$conf: PORT is required"
}

used_ports() {
  local slug conf
  while read -r slug; do
    [ -n "$slug" ] || continue
    conf="$(site_conf "$slug")"
    sed -n 's/^[[:space:]]*PORT=["'\'']*\([0-9][0-9]*\).*/\1/p' "$conf" 2>/dev/null || true
  done < <(list_slugs)
}

next_free_port() {
  local taken port
  taken=" $(used_ports | tr '\n' ' ') "
  for ((port = AP_PORT_BASE; port <= AP_PORT_MAX; port++)); do
    case "$taken" in *" $port "*) continue ;; esac
    if command -v ss >/dev/null 2>&1 && ss -ltnH "sport = :$port" 2>/dev/null | grep -q .; then
      continue
    fi
    printf '%s' "$port"
    return 0
  done
  die "no free port between $AP_PORT_BASE and $AP_PORT_MAX"
}

# render_template <src> <dest> KEY=VALUE...  (placeholders look like __KEY__)
render_template() {
  local src="$1" dest="$2"
  shift 2
  [ -f "$src" ] || die "template not found: $src"
  local body pair key value
  body="$(cat "$src")"
  for pair in "$@"; do
    key="${pair%%=*}"
    value="${pair#*=}"
    body="${body//__${key}__/$value}"
  done
  printf '%s\n' "$body" >"$dest"
}

pm2_app_exists() { pm2 describe "$1" >/dev/null 2>&1; }

# The default branch of a remote, e.g. "master". Hardcoding "main" makes the
# first clone fail on any repo that predates that convention.
detect_default_branch() {
  local repo="$1"
  git ls-remote --symref "$repo" HEAD 2>/dev/null |
    sed -n 's|^ref: refs/heads/\([^[:space:]]*\).*|\1|p' | head -1
}

remote_has_branch() {
  git ls-remote --exit-code --heads "$1" "$2" >/dev/null 2>&1
}

# Reload nginx, showing the test output when it fails. Hiding it leaves the
# operator with "review config" and nothing to review.
nginx_reload() {
  local out
  command -v nginx >/dev/null 2>&1 || {
    warn "nginx is not installed"
    return 1
  }
  if out="$(nginx -t 2>&1)"; then
    systemctl reload nginx 2>/dev/null ||
      warn "config is valid but 'systemctl reload nginx' failed"
    return 0
  fi
  warn "nginx -t failed, so nginx was NOT reloaded. Its output:"
  printf '%s\n' "$out" | sed 's/^/      /'
  return 1
}
