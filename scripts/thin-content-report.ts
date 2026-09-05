/**
 * Thin / duplicate-content risk flags for manual review.
 * Run: npx tsx scripts/thin-content-report.ts
 *
 * Does not auto-noindex — surfaces pages that still rely on template copy
 * without curated city/area local facts.
 */

import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { HIGH_PRIORITY_CITY_AREAS } from "../src/data/initial-locations";
import { getCityLocalProfile, P0_MONEY_CITY_SLUGS } from "../src/data/city-local-profiles";
import { getAreaLocalFact } from "../src/data/area-local-facts";
import { INITIAL_SERVICES } from "../src/data/initial-services";

type Flag = {
  path: string;
  risk: "thin-city-profile" | "thin-area-fact" | "template-heavy";
  note: string;
};

function main() {
  const flags: Flag[] = [];
  const p0 = new Set(P0_MONEY_CITY_SLUGS);

  for (const city of HIGH_PRIORITY_CITY_AREAS) {
    if (!p0.has(city.citySlug)) continue;
    if (!getCityLocalProfile(city.citySlug)) {
      flags.push({
        path: `/locations/andhra-pradesh/${city.citySlug}/`,
        risk: "thin-city-profile",
        note: "No CITY_LOCAL_PROFILES entry — prioritize unique climate/corridor copy",
      });
    }
    for (const area of city.areas) {
      if (!getAreaLocalFact(city.citySlug, area.slug)) {
        flags.push({
          path: `/locations/andhra-pradesh/${city.citySlug}/${area.slug}/`,
          risk: "thin-area-fact",
          note: "No AreaLocalFact — locality page may read as name-swap template",
        });
      }
      for (const service of INITIAL_SERVICES) {
        if (!service.allowIndexing) continue;
        if (!getAreaLocalFact(city.citySlug, area.slug)) {
          flags.push({
            path: `/locations/andhra-pradesh/${city.citySlug}/${area.slug}/${service.slug}/`,
            risk: "template-heavy",
            note: "Area×service without local fact layer — review before scaling more areas",
          });
        }
      }
    }
  }

  const reportDir = path.join(process.cwd(), "reports");
  mkdirSync(reportDir, { recursive: true });
  const out = {
    generatedAt: new Date().toISOString(),
    flagCount: flags.length,
    flags: flags.slice(0, 500),
    truncated: flags.length > 500,
  };
  writeFileSync(
    path.join(reportDir, "thin-content-flags.json"),
    JSON.stringify(out, null, 2),
  );
  console.log(`Thin-content flags: ${flags.length} (wrote reports/thin-content-flags.json)`);
}

main();
