#!/usr/bin/env bash
# Discover legacy checkouts under /var/www and /root, register them in
# /srv/sites via site-import.sh, pin their existing PORT, and optionally
# run site-deploy.sh. Does NOT delete the old directory or flip nginx.
#
#   sudo bash deploy/import-legacy-fleet.sh              # import only
#   sudo bash deploy/import-legacy-fleet.sh --deploy     # import + rebuild
#   sudo bash deploy/import-legacy-fleet.sh --dry-run
#
# Cut over (per site, after verify):
#   ln -sfn /etc/nginx/sites-available/<slug>.conf /etc/nginx/sites-enabled/<slug>.conf
#   # disable the old vhost that still points at /var/www/...
#   nginx -t && systemctl reload nginx
#   rm -rf /var/www/<old>     # only after traffic is on /srv/sites
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

DRY_RUN=0
DO_DEPLOY=0
MAX_MEMORY_DEFAULT="${AP_IMPORT_MAX_MEMORY:-400M}"

while [ $# -gt 0 ]; do
  case "$1" in
  --dry-run) DRY_RUN=1; shift ;;
  --deploy) DO_DEPLOY=1; shift ;;
  -h | --help)
    sed -n '2,16p' "$0"
    exit 0
    ;;
  *) die "unknown option: $1" ;;
  esac
done

require_cmd nginx
require_cmd pm2

# Known slug → preferred public domain (overridden by nginx server_name when found).
declare -A DOMAIN_HINT=(
  [avensafe]="avensafesolutions.com"
  [jogiinvisiblegrills.in]="jogiinvisiblegrills.in"
  [jogiinvisiblegrills]="jogiinvisiblegrills.in"
  [hiranya-enterprises]="hiranayaenterprises.in"
  [hiranaya-enterprises]="hiranayaenterprises.in"
  [hiranya]="hiranayaenterprises.in"
  [sai-durga]=""
  [securevista]=""
  [deva-safety-nets]="devasafetynets.com"
)

