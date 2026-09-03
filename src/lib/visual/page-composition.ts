/**
 * §131–133 / §157–159 Premium page visual composition by page type.
 * Same design system, different section strategy — never one cloned layout.
 */

export type VisualPageType =
  | "home"
  | "service"
  | "city"
  | "city-service"
  | "locality"
  | "locality-service"
  | "property"
  | "project"
  | "guide"
  | "comparison"
  | "solution";

export type PageSectionId =
  | "trust-bar"
  | "breadcrumb"
  | "hero"
  | "quick-facts"
  | "problem-intent"
  | "primary-content"
  | "visual-explanation"
  | "services-solutions"
  | "comparison"
  | "process"
  | "projects"
  | "location-context"
  | "reviews"
  | "faq"
  | "related"
  | "final-cta";

export type HeroComposition =
  | "brand-bleed"
  | "service-split"
  | "city-context"
  | "service-local-split"
  | "locality-orient"
  | "locality-service-split"
  | "property-context"
  | "project-gallery-lead"
  | "editorial"
  | "decision-split";

export type LayoutId =
  | "HomeLayout"
  | "ServiceLayoutA"
  | "ServiceLayoutB"
  | "CityLayoutA"
  | "CityLayoutB"
  | "LocalityLayoutA"
  | "ProjectLayout"
  | "GuideLayout"
  | "ComparisonLayout"
  | "MoneyLocalLayout";

export type PageVisualStrategy = {
  pageType: VisualPageType;
  layout: LayoutId;
  hero: HeroComposition;
  sections: PageSectionId[];
  purpose: string;
  forbiddenCloneOf: string;
};

/** Section stacks differ by page type — do not force every section everywhere. */
export const PAGE_VISUAL_STRATEGIES: Record<VisualPageType, PageVisualStrategy> =
  {
    home: {
      pageType: "home",
      layout: "HomeLayout",
      hero: "brand-bleed",
      sections: [
        "trust-bar",
        "hero",
        "services-solutions",
        "visual-explanation",
        "projects",
        "location-context",
        "faq",
        "final-cta",
      ],
      purpose: "Brand proposition + service discovery + conversion",
      forbiddenCloneOf: "money landing templates",
    },
    service: {
      pageType: "service",
      layout: "ServiceLayoutA",
      hero: "service-split",
      sections: [
        "breadcrumb",
        "hero",
        "quick-facts",
        "problem-intent",
        "primary-content",
        "visual-explanation",
        "process",
        "projects",
        "comparison",
        "faq",
        "related",
        "final-cta",
      ],
      purpose: "Service decision + applications + evidence",
      forbiddenCloneOf: "homepage card stack",
    },
    city: {
      pageType: "city",
      layout: "CityLayoutA",
      hero: "city-context",
      sections: [
        "breadcrumb",
        "hero",
        "quick-facts",
        "services-solutions",
        "location-context",
        "projects",
        "faq",
        "final-cta",
      ],
      purpose: "City coverage + service discovery (not a branch claim)",
      forbiddenCloneOf: "service encyclopedia dump",
    },
    "city-service": {
      pageType: "city-service",
      layout: "MoneyLocalLayout",
      hero: "service-local-split",
      sections: [
        "breadcrumb",
        "hero",
        "problem-intent",
        "primary-content",
        "process",
        "projects",
        "location-context",
        "faq",
        "final-cta",
      ],
      purpose: "Service + city commercial intent",
      forbiddenCloneOf: "city hub with swapped H1",
    },
    locality: {
      pageType: "locality",
      layout: "LocalityLayoutA",
      hero: "locality-orient",
      sections: [
        "breadcrumb",
        "hero",
        "services-solutions",
        "location-context",
        "projects",
        "final-cta",
      ],
      purpose: "Local orientation + service path",
      forbiddenCloneOf: "city page with locality name only",
    },
    "locality-service": {
      pageType: "locality-service",
      layout: "MoneyLocalLayout",
      hero: "locality-service-split",
      sections: [
        "breadcrumb",
        "hero",
        "problem-intent",
        "primary-content",
        "projects",
        "faq",
        "final-cta",
      ],
      purpose: "Specific service in a specific locality",
      forbiddenCloneOf: "city-service with locality swap",
    },
    property: {
      pageType: "property",
      layout: "ServiceLayoutB",
      hero: "property-context",
      sections: [
        "breadcrumb",
        "hero",
        "primary-content",
        "services-solutions",
        "projects",
        "final-cta",
      ],
      purpose: "Property-type context + relevant services",
      forbiddenCloneOf: "generic service dump",
    },
    project: {
      pageType: "project",
      layout: "ProjectLayout",
      hero: "project-gallery-lead",
      sections: [
        "breadcrumb",
        "hero",
        "visual-explanation",
        "process",
        "related",
        "final-cta",
      ],
      purpose: "Real evidence first",
      forbiddenCloneOf: "stock photo as project claim",
    },
    guide: {
      pageType: "guide",
      layout: "GuideLayout",
      hero: "editorial",
      sections: [
        "breadcrumb",
        "hero",
        "primary-content",
        "visual-explanation",
        "comparison",
        "faq",
        "related",
        "final-cta",
      ],
      purpose: "Editorial information → commercial next step",
      forbiddenCloneOf: "sales landing with long article",
    },
    comparison: {
      pageType: "comparison",
      layout: "ComparisonLayout",
      hero: "decision-split",
      sections: [
        "breadcrumb",
        "hero",
        "comparison",
        "primary-content",
        "faq",
        "related",
        "final-cta",
      ],
      purpose: "Decision aid between real options",
      forbiddenCloneOf: "keyword doorway",
    },
    solution: {
      pageType: "solution",
      layout: "ServiceLayoutB",
      hero: "service-split",
      sections: [
        "breadcrumb",
        "hero",
        "problem-intent",
        "services-solutions",
        "comparison",
        "final-cta",
      ],
      purpose: "Problem → solutions → quote",
      forbiddenCloneOf: "service page clone",
    },
  };

