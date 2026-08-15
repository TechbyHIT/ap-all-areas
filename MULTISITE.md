# Multi-site operations — 50+ Next.js sites on one VPS

Extends [DEPLOYMENT.md](./DEPLOYMENT.md) (Option 2: PM2 + standalone Node, no
Docker) from one site to a fleet, on a **200 GB disk**.

> Just want the commands for `hiranayaenterprises.in`? See
> **[VPS-QUICKSTART.md](./VPS-QUICKSTART.md)**.

The design goal is a hard ceiling per site. A site that has just been deployed
occupies **~350–600 MB** and cannot grow past roughly **1 GB** without a cleanup
run reclaiming it. That is what makes 50 sites fit in ~30 GB instead of filling
the disk.

---

## Why one site reached 200 GB

Deploying by hand leaves four things unbounded. Any one of them can eat a whole
disk, and they compound:

| Cause | Typical size | Why it grows without limit |
|---|---|---|
| PM2 logs | 10–150 GB | Without `pm2-logrotate`, `~/.pm2/logs/<app>-out.log` is append-only forever. Chatty apps hit tens of GB in months. |
| `.next/cache` | 2–40 GB | Webpack/Turbopack cache plus the ISR and image-optimiser cache. Never pruned, and rebuilt on every deploy without the old one being removed. |
| Old builds / `node_modules` | 1–2 GB per copy | Each deploy leaves another `node_modules` and `.next`. Nothing removes them. |
| systemd journal + nginx logs | 1–20 GB | `journald` defaults to 10% of the disk; nginx access logs are unrotated by size. |

Two things make it look like a single site is the culprit:

- **A deleted-but-open log file.** Someone runs `rm` on a huge log, but node
  still holds the file descriptor, so `du` reports nothing while `df` still
  shows the disk full. Space returns only when that process restarts.
  `disk-audit.sh` section 3 finds these.
- **Docker left over from a previous setup.** `/var/lib/docker` and
  `/var/lib/containerd` keep every image layer and volume from every build.

### The sawtooth graph

If the hosting panel shows disk climbing in a **straight line** from ~30 GB to
~200 GB over 6–8 hours, dropping vertically back to ~30 GB, and repeating three
or four times a day, that is not normal growth. Read it as follows:

- A straight line means a **constant write rate** unrelated to traffic. Roughly
  170 GB over 7 hours is about **6 MB/s, continuously** — far more than a real
  site produces. Something is writing in a loop.
- The vertical drop is the disk hitting 100%. The writer dies or PM2 restarts
  it, the file descriptor for its (already deleted or truncated) log is
  released, and the kernel returns the space all at once. Then it starts again.

So the cycle is a symptom, not the cause. The cause is one process logging at a
few MB/s, and the usual reasons are:

- a **crash-restart loop** — PM2 restarts the app, it throws on boot, the stack
  trace is logged, repeat, thousands of times an hour (`pm2 describe <app>` will
  show a very high restart count),
- **verbose logging left on in production** — a Prisma client constructed with
  `log: ["query"]` writes every SQL statement,
- **`next dev` running in production** instead of the standalone server.

Identify the writer before deleting anything. Run this **while the disk is
climbing** — it samples the kernel's per-process I/O counters and ranks
processes by MB/s alongside the directories that grew:

```bash
sudo bash deploy/find-write-leak.sh --duration 120
```

Matching the top writer against the directory that grew names the cause: a file
under `.pm2/logs` means a logging loop, `.next/cache/images` means Next.js is
transcoding images on demand (high CPU with steady writes is the signature), and
`/var/lib/docker` means leftover layers. It also lists deleted-but-open files,
whose space `rm` cannot reclaim.

Supporting detail:

```bash
pm2 status                       # restart counter
pm2 logs <app> --lines 50        # what it repeats
du -sh ~/.pm2/logs/* | sort -h | tail
```

Restarting that one process reclaims the space immediately, but it will refill
in hours unless you fix the loop. `server-setup.sh` caps the blast radius
(`pm2-logrotate` at 10 MB × 3), so a repeat costs megabytes instead of the disk.

