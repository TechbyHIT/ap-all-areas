import type { MetadataRoute } from "next";
import { SITEMAP_ALL_CURATED_AREA_SERVICES } from "@/config/programmatic-scale";
import { SEO_CONFIG } from "@/config/seo";
import { listAreaMoneyLandings } from "@/data/landings";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { KEYWORD_INTENTS } from "@/data/keyword-intents";
import { PLACEHOLDER_BLOG_POSTS } from "@/data/placeholder-content";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import {
  listCuratedAreaServiceUrls,
  listKeywordCityUrls,
  pathKeywordInGeo,
} from "@/lib/seo/url-matrix";

/** Keep each sitemap file under Search Console / config limits. */
const CHUNK = Math.min(SEO_CONFIG.sitemapMaxUrls ?? 10000, 9000);

type Entry = MetadataRoute.Sitemap[number];

function entry(
  path: string,
  priority: number,
  changeFrequency: Entry["changeFrequency"] = "weekly",
): Entry {
  return {
    url: buildCanonicalUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

function buildCoreEntries(): Entry[] {
  const corePaths = [
    "/",
    "/about/",
    "/contact/",
    "/services/",
    "/locations/",
    "/solutions/",
    "/property-types/",
    "/guides/",
    "/blog/",
    "/faq/",
    "/gallery/",
    "/projects/",
    "/pricing-guide/",
    "/materials-guide/",
    "/installation-process/",
    "/safety-guide/",
  ];

  const entries: Entry[] = [
    ...corePaths.map((path) =>
      entry(path, path === "/" ? 1 : 0.7, path === "/" ? "daily" : "weekly"),
    ),
    ...INITIAL_SERVICES.map((service) =>
      entry(`/services/${service.slug}/`, 0.85),
    ),
    ...PLACEHOLDER_BLOG_POSTS.map((post) =>
      entry(`/blog/${post.slug}/`, 0.65),
    ),
  ];

  for (const city of HIGH_PRIORITY_CITY_AREAS) {
    entries.push(entry(`/locations/${city.citySlug}/`, 0.75));
    for (const service of INITIAL_SERVICES) {
      entries.push(entry(`/${city.citySlug}/${service.slug}/`, 0.8));
    }
    for (const area of city.areas) {
      entries.push(
        entry(`/locations/${city.citySlug}/${area.slug}/`, 0.6),
      );
    }
  }

  for (const landing of listAreaMoneyLandings()) {
    entries.push(entry(landing.slugPath, 0.78));
  }

  return entries;
}

function buildAreaServiceEntries(): Entry[] {
  if (!SITEMAP_ALL_CURATED_AREA_SERVICES) return [];
  return listCuratedAreaServiceUrls().map((row) => entry(row.path, 0.72));
}

function buildKeywordCityEntries(): Entry[] {
  return listKeywordCityUrls(1).map((row) =>
    entry(row.path, row.indexCandidate ? 0.74 : 0.55),
  );
}

function buildKeywordAreaEntries(): Entry[] {
  const p0Keywords = KEYWORD_INTENTS.filter((k) => k.priority === 0);
  const entries: Entry[] = [];
  for (const city of HIGH_PRIORITY_CITY_AREAS) {
    for (const area of city.areas) {
      for (const keyword of p0Keywords) {
        entries.push(
          entry(pathKeywordInGeo(keyword.slug, area.slug), 0.68),
        );
      }
    }
  }
  return entries;
}

function allChunks(): Entry[][] {
  const buckets = [
    buildCoreEntries(),
    buildAreaServiceEntries(),
    buildKeywordCityEntries(),
    ...chunkArray(buildKeywordAreaEntries(), CHUNK),
  ].filter((bucket) => bucket.length > 0);

  // Flatten oversized core/area buckets into CHUNK-sized files
  const chunks: Entry[][] = [];
  for (const bucket of buckets) {
    if (bucket.length <= CHUNK) {
      chunks.push(bucket);
    } else {
      chunks.push(...chunkArray(bucket, CHUNK));
    }
  }
  return chunks.length > 0 ? chunks : [[]];
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export async function generateSitemaps() {
  return allChunks().map((_, id) => ({ id }));
}

export default async function sitemap(props: {
  id: number | Promise<number>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const chunks = allChunks();
  return chunks[id] ?? [];
}
