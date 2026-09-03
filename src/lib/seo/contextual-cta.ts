/**
 * §68–70 Contextual CTA + lead-form context.
 */

import { ROUTES } from "@/config/routes";

export type PageIntentKind =
  | "service"
  | "city"
  | "locality"
  | "property"
  | "guide"
  | "project"
  | "comparison"
  | "solution"
  | "home"
  | "contact";

export type ContextualCta = {
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  whatsappHint: string;
  intent: PageIntentKind;
};

export function contextualCta(input: {
  kind: PageIntentKind;
  serviceName?: string;
  cityName?: string;
  localityName?: string;
}): ContextualCta {
  const service = input.serviceName ?? "installation";
  const city = input.cityName ?? "Andhra Pradesh";

  switch (input.kind) {
    case "service":
      return {
        intent: "service",
        primaryLabel: "Request a Quote",
        primaryHref: ROUTES.contact,
        secondaryLabel: "WhatsApp photos",
        whatsappHint: `Hello, I would like a quote for ${service} in ${city}.`,
      };
    case "city":
      return {
        intent: "city",
        primaryLabel: "Check Service Availability",
        primaryHref: ROUTES.contact,
        secondaryLabel: "Call for coverage",
        whatsappHint: `Hello, please check service availability in ${city}.`,
      };
    case "locality":
      return {
        intent: "locality",
        primaryLabel: "Request a Visit",
        primaryHref: ROUTES.contact,
        secondaryLabel: "WhatsApp location",
        whatsappHint: `Hello, I would like a site visit in ${input.localityName ?? "my locality"}, ${city}.`,
      };
    case "property":
      return {
        intent: "property",
        primaryLabel: "Share Property Photos",
        primaryHref: ROUTES.contact,
        secondaryLabel: "WhatsApp photos",
        whatsappHint: `Hello, sharing property photos for a ${service} quote in ${city}.`,
      };
    case "guide":
      return {
        intent: "guide",
        primaryLabel: "Compare Service Options",
        primaryHref: ROUTES.comparisons,
        secondaryLabel: "Request advice",
        whatsappHint: `Hello, I need help choosing the right option after reading your guide.`,
      };
    case "project":
      return {
        intent: "project",
        primaryLabel: "Discuss a Similar Requirement",
        primaryHref: ROUTES.contact,
        secondaryLabel: "WhatsApp similar job",
        whatsappHint: `Hello, I saw a project photo and need a similar ${service} installation.`,
      };
    case "comparison":
      return {
        intent: "comparison",
        primaryLabel: "Request a Quote",
        primaryHref: ROUTES.contact,
        secondaryLabel: "Ask which fits",
        whatsappHint: `Hello, I compared options and need help choosing ${service}.`,
      };
    case "solution":
      return {
        intent: "solution",
        primaryLabel: "Request a Quote",
        primaryHref: ROUTES.contact,
        secondaryLabel: "Describe the problem",
        whatsappHint: `Hello, I need help with a property problem related to ${service}.`,
      };
    case "contact":
      return {
        intent: "contact",
        primaryLabel: "Send Enquiry",
        primaryHref: ROUTES.contact,
        secondaryLabel: "Call now",
        whatsappHint: `Hello, I would like a quotation.`,
      };
    default:
      return {
        intent: "home",
        primaryLabel: "Request a Quote",
        primaryHref: ROUTES.contact,
        secondaryLabel: "WhatsApp",
        whatsappHint: `Hello, I would like a quotation for installation in Andhra Pradesh.`,
      };
  }
}

export type LeadFormDefaults = {
  service?: string;
  city?: string;
  locality?: string;
  propertyType?: string;
  requirement?: string;
};

/** §70 Prefill lead form from page context. */
export function leadFormDefaultsFromPage(input: {
  serviceSlug?: string;
  cityName?: string;
  localityName?: string;
  propertyType?: string;
  requirement?: string;
}): LeadFormDefaults {
  return {
    service: input.serviceSlug,
    city: input.cityName,
    locality: input.localityName,
    propertyType: input.propertyType,
    requirement: input.requirement,
  };
}

export const LEAD_FORM_FIELDS = [
  "name",
  "phone",
  "email",
  "city",
  "locality",
  "service",
  "propertyType",
  "requirement",
  "photo",
  "message",
] as const;
