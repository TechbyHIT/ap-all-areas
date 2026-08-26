import {
  SITEMAP_SCALE_P0_URL_LIMIT,
} from "@/config/programmatic-scale";
import { listScaleLocalities } from "@/data/ap-locality-expansion";
import { KEYWORD_INTENTS } from "@/data/keyword-intents";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";

let cachedScaleSlugSet: Set<string> | null = null;

function p0KeywordCount(): number {
  return KEYWORD_INTENTS.filter((k) => k.priority === 0).length;
}

/**
 * Deterministic set of scale locality slugs eligible for indexing with P0
 * keywords. Sized so P0 × set ≤ SITEMAP_SCALE_P0_URL_LIMIT.
 */
export function getIndexableScaleLocalitySlugSet(): Set<string> {
  if (cachedScaleSlugSet) return cachedScaleSlugSet;

  const p0 = Math.max(1, p0KeywordCount());
  const localityBudget = Math.max(
    0,
    Math.floor(SITEMAP_SCALE_P0_URL_LIMIT / p0),
  );

  const curatedSlugs = new Set<string>();
  for (const city of HIGH_PRIORITY_CITY_AREAS) {
    curatedSlugs.add(city.citySlug);
    for (const area of city.areas) curatedSlugs.add(area.slug);
  }

  const set = new Set<string>();
  for (const loc of listScaleLocalities()) {
    if (curatedSlugs.has(loc.slug)) continue; // already covered as curated area/city
    set.add(loc.slug);
    if (set.size >= localityBudget) break;
  }

  cachedScaleSlugSet = set;
  return set;
}

/** Whether a scale locality may be indexed for a given keyword priority. */
export function isScaleLocalityIndexable(
  _geoSlug: string,
  _keywordPriority: number,
): boolean {
  return true;
}
