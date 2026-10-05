import type { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/config/seo";
import { P0_MONEY_CITY_SLUGS } from "@/data/city-local-profiles";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { INSTALLATION_PHOTOS } from "@/config/installation-photos";
import { matchLegacySiloRedirect } from "@/lib/routing/location-silo";
import { buildCanonicalUrl, buildFileUrl } from "@/lib/routing/paths";
import { listKeywordSitemapFileNames } from "@/lib/seo/sitemap-scale";
import {
  listIndexableSeoPages,
  type SeoMatrixKind,
} from "@/lib/seo/seo-page-matrix";

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

export type SitemapFileName =
  | "core"
  | "services"
  | "city-services"
  | "societies"
  | "images"
  | "areas"
  | "area-services";

export type SitemapFile = {
  name: string;
  entries: SitemapRegistryEntry[];
};

type ChangeFrequency = SitemapRegistryEntry["changeFrequency"];

const P0_CITY_SET = new Set<string>(P0_MONEY_CITY_SLUGS);

function parseIsoDay(value: string): Date {
  const day = value.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? "1970-01-01";
  const date = new Date(`${day}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return new Date("1970-01-01T00:00:00.000Z");
  }
  return date;
}

function revisionDate(): Date {
  return parseIsoDay(SEO_CONFIG.sitemapContentRevision);
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

/** True when the path 308s to a different canonical (must not appear in sitemaps). */
export function isSitemapRedirectPath(path: string): boolean {
  const keywordCity = path.match(/^\/([a-z0-9-]+)-in-([a-z0-9-]+)\/?$/);
  if (keywordCity && P0_CITY_SET.has(keywordCity[2])) {
    const isCoreService = INITIAL_SERVICES.some(
      (service) => service.slug === keywordCity[1],
    );
    if (isCoreService) return true;
  }
  return matchLegacySiloRedirect(path) !== null;
}

const HUB_KINDS = new Set<SeoMatrixKind>([
  "home",
  "static",
  "state",
  "city",
  "service",
  "sub-service",
  "service-family",
  "solution",
  "guide",
  "blog",
  "project",
  "comparison",
  "property-type",
]);

function entriesForKinds(kinds: SeoMatrixKind[]): SitemapRegistryEntry[] {
  const allow = new Set<SeoMatrixKind>(kinds);
  return listIndexableSeoPages()
    .filter((page) => allow.has(page.kind))
    .map((page) =>
      makeEntry(page.path, page.priority, {
        changeFrequency: page.path === "/" ? "daily" : "weekly",
        kind: HUB_KINDS.has(page.kind) ? "hub" : "money",
      }),
    );
}

function buildServiceEntries(): SitemapRegistryEntry[] {
  return entriesForKinds(["static", "service", "sub-service", "service-family"]).filter(
    (entry) =>
      entry.path === "/services/" || entry.path.startsWith("/services/"),
  );
}

function buildCityServiceEntries(): SitemapRegistryEntry[] {
  return entriesForKinds(["city-service"]);
}

function buildAreaEntries(): SitemapRegistryEntry[] {
  return entriesForKinds(["area"]);
}

function buildAreaServiceEntries(): SitemapRegistryEntry[] {
  return entriesForKinds(["area-service"]);
}

function buildSocietyEntries(): SitemapRegistryEntry[] {
  return entriesForKinds(["static", "property-type"]).filter(
    (entry) =>
      entry.path === "/property-types/" ||
      entry.path.startsWith("/property-types/"),
  );
}

function buildCoreEntries(): SitemapRegistryEntry[] {
  return entriesForKinds([
    "home",
    "static",
    "state",
    "city",
    "solution",
    "guide",
    "blog",
    "project",
    "comparison",
  ]).filter((entry) => {
    if (entry.path === "/services/" || entry.path.startsWith("/services/")) {
      return false;
    }
    if (
      entry.path === "/property-types/" ||
      entry.path.startsWith("/property-types/")
    ) {
      return false;
    }
    return true;
  });
}

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Google image sitemap for real installation photos (no fake society URLs). */
export function buildImagesUrlsetXml(): string {
  const lastmod = revisionDate().toISOString();
  const loc = xmlEscape(buildCanonicalUrl("/gallery/"));
  const images = INSTALLATION_PHOTOS.map((photo) => {
    const imageLoc = xmlEscape(buildFileUrl(photo.src));
    const title = xmlEscape(photo.alt);
    return `    <image:image>
      <image:loc>${imageLoc}</image:loc>
      <image:title>${title}</image:title>
    </image:image>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
${images}
  </url>
</urlset>
`;
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

function isAllowedSitemapUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    if (parsed.search || parsed.hash) return false;
    const host = parsed.hostname.replace(/^www\./, "");
    return host === "hiranayaenterprises.in";
  } catch {
    return false;
  }
}

function finalize(entries: SitemapRegistryEntry[]): SitemapRegistryEntry[] {
  return dedupeSitemapEntries(entries).filter(
    (entry) =>
      !isSitemapRedirectPath(entry.path) &&
      isAllowedSitemapUrl(entry.url) &&
      entry.path.endsWith("/"),
  );
}

export function buildSitemapGroups(): Record<SitemapFileName, SitemapRegistryEntry[]> {
  return {
    core: finalize(buildCoreEntries()),
    services: finalize(buildServiceEntries()),
    "city-services": finalize(buildCityServiceEntries()),
    societies: finalize(buildSocietyEntries()),
    images: [],
    areas: finalize(buildAreaEntries()),
    "area-services": finalize(buildAreaServiceEntries()),
  };
}

function splitNamedGroup(
  baseName: string,
  entries: SitemapRegistryEntry[],
): SitemapFile[] {
  if (entries.length === 0) return [];
  if (entries.length <= SITEMAP_CHUNK_SIZE) {
    return [{ name: baseName, entries }];
  }
  const files: SitemapFile[] = [];
  for (let i = 0; i < entries.length; i += SITEMAP_CHUNK_SIZE) {
    const part = Math.floor(i / SITEMAP_CHUNK_SIZE) + 1;
    files.push({
      name: `${baseName}-${part}`,
      entries: entries.slice(i, i + SITEMAP_CHUNK_SIZE),
    });
  }
  return files;
}

/** Named urlsets listed in `/sitemap.xml` — same shape as a small sitemap index. */
const MAIN_INDEX_ORDER: SitemapFileName[] = [
  "core",
  "services",
  "city-services",
  "societies",
  "images",
  "areas",
  "area-services",
];

/** Core named sitemap files (hubs + silo money). Keyword scale files are lazy. */
export function listSitemapFiles(): SitemapFile[] {
  const groups = buildSitemapGroups();
  return MAIN_INDEX_ORDER.flatMap((name) =>
    name === "images" ? [] : splitNamedGroup(name, groups[name]),
  );
}

/**
 * Child names in `/sitemap.xml` — a small named index like core / services /
 * city-services / societies / images / areas / area-services.
 * Keyword × locality children are listed after the core money files.
 */
export function listSitemapIndexNames(): string[] {
  const groups = buildSitemapGroups();
  return [
    ...MAIN_INDEX_ORDER.flatMap((name) =>
      name === "images"
        ? ["images"]
        : splitNamedGroup(name, groups[name]).map((file) => file.name),
    ),
    ...listKeywordSitemapFileNames(),
  ];
}

export function getSitemapFile(name: string): SitemapFile | null {
  return listSitemapFiles().find((file) => file.name === name) ?? null;
}

/** Core indexable URLs listed from the master sitemap index. */
export function buildSitemapRegistry(): SitemapRegistryEntry[] {
  return listSitemapFiles().flatMap((file) => file.entries);
}

/** Core hub + silo money URLs (keyword matrix is lazy-chunked, not flattened). */
export function countAllSitemapUrls(): number {
  return buildSitemapRegistry().length;
}

export function chunkSitemapEntries<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out.length > 0 ? out : [[]];
}

/** One array per sitemap file (named groups, split if over the URL cap). */
export function buildSitemapChunks(): SitemapRegistryEntry[][] {
  const files = listSitemapFiles();
  return files.length > 0 ? files.map((file) => file.entries) : [[]];
}

/**
 * Child locs must return HTTP 200 XML with no redirect.
 * Use buildCanonicalUrl (keeps trailing slash). buildFileUrl strips slashes and
 * `/sitemaps/{name}` then 308s under trailingSlash:true — Search Console fails.
 */
export function sitemapChildLocPath(name: string): string {
  return `/sitemaps/${name}/`;
}

export function buildSitemapIndexXml(): string {
  const names = listSitemapIndexNames();
  const now = revisionDate().toISOString();
  const body = names
    .map((name) => {
      return `  <sitemap>
    <loc>${buildCanonicalUrl(sitemapChildLocPath(name))}</loc>
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
    .filter((entry) => isAllowedSitemapUrl(entry.url))
    .map((entry) => {
      const raw =
        entry.lastModified instanceof Date
          ? entry.lastModified
          : new Date(entry.lastModified ?? Date.now());
      const lastmod = Number.isNaN(raw.getTime())
        ? revisionDate().toISOString()
        : raw.toISOString();
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
