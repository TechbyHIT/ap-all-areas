/**
 * Authoritative location/service catalog for organic SEO.
 * Wraps existing seed data — does not invent cities, areas, or branches.
 */

import { STATE_NAME, STATE_SLUG } from "@/config/geo";
import { AREA_LOCAL_FACTS, getAreaLocalFact } from "@/data/area-local-facts";
import { getCityLocalProfile } from "@/data/city-local-profiles";
import {
  HIGH_PRIORITY_CITY_AREAS,
  type HighPriorityCitySeed,
} from "@/data/initial-locations";
import {
  INITIAL_SERVICE_MAP,
  INITIAL_SERVICES,
} from "@/data/initial-services";
import type { Service } from "@/types/service";
import {
  getAreaBySlugs,
  getAreasForCity,
  getCityBySlug,
} from "@/lib/data/locations";
import { parentServiceSlug } from "@/lib/routing/location-silo";

export type CatalogState = {
  slug: string;
  name: string;
  country: string;
  enabled: boolean;
};

export type CatalogCity = {
  slug: string;
  name: string;
  stateSlug: string;
  districtSlug: string;
  enabled: boolean;
  /** Unique local profile exists — safe to index as a city hub. */
  indexable: boolean;
  services: string[];
};

export type CatalogArea = {
  slug: string;
  name: string;
  citySlug: string;
  stateSlug: string;
  enabled: boolean;
  /** Verified locality facts exist — required for area and area+service index. */
  indexable: boolean;
  services: string[];
};

export const CATALOG_STATE: CatalogState = {
  slug: STATE_SLUG,
  name: STATE_NAME,
  country: "India",
  enabled: true,
};

function coreServiceSlugs(): string[] {
  return INITIAL_SERVICES.filter((s) => s.allowIndexing).map((s) => s.slug);
}

function priorityCity(citySlug: string): HighPriorityCitySeed | undefined {
  return HIGH_PRIORITY_CITY_AREAS.find((c) => c.citySlug === citySlug);
}

export function getState(slug: string): CatalogState | null {
  return slug === CATALOG_STATE.slug && CATALOG_STATE.enabled
    ? CATALOG_STATE
    : null;
}

export function listEnabledCities(): CatalogCity[] {
  return HIGH_PRIORITY_CITY_AREAS.map((city) => getCity(STATE_SLUG, city.citySlug)!);
}

export function getCity(stateSlug: string, citySlug: string): CatalogCity | null {
  if (stateSlug !== STATE_SLUG) return null;
  const seed = priorityCity(citySlug);
  if (!seed) return null;
  return {
    slug: seed.citySlug,
    name: seed.cityName,
    stateSlug: STATE_SLUG,
    districtSlug: seed.districtSlug,
    enabled: true,
    indexable: Boolean(getCityLocalProfile(seed.citySlug)),
    services: coreServiceSlugs(),
  };
}

export function getArea(
  stateSlug: string,
  citySlug: string,
  areaSlug: string,
): CatalogArea | null {
  const city = getCity(stateSlug, citySlug);
  if (!city) return null;
  const seed = getAreaBySlugs(citySlug, areaSlug);
  if (!seed) return null;
  return {
    slug: seed.slug,
    name: seed.name,
    citySlug: city.slug,
    stateSlug: STATE_SLUG,
    enabled: true,
    indexable: Boolean(getAreaLocalFact(citySlug, areaSlug)),
    services: coreServiceSlugs(),
  };
}

export function listEnabledAreas(citySlug: string): CatalogArea[] {
  return getAreasForCity(citySlug)
    .map((area) => getArea(STATE_SLUG, citySlug, area.slug))
    .filter((area): area is CatalogArea => area !== null);
}

export function listFactAreas(citySlug: string): CatalogArea[] {
  return listEnabledAreas(citySlug).filter((area) => area.indexable);
}

export function getService(serviceSlug: string): Service | null {
  const core = INITIAL_SERVICE_MAP[serviceSlug];
  if (core?.allowIndexing) return core;
  const parent = parentServiceSlug(serviceSlug);
  if (parent && INITIAL_SERVICE_MAP[parent]?.allowIndexing) {
    return INITIAL_SERVICE_MAP[parent];
  }
  return null;
}

export function getCityServices(stateSlug: string, citySlug: string): Service[] {
  const city = getCity(stateSlug, citySlug);
  if (!city) return [];
  return city.services
    .map((slug) => INITIAL_SERVICE_MAP[slug])
    .filter((service): service is Service => Boolean(service?.allowIndexing));
}

export function getAreaServices(
  stateSlug: string,
  citySlug: string,
  areaSlug: string,
): Service[] {
  const area = getArea(stateSlug, citySlug, areaSlug);
  if (!area) return [];
  return area.services
    .map((slug) => INITIAL_SERVICE_MAP[slug])
    .filter((service): service is Service => Boolean(service?.allowIndexing));
}

export function isServiceAvailableInCity(
  stateSlug: string,
  citySlug: string,
  serviceSlug: string,
): boolean {
  const city = getCity(stateSlug, citySlug);
  const service = getService(serviceSlug);
  if (!city || !service) return false;
  const core = parentServiceSlug(serviceSlug) ?? service.slug;
  return city.services.includes(core);
}

export function isServiceAvailableInArea(
  stateSlug: string,
  citySlug: string,
  areaSlug: string,
  serviceSlug: string,
): boolean {
  const area = getArea(stateSlug, citySlug, areaSlug);
  const service = getService(serviceSlug);
  if (!area || !service) return false;
  const core = parentServiceSlug(serviceSlug) ?? service.slug;
  return area.services.includes(core);
}

export function isKnownCitySlug(citySlug: string): boolean {
  return Boolean(getCityBySlug(citySlug) || priorityCity(citySlug));
}

export function listFactAreaKeys(): Array<{ citySlug: string; areaSlug: string }> {
  return AREA_LOCAL_FACTS.map((fact) => ({
    citySlug: fact.citySlug,
    areaSlug: fact.areaSlug,
  }));
}
