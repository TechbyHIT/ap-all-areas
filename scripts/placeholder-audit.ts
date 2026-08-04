import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { BUSINESS_CONFIG } from "../src/config/business";
import { isPhoneValidForProduction } from "../src/config/business";

const PLACEHOLDER_PATTERN = /\[[A-Z0-9_]+\]/;

async function main() {
  const issues: Array<{ field: string; value: string; message: string }> = [];

  const checks: Array<[string, string]> = [
    ["name", BUSINESS_CONFIG.name],
    ["legalName", BUSINESS_CONFIG.legalName],
    ["email", BUSINESS_CONFIG.email],
    ["address.street", BUSINESS_CONFIG.address.street],
    ["address.city", BUSINESS_CONFIG.address.city],
    ["address.district", BUSINESS_CONFIG.address.district],
    ["address.postalCode", BUSINESS_CONFIG.address.postalCode],
    ["serviceArea.primaryCity", BUSINESS_CONFIG.serviceArea.primaryCity],
    ["socialLinks.instagram", BUSINESS_CONFIG.socialLinks.instagram],
    ["socialLinks.facebook", BUSINESS_CONFIG.socialLinks.facebook],
    ["socialLinks.youtube", BUSINESS_CONFIG.socialLinks.youtube],
  ];

  for (const [field, value] of checks) {
    if (PLACEHOLDER_PATTERN.test(value)) {
      issues.push({
        field,
        value,
        message: "Unresolved placeholder — replace before production publishing",
      });
    }
  }

  if (!isPhoneValidForProduction()) {
    issues.push({
      field: "phone",
      value: BUSINESS_CONFIG.phone.raw,
      message: "Phone must be a verified 10-digit Indian mobile number",
    });
  }

  const report = {
    issues,
    count: issues.length,
    generatedAt: new Date().toISOString(),
  };

  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "placeholders.json"), JSON.stringify(report, null, 2));
  console.log(`Placeholder audit: ${issues.length} issues found`);
}

main().catch(console.error);
