/**
 * §128–129 Representative test-set audit + architecture snapshot.
 *
 *   npm run seo:test-set
 */

import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import {
  auditRepresentativeTestSet,
  buildRepresentativeTestSet,
  SCALE_PREREQUISITES,
} from "../src/lib/seo/representative-test-set";
import { SITE_GRAPH, SEO_JOURNEY, USER_JOURNEY } from "../src/lib/seo/site-graph";
import { buildSeoHealthDashboard } from "../src/lib/seo/seo-health";
import { getLocalBusinessModel } from "../src/lib/seo/local-business-model";
import { NEW_SERVICE_WORKFLOW, NEW_CITY_WORKFLOW } from "../src/lib/seo/entity-workflows";
import { ALL_SEO_RED_FLAGS } from "../src/lib/seo/seo-red-flags";

async function main() {
  const testSet = buildRepresentativeTestSet();
  const audit = auditRepresentativeTestSet();
  const health = buildSeoHealthDashboard();
  const business = getLocalBusinessModel();

  const deliverable = {
    generatedAt: new Date().toISOString(),
    principle: {
      seoJourney: SEO_JOURNEY,
      userJourney: USER_JOURNEY,
      siteGraph: SITE_GRAPH,
      nonNegotiable:
        "Never confuse more SEO pages with better SEO. Entity → Intent → Information → Location → Evidence → Internal link → Conversion.",
    },
    scale: {
      prerequisites: SCALE_PREREQUISITES,
      scaleAllowed: audit.scaleAllowed,
      message: audit.message,
    },
    representativeTestSet: {
      pages: testSet,
      audit,
    },
    architectureSnapshot: {
      business: business.business,
      services: business.services.length,
      cities: business.cities.length,
      sitemapUrls: health.totals.sitemapUrls,
      workflows: {
        newServiceSteps: NEW_SERVICE_WORKFLOW.length,
        newCitySteps: NEW_CITY_WORKFLOW.length,
      },
      redFlagTypes: ALL_SEO_RED_FLAGS.length,
    },
  };

  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "seo-test-set.json"),
    JSON.stringify(deliverable, null, 2),
  );

  console.log(audit.message);
  console.log(
    `Test set: ${testSet.length} pages · scaleAllowed=${audit.scaleAllowed} · QA critical=${audit.qaCritical}`,
  );
  if (audit.missingFromSitemap.length > 0) {
    console.log(
      `Missing from sitemap (sample): ${audit.missingFromSitemap.slice(0, 8).join(", ")}`,
    );
  }
  console.log("Wrote reports/seo-test-set.json");

  if (process.env.SEO_TEST_SET_STRICT === "1" && !audit.scaleAllowed) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
