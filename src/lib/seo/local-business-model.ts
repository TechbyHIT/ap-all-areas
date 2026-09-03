/**
 * §85–87 Service-area transparency + local business data model.
 * Single source of truth wrapping BUSINESS_CONFIG — no branch fiction.
 */

import { BUSINESS_CONFIG } from "@/config/business";
import { LOCAL_ENTITY } from "@/lib/seo/local-entity";
import { P0_MONEY_CITY_SLUGS } from "@/data/city-local-profiles";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { listPublishedProjects } from "@/data/projects";
import { listPublishableReviews } from "@/data/reviews";
import { ROUTES } from "@/config/routes";

export type LocationKind =
  | "office"
  | "branch"
  | "service-area"
  | "project-location"
  | "delivery-area";

export type LocationClaim = {
  kind: LocationKind;
  label: string;
  allowedOnSchema: boolean;
  note: string;
};

/** How to talk about places without implying fake branches. */
export const LOCATION_CLAIM_POLICY: Record<LocationKind, LocationClaim> = {
  office: {
    kind: "office",
    label: "Office / registered address",
    allowedOnSchema: true,
    note: "Use PostalAddress / LocalBusiness only for verified physical premises.",
  },
  branch: {
    kind: "branch",
    label: "Branch",
    allowedOnSchema: false,
    note: "Do not claim branches unless a real staffed location exists.",
  },
  "service-area": {
    kind: "service-area",
    label: "Service area",
    allowedOnSchema: false,
    note: "City/locality pages are coverage planning URLs — not shops.",
  },
  "project-location": {
    kind: "project-location",
    label: "Project location",
    allowedOnSchema: false,
    note: "Only when a verified project record includes that place.",
  },
  "delivery-area": {
    kind: "delivery-area",
    label: "Delivery / travel coverage",
    allowedOnSchema: false,
    note: "Coverage is confirmed per enquiry after site review.",
  },
};

export function isPhysicalLocationSchemaAllowed(): boolean {
  return (
    BUSINESS_CONFIG.coordinates.latitude != null &&
    BUSINESS_CONFIG.coordinates.longitude != null &&
    Boolean(BUSINESS_CONFIG.address.street)
  );
}

/**
 * §87 Local business graph — contact, locations, areas, services, projects, reviews.
 */
export function getLocalBusinessModel() {
  const social = Object.entries(BUSINESS_CONFIG.socialLinks)
    .filter(([, url]) => url && !url.includes("["))
    .map(([network, url]) => ({ network, url }));

  return {
    business: {
      name: LOCAL_ENTITY.name,
      legalName: LOCAL_ENTITY.legalName,
      websiteUrl: LOCAL_ENTITY.websiteUrl,
    },
    contact: {
      phone: LOCAL_ENTITY.phoneDisplay,
      email: LOCAL_ENTITY.email,
    },
    physicalLocations: isPhysicalLocationSchemaAllowed()
      ? [
          {
            kind: "office" as const,
            address: LOCAL_ENTITY.address,
            coordinates: BUSINESS_CONFIG.coordinates,
          },
        ]
      : [],
    serviceAreas: {
      state: LOCAL_ENTITY.state,
      primaryCity: LOCAL_ENTITY.primaryCity,
      displayText: LOCAL_ENTITY.serviceAreaText,
      kind: "service-area" as const,
      cities: [...P0_MONEY_CITY_SLUGS],
    },
    services: INITIAL_SERVICES.filter((s) => s.allowIndexing).map((s) => ({
      slug: s.slug,
      name: s.name,
      href: ROUTES.service(s.slug),
    })),
    cities: [...P0_MONEY_CITY_SLUGS],
    localities: [] as string[], // filled per-city from catalog when rendering
    projects: listPublishedProjects().map((p) => p.slug),
    reviews: listPublishableReviews().map((r) => r.id),
    socialProfiles: social,
  };
}
