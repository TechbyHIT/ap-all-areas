/**
 * Genuine comparison pages only — users actually weigh these options.
 * Do not mass-generate every service pair.
 */

import { ROUTES } from "@/config/routes";

export type ComparisonDimension = {
  label: string;
  optionA: string;
  optionB: string;
};

export type ServiceComparison = {
  slug: string;
  optionA: { name: string; href: string };
  optionB: { name: string; href: string };
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  dimensions: ComparisonDimension[];
  idealCustomerA: string;
  idealCustomerB: string;
  idealApplicationA: string;
  idealApplicationB: string;
  decisionHelp: string[];
  relatedProblemSlugs: string[];
  relatedFamilySlug?: string;
};

export const SERVICE_COMPARISONS: ServiceComparison[] = [
  {
    slug: "invisible-grills-vs-safety-nets",
    optionA: {
      name: "Invisible Grills",
      href: ROUTES.service("invisible-grills"),
    },
    optionB: {
      name: "Safety Nets",
      href: ROUTES.service("safety-nets"),
    },
    h1: "Invisible Grills vs Safety Nets",
    metaTitle:
      "Invisible Grills vs Safety Nets — Which Fits Your Balcony?",
    metaDescription:
      "Compare purpose, materials, appearance, durability, maintenance, limitations and cost factors for invisible grills and safety nets in Andhra Pradesh.",
    intro:
      "Families comparing balcony protection often ask which is better: invisible grills or safety nets. Neither wins every opening. The better choice depends on view preference, bird pressure, child or pet risk, and how the balcony is used day to day.",
    dimensions: [
      {
        label: "Purpose",
        optionA: "Continuous fall barrier with a lighter visual profile",
        optionB: "Broad coverage for fall protection and/or bird control",
      },
      {
        label: "Installation",
        optionA: "Stainless wires tensioned across measured spans",
        optionB: "Mesh tensioned over balcony, duct or terrace rectangles",
      },
      {
        label: "Material",
        optionA: "Stainless-steel wire systems and anchors",
        optionB: "HDPE/nylon mesh grades chosen for the brief",
      },
      {
        label: "Appearance",
        optionA: "More open outlook than heavy iron grills",
        optionB: "Visible mesh; colour chosen for the elevation",
      },
      {
        label: "Durability",
        optionA: "Depends on wire grade, anchors and coastal exposure",
        optionB: "Depends on mesh UV grade, tension and sun exposure",
      },
      {
        label: "Maintenance",
        optionA: "Cleaning and hardware checks; coastal sites need honesty",
        optionB: "Debris, tension checks and bird-pressure wear",
      },
      {
        label: "Limitations",
        optionA: "Not a climb-from-furniture guarantee; society access matters",
        optionB: "Not a neighbourhood-wide bird wipeout; access height matters",
      },
      {
        label: "Cost factors",
        optionA: "Span, spacing, wire grade, height and access",
        optionB: "Area covered, mesh grade, height and access",
      },
    ],
    idealCustomerA:
      "Households that want fall protection with a clearer living-balcony view",
    idealCustomerB:
      "Households needing broad coverage, utility balconies or bird-pressure control",
    idealApplicationA: "Living balconies and windows where outlook matters",
    idealApplicationB: "Utility balconies, ducts, AC ledges and bird roosts",
    decisionHelp: [
      "If outlook is the priority and fall risk is the main brief, lean invisible grills.",
      "If pigeons or large utility rectangles dominate, lean safety nets.",
      "Mixed homes often use both—grills on the living sit-out, nets on ducts or drying balconies.",
      "Final choice should follow measurement photos, not a city-wide package claim.",
    ],
    relatedProblemSlugs: [
      "child-balcony-safety",
      "pet-balcony-safety",
      "pigeon-infestation",
    ],
    relatedFamilySlug: "balcony-safety",
  },
  {
    slug: "invisible-grills-vs-iron-grills",
    optionA: {
      name: "Invisible Grills",
      href: ROUTES.service("invisible-grills"),
    },
    optionB: {
      name: "Traditional iron grills",
      href: ROUTES.service("invisible-grills"),
    },
    h1: "Invisible Grills vs Iron Grills",
    metaTitle:
      "Invisible Grills vs Iron Grills — Appearance, Safety and Upkeep",
    metaDescription:
      "Compare invisible stainless-wire systems with traditional iron balcony grills for view, maintenance, installation and limitations in Andhra Pradesh homes.",
    intro:
      "Many renovation briefs start with a dislike of bulky iron grills. Invisible wire systems are one alternative for fall protection with a lighter look. This page compares purpose and trade-offs—not a claim that every iron grill should be removed.",
    dimensions: [
      {
        label: "Purpose",
        optionA: "Fall barrier with thinner visual lines",
        optionB: "Rigid metal barrier; often decorative as well as protective",
      },
      {
        label: "Installation",
        optionA: "Measured wire layouts and anchors after site review",
        optionB: "Fabricated frames fixed to masonry or existing rails",
      },
      {
        label: "Material",
        optionA: "Stainless-steel wires and outdoor-grade hardware",
        optionB: "Mild steel / iron with paint or powder coating",
      },
      {
        label: "Appearance",
        optionA: "Keeps more of the outdoor view",
        optionB: "Heavier visual mass; design varies by fabricator",
      },
      {
        label: "Durability",
        optionA: "Grade and coastal care drive lifespan",
        optionB: "Rust and paint cycles are common maintenance themes",
      },
      {
        label: "Maintenance",
        optionA: "Cleaning and periodic hardware checks",
        optionB: "Repainting and rust treatment over years",
      },
      {
        label: "Limitations",
        optionA: "Needs sound fixing points; society rules still apply",
        optionB: "Bulk and outlook trade-offs; fabrication quality varies",
      },
      {
        label: "Cost factors",
        optionA: "Wire grade, spacing, span count and access",
        optionB: "Design complexity, metal weight and finish",
      },
    ],
    idealCustomerA:
      "Families who want safety without a cage-like elevation",
    idealCustomerB:
      "Homes that prefer rigid metal work or already have iron fabricators engaged",
    idealApplicationA: "Modern flats seeking an open balcony look",
    idealApplicationB: "Sites where rigid metal design is already approved",
    decisionHelp: [
      "Choose invisible grills when view and lighter lines are the brief.",
      "Keep or renew iron grills when the design is already approved and preferred.",
      "We install invisible grill systems after measurement—we do not claim to replace every fabricator’s iron work.",
    ],
    relatedProblemSlugs: ["child-balcony-safety", "open-window-risk"],
    relatedFamilySlug: "balcony-safety",
  },
  {
    slug: "safety-nets-vs-bird-spikes",
    optionA: {
      name: "Safety / pigeon nets",
      href: ROUTES.service("pigeon-safety-nets"),
    },
    optionB: {
      name: "Bird spikes (discussed as an alternative)",
      href: ROUTES.solution("pigeon-infestation"),
    },
    h1: "Safety Nets vs Bird Spikes",
    metaTitle:
      "Pigeon Nets vs Bird Spikes — Which Bird Control Fits?",
    metaDescription:
      "Compare netting and spike-style bird deterrents for balconies, ledges and ducts. Honest limitations and when nets are usually the better fit.",
    intro:
      "Bird control briefs often mention nets and spikes in the same conversation. Spikes can discourage landing on narrow ledges; nets close volumes birds actually use. This comparison stays practical—no claim that one product clears every bird from a neighbourhood.",
    dimensions: [
      {
        label: "Purpose",
        optionA: "Close roost volumes on balconies, ducts and ledges",
        optionB: "Discourage perching on narrow edges",
      },
      {
        label: "Installation",
        optionA: "Measured mesh across openings after access review",
        optionB: "Fixed strips on ledges where birds sit",
      },
      {
        label: "Material",
        optionA: "Outdoor mesh grades and tension hardware",
        optionB: "Plastic or stainless spike strips",
      },
      {
        label: "Appearance",
        optionA: "Mesh across the opening; colour selectable",
        optionB: "Visible spike rows on ledges",
      },
      {
        label: "Durability",
        optionA: "UV grade, tension and sun exposure",
        optionB: "Depends on fixing surface and product grade",
      },
      {
        label: "Maintenance",
        optionA: "Debris and tension checks",
        optionB: "Debris between spikes; damaged strips",
      },
      {
        label: "Limitations",
        optionA: "Protects openings you cover—not the whole street",
        optionB: "May shift birds to the next unprotected ledge",
      },
      {
        label: "Cost factors",
        optionA: "Area, height, mesh and access",
        optionB: "Ledge length and product grade",
      },
    ],
    idealCustomerA:
      "Flats with repeated roosting inside balcony or duct volumes",
    idealCustomerB:
      "Narrow ledges where volume netting is unnecessary",
    idealApplicationA: "Balconies, ducts and AC trays with active roosts",
    idealApplicationB: "Thin ledges and parapet edges",
    decisionHelp: [
      "If birds sit inside a balcony volume, nets usually address the real roost.",
      "If only a thin ledge is used, spikes may be discussed—but gaps move birds sideways.",
      "Map landing spots before buying either option.",
    ],
    relatedProblemSlugs: ["pigeon-infestation", "building-bird-entry"],
    relatedFamilySlug: "bird-control",
  },
];

export const SERVICE_COMPARISON_MAP: Record<string, ServiceComparison> =
  Object.fromEntries(SERVICE_COMPARISONS.map((c) => [c.slug, c]));

export const SERVICE_COMPARISON_SLUGS = SERVICE_COMPARISONS.map((c) => c.slug);

export function getServiceComparison(slug: string): ServiceComparison | null {
  return SERVICE_COMPARISON_MAP[slug] ?? null;
}

/** Comparison useful for a problem page, if any. */
export function comparisonForProblem(problemSlug: string): ServiceComparison | null {
  return (
    SERVICE_COMPARISONS.find((c) =>
      c.relatedProblemSlugs.includes(problemSlug),
    ) ?? null
  );
}
