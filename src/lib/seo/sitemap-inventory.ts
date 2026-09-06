/**
 * Indexable sitemap inventory — the totals Google is actually submitted.
 *
 * Core money files plus the keyword × locality matrix listed from /sitemap.xml.
 */

import { LOCATION_SERVICE_SLUGS } from "@/config/geo";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { P0_MONEY_CITY_SLUGS } from "@/data/city-local-profiles";
import { SUB_SERVICE_SLUGS } from "@/data/sub-services";
import { SERVICE_FAMILY_SLUGS } from "@/data/service-families";
import {
  buildSitemapGroups,
  countAllSitemapUrls,
  type SitemapFileName,
} from "@/lib/seo/sitemap-registry";
import { countKeywordLocalityUrls } from "@/lib/seo/sitemap-scale";

const P0_CITY_SET = new Set<string>(P0_MONEY_CITY_SLUGS);

export type SitemapInventory = {
  generatedAt: string;
  indexableTotal: number;
  byFile: Record<Exclude<SitemapFileName, "images">, number>;
  moneyGrid: {
    cities: number;
    areas: number;
    coreServices: number;
    subServices: number;
    /** Every service that owns a location URL — cores plus variations. */
    locationServices: number;
    serviceFamilies: number;
    cityServiceExpected: number;
    areaServiceExpected: number;
    cityServiceInSitemap: number;
    areaServiceInSitemap: number;
    completeCityServiceGrid: boolean;
    completeAreaServiceGrid: boolean;
    keywordLocalityUrls: number;
  };
};

export function buildSitemapInventory(): SitemapInventory {
  const groups = buildSitemapGroups();
  const cities = HIGH_PRIORITY_CITY_AREAS.filter((city) =>
    P0_CITY_SET.has(city.citySlug),
  );
  const areas = cities.reduce((n, city) => n + city.areas.length, 0);
  const coreServices = INITIAL_SERVICES.filter((s) => s.allowIndexing).length;
  const locationServices = LOCATION_SERVICE_SLUGS.length;

  return {
    generatedAt: new Date().toISOString(),
    indexableTotal: countAllSitemapUrls() + countKeywordLocalityUrls(),
    byFile: {
      core: groups.core.length,
      services: groups.services.length,
      "city-services": groups["city-services"].length,
      societies: groups.societies.length,
      areas: groups.areas.length,
      "area-services": groups["area-services"].length,
    },
    moneyGrid: {
      cities: cities.length,
      areas,
      coreServices,
      subServices: SUB_SERVICE_SLUGS.length,
      locationServices,
      serviceFamilies: SERVICE_FAMILY_SLUGS.length,
      cityServiceExpected: cities.length * locationServices,
      areaServiceExpected: areas * locationServices,
      cityServiceInSitemap: groups["city-services"].length,
      areaServiceInSitemap: groups["area-services"].length,
      completeCityServiceGrid:
        groups["city-services"].length === cities.length * locationServices,
      completeAreaServiceGrid:
        groups["area-services"].length === areas * locationServices,
      keywordLocalityUrls: countKeywordLocalityUrls(),
    },
  };
}
