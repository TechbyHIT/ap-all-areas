/**
 * Andhra Pradesh location silo — public canonicals vs internal App Router paths.
 * Edge-safe: no Prisma / Node-only imports.
 */

import {
  AREA_MONEY_LANDING_KEYS,
  CITY_ALIASES,
  CORE_SERVICE_SLUGS,
  SERVICE_PARENT_BY_SLUG,
  SERVICE_SLUG_REDIRECTS,
  SILO_CITY_SLUGS,
  STATE_SLUG,
} from "@/config/geo";

const AREA_LANDING_SET = new Set<string>(AREA_MONEY_LANDING_KEYS);

const CITY_SET = new Set<string>(SILO_CITY_SLUGS);
const CORE_SERVICE_SET = new Set<string>(CORE_SERVICE_SLUGS);

function withSlash(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function canonicalCitySlug(slug: string): string | null {
  const mapped = CITY_ALIASES[slug] ?? slug;
  return CITY_SET.has(mapped) ? mapped : null;
}

export function parentServiceSlug(slug: string): string | null {
  if (CORE_SERVICE_SET.has(slug)) return slug;
  return SERVICE_PARENT_BY_SLUG[slug] ?? null;
}

export function siloStatePath(): string {
  return `/locations/${STATE_SLUG}/`;
}

export function siloCityPath(citySlug: string): string {
  return `/locations/${STATE_SLUG}/${citySlug}/`;
}

export function siloAreaPath(citySlug: string, areaSlug: string): string {
  return `/locations/${STATE_SLUG}/${citySlug}/${areaSlug}/`;
}

export function siloCityServicePath(citySlug: string, serviceSlug: string): string {
  return `/locations/${STATE_SLUG}/${citySlug}/${serviceSlug}/`;
}

export function siloAreaServicePath(
  citySlug: string,
  areaSlug: string,
  serviceSlug: string,
): string {
  return `/locations/${STATE_SLUG}/${citySlug}/${areaSlug}/${serviceSlug}/`;
}

/**
 * Public silo URL → existing internal route that still holds the page module.
 */
export function matchSiloInternalRewrite(pathname: string): string | null {
  const p = withSlash(pathname);

  if (p === siloStatePath()) return null;

  const areaService = p.match(
    new RegExp(
      `^/locations/${STATE_SLUG}/([a-z0-9-]+)/([a-z0-9-]+)/([a-z0-9-]+)/$`,
    ),
  );
  if (areaService) {
    const city = canonicalCitySlug(areaService[1]);
    const service = parentServiceSlug(areaService[3]);
    if (city && service && !parentServiceSlug(areaService[2])) {
      const landingKey = `${service}/${STATE_SLUG}/${city}/${areaService[2]}`;
      if (AREA_LANDING_SET.has(landingKey)) {
        return `/landings/area/${service}/${STATE_SLUG}/${city}/${areaService[2]}/`;
      }
      return `/${city}/${areaService[2]}/${service}/`;
    }
    return null;
  }

  const cityChild = p.match(
    new RegExp(`^/locations/${STATE_SLUG}/([a-z0-9-]+)/([a-z0-9-]+)/$`),
  );
  if (cityChild) {
    const city = canonicalCitySlug(cityChild[1]);
    if (!city) return null;
    const service = parentServiceSlug(cityChild[2]);
    if (service) return `/${city}/${service}/`;
    return `/locations/${city}/${cityChild[2]}/`;
  }

  const cityOnly = p.match(
    new RegExp(`^/locations/${STATE_SLUG}/([a-z0-9-]+)/$`),
  );
  if (cityOnly) {
    const city = canonicalCitySlug(cityOnly[1]);
    return city ? `/locations/${city}/` : null;
  }

  return null;
}

/**
 * Legacy or alias public URL → canonical silo path (308).
 */
export function matchLegacySiloRedirect(pathname: string): string | null {
  const p = withSlash(pathname);

  const serviceAlias = p.match(/^\/services\/([a-z0-9-]+)\/$/);
  if (serviceAlias) {
    const dest = SERVICE_SLUG_REDIRECTS[serviceAlias[1]];
    if (dest) return `/services/${dest}/`;
  }

  const locArea = p.match(/^\/locations\/([a-z0-9-]+)\/([a-z0-9-]+)\/$/);
  if (locArea && locArea[1] !== STATE_SLUG) {
    const city = canonicalCitySlug(locArea[1]);
    if (city) {
      const service = parentServiceSlug(locArea[2]);
      if (service) return siloCityServicePath(city, service);
      return siloAreaPath(city, locArea[2]);
    }
  }

  const locCity = p.match(/^\/locations\/([a-z0-9-]+)\/$/);
  if (locCity && locCity[1] !== STATE_SLUG) {
    const city = canonicalCitySlug(locCity[1]);
    if (city) return siloCityPath(city);
  }

  if (
    p.startsWith("/locations/") ||
    p.startsWith("/services/") ||
    p.startsWith("/landings/") ||
    p.startsWith("/guides/") ||
    p.startsWith("/blog/") ||
    p.startsWith("/property-types/") ||
    p.startsWith("/solutions/") ||
    p.startsWith("/admin/") ||
    p.startsWith("/api/") ||
    p.startsWith("/sitemaps/")
  ) {
    return null;
  }

  const areaService = p.match(/^\/([a-z0-9-]+)\/([a-z0-9-]+)\/([a-z0-9-]+)\/$/);
  if (areaService) {
    const city = canonicalCitySlug(areaService[1]);
    const service = parentServiceSlug(areaService[3]);
    if (city && service && !parentServiceSlug(areaService[2])) {
      return siloAreaServicePath(city, areaService[2], service);
    }
  }

  const cityService = p.match(/^\/([a-z0-9-]+)\/([a-z0-9-]+)\/$/);
  if (cityService) {
    const city = canonicalCitySlug(cityService[1]);
    const service = parentServiceSlug(cityService[2]);
    if (city && service) return siloCityServicePath(city, service);
  }

  return null;
}

export function isLegacyLocationPublicPath(pathname: string): boolean {
  return matchLegacySiloRedirect(pathname) !== null;
}
