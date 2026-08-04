import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const design = readFileSync("src/config/design.ts", "utf8");
const imgs = [
  ...design.matchAll(/"(\/images\/projects\/[^"]+)"/g),
].map((m) => m[1]);
const uniq = [...new Set(imgs)];
const missing = uniq.filter(
  (p) => !existsSync(join("public", p.replace(/^\//, ""))),
);
console.log(`referenced ${uniq.length}, missing ${missing.length}`);
for (const m of missing) console.log("MISSING", m);
process.exit(missing.length ? 1 : 0);
