import type { MetadataRoute } from "next";
import {
  SITEMAP_ALL_CURATED_AREA_SERVICES,
  SITEMAP_KEYWORD_AREA_PRIORITY_MAX,
  SITEMAP_KEYWORD_CITY_PRIORITY_MAX,
  SITEMAP_SCALE_P0_URL_LIMIT,
} from "@/config/programmatic-scale";
import { SEO_CONFIG } from "@/config/seo";
import { P0_MONEY_CITY_SLUGS } from "@/data/city-local-profiles";
import { listAreaMoneyLandings } from "@/data/landings";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { KEYWORD_INTENTS } from "@/data/keyword-intents";
import { PLACEHOLDER_BLOG_POSTS } from "@/data/placeholder-content";
import { PROBLEMS } from "@/data/problems";
import { PROPERTY_TYPES } from "@/data/property-types";
import { ROUTES } from "@/config/routes";
import { matchServiceInCityPrettyPath } from "@/lib/routing/pretty-money-urls";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { getIndexableScaleLocalitySlugSet } from "@/lib/seo/keyword-geo-indexability";
import {
  listCuratedAreaServiceUrls,
  listKeywordCityUrls,
  pathKeywordInGeo,
} from "@/lib/seo/url-matrix";

/** Keep each sitemap file under Search Console / config limits. */
export const SITEMAP_CHUNK_SIZE = Math.min(
  SEO_CONFIG.sitemapMaxUrls ?? 10000,
  9000,
);

export type SitemapRegistryEntry = MetadataRoute.Sitemap[number] & {
  /** Relative path with trailing slash (for validators / tests). */
  path: string;
  /** Hub vs money — used for stratified HTTP sampling. */
  kind: "hub" | "money";
};

type ChangeFrequency = SitemapRegistryEntry["changeFrequency"];

const P0_CITY_SET = new Set<string>(P0_MONEY_CITY_SLUGS);

function revisionDate(): Date {
  return new Date(`${SEO_CONFIG.sitemapContentRevision}T00:00:00.000Z`);
}

function makeEntry(
  path: string,
  priority: number,
  options?: {
    changeFrequency?: ChangeFrequency;
    lastModified?: Date;
    kind?: "hub" | "money";
  },
): SitemapRegistryEntry {
  const normalized = path.endsWith("/") ? path : `${path}/`;
  return {
    path: normalized,
    url: buildCanonicalUrl(normalized),
    lastModified: options?.lastModified ?? revisionDate(),
    changeFrequency: options?.changeFrequency ?? "weekly",
    priority,
    kind: options?.kind ?? "money",
  };
}

/** True when `/{service}-in-{city}/` would 308 to `/{city}/{service}/`. */
export function isSitemapRedirectPath(path: string): boolean {
  return matchServiceInCityPrettyPath(path) !== null;
}

