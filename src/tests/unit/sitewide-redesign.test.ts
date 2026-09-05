import { describe, expect, it } from "vitest";
import {
  aggregateRatingFromReviews,
  listPublishableReviews,
} from "@/data/reviews";
import { buildMetaDescription, buildIntentTitle } from "@/lib/seo/title-meta-system";
import { localBusinessSchema, reviewsSchema, faqSchema } from "@/lib/schema";
import { pickPageImage } from "@/lib/visual/page-image-pick";

describe("reviews honesty", () => {
  it("publishes no fabricated reviews by default", () => {
    expect(listPublishableReviews()).toEqual([]);
    expect(aggregateRatingFromReviews([])).toBeNull();
    expect(reviewsSchema()).toBeNull();
  });
});

describe("benefit-first meta", () => {
  it("leads with CTA/benefit not branch disclaimer", () => {
    const desc = buildMetaDescription({
      service: "Balcony Safety Nets",
      location: "Vijayawada",
      differentiator: "We do not claim a local branch in every neighbourhood.",
      cta: "Free photo estimate · measured quote",
    });
    expect(desc.toLowerCase()).toContain("free photo estimate");
    expect(desc.toLowerCase().indexOf("free photo estimate")).toBeLessThan(
      desc.toLowerCase().indexOf("branch") === -1
        ? Infinity
        : desc.toLowerCase().indexOf("branch"),
    );
    expect(buildIntentTitle({ intent: "local", primary: "Safety Nets", city: "Tirupati" }).length).toBeLessThanOrEqual(70);
  });
});

describe("schema gates", () => {
  it("emits HomeAndConstructionBusiness without requiring geo", () => {
    const schema = localBusinessSchema();
    expect(schema["@type"]).toBe("HomeAndConstructionBusiness");
    expect(schema.geo).toBeUndefined();
    expect(schema.aggregateRating).toBeUndefined();
  });

  it("skips empty FAQ schema", () => {
    expect(faqSchema([])).toBeNull();
  });
});

describe("page image diversification", () => {
  it("returns different sources for different page keys", () => {
    const a = pickPageImage({ pageKey: "city:visakhapatnam", serviceSlug: "safety-nets" });
    const b = pickPageImage({ pageKey: "city:vijayawada", serviceSlug: "safety-nets" });
    const c = pickPageImage({ pageKey: "city:tirupati", serviceSlug: "invisible-grills" });
    expect(a.src).toMatch(/\.webp$/i);
    expect(b.src).toMatch(/\.webp$/i);
    expect(c.src).toMatch(/\.webp$/i);
    // At least one pair should differ across cities/services in the pool
    expect(new Set([a.src, b.src, c.src]).size).toBeGreaterThan(1);
  });
});
