/**
 * §92–94 Content duplication control, block types, personalization.
 */

export type ContentBlockType =
  | "Hero"
  | "ServiceSummary"
  | "ProblemSection"
  | "ApplicationGrid"
  | "MaterialComparison"
  | "ProcessSteps"
  | "PricingFactors"
  | "LocationCoverage"
  | "ProjectGrid"
  | "ReviewGrid"
  | "FAQ"
  | "GuideLinks"
  | "RelatedServices"
  | "CTA";

export const CONTENT_BLOCK_TYPES: ContentBlockType[] = [
  "Hero",
  "ServiceSummary",
  "ProblemSection",
  "ApplicationGrid",
  "MaterialComparison",
  "ProcessSteps",
  "PricingFactors",
  "LocationCoverage",
  "ProjectGrid",
  "ReviewGrid",
  "FAQ",
  "GuideLinks",
  "RelatedServices",
  "CTA",
];

export type PageContentFocus =
  | "service"
  | "city"
  | "locality"
  | "property"
  | "project"
  | "guide"
  | "comparison"
  | "home";

/** Which blocks are primary for each page type (§94). */
export const PAGE_TYPE_BLOCK_FOCUS: Record<PageContentFocus, ContentBlockType[]> = {
  service: [
    "Hero",
    "ServiceSummary",
    "ProblemSection",
    "ApplicationGrid",
    "MaterialComparison",
    "ProcessSteps",
    "PricingFactors",
    "ProjectGrid",
    "FAQ",
    "RelatedServices",
    "CTA",
  ],
  city: [
    "Hero",
    "LocationCoverage",
    "ServiceSummary",
    "ProjectGrid",
    "GuideLinks",
    "CTA",
  ],
  locality: [
    "Hero",
    "LocationCoverage",
    "ServiceSummary",
    "ProjectGrid",
    "CTA",
  ],
  property: ["Hero", "ServiceSummary", "ProjectGrid", "CTA"],
  project: ["Hero", "ProjectGrid", "RelatedServices", "CTA"],
  guide: ["Hero", "ProcessSteps", "MaterialComparison", "FAQ", "GuideLinks", "CTA"],
  comparison: ["Hero", "MaterialComparison", "FAQ", "RelatedServices", "CTA"],
  home: [
    "Hero",
    "ServiceSummary",
    "ProjectGrid",
    "LocationCoverage",
    "CTA",
  ],
};

/** Boilerplate kinds that must not be copy-pasted across hundreds of pages. */
export type DuplicationRiskKind =
  | "introduction"
  | "benefits"
  | "process"
  | "faq"
  | "pricing"
  | "cta"
  | "service-description";

export const DUPLICATION_POLICY: Record<
  DuplicationRiskKind,
  { reusableComponentOk: boolean; identicalParagraphOk: boolean; note: string }
> = {
  introduction: {
    reusableComponentOk: false,
    identicalParagraphOk: false,
    note: "Intros must vary by entity (service/city/locality).",
  },
  benefits: {
    reusableComponentOk: true,
    identicalParagraphOk: false,
    note: "Shared benefit components OK; not identical body paragraphs.",
  },
  process: {
    reusableComponentOk: true,
    identicalParagraphOk: true,
    note: "Core process steps may be shared as a component.",
  },
  faq: {
    reusableComponentOk: true,
    identicalParagraphOk: false,
    note: "FAQ ownership per page type — no identical blocks everywhere.",
  },
  pricing: {
    reusableComponentOk: true,
    identicalParagraphOk: true,
    note: "Pricing-factor lists are shared business truth; no fake rates.",
  },
  cta: {
    reusableComponentOk: true,
    identicalParagraphOk: false,
    note: "CTA component OK; copy should follow page intent.",
  },
  "service-description": {
    reusableComponentOk: false,
    identicalParagraphOk: false,
    note: "Service descriptions belong on service hubs, not city doorways.",
  },
};

export function primaryFocusForPageType(focus: PageContentFocus): string {
  const map: Record<PageContentFocus, string> = {
    service: "Focus on the service entity and decision factors.",
    city: "Focus on city coverage and logistics — not a homepage clone.",
    locality: "Focus on local service access for this locality.",
    property: "Focus on the property type / named property context.",
    project: "Focus on the actual documented work.",
    guide: "Focus on informational answers.",
    comparison: "Focus on factual differences between options.",
    home: "Brand + service discovery + conversion.",
  };
  return map[focus];
}
