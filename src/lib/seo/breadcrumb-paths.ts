/**
 * §50 Hierarchical breadcrumb builders.
 * Location silo uses `/locations/…` (not `/areas/`) — keep naming consistent with live URLs.
 */

import { ROUTES } from "@/config/routes";
import { STATE_NAME, STATE_SLUG } from "@/config/geo";
import type { HubCrumb } from "@/components/seo/HubBreadcrumbs";
import { INITIAL_SERVICE_MAP } from "@/data/initial-services";
import { SERVICE_FAMILY_MAP } from "@/data/service-families";
import { getArea, getCity } from "@/lib/data/location-catalog";

function serviceLabel(slug: string): string {
  return (
    INITIAL_SERVICE_MAP[slug]?.name ??
    SERVICE_FAMILY_MAP[slug]?.name ??
    slug.replace(/-/g, " ")
  );
}

/** Home → Services → Service Family → Service */
export function serviceHierarchyCrumbs(input: {
  serviceSlug: string;
  familySlug?: string;
}): HubCrumb[] {
  const crumbs: HubCrumb[] = [
    { name: "Home", path: ROUTES.home },
    { name: "Services", path: ROUTES.services },
  ];
  if (input.familySlug && SERVICE_FAMILY_MAP[input.familySlug]) {
    crumbs.push({
      name: SERVICE_FAMILY_MAP[input.familySlug]!.name,
      path: ROUTES.serviceFamily(input.familySlug),
    });
  }
  crumbs.push({
    name: serviceLabel(input.serviceSlug),
    path: ROUTES.service(input.serviceSlug),
  });
  return crumbs;
}

/** Home → Areas (Locations) → City → Locality */
export function locationHierarchyCrumbs(input: {
  citySlug: string;
  areaSlug?: string;
}): HubCrumb[] {
  const city = getCity(STATE_SLUG, input.citySlug);
  const crumbs: HubCrumb[] = [
    { name: "Home", path: ROUTES.home },
    { name: "Areas", path: ROUTES.locations },
    { name: STATE_NAME, path: ROUTES.state },
  ];
  if (city) {
    crumbs.push({ name: city.name, path: ROUTES.location(city.slug) });
  }
  if (input.areaSlug && city) {
    const area = getArea(STATE_SLUG, city.slug, input.areaSlug);
    crumbs.push({
      name: area?.name ?? input.areaSlug,
      path: ROUTES.area(city.slug, input.areaSlug),
    });
  }
  return crumbs;
}

/** Home → Areas → City → Locality → Service */
export function locationServiceHierarchyCrumbs(input: {
  citySlug: string;
  areaSlug?: string;
  serviceSlug: string;
}): HubCrumb[] {
  const base = locationHierarchyCrumbs({
    citySlug: input.citySlug,
    areaSlug: input.areaSlug,
  });
  const path = input.areaSlug
    ? ROUTES.areaService(input.citySlug, input.areaSlug, input.serviceSlug)
    : ROUTES.cityService(input.citySlug, input.serviceSlug);
  return [
    ...base,
    { name: serviceLabel(input.serviceSlug), path },
  ];
}

/** Home → Areas → City → Property type (no fake society entities). */
export function propertyTypeHierarchyCrumbs(input: {
  citySlug?: string;
  propertyTypeName: string;
  propertyTypePath: string;
}): HubCrumb[] {
  const crumbs: HubCrumb[] = [
    { name: "Home", path: ROUTES.home },
    { name: "Areas", path: ROUTES.locations },
  ];
  if (input.citySlug) {
    const city = getCity(STATE_SLUG, input.citySlug);
    if (city) {
      crumbs.push({ name: city.name, path: ROUTES.location(city.slug) });
    }
  }
  crumbs.push({
    name: input.propertyTypeName,
    path: input.propertyTypePath,
  });
  return crumbs;
}

export function pageHasBreadcrumbPath(crumbs: HubCrumb[]): boolean {
  return crumbs.length >= 2 && crumbs[0]?.path === ROUTES.home;
}
