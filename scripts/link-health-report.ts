/**
 * §42–43 Link health + redirect registry report.
 *
 *   npm run seo:link-health
 *   LINK_HEALTH_BASE=https://hiranayaenterprises.in npm run seo:link-health
 */

import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import {
  auditInternalLinksStatic,
  auditLinksHttp,
  buildLinkHealthReport,
} from "../src/lib/seo/link-health";
import { auditRedirectRegistry } from "../src/lib/seo/redirect-registry";
import { buildSitemapRegistry } from "../src/lib/seo/sitemap-registry";

async function main() {
  const staticIssues = auditInternalLinksStatic();
  const redirects = auditRedirectRegistry();

  let httpIssues: Awaited<ReturnType<typeof auditLinksHttp>> = [];
  const base = process.env.LINK_HEALTH_BASE?.replace(/\/$/, "");
  if (base) {
    const hubs = buildSitemapRegistry()
      .filter((e) => e.kind === "hub")
      .slice(0, 40)
      .map((e) => e.path);
    httpIssues = await auditLinksHttp({ baseUrl: base, samplePaths: hubs });
  }

  const report = {
    ...buildLinkHealthReport(staticIssues, httpIssues),
    redirectRegistry: redirects,
  };

  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "link-health.json"),
    JSON.stringify(report, null, 2),
  );

  console.log(
    `Link health: ${report.summary.staticCount} static, ${report.summary.httpCount} HTTP issues`,
  );
  console.log(
    `Redirect registry: ${redirects.chains.length} chains, ${redirects.loops.length} loops`,
  );
  console.log("Wrote reports/link-health.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
