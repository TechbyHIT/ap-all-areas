# VPS quickstart — hiranayaenterprises.in on port 3008

Copy-paste runbook for a fresh Hostinger VPS (Ubuntu, root). Background and
options are in [MULTISITE.md](./MULTISITE.md); this file is just the commands.

**No database, no admin, no secrets.** Every public page is built from the
TypeScript data in `src/data` — only `/admin` and the tools in `scripts/` query
Postgres, and neither is needed to serve the site. So there is no PostgreSQL to
install, no `DATABASE_URL`, and nothing to seed.

---

## 1. Packages

```bash
apt update
apt install -y git nginx lsof curl certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm i -g pm2
node -v && pm2 -v
```

## 2. Get the tooling

```bash
cd /root
git clone https://github.com/TechbyHIT/ap-all-areas.git
cd /root/ap-all-areas
```

## 3. If the server is currently broken

Skip on a fresh VPS. On the existing box do this **first** — a build cannot
succeed on a full disk.

```bash
bash deploy/emergency-502.sh          # read the verdict
bash deploy/emergency-502.sh --fix
```

## 4. One-time server setup

Caps PM2 logs, the journal and nginx logs, installs the nightly cleanup cron and
sizes nginx for many vhosts. This is what stops the disk filling again.

```bash
bash deploy/server-setup.sh
```

## 5. Register the site on port 3008

Allocates the port, creates `/srv/sites/hiranaya-enterprises/`, writes the nginx
vhost (which blocks `/admin`) and reloads nginx.

```bash
bash deploy/site-add.sh \
  --slug hiranaya-enterprises \
  --domain hiranayaenterprises.in \
  --port 3008 \
  --repo https://github.com/TechbyHIT/ap-all-areas.git
```

It writes `shared/.env` containing only `NEXT_PUBLIC_SITE_URL`. Nothing to edit —
`DATABASE_URL` stays commented out.

## 6. Deploy

```bash
bash deploy/site-deploy.sh hiranaya-enterprises
```

It logs `No DATABASE_URL — skipping schema setup`, which is expected. The build
prerenders every page from `src/data`, then `node_modules` is pruned and the site
settles at roughly 600 MB.

## 7. DNS and TLS

Add both records at your DNS provider:

| Type | Name | Value |
|---|---|---|
| A | `@` | your VPS IP |
| CNAME | `www` | `hiranayaenterprises.in` |

The `www` record matters. Let's Encrypt rejects the **entire** order if any
requested name returns NXDOMAIN, so a missing `www` record fails the apex domain
along with it. Check both resolve before continuing:

```bash
getent hosts hiranayaenterprises.in
getent hosts www.hiranayaenterprises.in
curl -I http://hiranayaenterprises.in     # expect 200, not 502
```

Then:

```bash
bash deploy/site-tls.sh hiranaya-enterprises --email you@example.com
```

It verifies `nginx -t` first (certbot aborts on a bad config), requests only the
names that resolve, and enables the HTTP-to-HTTPS redirect. If `www` is not ready
yet it issues for the apex alone and tells you how to add `www` afterwards — just
re-run the same command once the record exists.

## 8. Verify

```bash
bash deploy/site-list.sh
pm2 status
curl -I https://hiranayaenterprises.in
curl -s https://hiranayaenterprises.in/sitemap.xml | head -20
curl -o /dev/null -s -w '%{http_code}\n' https://hiranayaenterprises.in/admin   # expect 404
```

The restart count in `pm2 status` should be 0 or 1. Anything higher is a crash
loop — read it with `pm2 logs hiranaya-enterprises --lines 100`.

---

## Later

Deploying a change:

```bash
cd /root/ap-all-areas && git pull
bash deploy/site-deploy.sh hiranaya-enterprises
```

Adding the next site, which takes the next free port automatically (3000, since
3008 is recorded as taken):

```bash
bash deploy/site-add.sh --slug site-b --domain site-b.com \
  --repo https://github.com/TechbyHIT/ap-all-areas.git
bash deploy/site-deploy.sh site-b
```

Firewall: open only 80, 443 and SSH. Port 3008 binds to `127.0.0.1`, so it is
not reachable from the internet — do not open it.

---

## If you later want the admin dashboard or the page-planning scripts

Those are the only parts that need Postgres. Install it, create a database, add
`DATABASE_URL` to `shared/.env`, and redeploy:

```bash
apt install -y postgresql
sudo -u postgres psql -c "CREATE DATABASE hiranaya_enterprises;"
sudo -u postgres psql -c "CREATE USER hiranaya WITH PASSWORD 'strong-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE hiranaya_enterprises TO hiranaya;"
# Required on PostgreSQL 15+, otherwise the schema push fails on permissions:
sudo -u postgres psql -d hiranaya_enterprises -c "GRANT ALL ON SCHEMA public TO hiranaya;"

echo 'DATABASE_URL=postgresql://hiranaya:strong-password@localhost:5432/hiranaya_enterprises?connection_limit=3' \
  >> /srv/sites/hiranaya-enterprises/shared/.env

cd /root/ap-all-areas
bash deploy/site-deploy.sh hiranaya-enterprises --keep-node-modules
```

Then seed. These scripts run through `tsx` rather than the Prisma CLI and import
`src/lib/prisma` directly, so neither loads `.env` — export it into the shell
first:

```bash
cd /srv/sites/hiranaya-enterprises/build
set -a; . /srv/sites/hiranaya-enterprises/shared/.env; set +a
npm run db:seed
npm run pages:create -- --type=service-location --limit=1000
npm run pages:count
```

To expose `/admin` itself, set `ADMIN_SECRET` in `shared/.env`, delete the
`location /admin` block from `/etc/nginx/sites-available/hiranaya-enterprises.conf`
and reload nginx. Do not skip the secret: `src/proxy.ts` only checks it
`if (expected && expected !== "change-me-in-production")`, so an unset value
leaves admin open to the public.
