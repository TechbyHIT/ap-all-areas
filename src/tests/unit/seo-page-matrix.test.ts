import { describe, expect, it } from "vitest";
import { LOCATION_SERVICE_SLUGS, STATE_SLUG } from "@/config/geo";
import { NAV_LOCATIONS } from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { canPublishProgrammaticPage, shouldGeneratePage } from "@/lib/seo/page-decision";
import {
  getHighPrioritySeoPages,
  listApprovedSeoPages,
  listIndexableSeoPages,
  prerenderSiloAreaServiceParams,
  prerenderSiloCityChildParams,
  resolveSeoPage,
  summarizeSeoPageMatrix,
} from "@/lib/seo/seo-page-matrix";
import { buildSitemapRegistry } from "@/lib/seo/sitemap-registry";

describe("authoritative SEO page matrix", () => {
  it("indexes every valid city, area, and service combination", () => {
    const services = LOCATION_SERVICE_SLUGS;
    for (const city of HIGH_PRIORITY_CITY_AREAS) {
      expect(
        shouldGeneratePage({
          kind: "city",
          stateSlug: STATE_SLUG,
          citySlug: city.citySlug,
        }).generate,
      ).toBe(true);
      expect(resolveSeoPage(ROUTES.location(city.citySlug))?.indexable).toBe(
        true,
      );

      for (const service of services) {
        expect(
          resolveSeoPage(ROUTES.cityService(city.citySlug, service))?.indexable,
        ).toBe(true);
      }

      for (const area of city.areas) {
        expect(resolveSeoPage(ROUTES.area(city.citySlug, area.slug))?.indexable).toBe(
          true,
        );
        for (const service of services) {
          expect(
            resolveSeoPage(
              ROUTES.areaService(city.citySlug, area.slug, service),
            )?.indexable,
          ).toBe(true);
        }
      }
    }
  });

  it("does not treat generateStaticParams as the indexable list", () => {
    const summary = summarizeSeoPageMatrix();
    const prerender = getHighPrioritySeoPages();
    const indexable = listIndexableSeoPages();
    expect(indexable.length).toBe(summary.approved);
    expect(prerender.length).toBeLessThan(indexable.length);
    expect(summary.isr).toBeGreaterThan(0);

    const sitemap = new Set(buildSitemapRegistry().map((entry) => entry.path));
    const isrPages = listApprovedSeoPages().filter((page) => !page.prerender);
    expect(isrPages.length).toBe(summary.isr);
    for (const page of isrPages.slice(0, 40)) {
      expect(sitemap.has(page.path)).toBe(true);
      expect(page.indexable).toBe(true);
    }
  });

  it("prerenders city×service and a locality seed, not every area URL", () => {
    const cityChildren = prerenderSiloCityChildParams();
    const areaServices = prerenderSiloAreaServiceParams();
    const allAreaServices = listApprovedSeoPages().filter(
      (page) => page.kind === "area-service",
    );
    const allCityServices = listApprovedSeoPages().filter(
      (page) => page.kind === "city-service",
    );

    expect(cityChildren.length).toBeGreaterThan(allCityServices.length);
    expect(areaServices.length).toBeLessThan(allAreaServices.length);
    expect(areaServices.length).toBeGreaterThan(0);
    expect(
      allCityServices.every((page) => page.prerender),
    ).toBe(true);
  });

  it("includes specialist city URLs that used to 404 as unknown areas", () => {
    const page = resolveSeoPage(
      "/locations/andhra-pradesh/visakhapatnam/children-safety-nets/",
    );
    expect(page).toMatchObject({
      kind: "city-service",
      indexable: true,
      prerender: true,
    });
  });

  it("does not promote unpublished city URLs in primary navigation", () => {
    const hrefs = NAV_LOCATIONS.map((item) => item.href);
    expect(hrefs).not.toContain("/locations/eluru/");
    expect(hrefs).not.toContain("/locations/vizianagaram/");
    expect(hrefs).toContain(ROUTES.location("visakhapatnam"));
    expect(hrefs).toContain(ROUTES.state);
  });

  it("excludes unknown and private URLs", () => {
    expect(resolveSeoPage("/locations/andhra-pradesh/eluru/")).toBeNull();
    expect(resolveSeoPage("/thank-you/")).toBeNull();
    expect(resolveSeoPage("/invalid-page/")).toBeNull();
    expect(
      shouldGeneratePage({
        kind: "city-service",
        citySlug: "eluru",
        serviceSlug: "invisible-grills",
      }).generate,
    ).toBe(false);
  });

  it("keeps curated pages indexable even without unique local facts", () => {
    const result = canPublishProgrammaticPage({
      decision: {
        kind: "area-service",
        citySlug: "visakhapatnam",
        areaSlug: "tagarapuvalasa",
        serviceSlug: "children-safety-nets",
      },
      candidatePath: ROUTES.areaService(
        "visakhapatnam",
        "tagarapuvalasa",
        "children-safety-nets",
      ),
      kind: "area-service",
      hasUniqueLocalFacts: false,
      isCuratedCatalog: true,
    });
    expect(result.publish).toBe(true);
    expect(result.index).toBe(true);
  });

  it("uses unique titles for money pages", () => {
    const money = listApprovedSeoPages().filter(
      (page) =>
        page.kind === "city-service" || page.kind === "area-service",
    );
    const titles = money.map((page) => page.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
