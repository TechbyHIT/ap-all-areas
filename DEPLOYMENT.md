# Deployment — Option 2: PM2 + standalone Node (no Docker)

**Stack:** Node.js + PM2 + nginx  
**Why:** Same Next.js app, less Docker overhead, easier disk cleanup than `containerd`.

> Running more than a couple of sites on one VPS? Use
> **[MULTISITE.md](./MULTISITE.md)** instead. It replaces the manual steps below
> with a site registry and scripts that cap disk per site, which is what makes
> 50 sites fit on a 200 GB disk.

| | Docker | PM2 (no Docker) |
|---|---|---|
| Disk per site | ~1–1.5 GB | ~800 MB–1 GB |
| Build cache bloat | In `/var/lib/containerd` | In project folder (easy to delete) |
| 10 sites | ~12–18 GB | ~8–12 GB |

---

## Prerequisites

1. Ubuntu/Debian VPS with Node.js 20+ and nginx
2. PostgreSQL (local or managed)
3. Global PM2: `npm i -g pm2`
4. Env from `.env.example` → `.env` on the server
5. Production domain in `NEXT_PUBLIC_SITE_URL`

---

## One-time server setup

```bash
# Node 20 (example via NodeSource / nvm — use your preferred install)
npm i -g pm2
pm2 startup   # enable boot persistence, follow printed command
sudo apt install -y nginx
```

Place the app, e.g. `/var/www/sk-invisible-grills`.

---

## Build & run (standalone)

```bash
cd /var/www/sk-invisible-grills
cp .env.example .env   # then edit secrets + NEXT_PUBLIC_SITE_URL
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build:standalone   # next build + copy public/static/prisma into .next/standalone
```

### Local smoke test (no PM2)

```bash
# From project root — standalone server reads PORT / HOSTNAME
set PORT=3000
set HOSTNAME=0.0.0.0
npm run start:standalone
# Linux/mac: PORT=3000 HOSTNAME=0.0.0.0 npm run start:standalone
```

### PM2 (production)

Default process: **`sk-invisible-grills` on port 3000** (`ecosystem.config.cjs`).

```bash
npm run pm2:start
pm2 save
pm2 status
```

After a new release:

```bash
npm run build:standalone
npm run pm2:reload
# or: bash deploy/pm2-release.sh
```

Useful:

```bash
npm run pm2:logs
npm run pm2:stop
```

**Important:** Use `HOSTNAME=0.0.0.0` (already set in ecosystem). Do not bind `localhost` only or nginx cannot reach the app.

---

## nginx

1. Copy `deploy/nginx-site.conf.example` → `/etc/nginx/sites-available/your-domain.conf`
2. Set `server_name` and upstream port (`3000`)
3. Enable site, `nginx -t`, reload
4. TLS: `certbot --nginx -d your-domain.com -d www.your-domain.com`

---

## Multi-site on one VPS (ports 3000, 3001, 3002…)

Each site = own project folder + own PM2 app + own nginx `server` block.

For anything past two or three sites, do not manage this by hand — see
**[MULTISITE.md](./MULTISITE.md)**, where `deploy/site-add.sh` allocates the port,
writes the registry entry and generates the vhost, and `deploy/site-deploy.sh`
prunes the build afterwards so each site stays under ~1 GB.

Manual version, for a single extra site:

1. Clone/build each site under e.g. `/var/www/site-a`, `/var/www/site-b`
2. In each `ecosystem.config.cjs` (or one combined file), set:
   - unique `name`
   - `cwd` → that site’s `.next/standalone`
   - `env.PORT` → `3000`, `3001`, `3002`, …
3. nginx: one `upstream` / `proxy_pass` per domain → matching port

Example ports:

| Site | PM2 name | PORT |
|---|---|---|
| SK Invisible Grills | `sk-invisible-grills` | 3000 |
| Site B | `site-b` | 3001 |
| Site C | `site-c` | 3002 |

---

## Disk hygiene (keep ~800 MB–1 GB per site)

After a successful `prepare:standalone` + PM2 reload you can reclaim build junk:

```bash
# Optional — only if you do not need local build tools until next release
rm -rf node_modules
# Keep .next/standalone + .env; next release: npm ci && build:standalone again

# Safe clears anytime
rm -rf .next/cache
```

Avoid Docker/`containerd` growth; project-folder caches are easy to delete.

---

## Post-deploy checklist

1. Set `NEXT_PUBLIC_SITE_URL` to the live HTTPS domain
2. Protect `/admin/` before public launch
3. Submit `/sitemap.xml` in Google Search Console
4. Publish Phase 1 (P0) pages only; expand after crawl looks healthy

---

## Files in this repo

| File | Role |
|---|---|
| `next.config.ts` | `output: "standalone"` + Prisma trace includes |
| `scripts/prepare-standalone.mjs` | Copy `public`, `.next/static`, Prisma client into standalone |
| `ecosystem.config.cjs` | PM2 process(es), PORT / HOSTNAME |
| `deploy/nginx-site.conf.example` | nginx reverse proxy template |
| `deploy/pm2-release.sh` | VPS release helper |

### Fleet tooling (see [MULTISITE.md](./MULTISITE.md))

| File | Role |
|---|---|
| `deploy/lib/sites.sh` | Shared config, site registry, port allocation |
| `deploy/server-setup.sh` | One-time setup: log rotation caps, cron, nginx tuning |
| `deploy/site-add.sh` | Register a site, allocate a port, write the vhost |
| `deploy/site-deploy.sh` | Build → release → health check → rollback → prune |
| `deploy/site-list.sh` | Fleet status: port, PM2 state, HTTP, disk |
| `deploy/site-import.sh` | Adopt an existing site into the registry layout |
| `deploy/site-remove.sh` | Stop a site, optionally reclaim its disk |
| `deploy/deploy-all.sh` | Sequential fleet redeploy |
| `deploy/build-artifact.sh` | Build once, deploy to many sites |
| `deploy/disk-audit.sh` | Find what is consuming disk |
| `deploy/disk-cleanup.sh` | Reclaim it (safe / aggressive tiers) |
| `deploy/ecosystem.multisite.cjs` | PM2 apps generated from the registry |
| `deploy/nginx-site.conf.template` | vhost template used by `site-add.sh` |
