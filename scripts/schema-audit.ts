import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { organizationSchema, webSiteSchema, breadcrumbSchema } from "../src/lib/schema/index";

async function main() {
  const schemas = [
    { name: "organization", data: organizationSchema() },
    { name: "website", data: webSiteSchema() },
    {
      name: "breadcrumb",
      data: breadcrumbSchema([
        { name: "Home", url: "http://localhost:3000/" },
        { name: "Services", url: "http://localhost:3000/services/" },
      ]),
    },
  ];

  const report = { schemas, valid: true, generatedAt: new Date().toISOString() };
  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "schema-audit.json"), JSON.stringify(report, null, 2));
  console.log("Schema audit completed");
}

main().catch(console.error);
