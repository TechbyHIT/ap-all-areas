#!/usr/bin/env bash
# Build and release one site, then prune everything the running app does not
# need. This is what keeps a site at ~350 MB instead of ~4 GB.
#
#   sudo bash deploy/site-deploy.sh <slug>
#   sudo bash deploy/site-deploy.sh <slug> --keep-node-modules   # faster rebuilds
#   sudo bash deploy/site-deploy.sh <slug> --artifact /tmp/app.tar.gz
#   sudo bash deploy/site-deploy.sh <slug> --skip-migrate
#
# Layout produced:
#   /srv/sites/<slug>/build              source checkout (pruned after build)
#   /srv/sites/<slug>/releases/<ts>      standalone bundle, self-contained
#   /srv/sites/<slug>/current -> releases/<ts>
#   /srv/sites/<slug>/shared/{.env,cache,logs}
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

[ $# -ge 1 ] || die "usage: site-deploy.sh <slug> [--keep-node-modules] [--artifact PATH] [--skip-migrate]"

SLUG_ARG="$1"
shift
KEEP_NODE_MODULES=0
ARTIFACT=""
SKIP_MIGRATE=0

while [ $# -gt 0 ]; do
  case "$1" in
  --keep-node-modules)
    KEEP_NODE_MODULES=1
    shift
    ;;
  --artifact)
    ARTIFACT="$2"
    shift 2
    ;;
  --skip-migrate)
    SKIP_MIGRATE=1
    shift
    ;;
  *) die "unknown option: $1" ;;
  esac
done

require_cmd node
require_cmd pm2
load_site "$SLUG_ARG"

DIR="$(site_dir "$SLUG")"
BUILD="$DIR/build"
RELEASES="$DIR/releases"
SHARED="$DIR/shared"
CURRENT="$DIR/current"
STAMP="$(date +%Y%m%d%H%M%S)"
RELEASE="$RELEASES/$STAMP"
PREVIOUS="$(readlink -f "$CURRENT" 2>/dev/null || true)"

mkdir -p "$BUILD" "$RELEASES" "$SHARED/logs" "$SHARED/cache"
[ -f "$SHARED/.env" ] || die "missing $SHARED/.env — create it before deploying"

# Only one build at a time: concurrent `next build` runs will OOM the box.
mkdir -p "$(dirname "$AP_BUILD_LOCK")"
exec 9>"$AP_BUILD_LOCK"
flock -w 7200 9 || die "another site build has held the lock for 2h — investigate"

log "Deploying $SLUG ($DOMAIN) on port $PORT"

# A failed build mid-way can fill the disk; bail out early instead.
FREE_MB="$(df -Pm "$DIR" | awk 'NR==2 {print $4}')"
info "free space: ${FREE_MB} MB"
if [ "$FREE_MB" -lt 4000 ]; then
  warn "under 4 GB free — running safe cleanup first"
  bash "$AP_DEPLOY_DIR/disk-cleanup.sh" || true
  FREE_MB="$(df -Pm "$DIR" | awk 'NR==2 {print $4}')"
  [ "$FREE_MB" -lt 2500 ] && die "still only ${FREE_MB} MB free — free space before deploying"
fi

# --------------------------------------------------------------------- build
if [ -n "$ARTIFACT" ]; then
  # Reuse a bundle built elsewhere (see build-artifact.sh). Cheapest path when
  # many sites run the same code.
  log "Installing prebuilt artifact $ARTIFACT"
  [ -e "$ARTIFACT" ] || die "artifact not found: $ARTIFACT"
  mkdir -p "$RELEASE"
  if [ -d "$ARTIFACT" ]; then
    cp -a "$ARTIFACT/." "$RELEASE/"
  else
    tar -xzf "$ARTIFACT" -C "$RELEASE"
  fi
  [ -f "$RELEASE/server.js" ] || die "artifact has no server.js at its root"
