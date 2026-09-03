/**
 * Emit a keyword ownership summary for SEO audits.
 *
 *   npm run seo:keyword-ownership
 *
 * Output: reports/keyword-ownership-summary.json
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  buildKeywordOwnershipDatabase,
  listPrimaryOwnerPaths,
  summarizeKeywordOwnership,
} from "../src/lib/seo/keyword-ownership";

function main() {
  const records = buildKeywordOwnershipDatabase();
  const summary = summarizeKeywordOwnership(records);
  const owners = listPrimaryOwnerPaths(buildKeywordOwnershipDatabase(0));

  const sampleOwners = records
    .filter((r) => r.status === "owner" && r.city === "visakhapatnam")
    .slice(0, 12)
    .map((r) => ({
      keyword: r.keyword,
      cluster: r.keywordCluster,
      target: r.targetURL,
      canonical: r.canonicalURL,
      intent: r.searchIntent,
    }));

  const sampleRedirects = records
    .filter((r) => r.status === "redirect-to-owner" && r.city === "visakhapatnam")
    .slice(0, 12)
    .map((r) => ({
      keyword: r.keyword,
      target: r.targetURL,
      canonical: r.canonicalURL,
    }));

  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });

  const payload = {
    generatedAt: new Date().toISOString(),
    summary,
    primaryOwnerCountP0: owners.length,
    sampleOwnersVizag: sampleOwners,
    sampleRedirectsVizag: sampleRedirects,
  };

  writeFileSync(
    path.join(dir, "keyword-ownership-summary.json"),
    JSON.stringify(payload, null, 2),
  );

  console.log(
    `[keyword-ownership] rows=${summary.total} uniqueOwners=${summary.uniqueOwners}`,
  );
  console.log(`[keyword-ownership] byStatus=`, summary.byStatus);
  console.log(`[keyword-ownership] byCluster=`, summary.byCluster);
  console.log(
    `Wrote reports/keyword-ownership-summary.json (${owners.length} P0 owner paths)`,
  );
}

main();
