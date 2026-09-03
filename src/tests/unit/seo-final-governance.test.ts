import { describe, expect, it } from "vitest";
import { allowCalendarArticle, seasonalThemesForMonth } from "@/lib/seo/content-calendar";
import { recommendDeletionAction } from "@/lib/seo/content-deletion";
import {
  NEW_SERVICE_WORKFLOW,
  workflowProgress,
} from "@/lib/seo/entity-workflows";
import {
  contentToConversionNextStep,
  ORGANIC_FUNNEL,
} from "@/lib/seo/organic-conversion";
import { evaluateProjectFreshness } from "@/lib/seo/project-freshness";
import {
  auditRepresentativeTestSet,
  buildRepresentativeTestSet,
  SCALE_PREREQUISITES,
} from "@/lib/seo/representative-test-set";
import { detectCopyRedFlags, ALL_SEO_RED_FLAGS } from "@/lib/seo/seo-red-flags";
import { scoreSeoPriority } from "@/lib/seo/seo-priority";
import {
  canPublishByContentPrinciple,
  SEO_JOURNEY,
  USER_JOURNEY,
} from "@/lib/seo/site-graph";

describe("SEO priority (§113)", () => {
  it("does not prioritize traffic-only pages", () => {
    const defer = scoreSeoPriority({
      businessValue: 0,
      searchDemand: 0,
      currentImpressions: 15,
      rankingOpportunity: 0,
      conversionPotential: 0,
      contentQuality: 0,
      highTrafficOnly: true,
    });
    expect(defer.band).toBe("defer");

    const p0 = scoreSeoPriority({
      businessValue: 18,
      searchDemand: 12,
      currentImpressions: 10,
      rankingOpportunity: 12,
      conversionPotential: 18,
      contentQuality: 12,
    });
    expect(p0.band).toBe("p0");
  });
});

describe("conversion models (§114–115)", () => {
  it("maps content to next conversion steps", () => {
    expect(ORGANIC_FUNNEL[0]).toBe("organic-landing");
    expect(contentToConversionNextStep({ focus: "guide" }).why).toBe(
      "Guide → Service",
    );
    expect(contentToConversionNextStep({ focus: "locality" }).href).toContain(
      "contact",
    );
  });
});

describe("calendar + freshness + workflows (§116–122)", () => {
  it("blocks frequency-only posts and tracks workflows", () => {
    expect(
      allowCalendarArticle({
        justifiedByDemand: false,
        postingForFrequencyOnly: true,
      }),
    ).toBe(false);
    expect(seasonalThemesForMonth(6).length).toBeGreaterThan(0);

    const freshness = evaluateProjectFreshness({
      projectSlug: "demo",
      completed: {
        "add-project": true,
        "connect-service": true,
        "add-images": true,
        "add-internal-links": true,
        "update-sitemap": true,
      },
      blockers: [],
    });
    expect(freshness.ready).toBe(true);

    const progress = workflowProgress(
      NEW_SERVICE_WORKFLOW,
      new Set(["entity", "family"]),
    );
    expect(progress.complete).toBe(false);
    expect(progress.remaining[0]?.id).toBe("intent");
  });
});

describe("deletion + red flags (§123–124)", () => {
  it("recommends actions and detects stuffing/fake claims", () => {
    expect(
      recommendDeletionAction({
        qualityScore: 40,
        hasTraffic: false,
        hasConversions: false,
        isDuplicate: false,
        isObsoleteService: false,
        isFakeOrMisleading: true,
      }).action,
    ).toBe("delete");

    const flags = detectCopyRedFlags({
      body: "best cheap best cheap nets",
      claimsLocalBranch: true,
      hasCoordinates: false,
      inSitemap: true,
      noindex: true,
    });
    expect(flags.some((f) => f.flag === "keyword-stuffing")).toBe(true);
    expect(flags.some((f) => f.flag === "fake-local-claims")).toBe(true);
    expect(flags.some((f) => f.flag === "sitemap-noindex-mismatch")).toBe(true);
    expect(ALL_SEO_RED_FLAGS.length).toBeGreaterThan(10);
  });
});

describe("principles + test set (§125–130)", () => {
  it("enforces publish justification and audits representative set", () => {
    expect(SEO_JOURNEY.join("→")).toContain("ENTITY");
    expect(USER_JOURNEY.at(-1)).toBe("Contact");

    expect(
      canPublishByContentPrinciple({
        whyExists: "x",
        businessRelevant: true,
      }).ok,
    ).toBe(false);

    expect(
      canPublishByContentPrinciple({
        whyExists: "City service landing for balcony protection",
        whoFor: "Apartment owners in Visakhapatnam",
        questionAnswered: "Can we install invisible grills here?",
        uniqueInformation: "Coastal hardware considerations",
        entityRepresented: "Invisible Grills × Visakhapatnam",
        nextPage: "/contact/",
        businessRelevant: true,
      }).ok,
    ).toBe(true);

    const pages = buildRepresentativeTestSet();
    expect(pages.length).toBeGreaterThanOrEqual(15);
    expect(SCALE_PREREQUISITES).toContain("representative-test-set-pass");

    const audit = auditRepresentativeTestSet();
    expect(typeof audit.scaleAllowed).toBe("boolean");
    expect(audit.message.length).toBeGreaterThan(10);
  });
});
