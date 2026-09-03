import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import {
  organizationSchema,
  webSiteSchema,
  breadcrumbSchema,
  localBusinessSchema,
} from "../src/lib/schema/index";
import { buildCanonicalUrl } from "../src/lib/routing/paths";
import {
  findDuplicateSchemaTypes,
  validateJsonLd,
} from "../src/lib/seo/schema-validation";

async function main() {
  const schemas = [
    { name: "organization", data: organizationSchema() },
    { name: "website", data: webSiteSchema() },
    {
      name: "breadcrumb",
      data: breadcrumbSchema([
        { name: "Home", url: buildCanonicalUrl("/") },
        { name: "Services", url: buildCanonicalUrl("/services/") },
      ]),
    },
    { name: "localBusiness", data: localBusinessSchema() },
  ].filter((row) => row.data != null);

  const results = schemas.map((row) => ({
    name: row.name,
    ...validateJsonLd(row.data),
  }));

  const report = {
    schemas: results,
    duplicateTypes: findDuplicateSchemaTypes(schemas.map((s) => s.data)),
    valid: results.every((r) => r.ok),
    generatedAt: new Date().toISOString(),
  };

  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "schema-audit.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(
    `Schema audit: ${report.valid ? "OK" : "ISSUES"} (${results.filter((r) => !r.ok).length} failed)`,
  );
}

main().catch(console.error);
