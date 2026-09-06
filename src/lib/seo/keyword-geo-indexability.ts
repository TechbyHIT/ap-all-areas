import { listScaleLocalities } from "@/data/ap-locality-expansion";

let cachedScaleSlugSet: Set<string> | null = null;

/** Every scale-locality slug that owns a `/{keyword}-in-{geo}/` page. */
export function getIndexableScaleLocalitySlugSet(): Set<string> {
  if (cachedScaleSlugSet) return cachedScaleSlugSet;
  cachedScaleSlugSet = new Set(listScaleLocalities().map((loc) => loc.slug));
  return cachedScaleSlugSet;
}

/** Scale locality keyword pages are indexable — they are listed in the sitemap. */
export function isScaleLocalityIndexable(geoSlug: string): boolean {
  return getIndexableScaleLocalitySlugSet().has(geoSlug);
}