Find out which applies to you before changing anything:

```bash
sudo bash deploy/disk-audit.sh
```

It reports filesystem and inode usage, phantom deleted files, per-site
`node_modules`/`.next`/cache breakdowns, PM2 log sizes, Docker usage, journal
size and per-database sizes.

Then reclaim:

```bash
sudo bash deploy/disk-cleanup.sh --dry-run      # see it first
sudo bash deploy/disk-cleanup.sh                # safe tier
sudo bash deploy/disk-cleanup.sh --aggressive   # + build node_modules, npm cache, docker prune
```

The safe tier only removes things that are regenerated: build caches, releases
beyond `AP_KEEP_RELEASES`, runtime caches above `AP_CACHE_MAX_MB`, rotated logs
and week-old temp files. It is safe to run against a live fleet, and cron runs
it nightly.

It also removes **nested standalone bundles** — a `.next/standalone` found inside
another `.next/standalone`. That only happens when a `prepare-standalone` script
copies its destination into itself, and then every build adds another layer. It
is worth checking for explicitly because the outer bundle stays a normal size, so
nothing looks wrong until the disk fills: one site on this fleet reached 84 GB of
nested copies while every other cleanup tier reported nothing to reclaim. Only
the outermost bundle is ever served, so the nested ones are safe to delete while
the site is live.

### Automatic recovery

`disk-guard.sh` runs every 15 minutes from cron and escalates only as far as it
has to, so a filling disk is handled before anyone notices:

| `/` usage | What it does |
| --- | --- |
| under 80% | nothing, and prints nothing |
| 80% | safe cleanup |
| 90% | adds the aggressive tier |
| 95% | empties live log files in place and vacuums the journal to 100 MB |

The 95% tier exists because `rm` cannot reclaim space inside a file that a
process still holds open — a crash-looping app can fill a disk that `du` reports
as nearly empty. Emptying the file in place with `: > file` is what actually
returns the space.

If it is still above 95% after all three tiers, it exits non-zero and tells you
to run `find-write-leak.sh`, because at that point something is writing faster
than cleanup can delete and the fix is to stop the writer.

Check what it has been doing, and try it by hand without deleting anything:

```bash
tail -40 /var/log/ap-sites-cleanup.log
sudo bash deploy/disk-guard.sh --dry-run
sudo bash deploy/disk-guard.sh --warn 70    # lower the bar to force a pass
```

### The protection-first alternative

The 95% tier above is the reason there is a second option. Emptying a live log
reclaims the space, and it also destroys the evidence of why the app was
crash-looping — a trade an operator may want to make deliberately rather than
automatically at 03:00.

[`storage-manager/`](./storage-manager/README.md) is built the other way round:
a systemd timer every 15 minutes, protection before reclamation, an audit record
per run, and a hard rule that it never stops, restarts, reloads or signals
anything and never truncates an active log. Its `node_modules`, `.next` and
release cleanups are opt-in and default to off, and it does *less* at 90–95% than
at 85%, alerting instead.

Run one or the other, not both — their tiers disagree on purpose, so each can
delete what the other protects:

```bash
sudo bash storage-manager/scripts/install-storage-manager.sh --disable-legacy-disk-guard
```

`storage-manager health` warns whenever both are still active.

---

## Every site returning 502 Bad Gateway

A 502 means nginx is running but the Node process behind it is not answering.
When it happens to *every* site at once, it is one shared cause, not seven
separate ones. Run:

```bash
sudo bash deploy/emergency-502.sh          # diagnose, changes nothing
sudo bash deploy/emergency-502.sh --fix    # free space and restart the stack
```

It checks the five things that take down a whole box together and prints a
ranked verdict: disk full, OOM kills, PM2 crash loops, nothing listening on
3000+, and PostgreSQL being down. It works before migrating to the registry
layout, so it is safe to run on the current server as-is.

The usual chain, and the reason 502s and the sawtooth graph appear together:

