/**
 * Large-scale Andhra Pradesh keyword × locality sitemap slices.
 * Google limit: 50,000 URLs per urlset. Do not materialize the full 21L list.
 */

import { KEYWORD_INTENTS } from "@/data/keyword-intents";
import { listScaleLocalities } from "@/data/ap-locality-expansion";
import { buildCanonicalUrl, buildFileUrl } from "@/lib/routing/paths";
import { SEO_CONFIG } from "@/config/seo";

/** URLs per child sitemap. ~3k keeps Chrome from OOM; Google allows 50k. */
export const SCALE_SITEMAP_CHUNK = 3_000;

export const KEYWORD_SITEMAP_PREFIX = "andhra-pradesh-keywords";

function revisionDate(): Date {
  const day =
    SEO_CONFIG.sitemapContentRevision.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ??
    "1970-01-01";
  return new Date(`${day}T00:00:00.000Z`);
}

export function countKeywordLocalityUrls(): number {
  return listScaleLocalities().length * KEYWORD_INTENTS.length;
}

export function countKeywordSitemapFiles(): number {
  const total = countKeywordLocalityUrls();
  return total === 0 ? 0 : Math.ceil(total / SCALE_SITEMAP_CHUNK);
}

export function keywordSitemapFileName(part: number): string {
  return `${KEYWORD_SITEMAP_PREFIX}-${part}`;
}

export function parseKeywordSitemapPart(name: string): number | null {
  const match = name.match(new RegExp(`^${KEYWORD_SITEMAP_PREFIX}-(\\d+)$`));
  if (!match) return null;
  const part = Number.parseInt(match[1], 10);
  if (!Number.isFinite(part) || part < 1) return null;
  return part;
}

export function listKeywordSitemapFileNames(): string[] {
  const count = countKeywordSitemapFiles();
  return Array.from({ length: count }, (_, i) => keywordSitemapFileName(i + 1));
}

export function buildKeywordLocalityChunk(part: number): Array<{
  path: string;
  url: string;
  lastModified: Date;
  changeFrequency: "weekly";
  priority: number;
  kind: "money";
}> {
  const totalFiles = countKeywordSitemapFiles();
  if (part < 1 || part > totalFiles) return [];

  const localities = listScaleLocalities();
  const keywords = KEYWORD_INTENTS;
  const stride = keywords.length;
  const total = localities.length * stride;
  const offset = (part - 1) * SCALE_SITEMAP_CHUNK;
  const limit = Math.min(SCALE_SITEMAP_CHUNK, total - offset);
  const lastModified = revisionDate();
  const out: Array<{
    path: string;
    url: string;
    lastModified: Date;
    changeFrequency: "weekly";
    priority: number;
    kind: "money";
  }> = [];

  for (let i = 0; i < limit; i++) {
    const index = offset + i;
    const loc = localities[Math.floor(index / stride)];
    const keyword = keywords[index % stride];
    const path = `/${keyword.slug}-in-${loc.slug}/`;
    out.push({
      path,
      url: buildCanonicalUrl(path),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.5,
      kind: "money",
    });
  }

  return out;
}

/** Urlset XML for one keyword child — used by `/sitemaps/andhra-pradesh-keywords-N.xml`. */
export function buildKeywordLocalityUrlsetXml(part: number): string | null {
  const totalFiles = countKeywordSitemapFiles();
  if (part < 1 || part > totalFiles) return null;

  const localities = listScaleLocalities();
  const keywords = KEYWORD_INTENTS;
  const stride = keywords.length;
  const total = localities.length * stride;
  const offset = (part - 1) * SCALE_SITEMAP_CHUNK;
  const limit = Math.min(SCALE_SITEMAP_CHUNK, total - offset);
  const lastmod = revisionDate().toISOString();
  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ];

  for (let i = 0; i < limit; i++) {
    const index = offset + i;
    const loc = localities[Math.floor(index / stride)];
    const keyword = keywords[index % stride];
    const url = buildCanonicalUrl(`/${keyword.slug}-in-${loc.slug}/`);
    lines.push(`  <url>`);
    lines.push(`    <loc>${url}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push(`    <changefreq>weekly</changefreq>`);
    lines.push(`    <priority>0.5</priority>`);
    lines.push(`  </url>`);
  }

  lines.push(`</urlset>`);
  return `${lines.join("\n")}\n`;
}

export function buildKeywordSitemapIndexXml(): string {
  const names = listKeywordSitemapFileNames();
  const now = revisionDate().toISOString();
  const body = names
    .map((name) => {
      return `  <sitemap>
    <loc>${buildCanonicalUrl(`/sitemaps/${name}/`)}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}
