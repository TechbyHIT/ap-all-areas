import { describe, expect, it } from "vitest";
import { MAIN_NAV } from "@/config/navigation";
import { SERVICE_COMPARISONS } from "@/data/comparisons";
import {
  buildAvailabilityMatrix,
  isMatrixCellIndexable,
} from "@/lib/seo/availability-matrix";
import {
  allowGeographicComparisonPage,
  buildComparisonTableRows,
  STANDARD_COMPARISON_FACTORS,
} from "@/lib/seo/comparison-tables";
import {
  CONTENT_BLOCK_TYPES,
  PAGE_TYPE_BLOCK_FOCUS,
  primaryFocusForPageType,
} from "@/lib/seo/content-blocks";
import {
  authorshipAllowed,
  listRelevantLegalPages,
  SEO_CHANGE_LOG,
} from "@/lib/seo/content-governance";
import {
  assessCrawlUrl,
  classifyHttpStatus,
  estimateCrawlDepth,
  normalizePublicUrlPath,
} from "@/lib/seo/crawl-url-qa";
import {
  getLocalBusinessModel,
  isPhysicalLocationSchemaAllowed,
  LOCATION_CLAIM_POLICY,
} from "@/lib/seo/local-business-model";
import {
  findPrivacyRisks,
  locationQualityGate,
  propertyQualityGate,
} from "@/lib/seo/location-property-gates";
import { nearbyCitiesFor } from "@/lib/seo/nearby-locations";
import {
  buildSeoHealthDashboard,
  runAutomatedSeoQa,
} from "@/lib/seo/seo-health";
import { designSystemCoverage } from "@/lib/seo/ux-a11y-policy";

describe("comparison tables (§82–83)", () => {
  it("builds standard factor rows without inventing city-vs-city pages", () => {
    const comparison = SERVICE_COMPARISONS[0]!;
    const rows = buildComparisonTableRows(comparison);
    expect(rows.some((r) => r.label === "Best for")).toBe(true);
    expect(
      rows.some((r) =>
        (STANDARD_COMPARISON_FACTORS as readonly string[]).includes(r.label),
      ),
    ).toBe(true);
    expect(allowGeographicComparisonPage("")).toBe(false);
    expect(
      allowGeographicComparisonPage(
        "Users compare monsoon coastal install access between two port cities for logistics planning.",
      ),
    ).toBe(true);
  });
});

describe("nearby + service area transparency (§84–87)", () => {
  it("exposes business model without fake branches", () => {
    const model = getLocalBusinessModel();
    expect(model.business.name).toContain("Hiranya");
    expect(LOCATION_CLAIM_POLICY["service-area"].allowedOnSchema).toBe(false);
    expect(typeof isPhysicalLocationSchemaAllowed()).toBe("boolean");
    expect(Array.isArray(nearbyCitiesFor("visakhapatnam"))).toBe(true);
  });
});

describe("availability + gates + privacy (§88–91)", () => {
  it("builds matrix and enforces gates/privacy", () => {
    const matrix = buildAvailabilityMatrix({ includeLocalities: false });
    expect(matrix.length).toBeGreaterThan(0);
    expect(isMatrixCellIndexable(matrix[0]!)).toBe(
      matrix[0]!.available && matrix[0]!.status !== "draft",
    );

    const loc = locationQualityGate({
      citySlug: "visakhapatnam",
      serviceSlug: "invisible-grills",
      hasUniqueLocalFacts: true,
    });
    expect(loc.publish).toBe(true);

    const property = propertyQualityGate({
      propertyExists: false,
      propertyNameAccurate: true,
      businessRelevance: true,
      serviceRelevant: true,
      usefulInformation: true,
      privacySafe: true,
      noFabricatedProjects: true,
    });
    expect(property.publish).toBe(false);

    expect(findPrivacyRisks("Visit flat no. 12B tomorrow").length).toBeGreaterThan(
      0,
    );
  });
});

describe("content blocks + nav (§93–100)", () => {
  it("personalizes blocks and keeps main nav compact", () => {
    expect(CONTENT_BLOCK_TYPES).toContain("PricingFactors");
    expect(PAGE_TYPE_BLOCK_FOCUS.city[0]).toBe("Hero");
    expect(primaryFocusForPageType("locality")).toMatch(/locality/i);
    expect(MAIN_NAV.map((n) => n.label)).toEqual([
      "Home",
      "Services",
      "Areas",
      "Projects",
      "Guides",
      "About",
      "Contact",
    ]);
    expect(MAIN_NAV.length).toBeLessThanOrEqual(8);
  });
});

describe("crawl / http / governance (§101–109)", () => {
  it("normalizes URLs and classifies status", () => {
    expect(assessCrawlUrl({ pathname: "/Services/", search: "?utm_source=x" }).ok).toBe(
      false,
    );
    expect(normalizePublicUrlPath("/Services").path).toBe("/services/");
    expect(estimateCrawlDepth("/locations/andhra-pradesh/visakhapatnam/")).toBe(3);
    expect(classifyHttpStatus(308).expected).toBe(true);
    expect(classifyHttpStatus(500).ok).toBe(false);
    expect(listRelevantLegalPages().length).toBeGreaterThan(0);
    expect(authorshipAllowed({ name: "", role: "Editor" })).toBe(false);
    expect(SEO_CHANGE_LOG.length).toBeGreaterThan(0);
    expect(designSystemCoverage().a11y).toContain("alt-text");
  });
});

describe("SEO QA + dashboards (§110–112)", () => {
  it("runs QA and builds health snapshot", () => {
    const qa = runAutomatedSeoQa();
    expect(typeof qa.ok).toBe("boolean");
    const health = buildSeoHealthDashboard();
    expect(health.totals.sitemapUrls).toBeGreaterThan(0);
  });
});
