import {
  KEYWORD_INTENTS,
  KEYWORD_INTENT_MAP,
  type KeywordIntent,
} from "@/data/keyword-intents";
import {
  listScaleLocalities,
  type ScaleLocality,
} from "@/data/ap-locality-expansion";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { INITIAL_SERVICES } from "@/data/initial-services";

export type MoneyUrl = {
  path: string;
  kind:
    | "city-service"
    | "area-service"
    | "keyword-city"
    | "keyword-locality";
  title: string;
  serviceSlug: string;
  citySlug?: string;
  areaSlug?: string;
  keywordSlug?: string;
  indexCandidate: boolean;
};

export function pathCityService(citySlug: string, serviceSlug: string): string {
  return `/${citySlug}/${serviceSlug}/`;
}

export function pathAreaService(
  citySlug: string,
  areaSlug: string,
  serviceSlug: string,
): string {
  return `/${citySlug}/${areaSlug}/${serviceSlug}/`;
}

export function pathKeywordInGeo(keywordSlug: string, geoSlug: string): string {
  return `/${keywordSlug}-in-${geoSlug}/`;
}

export function parseKeywordInGeoPath(
  pathname: string,
): { keyword: KeywordIntent; geoSlug: string } | null {
  const match = pathname.match(/^\/([a-z0-9-]+)-in-([a-z0-9-]+)\/?$/);
  if (!match) return null;
  const keyword = KEYWORD_INTENT_MAP[match[1]];
  if (!keyword) return null;
  return { keyword, geoSlug: match[2] };
}

export function listCuratedAreaServiceUrls(): MoneyUrl[] {
  const out: MoneyUrl[] = [];
  for (const city of HIGH_PRIORITY_CITY_AREAS) {
    for (const area of city.areas) {
      for (const service of INITIAL_SERVICES) {
        out.push({
          path: pathAreaService(city.citySlug, area.slug, service.slug),
          kind: "area-service",
          title: `${service.name} in ${area.name}, ${city.cityName}`,
          serviceSlug: service.slug,
          citySlug: city.citySlug,
          areaSlug: area.slug,
          indexCandidate: true,
        });
      }
    }
  }
  return out;
}

export function listKeywordCityUrls(priorityMax: 0 | 1 | 2 = 1): MoneyUrl[] {
  const out: MoneyUrl[] = [];
  for (const city of HIGH_PRIORITY_CITY_AREAS) {
    for (const keyword of KEYWORD_INTENTS) {
      if (keyword.priority > priorityMax) continue;
      out.push({
        path: pathKeywordInGeo(keyword.slug, city.citySlug),
        kind: "keyword-city",
        title: `${keyword.phrase} in ${city.cityName}`,
        serviceSlug: keyword.serviceSlug,
        citySlug: city.citySlug,
        keywordSlug: keyword.slug,
        indexCandidate: keyword.priority === 0,
      });
    }
  }
  return out;
}

export function listKeywordLocalityUrls(options?: {
  limit?: number;
  priorityMax?: 0 | 1 | 2;
  offset?: number;
}): MoneyUrl[] {
  const limit = options?.limit ?? 5000;
  const offset = options?.offset ?? 0;
  const priorityMax = options?.priorityMax ?? 2;
  const localities = listScaleLocalities();
  const out: MoneyUrl[] = [];
  let skipped = 0;

  for (const loc of localities) {
    for (const keyword of KEYWORD_INTENTS) {
      if (keyword.priority > priorityMax) continue;
      if (skipped < offset) {
        skipped++;
        continue;
      }
      if (out.length >= limit) return out;
      out.push({
        path: pathKeywordInGeo(keyword.slug, loc.slug),
        kind: "keyword-locality",
        title: `${keyword.phrase} in ${loc.name}`,
        serviceSlug: keyword.serviceSlug,
        citySlug: loc.routeCitySlug,
        areaSlug: loc.slug,
        keywordSlug: keyword.slug,
        indexCandidate: false,
      });
    }
  }
  return out;
}

export function findScaleLocality(slug: string): ScaleLocality | null {
  return listScaleLocalities().find((l) => l.slug === slug) ?? null;
}
