/**
 * §110 Automated SEO QA (+ §111–112 dashboard snapshots).
 *
 *   npm run seo:qa
 *   SEO_QA_STRICT=1 npm run seo:qa   # exit 1 on critical issues
 */

import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import {
  buildContentQualityDashboard,
  buildSeoHealthDashboard,
  runAutomatedSeoQa,
} from "../src/lib/seo/seo-health";

async function main() {
  const qa = runAutomatedSeoQa();
  const health = buildSeoHealthDashboard();
  const content = buildContentQualityDashboard();

  const report = {
    generatedAt: new Date().toISOString(),
    qa,
    health,
    content,
  };

  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "seo-qa.json"), JSON.stringify(report, null, 2));
  writeFileSync(
    path.join(dir, "seo-health-dashboard.json"),
    JSON.stringify(health, null, 2),
  );
  writeFileSync(
    path.join(dir, "content-quality-dashboard.json"),
    JSON.stringify(content, null, 2),
  );

  console.log(
    `SEO QA: ${qa.critical} critical, ${qa.warn} warn · ok=${qa.ok}`,
  );
  console.log(
    `Health: ${health.totals.sitemapUrls} sitemap URLs · ${health.totals.availabilityIndexable} availability cells`,
  );
  console.log("Wrote reports/seo-qa.json, seo-health-dashboard.json, content-quality-dashboard.json");

  if (process.env.SEO_QA_STRICT === "1" && !qa.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
