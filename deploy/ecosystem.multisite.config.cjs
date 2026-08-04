/**
 * PM2 config for the whole fleet, generated from the site registry.
 *
 * The `.config.cjs` suffix is required, not cosmetic: PM2 decides whether an
 * argument is a config file or a script by matching the filename against
 * `.json` / `.yml` / `.yaml` / `.config.js` / `.config.cjs` / `.config.mjs`.
 * Named anything else, `pm2 start` runs this file as an app instead of reading
 * it, which starts nothing and leaves a stray process named after the file.
 *
 * One file per site in $AP_REGISTRY (default /etc/ap-sites/sites.d/<slug>.env):
 *
 *   DOMAIN=example.com
 *   ALIASES=www.example.com
 *   PORT=3001
 *   REPO=https://github.com/you/repo.git
 *   BRANCH=master
 *   MAX_MEMORY=300M
 *
 * Adding a site is therefore one new file — this config never needs editing.
 *
 *   pm2 start  /etc/ap-sites/ecosystem.multisite.config.cjs
 *   pm2 reload /etc/ap-sites/ecosystem.multisite.config.cjs --only <slug> --update-env
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.env.AP_ROOT || "/srv/sites";
const REGISTRY = process.env.AP_REGISTRY || "/etc/ap-sites/sites.d";

/** Minimal .env parser — PM2 boots before any node_modules are available. */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function registrySlugs() {
  if (!fs.existsSync(REGISTRY)) return [];
  return fs
    .readdirSync(REGISTRY)
    .filter((f) => f.endsWith(".env"))
    .map((f) => path.basename(f, ".env"))
    .sort();
}

const apps = [];

for (const slug of registrySlugs()) {
  const site = loadEnvFile(path.join(REGISTRY, `${slug}.env`));
  const siteRoot = path.join(ROOT, slug);
  const current = path.join(siteRoot, "current");

  if (!site.PORT) {
    console.error(`[ap-sites] skipping ${slug}: PORT missing from registry`);
    continue;
  }
  // A site that has never been deployed has no release yet; skip instead of
  // letting one bad entry break `pm2 start` for the whole fleet.
  if (!fs.existsSync(path.join(current, "server.js"))) {
    console.error(`[ap-sites] skipping ${slug}: no release at ${current}`);
    continue;
  }

  // The runtime ISR / image cache is not configured here: site-deploy.sh
  // symlinks <release>/.next/cache -> shared/cache so it survives releases and
  // disk-cleanup.sh can prune it in one place.
  const logs = path.join(siteRoot, "shared", "logs");

  apps.push({
    name: slug,
    cwd: current,
    script: "server.js",
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    // Per-process cap. 50 sites x 300M is a ceiling, not a reservation, but
    // size it against real RAM: idle Next standalone is ~70-120 MB.
    max_memory_restart: site.MAX_MEMORY || "300M",
    min_uptime: "20s",
    max_restarts: 10,
    restart_delay: 2000,
    kill_timeout: 5000,
    // Logs live next to the site so disk-cleanup.sh and logrotate can find them.
    out_file: path.join(logs, "out.log"),
    error_file: path.join(logs, "error.log"),
    merge_logs: true,
    time: true,
    env: {
      ...loadEnvFile(path.join(siteRoot, "shared", ".env")),
      NODE_ENV: "production",
      PORT: String(site.PORT),
      // Must be the string "localhost", not "127.0.0.1". Next.js middleware
      // rewrites any loopback host to "localhost" in request.url, then only
      // keeps a rewrite internal when that origin matches the server bind
      // address exactly. Binding to 127.0.0.1 makes every NextResponse.rewrite
      // look external, so Next proxies to https://localhost:<PORT> using the
      // X-Forwarded-Proto from nginx — and the plain-HTTP listener answers
      // with EPROTO "wrong version number". nginx can still proxy_pass to
      // 127.0.0.1; that connects to the same loopback socket.
      HOSTNAME: site.HOSTNAME || "localhost",
    },
  });
}

if (apps.length === 0) {
  console.error(
    `[ap-sites] no deployable sites found in ${REGISTRY} (root ${ROOT})`,
  );
}

module.exports = { apps };