else
  [ -n "$REPO" ] || die "no REPO in $(site_conf "$SLUG") — pass --artifact instead"
  require_cmd git

  if [ -d "$BUILD/.git" ]; then
    log "Updating checkout ($BRANCH)"
    git -C "$BUILD" remote set-url origin "$REPO"
    git -C "$BUILD" fetch --depth 1 origin "$BRANCH"
    git -C "$BUILD" reset --hard "origin/$BRANCH"
    git -C "$BUILD" clean -fd -e node_modules
  else
    log "Cloning $REPO ($BRANCH)"
    rm -rf "$BUILD"
    # Shallow clone: full history on 50 sites is pure waste.
    git clone --depth 1 --branch "$BRANCH" "$REPO" "$BUILD"
  fi

  ln -sfn "$SHARED/.env" "$BUILD/.env"

  log "Installing dependencies"
  (
    cd "$BUILD"
    npm ci --no-audit --no-fund --prefer-offline
  )

  if [ "$SKIP_MIGRATE" = 0 ]; then
    log "Applying database migrations"
    (
      cd "$BUILD"
      set -a
      # shellcheck disable=SC1091
      . "$SHARED/.env"
      set +a
      [ -n "${DATABASE_URL:-}" ] || die "DATABASE_URL not set in $SHARED/.env"
      npx prisma migrate deploy
    )
  fi

  log "Building (standalone)"
  (
    cd "$BUILD"
    set -a
    # shellcheck disable=SC1091
    . "$SHARED/.env"
    set +a
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1
    export NODE_OPTIONS="--max-old-space-size=$AP_NODE_MAX_OLD_SPACE"
    npm run build
    npm run prepare:standalone
  )

  [ -f "$BUILD/.next/standalone/server.js" ] ||
    die "build produced no .next/standalone/server.js"

  log "Promoting build to $RELEASE"
  mv "$BUILD/.next/standalone" "$RELEASE"
fi

# ------------------------------------------------------------- wire up release
# Runtime cache lives outside the release so it survives deploys and can be
# pruned in one place.
rm -rf "$RELEASE/.next/cache"
mkdir -p "$RELEASE/.next"
ln -sfn "$SHARED/cache" "$RELEASE/.next/cache"
ln -sfn "$SHARED/.env" "$RELEASE/.env"

log "Switching $CURRENT -> releases/$STAMP"
ln -sfn "$RELEASE" "$CURRENT.tmp"
mv -Tf "$CURRENT.tmp" "$CURRENT"

# ------------------------------------------------------------------------ pm2
ECO="$(ecosystem_path)"
log "Reloading PM2 from $ECO"
if pm2_app_exists "$SLUG"; then
  pm2 reload "$ECO" --only "$SLUG" --update-env
else
  pm2 start "$ECO" --only "$SLUG"
fi
pm2 save >/dev/null 2>&1 || warn "pm2 save failed"

# --------------------------------------------------------------- health check
log "Health check on http://127.0.0.1:$PORT/"
HEALTHY=0
for attempt in $(seq 1 20); do
  if curl -fsS -o /dev/null -m 10 "http://127.0.0.1:$PORT/"; then
    HEALTHY=1
    info "healthy after ${attempt}s"
    break
  fi
  sleep 1
done

if [ "$HEALTHY" = 0 ]; then
  warn "site did not answer on port $PORT"
  if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ] && [ "$PREVIOUS" != "$RELEASE" ]; then
    warn "rolling back to $PREVIOUS"
    ln -sfn "$PREVIOUS" "$CURRENT.tmp"
    mv -Tf "$CURRENT.tmp" "$CURRENT"
    pm2 reload "$ECO" --only "$SLUG" --update-env || true
    rm -rf "$RELEASE"
  fi
  info "logs: pm2 logs $SLUG --lines 100"
  exit 1
fi

# ---------------------------------------------------------------------- prune
log "Pruning build artifacts"
rm -rf "$BUILD/.next"
if [ "$KEEP_NODE_MODULES" = 0 ]; then
  # ~700 MB-1.5 GB per site. The release bundle carries its own traced deps, so
  # nothing at runtime needs this. `npm ci` restores it on the next deploy.
  rm -rf "$BUILD/node_modules"
  info "removed build/node_modules (use --keep-node-modules for faster rebuilds)"
fi

LIVE="$(readlink -f "$CURRENT")"
KEEP_OTHERS=$((AP_KEEP_RELEASES - 1))
[ "$KEEP_OTHERS" -lt 0 ] && KEEP_OTHERS=0
KEPT=0
# Newest first by name (timestamps), never the live release.
while read -r name; do
  [ -n "$name" ] || continue
  old="$RELEASES/$name"
  [ "$(readlink -f "$old")" = "$LIVE" ] && continue
  KEPT=$((KEPT + 1))
  [ "$KEPT" -le "$KEEP_OTHERS" ] && continue
  info "removing old release $name"
  rm -rf "$old"
done < <(find "$RELEASES" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' 2>/dev/null | sort -r)

log "$SLUG deployed"
info "site total:   $(size_of "$DIR")"
info "live release: $(size_of "$RELEASE")"
info "url:          https://$DOMAIN"