1. Something writes logs at a few MB/s and fills the disk.
2. At 100%, **PostgreSQL stops itself** rather than corrupt its WAL.
3. Every site fails on its first query and crashes on boot.
4. PM2 restarts them, each crash logs a stack trace, which fills the disk
   faster — and every site serves 502 throughout.
5. Eventually a process dies hard, its file handle is released, ~170 GB comes
   back at once, and the cycle restarts.

**Truncate, do not delete.** While a process holds a log file open, `rm` frees
nothing — the space stays locked until that process exits. Emptying the file in
place returns it immediately:

```bash
: > /root/.pm2/logs/<app>-error.log     # correct
rm /root/.pm2/logs/<app>-error.log      # frees nothing while the app is running
```

`--fix` buys hours, not a cure. The disk refills until the write loop is fixed:

```bash
pm2 status                     # the app with a huge restart count is the loop
pm2 logs <app> --lines 100     # the error it repeats on every boot
```

It is nearly always a missing or wrong `DATABASE_URL`, a migration that never
ran, or a port already in use. Fix that, then run `server-setup.sh` so that if
it ever recurs, `pm2-logrotate` caps the damage at megabytes instead of the
whole disk.

## Layout

One registry file per site is the only thing you edit to add a site.

```
/etc/ap-sites/
  config                     fleet-wide settings (AP_ROOT, port range, limits)
  sites.d/<slug>.env         DOMAIN, ALIASES, PORT, REPO, BRANCH, MAX_MEMORY
  ecosystem.multisite.config.cjs   PM2 config from sites.d — never edited

/srv/sites/<slug>/
  build/                     shallow checkout; .next + node_modules pruned after build
  releases/<timestamp>/      self-contained standalone bundle (~250-350 MB)
  current -> releases/<ts>   atomically swapped symlink
  shared/.env                runtime secrets, loaded by PM2
  shared/cache               ISR + image cache, symlinked into the release
  shared/logs                PM2 stdout/stderr, size-capped

/opt/ap-deploy/              copies of these scripts, checkout-independent
```

`current` being a symlink is what makes deploys atomic and rollback instant:
a failed health check flips it back to the previous release.

---

## One-time server setup

```bash
sudo bash deploy/server-setup.sh
```

This is the part that prevents a repeat of the 200 GB. It:

- installs and configures **`pm2-logrotate`** (10 MB × 3 per app),
- caps the **systemd journal** at 300 MB,
- adds **logrotate** rules for nginx and per-site logs (size-capped, not just daily),
- raises `server_names_hash_bucket_size` — nginx fails to start past roughly
  30–40 vhosts without this,
- installs a **nightly cleanup cron** plus `disk-guard.sh` every 15 minutes,
  which escalates through the cleanup tiers once the disk passes 80%,
- copies the scripts to `/opt/ap-deploy` so cron does not depend on a checkout,
- prints the commands to remove Docker if it is still installed.

---

## Adding a site

```bash
sudo bash deploy/site-add.sh \
  --slug site-b \
  --domain site-b.com \
  --repo https://github.com/TechbyHIT/ap-all-areas.git

sudo bash deploy/site-deploy.sh site-b
sudo bash deploy/site-tls.sh site-b --email you@example.com
```

`site-tls.sh` requests only the names that currently resolve. Let's Encrypt
rejects the whole order if any requested name returns NXDOMAIN, so a `www` alias
that was never added to DNS would otherwise fail the apex domain too. Re-run it
after adding the missing record to fold the alias in.

### The database is optional

Only two files in `src/` touch Prisma: `src/lib/prisma.ts` and
`src/app/admin/page.tsx`. Every public page is built from the TypeScript data in
`src/data`, through helpers like `src/lib/data/locations.ts` that just filter
arrays. So a site can be deployed with **no PostgreSQL and no `DATABASE_URL`**,
and `site-deploy.sh` skips the schema step when it is absent.

Postgres is needed for exactly two things:

- the `/admin` dashboard, which the vhost blocks by default,
- the tools in `scripts/` (`db:seed`, `pages:create`, the audits), which plan and
  track content but do not serve it.

