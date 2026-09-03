import { describe, expect, it } from "vitest";
import { INSTALLATION_PHOTOS } from "@/config/installation-photos";
import {
  canSynthesizeLocalityReview,
  listPublishableReviews,
} from "@/data/reviews";
import { contextualCta, LEAD_FORM_FIELDS } from "@/lib/seo/contextual-cta";
import { analyzeServiceContentGaps } from "@/lib/seo/content-gap";
import { buildConversionEvent } from "@/lib/seo/conversion-tracking";
import {
  buildGalleryItems,
  organizeGallery,
} from "@/lib/seo/gallery-organization";
import { flagGscOpportunities } from "@/lib/seo/gsc-loop";
import { validateImageAlt } from "@/lib/seo/image-alt";
import {
  intentMatchesPageType,
  pageTypeForSerpIntent,
} from "@/lib/seo/serp-intent";
import {
  buildIntentTitle,
  buildMetaDescription,
  readabilityChecklist,
  validateHeadingHierarchy,
} from "@/lib/seo/title-meta-system";
import { listPublishedVideos } from "@/lib/seo/video-seo";

describe("image alt (§62)", () => {
  it("rejects stuffed alts and accepts descriptive ones", () => {
    expect(
      validateImageAlt(
        "best balcony safety net Bangalore balcony safety nets",
      ).ok,
    ).toBe(false);
    expect(
      validateImageAlt(
        "Balcony safety net installed across an apartment balcony",
      ).ok,
    ).toBe(true);
  });

  it("keeps installation photo alts descriptive", () => {
    for (const photo of INSTALLATION_PHOTOS) {
      expect(validateImageAlt(photo.alt, photo.src).ok).toBe(true);
    }
  });
});

describe("gallery organization (§65)", () => {
  it("groups photos by service", () => {
    const items = buildGalleryItems();
    const byService = organizeGallery(items, "service");
    expect(byService.size).toBeGreaterThanOrEqual(3);
    expect(items.length).toBe(INSTALLATION_PHOTOS.length);
  });
});

describe("reviews & video honesty (§64, §66)", () => {
  it("publishes no fabricated reviews or videos", () => {
    expect(listPublishableReviews()).toEqual([]);
    expect(listPublishedVideos()).toEqual([]);
    expect(canSynthesizeLocalityReview()).toBe(false);
  });
});

describe("contextual CTA & lead fields (§68–70)", () => {
  it("maps page intent to CTA copy", () => {
    expect(contextualCta({ kind: "city" }).primaryLabel).toBe(
      "Check Service Availability",
    );
    expect(contextualCta({ kind: "locality" }).primaryLabel).toBe(
      "Request a Visit",
    );
    expect(contextualCta({ kind: "guide" }).primaryLabel).toBe(
      "Compare Service Options",
    );
    expect(LEAD_FORM_FIELDS).toContain("photo");
  });
});

describe("conversion + GSC (§71–73)", () => {
  it("builds conversion events and GSC flags", () => {
    const event = buildConversionEvent({
      conversionType: "whatsapp_click",
      dimensions: { pageType: "service", service: "safety-nets" },
    });
    expect(event.event).toBe("conversion");

    const insights = flagGscOpportunities({
      query: "invisible grills vs safety nets",
      page: "/services/invisible-grills/",
      impressions: 80,
      clicks: 1,
      ctr: 0.012,
      position: 8,
    });
    expect(insights.some((i) => i.opportunity === "title-opportunity")).toBe(
      true,
    );
  });
});

describe("content gap + SERP intent (§74–76)", () => {
  it("analyzes gaps and maps SERP intent to page types", () => {
    const gaps = analyzeServiceContentGaps("invisible-grills");
    expect(Array.isArray(gaps)).toBe(true);
    expect(pageTypeForSerpIntent("comparison")).toBe("comparison");
    expect(intentMatchesPageType("guide", "guide")).toBe(true);
    expect(intentMatchesPageType("local-commercial", "service")).toBe(false);
  });
});

describe("title / meta / headings / readability (§78–81)", () => {
  it("builds intent titles and validates hierarchy", () => {
    expect(
      buildIntentTitle({
        intent: "local",
        primary: "Invisible Grills",
        city: "Visakhapatnam",
      }),
    ).toContain("Visakhapatnam");
    expect(
      buildMetaDescription({
        service: "Safety Nets",
        location: "Vijayawada",
        differentiator: "Measured quotes from opening photos",
        cta: "Request a quote",
      }).length,
    ).toBeLessThanOrEqual(160);

    const headings = validateHeadingHierarchy([
      { level: 1, text: "Safety Nets" },
      { level: 2, text: "Who needs them" },
      { level: 3, text: "Apartments" },
    ]);
    expect(headings.ok).toBe(true);
    expect(readabilityChecklist().prefer).toContain("short paragraphs");
  });
});
