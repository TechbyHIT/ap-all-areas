/**
 * Menu-complete service lists for landing pages.
 *
 * The mega menu is the source of truth. Landing pages must not shrink that
 * catalog down to the four core cards — every published service, sub-service
 * and family the menu already links stays on the page as a crawlable link.
 */

import { isLocationServiceSlug } from "@/config/geo";
import { ROUTES } from "@/config/routes";
import { SERVICE_DIRECTORY } from "@/data/service-directory";
import { listLocationServices } from "@/lib/data/location-catalog";
import type { LandingLink, LandingRelatedGroup } from "@/lib/landing/types";

export type ServiceGeoScope = {
  citySlug?: string;
  cityName?: string;
  areaSlug?: string;
  areaName?: string;
  isSiloCity?: boolean;
};

/** Point a /services/{slug}/ href at the matching city or area money URL. */
export function localizeServiceHref(
  href: string,
  geo?: ServiceGeoScope,
): string {
  if (!geo?.citySlug) return href;
  const match = href.match(/^\/services\/([^/]+)\/?$/);
  if (!match) return href;
  const slug = match[1];
  if (!isLocationServiceSlug(slug)) return href;
  if (geo.areaSlug) {
    return ROUTES.areaService(geo.citySlug, geo.areaSlug, slug);
  }
  if (geo.isSiloCity) {
    return ROUTES.cityService(geo.citySlug, slug);
  }
  return href;
}

/** Keep the first label for each href so React keys and crawl lists stay unique. */
export function uniqueLinksByHref(links: LandingLink[]): LandingLink[] {
  const seen = new Set<string>();
  const unique: LandingLink[] = [];
  for (const link of links) {
    if (seen.has(link.href)) continue;
    seen.add(link.href);
    unique.push(link);
  }
  return unique;
}

/**
 * Drop empty groups and repeated destinations. Earlier groups win so
 * "Services in City" keeps the four money URLs and menu keyword-variants
 * do not re-list the same path.
 */
export function dedupeRelatedGroups(
  groups: LandingRelatedGroup[],
): LandingRelatedGroup[] {
  const seen = new Set<string>();
  const unique: LandingRelatedGroup[] = [];

  for (const group of groups) {
    const links = uniqueLinksByHref(group.links).filter((link) => {
      if (seen.has(link.href)) return false;
      seen.add(link.href);
      return true;
    });
    if (links.length === 0) continue;
    unique.push({ ...group, links });
  }

  return unique;
}

/** Every mega-menu category, optionally scoped to a city or area. */
export function buildMenuServiceGroups(
  geo?: ServiceGeoScope,
): LandingRelatedGroup[] {
  return SERVICE_DIRECTORY.map((category) => ({
    title: geo?.areaName
      ? `${category.title} in ${geo.areaName}`
      : geo?.cityName
        ? `${category.title} in ${geo.cityName}`
        : category.title,
    links: uniqueLinksByHref(
      category.links.map((link) => ({
        label: link.label,
        href: localizeServiceHref(link.href, geo),
      })),
    ),
  })).filter((group) => group.links.length > 0);
}

/** Flat unique money-service links — cores and every specialist variation. */
export function buildAllServiceLinks(geo?: ServiceGeoScope): LandingLink[] {
  return uniqueLinksByHref(
    listLocationServices().map((service) => ({
      label: geo?.areaName
        ? `${service.shortName} in ${geo.areaName}`
        : geo?.cityName
          ? `${service.shortName} in ${geo.cityName}`
          : service.name,
      href: localizeServiceHref(ROUTES.service(service.slug), geo),
      description: service.summary.split(".")[0],
    })),
  );
}
