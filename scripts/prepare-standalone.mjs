/**
 * After `next build` with `output: "standalone"`, copy public + static
 * assets into the standalone folder so `node server.js` can serve them.
 *
 * Usage: node scripts/prepare-standalone.mjs
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");
const staticSrc = join(root, ".next", "static");
const publicSrc = join(root, "public");
const prismaSrc = join(root, "src", "generated", "prisma");

if (!existsSync(join(standalone, "server.js"))) {
  console.error(
    "Missing .next/standalone/server.js — run `npm run build` first (output: 'standalone').",
  );
  process.exit(1);
}

const staticDest = join(standalone, ".next", "static");
const publicDest = join(standalone, "public");
const prismaDest = join(standalone, "src", "generated", "prisma");

mkdirSync(join(standalone, ".next"), { recursive: true });

if (existsSync(staticSrc)) {
  rmSync(staticDest, { recursive: true, force: true });
  cpSync(staticSrc, staticDest, { recursive: true });
  console.log("Copied .next/static → .next/standalone/.next/static");
} else {
  console.warn("Warning: .next/static not found");
}

if (existsSync(publicSrc)) {
  rmSync(publicDest, { recursive: true, force: true });
  cpSync(publicSrc, publicDest, { recursive: true });
  console.log("Copied public → .next/standalone/public");
} else {
  console.warn("Warning: public/ not found");
}

if (existsSync(prismaSrc)) {
  mkdirSync(join(standalone, "src", "generated"), { recursive: true });
  rmSync(prismaDest, { recursive: true, force: true });
  cpSync(prismaSrc, prismaDest, { recursive: true });
  console.log("Copied src/generated/prisma → standalone (Prisma client)");
}

console.log("Standalone prepare complete. Start with: npm run start:standalone");
