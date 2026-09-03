/**
 * §44 + §49 Canonical + schema validation report (static generators).
 *
 *   npm run seo:canonical-schema
 */

import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import {
  organizationSchema,
  webSiteSchema,
  breadcrumbSchema,
  serviceSchema,
  faqSchema,
  webPageSchema,
  localBusinessSchema,
} from "../src/lib/schema";
import {
  findDuplicateSchemaTypes,
  validateJsonLd,
} from "../src/lib/seo/schema-validation";
import { validateCanonical } from "../src/lib/seo/canonical-validation";
import { buildCanonicalUrl } from "../src/lib/routing/paths";
import { buildSitemapRegistry } from "../src/lib/seo/sitemap-registry";
import { HREFLANG_ENABLED } from "../src/lib/seo/hreflang-policy";

async function main() {
  const schemaBlocks = [
    organizationSchema(),
    webSiteSchema(),
    breadcrumbSchema([
      { name: "Home", url: buildCanonicalUrl("/") },
      { name: "Services", url: buildCanonicalUrl("/services/") },
    ]),
    serviceSchema({
      name: "Invisible Grills",
      description: "Balcony invisible grill installation",
      url: buildCanonicalUrl("/services/invisible-grills/"),
    }),
    faqSchema([{ question: "How long?", answer: "Depends on openings." }]),
    webPageSchema({
      name: "Services",
      description: "Service directory",
      url: buildCanonicalUrl("/services/"),
    }),
    localBusinessSchema(),
  ].filter(Boolean);

  const schemaResults = schemaBlocks.map((block, index) => {
    const result = validateJsonLd(block);
    return { index, ok: result.ok, issues: result.issues };
  });

  const duplicates = findDuplicateSchemaTypes(schemaBlocks);

  const canonicalSample = buildSitemapRegistry()
    .filter((e) => e.kind === "hub")
    .slice(0, 30)
    .map((entry) => {
      const result = validateCanonical({
        pagePath: entry.path,
        canonical: entry.url,
        indexable: true,
      });
      return { path: entry.path, ok: result.ok, issues: result.issues };
    });

  const report = {
    generatedAt: new Date().toISOString(),
    hreflangEnabled: HREFLANG_ENABLED,
    schema: {
      results: schemaResults,
      duplicateTypes: duplicates,
      failed: schemaResults.filter((r) => !r.ok).length,
    },
    canonical: {
      sampleSize: canonicalSample.length,
      failed: canonicalSample.filter((c) => !c.ok).length,
      results: canonicalSample.filter((c) => !c.ok),
    },
  };

  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "canonical-schema.json"),
    JSON.stringify(report, null, 2),
  );

  console.log(
    `Schema: ${report.schema.failed} failed · Canonical sample failures: ${report.canonical.failed}`,
  );
  console.log(`Hreflang enabled: ${HREFLANG_ENABLED}`);
  console.log("Wrote reports/canonical-schema.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
