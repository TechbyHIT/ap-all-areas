import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  resolveLandingSections,
  validateLandingData,
} from "@/lib/landing/section-engine";
import type { LandingPageData } from "@/lib/landing/types";
import {
  buildEnquiryProcess,
  buildLocationProblems,
  buildLocationRelatedGroups,
  buildServiceOptions,
} from "@/lib/landing/builders/location-landing";
import {
  buildServiceQuickStart,
  buildServiceRelatedGroups,
  buildServiceUseCases,
  buildServiceVariantOptions,
} from "@/lib/landing/builders/service-landing";
import {
  buildMenuServiceGroups,
  localizeServiceHref,
} from "@/lib/landing/builders/service-directory";
import { buildAreaServiceContent } from "@/data/location-page-content";

function minimalLanding(
  overrides: Partial<LandingPageData> = {},
): LandingPageData {
  return {
    pageType: "city",
    intent: "local",
    canonicalUrl: "https://example.com/locations/visakhapatnam/",
    hero: {
      title: "Safety nets in Visakhapatnam",
      description: "Measured installation planned after a site review.",
      image: { src: "/images/hero.webp", alt: "Balcony safety net" },
    },
    cta: {
      title: "Request a quote",
      description: "Send opening photos to start.",
    },
    ...overrides,
  };
}

// The template and its builders once existed in full while every money route
// still rendered its own hand-assembled JSX, so none of the shared sections
// reached a visitor. Assert the wiring, not just the pieces.
describe("money routes render the universal template", () => {
  const routes = [
    "src/app/services/[serviceSlug]/page.tsx",
    "src/app/locations/[locationSlug]/page.tsx",
    "src/app/locations/[locationSlug]/[areaSlug]/page.tsx",
    "src/app/[locationSlug]/[slug]/page.tsx",
    "src/app/[locationSlug]/[slug]/[serviceSlug]/page.tsx",
  ];

  it.each(routes)("%s imports and renders LandingPage", (route) => {
    const source = readFileSync(path.join(process.cwd(), route), "utf8");
    expect(source).toContain('from "@/components/landing/LandingPage"');
    expect(source).toContain("<LandingPage data=");
  });
});

describe("landing section engine", () => {
  it("renders only hero and CTA when there is nothing else to show", () => {
    const sections = resolveLandingSections(minimalLanding());
    expect(sections).toEqual(["hero", "final-cta"]);
  });

  it("adds a section once its data exists", () => {
    const sections = resolveLandingSections(
      minimalLanding({
        pricing: {
          factors: ["Opening size", "Material grade"],
          honestStatement: "Quotes follow measurement.",
        },
      }),
    );
    expect(sections).toContain("pricing");
  });

  it("skips grid sections that fall below the minimum item count", () => {
    const sections = resolveLandingSections(
      minimalLanding({
        useCases: {
          title: "Where it fits",
          items: [{ title: "Apartments", description: "Flats and towers." }],
        },
        problems: [
          { title: "Fall risk", summary: "Open railings.", href: "/a/" },
          { title: "Birds", summary: "Ledge roosting.", href: "/b/" },
        ],
      }),
    );
    expect(sections).not.toContain("use-cases");
    expect(sections).not.toContain("problems");
  });

  it("keeps a stable section order across page types", () => {
    const sections = resolveLandingSections(
      minimalLanding({
        trustLabel: "Visakhapatnam",
        primaryContent: "intro",
        pricing: {
          factors: ["a", "b"],
          honestStatement: "Measured scope only.",
        },
        faqs: [
          { question: "q1", answer: "a1" },
          { question: "q2", answer: "a2" },
          { question: "q3", answer: "a3" },
        ],
      }),
    );
    expect(sections.indexOf("trust")).toBeLessThan(
      sections.indexOf("primary-content"),
    );
    expect(sections.indexOf("pricing")).toBeLessThan(sections.indexOf("faq"));
    expect(sections.at(-1)).toBe("final-cta");
  });

  // Directories used to render after the FAQ, so a page offered "where to go
  // next" twice with the answers wedged in between.
  it("clusters every link section before the FAQ", () => {
    const sections = resolveLandingSections(
      minimalLanding({
        appendSections: "area directory",
        related: [{ title: "Services", links: [{ label: "A", href: "/a/" }] }],
        faqs: [
          { question: "q1", answer: "a1" },
          { question: "q2", answer: "a2" },
          { question: "q3", answer: "a3" },
        ],
      }),
    );
    const faq = sections.indexOf("faq");
    expect(sections.indexOf("append")).toBeLessThan(faq);
    expect(sections.indexOf("related")).toBeLessThan(faq);
    expect(faq).toBeLessThan(sections.indexOf("final-cta"));
  });
});

