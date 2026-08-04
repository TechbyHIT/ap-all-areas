# VPS quickstart — hiranayaenterprises.in on port 3008

Copy-paste runbook for a fresh Hostinger VPS (Ubuntu, root). Background and
options are in [MULTISITE.md](./MULTISITE.md); this file is just the commands for
this one site.

Fill in `DB_PASSWORD` below once and the rest can be pasted as-is.

```bash
DB_PASSWORD='choose-a-strong-password-here'
```

---

## 1. Packages

```bash
apt update
apt install -y git nginx postgresql lsof curl certbot python3-certbot-nginx
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

Skip on a fresh VPS. On the existing box, do this **before** anything else — a
build cannot succeed on a full disk.

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

## 5. Database

The `GRANT ALL ON SCHEMA public` line is required on PostgreSQL 15 and newer.
Without it the first schema push fails with a permission error.

```bash
sudo -u postgres psql -c "CREATE DATABASE hiranaya_enterprises;"
sudo -u postgres psql -c "CREATE USER hiranaya WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE hiranaya_enterprises TO hiranaya;"
sudo -u postgres psql -d hiranaya_enterprises -c "GRANT ALL ON SCHEMA public TO hiranaya;"
```

## 6. Register the site on port 3008

Allocates the port, creates `/srv/sites/hiranaya-enterprises/`, writes the nginx
vhost and reloads nginx.

```bash
bash deploy/site-add.sh \
  --slug hiranaya-enterprises \
  --domain hiranayaenterprises.in \
  --port 3008 \
  --repo https://github.com/TechbyHIT/ap-all-areas.git
```

## 7. Environment

Two lines. `DATABASE_URL` is mandatory — `src/lib/prisma.ts` throws at module
load without it, so the process dies before it can listen and every request
becomes a 502.

`ADMIN_SECRET` and `REVALIDATION_SECRET` are not needed: `/admin` is blocked by
the vhost (`return 404`) and `/api/revalidate` is unused.

```bash
cat > /srv/sites/hiranaya-enterprises/shared/.env <<EOF
DATABASE_URL=postgresql://hiranaya:$DB_PASSWORD@localhost:5432/hiranaya_enterprises?connection_limit=3
NEXT_PUBLIC_SITE_URL=https://hiranayaenterprises.in
EOF
chmod 600 /srv/sites/hiranaya-enterprises/shared/.env
```

## 8. First deploy — creates the schema

`--keep-node-modules` because the seed scripts in the next step need them.

```bash
bash deploy/site-deploy.sh hiranaya-enterprises --keep-node-modules
```

The site is live on 3008 at this point, but with no content: the page routes use
`generateStaticParams`, which reads the database, and the database is still
empty.

## 9. Seed content

`npm run db:seed` runs `tsx prisma/seed.ts` directly rather than through the
Prisma CLI, and the page scripts import `src/lib/prisma`. Neither loads `.env`,
so export it into the shell first.

```bash
cd /srv/sites/hiranaya-enterprises/build
set -a; . /srv/sites/hiranaya-enterprises/shared/.env; set +a

npm run db:seed
npm run pages:create -- --type=service-location --limit=1000
npm run pages:audit -- --status=review --limit=1000
npm run pages:publish -- --batch-size=500
npm run pages:count
```

## 10. Second deploy — bakes the content in

Now that the database has pages, rebuild so they are prerendered and the sitemap
is complete. This run also prunes `node_modules`, taking the site down to its
steady-state size.

```bash
cd /root/ap-all-areas
bash deploy/site-deploy.sh hiranaya-enterprises
```

## 11. DNS and TLS

Point `hiranayaenterprises.in` and `www` at the VPS IP, wait for DNS to resolve,
then:

```bash
curl -I http://hiranayaenterprises.in     # must reach nginx first
certbot --nginx -d hiranayaenterprises.in -d www.hiranayaenterprises.in
```

## 12. Verify

```bash
bash deploy/site-list.sh
pm2 status
curl -I https://hiranayaenterprises.in
curl -s https://hiranayaenterprises.in/sitemap.xml | head -20
curl -o /dev/null -s -w '%{http_code}\n' https://hiranayaenterprises.in/admin   # expect 404
```

Restart count in `pm2 status` should be 0 or 1. Anything higher means a crash
loop — read it with `pm2 logs hiranaya-enterprises --lines 100`.

---

## Afterwards

Later deploys are one command:

```bash
cd /root/ap-all-areas && git pull
bash deploy/site-deploy.sh hiranaya-enterprises
```

Adding the next site takes the next free port automatically (3000, since 3008 is
recorded as taken):

```bash
bash deploy/site-add.sh --slug site-b --domain site-b.com \
  --repo https://github.com/TechbyHIT/ap-all-areas.git
```

Firewall: open only 80, 443 and SSH. Port 3008 binds to `127.0.0.1`, so it is
not reachable from the internet — do not open it.