function buildHubEntries(): SitemapRegistryEntry[] {
  const corePaths: Array<{ path: string; priority: number; freq?: ChangeFrequency }> =
    [
      { path: "/", priority: 1, freq: "daily" },
      { path: "/about/", priority: 0.7 },
      { path: "/contact/", priority: 0.7 },
      { path: "/services/", priority: 0.75 },
      { path: "/locations/", priority: 0.75 },
      { path: "/solutions/", priority: 0.7 },
      { path: "/property-types/", priority: 0.7 },
      { path: "/guides/", priority: 0.65 },
      { path: "/blog/", priority: 0.65 },
      { path: "/faq/", priority: 0.7 },
      { path: "/gallery/", priority: 0.65 },
      { path: "/projects/", priority: 0.65 },
      { path: "/testimonials/", priority: 0.6 },
      { path: "/pricing-guide/", priority: 0.7 },
      { path: "/materials-guide/", priority: 0.7 },
      { path: "/installation-process/", priority: 0.7 },
      { path: "/safety-guide/", priority: 0.7 },
      { path: "/privacy-policy/", priority: 0.3 },
      { path: "/terms-and-conditions/", priority: 0.3 },
      { path: "/disclaimer/", priority: 0.3 },
    ];

  const entries: SitemapRegistryEntry[] = corePaths.map((row) =>
    makeEntry(row.path, row.priority, {
      changeFrequency: row.freq ?? "weekly",
      kind: "hub",
    }),
  );

  for (const service of INITIAL_SERVICES) {
    if (!service.allowIndexing) continue;
    entries.push(
      makeEntry(`/services/${service.slug}/`, 0.85, { kind: "hub" }),
    );
  }

  for (const post of PLACEHOLDER_BLOG_POSTS) {
    entries.push(
      makeEntry(`/blog/${post.slug}/`, 0.65, {
        kind: "hub",
        lastModified: new Date(`${post.publishedAt}T00:00:00.000Z`),
      }),
    );
  }

  for (const problem of PROBLEMS) {
    if (problem.publicationStatus !== "published" || !problem.allowIndexing) {
      continue;
    }
    entries.push(
      makeEntry(ROUTES.solution(problem.slug), 0.68, { kind: "hub" }),
    );
  }

  for (const propertyType of PROPERTY_TYPES) {
    if (
      propertyType.publicationStatus !== "published" ||
      !propertyType.allowIndexing
    ) {
      continue;
    }
    for (const serviceSlug of propertyType.suitableServices) {
      entries.push(
        makeEntry(
          ROUTES.propertyTypeService(propertyType.slug, serviceSlug),
          0.66,
          { kind: "hub" },
        ),
      );
    }
  }

  return entries;
}

function buildLocationMoneyEntries(): SitemapRegistryEntry[] {
  const entries: SitemapRegistryEntry[] = [];

  for (const city of HIGH_PRIORITY_CITY_AREAS) {
    const cityIndexable = P0_CITY_SET.has(city.citySlug);
    if (!cityIndexable) continue;

    entries.push(
      makeEntry(`/locations/${city.citySlug}/`, 0.75, { kind: "hub" }),
    );

    for (const service of INITIAL_SERVICES) {
      if (!service.allowIndexing) continue;
      entries.push(
        makeEntry(`/${city.citySlug}/${service.slug}/`, 0.8, { kind: "money" }),
      );
    }

    for (const area of city.areas) {
      entries.push(
        makeEntry(`/locations/${city.citySlug}/${area.slug}/`, 0.6, {
          kind: "money",
        }),
      );
    }
  }

  for (const landing of listAreaMoneyLandings()) {
    entries.push(makeEntry(landing.slugPath, 0.78, { kind: "money" }));
  }

  return entries;
}

function buildAreaServiceEntries(): SitemapRegistryEntry[] {
  if (!SITEMAP_ALL_CURATED_AREA_SERVICES) return [];
  return listCuratedAreaServiceUrls()
    .filter((row) => row.citySlug && P0_CITY_SET.has(row.citySlug))
    .map((row) => makeEntry(row.path, 0.72, { kind: "money" }));
}

function buildKeywordCityEntries(): SitemapRegistryEntry[] {
  return listKeywordCityUrls(SITEMAP_KEYWORD_CITY_PRIORITY_MAX)
    .filter((row) => !isSitemapRedirectPath(row.path))
    .map((row) =>
      makeEntry(row.path, row.indexCandidate ? 0.74 : 0.55, { kind: "money" }),
    );
}

function buildKeywordAreaEntries(): SitemapRegistryEntry[] {
  const keywords = KEYWORD_INTENTS.filter(
    (k) => k.priority <= SITEMAP_KEYWORD_AREA_PRIORITY_MAX,
  );
  const entries: SitemapRegistryEntry[] = [];

  for (const city of HIGH_PRIORITY_CITY_AREAS) {
    if (!P0_CITY_SET.has(city.citySlug)) continue;
    for (const area of city.areas) {
      for (const keyword of keywords) {
        const path = pathKeywordInGeo(keyword.slug, area.slug);
        if (isSitemapRedirectPath(path)) continue;
        entries.push(
          makeEntry(path, keyword.priority === 0 ? 0.68 : 0.58, {
            kind: "money",
          }),
        );
      }
    }
  }

  return entries;
}

