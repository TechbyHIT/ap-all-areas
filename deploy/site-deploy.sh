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
# The public pages are built from src/data, so a site with no database needs no
# env at all. Create an empty file so the env plumbing below stays uniform.
[ -f "$SHARED/.env" ] || {
  warn "no $SHARED/.env — deploying without one (fine unless you use /admin)"
  : >"$SHARED/.env"
  chmod 600 "$SHARED/.env"
}

# Only one build at a time: concurrent `next build` runs will OOM the box.
mkdir -p "$(dirname "$AP_BUILD_LOCK")"
exec 9>"$AP_BUILD_LOCK"
flock -w 7200 9 || die "another site build has held the lock for 2h — investigate"

log "Deploying $SLUG ($DOMAIN) on port $PORT"

# A failed build mid-way can fill the disk; bail out early instead.
FREE_MB="$(df -Pm "$DIR" | awk 'NR==2 {print $(NF-2)}')"
info "free space: ${FREE_MB} MB"
if [ "$FREE_MB" -lt 4000 ]; then
  warn "under 4 GB free — running safe cleanup first"
  bash "$AP_DEPLOY_DIR/disk-cleanup.sh" || true
  FREE_MB="$(df -Pm "$DIR" | awk 'NR==2 {print $(NF-2)}')"
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

  # A registry entry written before the remote was checked can name a branch
  # that does not exist. Correct it here rather than failing the clone.
  if ! remote_has_branch "$REPO" "$BRANCH"; then
    DETECTED="$(detect_default_branch "$REPO")"
    [ -n "$DETECTED" ] || die "branch '$BRANCH' not found on $REPO and no default branch reported"
    warn "branch '$BRANCH' does not exist on the remote — using '$DETECTED'"
    BRANCH="$DETECTED"
    if sed -i "s|^BRANCH=.*|BRANCH=$DETECTED|" "$(site_conf "$SLUG")" 2>/dev/null; then
      info "updated BRANCH in $(site_conf "$SLUG")"
    fi
  fi

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
    if ! npm ci --no-audit --no-fund --prefer-offline; then
      warn "npm ci failed (lock drift) — falling back to npm install"
      npm install --no-audit --no-fund
    fi
  )

  if [ "$SKIP_MIGRATE" = 0 ]; then
    (
      cd "$BUILD"
      set -a
      # shellcheck disable=SC1091
      . "$SHARED/.env"
      set +a

      if [ -z "${DATABASE_URL:-}" ]; then
        log "No DATABASE_URL — skipping schema setup"
        info "the public site does not query the database; /admin and the"
        info "scripts/ tools are the only things that need one"
      elif [ -d "$BUILD/prisma/migrations" ]; then
        log "Applying database migrations"
        npx prisma migrate deploy
      else
        # This project tracks the schema with `db push` rather than migration
        # files, so `migrate deploy` would abort with no migrations found.
        log "No prisma/migrations — syncing schema with db push"
        npx prisma db push --skip-generate
      fi
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
    # SSG seed caps — override in shared/.env or /etc/ap-sites/config.
    # Millions of URLs stay live via dynamicParams; only the seed is on disk.
    export PRERENDER_CITY_LIMIT="${PRERENDER_CITY_LIMIT:-2}"
    export PRERENDER_AREA_LIMIT="${PRERENDER_AREA_LIMIT:-8}"
    export PRERENDER_KEYWORD_LIMIT="${PRERENDER_KEYWORD_LIMIT:-8}"
    info "prerender seed: cities=$PRERENDER_CITY_LIMIT areas=$PRERENDER_AREA_LIMIT keywords=$PRERENDER_KEYWORD_LIMIT"
    npm run build
    # Some repos name this prepare:standalone, others build:standalone.
    if ! npm run prepare:standalone --if-present; then
      if ! npm run build:standalone --if-present; then
        if [ -f scripts/prepare-standalone.mjs ]; then
          node scripts/prepare-standalone.mjs
        else
          die "no prepare:standalone / build:standalone script after next build"
        fi
      fi
    fi
  )

  [ -f "$BUILD/.next/standalone/server.js" ] ||
    die "build produced no .next/standalone/server.js"

  log "Validating sitemap registry (integrity)"
  (
    cd "$BUILD"
    set -a
    # shellcheck disable=SC1090
    [ -f "$SHARED/.env" ] && . "$SHARED/.env"
    set +a
    export NODE_ENV=production
    export SITEMAP_VALIDATE_HTTP=0
    npm run seo:validate-sitemap
  ) || die "sitemap registry validation failed — refusing promote"

  log "Promoting build to $RELEASE"
  mv "$BUILD/.next/standalone" "$RELEASE"
  # Defence in depth: strip any .map files prepare-standalone missed.
  find "$RELEASE" -type f -name '*.map' -delete 2>/dev/null || true
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
[ -f "$ECO" ] || die "PM2 ecosystem not found at $ECO — run deploy/server-setup.sh"

