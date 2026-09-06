/**
 * Service landing builders.
 *
 * Options come from the real sub-service catalog and use cases from published
 * property types, so a service page only shows variations that actually have
 * a page behind them.
 */

import { ROUTES } from "@/config/routes";
import { PROPERTY_TYPES } from "@/data/property-types";
import { SUB_SERVICES } from "@/data/sub-services";
import {
  listVariantsForParent,
  SERVICE_VARIANTS,
} from "@/data/service-variants";
import { listLocationServices } from "@/lib/data/location-catalog";
import { parentServiceSlug } from "@/lib/routing/location-silo";
import type {
  LandingLink,
  LandingOption,
  LandingRelatedGroup,
  LandingUseCase,
} from "@/lib/landing/types";
import {
  buildMenuServiceGroups,
  dedupeRelatedGroups,
  uniqueLinksByHref,
} from "@/lib/landing/builders/service-directory";

/**
 * Real variants of a service. Falls back to sibling services when a service
 * has no sub-services, so the section is never fabricated to fill space.
 */
export function buildServiceVariantOptions(input: {
  serviceSlug: string;
  serviceName: string;
  place?: string;
  /** Scope variation links to a city when the page itself is city-scoped. */
  citySlug?: string;
  areaSlug?: string;
}): LandingOption[] {
  const { serviceSlug, place, citySlug, areaSlug } = input;
  const suffix = place ? ` Availability in ${place} follows a site review.` : "";

  const href = (slug: string) =>
    citySlug && areaSlug
      ? ROUTES.areaService(citySlug, areaSlug, slug)
      : citySlug
        ? ROUTES.cityService(citySlug, slug)
        : ROUTES.service(slug);

  /* On a sub-service page the useful comparison is its siblings under the
     same parent, not the four unrelated hubs. */
  const parent = parentServiceSlug(serviceSlug) ?? serviceSlug;
  const family = listVariantsForParent(parent).filter(
    (sibling) => sibling.slug !== serviceSlug,
  );
  const pool =
    family.length >= 2
      ? family
      : SERVICE_VARIANTS.filter((v) => v.slug !== serviceSlug).slice(0, 8);

  /* `considerations` carries the honest limitation. A comparison block that
     only lists upsides tells the visitor nothing they can decide on. */
  return pool.map((variant) => ({
    title: variant.name,
    bestFor: variant.comparison.bestFor,
    description: `${variant.comparison.look}. Chosen by ${variant.audience}.${suffix}`,
    considerations: `Does not solve: ${variant.notSolved}`,
    href: href(variant.slug),
  }));
}

/** Property types that genuinely list this service as suitable. */
export function buildServiceUseCases(input: {
  serviceSlug: string;
  place?: string;
}): LandingUseCase[] {
  const { serviceSlug, place } = input;

  return PROPERTY_TYPES.filter(
    (type) =>
      type.publicationStatus === "published" &&
      type.allowIndexing &&
      type.suitableServices.includes(serviceSlug),
  )
    .slice(0, 6)
    .map((type) => ({
      title: type.name,
      description: place
        ? `${type.summary} Site conditions in ${place} are confirmed before quoting.`
        : type.summary,
      href: ROUTES.propertyTypeService(type.slug, serviceSlug),
    }));
}

/** Entry points for visitors who have not yet narrowed their requirement. */
export function buildServiceQuickStart(input: {
  serviceSlug: string;
  citySlug?: string;
}): LandingLink[] {
  const { serviceSlug, citySlug } = input;
  const options: LandingLink[] = [];

  /* Siblings under the same parent are the fastest way for a visitor on the
     wrong variation to reach the right one — and they keep the city-scoped
     variation URLs one click from the hub. */
  const parent = parentServiceSlug(serviceSlug) ?? serviceSlug;
  for (const sub of SUB_SERVICES.filter(
    (s) => s.parentSlug === parent && s.slug !== serviceSlug,
  )) {
    options.push({
      label: sub.name,
      href: citySlug
        ? ROUTES.cityService(citySlug, sub.slug)
        : ROUTES.service(sub.slug),
      description: sub.summary.split(".")[0],
    });
  }

  options.push({
    label: "Compare all services",
    href: ROUTES.services,
    description: "See every installation type side by side",
  });

  if (citySlug) {
    options.push({
      label: "See city coverage",
      href: ROUTES.location(citySlug),
      description: "Areas, local notes and other services here",
    });
  }

  options.push({
    label: "What affects the price",
    href: "/pricing-guide/",
    description: "How measured quotes are built",
  });

  return uniqueLinksByHref(options);
}

/** Grouped internal links for a service page, optionally city-scoped. */
export function buildServiceRelatedGroups(input: {
  serviceSlug: string;
  serviceName: string;
  citySlug?: string;
  cityName?: string;
}): LandingRelatedGroup[] {
  const { serviceSlug, serviceName, citySlug, cityName } = input;
  const groups: LandingRelatedGroup[] = [];

  /* Every service owning a location URL, not just the four hubs — this is the
     link that makes the full city×service grid discoverable. */
  const siblings = listLocationServices().filter((s) => s.slug !== serviceSlug);
  groups.push({
    title: "Other services",
    links: siblings.map((s) => ({
      label: citySlug && cityName ? `${s.shortName} in ${cityName}` : s.name,
      href:
        citySlug && cityName
          ? ROUTES.cityService(citySlug, s.slug)
          : ROUTES.service(s.slug),
    })),
  });

  const parent = parentServiceSlug(serviceSlug) ?? serviceSlug;
  const variants = SUB_SERVICES.filter(
    (s) => s.parentSlug === parent && s.slug !== serviceSlug,
  );
  if (variants.length > 0) {
    groups.push({
      title: `${serviceName} variations`,
      links: variants.map((v) => ({
        label: citySlug && cityName ? `${v.name} in ${cityName}` : v.name,
        href:
          citySlug && cityName
            ? ROUTES.cityService(citySlug, v.slug)
            : ROUTES.service(v.slug),
      })),
    });
  }

  groups.push({
    title: "Before you enquire",
    description: "Background reading that makes a site visit more productive.",
    links: [
      { label: "Pricing guide", href: "/pricing-guide/" },
      { label: "Materials guide", href: "/materials-guide/" },
      { label: "Installation process", href: "/installation-process/" },
      { label: "Safety guide", href: "/safety-guide/" },
      ...(citySlug && cityName
        ? [
            {
              label: `All services in ${cityName}`,
              href: ROUTES.location(citySlug),
            },
          ]
        : []),
      { label: `${serviceName} overview`, href: ROUTES.service(serviceSlug) },
    ],
  });

  groups.push(
    ...buildMenuServiceGroups({
      citySlug,
      cityName,
      isSiloCity: Boolean(citySlug),
    }),
  );

  return dedupeRelatedGroups(groups);
}