/** P0 keyword × scale localities (capped, indexable). */
function buildKeywordScaleEntries(): SitemapRegistryEntry[] {
  const p0Keywords = KEYWORD_INTENTS.filter((k) => k.priority === 0);
  if (p0Keywords.length === 0 || SITEMAP_SCALE_P0_URL_LIMIT <= 0) return [];

  const localitySlugs = [...getIndexableScaleLocalitySlugSet()];
  const entries: SitemapRegistryEntry[] = [];

  for (const geoSlug of localitySlugs) {
    for (const keyword of p0Keywords) {
      if (entries.length >= SITEMAP_SCALE_P0_URL_LIMIT) {
        return entries;
      }
      const path = pathKeywordInGeo(keyword.slug, geoSlug);
      if (isSitemapRedirectPath(path)) continue;
      entries.push(makeEntry(path, 0.52, { kind: "money" }));
    }
  }

  return entries;
}

/** Deduplicate by absolute URL; first wins. */
export function dedupeSitemapEntries(
  entries: SitemapRegistryEntry[],
): SitemapRegistryEntry[] {
  const seen = new Set<string>();
  const out: SitemapRegistryEntry[] = [];
  for (const entry of entries) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    out.push(entry);
  }
  return out;
}

/** Full flat list of indexable, non-redirect sitemap URLs. */
export function buildSitemapRegistry(): SitemapRegistryEntry[] {
  const raw = [
    ...buildHubEntries(),
    ...buildLocationMoneyEntries(),
    ...buildAreaServiceEntries(),
    ...buildKeywordCityEntries(),
    ...buildKeywordAreaEntries(),
    ...buildKeywordScaleEntries(),
  ];

  return dedupeSitemapEntries(raw).filter(
    (entry) =>
      !isSitemapRedirectPath(entry.path) &&
      entry.url.startsWith("https://") &&
      entry.path.endsWith("/"),
  );
}

export function chunkSitemapEntries<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out.length > 0 ? out : [[]];
}

/** Partitioned sitemap files for Next `generateSitemaps` (optional). */
export function buildSitemapChunks(
  chunkSize: number = SITEMAP_CHUNK_SIZE,
): SitemapRegistryEntry[][] {
  return chunkSitemapEntries(buildSitemapRegistry(), chunkSize);
}

/**
 * Manual sitemap-index XML (use with route handlers if / when multiple files
 * are required). Next.js `generateSitemaps()` alone may 404 `/sitemap.xml`.
 */
export function buildSitemapIndexXml(baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const chunks = buildSitemapChunks();
  const now = new Date().toISOString();
  const body = chunks
    .map((_, id) => {
      return `  <sitemap>
    <loc>${base}/sitemap/${id}.xml</loc>
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

export function buildUrlsetXml(entries: SitemapRegistryEntry[]): string {
  const body = entries
    .map((entry) => {
      const lastmod =
        entry.lastModified instanceof Date
          ? entry.lastModified.toISOString()
          : new Date(entry.lastModified ?? Date.now()).toISOString();
      const changefreq = entry.changeFrequency
        ? `\n    <changefreq>${entry.changeFrequency}</changefreq>`
        : "";
      const priority =
        typeof entry.priority === "number"
          ? `\n    <priority>${entry.priority.toFixed(1)}</priority>`
          : "";
      return `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${lastmod}</lastmod>${changefreq}${priority}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

/** Strip registry-only fields for MetadataRoute.Sitemap. */
export function toMetadataSitemap(
  entries: SitemapRegistryEntry[],
): MetadataRoute.Sitemap {
  return entries.map(({ url, lastModified, changeFrequency, priority }) => ({
    url,
    lastModified,
    changeFrequency,
    priority,
  }));
}
