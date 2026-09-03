import { describe, expect, it } from "vitest";
import {
  getPageVisualStrategy,
  PAGE_VISUAL_MATRIX,
  PAGE_VISUAL_STRATEGIES,
} from "@/lib/visual/page-composition";
import {
  buildHeroHeadline,
  resolveHeroMedia,
  sourceRank,
} from "@/lib/visual/hero-media";
import {
  preferWebpPath,
  runVisualQualityGate,
  scoreImageRelevance,
} from "@/lib/visual/visual-quality";
import { buildPageMediaBundle } from "@/lib/visual/page-media";

describe("page visual composition §131–159", () => {
  it("defines a distinct strategy per page type", () => {
    const types = Object.keys(PAGE_VISUAL_STRATEGIES);
    expect(types.length).toBeGreaterThanOrEqual(10);

    const heroes = new Set(
      Object.values(PAGE_VISUAL_STRATEGIES).map((s) => s.hero),
    );
    expect(heroes.size).toBeGreaterThanOrEqual(6);

    const layouts = new Set(
      Object.values(PAGE_VISUAL_STRATEGIES).map((s) => s.layout),
    );
    expect(layouts.size).toBeGreaterThanOrEqual(6);
  });

  it("does not force identical section stacks across money pages", () => {
    const city = getPageVisualStrategy("city").sections.join("|");
    const cityService = getPageVisualStrategy("city-service").sections.join("|");
    const locality = getPageVisualStrategy("locality").sections.join("|");
    const service = getPageVisualStrategy("service").sections.join("|");
    expect(city).not.toBe(cityService);
    expect(city).not.toBe(locality);
    expect(service).not.toBe(cityService);
  });

  it("exposes the visual variety matrix", () => {
    expect(PAGE_VISUAL_MATRIX.guide.heroFocus).toBe("Editorial");
    expect(PAGE_VISUAL_MATRIX.project.proof).toBe("Result");
  });
});

describe("hero media + WebP §134–139", () => {
  it("prefers WebP paths for rasters", () => {
    expect(preferWebpPath("/images/a.jpg")).toBe("/images/a.webp");
    expect(preferWebpPath("/images/a.jpeg")).toBe("/images/a.webp");
    expect(preferWebpPath("/images/a.png")).toBe("/images/a.webp");
    expect(preferWebpPath("/images/a.webp")).toBe("/images/a.webp");
  });

  it("ranks authentic sources ahead of stock", () => {
    expect(sourceRank("real-project")).toBeLessThan(
      sourceRank("licensed-stock"),
    );
    expect(sourceRank("real-service-install")).toBeLessThan(
      sourceRank("illustrative-generated"),
    );
  });

  it("resolves service heroes from installation photos", () => {
    const hero = resolveHeroMedia({
      pageType: "service",
      serviceSlug: "safety-nets",
      h1: "Balcony Safety Nets",
    });
    expect(hero.src).toMatch(/\.webp$/i);
    expect(hero.priorityLoad).toBe(true);
    expect(hero.composition).toBe("service-split");
    expect(hero.isAuthenticProjectEvidence).toBe(true);
  });

  it("builds contextual headlines without stuffing", () => {
    expect(
      buildHeroHeadline({
        pageType: "city-service",
        serviceName: "Balcony Safety Nets",
        cityName: "Vijayawada",
      }),
    ).toBe("Balcony Safety Nets in Vijayawada");
  });

  it("builds a page media bundle with og + gallery", () => {
    const bundle = buildPageMediaBundle({
      pageType: "city",
      cityName: "Vijayawada",
      serviceSlug: "invisible-grills",
      h1: "Services in Vijayawada",
    });
    expect(bundle.heroImage.src).toMatch(/\.webp$/i);
    expect(bundle.ogImage).toMatch(/\.webp$/i);
    expect(bundle.galleryImages.length).toBeGreaterThan(0);
  });
});

describe("visual quality gate §179–180", () => {
  it("blocks publish when critical visual checks fail", () => {
    const result = runVisualQualityGate({
      pageType: "city",
      hasDedicatedHero: false,
      heroExplainsPage: true,
      meaningfulAboveFoldVisual: true,
      imagesRelevant: true,
      visualVarietyVsParent: true,
      visualVarietyVsSibling: true,
      imagesOptimized: true,
      rastersAreWebpOrNextOptimized: true,
      altTextsAccurate: true,
      mobileLayoutOk: true,
      feelsHumanNotAssembled: true,
    });
    expect(result.publish).toBe(false);
    expect(result.failures).toContain("missing-dedicated-hero");
  });

  it("rejects stock presented as project evidence", () => {
    const result = runVisualQualityGate({
      pageType: "project",
      hasDedicatedHero: true,
      heroExplainsPage: true,
      meaningfulAboveFoldVisual: true,
      imagesRelevant: true,
      visualVarietyVsParent: true,
      visualVarietyVsSibling: true,
      imagesOptimized: true,
      rastersAreWebpOrNextOptimized: true,
      altTextsAccurate: true,
      mobileLayoutOk: true,
      feelsHumanNotAssembled: true,
      claimsStockAsProject: true,
    });
    expect(result.publish).toBe(false);
    expect(result.failures).toContain("stock-presented-as-project");
  });

  it("scores relevance with authenticity weight", () => {
    const low = scoreImageRelevance({
      serviceMatch: false,
      locationMatch: false,
      pageMatch: false,
      visualQuality: 10,
      uniqueness: 10,
      authenticity: 4,
    });
    expect(low.publish).toBe(false);

    const high = scoreImageRelevance({
      serviceMatch: true,
      locationMatch: true,
      pageMatch: true,
      visualQuality: 20,
      uniqueness: 15,
      authenticity: 20,
    });
    expect(high.publish).toBe(true);
  });
});
