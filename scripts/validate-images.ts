/**
 * §173–174 Visual / WebP validation for public raster assets.
 *
 *   npm run images:validate
 *   IMAGES_VALIDATE_STRICT=1 npm run images:validate
 */

import { existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "public", "images");
const REPORT_DIR = path.join(process.cwd(), "reports");

type Issue = {
  severity: "critical" | "warn";
  code: string;
  file: string;
  message: string;
};

const ALLOWED_UNOPTIMIZED = new Set([
  // Brand marks — keep PNG for transparency / favicon-adjacent use (§174 exceptions).
  "/images/hiranya-enterprises-logo.png",
  "/images/hiranya-logo-circle.png",
]);

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === "responsive") continue;
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

function toPublic(abs: string): string {
  return `/${path.relative(path.join(process.cwd(), "public"), abs).replace(/\\/g, "/")}`;
}

function main() {
  const files = walk(ROOT);
  const issues: Issue[] = [];

  for (const file of files) {
    const pub = toPublic(file);
    const base = path.basename(file);
    const st = statSync(file);

    if (/^IMG\d+|DSC\d+|image-final|photo-new/i.test(base)) {
      issues.push({
        severity: "warn",
        code: "bad-filename",
        file: pub,
        message: "Non-descriptive filename",
      });
    }

    if (/\.(jpe?g|png)$/i.test(file)) {
      const webp = file.replace(/\.(jpe?g|png)$/i, ".webp");
      if (!existsSync(webp) && !ALLOWED_UNOPTIMIZED.has(pub)) {
        issues.push({
          severity: "critical",
          code: "missing-webp",
          file: pub,
          message: "Raster has no sibling .webp — run npm run images:optimize",
        });
      }
    }

    if (st.size > 2_500_000 && /\.(jpe?g|png|webp)$/i.test(file)) {
      issues.push({
        severity: "warn",
        code: "oversized",
        file: pub,
        message: `File is ${(st.size / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  }

  mkdirSync(REPORT_DIR, { recursive: true });
  const report = {
    generatedAt: new Date().toISOString(),
    scanned: files.length,
    critical: issues.filter((i) => i.severity === "critical").length,
    warn: issues.filter((i) => i.severity === "warn").length,
    issues,
  };
  writeFileSync(
    path.join(REPORT_DIR, "image-validate.json"),
    JSON.stringify(report, null, 2),
  );

  console.log(
    `Image validate: ${report.critical} critical, ${report.warn} warn (${files.length} files)`,
  );

  if (process.env.IMAGES_VALIDATE_STRICT === "1" && report.critical > 0) {
    process.exit(1);
  }
}

main();
