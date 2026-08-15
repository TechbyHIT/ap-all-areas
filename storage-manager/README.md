# storage-manager

Automatic disk management for an Ubuntu VPS running many Node/Next.js sites
behind nginx under PM2, built around one rule:

> **It never touches a running application.** No stop, no restart, no reload, no
> signal, no build, no deploy, no application data. When anything is uncertain it
> does nothing, logs why, and reports it.

A systemd timer runs it every 15 minutes. Each pass checks the disk, discovers
every project, works out what is safe, cleans only system-owned data, rechecks,
writes an audit record and exits. Nothing stays resident.

```
storage-manager/
├── scripts/
│   ├── storage-manager.sh              the program
│   ├── install-storage-manager.sh      install + audit + dry-run + confirm
│   └── uninstall-storage-manager.sh    remove, keeping every project intact
├── systemd/
│   ├── storage-manager.service         Type=oneshot
│   └── storage-manager.timer           every 15 minutes, Persistent=true
├── config/
│   ├── storage-manager.conf.example    every threshold and path
│   └── logrotate.storage-manager       so its own logs stay bounded
├── tests/run-tests.sh                  37 tests in a sandbox with fake pm2/df
└── docs/STORAGE-MANAGER.md             the full manual
```

## Install

```bash
sudo bash storage-manager/scripts/install-storage-manager.sh
```

It verifies the system, installs to `/usr/local/sbin/storage-manager`, then runs
a **read-only audit**, a **project inventory** and a **full dry run**, prints the
results, and only enables the timer after you type `enable`. Add `--no-enable` to
install and validate without turning anything on.

## Day to day

```bash
storage-manager status              # disk, level, last run
storage-manager report              # full audit with safe reclaimable estimate
storage-manager projects            # every project, its state, why it is protected
storage-manager cleanup --dry-run   # decide everything, change nothing
storage-manager cleanup --safe      # system-level cleanup, ignore thresholds
storage-manager large-files         # biggest files, never deleted automatically
storage-manager open-deleted        # space held by deleted-but-open files
storage-manager health              # disk, PM2, nginx, timer, config, locks
storage-manager explain             # why it would do what it would do
storage-manager logs                # its own log
```

## Defaults

| Setting | Default | Meaning |
|---|---|---|
| `TARGET_FREE_GB` | 60 | keep at least this much free (60 GB of a 200 GB disk) |
| `MAX_USAGE_PERCENT` | 70 | the ceiling it tries to stay under |
| `WARNING_USAGE_PERCENT` | 70 | preventive cleanup starts here |
| `CLEANUP_USAGE_PERCENT` | 80 | + old temp files |
| `AGGRESSIVE_USAGE_PERCENT` | 85 | + package caches, logrotate, enabled opt-ins |
| `CRITICAL_USAGE_PERCENT` | 90 | system data only, opt-ins force-disabled, alert |
| `EMERGENCY_USAGE_PERCENT` | 95 | same, and it asks for a human |
| `ALLOW_NEXT_CACHE_CLEANUP` | false | opt-in, offline projects only |
| `ALLOW_NEXT_BUILD_CLEANUP` | false | opt-in, offline projects only |
| `ALLOW_NODE_MODULES_CLEANUP` | false | opt-in, offline projects only |
| `ALLOW_STALE_RELEASE_CLEANUP` | false | opt-in, keeps the live release + rollback |

Levels 4 and 5 do **less** than level 3, not more. A nearly full disk is exactly
when a wrong deletion takes a site down, so under real pressure the manager
narrows to data the operating system owns and alerts instead of reclaiming more.

## What it cleans, and what it will not touch

Cleaned, because the system regenerates it:
apt package archives, the systemd journal above its cap, **rotated** log files
past their retention, temp files older than a week that no process has open, and
package-manager caches.

Never touched automatically: application source, `public`, `uploads`, storage,
databases, backups, `.env*`, `.git`, `node_modules`, `.next` of any online
project, any standalone bundle, nginx configuration, SSL certificates, PM2
configuration and runtime state, and `/etc /usr /bin /sbin /lib /boot /root/.ssh`.

Active log files are never deleted **and never truncated**, even at 99% full.
Truncating a log that a process still holds open is how a crash-looping app
loses the evidence of why it is crashing.

## Tests

```bash
bash storage-manager/tests/run-tests.sh              # 37 tests
bash storage-manager/tests/run-tests.sh --keep       # keep the sandbox to poke at
FAKE_PCT=92 bash storage-manager/tests/run-tests.sh --demo
```

`--demo` builds a simulated fleet of eight sites — six online, one stopped, one
mid-deploy — at whatever fullness you set, then runs the same validation
sequence the installer runs on a real server: health, report, projects, explain,
a full dry run, a verification that nothing changed, and finally a real
automatic pass with a check that every application path is still intact.

Everything runs in a throwaway sandbox with fake `df`, `pm2`, `journalctl`,
`apt-get`, `logrotate`, `lsof`, `nginx` and `systemctl` on `PATH`. The fakes
double as spies, so the suite can assert that no application-disturbing command
was issued even once across every scenario, including a full run at 97% full.

## Relationship to `deploy/disk-guard.sh`

This repository already contains `deploy/disk-guard.sh`, scheduled by
`deploy/server-setup.sh` in `/etc/cron.d/ap-sites`. It is more aggressive by
design: at its panic tier it truncates live logs in place and removes
`node_modules` from build directories.

Running both means one can delete what the other protects. Pick one:

- **Recommended:** keep this manager and disable the legacy cron entries with
  `install-storage-manager.sh --disable-legacy-disk-guard`. The scripts stay on
  disk and can still be run by hand for a deliberate deep clean.
- Or keep the cron and leave this manager on `--no-enable`, using it for its
  read-only reports.

`storage-manager health` warns whenever both are active.

Full manual: [docs/STORAGE-MANAGER.md](docs/STORAGE-MANAGER.md).
