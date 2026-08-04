/**
 * Edge-safe pretty URL matchers for money landings.
 * Keep this file free of Prisma / Node-only imports.
 */

import { KEYWORD_SLUGS } from "@/data/keyword-intents";

/** Keep in sync with `src/data/landings/index.ts` area landings. */
const AREA_LANDING_KEYS = new Set([
  "invisible-grills/andhra-pradesh/visakhapatnam/gajuwaka",
]);

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
    canonicalPath: `/${citySlug}/${serviceSlug}/`,
  };
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
