#!/usr/bin/env bash
# Test suite for storage-manager.
#
#   bash tests/run-tests.sh              run everything
#   bash tests/run-tests.sh --keep       keep the sandbox for inspection
#   bash tests/run-tests.sh --filter pm2 run matching tests only
#
# Everything happens inside a throwaway sandbox with fake df, pm2, journalctl,
# apt-get, logrotate, lsof, nginx, systemctl and npm on PATH. Nothing outside
# the sandbox is read for decisions and nothing outside it is ever written.
#
# The fakes double as spies: every call is appended to a log, so the suite can
# assert that no application-disturbing command was invoked even once.
set -uo pipefail

SUITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SM="$SUITE_DIR/../scripts/storage-manager.sh"
[ -f "$SM" ] || {
  printf 'cannot find storage-manager.sh next to the tests\n' >&2
  exit 1
}

KEEP=0
FILTER=""
DEMO=0
while [ $# -gt 0 ]; do
  case "$1" in
  --keep) KEEP=1 ;;
  --demo) DEMO=1 ;;
  --filter)
    FILTER="$2"
    shift
    ;;
  *)
    printf 'unknown option: %s\n' "$1" >&2
    exit 2
    ;;
  esac
  shift
done

SANDBOX="$(mktemp -d "${TMPDIR:-/tmp}/storage-manager-tests.XXXXXX")"
FAKEBIN="$SANDBOX/bin"
SPY="$SANDBOX/spy"
SITES="$SANDBOX/srv/sites"
REGISTRY="$SANDBOX/etc/ap-sites/sites.d"
CONF="$SANDBOX/etc/storage-manager.conf"

PASS=0
FAIL=0
CURRENT=""
declare -a FAILURES=()

cleanup_sandbox() {
  if [ "$KEEP" = 1 ]; then
    printf '\nsandbox kept at %s\n' "$SANDBOX"
  else
    chmod -R u+rwX "$SANDBOX" 2>/dev/null
    rm -rf "$SANDBOX"
  fi
}
trap cleanup_sandbox EXIT

# ------------------------------------------------------------- tiny assertions
fail() {
  FAIL=$((FAIL + 1))
  FAILURES+=("$CURRENT: $1")
  printf '  FAIL  %s\n        %s\n' "$CURRENT" "$1"
}
pass() {
  PASS=$((PASS + 1))
  printf '  ok    %s\n' "$CURRENT"
}

# run_test <name> <function>
run_test() {
  CURRENT="$1"
  if [ -n "$FILTER" ] && [[ "$1" != *"$FILTER"* ]]; then return 0; fi
  # Marker in the manager's own log, so a failure can be traced to its test.
  local log="$SANDBOX/var/log/storage-manager/storage-manager.log"
  [ -d "$(dirname "$log")" ] && printf '===== TEST: %s\n' "$1" >>"$log"
  local before="$FAIL"
  "$2"
  [ "$FAIL" = "$before" ] && pass
}

assert_contains() {
  case "$1" in
  *"$2"*) return 0 ;;
  *) fail "expected output to contain: $2" ;;
  esac
}
assert_not_contains() {
  case "$1" in
  *"$2"*) fail "expected output NOT to contain: $2" ;;
  *) return 0 ;;
  esac
}
assert_exists() { [ -e "$1" ] || fail "expected to still exist: $1"; }
assert_gone() { [ -e "$1" ] && fail "expected to be gone: $1"; }
assert_eq() { [ "$1" = "$2" ] || fail "expected '$2', got '$1'${3:+ ($3)}"; }

# sm <args...> — run the manager against the sandbox config
sm() {
  PATH="$FAKEBIN:$PATH" SM_CONF="$CONF" HOME="$SANDBOX/home/root" \
    bash "$SM" "$@" 2>&1
}

# spy_count <log> <regex> [-v] — how many recorded invocations match.
# grep -c prints 0 and exits 1 when nothing matches, so the exit code is ignored
# on purpose here.
spy_count() {
  local log="$1" pattern="$2" invert="${3:-}" n
  [ -f "$log" ] || {
    printf '0'
    return 0
  }
  if [ "$invert" = "-v" ]; then
    n="$(grep -Evc "$pattern" "$log" 2>/dev/null)"
  else
    n="$(grep -Ec "$pattern" "$log" 2>/dev/null)"
  fi
  printf '%s' "${n:-0}"
}

# A stable fingerprint of every path in the sandbox that represents application
# data, used to prove a dry run changes nothing.
fingerprint() {
  find "$SANDBOX/srv" "$SANDBOX/etc" -printf '%p|%y|%s\n' 2>/dev/null | sort
}

# =========================================================================
# fakes / spies
# =========================================================================

make_fakes() {
  mkdir -p "$FAKEBIN" "$SPY"

  cat >"$FAKEBIN/df" <<'EOF'
#!/usr/bin/env bash
# 200 GB disk; usage comes from FAKE_PCT so tests can drive the threshold ladder.
pct="${FAKE_PCT:-50}"
size="${FAKE_SIZE_MB:-204800}"
used=$((size * pct / 100))
avail=$((size - used))
echo "Filesystem 1M-blocks Used Available Capacity Mounted on"
echo "/dev/fake $size $used $avail ${pct}% /"
EOF

  # pm2: reads a spec file of "name<TAB>status<TAB>cwd" and answers jlist with
  # real-shaped JSON. Every invocation is recorded.
  cat >"$FAKEBIN/pm2" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$SM_SPY/pm2.log"
case "${1:-}" in
jlist)
  printf '['
  first=1
  while IFS=$'\t' read -r name status cwd; do
    [ -n "$name" ] || continue
    [ "$first" = 1 ] || printf ','
    first=0
    printf '{"name":"%s","pid":%s,"pm2_env":{"status":"%s","pm_cwd":"%s","restart_time":0,"pm_uptime":1,"pm_exec_path":"%s/server.js"}}' \
      "$name" "$((RANDOM + 1000))" "$status" "$cwd" "$cwd"
  done <"$SM_PM2_SPEC"
  printf ']\n'
  ;;
list) cat "$SM_PM2_SPEC" ;;
describe)
  grep -q "^${2}	" "$SM_PM2_SPEC" && exit 0
  exit 1
  ;;
conf) echo "max_size 10M" ;;
*) exit 0 ;;
esac
EOF

  cat >"$FAKEBIN/journalctl" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$SM_SPY/journalctl.log"
case "${1:-}" in
--disk-usage) echo "Archived and active journals take up ${FAKE_JOURNAL:-1.2G} in the file system." ;;
--vacuum-size=* | --vacuum-time=*) echo "Vacuuming done" ;;
esac
exit 0
EOF

  cat >"$FAKEBIN/apt-get" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$SM_SPY/apt-get.log"
exit 0
EOF

  cat >"$FAKEBIN/logrotate" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$SM_SPY/logrotate.log"
exit 0
EOF

  cat >"$FAKEBIN/nginx" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$SM_SPY/nginx.log"
exit 0
EOF

  cat >"$FAKEBIN/systemctl" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$SM_SPY/systemctl.log"
case "$*" in
*is-enabled*) exit 1 ;;
*is-active*) exit 1 ;;
esac
exit 0
EOF

  # lsof: $SM_SPY/open-files lists paths that count as open; +L1 prints a fake
  # deleted-but-open row so that detection can be tested without a real one.
  cat >"$FAKEBIN/lsof" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$SM_SPY/lsof.log"
if [ "${1:-}" = "-t" ]; then
  target="${3:-}"
  if [ -f "$SM_SPY/open-files" ] && grep -Fxq "$target" "$SM_SPY/open-files"; then
    echo 4242
  fi
  exit 0
