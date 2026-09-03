/**
 * §41 Orphan page report — static internal-link graph vs sitemap.
 *
 *   npm run seo:orphans
 */

import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import {
  detectOrphanPages,
  summarizeOrphans,
} from "../src/lib/seo/orphan-detection";

async function main() {
  const findings = detectOrphanPages({ sitemapOnly: true });
  const summary = summarizeOrphans(findings);
  const report = {
    generatedAt: new Date().toISOString(),
    summary,
    findings: findings.slice(0, 500),
    truncated: findings.length > 500,
  };

  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "orphan-pages.json"),
    JSON.stringify(report, null, 2),
  );

  console.log(
    `Orphan report: ${summary.total} findings (${summary.critical} critical, ${summary.warn} warn)`,
  );
  console.log(`Wrote reports/orphan-pages.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