# Skip paths that are already the fleet root, certbot, or empty scaffolding.
skip_path() {
  case "$1" in
  /var/www/html | /var/www/certbot | /srv/sites | /srv/sites/*) return 0 ;;
  esac
  return 1
}

slug_from_path() {
  local base
  base="$(basename "$1")"
  # Normalise a few known folder names.
  case "$base" in
  jogiinvisiblegrills.in) printf 'jogiinvisiblegrills' ;;
  hiranaya-enterprises | hiranya-enterprises) printf 'hiranaya-enterprises' ;;
  *) printf '%s' "$base" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9-' '-' | sed 's/-\+/-/g;s/^-//;s/-$//' ;;
  esac
}

# First non-www server_name from any nginx conf that references this path or port.
domain_for() {
  local path="$1" port="$2" slug="$3"
  local found=""
  if [ -d "$AP_NGINX_AVAILABLE" ] || [ -d "$AP_NGINX_ENABLED" ]; then
    found="$(
      grep -Rsl --include='*.conf' -E "root\s+$path|proxy_pass\s+http://127\.0\.0\.1:$port\b|proxy_pass\s+http://localhost:$port\b" \
        "$AP_NGINX_ENABLED" "$AP_NGINX_AVAILABLE" 2>/dev/null |
        head -n 1 |
        xargs -r grep -E '^\s*server_name\s+' |
        head -n 1 |
        sed -E 's/^\s*server_name\s+//;s/;//;s/\s+/\n/g' |
        grep -vE '^(www\.|_)$' |
        head -n 1 || true
    )"
  fi
  if [ -n "$found" ]; then
    printf '%s' "$found"
    return 0
  fi
  if [ -n "${DOMAIN_HINT[$slug]:-}" ]; then
    printf '%s' "${DOMAIN_HINT[$slug]}"
    return 0
  fi
  printf ''
}

# Best-effort PORT from PM2 (cwd match) or listening node near the tree.
port_for() {
  local path="$1"
  local port=""
  port="$(
    pm2 jlist 2>/dev/null | node -e '
      let raw="";
      process.stdin.on("data",c=>raw+=c).on("end",()=>{
        try {
          const apps=JSON.parse(raw);
          const want=process.argv[1].replace(/\/$/,"/");
          for (const a of apps) {
            const cwd=(a.pm2_env&&a.pm2_env.pm_cwd)||"";
            const script=(a.pm2_env&&a.pm2_env.pm_exec_path)||"";
            if (cwd.startsWith(want) || script.startsWith(want)) {
              const env=a.pm2_env.env||{};
              const p=env.PORT||env.port||(a.pm2_env&&a.pm2_env.PORT);
              if (p) { process.stdout.write(String(p)); return; }
            }
          }
        } catch {}
      });
    ' "$path" 2>/dev/null || true
  )"
  if [ -n "$port" ]; then
    printf '%s' "$port"
    return 0
  fi
  # Fall back: any TCP listen owned by a process whose cwd is under path.
  port="$(
    for pid in $(pgrep -f 'node.*server\.js' 2>/dev/null || true); do
      cwd="$(readlink -f "/proc/$pid/cwd" 2>/dev/null || true)"
      case "$cwd" in
      "$path" | "$path"/*)
        ss -ltnp 2>/dev/null | awk -v pid="$pid" '
          $0 ~ ("pid=" pid ",") {
            split($4, a, ":");
            print a[length(a)];
            exit
          }'
        break
        ;;
      esac
    done
  )"
  printf '%s' "$port"
}

candidates=()
for base in /var/www /root; do
  [ -d "$base" ] || continue
  for dir in "$base"/*; do
    [ -d "$dir" ] || continue
    skip_path "$dir" && continue
    # Must look like a Next app (or at least have package.json).
    if [ -f "$dir/package.json" ] || [ -d "$dir/.next" ] || [ -d "$dir/.git" ]; then
      candidates+=("$dir")
    fi
  done
done

# Also pick up the historically named /root/deva-safety-nets if present.
[ -d /root/deva-safety-nets ] && candidates+=("/root/deva-safety-nets")

# Deduplicate
mapfile -t candidates < <(printf '%s\n' "${candidates[@]}" | awk 'NF && !seen[$0]++')

if [ ${#candidates[@]} -eq 0 ]; then
  die "no legacy site directories found under /var/www or /root"
fi

log "Legacy candidates ($(printf '%s' "${#candidates[@]}")):"
printf '%-40s %8s\n' PATH SIZE
for dir in "${candidates[@]}"; do
  printf '%-40s %8s\n' "$dir" "$(size_of "$dir")"
done
echo

IMPORTED=()
SKIPPED=()

for FROM in "${candidates[@]}"; do
  SLUG="$(slug_from_path "$FROM")"
  CONF="$(site_conf "$SLUG")"
  if [ -f "$CONF" ]; then
    warn "skip $FROM — already registered as $SLUG ($CONF)"
    SKIPPED+=("$SLUG(already)")
    continue
  fi
  # Skip if this path is already under /srv/sites (should not happen).
  case "$FROM" in
  "$AP_ROOT"/*)
    SKIPPED+=("$SLUG(under-srv)")
    continue
    ;;
  esac

  PORT="$(port_for "$FROM")"
  DOMAIN="$(domain_for "$FROM" "${PORT:-0}" "$SLUG")"
  if [ -z "$DOMAIN" ]; then
    warn "skip $FROM — could not detect DOMAIN (set nginx server_name or DOMAIN_HINT)"
    SKIPPED+=("$SLUG(no-domain)")
    continue
  fi

  REPO=""
  BRANCH="main"
  if [ -d "$FROM/.git" ]; then
    REPO="$(git -C "$FROM" remote get-url origin 2>/dev/null || true)"
    BRANCH="$(git -C "$FROM" rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
    [ "$BRANCH" = "HEAD" ] && BRANCH="main"
  fi

  info "→ import slug=$SLUG domain=$DOMAIN port=${PORT:-auto} from=$FROM"
  info "  repo=${REPO:-"(none)"} branch=$BRANCH size=$(size_of "$FROM")"

  if [ "$DRY_RUN" = 1 ]; then
    IMPORTED+=("$SLUG(dry-run)")
    continue
  fi

  ARGS=(--slug "$SLUG" --domain "$DOMAIN" --from "$FROM" --branch "$BRANCH")
  [ -n "$REPO" ] && ARGS+=(--repo "$REPO")
  [ -n "$PORT" ] && ARGS+=(--port "$PORT")

  bash "$AP_DEPLOY_DIR/site-import.sh" "${ARGS[@]}"

  # Pin memory recycle so leaky processes cannot sit at 1 GB forever.
  if [ -f "$CONF" ] && ! grep -q '^MAX_MEMORY=' "$CONF"; then
    echo "MAX_MEMORY=$MAX_MEMORY_DEFAULT" >>"$CONF"
  elif [ -f "$CONF" ]; then
    sed -i "s/^MAX_MEMORY=.*/MAX_MEMORY=$MAX_MEMORY_DEFAULT/" "$CONF"
  fi

  IMPORTED+=("$SLUG")

  if [ "$DO_DEPLOY" = 1 ]; then
    log "Deploying $SLUG (serialised build lock)…"
    bash "$AP_DEPLOY_DIR/site-deploy.sh" "$SLUG" || warn "deploy failed for $SLUG — fix env/repo and retry"
  fi
done

echo
log "Done. imported=${#IMPORTED[@]} skipped=${#SKIPPED[@]}"
[ ${#IMPORTED[@]} -gt 0 ] && info "imported: ${IMPORTED[*]}"
[ ${#SKIPPED[@]} -gt 0 ] && info "skipped:  ${SKIPPED[*]}"
echo
info "Next (per site, after site-deploy):"
info "  1. curl -I http://127.0.0.1:\$PORT/"
info "  2. Enable the new vhost, disable the old /var/www one, nginx -t && reload"
info "  3. Verify https://\$DOMAIN then: rm -rf /var/www/<old>"
info "Registry: $AP_REGISTRY   Layout: $AP_ROOT"
bash "$AP_DEPLOY_DIR/site-list.sh" --no-size || true
