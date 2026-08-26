/**
 * Edge-safe pretty URL matchers for money landings.
 * Keep this file free of Prisma / Node-only imports.
 */

import { AREA_MONEY_LANDING_KEYS } from "@/config/geo";
import { KEYWORD_INTENT_MAP, KEYWORD_SLUGS } from "@/data/keyword-intents";

const AREA_LANDING_KEYS = new Set<string>(AREA_MONEY_LANDING_KEYS);

const SERVICE_SLUG_SET = new Set([
  "invisible-grills",
  "safety-nets",
  "sports-nets",
  "cloth-drying-hangers",
]);

const CITY_SLUG_SET = new Set([
  "visakhapatnam",
  "vijayawada",
  "guntur",
  "tirupati",
  "rajamahendravaram",
  "kakinada",
  "nellore",
  "kurnool",
  "anantapur",
]);

/** Derived from `src/data/keyword-intents.ts` — no manual slug sync. */
const KEYWORD_SLUG_SET = new Set(KEYWORD_SLUGS);

/** `/{keyword}-in-{geo}/` → keyword landing (areas, cities, scale localities) */
export function matchKeywordInGeoPrettyPath(
  pathname: string,
): {
  keywordSlug: string;
  geoSlug: string;
  rewritePath: string;
} | null {
  const match = pathname.match(/^\/([a-z0-9-]+)-in-([a-z0-9-]+)\/?$/);
  if (!match) return null;

  const keywordSlug = match[1];
  const geoSlug = match[2];
  if (!KEYWORD_SLUG_SET.has(keywordSlug)) return null;

  // Core service×city pretty URLs keep the existing city×service canonical.
  if (SERVICE_SLUG_SET.has(keywordSlug) && CITY_SLUG_SET.has(geoSlug)) {
    return null;
  }

  return {
    keywordSlug,
    geoSlug,
    rewritePath: `/landings/keyword/${keywordSlug}/in/${geoSlug}/`,
  };
}

/** `/{service}-in-{city}/` → canonical city×service path */
export function matchServiceInCityPrettyPath(
  pathname: string,
): { serviceSlug: string; citySlug: string; canonicalPath: string } | null {
  const match = pathname.match(/^\/([a-z0-9-]+)-in-([a-z0-9-]+)\/?$/);
  if (!match) return null;

  const serviceSlug = match[1];
  const citySlug = match[2];
  if (!SERVICE_SLUG_SET.has(serviceSlug) || !CITY_SLUG_SET.has(citySlug)) {
    return null;
  }

  return {
    serviceSlug,
    citySlug,
    canonicalPath: `/locations/andhra-pradesh/${citySlug}/${serviceSlug}/`,
  };
}

/**
 * Keyword × P0-city URLs that share intent with a city+service hub.
 * Consolidate to one canonical instead of competing doorway landings.
 */
export function matchKeywordCityConsolidatePath(
  pathname: string,
): string | null {
  const match = pathname.match(/^\/([a-z0-9-]+)-in-([a-z0-9-]+)\/?$/);
  if (!match) return null;

  const keywordSlug = match[1];
  const citySlug = match[2];
  if (!CITY_SLUG_SET.has(citySlug)) return null;

  if (SERVICE_SLUG_SET.has(keywordSlug)) {
    return `/locations/andhra-pradesh/${citySlug}/${keywordSlug}/`;
  }

  const keyword = KEYWORD_INTENT_MAP[keywordSlug];
  if (!keyword) return null;

  return `/locations/andhra-pradesh/${citySlug}/${keyword.serviceSlug}/`;
}

/** `/{service}/{state}/{city}/{area}/` → internal landings route */
export function matchAreaMoneyPrettyPath(
  pathname: string,
): {
  serviceSlug: string;
  stateSlug: string;
  citySlug: string;
  areaSlug: string;
  rewritePath: string;
} | null {
  const match = pathname.match(
    /^\/([a-z0-9-]+)\/([a-z0-9-]+)\/([a-z0-9-]+)\/([a-z0-9-]+)\/?$/,
  );
  if (!match) return null;

  const [, serviceSlug, stateSlug, citySlug, areaSlug] = match;
  const key = `${serviceSlug}/${stateSlug}/${citySlug}/${areaSlug}`;
  if (!AREA_LANDING_KEYS.has(key)) return null;

  return {
    serviceSlug,
    stateSlug,
    citySlug,
    areaSlug,
    rewritePath: `/landings/area/${serviceSlug}/${stateSlug}/${citySlug}/${areaSlug}/`,
  };
}
