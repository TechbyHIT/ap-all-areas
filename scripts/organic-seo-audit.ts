/**
 * GFG organic SEO audit — maps GeeksforGeeks checklist to live codebase status.
 *
 *   npm run seo:organic
 *   SEO_QA_STRICT=1 npm run seo:organic
 */

import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import {
  GFG_ORGANIC_CHECKLIST,
  gfgChecklistSummary,
  FAST_LOADING_RULES,
  BLACK_HAT_BLOCKED,
} from "../src/lib/seo/gfg-seo-basics";
import { runAutomatedSeoQa } from "../src/lib/seo/seo-health";
import { buildSitemapInventory } from "../src/lib/seo/sitemap-inventory";

async function main() {
  const qa = runAutomatedSeoQa();
  const summary = gfgChecklistSummary();
  const sitemap = buildSitemapInventory();

  const report = {
    generatedAt: new Date().toISOString(),
    source:
      "https://www.geeksforgeeks.org/techtips/search-engine-optimization-seo-basics/",
    strategy: "white-hat organic only (no black-hat, no paid)",
    checklist: GFG_ORGANIC_CHECKLIST,
    summary,
    fastLoadingRules: FAST_LOADING_RULES,
    blackHatBlocked: BLACK_HAT_BLOCKED,
    sitemap,
    automatedQa: qa,
  };

  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "organic-seo-audit.json"),
    JSON.stringify(report, null, 2),
  );

  console.log("=== GFG Organic SEO Audit ===");
  console.log(
    `Checklist: ${summary.done}/${summary.total} done · ${summary.partial} partial · ${summary.ops} ops/marketing`,
  );
  console.log(`Automated QA: ${qa.critical} critical · ${qa.warn} warn · ok=${qa.ok}`);
  console.log(
    `Indexable sitemap URLs: ${sitemap.indexableTotal} (core ${sitemap.byFile.core} · services ${sitemap.byFile.services} · city-services ${sitemap.byFile["city-services"]} · areas ${sitemap.byFile.areas} · area-services ${sitemap.byFile["area-services"]} · societies ${sitemap.byFile.societies} · keyword-locality ${sitemap.moneyGrid.keywordLocalityUrls})`,
  );
  console.log(
    `Money grid: ${sitemap.moneyGrid.cities} cities × ${sitemap.moneyGrid.locationServices} services = ${sitemap.moneyGrid.cityServiceInSitemap}/${sitemap.moneyGrid.cityServiceExpected} city-service · ${sitemap.moneyGrid.areas} areas × ${sitemap.moneyGrid.locationServices} services = ${sitemap.moneyGrid.areaServiceInSitemap}/${sitemap.moneyGrid.areaServiceExpected} area-service · complete=${sitemap.moneyGrid.completeAreaServiceGrid}`,
  );
  console.log("Wrote reports/organic-seo-audit.json");

  for (const item of GFG_ORGANIC_CHECKLIST.filter((i) => i.status !== "done")) {
    console.log(`  [${item.status}] ${item.gfg}`);
  }

  if (process.env.SEO_QA_STRICT === "1" && !qa.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
