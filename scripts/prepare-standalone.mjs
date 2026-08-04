/**
 * After `next build` with `output: "standalone"`, copy public + static
 * assets into the standalone folder so `node server.js` can serve them.
 *
 * Usage: node scripts/prepare-standalone.mjs
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  unlinkSync,
} from "node:fs";
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

/**
 * Source maps are never loaded at runtime. Tracing sometimes copies them into
 * standalone; deleting them is the safest per-release win without touching
 * anything Node resolves.
 */
function stripSourceMaps(dir) {
  let removed = 0;
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    let entries;
    try {
      entries = readdirSync(current);
    } catch {
      continue;
    }
    for (const name of entries) {
      const full = join(current, name);
      let st;
      try {
        st = statSync(full);
      } catch {
        continue;
      }
      if (st.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (!name.endsWith(".map")) continue;
      try {
        unlinkSync(full);
        removed += 1;
      } catch {
        /* ignore */
      }
    }
  }
  return removed;
}

const stripped = stripSourceMaps(standalone);
console.log(`Stripped ${stripped} source map files from standalone`);
console.log("Standalone prepare complete. Start with: npm run start:standalone");
