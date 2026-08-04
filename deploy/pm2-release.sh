#!/usr/bin/env bash
# Release helper for Option 2: PM2 + Next.js standalone (no Docker)
# Run from the project root on the VPS after git pull.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Install deps"
npm ci

echo "==> Prisma generate + schema sync"
npx prisma generate
if [ -d prisma/migrations ]; then
  npx prisma migrate deploy
else
  # No migration files in this project; the schema is tracked with db push.
  npx prisma db push --skip-generate
fi

echo "==> Build standalone"
npm run build
npm run prepare:standalone

echo "==> Optional disk cleanup (keeps standalone runnable)"
# Uncomment on tight disks after a successful prepare + pm2 reload:
# rm -rf node_modules
# npm ci --omit=dev   # only if you still need prisma CLI on the box later

echo "==> PM2 reload (or start)"
if pm2 describe sk-invisible-grills >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
fi

pm2 save
pm2 status

echo "Done. nginx should proxy to 127.0.0.1:\$PORT (default 3000)."