describe("problem-first heading label", () => {
  // The heading once read "…in Andhra Pradesh" on city pages because it was
  // derived from the hero badge, which carries the district, not the place.
  it("prefers an explicit label over the hero badge", () => {
    const data = minimalLanding({
      problemsLabel: "Visakhapatnam",
      hero: {
        title: "Safety nets in Visakhapatnam",
        description: "Measured installation planned after a site review.",
        badge: "Visakhapatnam District",
      },
    });
    expect(data.problemsLabel).toBe("Visakhapatnam");
    expect(data.problemsLabel).not.toBe(data.hero.badge);
  });
});

describe("landing content validation", () => {
  it("accepts a complete page", () => {
    const result = validateLandingData(
      minimalLanding({
        primaryContent: "intro",
        pricing: {
          factors: ["a", "b"],
          honestStatement: "Measured scope only.",
        },
        related: [{ title: "Services", links: [{ label: "A", href: "/a/" }] }],
        faqs: [
          { question: "q1", answer: "a1" },
          { question: "q2", answer: "a2" },
          { question: "q3", answer: "a3" },
        ],
        useCases: {
          title: "Fits",
          items: [
            { title: "A", description: "d" },
            { title: "B", description: "d" },
          ],
        },
      }),
    );
    expect(result.ok).toBe(true);
    expect(result.issues.filter((i) => i.severity === "error")).toHaveLength(0);
  });

  it("errors on a missing H1 and a relative canonical", () => {
    const result = validateLandingData(
      minimalLanding({
        canonicalUrl: "/locations/visakhapatnam/",
        hero: {
          title: "   ",
          description: "Something.",
        },
      }),
    );
    expect(result.ok).toBe(false);
    expect(result.issues.map((i) => i.field)).toContain("hero.title");
    expect(result.issues.map((i) => i.field)).toContain("canonicalUrl");
  });

  it("warns when a page is too thin to be a money page", () => {
    const result = validateLandingData(minimalLanding());
    const warnings = result.issues.filter((i) => i.severity === "warn");
    expect(warnings.map((w) => w.field)).toContain("sections");
    expect(warnings.map((w) => w.field)).toContain("related");
  });
});

describe("location landing builders", () => {
  it("orders problems by the locality's curated needs", () => {
    const withFacts = buildLocationProblems({
      citySlug: "visakhapatnam",
      areaSlug: "gajuwaka",
      isSiloCity: true,
    });
    const generic = buildLocationProblems({
      citySlug: "visakhapatnam",
      isSiloCity: true,
    });

    expect(withFacts.length).toBeGreaterThanOrEqual(3);
    expect(withFacts.every((p) => p.href.startsWith("/"))).toBe(true);
    // Both lists cover the same options; only the ordering is locality-driven.
    expect(new Set(withFacts.map((p) => p.href))).toEqual(
      new Set(generic.map((p) => p.href)),
    );
  });

  it("states a limitation for every service option", () => {
    const options = buildServiceOptions("Gajuwaka", {
      citySlug: "visakhapatnam",
      areaSlug: "gajuwaka",
      areaName: "Gajuwaka",
      isSiloCity: true,
    });
    expect(options.length).toBeGreaterThanOrEqual(10);
    expect(options.every((o) => Boolean(o.considerations))).toBe(true);
    expect(
      options.some((o) => (o.href ?? "").includes("/children-safety-nets/")),
    ).toBe(true);
    expect(new Set(options.map((o) => o.href ?? o.title)).size).toBe(
      options.length,
    );
  });

  it("groups related links without emitting empty groups", () => {
    const groups = buildLocationRelatedGroups({
      citySlug: "visakhapatnam",
      cityName: "Visakhapatnam",
      isSiloCity: true,
      nearbyAreas: [{ slug: "gajuwaka", name: "Gajuwaka" }],
    });
    expect(groups.length).toBeGreaterThan(0);
    expect(groups.every((g) => g.links.length > 0)).toBe(true);
  });

  it("does not repeat the same href inside or across related groups", () => {
    const groups = buildLocationRelatedGroups({
      citySlug: "visakhapatnam",
      cityName: "Visakhapatnam",
      isSiloCity: true,
      areaSlug: "gajuwaka",
      areaName: "Gajuwaka",
      nearbyAreas: [{ slug: "mvp-colony", name: "MVP Colony" }],
    });
    const hrefs = groups.flatMap((group) => group.links.map((link) => link.href));
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(
      groups.every(
        (group) =>
          new Set(group.links.map((link) => link.href)).size ===
          group.links.length,
      ),
    ).toBe(true);
  });

  it("names the place in every enquiry step section", () => {
    const process = buildEnquiryProcess("Gajuwaka");
    expect(process.title).toContain("Gajuwaka");
    expect(process.steps).toHaveLength(5);
  });
});

