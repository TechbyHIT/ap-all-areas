import { describe, expect, it } from "vitest";
import { SERVICE_COMPARISON_SLUGS } from "@/data/comparisons";
import { getServiceSemanticModel } from "@/data/service-semantic-model";
import { checkCannibalization } from "@/lib/seo/cannibalization";
import {
  PAGE_QUALITY_PUBLISH,
  scorePageQuality,
} from "@/lib/seo/page-quality";
import { canPublishProgrammaticPage } from "@/lib/seo/page-decision";
import {
  prioritizeInternalLinks,
  serviceHubLinkGraph,
} from "@/lib/seo/internal-links";
import { auditLocalEntityFreshness, LOCAL_ENTITY } from "@/lib/seo/local-entity";

describe("comparisons (§24)", () => {
  it("ships only a small genuine set", () => {
    expect(SERVICE_COMPARISON_SLUGS.length).toBeGreaterThanOrEqual(2);
    expect(SERVICE_COMPARISON_SLUGS.length).toBeLessThanOrEqual(5);
    expect(SERVICE_COMPARISON_SLUGS).toContain(
      "invisible-grills-vs-safety-nets",
    );
  });
});

describe("page quality (§35)", () => {
  it("bands publish / review / noindex correctly", () => {
    const high = scorePageQuality({
      hasUniqueLocalFacts: true,
      hasRealPhotos: true,
      hasTrustContact: true,
      hasInternalLinks: true,
      searchIntentClarity: 15,
      serviceSpecificity: 15,
      usefulInformation: 15,
    });
    expect(high.total).toBeGreaterThanOrEqual(PAGE_QUALITY_PUBLISH);
    expect(high.band).toBe("publish");

    const doorway = scorePageQuality({ isDoorwayRisk: true, hasUniqueLocalFacts: false });
    expect(doorway.band === "rewrite" || doorway.band === "noindex" || doorway.band === "review").toBe(
      true,
    );
  });
});

describe("cannibalization (§36)", () => {
  it("forces keyword×city to silo owner", () => {
    const result = checkCannibalization({
      candidatePath: "/balcony-safety-nets-in-visakhapatnam/",
      kind: "keyword-city",
      keywordSlug: "balcony-safety-nets",
      citySlug: "visakhapatnam",
    });
    expect(result.action).toBe("canonicalize");
    expect(result.ownerPath).toContain("/locations/andhra-pradesh/visakhapatnam/safety-nets/");
  });
});

describe("programmatic gate (§33–34)", () => {
  it("allows unique city-service with facts", () => {
    const result = canPublishProgrammaticPage({
      decision: {
        kind: "city-service",
        citySlug: "vijayawada",
        serviceSlug: "invisible-grills",
      },
      candidatePath: "/locations/andhra-pradesh/vijayawada/invisible-grills/",
      kind: "city-service",
      hasUniqueLocalFacts: true,
      hasRealPhotos: true,
    });
    expect(result.publish).toBe(true);
  });
});

describe("semantic model (§27–29)", () => {
  it("defines canonical names for core services", () => {
    const model = getServiceSemanticModel("invisible-grills");
    expect(model?.canonicalName).toBe("Invisible Grills");
    expect(model?.aliases.length).toBeGreaterThan(0);
  });
});

describe("internal link priority (§40)", () => {
  it("ranks conversion and strategic hubs higher", () => {
    const graph = serviceHubLinkGraph("safety-nets");
    const ranked = prioritizeInternalLinks([
      ...graph.locations,
      ...graph.conversion,
      ...graph.children,
    ]);
    expect(ranked[0]?.relation).toBe("conversion");
  });
});

describe("local entity (§30)", () => {
  it("exposes one business identity source", () => {
    expect(LOCAL_ENTITY.name).toContain("Hiranya");
    expect(LOCAL_ENTITY.phoneRaw.length).toBe(10);
    expect(Array.isArray(auditLocalEntityFreshness())).toBe(true);
  });
});
