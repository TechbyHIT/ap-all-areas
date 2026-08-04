/**
 * Expanded Andhra Pradesh locality graph for programmatic SEO scale.
 * Builds locality children from district places × common residential labels.
 * Seed flags remain draft / noindex until unique content + QA pass.
 */

import { AP_DISTRICTS, HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { slugify } from "@/lib/routing/paths";

export type ScaleLocality = {
  slug: string;
  name: string;
  citySlug: string;
  cityName: string;
  districtSlug: string;
  /** Hub city used for routing when place is a town */
  routeCitySlug: string;
};

/** Common AP residential / commercial locality labels (combinatorial expansion). */
const LOCALITY_LABELS = [
  "RTC Colony",
  "Teachers Colony",
  "Bank Colony",
  "Housing Board Colony",
  "Sai Nagar",
  "Srinivasa Nagar",
  "Balaji Nagar",
  "Lakshmi Nagar",
  "Venkatrai Nagar",
  "Gandhi Nagar",
  "Nehru Nagar",
  "Indira Nagar",
  "Rajiv Nagar",
  "Ambedkar Nagar",
  "Vidya Nagar",
  "Shanti Nagar",
  "New Colony",
  "Old Town",
  "Market Area",
  "Bus Stand Area",
  "Railway Station Road",
  "Temple Street",
  "Main Road",
  "Ring Road",
  "Bypass Road",
  "Industrial Estate",
  "Auto Nagar",
  "Collectorate Road",
  "Hospital Road",
  "College Road",
  "Park Road",
  "Church Road",
  "Mosque Street",
  "Fort Area",
  "Port Area",
  "Beach Road Extension",
  "Hill View Colony",
  "Lake View Colony",
  "Green Park",
  "Rose Garden",
  "Surya Nagar",
  "Chandra Nagar",
  "Krishna Nagar",
  "Godavari Colony",
  "Tungabhadra Colony",
  "Phase 1",
  "Phase 2",
  "Phase 3",
  "Sector 1",
  "Sector 2",
  "Ward 1",
  "Ward 2",
  "Municipal Colony",
  "Police Quarters",
  "Revenue Colony",
  "Engineers Colony",
  "Doctors Colony",
  "Advocate Colony",
  "Postal Colony",
  "Telecom Nagar",
  "IT Park Side",
  "SEZ Approach",
  "NH Corridor",
  "Junction Area",
  "Cross Roads",
  "Pedda Veedhi",
  "Chinna Veedhi",
  "Agraharam",
  "Peta",
  "Palem",
  "Layout",
  "Enclave",
  "Residency",
  "Township",
  "Gated Community Belt",
  "Apartment Corridor",
  "Villa Plots",
  "Farm House Belt",
] as const;

function placeRouteCity(placeSlug: string, districtSlug: string): string {
  const priority = HIGH_PRIORITY_CITY_AREAS.find((c) => c.citySlug === placeSlug);
  if (priority) return placeSlug;
  const districtHub = HIGH_PRIORITY_CITY_AREAS.find(
    (c) => c.districtSlug === districtSlug,
  );
  return districtHub?.citySlug ?? placeSlug;
}

let cached: ScaleLocality[] | null = null;

/**
 * Full scale locality list:
 * 1) All hand-curated HIGH_PRIORITY areas
 * 2) All district places as hubs
 * 3) place × locality-label combinations (deduped)
 */
export function listScaleLocalities(): ScaleLocality[] {
  if (cached) return cached;

  const out: ScaleLocality[] = [];
  const seen = new Set<string>();

  const push = (row: ScaleLocality) => {
    const key = `${row.routeCitySlug}/${row.slug}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(row);
  };

  for (const city of HIGH_PRIORITY_CITY_AREAS) {
    for (const area of city.areas) {
      push({
        slug: area.slug,
        name: area.name,
        citySlug: city.citySlug,
        cityName: city.cityName,
        districtSlug: city.districtSlug,
        routeCitySlug: city.citySlug,
      });
    }
  }

  for (const district of AP_DISTRICTS) {
    for (const place of district.places) {
      const routeCitySlug = placeRouteCity(place.slug, district.slug);
      push({
        slug: place.slug,
        name: place.name,
        citySlug: place.slug,
        cityName: place.name,
        districtSlug: district.slug,
        routeCitySlug,
      });

      // Combinatorial locality children for scale (quality-gated at publish)
      for (const label of LOCALITY_LABELS) {
        const name = `${place.name} ${label}`;
        const slug = slugify(`${place.slug}-${label}`);
        push({
          slug,
          name,
          citySlug: place.slug,
          cityName: place.name,
          districtSlug: district.slug,
          routeCitySlug,
        });
      }
    }
  }

  cached = out;
  return out;
}

export function countScaleLocalities(): number {
  return listScaleLocalities().length;
}
