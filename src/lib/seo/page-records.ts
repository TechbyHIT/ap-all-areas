/**
 * SEO metadata records for a future dashboard.
 * Derived from the sitemap registry + page decision engine (no invented metrics).
 */

import { STATE_SLUG } from "@/config/geo";
import { ROUTES } from "@/config/routes";
import { INITIAL_SERVICE_MAP } from "@/data/initial-services";
import { getArea, getCity } from "@/lib/data/location-catalog";
import { uniqueLocalPageScore } from "@/lib/seo/seo-score";
import {
  buildSitemapRegistry,
  listSitemapFiles,
  type SitemapRegistryEntry,
} from "@/lib/seo/sitemap-registry";
import { shouldGeneratePage, type SeoPageKind } from "@/lib/seo/page-decision";

export type SeoPageRecord = {
  url: string;
  path: string;
  pageType: SeoPageKind | "hub";
  state: string | null;
  city: string | null;
  area: string | null;
  service: string | null;
  primaryKeyword: string | null;
  searchIntent: "informational" | "commercial" | "navigational";
  canonical: string;
  indexable: boolean;
  sitemap: string;
  parentUrl: string | null;
  inboundLinks: number;
  outboundInternalLinks: number;
  lastUpdated: string;
  seoScore: number;
};

function classify(path: string): {
  pageType: SeoPageRecord["pageType"];
  state: string | null;
  city: string | null;
  area: string | null;
  service: string | null;
  primaryKeyword: string | null;
  searchIntent: SeoPageRecord["searchIntent"];
  parentUrl: string | null;
} {
  const silo = path.match(
    /^\/locations\/andhra-pradesh\/([a-z0-9-]+)\/([a-z0-9-]+)\/([a-z0-9-]+)\/$/,
  );
  if (silo) {
    const city = getCity(STATE_SLUG, silo[1]);
    const maybeService = INITIAL_SERVICE_MAP[silo[3]];
    if (city && maybeService) {
      const area = getArea(STATE_SLUG, silo[1], silo[2]);
      return {
        pageType: "area-service",
        state: STATE_SLUG,
        city: silo[1],
        area: silo[2],
        service: silo[3],
        primaryKeyword: `${maybeService.name} in ${area?.name ?? silo[2]}`,
        searchIntent: "commercial",
        parentUrl: ROUTES.area(silo[1], silo[2]),
      };
    }
  }

  const cityChild = path.match(
    /^\/locations\/andhra-pradesh\/([a-z0-9-]+)\/([a-z0-9-]+)\/$/,
  );
  if (cityChild) {
    const service = INITIAL_SERVICE_MAP[cityChild[2]];
    if (service) {
      const city = getCity(STATE_SLUG, cityChild[1]);
      return {
        pageType: "city-service",
        state: STATE_SLUG,
        city: cityChild[1],
        area: null,
        service: cityChild[2],
        primaryKeyword: `${service.name} in ${city?.name ?? cityChild[1]}`,
        searchIntent: "commercial",
        parentUrl: ROUTES.location(cityChild[1]),
      };
    }
    return {
      pageType: "area",
      state: STATE_SLUG,
      city: cityChild[1],
      area: cityChild[2],
      service: null,
      primaryKeyword: `${cityChild[2]} ${getCity(STATE_SLUG, cityChild[1])?.name ?? ""}`.trim(),
      searchIntent: "commercial",
      parentUrl: ROUTES.location(cityChild[1]),
    };
  }

  const cityOnly = path.match(/^\/locations\/andhra-pradesh\/([a-z0-9-]+)\/$/);
  if (cityOnly && cityOnly[1] !== "") {
    const city = getCity(STATE_SLUG, cityOnly[1]);
    return {
      pageType: city ? "city" : "state",
      state: STATE_SLUG,
      city: city ? cityOnly[1] : null,
      area: null,
      service: null,
      primaryKeyword: city ? `safety nets in ${city.name}` : "Andhra Pradesh installation",
      searchIntent: city ? "commercial" : "navigational",
      parentUrl: city ? ROUTES.state : ROUTES.locations,
    };
  }

  const service = path.match(/^\/services\/([a-z0-9-]+)\/$/);
  if (service) {
    return {
      pageType: "service",
      state: null,
      city: null,
      area: null,
      service: service[1],
      primaryKeyword: INITIAL_SERVICE_MAP[service[1]]?.name ?? service[1],
      searchIntent: "commercial",
      parentUrl: ROUTES.services,
    };
  }

  return {
    pageType: "hub",
    state: path.startsWith("/locations/") ? STATE_SLUG : null,
    city: null,
    area: null,
    service: null,
    primaryKeyword: null,
    searchIntent: path.startsWith("/guides/") ? "informational" : "navigational",
    parentUrl: path === "/" ? null : ROUTES.home,
  };
}

function sitemapFileForPath(path: string): string {
  for (const file of listSitemapFiles()) {
    if (file.entries.some((entry) => entry.path === path)) return file.name;
  }
  return "unlisted";
}

function recordFromEntry(entry: SitemapRegistryEntry): SeoPageRecord {
  const classified = classify(entry.path);
  const decision =
    classified.pageType === "hub"
      ? { index: true }
      : shouldGeneratePage({
          kind: classified.pageType,
          stateSlug: classified.state ?? STATE_SLUG,
          citySlug: classified.city ?? undefined,
          areaSlug: classified.area ?? undefined,
          serviceSlug: classified.service ?? undefined,
        });

  const score = uniqueLocalPageScore({
    hasCityProfile:
      classified.pageType === "hub" ||
      classified.pageType === "state" ||
      classified.pageType === "service" ||
      classified.pageType === "city" ||
      classified.pageType === "city-service" ||
      Boolean(classified.city && getCity(STATE_SLUG, classified.city)?.indexable),
    hasLocalFacts: Boolean(
      classified.city &&
        classified.area &&
        getArea(STATE_SLUG, classified.city, classified.area)?.indexable,
    ),
  });

  return {
    url: entry.url,
    path: entry.path,
    pageType: classified.pageType,
    state: classified.state,
    city: classified.city,
    area: classified.area,
    service: classified.service,
    primaryKeyword: classified.primaryKeyword,
    searchIntent: classified.searchIntent,
    canonical: entry.url,
    indexable: decision.index,
    sitemap: sitemapFileForPath(entry.path),
    parentUrl: classified.parentUrl,
    inboundLinks: classified.parentUrl ? 1 : 0,
    outboundInternalLinks: 4,
    lastUpdated:
      entry.lastModified instanceof Date
        ? entry.lastModified.toISOString()
        : new Date().toISOString(),
    seoScore: score.total,
  };
}

export function buildSeoPageRecords(): SeoPageRecord[] {
  return buildSitemapRegistry().map(recordFromEntry);
}
