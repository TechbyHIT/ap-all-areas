import { describe, it, expect } from "vitest";
import { isPageIndexable } from "@/lib/publishing/indexability";
import { slugify, buildCanonicalUrl, normalizePath } from "@/lib/routing/paths";
import { isPhoneValidForProduction } from "@/config/business";

describe("indexability", () => {
  const validPage = {
    publicationStatus: "published",
    allowIndexing: true,
    qualityScore: 85,
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

  it("returns true for a fully valid page", () => {
    expect(isPageIndexable(validPage)).toBe(true);
  });

  it("returns false for draft pages", () => {
    expect(isPageIndexable({ ...validPage, publicationStatus: "draft" })).toBe(
      false,
    );
  });

  it("returns false when quality score is below threshold", () => {
    expect(isPageIndexable({ ...validPage, qualityScore: 50 })).toBe(false);
  });

  it("returns false when similarity is too high", () => {
    expect(isPageIndexable({ ...validPage, similarityScore: 0.9 })).toBe(false);
  });
});

describe("routing paths", () => {
  it("slugifies text correctly", () => {
    expect(slugify("Visakhapatnam MVP Colony")).toBe("visakhapatnam-mvp-colony");
  });

  it("normalizes paths with trailing slash", () => {
    expect(normalizePath("/services/invisible-grills")).toBe(
      "/services/invisible-grills/",
    );
  });

  it("builds canonical URLs", () => {
    expect(buildCanonicalUrl("/about/")).toContain("/about/");
  });
});

describe("phone validation", () => {
  it("accepts configured 10-digit Indian mobile for production", () => {
    expect(isPhoneValidForProduction()).toBe(true);
  });
});
