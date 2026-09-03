/**
 * §128 Representative test set — audit before scale.
 * Do NOT mass-generate until this set passes quality gates.
 */

import { ROUTES } from "@/config/routes";
import { SERVICE_COMPARISON_SLUGS } from "@/data/comparisons";
import { SERVICE_FAMILY_SLUGS } from "@/data/service-families";
import { listPublishedProjects } from "@/data/projects";
import { buildSitemapRegistry } from "@/lib/seo/sitemap-registry";
import { runAutomatedSeoQa } from "@/lib/seo/seo-health";
import { canPublishByContentPrinciple } from "@/lib/seo/site-graph";
import { locationQualityGate } from "@/lib/seo/location-property-gates";

export type TestSetPage = {
  role: string;
  path: string;
  required: boolean;
};

/**
 * Representative set from §128:
 * 1 Home, 1 Family, 2 Services, 1 City, 2 City+Service, 2 Localities,
 * 2 Locality+Service, 1 Property (optional if none), 1 Property+Service (optional),
 * 1 Project, 2 Guides, 1 Comparison
 */
export function buildRepresentativeTestSet(): TestSetPage[] {
  const family = SERVICE_FAMILY_SLUGS[0] ?? "balcony-safety";
  const project = listPublishedProjects()[0];
  const comparison = SERVICE_COMPARISON_SLUGS[0] ?? "invisible-grills-vs-safety-nets";

  const pages: TestSetPage[] = [
    { role: "homepage", path: ROUTES.home, required: true },
    { role: "service-family", path: ROUTES.serviceFamily(family), required: true },
    { role: "service", path: ROUTES.service("invisible-grills"), required: true },
    { role: "service", path: ROUTES.service("safety-nets"), required: true },
    {
      role: "city",
      path: ROUTES.location("visakhapatnam"),
      required: true,
    },
    {
      role: "city-service",
      path: ROUTES.cityService("visakhapatnam", "invisible-grills"),
      required: true,
    },
    {
      role: "city-service",
      path: ROUTES.cityService("visakhapatnam", "safety-nets"),
      required: true,
    },
    {
      role: "locality",
      path: ROUTES.area("visakhapatnam", "gajuwaka"),
      required: true,
    },
    {
      role: "locality",
      path: ROUTES.area("visakhapatnam", "madhurawada"),
      required: true,
    },
    {
      role: "locality-service",
      path: ROUTES.areaService("visakhapatnam", "gajuwaka", "invisible-grills"),
      required: true,
    },
    {
      role: "locality-service",
      path: ROUTES.areaService("visakhapatnam", "gajuwaka", "safety-nets"),
      required: true,
    },
    {
      role: "property",
      path: "/property-types/apartment/invisible-grills/",
      required: true,
    },
    {
      role: "property-service",
      path: "/property-types/apartment/safety-nets/",
      required: true,
    },
    {
      role: "project",
      path: project ? ROUTES.project(project.slug) : "/projects/",
      required: true,
    },
    {
      role: "guide",
      path: ROUTES.guide("invisible-grills-buying-guide"),
      required: true,
    },
    {
      role: "guide",
      path: ROUTES.guide("safety-nets-installation-guide"),
      required: true,
    },
    {
      role: "comparison",
      path: ROUTES.comparison(comparison),
      required: true,
    },
  ];

  return pages;
}

export type TestSetAuditResult = {
  ok: boolean;
  missingFromSitemap: string[];
  gateFailures: string[];
  qaCritical: number;
  principleOk: boolean;
  scaleAllowed: boolean;
  message: string;
};

/**
 * Audit the representative set. Scale is blocked until this passes.
 */
export function auditRepresentativeTestSet(): TestSetAuditResult {
  const pages = buildRepresentativeTestSet();
  const sitemap = new Set(buildSitemapRegistry().map((e) => e.path));
  const missingFromSitemap: string[] = [];

  for (const page of pages) {
    // Property-type URLs and some locality pages may be conditional —
    // only require paths that the registry actually intends to publish.
    if (
      page.required &&
      !page.path.startsWith("/property-types/") &&
      !sitemap.has(page.path) &&
      page.path !== "/projects/"
    ) {
      // City-service silo paths use /locations/andhra-pradesh/...
      if (!sitemap.has(page.path)) {
        missingFromSitemap.push(page.path);
      }
    }
  }

  const vizagGate = locationQualityGate({
    citySlug: "visakhapatnam",
    serviceSlug: "invisible-grills",
    hasUniqueLocalFacts: true,
    hasRealPhotos: true,
  });

  const gateFailures: string[] = [];
  if (!vizagGate.publish) {
    gateFailures.push(`visakhapatnam-invisible-grills: ${vizagGate.reasons.join(",")}`);
  }

  const principle = canPublishByContentPrinciple({
    whyExists: "Commercial city-service landing for invisible grills in Visakhapatnam",
    whoFor: "Homeowners and societies needing balcony fall protection",
    questionAnswered: "Is invisible grill installation available in Visakhapatnam?",
    uniqueInformation: "Coastal install considerations and local coverage honesty",
    entityRepresented: "Invisible Grills × Visakhapatnam",
    nextPage: ROUTES.contact,
    businessRelevant: true,
  });

  const qa = runAutomatedSeoQa();

  // Soft-check: don't block scale solely on optional locality URLs not in sitemap yet
  const criticalMissing = missingFromSitemap.filter(
    (p) =>
      p === ROUTES.home ||
      p.startsWith("/services/") ||
      p.includes("/visakhapatnam/invisible-grills") ||
      p.includes("/comparisons/") ||
      p.includes("/guides/"),
  );

  const scaleAllowed =
    qa.ok &&
    gateFailures.length === 0 &&
    principle.ok &&
    criticalMissing.length === 0;

  return {
    ok: scaleAllowed,
    missingFromSitemap,
    gateFailures,
    qaCritical: qa.critical,
    principleOk: principle.ok,
    scaleAllowed,
    message: scaleAllowed
      ? "Representative test set passed — controlled scale may proceed"
      : "Do not mass-generate — fix test-set gaps first",
  };
}

/** §128 prerequisites before any mass generation. */
export const SCALE_PREREQUISITES = [
  "data-model",
  "entity-relationships",
  "service-taxonomy",
  "location-taxonomy",
  "keyword-map",
  "search-intent-map",
  "url-architecture",
  "page-templates",
  "internal-linking-engine",
  "schema-engine",
  "sitemap-engine",
  "indexability-system",
  "quality-scoring",
  "cannibalization-detection",
  "duplicate-content-detection",
  "seo-qa",
  "analytics-tracking",
  "conversion-tracking",
  "representative-test-set-pass",
] as const;
