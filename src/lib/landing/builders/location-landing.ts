/**
 * Location landing builders — map real catalog data into the universal model.
 *
 * Local variation comes from curated facts (area building stock, access notes,
 * city climate and corridors), so two localities never render the same page
 * with a swapped name. Where a locality has no verified facts, the page keeps
 * fewer sections instead of padding with generic filler.
 */

import { ROUTES } from "@/config/routes";
import { STATE_NAME } from "@/config/geo";
import { getAreaLocalFact } from "@/data/area-local-facts";
import { getCityLocalProfile } from "@/data/city-local-profiles";
import { SERVICE_VARIANTS } from "@/data/service-variants";
import { listLocationServices } from "@/lib/data/location-catalog";
import type {
  LandingOption,
  LandingProblem,
  LandingRelatedGroup,
  LandingUseCase,
} from "@/lib/landing/types";
import {
  buildMenuServiceGroups,
  dedupeRelatedGroups,
  localizeServiceHref,
} from "@/lib/landing/builders/service-directory";
import type { ServiceGeoScope } from "@/lib/landing/builders/service-directory";

/** Problem-first entry points, ordered by what the locality actually reports. */
export function buildLocationProblems(input: {
  citySlug: string;
  areaSlug?: string;
  isSiloCity: boolean;
}): LandingProblem[] {
  const { citySlug, areaSlug, isSiloCity } = input;
  const fact = areaSlug ? getAreaLocalFact(citySlug, areaSlug) : null;

  const cityService = (slug: string) =>
    isSiloCity ? ROUTES.cityService(citySlug, slug) : ROUTES.service(slug);

  const all: Array<LandingProblem & { needle: string }> = [
    {
      needle: "fall",
      title: "Balcony or window fall risk",
      summary:
        "Open railings, side returns and sit-outs used by children or for daily seating.",
      href: cityService("safety-nets"),
    },
    {
      needle: "view",
      title: "Protection without losing the view",
      summary:
        "Cable systems for when a low-visibility finish matters as much as the barrier itself.",
      href: cityService("invisible-grills"),
    },
    {
      needle: "bird",
      title: "Pigeons and bird entry",
      summary:
        "Ledges, ducts and unused balconies where birds roost before the railing becomes the issue.",
      href: cityService("pigeon-safety-nets"),
    },
    {
      needle: "child",
      title: "Children or pets at home",
      summary:
        "Mesh aperture and edge coverage planned around reach and daily use of the opening.",
      href: cityService("children-safety-nets"),
    },
    {
      needle: "pet",
      title: "Cats or dogs on the balcony",
      summary:
        "Side returns, planter gaps and climbable outdoor units that pets test every day.",
      href: cityService("pet-safety-nets"),
    },
    {
      needle: "terrace",
      title: "Open terrace edges",
      summary:
        "Parapet gaps, water-tank sides and play use on a roof — not a balcony-net drawing reused.",
      href: cityService("terrace-safety-nets"),
    },
    {
      needle: "sport",
      title: "Sports and practice areas",
      summary:
        "Practice cages and boundary nets sized to the plot — not balcony mesh reused outdoors.",
      href: cityService("cricket-practice-nets"),
    },
    {
      needle: "dry",
      title: "Cloth drying space",
      summary:
        "Ceiling or wall hangers that must share space with nets, grills and outdoor units.",
      href: cityService("cloth-drying-hangers"),
    },
  ];

  const toProblem = (
    item: LandingProblem & { needle: string },
  ): LandingProblem => ({
    title: item.title,
    summary: item.summary,
    href: item.href,
  });

  // Curated locality needs decide ordering, so nearby areas differ meaningfully.
  const needs = (fact?.commonNeeds ?? []).join(" ").toLowerCase();
  if (!needs) return all.map(toProblem);

  return all
    .map((item) => ({
      item,
      score: needs.includes(item.needle) ? 0 : 1,
    }))
    .sort((a, b) => a.score - b.score)
    .map(({ item }) => toProblem(item));
}

