# storage-manager — manual

A single-purpose program: keep a 200 GB Ubuntu VPS running many Next.js sites
from filling up, **without ever disturbing a running application**.

- [Design](#design)
- [Installation](#installation)
- [Configuration](#configuration)
- [Automatic operation](#automatic-operation)
- [Thresholds and the decision engine](#thresholds-and-the-decision-engine)
- [What gets cleaned](#what-gets-cleaned)
- [What is protected](#what-is-protected)
- [Project discovery and state](#project-discovery-and-state)
- [PM2 integration](#pm2-integration)
- [nginx integration](#nginx-integration)
- [Git and GitHub integration](#git-and-github-integration)
- [Deployment detection](#deployment-detection)
- [Opt-in project cleanup](#opt-in-project-cleanup)
- [Dry run](#dry-run)
- [Commands](#commands)
- [Logs and the audit trail](#logs-and-the-audit-trail)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [Emergency recovery](#emergency-recovery)
- [Uninstallation](#uninstallation)
- [Relationship to the existing deploy tooling](#relationship-to-the-existing-deploy-tooling)

---

## Design

Priority order, in every decision the program makes:

```
application availability
      ↓
data integrity
      ↓
deployment safety
      ↓
server stability
      ↓
storage optimisation
```

Storage is last. If reclaiming space would risk anything above it, the space is
not reclaimed — the situation is logged and reported instead.

Four properties make that structural rather than a promise:

**One decision path.** `--dry-run` and a real run execute the same code. Dry run
differs only at the two points where something would actually change
(`sm_safe_remove` and `sm_run`). A dry run is therefore evidence of what a real
run would do, not a separate simulation that can drift.

**One deletion gate.** Nothing is removed except through `sm_safe_remove`, and
nothing passes it without an explicit allowlist plus every one of these: the path
is absolute, contains no unexpanded glob, exists, is not a symlink, resolves to
itself under `realpath`, is at least two levels deep, is not a mount point, is
not inside a protected path, does not carry a protected name, does not belong to
the manager's own checkout, and lies inside the allowlist given by the calling
category. A refusal is recorded with its reason.

**Pressure narrows, it does not widen.** `CRITICAL` (90%) and `EMERGENCY` (95%)
run *fewer* categories than `AGGRESSIVE` (85%) and force-disable every
project-level opt-in whatever the config says. A nearly full disk is when a wrong
deletion is most likely to take a site down, so that is when the program does
least and alerts a human.

**The config cannot execute.** `/etc/storage-manager/storage-manager.conf` is
parsed line by line, never `source`d, and only known keys are accepted. A
corrupted or hostile config cannot run a command as root through this program.

### What it will never do

Not at any level, not for any amount of space, not with any configuration:

```
stop / restart / reload / kill / signal PM2, nginx, node or any application
pm2 restart | reload | stop | delete | kill | flush | save
systemctl restart|reload anything
npm install | npm ci | npm run build | next build
git pull | fetch | reset | clean | checkout | push
delete .env, .env.*, .git, source, public, uploads, storage, databases, backups
delete node_modules or .next of an online, deploying or unknown project
delete a live release or anything a running process is inside
truncate an active log file
modify nginx config, SSL certificates, DNS or the firewall
change ownership or permissions of application files
reboot or shut down
```

The test suite asserts most of this twice: statically against the source, and
dynamically by spying on every `pm2`, `nginx`, `systemctl`, `apt-get`, `git` and
`journalctl` invocation across every scenario.

---

## Installation

```bash
sudo bash storage-manager/scripts/install-storage-manager.sh
```

Steps, in order:

1. verify the distribution and that every required command exists
2. report which optional integrations are present (`pm2`, `nginx`, `journalctl`,
   `logrotate`, `lsof`, `git`, `python3`)
3. create `/etc/storage-manager`, `/var/lib/storage-manager`,
   `/var/log/storage-manager` and the doc directory
4. install `/usr/local/sbin/storage-manager`
5. install the config (an existing one is never overwritten) and the logrotate rule
6. install the systemd service and timer — **installed, not enabled**
7. warn about any conflicting `disk-guard`/`disk-cleanup` cron entry
8. run `health`, `report`, `projects` and a full `cleanup --dry-run`
9. show that no project, PM2 process or nginx instance was touched
10. ask you to type `enable` before starting the timer

Flags:

| Flag | Effect |
|---|---|
| `--yes` | skip the confirmation prompt and enable the timer |
| `--no-enable` | install and validate only, leave automation off |
| `--disable-legacy-disk-guard` | comment out the legacy cron lines, with a backup |

The installer never stops, restarts or reloads anything, never modifies a project
and never deletes a file.

### Not on Ubuntu, or paths are different?

Everything is configurable. Set `PM2_LOG_DIRS`, `NGINX_LOG_DIR`,
`SYSTEM_LOG_DIR`, `TEMP_DIRS`, `DISCOVERY_ROOTS` and `PROTECTED_PATHS` to match
the box, then check with `storage-manager config` and `storage-manager health`.

---

## Configuration

`/etc/storage-manager/storage-manager.conf`, documented in full in
[`config/storage-manager.conf.example`](../config/storage-manager.conf.example).
Only `KEY=VALUE` lines are allowed; values may contain spaces without quoting;
unknown keys are reported and ignored.

```bash
storage-manager config     # effective values, defaults included
storage-manager health     # validates the file among other checks
```

Nothing is hardcoded at the point of use. Every threshold, path, retention
period and toggle comes from this file or its built-in default.

---

## Automatic operation

```ini
# storage-manager.timer
OnBootSec=5min
OnUnitActiveSec=15min
Persistent=true
```

```ini
# storage-manager.service
Type=oneshot
ExecStart=/usr/local/sbin/storage-manager cleanup --auto
Nice=19
IOSchedulingClass=idle
SuccessExitStatus=0 2
```

There is no daemon and no shell loop. Each pass:

1. `df` on `DISK_PATH` → total, used, available, percent
2. discover projects (from cache unless it is stale)
3. read PM2 state
4. detect deployments in progress
5. read git state per project
6. resolve protected paths
7. work out what is safely reclaimable
8. choose the **lowest** level that the situation requires
9. perform only that level's safe categories
10. re-read `df` after each category, and stop as soon as the target is met
11. write the audit record
12. exit

`SuccessExitStatus=0 2` matters: exit code 2 means "still critically full after
safe cleanup", which is a deliberate alert rather than a crash, and must not mark
the unit failed.

Only one instance ever acts, enforced with `flock` on
`/var/lock/storage-manager.lock`. A second invocation exits quietly.

---

## Thresholds and the decision engine

```
usage < 70%                 NORMAL            nothing runs
usage >= 70%                PREVENTIVE        apt cache, journal, rotated logs
usage >= 80%                SAFE-CLEANUP      + old temp files
usage >= 85%                AGGRESSIVE-SAFE   + package caches, logrotate, opt-ins
usage >= 90%                CRITICAL          system categories only, opt-ins off, alert
usage >= 95%                EMERGENCY         system categories only, opt-ins off, alert
```

On a 200 GB disk: 70% ≈ 140 GB used, 80% ≈ 160 GB, 85% ≈ 170 GB, 90% ≈ 180 GB,
95% ≈ 190 GB.

Two independent triggers, either of which starts preventive work:

- **percentage** — usage reaches `WARNING_USAGE_PERCENT`
- **absolute** — free space falls below `TARGET_FREE_GB`, even if the percentage
  still looks fine (a bigger disk can be under 70% and still have too little
  headroom for a build)

An automatic run stops as soon as usage is under `MAX_USAGE_PERCENT` **and**
`TARGET_FREE_GB` is free. It does not run every category for the sake of it, and
it never deletes application data to reach the target.

`storage-manager explain` prints the ladder, the current level, the categories
that level would consider, and the full list of things that never happen.

---

## What gets cleaned

Every category below only touches data the operating system owns and regenerates.

| Category | What exactly | Notes |
|---|---|---|
| `apt` | `apt-get clean`, `apt-get autoclean` | downloaded `.deb` archives only; skipped under 50 MB; `autoremove` is never run |
| `journal` | `journalctl --vacuum-size`, `--vacuum-time` | only above `JOURNAL_MAX_SIZE`; `/var/log/journal` is never touched by hand |
| `pm2_logs` | rotated PM2 logs past `LOG_RETENTION_DAYS` | `*.gz`, `*__*.log`, `*.log.N`; active logs untouched; reports if `pm2-logrotate` is missing |
| `nginx_logs` | rotated nginx logs past retention | active logs untouched |
| `system_logs` | rotated logs in `/var/log` past retention | skips `/var/log/nginx` and `/var/log/journal` |
| `temp` | `/tmp`, `/var/tmp` entries older than `TEMP_RETENTION_DAYS` | skips anything open, sockets, `systemd-private-*`, `snap-private-*`, X11 dirs |
| `pkg_caches` | `npm cache clean --force`, `yarn cache clean`, `pnpm store prune` | only for package managers that are installed |
| `logrotate` | `logrotate /etc/logrotate.conf` | the system's own rules; nginx is told to *reopen* logs by its postrotate, never restarted |

Not implemented on purpose: deleting Docker images. If Docker is present on this
fleet it is a leftover, and pruning it is a deliberate operator decision — see
`deploy/disk-audit.sh`.

---

## What is protected

Names, wherever they appear:

```
.git  .gitignore  .env  .env.*  package.json  package-lock.json  yarn.lock
pnpm-lock.yaml  npm-shrinkwrap.json  ecosystem.config.js  ecosystem.config.cjs
next.config.*  public  uploads  storage  database  db  backups  backup
*.pem  *.key  *.crt  *.sql  *.sqlite  *.sqlite3  *.dump
id_rsa  id_ed25519  authorized_keys
```

Paths (`PROTECTED_PATHS`), including everything below them:

```
/etc  /usr  /bin  /sbin  /lib  /lib64  /boot  /root/.ssh
/var/lib/postgresql  /var/lib/mysql  /var/backups
/etc/nginx  /etc/letsencrypt  /etc/ssl
```

Plus, always: every discovered project's application data, the manager's own
checkout, `/opt/ap-deploy`, and anything a running process is inside.

Also never done, regardless of paths: truncating an active log file. That is the
one trick which reliably reclaims space from a crash-looping app, and it destroys
the evidence of why it is crashing, so a human gets to decide.

---

## Project discovery and state

Two sources, so a new site is picked up without editing anything:

1. **The fleet registry.** Every `<slug>.env` in `SITE_REGISTRY`
   (`/etc/ap-sites/sites.d`) makes `SITE_ROOT/<slug>` a project. Authoritative.
2. **Marker files** under `DISCOVERY_ROOTS`, to `DISCOVERY_MAX_DEPTH`:
   `package.json`, `next.config.*`, `vite.config.*`, `ecosystem.config.*`, plus
   any directory shaped like a fleet site (`current`, `releases/`, `shared/`).

`node_modules`, `.next`, `.git`, `releases`, `vendor` and dotted directories are
pruned from the walk. A directory nested inside another project is reported as
part of it, so a site appears once, as its top directory.

Each project is classified:

| State | Means | Consequence |
|---|---|---|
| `ONLINE` | PM2 has it running | fully protected |
| `OFFLINE` | PM2 knows it and it is stopped, or PM2 does not manage it | protected; opt-ins *may* apply if every guard passes |
| `DEPLOYING` | a deployment is in progress | skipped completely |
| `UNKNOWN` | state could not be determined | skipped completely |

Offline is not permission to delete. By default nothing project-level happens in
any state.

A project can also protect itself absolutely:

```bash
touch /srv/sites/my-site/.storage-manager-protect
```

or `CRITICAL_PROJECTS=my-site other-site` in the config.

---

## PM2 integration

`pm2 jlist` is parsed (with `python3`, falling back to `node`) for name, status,
pid, cwd, uptime, restart count and exec path. Each project is mapped to its PM2
app by resolving cwd and exec path through symlinks — which is what makes the
fleet's `current -> releases/<timestamp>` layout map correctly.

Only read commands are ever issued: `jlist`, and `describe` to check whether the
`pm2-logrotate` module is present. If `pm2-logrotate` is missing, an automatic run
**reports** it rather than installing it:

```bash
storage-manager pm2-logrotate            # show the situation
storage-manager pm2-logrotate --apply    # install and configure it (10M x 3, compressed)
```

`--apply` installs a PM2 module and sets its options. It does not stop, reload or
restart any application. It is never run by the timer.

If PM2 is absent or not answering, every project becomes `UNKNOWN`, which means
fully protected. Losing visibility makes the program more careful, not less.

---

## nginx integration

nginx configuration, `sites-available`, `sites-enabled` and certificates are
protected paths. The manager never edits, reloads, restarts or signals nginx.

Rotated nginx logs are cleaned past their retention, and the system's own
`logrotate` may be invoked under pressure. Log reopening is handled by
logrotate's `postrotate` (a `USR1` signal from the existing
`/etc/logrotate.d/ap-sites` rule), not by this program.

`storage-manager health` runs `nginx -t` as a read-only sanity check when it has
root, and reports the result. It never acts on it.

---

## Git and GitHub integration

For each project the manager reads, and only reads:

```bash
git status --porcelain      # is the working tree dirty?
git branch --show-current
git log -1 --format=%h
```

They run with `-c safe.directory='*'` and a timeout so foreign ownership does not
turn into a hang or a false "clean". Results:

| Working tree | Effect |
|---|---|
| clean | opt-in cleanup may proceed if every other guard passes |
| dirty | project protected — uncommitted work is not reproducible from the remote |
| unknown / no repo | project protected |

The remote is never contacted, and no mutating git command is ever run. A GitHub
remote is where code comes *from*; it is not permission to delete anything local.

---

## Deployment detection

A project counts as `DEPLOYING` when any of these hold:

- `<DEPLOY_LOCK_DIR>/<slug>.deploy.lock`, `<project>/.deploy.lock` or
  `<project>/.deploying` exists
- a lock in `GLOBAL_DEPLOY_LOCKS` is held — by default
  `/var/lock/ap-sites-build.lock`, the lock `deploy/site-deploy.sh` takes while
  building, which fences the whole fleet
- a running process matches a deployment pattern (`git clone|pull|fetch`,
  `npm ci|install`, `npm run build`, `next build`, `yarn|pnpm install`,
  `site-deploy.sh`, `deploy-all.sh`, `build-artifact.sh`, `pm2 reload|restart|start`,
  `prisma migrate`, `prepare-standalone`) and either runs with its cwd inside the
  project or names the project in its arguments
- `build`, `releases`, `current` or `.next` was modified in the last
  `DEPLOY_RECENT_MIN` minutes

Any deploy script can fence itself explicitly:

```bash
touch /var/lock/my-site.deploy.lock
trap 'rm -f /var/lock/my-site.deploy.lock' EXIT
```

---

## The runtime cache ceiling

This is the setting most likely to matter, and the one this program was extended
to cover after a 193 GB disk on this fleet filled to 100%:

```ini
ALLOW_ONLINE_CACHE_TRIM=false     # recommended: true
ISR_CACHE_MAX_MB=4096
```

A live Next.js site writes every rendered page and every optimised image into
`.next/cache` and never removes them. On a site with millions of crawlable URLs,
a crawler alone will grow that without limit. One project's cache reached 156 GB
of the 160 GB it occupied, while apt, the journal, PM2 logs, nginx logs and temp
files together offered under 1 GB — so every safe category correctly reported
nothing to reclaim, right up to the disk being full.

When enabled, a cache **over the cap** has only its regeneratable subdirectories
removed:

| Removed | Kept |
|---|---|
| `<cache>/images` | the `cache` directory itself (a release may symlink it) |
| `<cache>/fetch-cache` | `.next` and everything under it |
| | the standalone bundle, `node_modules`, source, `.env`, uploads |

Checked in `.next/cache`, `.next/standalone/.next/cache`, `build/.next/cache` and
`shared/cache`, so it covers sites inside the `/srv/sites` layout and outside it.

### Rendered pages, which is where the space actually went

```ini
PRERENDER_CACHE_MAX_MB=8192
PRERENDER_TRIM_BATCH=500000
```

The cache ceiling above would not have saved this fleet on its own. The 156 GB
was not in `.next/cache` at all — it was rendered pages under
`.next/standalone/.next/server/app`, as `.html`, `.rsc` and `.meta` files: 71 GB
under one city, 46 GB under the next. A build run without prerender caps writes
the entire city x area x keyword cross-product there, and ISR keeps adding to it.

Over this cap, the oldest page files are removed until the directory is back
under it. Oldest first, so pages that are actually being served stay warm.

| Removed | Kept |
|---|---|
| `*.html`, `*.rsc`, `*.meta` under `server/app` | every `.js`, every manifest |
| oldest first, stopping at the cap | the directory itself, and the whole bundle |

This one deliberately does not validate each file through the deletion gate: a
project can hold millions of them, and per-file validation would cost more than
the cleanup returns. The *directory* goes through the same gate instead, and what
may be removed inside it is constrained to three extensions that are always
regenerated output. `PRERENDER_TRIM_BATCH` bounds how many files one pass will
look at, so successive runs converge instead of one run stalling.

The real fix is upstream: cap the prerender seed at build time with
`PRERENDER_CITY_LIMIT`, `PRERENDER_AREA_LIMIT` and `PRERENDER_KEYWORD_LIMIT`,
which `deploy/site-deploy.sh` already sets. A project built outside that tooling
gets no caps, which is exactly how one site reached 156 GB. This setting is the
safety net, not the cure.

Next.js rebuilds each entry on the next request that needs it, so the site keeps
serving — the cost is CPU, not availability. `deploy/disk-cleanup.sh` has done the
same thing to `/srv/sites/*/shared/cache` against this live fleet for a while;
this covers the projects that layout misses, which is where the 156 GB was.

It is off by default because it is the only action in this program that reaches
into a directory belonging to an ONLINE project. A DEPLOYING or UNKNOWN project
is still exempt, a project marked critical is exempt, and the whole thing is
force-disabled at CRITICAL and EMERGENCY like every other project-level action.

## Opt-in project cleanup

All four default to **false**, and should usually stay there. On this fleet
`deploy/site-deploy.sh` already prunes each site after a successful release, so
there is normally nothing here to reclaim.

| Setting | Removes | Restored by |
|---|---|---|
| `ALLOW_NEXT_CACHE_CLEANUP` | `.next/cache`, `build/.next/cache`, `shared/cache` | Next.js, on demand |
| `ALLOW_NEXT_BUILD_CLEANUP` | `.next`, `build/.next` (never one containing a standalone bundle) | the next build |
| `ALLOW_NODE_MODULES_CLEANUP` | `build/node_modules` | `npm ci` on the next deploy |
| `ALLOW_STALE_RELEASE_CLEANUP` | releases beyond `KEEP_RELEASES`, never the live one | the next deploy |

Enabling one is not enough. Every guard must also pass:

- the project is `OFFLINE` (never online, deploying or unknown)
- no deployment lock, process or recent build activity
- the git working tree is clean and readable
- `package.json` **and** a lock file exist, so dependencies are restorable
- the project is not in `CRITICAL_PROJECTS` and has no `.storage-manager-protect`
- it is not the manager's own checkout
- for releases: `current` resolves, and no running process is inside the release
- for `.next`: it does not contain `standalone/server.js`
- for a root `node_modules`: no `current` symlink exists that could resolve
  through it

And all four are force-disabled at `CRITICAL` and `EMERGENCY`, with the override
recorded in the audit log.

---

## Dry run

```bash
storage-manager cleanup --dry-run
```

Changes nothing, and prints the same records a real run would, each with a
reason:

```
[SAFE]      pm2_logs             800 MB  /root/.pm2/logs/site-1-out__old.log.gz
                                         reason: would remove: rotated PM2 log older than 14d
[SKIPPED]   temp                      -  /tmp/build-scratch
                                         reason: still open by a running process
[PROTECTED] project                3 GB  /srv/sites/site-1
                                         reason: PM2 reports it ONLINE
[SKIPPED]   system_logs               -  /var/log/nginx/old.conf.1
                                         reason: refused by safety gate: inside protected path /etc
```

`cleanup` with no mode is a dry run by default. You have to ask for `--safe`,
`--auto` or `--full` for anything to happen.

---

## Commands

| Command | Does |
|---|---|
| `status` | disk, level, target, last run |
| `report` | full audit: disk, project counts, safe reclaimable by category, protected list, guarantees |
| `projects` | every project with kind, state, PM2 app, branch, dirtiness, size and why it is protected |
| `cleanup --dry-run` | decide everything, change nothing |
| `cleanup --safe` | system-level categories, regardless of thresholds |
| `cleanup --auto` | threshold driven, stops at the target (what the timer runs) |
| `cleanup --full` | every enabled category including opt-ins, regardless of thresholds |
| `large-files` | files over `LARGE_FILE_MIN_MB` with owner, project, open state and a verdict; deletes nothing |
| `investigate` | read-only forensics for a disk full of application data: growth rate, top writers, largest projects, nested standalone bundles, duplicate directories, phantom space |
| `open-deleted` | deleted-but-still-open files and the processes holding them |
| `health` | disk, PM2, nginx, discovery, timer, config, logging, lock, state, legacy cron |
| `explain` | the ladder, the current level, and everything that never happens |
| `config` | effective configuration |
| `logs [n]` | tail its own log |
| `pm2-logrotate [--apply]` | inspect or set up PM2 log rotation |
| `version`, `help` | |

`report`, `projects` and `large-files` accept `--force` to bypass their caches.

---

## Logs and the audit trail

```
/var/log/storage-manager/storage-manager.log          every decision, every run
/var/log/storage-manager/storage-manager-history.log   one record per run
/var/log/storage-manager/CRITICAL-ALERT.txt            written only under pressure
/var/lib/storage-manager/projects.tsv                  discovery cache
/var/lib/storage-manager/large-files.txt               daily scan cache
/var/lib/storage-manager/last-run                      one-line summary
```

A run that acted records:

```
run        20260815170000-12345
started    2026-08-15 17:00:00
finished   2026-08-15 17:00:07
mode       auto
level      SAFE-CLEANUP (level SAFE-CLEANUP)
before     usage=82% free=36.0 GB
after      usage=80% free=40.0 GB
reclaimed  4.1 GB
actions    taken=37 skipped=4 protected=9 failed=0
projects   total=9 online=6 offline=2 deploying=1 unknown=0
apps       stopped=0 restarted=0 killed=0 (this program never does any of these)
category   apt              1.2 GB
category   journal          800 MB
category   pm2_logs         600 MB
action     [SAFE] pm2_logs :: /root/.pm2/logs/... :: removed: rotated PM2 log older than 14d
```

A run with nothing to do records one line, so 96 quiet runs a day do not bury the
ones that mattered.

Both files rotate by size inside the program (`LOG_MAX_SIZE_MB`, `LOG_KEEP`) as
well as through `/etc/logrotate.d/storage-manager`, so the manager cannot become
the disk problem itself.

When the log directory is not writable the program still runs and still prints
everything — it just says so on stderr rather than pretending it kept an audit.

---

## Performance

| Work | How often |
|---|---|
| `df` check | every run (15 minutes) |
| PM2, deploy and lock state | every run — cheap, and always current |
| directory walk for discovery | at most every `PROJECT_SCAN_INTERVAL_MIN` (6h) |
| large-file scan | at most every `LARGE_FILE_SCAN_INTERVAL_MIN` (24h) |

The volatile parts are re-read every run even when discovery comes from cache, so
a site that went offline five minutes ago is classified correctly without walking
the disk again.

Everything runs under `nice -n 19` and `ionice -c3`, and the unit adds
`IOSchedulingClass=idle`, so hygiene never competes with the sites or a build.

---

## Tests

```bash
bash tests/run-tests.sh                     # 43 tests
bash tests/run-tests.sh --keep              # keep the sandbox afterwards
bash tests/run-tests.sh --filter pm2        # only matching tests
FAKE_PCT=92 bash tests/run-tests.sh --demo  # rehearse the validation report
```

The suite builds a sandbox containing eight sites in the fleet layout (six
online, one stopped, one mid-deploy, plus a tooling checkout), with real git
repositories and with fake `df`, `pm2`, `journalctl`, `apt-get`, `logrotate`,
`lsof`, `nginx` and `systemctl` on `PATH`. Nothing outside the sandbox is read
for a decision or written to.

The fakes are also spies. Every invocation is recorded, so the suite asserts —
across every scenario including a full run at 97% full — that no `pm2`
state-change, no `nginx` signal, no `systemctl` unit change, no package
installation and no mutating `git` command was ever issued. Two further tests
check the source statically: one strips comments, quoted strings and heredocs and
fails if a forbidden command survives as executable code, the other counts `rm`
call sites and fails if a new one appears.

What is covered: discovery of eight sites and of a ninth added later, the
discovery cache, all four project states, PM2 being unavailable, the threshold
ladder, the free-space target, rotated versus active logs, temp file rules,
opt-in refusals for online/deploying/dirty/unknown projects, force-disabling at
CRITICAL and EMERGENCY, the critical alert, per-project and fleet deploy locks,
the concurrency lock, a failed removal being contained, protected paths, symlinked
roots, self-protection, large-file reporting, deleted-but-open detection, the
audit trail, per-category accounting, a root-privileged pass, the CLI surface,
config validation, the systemd units, and both installer scripts.

If `--demo` is what you want on the real box instead, that is what
`install-storage-manager.sh --no-enable` does.

---

## Troubleshooting

**Nothing is being cleaned.** Usually correct. Check:

```bash
storage-manager status     # under every threshold?
storage-manager explain    # what the current level would consider
storage-manager report     # is there anything safe to reclaim at all?
```

**Everything says UNKNOWN.** PM2 is not answering. `pm2 list` as the user that
owns the processes (root on this fleet). Until it answers, everything stays
protected.

**A project I want cleaned is skipped.** Read the reason in
`storage-manager projects`. The usual causes are an uncommitted git change, a
missing lock file, or activity within `DEPLOY_RECENT_MIN` minutes.

**The timer is not running.**

```bash
systemctl list-timers storage-manager.timer
systemctl status storage-manager.service
journalctl -u storage-manager.service --since today
```

**`[FAILED]` records in the log.** One operation failed — permissions, or a file
that vanished mid-run. The pass continues with the remaining categories and never
falls back to anything more destructive. The reason is in the record.

**Full of application data, and safe cleanup offers nothing.** This is the case
the safe categories cannot solve, and the report says so explicitly instead of
printing a reassuring zero:

```bash
storage-manager investigate
```

It samples the disk over `INVESTIGATE_SAMPLE_SEC` seconds to show whether space
is still being lost and how fast, ranks processes by bytes actually written
(from `/proc/<pid>/io`, so run it as root), lists the largest projects and what
is big inside the biggest, and flags two specific pathologies:

- a `.next/standalone` nested inside another `.next/standalone`, which is always
  a prepare step copying its destination into itself and grows a layer per build
- the same project under two roots, where PM2 serves only one copy

Both are reported with the command to fix them and neither is ever removed
automatically: they live inside live projects.

If a copy, build or deploy process is at the top of the writer list, stopping
that one process is safe — it is not serving traffic. That remains your call,
not the program's.

**Disk full but `du` shows nothing.**

```bash
storage-manager open-deleted
```

Space inside a file a process still holds open is only released when that process
closes it. The program reports the process and never kills it.

---

## Emergency recovery

> The copy-paste version of this section, plus prompts for handing an incident to
> an agent, is in [REUSE-PROMPT.md](./REUSE-PROMPT.md).

### The disk is 100% full and nothing will install

At zero free space you cannot `git pull`, cannot install this program, and cannot
write a file. Use commands that need no disk space of their own, in this order:

```bash
# 1. Is something still writing? A copy or build at the top of this list is the
#    thing to stop. It is not serving traffic; the sites keep running.
sudo ps -eo pid,etimes,args | grep -E ' cp | rsync |next build|npm ' | grep -v grep
sudo kill <pid>

# 2. The biggest files. A runaway log is the usual answer.
sudo find /root /srv /var/www -xdev -type f -size +1G -printf '%10s  %p\n' \
  2>/dev/null | sort -rn | head -20

# 3. Empty a log in place — never rm it. A process holding it open would keep
#    the space, and emptying needs no free space to succeed.
sudo truncate -s 0 '<huge log file>'

# 4. A bundle nested inside another bundle is duplicate data by definition, and
#    only the outermost one is ever served, so this is safe while the site runs.
sudo find /root /srv /var/www -maxdepth 12 -type d \
  -path '*/.next/standalone/.next/standalone' -prune -print 2>/dev/null
sudo rm -rf --one-file-system '<path from above>'

# 5. Check, then install and let the timer keep it from happening again.
df -h /
```

Do step 1 before the deletions, or what you free is written straight back.

The installer refuses to run below 50 MB free rather than leaving a half-copied
program behind, and prints this same list.

### At 95% or above

At 95% or above, the manager runs only system-level cleanup, then stops and
writes `/var/log/storage-manager/CRITICAL-ALERT.txt`. It will not delete
application data to save the disk. Manual sequence:

```bash
storage-manager report                  # where the space is
storage-manager open-deleted            # phantom space held by a process
storage-manager large-files --force     # biggest files, with a verdict each
storage-manager cleanup --safe          # re-run the safe tiers now
```

Then, as deliberate operator decisions:

```bash
# 1. A crash-looping app filling its log. Confirm first:
pm2 logs <app> --lines 100
#    Restarting it releases the space, and is a decision only you can take.

# 2. Old releases, when you accept losing instant rollback:
storage-manager config | grep ALLOW_STALE_RELEASE_CLEANUP
#    set ALLOW_STALE_RELEASE_CLEANUP=true, then:
storage-manager cleanup --dry-run       # read it
storage-manager cleanup --full

# 3. The repository's own deeper tools, for a one-off deep clean:
sudo bash /opt/ap-deploy/disk-audit.sh
sudo bash /opt/ap-deploy/disk-cleanup.sh --dry-run
```

The design position: an alert beats a damaged production site. If the disk keeps
filling with the safe categories exhausted, something is actively writing, and
`storage-manager large-files` plus `deploy/find-write-leak.sh` will find it.

---

## Uninstallation

```bash
sudo bash storage-manager/scripts/uninstall-storage-manager.sh
sudo bash storage-manager/scripts/uninstall-storage-manager.sh --purge   # also config and logs
```

Stops and disables the timer, removes the units, the program, the logrotate rule
and its own state. Keeps the config and the audit history unless you purge them.

Never touched: project directories, source, `node_modules`, `.next`, `.env`
files, uploads, databases, backups, git repositories, nginx configuration, SSL
certificates, PM2 processes and their logs.

The uninstaller reminds you that nothing is managing disk space afterwards, and
notes whether a legacy `disk-guard` cron entry is still active.

---

## Relationship to the existing deploy tooling

| Tool | Role |
|---|---|
| `deploy/server-setup.sh` | one-time caps: pm2-logrotate, journald, logrotate, plus the legacy cleanup cron |
| `deploy/disk-audit.sh` | deep read-only forensics, including Docker and Postgres |
| `deploy/disk-cleanup.sh` | manual tiered reclaim, `--aggressive` removes build `node_modules` |
| `deploy/disk-guard.sh` | cron every 15 min; at panic tier truncates live logs in place |
| `storage-manager` | continuous, protection-first automation with an audit trail |

`disk-guard.sh` and this manager both react to a filling disk, and their tiers
disagree on purpose. Running both means one can delete what the other protects,
so disable the legacy cron when enabling this:

```bash
sudo bash storage-manager/scripts/install-storage-manager.sh --disable-legacy-disk-guard
```

That comments out the cron lines (keeping a `.bak`) and leaves the scripts in
place for deliberate manual use. `storage-manager health` reports `LEGACY CRON`
whenever both are active.