export function getPageVisualStrategy(
  pageType: VisualPageType,
): PageVisualStrategy {
  return PAGE_VISUAL_STRATEGIES[pageType];
}

/** Visual variety matrix (§159) — hero / main visual / proof / CTA intent. */
export const PAGE_VISUAL_MATRIX: Record<
  VisualPageType,
  { heroFocus: string; mainVisual: string; proof: string; cta: string }
> = {
  home: {
    heroFocus: "Business",
    mainVisual: "Brand/project",
    proof: "Reviews/photos",
    cta: "Quote",
  },
  service: {
    heroFocus: "Service",
    mainVisual: "Application",
    proof: "Projects",
    cta: "Quote",
  },
  city: {
    heroFocus: "City + service",
    mainVisual: "Local context",
    proof: "Local projects",
    cta: "Area enquiry",
  },
  "city-service": {
    heroFocus: "Service + city",
    mainVisual: "Application",
    proof: "Local projects",
    cta: "Service quote",
  },
  locality: {
    heroFocus: "Locality",
    mainVisual: "Property/service",
    proof: "Local evidence",
    cta: "Visit",
  },
  "locality-service": {
    heroFocus: "Specific service",
    mainVisual: "Local application",
    proof: "Project",
    cta: "Quote",
  },
  property: {
    heroFocus: "Property",
    mainVisual: "Building/service",
    proof: "Project",
    cta: "Enquiry",
  },
  project: {
    heroFocus: "Project",
    mainVisual: "Gallery",
    proof: "Result",
    cta: "Similar project",
  },
  guide: {
    heroFocus: "Editorial",
    mainVisual: "Educational",
    proof: "Sources/author",
    cta: "Related service",
  },
  comparison: {
    heroFocus: "Decision",
    mainVisual: "Side-by-side",
    proof: "Evidence",
    cta: "Consultation",
  },
  solution: {
    heroFocus: "Problem",
    mainVisual: "Solution options",
    proof: "Related projects",
    cta: "Quote",
  },
};