`src/lib/prisma.ts` therefore connects on **first property access**, not at
import time. That matters: the earlier eager version threw `DATABASE_URL is not
set` while the module was being imported, so the process died before it could
listen, nginx had no upstream, every request was a 502, and PM2 restarted it
forever — writing a stack trace each time, which is what filled the disk. The
lazy client means a missing variable can only fail an actual query.

`shared/.env` is created for you with one line:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.in
```

It is inlined at build time and drives canonical tags and sitemaps, so changing
it means rebuilding, not just restarting.

Everything else is optional:

| Variable | Why |
|---|---|
| `DATABASE_URL` | Only for `/admin` and the `scripts/` tools |
| `ADMIN_SECRET` | Only if you expose `/admin`. See the warning below |
| `REVALIDATION_SECRET` | Only if you call `POST /api/revalidate` |
| `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_CLARITY_ID` | Analytics |

Dropping Postgres also removes the fleet's hardest scaling limit: with no
database there are no connection pools, so the `max_connections` ceiling that
would otherwise cap you around 50 sites disappears entirely.

**`/admin` is blocked by nginx by default** (`return 404` in the vhost template)
because leaving it to the app is unsafe: `src/proxy.ts` only checks the secret
`if (expected && expected !== "change-me-in-production")`, so an unset
`ADMIN_SECRET` skips authentication altogether and exposes all seven admin
pages. If you need admin later, set `ADMIN_SECRET`, remove the `location /admin`
block from the vhost and reload nginx.

This project has no `prisma/migrations/` directory — the schema is tracked with
`prisma db push`. `site-deploy.sh` detects that and pushes the schema instead of
running `migrate deploy`, which would abort with no migrations found. Seeding
and page generation are separate one-time steps after the first deploy:

```bash
cd /srv/sites/<slug>/build
npm run db:seed
npm run pages:create -- --type=service-location --limit=1000
npm run pages:publish -- --batch-size=500
```

Those need `node_modules`, so either run them before the prune or deploy with
`--keep-node-modules` the first time.

`site-add.sh` allocates the next free port (checking both the registry and
listening sockets), creates the directory layout, writes the registry entry and
the nginx vhost, and reloads nginx. Ports never need to be tracked by hand.

`site-deploy.sh` does the full release cycle: shallow fetch, `npm ci`,
`prisma migrate deploy`, build, promote the standalone bundle to a new release,
swap `current`, reload PM2, health-check `127.0.0.1:$PORT`, then **prune
`build/node_modules` and `build/.next`** and delete stale releases. It also
refuses to start with under 4 GB free (running a cleanup first), and holds a
`flock` so two builds never run at once.

Fleet status at a glance:

```bash
bash deploy/site-list.sh
```

Other commands:

| Command | Purpose |
|---|---|
| `deploy/deploy-all.sh` | Redeploy the fleet sequentially, cleaning between sites |
| `deploy/site-import.sh` | Adopt an existing `/var/www/x` site into this layout |
| `deploy/site-remove.sh <slug> [--purge]` | Stop a site; `--purge` reclaims its disk |
| `deploy/build-artifact.sh` | Build once, deploy the same bundle to many sites |
| `deploy/disk-audit.sh` | Find what is using disk |
| `deploy/find-write-leak.sh` | Find which process is writing, and where |
| `deploy/disk-cleanup.sh` | Reclaim it |
| `deploy/disk-guard.sh` | Reclaim it automatically once the disk starts filling |
| `storage-manager/` | Protection-first automatic alternative to `disk-guard.sh` |
| `deploy/site-tls.sh` | Issue TLS, skipping names that do not resolve |
| `deploy/emergency-502.sh` | Triage and recover when every site is down |

---

## Migrating your current 7 sites

Do one site at a time, keeping the old directory until the new one serves
traffic.

```bash
sudo bash deploy/server-setup.sh
sudo bash deploy/disk-audit.sh                       # note the big one
sudo bash deploy/disk-cleanup.sh --aggressive        # usually frees most of it