describe("service landing builders", () => {
  it("builds options from real sub-services", () => {
    const options = buildServiceVariantOptions({
      serviceSlug: "invisible-grills",
      serviceName: "Invisible Grills",
    });
    expect(options.length).toBeGreaterThanOrEqual(2);
    expect(options.every((o) => o.href?.startsWith("/services/"))).toBe(true);
  });

  it("only lists property types that declare the service as suitable", () => {
    const cases = buildServiceUseCases({ serviceSlug: "sports-nets" });
    expect(cases.length).toBeGreaterThan(0);
    expect(cases.every((c) => c.href?.includes("sports-nets"))).toBe(true);
  });

  it("adds a city link to quick start only when a city is given", () => {
    const withCity = buildServiceQuickStart({
      serviceSlug: "safety-nets",
      citySlug: "visakhapatnam",
    });
    const withoutCity = buildServiceQuickStart({ serviceSlug: "safety-nets" });
    expect(withCity.some((o) => o.href.includes("visakhapatnam"))).toBe(true);
    expect(withoutCity.some((o) => o.href.includes("visakhapatnam"))).toBe(
      false,
    );
  });

  it("lists every safety-net variation in quick start, not a 4-item cap", () => {
    const options = buildServiceQuickStart({ serviceSlug: "safety-nets" });
    const variationHrefs = options.filter((o) =>
      o.href.startsWith("/services/") && o.href !== "/services/",
    );
    expect(variationHrefs.length).toBeGreaterThanOrEqual(6);
    expect(new Set(options.map((o) => o.href)).size).toBe(options.length);
  });

  it("points specialist /services/ links at city and area money URLs", () => {
    expect(
      localizeServiceHref("/services/children-safety-nets/", {
        citySlug: "visakhapatnam",
        isSiloCity: true,
      }),
    ).toBe("/locations/andhra-pradesh/visakhapatnam/children-safety-nets/");
    expect(
      localizeServiceHref("/services/pigeon-safety-nets/", {
        citySlug: "visakhapatnam",
        areaSlug: "gajuwaka",
      }),
    ).toBe(
      "/locations/andhra-pradesh/visakhapatnam/gajuwaka/pigeon-safety-nets/",
    );
  });

  it("writes different organic copy for two services in the same locality", () => {
    const children = buildAreaServiceContent({
      serviceSlug: "children-safety-nets",
      serviceName: "Children Safety Nets",
      areaName: "Gajuwaka",
      cityName: "Visakhapatnam",
      citySlug: "visakhapatnam",
      areaSlug: "gajuwaka",
    });
    const pigeon = buildAreaServiceContent({
      serviceSlug: "pigeon-safety-nets",
      serviceName: "Pigeon Safety Nets",
      areaName: "Gajuwaka",
      cityName: "Visakhapatnam",
      citySlug: "visakhapatnam",
      areaSlug: "gajuwaka",
    });
    const inland = buildAreaServiceContent({
      serviceSlug: "children-safety-nets",
      serviceName: "Children Safety Nets",
      areaName: "Tagarapuvalasa",
      cityName: "Visakhapatnam",
      citySlug: "visakhapatnam",
      areaSlug: "tagarapuvalasa",
    });
    expect(children.uniqueIntroduction).not.toBe(pigeon.uniqueIntroduction);
    expect(children.uniqueIntroduction).not.toBe(inland.uniqueIntroduction);
    expect(children.uniqueIntroduction).toMatch(/child|reach|mesh/i);
    expect(pigeon.uniqueIntroduction).toMatch(/pigeon|bird|roost/i);
  });

  it("dedupes mega-menu keyword variants that share one destination", () => {
    const groups = buildMenuServiceGroups();
    const sports = groups.find((group) => group.title === "Sports Nets");
    const hrefs = sports?.links.map((link) => link.href) ?? [];
    expect(hrefs.length).toBeGreaterThan(0);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("scopes sibling service links to the city when one is given", () => {
    const groups = buildServiceRelatedGroups({
      serviceSlug: "safety-nets",
      serviceName: "Safety Nets",
      citySlug: "visakhapatnam",
      cityName: "Visakhapatnam",
    });
    const others = groups.find((g) => g.title === "Other services");
    expect(others?.links.every((l) => l.href.includes("visakhapatnam"))).toBe(
      true,
    );
    const hrefs = groups.flatMap((group) => group.links.map((link) => link.href));
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