fi
case "$*" in
*+L1*)
  echo "COMMAND PID USER FD TYPE DEVICE SIZE/OFF NLINK NODE NAME"
  echo "node 4242 root 12w REG 8,1 3221225472 0 9999 /var/log/deleted-by-someone.log (deleted)"
  ;;
esac
exit 0
EOF

  # pnpm included deliberately: without a fake, a real `pnpm store prune` would
  # run against the host's store, and the sandbox has to stay hermetic.
  for c in npm yarn pnpm; do
    cat >"$FAKEBIN/$c" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$*" >>"\$SM_SPY/$c.log"
exit 0
EOF
  done

  chmod +x "$FAKEBIN"/*
}

# =========================================================================
# sandbox fleet: eight sites, as the real VPS has
# =========================================================================

make_site() {
  local slug="$1" state="$2" port="$3"
  local dir="$SITES/$slug"
  local release="$dir/releases/20260101000000"

  mkdir -p "$dir/build" "$release/.next" "$dir/shared/logs" "$dir/shared/cache" \
    "$dir/public/uploads" "$dir/build/node_modules/left-pad" "$dir/build/.next/cache"
  ln -sfn "$release" "$dir/current"

  printf '{"name":"%s","version":"1.0.0"}\n' "$slug" >"$dir/build/package.json"
  printf '{"lockfileVersion":3}\n' >"$dir/build/package-lock.json"
  printf 'export default {};\n' >"$dir/build/next.config.ts"
  printf 'NEXT_PUBLIC_SITE_URL=https://%s.example\n' "$slug" >"$dir/shared/.env"
  chmod 600 "$dir/shared/.env"
  printf 'console.log("app");\n' >"$release/server.js"
  head -c 200000 /dev/zero >"$release/.next/BUILD_ID" 2>/dev/null
  head -c 300000 /dev/zero >"$dir/build/node_modules/left-pad/index.js" 2>/dev/null
  head -c 400000 /dev/zero >"$dir/build/.next/cache/webpack.bin" 2>/dev/null
  head -c 100000 /dev/zero >"$dir/public/uploads/customer-photo.jpg" 2>/dev/null
  head -c 50000 /dev/zero >"$dir/shared/cache/isr.bin" 2>/dev/null

  # A real repository so git checks exercise real git behaviour.
  if command -v git >/dev/null 2>&1; then
    git -c init.defaultBranch=main init -q "$dir/build" 2>/dev/null
    git -C "$dir/build" -c user.email=t@t -c user.name=t add -A 2>/dev/null
    git -C "$dir/build" -c user.email=t@t -c user.name=t commit -qm init 2>/dev/null
  fi

  # Live and rotated application logs.
  head -c 120000 /dev/zero >"$dir/shared/logs/out.log" 2>/dev/null
  head -c 900000 /dev/zero >"$dir/shared/logs/out__2026-01-01.log.gz" 2>/dev/null
  touch -d '40 days ago' "$dir/shared/logs/out__2026-01-01.log.gz"

  mkdir -p "$REGISTRY"
  cat >"$REGISTRY/$slug.env" <<EOF
DOMAIN=$slug.example
PORT=$port
REPO=https://example.invalid/$slug.git
BRANCH=main
EOF

  case "$state" in
  online) printf '%s\tonline\t%s\n' "$slug" "$dir/current" >>"$SPY/pm2.spec" ;;
  stopped) printf '%s\tstopped\t%s\n' "$slug" "$dir/current" >>"$SPY/pm2.spec" ;;
  deploying)
    printf '%s\tstopped\t%s\n' "$slug" "$dir/current" >>"$SPY/pm2.spec"
    touch "$SANDBOX/lock/$slug.deploy.lock"
    ;;
  unmanaged) : ;; # PM2 does not know it at all
  esac
}

make_sandbox() {
  mkdir -p "$SANDBOX"/{etc,var/lib,var/log,lock,tmp,vartmp,home/root/.pm2/logs} \
    "$SANDBOX/var/log/nginx" "$SANDBOX/var/log/system" "$SANDBOX/etc/nginx/sites-enabled" \
    "$SANDBOX/etc/letsencrypt/live/site-1.example" "$SITES" "$REGISTRY"
  : >"$SPY/pm2.spec"

  # Six online, one stopped, one mid-deploy: the eight the operator has today.
  make_site site-1 online 3000
  make_site site-2 online 3001
  make_site site-3 online 3002
  make_site site-4 online 3003
  make_site site-5 online 3004
  make_site site-6 online 3005
  make_site site-7 stopped 3006
  make_site site-8 deploying 3007

  # nginx config and certificates, which must never be touched.
  printf 'server { server_name site-1.example; }\n' >"$SANDBOX/etc/nginx/sites-enabled/site-1.conf"
  printf 'PRIVATE KEY\n' >"$SANDBOX/etc/letsencrypt/live/site-1.example/privkey.pem"

  # PM2 logs: one live, one rotated and old, one rotated but recent.
  head -c 150000 /dev/zero >"$SANDBOX/home/root/.pm2/logs/site-1-out.log"
  head -c 800000 /dev/zero >"$SANDBOX/home/root/.pm2/logs/site-1-out__old.log.gz"
  touch -d '40 days ago' "$SANDBOX/home/root/.pm2/logs/site-1-out__old.log.gz"
  head -c 800000 /dev/zero >"$SANDBOX/home/root/.pm2/logs/site-1-out__recent.log.gz"

  # nginx logs: live plus rotated.
  head -c 200000 /dev/zero >"$SANDBOX/var/log/nginx/access.log"
  head -c 700000 /dev/zero >"$SANDBOX/var/log/nginx/access.log.3.gz"
  touch -d '40 days ago' "$SANDBOX/var/log/nginx/access.log.3.gz"

  # system logs
  head -c 600000 /dev/zero >"$SANDBOX/var/log/system/syslog.4.gz"
  touch -d '40 days ago' "$SANDBOX/var/log/system/syslog.4.gz"
  head -c 100000 /dev/zero >"$SANDBOX/var/log/system/syslog"

  # temp files: old, recent, old-but-open, and a service directory.
  head -c 500000 /dev/zero >"$SANDBOX/tmp/old-build-scratch.tar"
  touch -d '30 days ago' "$SANDBOX/tmp/old-build-scratch.tar"
  head -c 500000 /dev/zero >"$SANDBOX/tmp/fresh-scratch.tar"
  head -c 500000 /dev/zero >"$SANDBOX/tmp/old-but-open.sock.data"
  touch -d '30 days ago' "$SANDBOX/tmp/old-but-open.sock.data"
  printf '%s\n' "$SANDBOX/tmp/old-but-open.sock.data" >"$SPY/open-files"
  mkdir -p "$SANDBOX/tmp/systemd-private-abc"
  touch -d '30 days ago' "$SANDBOX/tmp/systemd-private-abc"

  # A checkout of the storage manager living inside a discovery root: it must
  # refuse to treat its own repository as a cleanup target.
  mkdir -p "$SITES/tooling-repo/scripts"
  cp "$SM" "$SITES/tooling-repo/scripts/storage-manager.sh"
  printf '{"name":"tooling"}\n' >"$SITES/tooling-repo/package.json"

  cat >"$CONF" <<EOF
DISK_PATH=/
MAX_USAGE_PERCENT=70
WARNING_USAGE_PERCENT=70
CLEANUP_USAGE_PERCENT=80
AGGRESSIVE_USAGE_PERCENT=85
CRITICAL_USAGE_PERCENT=90
EMERGENCY_USAGE_PERCENT=95
TARGET_FREE_GB=60
LOG_RETENTION_DAYS=14
TEMP_RETENTION_DAYS=7
PROJECT_DISCOVERY=true
DISCOVERY_ROOTS=$SITES
DISCOVERY_MAX_DEPTH=3
SITE_REGISTRY=$REGISTRY
SITE_ROOT=$SITES
STATE_DIR=$SANDBOX/var/lib
LOG_DIR=$SANDBOX/var/log/storage-manager
LOCK_FILE=$SANDBOX/lock/storage-manager.lock
DEPLOY_LOCK_DIR=$SANDBOX/lock
GLOBAL_DEPLOY_LOCKS=$SANDBOX/lock/fleet-build.lock
PM2_LOG_DIRS=$SANDBOX/home/root/.pm2/logs $SITES/*/shared/logs
NGINX_LOG_DIR=$SANDBOX/var/log/nginx
SYSTEM_LOG_DIR=$SANDBOX/var/log/system
TEMP_DIRS=$SANDBOX/tmp $SANDBOX/vartmp
PKG_CACHE_PATHS=$SANDBOX/home/root/.npm/_cacache
PROTECTED_PATHS=$SANDBOX/etc /etc /usr /bin /sbin /lib /boot
PROJECT_SCAN_INTERVAL_MIN=360
LARGE_FILE_SCAN_INTERVAL_MIN=1440
LARGE_FILE_MIN_MB=1
LARGE_FILE_SCAN_ROOTS=$SITES
DEPLOY_RECENT_MIN=10
ALLOW_NEXT_CACHE_CLEANUP=false
ALLOW_NEXT_BUILD_CLEANUP=false
ALLOW_NODE_MODULES_CLEANUP=false
ALLOW_STALE_RELEASE_CLEANUP=false
KEEP_RELEASES=2
EOF

  # Freshly created trees look like a deploy in flight, which is correct
  # behaviour but would mask every other test. Age them past DEPLOY_RECENT_MIN.
  # -h matters for `current`: it is a symlink, and its own mtime is the deploy
  # timestamp the manager reads.
  local d
  for d in "$SITES"/*; do
    touch -d '3 hours ago' "$d/build" "$d/releases" 2>/dev/null
    touch -h -d '3 hours ago' "$d/current" 2>/dev/null
    [ -d "$d/build/.next" ] && touch -d '3 hours ago' "$d/build/.next"
  done
}

conf_set() {
  local key="$1" value="$2" file="${3:-$CONF}"
  if grep -q "^$key=" "$file"; then
    local tmp="$file.tmp"
    grep -v "^$key=" "$file" >"$tmp" && mv "$tmp" "$file"
  fi
  printf '%s=%s\n' "$key" "$value" >>"$file"
}

drop_cache() { rm -f "$SANDBOX/var/lib/projects.tsv"; }

# Opt-in state is set at the start of every test that cares, never left to
# whatever ran before: a leak here would quietly weaken the assertions.
reset_optins() {
  conf_set ALLOW_NEXT_CACHE_CLEANUP false
  conf_set ALLOW_NEXT_BUILD_CLEANUP false
  conf_set ALLOW_NODE_MODULES_CLEANUP false
  conf_set ALLOW_STALE_RELEASE_CLEANUP false
}

# Recreate the removable build artifacts of a site and commit its tree, so each
# project-level test starts from the same state whatever ran before it.
restore_site() {
  local dir="$SITES/$1"
  mkdir -p "$dir/build/node_modules/left-pad" "$dir/build/.next/cache" "$dir/shared/cache"
  head -c 300000 /dev/zero >"$dir/build/node_modules/left-pad/index.js" 2>/dev/null
  head -c 400000 /dev/zero >"$dir/build/.next/cache/webpack.bin" 2>/dev/null
  head -c 50000 /dev/zero >"$dir/shared/cache/isr.bin" 2>/dev/null
  if [ -d "$dir/build/.git" ]; then
    git -C "$dir/build" -c user.email=t@t -c user.name=t add -A >/dev/null 2>&1
    git -C "$dir/build" -c user.email=t@t -c user.name=t \
      commit -qm "restore fixtures" >/dev/null 2>&1
  fi
  touch -d '3 hours ago' "$dir/build" "$dir/releases" "$dir/build/.next" 2>/dev/null
  touch -h -d '3 hours ago' "$dir/current" 2>/dev/null
  drop_cache
}

export SM_SPY="$SPY"
export SM_PM2_SPEC="$SPY/pm2.spec"

# =========================================================================
# tests
# =========================================================================

t_eight_projects() {
  drop_cache
  local out
  out="$(FAKE_PCT=50 sm projects)"
  assert_contains "$out" "site-1"
  assert_contains "$out" "site-8"
  local n
  n="$(printf '%s\n' "$out" | grep -c '^    path: ')"
  # eight sites plus the tooling checkout that lives in the same root
  assert_eq "$n" 9 "discovered project count"
  assert_contains "$out" "online=6"
  assert_contains "$out" "deploying=1"
}

t_future_project_detected() {
  make_site site-9 online 3008
  touch -d '3 hours ago' "$SITES/site-9/build" "$SITES/site-9/releases"
  touch -h -d '3 hours ago' "$SITES/site-9/current"
  local out
  out="$(FAKE_PCT=50 sm projects --force)"
  assert_contains "$out" "site-9"
  # And without --force, once the cache has aged out.
  drop_cache
  out="$(FAKE_PCT=50 sm projects)"
  assert_contains "$out" "site-9"
}

t_project_cache_used() {
  drop_cache
  FAKE_PCT=50 sm projects >/dev/null
  [ -f "$SANDBOX/var/lib/projects.tsv" ] || fail "no discovery cache was written"
  # A project added after the scan must not appear until the cache expires or a
  # rescan is forced: that is the performance contract.
  mkdir -p "$SITES/site-cachetest"
  printf '{"name":"x"}\n' >"$SITES/site-cachetest/package.json"
  local out
  out="$(FAKE_PCT=50 sm projects)"
  assert_not_contains "$out" "site-cachetest"
  out="$(FAKE_PCT=50 sm projects --force)"
  assert_contains "$out" "site-cachetest"
  rm -rf "$SITES/site-cachetest"
  drop_cache
}

t_online_offline_deploying_unknown() {
  drop_cache
  local out
  out="$(FAKE_PCT=50 sm projects)"
  assert_contains "$out" "$(printf 'site-1 ')"
  printf '%s' "$out" | grep -q 'site-1.*ONLINE' || fail "site-1 should be ONLINE"
  printf '%s' "$out" | grep -q 'site-7.*OFFLINE' || fail "site-7 should be OFFLINE"
  printf '%s' "$out" | grep -q 'site-8.*DEPLOYING' || fail "site-8 should be DEPLOYING"
  printf '%s' "$out" | grep -q 'tooling-repo.*OFFLINE' ||
    fail "the unmanaged tooling checkout should be OFFLINE, not cleanable"
}

t_pm2_unavailable_means_unknown() {
  drop_cache
  local out
  # Hide pm2 so its state cannot be determined at all.
  out="$(PATH="$SANDBOX/nopm2:$PATH" SM_CONF="$CONF" bash "$SM" projects 2>&1)"
  assert_contains "$out" "UNKNOWN"
  assert_contains "$out" "PM2 state could not be determined"
  drop_cache
}

t_thresholds() {
  local out
  for spec in "50:NORMAL" "72:PREVENTIVE" "82:SAFE-CLEANUP" "87:AGGRESSIVE-SAFE" \
    "92:CRITICAL" "97:EMERGENCY"; do
    out="$(FAKE_PCT=${spec%%:*} sm explain)"
    assert_contains "$out" "the level is ${spec##*:}"
  done
}

t_target_free_space_logic() {
  # 60% of 200 GB used leaves 80 GB free: healthy against a 60 GB target.
  local out
  out="$(FAKE_PCT=60 sm status)"
  assert_contains "$out" "NORMAL"
  # Raise the floor above what is free and the same disk needs preventive work.
  conf_set TARGET_FREE_GB 100
  out="$(FAKE_PCT=60 sm status)"
  assert_contains "$out" "PREVENTIVE"
  conf_set TARGET_FREE_GB 60
}

t_no_cleanup_when_healthy() {
  local out
  out="$(FAKE_PCT=50 sm cleanup --auto)"
  assert_contains "$out" "under every threshold, nothing to do"
  assert_exists "$SANDBOX/home/root/.pm2/logs/site-1-out__old.log.gz"
}

t_dry_run_changes_nothing() {
  reset_optins
  drop_cache
  local before after out
  before="$(fingerprint)"
  out="$(FAKE_PCT=97 sm cleanup --dry-run)"
  after="$(fingerprint)"
  assert_eq "$after" "$before" "dry run must not change the filesystem"
  assert_contains "$out" "DRY RUN"
  assert_contains "$out" "would remove"
  # The old rotated logs are still there after a dry run.
  assert_exists "$SANDBOX/home/root/.pm2/logs/site-1-out__old.log.gz"
  assert_exists "$SANDBOX/var/log/nginx/access.log.3.gz"
}

t_dry_run_explains_skips() {
  reset_optins
  conf_set ALLOW_NODE_MODULES_CLEANUP true
  conf_set ALLOW_NEXT_BUILD_CLEANUP true
  drop_cache
  local out
  out="$(FAKE_PCT=87 sm cleanup --dry-run)"
  assert_contains "$out" "PROTECTED"
  assert_contains "$out" "PM2 reports it ONLINE"
  assert_contains "$out" "a deployment is in progress"
  conf_set ALLOW_NODE_MODULES_CLEANUP false
  conf_set ALLOW_NEXT_BUILD_CLEANUP false
}

t_rotated_logs_cleaned_active_kept() {
  drop_cache
  FAKE_PCT=82 sm cleanup --auto >/dev/null
  assert_gone "$SANDBOX/home/root/.pm2/logs/site-1-out__old.log.gz"
  assert_gone "$SANDBOX/var/log/nginx/access.log.3.gz"
  assert_gone "$SANDBOX/var/log/system/syslog.4.gz"
  # Live logs and recent rotations survive.
  assert_exists "$SANDBOX/home/root/.pm2/logs/site-1-out.log"
  assert_exists "$SANDBOX/home/root/.pm2/logs/site-1-out__recent.log.gz"
  assert_exists "$SANDBOX/var/log/nginx/access.log"
  assert_exists "$SANDBOX/var/log/system/syslog"
  # And the live log was not truncated to zero either.
  local size
  size="$(stat -c %s "$SANDBOX/var/log/nginx/access.log")"
  [ "$size" -gt 0 ] || fail "an active log was truncated"
}

t_temp_cleanup_rules() {
  FAKE_PCT=82 sm cleanup --auto >/dev/null
  assert_gone "$SANDBOX/tmp/old-build-scratch.tar"
  assert_exists "$SANDBOX/tmp/fresh-scratch.tar"
  assert_exists "$SANDBOX/tmp/old-but-open.sock.data"
  assert_exists "$SANDBOX/tmp/systemd-private-abc"
}

t_application_data_untouched_by_full_run() {
  reset_optins
  drop_cache
  FAKE_PCT=97 sm cleanup --full >/dev/null
  local slug
  for slug in site-1 site-7 site-8; do
    assert_exists "$SITES/$slug/shared/.env"
    assert_exists "$SITES/$slug/build/.git"
    assert_exists "$SITES/$slug/build/package.json"
    assert_exists "$SITES/$slug/build/package-lock.json"
    assert_exists "$SITES/$slug/public/uploads/customer-photo.jpg"
    assert_exists "$SITES/$slug/build/node_modules/left-pad/index.js"
    assert_exists "$SITES/$slug/releases/20260101000000/server.js"
    assert_exists "$SITES/$slug/current"
    assert_exists "$SITES/$slug/shared/logs/out.log"
  done
  assert_exists "$SANDBOX/etc/nginx/sites-enabled/site-1.conf"
  assert_exists "$SANDBOX/etc/letsencrypt/live/site-1.example/privkey.pem"
}

t_online_project_optins_refused() {
  reset_optins
  conf_set ALLOW_NODE_MODULES_CLEANUP true
  conf_set ALLOW_NEXT_BUILD_CLEANUP true
  conf_set ALLOW_NEXT_CACHE_CLEANUP true
  conf_set ALLOW_STALE_RELEASE_CLEANUP true
  restore_site site-1
  restore_site site-8
  local out
  out="$(FAKE_PCT=87 sm cleanup --full)"
  # Everything an online site owns survives, opt-ins or not.
  assert_exists "$SITES/site-1/build/node_modules/left-pad/index.js"
  assert_exists "$SITES/site-1/build/.next/cache/webpack.bin"
  assert_exists "$SITES/site-1/shared/cache/isr.bin"
  assert_contains "$out" "PM2 reports it ONLINE"
  # The deploying site is refused for a different reason.
  assert_exists "$SITES/site-8/build/node_modules/left-pad/index.js"
  assert_contains "$out" "a deployment is in progress"
}

t_offline_project_needs_clean_git() {
  reset_optins
  conf_set ALLOW_NEXT_CACHE_CLEANUP true
  restore_site site-7
  # site-7 is OFFLINE but its working tree is dirty, so it is still refused.
  # Edit a tracked file rather than adding one: creating a file in build/ would
  # update that directory's mtime, which the manager reads as a possible deploy
  # in flight, and the project would be protected for that reason instead.
  printf 'export default {}; // local edit\n' >"$SITES/site-7/build/next.config.ts"
  local out
  out="$(FAKE_PCT=87 sm cleanup --full)"
  assert_contains "$out" "git working tree is yes"
  assert_exists "$SITES/site-7/build/.next/cache/webpack.bin"

  # Commit it and the same project becomes eligible for cache cleanup only.
  git -C "$SITES/site-7/build" -c user.email=t@t -c user.name=t add -A >/dev/null 2>&1
  git -C "$SITES/site-7/build" -c user.email=t@t -c user.name=t commit -qm edit >/dev/null 2>&1
  drop_cache
  out="$(FAKE_PCT=87 sm cleanup --full)"
  assert_gone "$SITES/site-7/build/.next/cache/webpack.bin"
  # Even then, only the cache went: source, deps and release are intact.
  assert_exists "$SITES/site-7/build/node_modules/left-pad/index.js"
  assert_exists "$SITES/site-7/build/package.json"
  assert_exists "$SITES/site-7/releases/20260101000000/server.js"
  conf_set ALLOW_NEXT_CACHE_CLEANUP false
}

t_critical_level_force_disables_optins() {
  reset_optins
  conf_set ALLOW_NODE_MODULES_CLEANUP true
  conf_set ALLOW_NEXT_BUILD_CLEANUP true
  conf_set ALLOW_NEXT_CACHE_CLEANUP true
  conf_set ALLOW_STALE_RELEASE_CLEANUP true
  restore_site site-7
  local out
  out="$(FAKE_PCT=97 sm cleanup --auto)"
  assert_contains "$out" "force-disabled at EMERGENCY"
  assert_exists "$SITES/site-7/build/node_modules/left-pad/index.js"
  out="$(FAKE_PCT=92 sm cleanup --auto)"
  assert_contains "$out" "force-disabled at CRITICAL"
  conf_set ALLOW_NODE_MODULES_CLEANUP false
  conf_set ALLOW_NEXT_BUILD_CLEANUP false
  conf_set ALLOW_NEXT_CACHE_CLEANUP false
  conf_set ALLOW_STALE_RELEASE_CLEANUP false
}

t_emergency_alerts_instead_of_deleting() {
  drop_cache
  local out rc
  out="$(FAKE_PCT=97 sm cleanup --auto)"
  rc=$?
  assert_contains "$out" "CRITICAL"
  [ -f "$SANDBOX/var/log/storage-manager/CRITICAL-ALERT.txt" ] ||
    fail "no critical alert file was written"
  local alert
  alert="$(cat "$SANDBOX/var/log/storage-manager/CRITICAL-ALERT.txt")"
  assert_contains "$alert" "no application has been stopped"
}

t_deployment_lock_protects() {
  reset_optins
  restore_site site-7
  conf_set ALLOW_NEXT_CACHE_CLEANUP true
  # site-7 is clean and offline, so normally eligible. Fence it with a lock.
  touch "$SANDBOX/lock/site-7.deploy.lock"
  local out
  out="$(FAKE_PCT=87 sm cleanup --full)"
  assert_contains "$out" "a deployment is in progress"
  assert_exists "$SITES/site-7/build/.next/cache/webpack.bin"
  rm -f "$SANDBOX/lock/site-7.deploy.lock"
  conf_set ALLOW_NEXT_CACHE_CLEANUP false
}

t_global_deploy_lock_protects() {
  reset_optins
  restore_site site-7
  conf_set ALLOW_NEXT_CACHE_CLEANUP true
  local lock="$SANDBOX/lock/fleet-build.lock"
  touch "$lock"
  # Hold the fleet build lock the way site-deploy.sh does while building.
  (
    exec 9>>"$lock"
    flock 9
    sleep 10
  ) &
  local holder=$!
  sleep 0.5
  local out
  out="$(FAKE_PCT=87 sm projects --force)"
  assert_contains "$out" "fleet build lock is held"
  # With a fleet build running, every project is DEPLOYING and nothing is taken.
  out="$(FAKE_PCT=87 sm cleanup --full)"
  assert_contains "$out" "a deployment is in progress"
  assert_exists "$SITES/site-7/build/.next/cache/webpack.bin"
  kill "$holder" 2>/dev/null
  wait "$holder" 2>/dev/null
  conf_set ALLOW_NEXT_CACHE_CLEANUP false
  drop_cache
}

t_concurrency_lock() {
  local lock="$SANDBOX/lock/storage-manager.lock"
  (
    exec 9>>"$lock"
    flock 9
    sleep 5
  ) &
  local holder=$!
  sleep 0.5
  local out
  out="$(FAKE_PCT=97 sm cleanup --auto)"
  assert_contains "$out" "Another storage-manager run is in progress"
  kill "$holder" 2>/dev/null
  wait "$holder" 2>/dev/null
}

t_failed_removal_is_contained() {
  drop_cache
  # Make a rotated log undeletable by taking write permission off its directory.
  local d="$SANDBOX/var/log/system/locked"
  mkdir -p "$d"
  head -c 300000 /dev/zero >"$d/old.log.gz"
  touch -d '40 days ago' "$d/old.log.gz"
  chmod 500 "$d"
  head -c 300000 /dev/zero >"$SANDBOX/var/log/system/other.log.gz"
  touch -d '40 days ago' "$SANDBOX/var/log/system/other.log.gz"

  local out
  out="$(FAKE_PCT=82 sm cleanup --auto)"
  assert_contains "$out" "FAILED"
  # The failure must not stop the rest of the pass.
  assert_gone "$SANDBOX/var/log/system/other.log.gz"
  assert_contains "$out" "failed"
  chmod 700 "$d"
  rm -rf "$d"
}

t_safety_gate_refuses_protected_paths() {
  # Point a cleanup category straight at protected data and confirm the gate
  # refuses it rather than trusting the category.
  local alt="$SANDBOX/etc/alt.conf"
  grep -v '^SYSTEM_LOG_DIR=' "$CONF" >"$alt"
  printf 'SYSTEM_LOG_DIR=%s\n' "$SANDBOX/etc" >>"$alt"
  head -c 100000 /dev/zero >"$SANDBOX/etc/nginx/old.conf.1"
  touch -d '40 days ago' "$SANDBOX/etc/nginx/old.conf.1"
  local out
  out="$(PATH="$FAKEBIN:$PATH" SM_CONF="$alt" FAKE_PCT=82 bash "$SM" cleanup --auto 2>&1)"
  assert_contains "$out" "refused by safety gate"
  assert_contains "$out" "inside protected path"
  assert_exists "$SANDBOX/etc/nginx/old.conf.1"
  assert_exists "$SANDBOX/etc/nginx/sites-enabled/site-1.conf"
}

t_self_protection() {
  reset_optins
  conf_set ALLOW_NEXT_CACHE_CLEANUP true
  conf_set ALLOW_NODE_MODULES_CLEANUP true
  drop_cache
  # Run the copy that lives inside the discovery root; it must refuse to treat
  # its own checkout as cleanable.
  local out
  out="$(PATH="$FAKEBIN:$PATH" SM_CONF="$CONF" FAKE_PCT=87 \
    bash "$SITES/tooling-repo/scripts/storage-manager.sh" projects --force 2>&1)"
  assert_contains "$out" "holds the storage manager itself"
  assert_exists "$SITES/tooling-repo/scripts/storage-manager.sh"
  conf_set ALLOW_NEXT_CACHE_CLEANUP false
  conf_set ALLOW_NODE_MODULES_CLEANUP false
}

t_no_application_disturbing_command() {
  # The spy logs cover every run in this suite up to this point.
  local forbidden pm2log
  pm2log="$SPY/pm2.log"
  if [ -f "$pm2log" ]; then
    forbidden="$(grep -Ec '^(restart|reload|stop|delete|kill|flush|startup|save|resurrect)' "$pm2log" || true)"
    assert_eq "${forbidden:-0}" 0 "pm2 was asked to change application state"
  fi
  if [ -f "$SPY/nginx.log" ]; then
    forbidden="$(grep -Evc '^-t$|^-T$' "$SPY/nginx.log" || true)"
    assert_eq "${forbidden:-0}" 0 "nginx was invoked with something other than a config test"
  fi
  if [ -f "$SPY/systemctl.log" ]; then
    forbidden="$(grep -Ec '(restart|reload|stop|start|disable|enable|mask)' "$SPY/systemctl.log" || true)"
    assert_eq "${forbidden:-0}" 0 "systemctl was asked to change a unit's state"
  fi
  if [ -f "$SPY/apt-get.log" ]; then
    forbidden="$(grep -Ec '(autoremove|remove|purge|install|upgrade)' "$SPY/apt-get.log" || true)"
    assert_eq "${forbidden:-0}" 0 "apt-get was asked to change installed packages"
  fi
  if [ -f "$SPY/journalctl.log" ]; then
    forbidden="$(grep -Evc '^(--disk-usage|--vacuum-size=.*|--vacuum-time=.*)$' "$SPY/journalctl.log" || true)"
    assert_eq "${forbidden:-0}" 0 "journalctl was used for something other than reading or vacuuming"
  fi
  # No git command may ever mutate a repository.
  local head_before
  head_before="$(git -C "$SITES/site-1/build" rev-parse HEAD 2>/dev/null)"
  FAKE_PCT=87 sm cleanup --full >/dev/null
  assert_eq "$(git -C "$SITES/site-1/build" rev-parse HEAD 2>/dev/null)" "$head_before" \
    "a git HEAD moved during cleanup"
}

t_large_files_never_deleted() {
  # LARGE_FILE_MIN_MB is 1 in the sandbox, so a 3 MB upload qualifies.
  head -c 3000000 /dev/zero >"$SITES/site-1/public/uploads/big-gallery.jpg"
  local out
  out="$(FAKE_PCT=97 sm large-files --force)"
  assert_contains "$out" "ever deleted automatically"
  assert_contains "$out" "big-gallery.jpg"
  assert_contains "$out" "protected"
  # Reporting it must not remove it, at any usage level.
  assert_exists "$SITES/site-1/public/uploads/big-gallery.jpg"
  assert_exists "$SITES/site-1/releases/20260101000000/.next/BUILD_ID"
  rm -f "$SITES/site-1/public/uploads/big-gallery.jpg"
}

t_open_deleted_reported_not_killed() {
  local out
  out="$(sm open-deleted)"
  assert_contains "$out" "4242"
  assert_contains "$out" "never kills a process"
  # And nothing in the suite ever sent a signal.
  if [ -f "$SPY/pm2.log" ]; then
    assert_not_contains "$(cat "$SPY/pm2.log")" "kill"
  fi
}

t_report_and_health() {
  local out
  out="$(FAKE_PCT=68 sm report)"
  assert_contains "$out" "AUTOMATIC STORAGE MANAGER"
  assert_contains "$out" "0 applications stopped"
  assert_contains "$out" "TOTAL SAFE"
  out="$(FAKE_PCT=68 sm health)"
  assert_contains "$out" "DISK"
  assert_contains "$out" "PM2"
  assert_contains "$out" "PROJECTS DETECTED"
  assert_contains "$out" "PROJECTS PROTECTED"
}

t_audit_trail_written() {
  drop_cache
  FAKE_PCT=82 sm cleanup --auto >/dev/null
  local hist="$SANDBOX/var/log/storage-manager/storage-manager-history.log"
  [ -f "$hist" ] || {
    fail "no history file"
    return
  }
  local content
  content="$(cat "$hist")"
  assert_contains "$content" "before     usage="
  assert_contains "$content" "after      usage="
  assert_contains "$content" "stopped=0 restarted=0 killed=0"
  assert_contains "$content" "category   "
  [ -f "$SANDBOX/var/log/storage-manager/storage-manager.log" ] ||
    fail "no run log"
}

t_symlinked_root_still_works() {
  # A VPS with a data volume often has /srv/sites as a symlink. Candidates below
  # a symlinked root must still be cleanable, while a symlink *below* the root
  # stays refused.
  local real="$SANDBOX/mnt/data/pm2logs" link="$SANDBOX/home/root/linked-logs"
  mkdir -p "$real"
  ln -sfn "$real" "$link"
  head -c 400000 /dev/zero >"$real/app-out__old.log.gz"
  touch -d '40 days ago' "$real/app-out__old.log.gz"
  ln -sfn "$SANDBOX/etc/nginx/sites-enabled/site-1.conf" "$real/sneaky.log.1"

  local alt="$SANDBOX/etc/symlink.conf"
  grep -v '^PM2_LOG_DIRS=' "$CONF" >"$alt"
  printf 'PM2_LOG_DIRS=%s\n' "$link" >>"$alt"

  # An old symlink in a temp directory: temp cleanup considers entries of any
  # type, so this one does reach the gate.
  ln -sfn "$SANDBOX/etc/nginx/sites-enabled/site-1.conf" "$SANDBOX/tmp/old-link"
  touch -h -d '30 days ago' "$SANDBOX/tmp/old-link"

  local out
  out="$(PATH="$FAKEBIN:$PATH" SM_CONF="$alt" FAKE_PCT=82 \
    bash "$SM" cleanup --auto 2>&1)"
  assert_gone "$real/app-out__old.log.gz"
  # Both planted symlinks survive, as do their targets. The log scan never even
  # offers a symlink (it matches regular files only); the gate refuses the one
  # that does reach it.
  assert_exists "$real/sneaky.log.1"
  assert_exists "$SANDBOX/tmp/old-link"
  assert_exists "$SANDBOX/etc/nginx/sites-enabled/site-1.conf"
  assert_contains "$out" "refused by safety gate: symlink"
  rm -rf "$link" "$SANDBOX/mnt" "$SANDBOX/tmp/old-link"
}

t_duplicate_dirs_do_not_both_look_online() {
  # A real server had the same site in two places. Matching PM2 apps on name
  # alone reported both copies as ONLINE, inflated the counts, and hid which
  # copy was actually being served. The copy PM2 runs from must win.
  local twin="$SITES/extra/site-1"
  mkdir -p "$twin"
  printf '{"name":"site-1"}\n' >"$twin/package.json"
  drop_cache
  local out
  out="$(FAKE_PCT=50 sm projects --force)"
  # site-1 proper is ONLINE (PM2's cwd resolves into it); the twin is not.
  printf '%s' "$out" | grep -qE '^site-1 +nextjs +ONLINE' || fail "the served copy should be ONLINE"
  # However many sites earlier tests added, ONLINE can never exceed the number of
  # apps PM2 actually reports as online.
  local online expected
  online="$(printf '%s' "$out" | grep -c ' ONLINE ')"
  expected="$(grep -c "$(printf '\tonline\t')" "$SM_PM2_SPEC")"
  assert_eq "$online" "$expected" "ONLINE count must match the running PM2 apps"
  printf '%s' "$out" | grep -A2 "$twin" | grep -q 'no PM2 process maps to this directory' ||
    fail "the unserved twin should report that no PM2 process maps to it"
  rm -rf "$SITES/extra"
  drop_cache
}

t_investigate_finds_the_elephant() {
  # The case safe cleanup cannot solve: the disk is full of application data.
  # investigate has to name where it is instead of reporting 0 MB reclaimable.
  local nested="$SITES/site-1/.next/standalone/.next/standalone"
  mkdir -p "$nested/chunks"
  head -c 2000000 /dev/zero >"$nested/chunks/duplicate.js" 2>/dev/null
  local out
  out="$(FAKE_PCT=99 sm investigate --sample=1 --force)"
  assert_contains "$out" "NESTED STANDALONE BUNDLES"
  assert_contains "$out" "$nested"
  assert_contains "$out" "LARGEST PROJECTS"
  assert_contains "$out" "INSIDE"
  assert_contains "$out" "DELETED BUT STILL OPEN"
  assert_contains "$out" "SUGGESTED ORDER OF WORK"
  # Read-only: the finding is reported, never acted on.
  assert_exists "$nested/chunks/duplicate.js"
  assert_exists "$SITES/site-1/shared/.env"
  rm -rf "$SITES/site-1/.next"
  drop_cache
}

t_report_points_at_application_data() {
  reset_optins
  drop_cache
  local out
  out="$(FAKE_PCT=99 sm report --force)"
  assert_contains "$out" "Safe cleanup cannot reach the target on its own"
  assert_contains "$out" "storage-manager investigate"
  # And when the disk is fine, that advice must not appear.
  out="$(FAKE_PCT=50 sm report)"
  assert_not_contains "$out" "Safe cleanup cannot reach the target"
}

t_open_deleted_shows_the_path() {
  local out
  out="$(sm open-deleted)"
  # The fake reports "/var/log/deleted-by-someone.log (deleted)". lsof puts the
  # marker last, so a naive $NF prints "(deleted)" instead of the file.
  assert_contains "$out" "deleted-by-someone.log"
  assert_not_contains "$out" "MB  (deleted)"
}

t_category_accounting() {
  reset_optins
  drop_cache
  # A category that did nothing must report 0, not the whole free space. This
  # broke once: an early return credited the category with df's free figure
  # because it had never recorded a starting point.
  local out
  out="$(FAKE_PCT=82 sm cleanup --auto)"
  local block
  block="$(printf '%s\n' "$out" | sed -n '/By category:/,$p')"
  assert_not_contains "$block" "36.0 GB"
  printf '%s\n' "$block" | grep -qE '^  apt +0 MB' || fail "apt should report 0 MB when it did nothing"
  # And the total credited can never exceed the disk.
  local mb
  while read -r name value unit; do
    [ "$unit" = "GB" ] || continue
    mb="${value%.*}"
    [ "${mb:-0}" -lt 200 ] || fail "category $name claims $value $unit, which is more than the disk"
  done < <(printf '%s\n' "$block" | tail -n +2)
}

t_root_pass_when_available() {
  if ! sudo -n true 2>/dev/null; then
    printf '        (skipped: no passwordless sudo in this environment)\n'
    return 0
  fi
  reset_optins
  drop_cache
  # The timer runs as root, so exercise the privileged branches too: apt and
  # journal are skipped for non-root and would otherwise never be covered.
  local out
  out="$(sudo -n env PATH="$FAKEBIN:$PATH" SM_CONF="$CONF" SM_SPY="$SPY" \
    SM_PM2_SPEC="$SM_PM2_SPEC" HOME="$SANDBOX/home/root" FAKE_PCT=82 \
    bash "$SM" cleanup --auto 2>&1)"
  assert_contains "$out" "vacuum the journal"
  assert_not_contains "$out" "needs root privileges"
  # Root has the power to delete anything; the gate must still hold.
  assert_exists "$SITES/site-1/shared/.env"
  assert_exists "$SITES/site-1/build/node_modules/left-pad/index.js"
  assert_exists "$SANDBOX/etc/nginx/sites-enabled/site-1.conf"
  assert_exists "$SANDBOX/var/log/nginx/access.log"
  # Root-owned state and log files would break later non-root runs.
  sudo -n chown -R "$(id -u):$(id -g)" "$SANDBOX/var" "$SANDBOX/lock" 2>/dev/null
  drop_cache
}

t_cli_surface() {
  local out
  out="$(sm version)"
  assert_contains "$out" "storage-manager 1."
  out="$(sm help)"
  assert_contains "$out" "storage-manager status"
  assert_contains "$out" "cleanup --dry-run"
  out="$(sm config)"
  assert_contains "$out" "TARGET_FREE_GB=60"
  assert_contains "$out" "ALLOW_NODE_MODULES_CLEANUP=false"
  out="$(sm logs 5)"
  assert_contains "$out" "["
  out="$(sm nonsense-command 2>&1)"
  assert_contains "$out" "unknown command"
  out="$(sm cleanup --nonsense 2>&1)"
  assert_contains "$out" "unknown option"
}

t_config_validation() {
  local bad="$SANDBOX/etc/bad.conf"
  # A root of / would make the whole filesystem a candidate.
  cp "$CONF" "$bad"
  printf 'DISCOVERY_ROOTS=/\n' >>"$bad"
  local out
  out="$(SM_CONF="$bad" bash "$SM" status 2>&1)"
  assert_contains "$out" "may not contain /"

  # Non-numeric threshold.
  cp "$CONF" "$bad"
  printf 'CLEANUP_USAGE_PERCENT=eighty\n' >>"$bad"
  out="$(SM_CONF="$bad" bash "$SM" status 2>&1)"
  assert_contains "$out" "must be a whole number"

  # Out-of-order thresholds.
  cp "$CONF" "$bad"
  printf 'WARNING_USAGE_PERCENT=99\n' >>"$bad"
  out="$(SM_CONF="$bad" bash "$SM" status 2>&1)"
  assert_contains "$out" "thresholds must ascend"

  # Anything that is not a KEY=VALUE assignment is refused outright.
  cp "$CONF" "$bad"
  printf 'rm -rf /tmp/should-never-run\n' >>"$bad"
  out="$(SM_CONF="$bad" bash "$SM" status 2>&1)"
  assert_contains "$out" "only KEY=VALUE assignments are allowed"
}

t_systemd_units_valid() {
  local svc="$SUITE_DIR/../systemd/storage-manager.service"
  local tmr="$SUITE_DIR/../systemd/storage-manager.timer"
  local s t
  s="$(cat "$svc")"
  t="$(cat "$tmr")"
  assert_contains "$s" "Type=oneshot"
  assert_contains "$s" "cleanup --auto"
  assert_contains "$s" "PrivateTmp=no"
  assert_contains "$t" "OnBootSec=5min"
  assert_contains "$t" "OnUnitActiveSec=15min"
  assert_contains "$t" "Persistent=true"
  assert_contains "$t" "WantedBy=timers.target"
  # A oneshot service must not be told to stay resident.
  assert_not_contains "$s" "Restart=always"
  if command -v systemd-analyze >/dev/null 2>&1; then
    local out
    out="$(systemd-analyze verify "$svc" "$tmr" 2>&1)"
    case "$out" in
    *"Failed to"* | *"Unknown lvalue"* | *"Invalid"*) fail "systemd-analyze verify complained: $out" ;;
    esac
  fi
}

t_installer_is_non_destructive() {
  # The installer must not contain a single destructive or disturbing call
  # against applications. Grep is crude but this is exactly the kind of mistake
  # that must never reach a production VPS.
  local script="$SUITE_DIR/../scripts/install-storage-manager.sh" body
  body="$(cat "$script")"
  local pattern
  for pattern in 'pm2 restart' 'pm2 reload' 'pm2 stop' 'pm2 delete' 'pm2 kill' \
    'systemctl restart nginx' 'systemctl reload nginx' 'nginx -s reload' \
    'npm ci' 'npm install' 'npm run build' 'git pull' 'git reset' 'git clean' \
    'rm -rf /' 'reboot'; do
    assert_not_contains "$body" "$pattern"
  done
  assert_contains "$body" "cleanup --dry-run"
  assert_contains "$body" 'read -r ANSWER'
  # A full disk is exactly when this gets run, and a half-copied program is
  # worse than none: refuse early, and never overwrite a working copy in place.
  assert_contains "$body" "too little to install safely"
  assert_contains "$body" '"$BIN_PATH.new"'
  assert_contains "$body" 'mv -f "$BIN_PATH.new" "$BIN_PATH"'
}

t_uninstaller_preserves_data() {
  local script="$SUITE_DIR/../scripts/uninstall-storage-manager.sh" body
  body="$(cat "$script")"
  assert_contains "$body" "disable --now storage-manager.timer"
  local pattern
  for pattern in '/srv/sites' '/var/www' 'pm2 delete' 'pm2 stop' 'node_modules'; do
    assert_not_contains "$body" "rm -rf $pattern"
  done
}

t_manager_never_names_dangerous_commands() {
  # Static guard over the manager itself. The source legitimately *mentions*
  # these strings — as process-detection patterns, as reasons in the audit, and
  # in `explain` output — so comments, quoted strings and heredoc bodies are
  # stripped first. Whatever survives is executable code.
  if ! command -v python3 >/dev/null 2>&1; then
    printf '        (skipped: needs python3 to strip strings)\n'
    return 0
  fi
  local body pattern
  body="$(python3 - "$SM" <<'PY'
import re, sys

src = open(sys.argv[1]).read().splitlines()
out, heredoc = [], None
for line in src:
    if heredoc is not None:
        if line.strip() == heredoc:
            heredoc = None
        continue
    m = re.search(r"<<-?\s*'?\"?([A-Za-z_][A-Za-z0-9_]*)'?\"?\s*$", line)
    if m:
        heredoc = m.group(1)
        line = line[: m.start()]
    line = re.sub(r"#.*$", "", line)
    line = re.sub(r"'[^']*'", "''", line)
    line = re.sub(r'"[^"]*"', '""', line)
    out.append(line)
print("\n".join(out))
PY
  )"
  for pattern in 'pm2 restart' 'pm2 reload' 'pm2 stop' 'pm2 delete' 'pm2 kill' \
    'pm2 flush' 'pm2 save' 'systemctl restart' 'systemctl reload' \
    'systemctl start' 'systemctl stop' 'nginx -s' 'kill -' 'pkill' 'killall' \
    'git reset' 'git clean' 'git checkout' 'git pull' 'git push' 'git fetch' \
    'npm ci' 'npm install' 'npm run' 'next build' 'apt-get autoremove' \
    'apt-get remove' 'apt-get install' 'shutdown' 'reboot' 'chown' 'chmod'; do
    assert_not_contains "$body" "$pattern"
  done
  # No blind recursive delete of a whole directory family, and no removal that
  # bypasses the gate: every rm in the program is inside sm_safe_remove.
  assert_not_contains "$body" 'rm -rf /*'
  # Three call sites and no more: the two inside sm_safe_remove, plus the one
  # that deletes the manager's own scratch file in large-files. Any new rm has
  # to be justified by changing this number deliberately.
  local rms
  rms="$(printf '%s\n' "$body" | grep -cE '(^|[[:space:]])rm[[:space:]]' || true)"
  assert_eq "${rms:-0}" 3 "number of rm call sites"
}

# =========================================================================
# main
# =========================================================================

# --demo builds the same simulated fleet and runs the pre-production validation
# sequence against it, printing everything instead of asserting. It is the
# rehearsal of what install-storage-manager.sh prints on a real server.
run_demo() {
  local pct="${FAKE_PCT:-82}"
  printf '\n%s\n' '########################################################'
  printf '# PRE-PRODUCTION VALIDATION (simulated fleet, %s%% full)\n' "$pct"
  printf '# 8 sites: 6 online, 1 stopped, 1 deploying, plus a tooling checkout\n'
  printf '%s\n' '########################################################'

  printf '\n----- 1-10. read-only audit -----\n'
  FAKE_PCT="$pct" sm health
  printf '\n'
  FAKE_PCT="$pct" sm report --force
  printf '\n----- projects, PM2 mapping, git state -----\n'
  FAKE_PCT="$pct" sm projects
  printf '\n----- decision engine -----\n'
  FAKE_PCT="$pct" sm explain

  printf '\n----- 11. full dry run -----\n'
  local before after
  before="$(fingerprint)"
  FAKE_PCT="$pct" sm cleanup --dry-run
  after="$(fingerprint)"

  printf '\n----- 12-15. verification -----\n'
  if [ "$before" = "$after" ]; then
    printf 'project files changed by the dry run:            0\n'
  else
    printf 'DRY RUN CHANGED THE FILESYSTEM — investigate:\n'
    diff <(printf '%s' "$before") <(printf '%s' "$after") | head -20
  fi
  printf 'pm2 state-changing commands issued:             %s\n' \
    "$(spy_count "$SPY/pm2.log" '^(restart|reload|stop|delete|kill|flush|save)')"
  printf 'nginx invocations other than a config test:     %s\n' \
    "$(spy_count "$SPY/nginx.log" '^-t$|^-T$' -v)"
  printf 'systemctl unit state changes:                   %s\n' \
    "$(spy_count "$SPY/systemctl.log" '(restart|reload|[^-]stop|[^-]start|enable|disable|mask)')"
  printf 'git mutations (reset/clean/checkout/pull/push):  0 (never invoked)\n'

  printf '\n----- 16. what an automatic run would then do for real -----\n'
  FAKE_PCT="$pct" sm cleanup --auto
  printf '\n----- application data after a real automatic run -----\n'
  local slug missing=0
  for slug in site-1 site-7 site-8; do
    for p in "shared/.env" "build/.git" "build/package.json" "build/node_modules" \
      "public/uploads/customer-photo.jpg" "releases/20260101000000/server.js" "current" \
      "shared/logs/out.log"; do
      if [ -e "$SITES/$slug/$p" ]; then
        printf '  intact   %s/%s\n' "$slug" "$p"
      else
        printf '  MISSING  %s/%s\n' "$slug" "$p"
        missing=$((missing + 1))
      fi
    done
  done
  printf '\nmissing application paths: %s\n' "$missing"
  printf '\n----- audit record -----\n'
  tail -30 "$SANDBOX/var/log/storage-manager/storage-manager-history.log" 2>/dev/null
}

printf 'storage-manager test suite\n'
printf 'sandbox: %s\n\n' "$SANDBOX"

make_fakes
make_sandbox
mkdir -p "$SANDBOX/nopm2"

if [ "$DEMO" = 1 ]; then
  run_demo
  exit 0
fi

run_test 'eight projects are discovered' t_eight_projects
run_test 'a future project is discovered without editing anything' t_future_project_detected
run_test 'discovery is cached so it does not walk the disk every run' t_project_cache_used
run_test 'online, offline, deploying and unmanaged states are classified' t_online_offline_deploying_unknown
run_test 'pm2 unavailable means UNKNOWN and therefore protected' t_pm2_unavailable_means_unknown
run_test 'threshold ladder picks the right level' t_thresholds
run_test 'free-space target can trigger cleanup on its own' t_target_free_space_logic
run_test 'a healthy disk triggers no cleanup at all' t_no_cleanup_when_healthy
run_test 'dry run changes nothing on disk' t_dry_run_changes_nothing
run_test 'dry run explains every skip and protection' t_dry_run_explains_skips
run_test 'rotated logs are cleaned, active logs are untouched' t_rotated_logs_cleaned_active_kept
run_test 'temp cleanup respects age, open files and service dirs' t_temp_cleanup_rules
run_test 'a full run at 97% leaves all application data intact' t_application_data_untouched_by_full_run
run_test 'opt-ins are refused for online and deploying projects' t_online_project_optins_refused
run_test 'an offline project still needs a clean git tree' t_offline_project_needs_clean_git
run_test 'critical and emergency force-disable every opt-in' t_critical_level_force_disables_optins
run_test 'emergency alerts a human instead of deleting more' t_emergency_alerts_instead_of_deleting
run_test 'a per-project deploy lock protects the project' t_deployment_lock_protects
run_test 'the fleet build lock protects every project' t_global_deploy_lock_protects
run_test 'only one instance acts at a time' t_concurrency_lock
run_test 'a failed removal is logged and contained' t_failed_removal_is_contained
run_test 'the safety gate refuses protected paths' t_safety_gate_refuses_protected_paths
run_test 'the manager protects its own checkout' t_self_protection
run_test 'no application-disturbing command is ever issued' t_no_application_disturbing_command
run_test 'large files are reported, never deleted' t_large_files_never_deleted
run_test 'deleted-but-open files are reported, never killed' t_open_deleted_reported_not_killed
run_test 'report and health commands work' t_report_and_health
run_test 'the audit trail records before, after and guarantees' t_audit_trail_written
run_test 'duplicate directories do not both look online' t_duplicate_dirs_do_not_both_look_online
run_test 'investigate names where the space actually is' t_investigate_finds_the_elephant
run_test 'the report points at application data when safe cleanup cannot reach the target' t_report_points_at_application_data
run_test 'open-deleted prints the file path, not the marker' t_open_deleted_shows_the_path
run_test 'a symlinked root is handled, a symlink below it is refused' t_symlinked_root_still_works
run_test 'per-category totals are accounted honestly' t_category_accounting
run_test 'the safety gate holds when running as root' t_root_pass_when_available
run_test 'the command line surface behaves' t_cli_surface
run_test 'bad configuration is refused' t_config_validation
run_test 'systemd units are shaped correctly' t_systemd_units_valid
run_test 'the installer is non-destructive' t_installer_is_non_destructive
run_test 'the uninstaller preserves application data' t_uninstaller_preserves_data
run_test 'the manager never names a dangerous command' t_manager_never_names_dangerous_commands

printf '\n%s\n' '--------------------------------------------------------'
printf '%s passed, %s failed\n' "$PASS" "$FAIL"
if [ "$FAIL" -gt 0 ]; then
  printf '\nfailures:\n'
  for f in "${FAILURES[@]}"; do printf '  %s\n' "$f"; done
  exit 1
fi
printf '\nProven by this run:\n'
printf '  no application was stopped, restarted, reloaded or killed\n'
printf '  no project directory was deleted\n'
printf '  no .env, .git, upload, database or certificate was touched\n'
printf '  the dry run changed nothing at all\n'
exit 0
