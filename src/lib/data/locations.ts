import {
  AP_DISTRICTS,
  HIGH_PRIORITY_CITY_AREAS,
  type DistrictSeed,
  type SeedLocation,
} from "@/data/initial-locations";

export function getAllDistricts(): DistrictSeed[] {
  return AP_DISTRICTS;
}

export function getDistrictBySlug(slug: string): DistrictSeed | undefined {
  return AP_DISTRICTS.find((d) => d.slug === slug);
}

export function findLocationBySlug(slug: string): SeedLocation | undefined {
  for (const district of AP_DISTRICTS) {
    if (district.slug === slug) {
      return district;
    }
    const place = district.places.find((p) => p.slug === slug);
    if (place) return place;
  }
  for (const city of HIGH_PRIORITY_CITY_AREAS) {
    if (city.citySlug === slug) {
      return {
        slug: city.citySlug,
        name: city.cityName,
        locationType: "city",
        parentSlug: city.districtSlug,
        district: city.districtSlug,
      };
    }
    const area = city.areas.find((a) => a.slug === slug);
    if (area) return area;
  }
  return undefined;
}

export function getCityBySlug(citySlug: string): SeedLocation | undefined {
  for (const district of AP_DISTRICTS) {
    const city = district.places.find(
      (p) => p.slug === citySlug && (p.locationType === "city" || p.locationType === "town"),
    );
    if (city) return city;
  }
  const priority = HIGH_PRIORITY_CITY_AREAS.find((c) => c.citySlug === citySlug);
  if (priority) {
    return {
      slug: priority.citySlug,
      name: priority.cityName,
      locationType: "city",
      parentSlug: priority.districtSlug,
      district: priority.districtSlug,
    };
  }
  return undefined;
}

export function getAreasForCity(citySlug: string): SeedLocation[] {
  const priority = HIGH_PRIORITY_CITY_AREAS.find((c) => c.citySlug === citySlug);
  if (priority) return priority.areas;

  const district = AP_DISTRICTS.find((d) =>
    d.places.some((p) => p.slug === citySlug),
  );
  if (!district) return [];

  return district.places.filter(
    (p) => p.locationType === "area" && p.parentSlug === citySlug,
  );
}

export function getAreaBySlugs(
  locationSlug: string,
  areaSlug: string,
): SeedLocation | undefined {
  const areas = getAreasForCity(locationSlug);
  return areas.find((a) => a.slug === areaSlug);
}

export function getMainCitySlugs(): string[] {
  return HIGH_PRIORITY_CITY_AREAS.map((c) => c.citySlug);
}

export function getAllCities(): SeedLocation[] {
  const seen = new Set<string>();
  const cities: SeedLocation[] = [];

  for (const district of AP_DISTRICTS) {
    for (const place of district.places) {
      if (
        (place.locationType === "city" || place.locationType === "town") &&
        !seen.has(place.slug)
      ) {
        seen.add(place.slug);
        cities.push(place);
      }
    }
  }
  return cities;
}
