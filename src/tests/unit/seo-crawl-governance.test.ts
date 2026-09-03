import { describe, expect, it } from "vitest";
import {
  organizationSchema,
  breadcrumbSchema,
  serviceSchema,
} from "@/lib/schema";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { validateCanonical } from "@/lib/seo/canonical-validation";
import {
  locationHierarchyCrumbs,
  locationServiceHierarchyCrumbs,
  pageHasBreadcrumbPath,
  serviceHierarchyCrumbs,
} from "@/lib/seo/breadcrumb-paths";
import {
  evaluateFacetUrl,
  isInternalSearchPath,
  paginationIndexability,
} from "@/lib/seo/facet-seo";
import { HREFLANG_ENABLED } from "@/lib/seo/hreflang-policy";
import {
  INDEXABILITY_STATES,
  resolveIndexabilityState,
} from "@/lib/seo/indexability-states";
import { cwvChecklistIds, JS_SEO_REQUIREMENTS } from "@/lib/seo/js-seo-policy";
import { auditRedirectRegistry, resolveRedirectTarget } from "@/lib/seo/redirect-registry";
import { validateJsonLd } from "@/lib/seo/schema-validation";
import { detectOrphanPages, summarizeOrphans, inferStructuralParent } from "@/lib/seo/orphan-detection";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

describe("redirect registry (§43)", () => {
  it("flattens static aliases without loops", () => {
    const terms = resolveRedirectTarget("/terms/");
    expect(terms.finalPath).toBe("/terms-and-conditions/");
    expect(terms.loop).toBe(false);

    const audit = auditRedirectRegistry();
    expect(audit.loops).toEqual([]);
  });
});

describe("canonical validation (§44)", () => {
  it("accepts absolute self-canonical HTTPS URLs", () => {
    const path = "/services/invisible-grills/";
    const result = validateCanonical({
      pagePath: path,
      canonical: buildCanonicalUrl(path),
      indexable: true,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects relative canonicals", () => {
    const result = validateCanonical({
      pagePath: "/services/",
      canonical: "/services/",
      indexable: true,
    });
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === "not-absolute")).toBe(true);
  });
});

describe("hreflang policy (§45–47)", () => {
  it("stays disabled for single-locale site", () => {
    expect(HREFLANG_ENABLED).toBe(false);
  });
});

describe("schema validation (§48–49)", () => {
  it("validates core JSON-LD generators", () => {
    expect(validateJsonLd(organizationSchema()).ok).toBe(true);
    expect(
      validateJsonLd(
        breadcrumbSchema([
          { name: "Home", url: buildCanonicalUrl("/") },
          { name: "Services", url: buildCanonicalUrl("/services/") },
        ]),
      ).ok,
    ).toBe(true);
    expect(
      validateJsonLd(
        serviceSchema({
          name: "Invisible Grills",
          description: "Installation",
          url: buildCanonicalUrl("/services/invisible-grills/"),
        }),
      ).ok,
    ).toBe(true);
  });

  it("flags fabricated aggregateRating", () => {
    const result = validateJsonLd({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Test",
      url: "https://example.com/",
      aggregateRating: { "@type": "AggregateRating", ratingValue: 5 },
    });
    expect(result.ok).toBe(false);
  });
});

describe("breadcrumbs (§50)", () => {
  it("builds hierarchical service and location crumbs", () => {
    const service = serviceHierarchyCrumbs({
      serviceSlug: "invisible-grills",
      familySlug: "balcony-safety",
    });
    expect(pageHasBreadcrumbPath(service)).toBe(true);
    expect(service.map((c) => c.name)).toContain("Balcony Safety");

    const loc = locationHierarchyCrumbs({
      citySlug: "visakhapatnam",
      areaSlug: "gajuwaka",
    });
    expect(loc[0]?.name).toBe("Home");
    expect(loc.some((c) => c.name === "Areas")).toBe(true);

    const locService = locationServiceHierarchyCrumbs({
      citySlug: "visakhapatnam",
      serviceSlug: "safety-nets",
    });
    expect(locService.at(-1)?.name.toLowerCase()).toContain("net");
  });
});

describe("indexability states (§54)", () => {
  it("maps published+gates to indexable", () => {
    expect(INDEXABILITY_STATES).toContain("indexable");
    const state = resolveIndexabilityState(staticPageIndexability(true));
    expect(state).toBe("indexable");

    const noindex = resolveIndexabilityState(staticPageIndexability(false));
    expect(noindex).toBe("noindex");
  });
});

describe("facet / search / pagination (§55–57)", () => {
  it("blocks filter and search params from indexing", () => {
    expect(evaluateFacetUrl({ pathname: "/gallery/", searchParams: { sort: "new" } }).indexable).toBe(
      false,
    );
    expect(evaluateFacetUrl({ pathname: "/services/" }).indexable).toBe(true);
    expect(isInternalSearchPath("/search/")).toBe(true);
    expect(paginationIndexability(2).indexable).toBe(false);
  });
});

describe("js seo / cwv policy (§58–60)", () => {
  it("exposes server-render and CWV checklists", () => {
    expect(JS_SEO_REQUIREMENTS.length).toBeGreaterThan(3);
    expect(cwvChecklistIds()).toContain("lcp-hero");
  });
});

describe("orphan detection (§41)", () => {
  it("infers silo parents and only flags broken hierarchy as critical", () => {
    expect(
      inferStructuralParent("/locations/andhra-pradesh/visakhapatnam/invisible-grills/"),
    ).toBe("/locations/andhra-pradesh/visakhapatnam/");
    expect(inferStructuralParent("/services/safety-nets/")).toBe("/services/");

    const findings = detectOrphanPages({ sitemapOnly: true });
    const summary = summarizeOrphans(findings);
    expect(summary.critical).toBeLessThan(50);
  });
});
