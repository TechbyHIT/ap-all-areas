# Prompts to reuse on this server

Three things, in order of how urgently you are likely to need them:

1. [Emergency runbook](#1-emergency-runbook-no-ai-needed) — the disk is full, act now
2. [Emergency prompt](#2-emergency-prompt-disk-filling-or-full) — hand the incident to an agent
3. [Safe-change prompt](#3-safe-change-prompt-storage-deploy-or-cleanup-work) — any future storage or deploy work
4. [Build-cap prompt](#4-build-cap-prompt-a-site-whose-build-fills-the-disk) — a site whose build itself fills the disk

The facts about this server are written into each prompt on purpose. An agent that
has to guess the layout wastes your time and gives worse advice.

---

## 1. Emergency runbook (no AI needed)

Every command here works at zero free space, because none of them write.

```bash
# Where the space is, one level at a time. Follow the biggest number down.
df -h /
sudo du -xm --max-depth=1 / 2>/dev/null | sort -rn | head
sudo du -xm --max-depth=1 /root | sort -rn | head        # then the biggest project
sudo du -xm --max-depth=2 /root/<project>/.next | sort -rn | head

# Is something still writing? A copy, build or deploy here is safe to stop —
# it is not serving traffic. Do this BEFORE deleting, or the space comes back.
sudo ps -eo pid,etimes,args | grep -E ' cp | rsync | tar |next build|npm ' | grep -v grep

# Rendered pages: what filled this disk once already (156 GB, 71 GB in one city).
sudo find /root/<project> -path '*/.next/server/app/*' -type f \
  \( -name '*.html' -o -name '*.rsc' -o -name '*.meta' \) -delete

# Next.js caches: always safe, the app rebuilds entries on demand.
sudo rm -rf --one-file-system /root/<project>/.next/cache
sudo rm -rf --one-file-system /root/<project>/.next/standalone/.next/cache

# A huge log: empty it, never rm it. rm leaves the space held by the process.
sudo find / -xdev -type f -size +1G -printf '%15s  %p\n' 2>/dev/null | sort -rn | head
sudo truncate -s 0 '<huge log>'

# Space that df counts but du cannot see: deleted files a process still holds.
sudo lsof -nP +L1 2>/dev/null | awk '$7+0 > 104857600 {print $1, $2, $7, $NF}'

# Last resort for a few hundred MB, enough to make git and apt work again.
sudo rm -rf /var/lib/apt/lists/* && sudo journalctl --vacuum-size=16M
```

Never, at any level of desperation: delete `.next` itself, delete
`.next/server/app/**/*.js` or any manifest, delete `node_modules` of a running
site, `rm` a live log, restart PM2 or nginx to reclaim space, or `apt autoremove`.

Once there is space:

```bash
cd /root/ap-all-areas && git pull
sudo bash storage-manager/scripts/install-storage-manager.sh --disable-legacy-disk-guard
sudo storage-manager investigate     # where the space is, what is writing
sudo storage-manager status
```

---

## 2. Emergency prompt (disk filling or full)

Paste this, then paste your terminal output as you go.

> **Role:** senior Linux SRE. Production Ubuntu 24.04 VPS, 193 GB disk, ~12
> Next.js sites under PM2 behind nginx, all as root. Sites live in three places:
> `/srv/sites/<slug>/{build,releases,current,shared}` (the managed layout),
> `/var/www/<slug>`, and `/root/<slug>`. Registry: `/etc/ap-sites/sites.d/*.env`.
> Tooling: `/root/ap-all-areas/deploy/*.sh` and `storage-manager`.
>
> **Situation:** the disk is at or near 100%. I will paste command output.
>
> **Absolute rules — these are non-negotiable:**
> - Never stop, restart, reload, kill or signal PM2, nginx or node. Not to
>   reclaim space, not to "apply" anything.
> - Never truncate or delete a log a process is still writing to. Emptying a live
>   log destroys the evidence of why an app is misbehaving; that is my call, not
>   yours.
> - Never delete `.env*`, `.git`, source, `public`, uploads, databases, backups,
>   SSL certificates, nginx config, `node_modules` of a running site, `.next`
>   itself, or a standalone bundle.
> - Never run `npm install`/`ci`/`build`, `next build`, `git pull/reset/clean`,
>   `apt autoremove`, or a deploy script.
> - No `rm -rf` on a path you have not first shown me the size of.
>
> **Method, in this order — do not skip ahead:**
> 1. Ask me to run read-only commands and wait for the output. Assume nothing
>    about where the space is.
> 2. Establish whether the disk is still filling, and what is writing.
>    Something actively writing must be dealt with before any deletion.
> 3. Follow the size down one directory level at a time until you can name the
>    exact path holding the space. Do not guess from experience.
> 4. Only then propose deletions, each with: the exact command, what regenerates
>    it, whether it affects a running site, and roughly how much it frees.
> 5. One step at a time. Wait for my output before the next one.
>
> **Known pathologies on this box, most likely first:**
> - `.next/server/app/**` rendered pages (`.html`, `.rsc`, `.meta`) from a build
>   with no prerender caps. This filled the disk once: 156 GB, 71 GB under one
>   city. Deleting only those three extensions is safe; the `.js` and manifests
>   beside them are not.
> - `.next/cache` and `.next/standalone/.next/cache` — always safe to delete.
> - A `.next/standalone` nested inside another `.next/standalone` — duplicate
>   data, only the outermost is served.
> - The same site in two of the three roots, costing double.
> - Deleted-but-open files: `df` full, `du` shows nothing.
>
> Note that system-level cleanup is a rounding error here: apt, the journal, PM2
> logs, nginx logs and temp files together are under 1 GB on this server. If you
> propose `apt clean` as a fix for a full disk, you have not read this.

---

## 3. Safe-change prompt (storage, deploy or cleanup work)

For building or changing anything that touches disk on this server.

> **Role:** senior Linux SRE and Bash engineer. Same server as above: Ubuntu
> 24.04, 193 GB, ~12 Next.js sites under PM2 behind nginx, three site roots
> (`/srv/sites`, `/var/www`, `/root`), registry `/etc/ap-sites/sites.d`, tooling
> in `/root/ap-all-areas/deploy` and `storage-manager`.
>
> **Priority order for every decision:** application availability, then data
> integrity, then deployment safety, then server stability, and only then storage
> optimisation. When something is uncertain: do nothing, log it, report it.
>
> **Build it this way:**
> - Inspect the actual server before writing code. Read the existing scripts in
>   `deploy/` first — the conventions, paths and locks are already established
>   there, and duplicating them creates two tools that fight each other.
> - One code path for dry-run and real execution, diverging only where something
>   would change, so `--dry-run` is evidence rather than a separate simulation.
> - One function that performs deletions, and nothing else deletes. It takes an
>   explicit allowlist and refuses anything that is a symlink, resolves
>   elsewhere, is a mount point, is under two levels deep, is inside a protected
>   path, or carries a protected name. Every refusal is logged with its reason.
> - Default every destructive capability to off. Enabling one must still not make
>   it unconditional.
> - Do less under pressure, not more. At 90%+ narrow to data the OS owns and
>   alert a human; that is when a wrong deletion is most expensive.
> - Config is parsed, never sourced. Numbers validated, unknown keys rejected.
> - Systemd timer, not a loop. `flock` so one instance acts at a time. Every run
>   writes an audit record: usage before and after, what was done, what was
>   skipped and why.
> - Never call `pm2 restart|reload|stop|delete|kill|flush`, `systemctl
>   restart|reload`, `npm`, `next build`, or any mutating `git` command.
>
> **Test it this way:** a sandbox with fake `df`, `pm2`, `journalctl`, `apt-get`,
> `lsof`, `nginx` and `systemctl` on `PATH`, that also record every invocation.
> Then assert that no application-disturbing command was issued in any scenario,
> including at 97% full and as root. Prove the dry run changes nothing by
> fingerprinting the tree before and after. Test the refusals, not just the
> happy paths: online project, deploying project, dirty git tree, unknown state,
> symlinked root, protected path, held lock, failed removal.
>
> **Before I enable anything:** run a read-only audit and a full dry run against
> the real server, show me both, and confirm zero projects, PM2 processes, nginx
> instances and git repositories were modified. Ask for explicit confirmation
> before enabling automation.
>
> **Finally, tell me what you did not do and why**, and which single upstream fix
> would remove the need for the tool. On this server that answer was: cap the
> prerender seed at build time. A cleanup tool that hides a build problem is a
> worse outcome than fixing the build.

---

## 4. Build-cap prompt (a site whose build fills the disk)

For the project that writes tens of GB of prerendered pages on every build. Paste
this into a session opened **on that project's repository**, not this one.

> **Role:** senior Next.js engineer working on a programmatic-SEO site (App
> Router, `output: "standalone"`, deployed with PM2 behind nginx on a 193 GB VPS
> shared with about a dozen other sites).
>
> **Problem:** this project's build prerenders far too many pages. On the server
> it produced 156 GB under `.next/standalone/.next/server/app` as `.html`, `.rsc`
> and `.meta` files — 71 GB under one city alone, 46 GB under the next — and
> filled the disk to 100%. A sibling project in the same family had the identical
> failure at 86 GB before it was capped.
>
> **Cause to confirm first, not assume:** a `generateStaticParams` that returns
> the full cross-product of cities × areas × services/keywords. Find every
> `generateStaticParams` in the repo and tell me how many paths each one returns
> for the current data, before changing anything.
>
> **The fix, which a sibling repo already uses — copy the shape of it:**
> - one config module (`src/config/prerender.ts`) exporting small integer caps
>   read from env with **safe defaults baked in**, so a build with no environment
>   set is already capped. The working values there are 2 cities, 8 areas per
>   city, 8 keywords.
> - every `generateStaticParams` truncates against those caps.
> - `export const dynamicParams = true` on those routes, so any URL outside the
>   seed still renders on the first request and is then cached by ISR.
> - `export const revalidate = <seconds>` so cached pages refresh.
>
> **Hard constraints — do not trade SEO for disk:**
> - No URL may stop working. The long tail must still return 200 on demand.
> - Sitemaps must keep listing the full URL set. Only what is *prebuilt* shrinks;
>   what is *reachable and indexable* does not change.
> - Do not delete routes, change URL shapes, add `noindex`, or touch canonical
>   tags, metadata or internal links.
> - Do not reduce the seed to zero: keep the money pages prebuilt so the most
>   valuable URLs are instant and never depend on a cold render.
>
> **Verify with numbers, not claims:**
> ```bash
> npm run build
> du -sm .next/server/app                                    # target: under 1500
> find .next/server/app -name '*.html' | wc -l               # prerendered count
> # a URL deliberately outside the seed must still render:
> npm run start & sleep 5
> curl -s -o /dev/null -w '%{http_code}\n' 'http://localhost:3000/<uncapped-url>'
> ```
> Report the before and after for all three. A build over about 1.5 GB of
> `server/app` on this fleet is still wrong.
>
> **Finally:** if this repo is simply an older clone of the sibling that already
> has `src/config/prerender.ts`, say so instead of writing new code — the fix is
> then a merge, not an implementation.

---

## Why the last paragraph matters

The 156 GB was a build-time mistake — a project built outside `site-deploy.sh`,
so it never got `PRERENDER_CITY_LIMIT`, `PRERENDER_AREA_LIMIT` or
`PRERENDER_KEYWORD_LIMIT`, and it prerendered the full city × area × keyword
cross-product. Automatic cleanup can hold that at bay indefinitely and the disk
will still be a standing risk. Ask any agent for the upstream fix, not just the
cleanup.
