/**
 * Build-time SSG seed for money URLs.
 *
 * Millions of addressable URLs stay reachable through `dynamicParams` + ISR
 * (`revalidate`). Only this seed is written into `.next/standalone` as HTML.
 *
 * Why this exists: a sibling deployment prerendered ~145k pages at ~625 KB
 * each and filled 86 GB of a 200 GB disk. Sitemap and internal links still
 * discover the long tail; the first request builds + caches it.
 *
 * Override at build time:
 *   PRERENDER_CITY_LIMIT=3 PRERENDER_AREA_LIMIT=12 npm run build
 */

import { P0_MONEY_CITY_SLUGS } from "@/data/city-local-profiles";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** How many P0 cities get area×service / area-hub HTML at build time. */
export const PRERENDER_CITY_LIMIT = intEnv("PRERENDER_CITY_LIMIT", 2);

/** Areas per seeded city for area×service and area hubs. */
export const PRERENDER_AREA_LIMIT = intEnv("PRERENDER_AREA_LIMIT", 8);

/** P0 keywords × cities/areas for keyword landings. */
export const PRERENDER_KEYWORD_LIMIT = intEnv("PRERENDER_KEYWORD_LIMIT", 8);

export type PrerenderCity = (typeof HIGH_PRIORITY_CITY_AREAS)[number];

/**
 * Cities included in the SSG seed, in P0 order, truncated by
 * PRERENDER_CITY_LIMIT. Empty limit means no area×service seed (on-demand only).
 */
export function prerenderCities(): PrerenderCity[] {
  if (PRERENDER_CITY_LIMIT === 0) return [];
  const p0 = new Set<string>(P0_MONEY_CITY_SLUGS);
  const ordered = [
    ...HIGH_PRIORITY_CITY_AREAS.filter((c) => p0.has(c.citySlug)),
    ...HIGH_PRIORITY_CITY_AREAS.filter((c) => !p0.has(c.citySlug)),
  ];
  return ordered.slice(0, PRERENDER_CITY_LIMIT);
}

export function prerenderAreas(city: PrerenderCity) {
  if (PRERENDER_AREA_LIMIT === 0) return [];
  return city.areas.slice(0, PRERENDER_AREA_LIMIT);
}
