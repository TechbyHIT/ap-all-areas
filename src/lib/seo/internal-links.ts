/**
 * Contextual internal-link graph for location/service pages.
 * Descriptive anchors only — no “click here”.
 */

import { ROUTES } from "@/config/routes";
import { STATE_NAME, STATE_SLUG } from "@/config/geo";
import { PLACEHOLDER_GUIDES } from "@/data/placeholder-content";
import {
  getArea,
  getCity,
  getCityServices,
  listEnabledCities,
  listFactAreas,
} from "@/lib/data/location-catalog";
import { INITIAL_SERVICE_MAP } from "@/data/initial-services";
import { parentServiceSlug } from "@/lib/routing/location-silo";

export type InternalLink = {
  href: string;
  label: string;
  relation:
    | "parent"
    | "child"
    | "sibling"
    | "service"
    | "location"
    | "guide"
    | "conversion";
};

export type InternalLinkGraph = {
  parent: InternalLink[];
  children: InternalLink[];
  siblings: InternalLink[];
  services: InternalLink[];
  locations: InternalLink[];
  guides: InternalLink[];
  conversion: InternalLink[];
};

function graph(): InternalLinkGraph {
  return {
    parent: [],
    children: [],
    siblings: [],
    services: [],
    locations: [],
    guides: [],
    conversion: [
      { href: ROUTES.contact, label: "Request a measured quotation", relation: "conversion" },
    ],
  };
}

function serviceName(slug: string): string {
  return INITIAL_SERVICE_MAP[slug]?.name ?? slug.replace(/-/g, " ");
}

const GUIDE_SERVICE: Record<string, string> = {
  "invisible-grills-buying-guide": "invisible-grills",
  "safety-nets-installation-guide": "safety-nets",
  "choosing-cloth-drying-hangers": "cloth-drying-hangers",
};

function relatedGuides(serviceSlug?: string): InternalLink[] {
  const parent = serviceSlug ? parentServiceSlug(serviceSlug) ?? serviceSlug : undefined;
  return PLACEHOLDER_GUIDES.filter((guide) => {
    if (!parent) return true;
    return GUIDE_SERVICE[guide.slug] === parent;
  })
    .slice(0, 3)
    .map((guide) => ({
      href: ROUTES.guide(guide.slug),
      label: guide.title,
      relation: "guide" as const,
    }));
}

export function cityServiceLinkGraph(citySlug: string, serviceSlug: string): InternalLinkGraph {
  const city = getCity(STATE_SLUG, citySlug);
  const out = graph();
  if (!city) return out;

  const core = parentServiceSlug(serviceSlug) ?? serviceSlug;

  out.parent = [
    { href: ROUTES.home, label: "Home", relation: "parent" },
    { href: ROUTES.locations, label: "Locations", relation: "parent" },
    { href: ROUTES.state, label: STATE_NAME, relation: "parent" },
    { href: ROUTES.location(city.slug), label: city.name, relation: "parent" },
    { href: ROUTES.service(core), label: serviceName(core), relation: "parent" },
  ];

  out.children = listFactAreas(city.slug).map((area) => ({
    href: ROUTES.areaService(city.slug, area.slug, core),
    label: `${serviceName(core)} in ${area.name}`,
    relation: "child",
  }));

  out.siblings = getCityServices(STATE_SLUG, city.slug)
    .filter((service) => service.slug !== core)
    .map((service) => ({
      href: ROUTES.cityService(city.slug, service.slug),
      label: `${service.name} in ${city.name}`,
      relation: "sibling",
    }));

  out.locations = listEnabledCities()
    .filter((other) => other.slug !== city.slug && other.indexable)
    .slice(0, 8)
    .map((other) => ({
      href: ROUTES.cityService(other.slug, core),
      label: `${serviceName(core)} in ${other.name}`,
      relation: "location",
    }));

  out.guides = relatedGuides(core);
  return out;
}

