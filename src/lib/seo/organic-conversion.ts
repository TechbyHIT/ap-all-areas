/**
 * §114–115 Organic conversion + content → conversion next steps.
 */

import { ROUTES } from "@/config/routes";
import type { PageContentFocus } from "@/lib/seo/content-blocks";

export type OrganicFunnelStage =
  | "organic-landing"
  | "service"
  | "location"
  | "enquiry"
  | "lead"
  | "sale";

export const ORGANIC_FUNNEL: OrganicFunnelStage[] = [
  "organic-landing",
  "service",
  "location",
  "enquiry",
  "lead",
  "sale",
];

export type ConversionNextStep = {
  from: PageContentFocus;
  label: string;
  href: string;
  why: string;
};

/** Every informational/commercial page type gets an appropriate next step. */
export function contentToConversionNextStep(input: {
  focus: PageContentFocus;
  serviceSlug?: string;
  citySlug?: string;
  localitySlug?: string;
  projectServiceSlug?: string;
}): ConversionNextStep {
  const service = input.serviceSlug ?? "invisible-grills";
  const city = input.citySlug ?? "visakhapatnam";

  switch (input.focus) {
    case "guide":
      return {
        from: "guide",
        label: "View service options",
        href: ROUTES.service(service),
        why: "Guide → Service",
      };
    case "service":
      return {
        from: "service",
        label: "Check city coverage",
        href: ROUTES.cityService(city, service),
        why: "Service → City",
      };
    case "city":
      return {
        from: "city",
        label: "Browse localities",
        href: ROUTES.location(city),
        why: "City → Locality discovery",
      };
    case "locality":
      return {
        from: "locality",
        label: "Request a quote",
        href: ROUTES.contact,
        why: "Locality → Quote",
      };
    case "project":
      return {
        from: "project",
        label: "Discuss a similar job",
        href: ROUTES.service(input.projectServiceSlug ?? service),
        why: "Project → Similar service",
      };
    case "comparison":
      return {
        from: "comparison",
        label: "Request a quote",
        href: ROUTES.contact,
        why: "Comparison → Conversion",
      };
    case "property":
      return {
        from: "property",
        label: "Share property photos",
        href: ROUTES.contact,
        why: "Property → Quote",
      };
    default:
      return {
        from: "home",
        label: "Request a quote",
        href: ROUTES.contact,
        why: "Home → Conversion",
      };
  }
}

export type OrganicConversionEvent = {
  landingPage: string;
  service?: string | null;
  location?: string | null;
  stage: OrganicFunnelStage;
  source?: string | null;
};
