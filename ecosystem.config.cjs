/**
 * PM2 — Next.js standalone (no Docker)
 *
 * Default site: port 3000
 * Extra sites: duplicate the app block, change name + PORT + cwd
 *
 * Start:   npm run pm2:start
 * Reload:  npm run pm2:reload
 */
const path = require("node:path");
const fs = require("node:fs");

const ROOT = __dirname;
const STANDALONE = path.join(ROOT, ".next", "standalone");

/** Minimal .env loader (no dependency on dotenv at PM2 boot time). */
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

const fileEnv = {
  ...loadEnvFile(path.join(ROOT, ".env")),
  ...loadEnvFile(path.join(ROOT, ".env.production")),
};

function siteEnv(port) {
  return {
    ...fileEnv,
    NODE_ENV: "production",
    PORT: String(port),
    HOSTNAME: "0.0.0.0",
  };
}

module.exports = {
  apps: [
    {
      name: "sk-invisible-grills",
      cwd: STANDALONE,
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: siteEnv(3000),
      env_production: siteEnv(3000),
    },

    // Multi-site examples — own folder + own PORT (3001, 3002, …)
    // {
    //   name: "site-b",
    //   cwd: "/var/www/site-b/.next/standalone",
    //   script: "server.js",
    //   instances: 1,
    //   exec_mode: "fork",
    //   autorestart: true,
    //   max_memory_restart: "512M",
    //   env: { ...loadEnvFile("/var/www/site-b/.env"), NODE_ENV: "production", PORT: "3001", HOSTNAME: "0.0.0.0" },
    // },
  ],
};
