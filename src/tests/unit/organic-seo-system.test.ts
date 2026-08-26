import { describe, expect, it } from "vitest";
import { STATE_SLUG } from "@/config/geo";
import { selectContentModules } from "@/data/content-modules";
import {
  getCity,
  getCityServices,
  isServiceAvailableInCity,
  listEnabledCities,
} from "@/lib/data/location-catalog";
import { shouldGeneratePage } from "@/lib/seo/page-decision";
import { buildSeoPageRecords } from "@/lib/seo/page-records";
import { SEO_PUBLISH_MIN_SCORE, scoreSeoPage } from "@/lib/seo/seo-score";
import { isPageIndexable } from "@/lib/publishing/indexability";
import { buildSitemapRegistry } from "@/lib/seo/sitemap-registry";

describe("location catalog", () => {
  it("lists every enabled Andhra Pradesh city with unique profiles", () => {
    const cities = listEnabledCities();
    expect(cities.map((c) => c.slug)).toEqual([
      "visakhapatnam",
      "vijayawada",
      "guntur",
      "tirupati",
      "rajamahendravaram",
      "kakinada",
      "nellore",
      "kurnool",
      "anantapur",
    ]);
    expect(cities.every((city) => city.indexable && city.enabled)).toBe(true);
  });

  it("does not treat an unconfirmed town as an enabled commercial city", () => {
    expect(getCity(STATE_SLUG, "eluru")).toBeNull();
    expect(
      isServiceAvailableInCity(STATE_SLUG, "eluru", "invisible-grills"),
    ).toBe(false);
  });

  it("exposes the four core services for each enabled city", () => {
    const services = getCityServices(STATE_SLUG, "vijayawada");
    expect(services.map((s) => s.slug).sort()).toEqual([
      "cloth-drying-hangers",
      "invisible-grills",
      "safety-nets",
      "sports-nets",
    ]);
  });
});

describe("page decision engine", () => {
  it("indexes unique city and city-service pages", () => {
    expect(
      shouldGeneratePage({
        kind: "city",
        citySlug: "guntur",
      }),
    ).toMatchObject({ generate: true, index: true });
    expect(
      shouldGeneratePage({
        kind: "city-service",
        citySlug: "tirupati",
        serviceSlug: "invisible-grills",
      }),
    ).toMatchObject({ generate: true, index: true });
  });

  it("indexes area+service only when locality facts exist", () => {
    expect(
      shouldGeneratePage({
        kind: "area-service",
        citySlug: "visakhapatnam",
        areaSlug: "madhurawada",
        serviceSlug: "safety-nets",
      }),
    ).toMatchObject({ generate: true, index: true });
    expect(
      shouldGeneratePage({
        kind: "area-service",
        citySlug: "visakhapatnam",
        areaSlug: "tagarapuvalasa",
        serviceSlug: "safety-nets",
      }),
    ).toMatchObject({ generate: true, index: true });
  });

  it("rejects unknown cities and sub-service city URLs", () => {
    expect(
      shouldGeneratePage({
        kind: "city-service",
        citySlug: "eluru",
        serviceSlug: "invisible-grills",
      }).generate,
    ).toBe(false);
    expect(
      shouldGeneratePage({
        kind: "city-service",
        citySlug: "vijayawada",
        serviceSlug: "balcony-safety-nets",
      }).generate,
    ).toBe(false);
  });
});

describe("seo score", () => {
  it("requires 85 to publish", () => {
    const low = scoreSeoPage({
      searchIntent: 8,
      originality: 8,
      localRelevance: 8,
      contentUsefulness: 8,
      topicalCompleteness: 8,
      entityRelevance: 8,
      internalLinking: 8,
      technicalSeo: 8,
      indexability: 8,
      conversionValue: 8,
    });
    expect(low.total).toBe(80);
    expect(low.publishable).toBe(false);

    const high = scoreSeoPage({
      searchIntent: 9,
      originality: 9,
      localRelevance: 9,
      contentUsefulness: 9,
      topicalCompleteness: 8,
      entityRelevance: 8,
      internalLinking: 8,
      technicalSeo: 9,
      indexability: 9,
      conversionValue: 9,
    });
    expect(high.total).toBeGreaterThanOrEqual(SEO_PUBLISH_MIN_SCORE);
    expect(high.publishable).toBe(true);
  });

  it("does not index pages below the quality floor", () => {
    const page = {
      publicationStatus: "published",
      allowIndexing: true,
      qualityScore: 84,
      contentReviewed: true,
      localDataVerified: true,
      hasUniqueMetadata: true,
      hasUniqueContent: true,
      hasValidCanonical: true,
      hasInternalLinks: true,
      hasValidSchema: true,
      wordCount: 1200,
      minimumRequiredWordCount: 700,
      similarityScore: 0.3,
    };
    expect(isPageIndexable(page)).toBe(false);
    expect(isPageIndexable({ ...page, qualityScore: 85 })).toBe(true);
  });
});

describe("content modules", () => {
  it("selects a bounded set of modules for a service-location page", () => {
    const modules = selectContentModules({
      pageType: "service-location",
      serviceSlug: "invisible-grills",
      maxModules: 5,
    });
    expect(modules.length).toBeGreaterThan(0);
    expect(modules.length).toBeLessThanOrEqual(5);
  });
});

describe("sitemap quality gate", () => {
  it("includes enabled AP area hubs and city+service silo URLs", () => {
    const paths = new Set(buildSitemapRegistry().map((e) => e.path));
    expect(paths.has("/locations/andhra-pradesh/visakhapatnam/madhurawada/")).toBe(
      true,
    );
    expect(
      paths.has("/locations/andhra-pradesh/visakhapatnam/tagarapuvalasa/"),
    ).toBe(true);
    expect(
      paths.has("/locations/andhra-pradesh/vijayawada/invisible-grills/"),
    ).toBe(true);
    expect(paths.has("/services/balcony-safety-nets/")).toBe(true);
  });
});

describe("seo page records", () => {
  it("builds dashboard rows for sitemap URLs", () => {
    const records = buildSeoPageRecords();
    expect(records.length).toBe(buildSitemapRegistry().length);
    const vizag = records.find(
      (row) =>
        row.path ===
        "/locations/andhra-pradesh/visakhapatnam/invisible-grills/",
    );
    expect(vizag).toMatchObject({
      pageType: "city-service",
      city: "visakhapatnam",
      service: "invisible-grills",
      indexable: true,
      sitemap: "local-services",
    });
    expect(vizag!.seoScore).toBeGreaterThanOrEqual(SEO_PUBLISH_MIN_SCORE);
  });
});
