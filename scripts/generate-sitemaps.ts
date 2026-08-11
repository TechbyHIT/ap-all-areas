/**
 * DB eligibility summary for publishing workflows.
 *
 * NOTE: This does NOT emit the live XML sitemap search engines crawl.
 * Production discovery is App Router `src/app/sitemap.ts` fed by
 * `src/lib/seo/sitemap-registry.ts`. Use `npm run seo:validate-sitemap`.
 *
 * Output: reports/sitemap-summary.json
 */
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { prisma } from "../src/lib/prisma";
import { SITE_CONFIG } from "../src/config/site";
import { SEO_CONFIG } from "../src/config/seo";

const MAX = SEO_CONFIG.sitemapMaxUrls;

async function main() {
  const pages = await prisma.page.findMany({
    where: {
      publicationStatus: "published",
      allowIndexing: true,
      qualityScore: { gte: SEO_CONFIG.qualityThreshold },
      contentReviewed: true,
      hasValidCanonical: true,
    },
    select: {
      path: true,
      sitemapGroup: true,
      lastContentChangeAt: true,
      updatedAt: true,
      crawlPriority: true,
    },
    take: MAX * 20,
    orderBy: { updatedAt: "desc" },
  });

  const groups = new Map<string, typeof pages>();
  for (const page of pages) {
    const group = page.sitemapGroup ?? "core-1";
    const list = groups.get(group) ?? [];
    list.push(page);
    groups.set(group, list);
  }

  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });

  const summary = {
    siteUrl: SITE_CONFIG.url,
    totalEligible: pages.length,
    groups: Object.fromEntries(
      [...groups.entries()].map(([group, items]) => [
        group,
        {
          count: items.length,
          files: Math.ceil(items.length / MAX),
        },
      ]),
    ),
    generatedAt: new Date().toISOString(),
  };

  writeFileSync(
    path.join(dir, "sitemap-summary.json"),
    JSON.stringify(summary, null, 2),
  );
  console.log(`Sitemap summary: ${pages.length} eligible URLs across ${groups.size} groups`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
