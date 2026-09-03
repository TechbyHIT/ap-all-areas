/**
 * §84 Nearby location system — real geographic adjacency only.
 */

import { ROUTES } from "@/config/routes";
import { STATE_SLUG } from "@/config/geo";
import { getCity, listFactAreas, listEnabledCities } from "@/lib/data/location-catalog";

/**
 * Curated AP adjacency (neighbouring / strongly connected districts).
 * Do not invent SEO “nearby” lists.
 */
export const CITY_GEOGRAPHIC_NEIGHBORS: Record<string, readonly string[]> = {
  visakhapatnam: ["vizianagaram", "anakapalle", "srikakulam"],
  vizianagaram: ["visakhapatnam", "srikakulam"],
  srikakulam: ["vizianagaram", "visakhapatnam"],
  anakapalle: ["visakhapatnam"],
  vijayawada: ["guntur", "eluru", "machilipatnam"],
  guntur: ["vijayawada", "ongole", "narasaraopet"],
  eluru: ["vijayawada", "rajahmundry"],
  rajahmundry: ["kakinada", "eluru"],
  rajamahendravaram: ["kakinada", "eluru"],
  kakinada: ["rajamahendravaram"],
  nellore: ["tirupati", "ongole"],
  tirupati: ["nellore", "chittoor"],
  kurnool: ["anantapur", "nandyal"],
  anantapur: ["kurnool"],
};

export type NearbyLink = {
  href: string;
  label: string;
  relation: "nearby-city" | "nearby-locality" | "service-hub";
};

export function nearbyCitiesFor(citySlug: string): NearbyLink[] {
  const neighbors = CITY_GEOGRAPHIC_NEIGHBORS[citySlug] ?? [];
  const enabled = new Set(listEnabledCities().map((c) => c.slug));

  return neighbors
    .filter((slug) => enabled.has(slug) || getCity(STATE_SLUG, slug))
    .map((slug) => {
      const city = getCity(STATE_SLUG, slug);
      return {
        href: ROUTES.location(slug),
        label: city?.name ?? slug,
        relation: "nearby-city" as const,
      };
    });
}

export function nearbyLocalitiesFor(
  citySlug: string,
  areaSlug: string,
  limit = 6,
): NearbyLink[] {
  return listFactAreas(citySlug)
    .filter((a) => a.slug !== areaSlug)
    .slice(0, limit)
    .map((a) => ({
      href: ROUTES.area(citySlug, a.slug),
      label: a.name,
      relation: "nearby-locality" as const,
    }));
}

export function serviceHubLinksForCity(citySlug: string): NearbyLink[] {
  return [
    {
      href: ROUTES.services,
      label: "All services",
      relation: "service-hub",
    },
    {
      href: ROUTES.location(citySlug),
      label: "City service hub",
      relation: "service-hub",
    },
  ];
}
