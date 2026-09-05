import type { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/config/seo";
import { P0_MONEY_CITY_SLUGS } from "@/data/city-local-profiles";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { PLACEHOLDER_BLOG_POSTS } from "@/data/placeholder-content";
import { PROBLEMS } from "@/data/problems";
import { PROPERTY_TYPES } from "@/data/property-types";
import { SUB_SERVICE_SLUGS } from "@/data/sub-services";
import { SERVICE_FAMILY_SLUGS } from "@/data/service-families";
import { listPublishedProjects } from "@/data/projects";
import { SERVICE_COMPARISON_SLUGS } from "@/data/comparisons";
import { INSTALLATION_PHOTOS } from "@/config/installation-photos";
import { ROUTES } from "@/config/routes";
import { matchLegacySiloRedirect } from "@/lib/routing/location-silo";
import { STATE_SLUG } from "@/config/geo";
import { shouldGeneratePage } from "@/lib/seo/page-decision";
import { buildCanonicalUrl, buildFileUrl } from "@/lib/routing/paths";

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

function buildPageEntries(): SitemapRegistryEntry[] {
  const corePaths: Array<{ path: string; priority: number; freq?: ChangeFrequency }> =
    [
      { path: "/", priority: 1, freq: "daily" },
      { path: "/about/", priority: 0.7 },
      { path: "/contact/", priority: 0.7 },
      { path: "/solutions/", priority: 0.7 },
      { path: "/faq/", priority: 0.7 },
      { path: "/gallery/", priority: 0.65 },
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

  for (const problem of PROBLEMS) {
    if (problem.publicationStatus !== "published" || !problem.allowIndexing) {
      continue;
    }
    entries.push(
      makeEntry(ROUTES.solution(problem.slug), 0.68, { kind: "hub" }),
    );
  }

  return entries;
}

function buildServiceEntries(): SitemapRegistryEntry[] {
  const entries: SitemapRegistryEntry[] = [
    makeEntry("/services/", 0.75, { kind: "hub" }),
  ];

  for (const service of INITIAL_SERVICES) {
    if (!service.allowIndexing) continue;
    entries.push(
      makeEntry(`/services/${service.slug}/`, 0.85, { kind: "hub" }),
    );
  }

  for (const slug of SUB_SERVICE_SLUGS) {
    entries.push(makeEntry(`/services/${slug}/`, 0.78, { kind: "hub" }));
  }

  for (const slug of SERVICE_FAMILY_SLUGS) {
    entries.push(makeEntry(`/services/${slug}/`, 0.82, { kind: "hub" }));
  }

  return entries;
}

function buildGuideEntries(): SitemapRegistryEntry[] {
  const entries: SitemapRegistryEntry[] = [
    makeEntry("/guides/", 0.65, { kind: "hub" }),
  ];
  for (const slug of [
    "invisible-grills-buying-guide",
    "safety-nets-installation-guide",
    "choosing-cloth-drying-hangers",
  ]) {
    entries.push(makeEntry(`/guides/${slug}/`, 0.7, { kind: "hub" }));
  }
  return entries;
}

function buildLocationHubEntries(): SitemapRegistryEntry[] {
  return [makeEntry("/locations/", 0.75, { kind: "hub" })];
}

function buildBlogEntries(): SitemapRegistryEntry[] {
  const entries: SitemapRegistryEntry[] = [
    makeEntry("/blog/", 0.65, { kind: "hub" }),
  ];
  for (const post of PLACEHOLDER_BLOG_POSTS) {
    entries.push(
      makeEntry(`/blog/${post.slug}/`, 0.65, {
        kind: "hub",
        lastModified: parseIsoDay(post.publishedAt),
      }),
    );
  }
  return entries;
}

function buildProjectEntries(): SitemapRegistryEntry[] {
  const entries: SitemapRegistryEntry[] = [
    makeEntry("/projects/", 0.65, { kind: "hub" }),
  ];
  for (const project of listPublishedProjects()) {
    entries.push(makeEntry(`/projects/${project.slug}/`, 0.55, { kind: "hub" }));
  }
  return entries;
}

function buildComparisonEntries(): SitemapRegistryEntry[] {
  const entries: SitemapRegistryEntry[] = [
    makeEntry("/comparisons/", 0.7, { kind: "hub" }),
  ];
  for (const slug of SERVICE_COMPARISON_SLUGS) {
    entries.push(makeEntry(`/comparisons/${slug}/`, 0.72, { kind: "hub" }));
  }
  return entries;
}

function buildStateEntries(): SitemapRegistryEntry[] {
  return [makeEntry(ROUTES.state, 0.8, { kind: "hub" })];
}

function siloCities() {
  return HIGH_PRIORITY_CITY_AREAS.filter((city) => P0_CITY_SET.has(city.citySlug));
}

function buildCityEntries(): SitemapRegistryEntry[] {
  return siloCities()
    .filter((city) =>
      shouldGeneratePage({
        kind: "city",
        stateSlug: STATE_SLUG,
        citySlug: city.citySlug,
      }).generate,
    )
    .map((city) =>
      makeEntry(ROUTES.location(city.citySlug), 0.75, { kind: "hub" }),
    );
}

function buildAreaEntries(): SitemapRegistryEntry[] {
  const entries: SitemapRegistryEntry[] = [];
  for (const city of siloCities()) {
    for (const area of city.areas) {
      if (
        !shouldGeneratePage({
          kind: "area",
          stateSlug: STATE_SLUG,
          citySlug: city.citySlug,
          areaSlug: area.slug,
        }).generate
      ) {
        continue;
      }
      entries.push(
        makeEntry(ROUTES.area(city.citySlug, area.slug), 0.6, {
          kind: "money",
        }),
      );
    }
  }
  return entries;
}

function buildCityServiceEntries(): SitemapRegistryEntry[] {
  const entries: SitemapRegistryEntry[] = [];
  for (const city of siloCities()) {
    for (const service of INITIAL_SERVICES) {
      if (!service.allowIndexing) continue;
      if (
        !shouldGeneratePage({
          kind: "city-service",
          stateSlug: STATE_SLUG,
          citySlug: city.citySlug,
          serviceSlug: service.slug,
        }).generate
      ) {
        continue;
      }
      entries.push(
        makeEntry(ROUTES.cityService(city.citySlug, service.slug), 0.8, {
          kind: "money",
        }),
      );
    }
  }
  return entries;
}

function buildAreaServiceEntries(): SitemapRegistryEntry[] {
  const entries: SitemapRegistryEntry[] = [];
  for (const city of siloCities()) {
    for (const area of city.areas) {
      for (const service of INITIAL_SERVICES) {
        if (!service.allowIndexing) continue;
        if (
          !shouldGeneratePage({
            kind: "area-service",
            stateSlug: STATE_SLUG,
            citySlug: city.citySlug,
            areaSlug: area.slug,
            serviceSlug: service.slug,
          }).generate
        ) {
          continue;
        }
        entries.push(
          makeEntry(
            ROUTES.areaService(city.citySlug, area.slug, service.slug),
            0.72,
            { kind: "money" },
          ),
        );
      }
    }
  }
  return entries;
}

function buildSocietyEntries(): SitemapRegistryEntry[] {
  const entries: SitemapRegistryEntry[] = [
    makeEntry("/property-types/", 0.7, { kind: "hub" }),
  ];
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

function buildCoreEntries(): SitemapRegistryEntry[] {
  return [
    ...buildPageEntries(),
    ...buildLocationHubEntries(),
    ...buildStateEntries(),
    ...buildCityEntries(),
    ...buildBlogEntries(),
    ...buildProjectEntries(),
    ...buildComparisonEntries(),
    ...buildGuideEntries(),
  ];
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
 * Keyword expansion files are not listed here (not submitted to Search Console).
 */
export function listSitemapIndexNames(): string[] {
  const groups = buildSitemapGroups();
  return MAIN_INDEX_ORDER.flatMap((name) =>
    name === "images"
      ? ["images"]
      : splitNamedGroup(name, groups[name]).map((file) => file.name),
  );
}

export function getSitemapFile(name: string): SitemapFile | null {
  return listSitemapFiles().find((file) => file.name === name) ?? null;
}

/** Core indexable URLs listed from the master sitemap index. */
export function buildSitemapRegistry(): SitemapRegistryEntry[] {
  return listSitemapFiles().flatMap((file) => file.entries);
}

/** URL count Google discovers from `/sitemap.xml` children (excludes keyword matrix). */
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