/** Property/audience fit — varies with the locality's real building stock. */
export function buildLocationUseCases(input: {
  citySlug: string;
  cityName: string;
  areaSlug?: string;
  areaName?: string;
}): LandingUseCase[] {
  const { citySlug, cityName, areaSlug, areaName } = input;
  const fact = areaSlug ? getAreaLocalFact(citySlug, areaSlug) : null;
  const place = areaName ?? cityName;

  const cases: LandingUseCase[] = [];

  if (fact?.buildingStock) {
    cases.push({
      title: `Local building stock in ${place}`,
      description: `Planning here accounts for ${fact.buildingStock}.`,
    });
  }
  if (fact?.accessNote) {
    cases.push({
      title: "Access and visit planning",
      description: fact.accessNote,
    });
  }
  if (fact?.exposureHint) {
    cases.push({
      title: "Exposure and material choice",
      description: fact.exposureHint,
    });
  }

  const profile = getCityLocalProfile(citySlug);
  if (cases.length < 3 && profile?.weatherNotes) {
    cases.push({
      title: `Weather considerations in ${cityName}`,
      description: profile.weatherNotes,
    });
  }

  return cases;
}

/** Every money service, with the honest limit that makes the comparison useful. */
export function buildServiceOptions(
  context: string,
  geo?: ServiceGeoScope,
): LandingOption[] {
  return SERVICE_VARIANTS.map((variant) => ({
    title: variant.name,
    bestFor: variant.comparison.bestFor,
    description: `In ${context}, this is fitted at ${variant.openings[0]}. What it delivers is ${variant.solves}.`,
    considerations: variant.notSolved,
    href: localizeServiceHref(ROUTES.service(variant.slug), geo),
  }));
}

/** Grouped contextual links — full city/area/service catalog, not a 4-item slice. */
export function buildLocationRelatedGroups(input: {
  citySlug: string;
  cityName: string;
  isSiloCity: boolean;
  areaSlug?: string;
  areaName?: string;
  nearbyAreas?: Array<{ slug: string; name: string }>;
  siblingCities?: Array<{ citySlug: string; cityName: string }>;
}): LandingRelatedGroup[] {
  const { citySlug, cityName, isSiloCity, nearbyAreas, siblingCities } = input;
  const groups: LandingRelatedGroup[] = [];

  /* Every variation, not the four core hubs — each one owns a city URL, so
     this group is how they get discovered. */
  groups.push({
    title: `Services in ${cityName}`,
    links: listLocationServices().map((service) => ({
      label: `${service.shortName ?? service.name} in ${cityName}`,
      href: isSiloCity
        ? ROUTES.cityService(citySlug, service.slug)
        : ROUTES.service(service.slug),
    })),
  });

  if (nearbyAreas && nearbyAreas.length > 0) {
    groups.push({
      title: `All areas in ${cityName}`,
      description: "Every curated locality hub for this city.",
      links: nearbyAreas.map((area) => ({
        label: area.name,
        href: ROUTES.area(citySlug, area.slug),
      })),
    });
  }

  if (siblingCities && siblingCities.length > 0) {
    groups.push({
      title: `Other ${STATE_NAME} cities`,
      description: "Service-area hubs — not branch listings.",
      links: siblingCities.map((city) => ({
        label: city.cityName,
        href: ROUTES.location(city.citySlug),
      })),
    });
  }

  groups.push(
    ...buildMenuServiceGroups({
      citySlug,
      cityName,
      areaSlug: input.areaSlug,
      areaName: input.areaName,
      isSiloCity,
    }),
  );

  return dedupeRelatedGroups(groups);
}

/** Shared five-step journey, worded for the specific place. */
export function buildEnquiryProcess(place: string) {
  return {
    title: `What happens after you enquire in ${place}`,
    description:
      "A measured quote follows a site review — we do not price an opening from a photo alone.",
    steps: [
      {
        title: "Share opening photos",
        description: `Send balcony or window photos on WhatsApp with your ${place} address and floor level.`,
      },
      {
        title: "Requirement discussion",
        description:
          "We confirm whether children, pets, birds, view or drying space is the priority, and flag anything the photos cannot show.",
      },
      {
        title: "Site measurement",
        description:
          "A technician measures openings, checks anchor points and confirms building access before any commitment.",
      },
      {
        title: "Measured quotation",
        description:
          "You receive scope, material direction and exclusions in writing — not a single area-wide rate.",
      },
      {
        title: "Installation and handover",
        description:
          "Fitting on the agreed date, followed by finishing checks and basic care notes for the installed system.",
      },
    ],
  };
}