export function areaServiceLinkGraph(
  citySlug: string,
  areaSlug: string,
  serviceSlug: string,
): InternalLinkGraph {
  const city = getCity(STATE_SLUG, citySlug);
  const area = getArea(STATE_SLUG, citySlug, areaSlug);
  const out = graph();
  if (!city || !area) return out;

  const core = parentServiceSlug(serviceSlug) ?? serviceSlug;

  out.parent = [
    { href: ROUTES.home, label: "Home", relation: "parent" },
    { href: ROUTES.locations, label: "Locations", relation: "parent" },
    { href: ROUTES.state, label: STATE_NAME, relation: "parent" },
    { href: ROUTES.location(city.slug), label: city.name, relation: "parent" },
    { href: ROUTES.area(city.slug, area.slug), label: area.name, relation: "parent" },
    {
      href: ROUTES.cityService(city.slug, core),
      label: `${serviceName(core)} in ${city.name}`,
      relation: "parent",
    },
  ];

  out.siblings = listFactAreas(city.slug)
    .filter((other) => other.slug !== area.slug)
    .map((other) => ({
      href: ROUTES.areaService(city.slug, other.slug, core),
      label: `${serviceName(core)} in ${other.name}`,
      relation: "sibling",
    }));

  out.services = getCityServices(STATE_SLUG, city.slug)
    .filter((service) => service.slug !== core)
    .map((service) => ({
      href: ROUTES.areaService(city.slug, area.slug, service.slug),
      label: `${service.name} in ${area.name}`,
      relation: "service",
    }));

  out.guides = relatedGuides(core);
  return out;
}

export function flattenLinkGraph(graph: InternalLinkGraph): InternalLink[] {
  return [
    ...graph.parent,
    ...graph.children,
    ...graph.siblings,
    ...graph.services,
    ...graph.locations,
    ...graph.guides,
    ...graph.conversion,
  ];
}

/** §40 — prioritize converting / strategic destinations. */
const PRIORITY_CITY = new Set([
  "visakhapatnam",
  "vijayawada",
  "guntur",
  "tirupati",
]);

const PRIORITY_SERVICE = new Set([
  "invisible-grills",
  "safety-nets",
  "sports-nets",
  "cloth-drying-hangers",
]);

export function prioritizeInternalLinks(links: InternalLink[]): InternalLink[] {
  return [...links].sort((a, b) => linkWeight(b) - linkWeight(a));
}

function linkWeight(link: InternalLink): number {
  let w = 0;
  if (link.relation === "conversion") w += 40;
  if (link.relation === "parent") w += 25;
  if (link.relation === "service") w += 20;
  if (link.relation === "child") w += 15;
  if (link.relation === "guide") w += 10;
  if (link.href.includes("/services/balcony-safety")) w += 12;
  if (link.href.includes("/comparisons/")) w += 12;
  if (link.href.includes("/projects/")) w += 8;
  for (const city of PRIORITY_CITY) {
    if (link.href.includes(`/${city}/`)) w += 6;
  }
  for (const service of PRIORITY_SERVICE) {
    if (link.href.includes(service)) w += 4;
  }
  return w;
}

/** Service hub contextual graph (§39). */
export function serviceHubLinkGraph(serviceSlug: string): InternalLinkGraph {
  const core = parentServiceSlug(serviceSlug) ?? serviceSlug;
  const out = graph();
  out.parent = [
    { href: ROUTES.home, label: "Home", relation: "parent" },
    { href: ROUTES.services, label: "Services", relation: "parent" },
  ];
  out.services = Object.values(INITIAL_SERVICE_MAP)
    .filter((s) => s.slug !== core)
    .map((s) => ({
      href: ROUTES.service(s.slug),
      label: s.name,
      relation: "service" as const,
    }));
  out.locations = listEnabledCities()
    .filter((c) => c.indexable)
    .slice(0, 6)
    .map((c) => ({
      href: ROUTES.cityService(c.slug, core),
      label: `${serviceName(core)} in ${c.name}`,
      relation: "location" as const,
    }));
  out.guides = relatedGuides(core);
  out.children = [
    {
      href: ROUTES.projects,
      label: "Installation project photos",
      relation: "child",
    },
    {
      href: ROUTES.comparisons,
      label: "Compare solution options",
      relation: "child",
    },
  ];
  return out;
}