sudo bash deploy/site-import.sh --slug site-a --domain site-a.com --from /var/www/site-a
sudo nano /srv/sites/site-a/shared/.env
sudo bash deploy/site-deploy.sh site-a
# cut the nginx vhost over to the new port, verify the site, then:
sudo rm -rf /var/www/site-a
```

Start with the 200 GB site. In most cases the audit shows its logs or caches,
not its code, and the aggressive cleanup returns tens of GB before you migrate
anything.

---

## Hostinger VPS notes

Ports are allocated from 3000 upwards (`AP_PORT_BASE=3000`), one per site:
`site-a` 3000, `site-b` 3001, and so on up to `AP_PORT_MAX=3200`.
`site-add.sh` picks the next free one by checking both the registry and the
listening sockets, so you never assign them by hand.

To pin a specific port, pass `--port`. This app's `package.json` uses 3001 for
`dev` and `start`, so keeping the production port the same is convenient:

```bash
sudo bash deploy/site-add.sh --slug hiranaya-enterprises \
  --domain hiranayaenterprises.in --port 3001 --repo <url>
```

A pinned port is recorded in the registry, so later sites skip it automatically.
To start the whole fleet at 3001 instead, set `AP_PORT_BASE=3001` in
`/etc/ap-sites/config`.

Those ports must stay private. Only nginx is public:

- Every app binds `HOSTNAME=localhost` (set in the PM2 ecosystem), so
  3000–3200 stay on loopback. Do not change this to `0.0.0.0`, and do not
  set it to `127.0.0.1` either — Next.js middleware normalizes loopback to
  the string `localhost`, and a mismatch makes every `rewrite()` look like an
  external HTTPS proxy against the plain-HTTP port (`EPROTO`).
- In the Hostinger firewall, open **only 80, 443 and SSH**. If 3000+ are open
  from an earlier setup, close them — otherwise every site is reachable at
  `http://<vps-ip>:3001`, bypassing TLS, and Google can index the bare IP.
- Hostinger VPS images ship with the panel's own monitoring agent; the disk
  graph above comes from it. It is not what fills the disk.

If you are on Hostinger **shared** hosting rather than a VPS, none of this
applies — there is no PM2 and no root, and 50 Next.js sites are not possible.
This tooling assumes a VPS (KVM plan) with root access.

## Smallest practical footprint (50+ SEO sites)

The binding constraint is **prerendered HTML**, not `node_modules` or Docker.

| Lever | What it does | SEO impact |
| --- | --- | --- |
| `PRERENDER_*` seed (`src/config/prerender.ts`) | Only 2 cities × 8 areas (+ keyword seed) are baked at build time | None — `dynamicParams` + ISR serve the long tail; sitemap still lists URLs |
| Cap city/area link matrices | Stops ~200 anchors being duplicated into every HTML file | One extra hop via city hub |
| `HOSTNAME=localhost` | Keeps middleware rewrites internal (no EPROTO) | None |
| WebP-only images | Faster first encode on a shared VPS | Slightly larger images than AVIF |
| Strip `*.map` in prepare-standalone | Removes source maps from the release | None |
| `AP_KEEP_RELEASES=2`, `AP_CACHE_MAX_MB=256` | Caps rollback copies and ISR/image cache | None |

Override the seed without a code change:

```bash
# /etc/ap-sites/config or shared/.env
PRERENDER_CITY_LIMIT=2
PRERENDER_AREA_LIMIT=8
PRERENDER_KEYWORD_LIMIT=8
```

Target unit cost after a clean deploy: **~150–400 MB disk, ~80–150 MB RAM** per site.
At that size, 50 sites fit a 200 GB / 16 GB RAM VPS with headroom. A site that
prerenders hundreds of thousands of pages will not.

## Capacity on 200 GB

Per-site disk after a deploy:

| Component | Size |
|---|---|
| `releases/` (2 × standalone bundle incl. traced deps + Prisma engine) | ~500–700 MB |
| `build/` after pruning (source only, shallow clone) | ~40–80 MB |
| `shared/cache` (capped by `AP_CACHE_MAX_MB`) | ≤ 512 MB |
| `shared/logs` (capped by pm2-logrotate) | ≤ 40 MB |
| **Total, steady state** | **~0.6–1.3 GB** |

| Sites | With `AP_KEEP_RELEASES=2` | With `AP_KEEP_RELEASES=1` |
|---|---|---|
| 10 | ~10 GB | ~7 GB |
| 25 | ~25 GB | ~17 GB |
| 50 | ~45–60 GB | ~30–40 GB |

Plus OS, nginx, Node and Postgres: budget **20–30 GB**. So 50 sites fit inside
about 90 GB of a 200 GB disk, leaving genuine headroom. The `.env` knobs to turn
if it gets tight, in order: `AP_KEEP_RELEASES=1`, then `AP_CACHE_MAX_MB=256`.

**Disk is not the binding constraint at 50 sites — RAM and Postgres connections
are.** Plan for those too:

- **RAM.** An idle Next.js standalone process is ~70–120 MB. 50 of them is
  **4–6 GB** before Postgres and nginx, so size the VPS at 8 GB+. `MAX_MEMORY`
  in each registry file is the restart ceiling (default 300 MB), not a
  reservation. For low-traffic sites, `instances: 1` and `exec_mode: "fork"`
  (the default here) is correct — never use cluster mode across a fleet this
  size.
- **Postgres connections** — only if you actually use a database. With
  `DATABASE_URL` unset this does not apply at all, which is the recommended
  setup. If you do enable it, Prisma opens a pool per process and 50 sites at
  the default size will blow past `max_connections`, so pin it in each
  `shared/.env`:

  ```
  DATABASE_URL=postgresql://user:pass@localhost:5432/site_b?connection_limit=3&pool_timeout=20
  ```

  50 × 3 = 150 connections, so set `max_connections = 200` in
  `postgresql.conf`, or put **PgBouncer** in transaction mode in front and give
  every site `connection_limit=1`.
- **Build time and memory.** Builds are serialised by a lock file and each is
  capped at `AP_NODE_MAX_OLD_SPACE` (2 GB). A full `deploy-all.sh` over 50 sites
  takes hours; that is intended. Deploy individual sites normally.
- **File descriptors.** 50 apps plus nginx: raise `LimitNOFILE` for the PM2
  service and `worker_connections` in nginx if you see `EMFILE`.

---

## Sharing one build across sites

Each site builds its own bundle by default because Next.js inlines
`NEXT_PUBLIC_*` at build time, and `src/config/business.ts` reads
`NEXT_PUBLIC_SITE_URL`. Two sites on different domains therefore cannot share a
bundle as the code stands.

If the fleet is the same app on many domains, that one dependency is worth
removing: derive the site URL from the request `Host` header (or a
non-`NEXT_PUBLIC_` server-side variable) instead. Then:

```bash
sudo bash deploy/build-artifact.sh --repo git@github.com:you/repo.git --out /tmp/app.tar.gz
sudo bash deploy/deploy-all.sh --artifact /tmp/app.tar.gz
```

One build for the whole fleet: minutes instead of hours, and no `node_modules`
on the server at all.

---

## Routine

| When | Command |
|---|---|
| Deploying a change | `sudo bash deploy/site-deploy.sh <slug>` |
| Weekly | `bash deploy/site-list.sh` — check for `stopped` or `down` |
| Disk looks off | `sudo bash deploy/disk-audit.sh` |
| Before adding sites in bulk | `sudo bash deploy/disk-cleanup.sh --aggressive` |
| Disk filling up | automatic — `disk-guard.sh` every 15 min (`/etc/cron.d/ap-sites`) |

Rollback is the previous release:

```bash
ls -t /srv/sites/<slug>/releases        # pick the one before current
sudo ln -sfn /srv/sites/<slug>/releases/<ts> /srv/sites/<slug>/current
sudo pm2 reload /etc/ap-sites/ecosystem.multisite.config.cjs --only <slug> --update-env
```