log "Reloading PM2 from $ECO"
if pm2_app_exists "$SLUG"; then
  pm2 reload "$ECO" --only "$SLUG" --update-env
else
  pm2 start "$ECO" --only "$SLUG"
fi
pm2 save >/dev/null 2>&1 || warn "pm2 save failed"

# If PM2 did not read the file as config it will have run it as a script, so no
# app called $SLUG exists and the health check below would fail for a reason
# that has nothing to do with the app.
if ! pm2_app_exists "$SLUG"; then
  warn "PM2 has no process named '$SLUG' after starting $ECO"
  info "PM2 identifies config files by name; the path must end in .config.cjs"
  stray="$(basename "$ECO" .cjs)"
  pm2 describe "$stray" >/dev/null 2>&1 &&
    info "it started the config file as an app instead: pm2 delete $stray"
  die "PM2 did not start '$SLUG' — fix the above and re-run"
fi

# --------------------------------------------------------------- health check
# HOSTNAME=localhost (required for Next middleware rewrites) may bind IPv6
# ::1 only on some hosts. Probe both names so a healthy app is not rolled back.
log "Health check on port $PORT (localhost and 127.0.0.1)"
HEALTHY=0
# -s without -S so a connection refused during startup does not print 20 times.
for attempt in $(seq 1 45); do
  if curl -fs -o /dev/null -m 5 "http://localhost:$PORT/" 2>/dev/null ||
    curl -fs -o /dev/null -m 5 "http://127.0.0.1:$PORT/" 2>/dev/null; then
    HEALTHY=1
    info "healthy after ${attempt}s"
    break
  fi
  sleep 1
done

if [ "$HEALTHY" = 0 ]; then
  warn "site did not answer on port $PORT"
  info "last error log lines:"
  tail -n 40 "$SHARED/logs/error.log" 2>/dev/null | sed 's/^/      /' || true
  info "listen sockets:"
  ss -ltnp 2>/dev/null | grep -E ":$PORT\\b" | sed 's/^/      /' || true
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

# ----------------------------------------------- post-health sitemap HTTP sample
# Registry integrity already ran pre-promote. After the app is healthy, sample
# live HTML for status / canonical path / robots (uses BUILD tree if still present).
if [ -f "$BUILD/package.json" ] && [ -d "$BUILD/node_modules" ] &&
  grep -q 'seo:validate-sitemap' "$BUILD/package.json"; then
  log "Validating sitemap HTTP sample on localhost:$PORT"
  if ! (
    cd "$BUILD"
    set -a
    # shellcheck disable=SC1090
    [ -f "$SHARED/.env" ] && . "$SHARED/.env"
    set +a
    export NODE_ENV=production
    export SITEMAP_VALIDATE_HTTP=1
    export SITEMAP_VALIDATE_BASE="http://localhost:${PORT}"
    npm run seo:validate-sitemap
  ); then
    warn "HTTP sitemap sample failed"
    if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ] && [ "$PREVIOUS" != "$RELEASE" ]; then
      warn "rolling back to $PREVIOUS"
      ln -sfn "$PREVIOUS" "$CURRENT.tmp"
      mv -Tf "$CURRENT.tmp" "$CURRENT"
      pm2 reload "$ECO" --only "$SLUG" --update-env || true
      rm -rf "$RELEASE"
    fi
    die "sitemap HTTP validation failed"
  fi
else
  info "skipping HTTP sitemap sample (no build tree / script) — registry gate already passed when built from source"
fi

# ---------------------------------------------------------------------- prune
log "Pruning build artifacts"
rm -rf "$BUILD/.next"
# Turbopack / SWC scratch left beside the checkout.
rm -rf "$BUILD/.turbo" "$BUILD/.swc" 2>/dev/null || true
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
