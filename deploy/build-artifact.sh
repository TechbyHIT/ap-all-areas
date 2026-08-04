#!/usr/bin/env bash
# Build one standalone bundle that several sites can share.
#
#   sudo bash deploy/build-artifact.sh --repo <url> [--branch main] \
#        [--env /path/to/build.env] [--out /tmp/app.tar.gz]
#   sudo bash deploy/deploy-all.sh --artifact /tmp/app.tar.gz
#
# WHEN THIS IS SAFE
#   Next.js inlines NEXT_PUBLIC_* variables into the client bundle at build
#   time. In this app `src/config/business.ts` reads NEXT_PUBLIC_SITE_URL, so a
#   shared artifact is only correct for sites that should share that value
#   (same brand and domain, e.g. blue/green or a canary host).
#
#   For 50 sites on 50 different domains, either give each site its own build
#   (deploy-all.sh without --artifact) or move the site URL to a runtime lookup
#   (derive it from the request Host header instead of NEXT_PUBLIC_SITE_URL)
#   and then one artifact can serve the whole fleet.
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

REPO=""
BRANCH="main"
ENV_FILE=""
OUT="/tmp/ap-artifact-$(date +%Y%m%d%H%M%S).tar.gz"
WORK="${AP_ARTIFACT_WORK:-/tmp/ap-artifact-build}"

while [ $# -gt 0 ]; do
  case "$1" in
  --repo)
    REPO="$2"
    shift 2
    ;;
  --branch)
    BRANCH="$2"
    shift 2
    ;;
  --env)
    ENV_FILE="$2"
    shift 2
    ;;
  --out)
    OUT="$2"
    shift 2
    ;;
  -h | --help)
    sed -n '2,20p' "$0"
    exit 0
    ;;
  *) die "unknown option: $1" ;;
  esac
done

[ -n "$REPO" ] || die "--repo is required"
require_cmd git
require_cmd node

mkdir -p "$(dirname "$AP_BUILD_LOCK")"
exec 9>"$AP_BUILD_LOCK"
flock -w 7200 9 || die "another build holds the lock"

log "Building artifact from $REPO ($BRANCH)"
rm -rf "$WORK"
git clone --depth 1 --branch "$BRANCH" "$REPO" "$WORK"

[ -n "$ENV_FILE" ] && {
  [ -f "$ENV_FILE" ] || die "env file not found: $ENV_FILE"
  cp "$ENV_FILE" "$WORK/.env"
}

(
  cd "$WORK"
  npm ci --no-audit --no-fund --prefer-offline
  export NODE_ENV=production
  export NEXT_TELEMETRY_DISABLED=1
  export NODE_OPTIONS="--max-old-space-size=$AP_NODE_MAX_OLD_SPACE"
  npm run build
  npm run prepare:standalone
)

[ -f "$WORK/.next/standalone/server.js" ] || die "no standalone output produced"

# Runtime caches and env are provided per-site, so never ship them.
rm -rf "$WORK/.next/standalone/.next/cache" "$WORK/.next/standalone/.env"

log "Packing $OUT"
tar -czf "$OUT" -C "$WORK/.next/standalone" .

log "Cleaning build tree"
rm -rf "$WORK"

log "Artifact ready: $OUT ($(size_of "$OUT"))"
info "deploy it with: sudo bash deploy/deploy-all.sh --artifact $OUT"
