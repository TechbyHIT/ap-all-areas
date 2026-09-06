import { describe, expect, it } from "vitest";
import { LOCATION_SERVICE_SLUGS, STATE_SLUG } from "@/config/geo";
import { indexabilityFloor } from "@/config/content-architecture";
import { ROUTES } from "@/config/routes";
import { getCityLocalProfile } from "@/data/city-local-profiles";
import { getAreaLocalFact } from "@/data/area-local-facts";
import { getServiceEncyclopedia } from "@/data/service-encyclopedia";
import {
  buildAreaPageContent,
  buildAreaServiceContent,
  buildCityServiceContent,
  buildLocationPageContent,
} from "@/data/location-page-content";
import { getAreaServiceFaqs, getCityServiceFaqs } from "@/data/service-faqs";
import { buildVariantFaqs } from "@/data/service-variant-content";
import { listLocationServices } from "@/lib/data/location-catalog";
import {
  getAreaBySlugs,
  getAreasForCity,
  getCityBySlug,
} from "@/lib/data/locations";
import { isPageIndexable } from "@/lib/publishing/indexability";
import {
  countAreaServiceWords,
  countCityServiceWords,
  countLocationHubWords,
} from "@/lib/seo/content-word-count";
import { buildProgrammaticIndexability } from "@/lib/seo/programmatic-indexability";

describe("money page organic indexability", () => {
  it("gives every location service its own unique city copy above the floor", () => {
    const city = getCityBySlug("visakhapatnam");
    expect(city).toBeTruthy();
    const areas = getAreasForCity("visakhapatnam").map((area) => area.name);
    const intros = new Set<string>();

    for (const service of listLocationServices()) {
      const content = buildCityServiceContent({
        serviceSlug: service.slug,
        serviceName: service.name,
        cityName: city!.name,
        citySlug: "visakhapatnam",
        district: "Visakhapatnam",
        areas,
      });
      const faqs = [
        ...buildVariantFaqs(service.slug, city!.name),
        ...getCityServiceFaqs(service.name, city!.name),
      ];
      const words = countCityServiceWords(content, faqs);
      expect(words).toBeGreaterThanOrEqual(indexabilityFloor("city-service"));
      expect(intros.has(content.uniqueIntroduction)).toBe(false);
      intros.add(content.uniqueIntroduction);

      const meta = buildProgrammaticIndexability({
        decision: {
          kind: "city-service",
          stateSlug: STATE_SLUG,
          citySlug: "visakhapatnam",
          serviceSlug: service.slug,
        },
        candidatePath: ROUTES.cityService("visakhapatnam", service.slug),
        cannibalKind: "city-service",
        tier: "city-service",
        hasCityProfile: true,
        wordCount: words,
      });
      expect(isPageIndexable(meta)).toBe(true);
    }

    expect(intros.size).toBe(LOCATION_SERVICE_SLUGS.length);
  });

  it("adds specialist encyclopedia that the parent hub does not share", () => {
    const children = getServiceEncyclopedia(
      "children-safety-nets",
      "Visakhapatnam",
      "Children Safety Nets",
    );
    const parent = getServiceEncyclopedia(
      "safety-nets",
      "Visakhapatnam",
      "Safety Nets",
    );
    expect(
      children.some((section) =>
        /what children safety nets are for/i.test(section.heading),
      ),
    ).toBe(true);
    expect(
      parent.some((section) =>
        /what children safety nets are for/i.test(section.heading),
      ),
    ).toBe(false);
  });

  it("indexes area × specialist pages with unique locality copy", () => {
    const city = getCityBySlug("visakhapatnam");
    const area = getAreaBySlugs("visakhapatnam", "gajuwaka");
    expect(city && area).toBeTruthy();
    const samples = [
      "children-safety-nets",
      "pigeon-safety-nets",
      "invisible-grills",
      "cricket-practice-nets",
    ];
    const intros = new Set<string>();

    for (const serviceSlug of samples) {
      const service = listLocationServices().find((s) => s.slug === serviceSlug);
      expect(service).toBeTruthy();
      const content = buildAreaServiceContent({
        serviceSlug,
        serviceName: service!.name,
        areaName: area!.name,
        cityName: city!.name,
        citySlug: "visakhapatnam",
        areaSlug: "gajuwaka",
      });
      const faqs = [
        ...buildVariantFaqs(serviceSlug, `${area!.name}, ${city!.name}`),
        ...getAreaServiceFaqs(service!.name, area!.name, city!.name),
      ];
      const words = countAreaServiceWords(content, faqs);
      expect(words).toBeGreaterThanOrEqual(indexabilityFloor("locality-service"));
      expect(intros.has(content.uniqueIntroduction)).toBe(false);
      intros.add(content.uniqueIntroduction);

      const meta = buildProgrammaticIndexability({
        decision: {
          kind: "area-service",
          stateSlug: STATE_SLUG,
          citySlug: "visakhapatnam",
          areaSlug: "gajuwaka",
          serviceSlug,
        },
        candidatePath: ROUTES.areaService(
          "visakhapatnam",
          "gajuwaka",
          serviceSlug,
        ),
        cannibalKind: "area-service",
        tier: "locality-service",
        hasUniqueLocalFacts: Boolean(
          getAreaLocalFact("visakhapatnam", "gajuwaka"),
        ),
        hasCityProfile: Boolean(getCityLocalProfile("visakhapatnam")),
        wordCount: words,
      });
      expect(isPageIndexable(meta)).toBe(true);
    }
  });

  it("indexes city and area hubs from counted copy, not hardcoded undercounts", () => {
    const cityWords = countLocationHubWords(
      buildLocationPageContent({
        name: "Visakhapatnam",
        locationType: "city",
        district: "Visakhapatnam",
        nearbyPlaces: ["Gajuwaka", "Madhurawada", "MVP Colony"],
        isPriorityCity: true,
      }),
    );
    expect(cityWords).toBeGreaterThanOrEqual(indexabilityFloor("city"));
    expect(
      isPageIndexable(
        buildProgrammaticIndexability({
          decision: {
            kind: "city",
            stateSlug: STATE_SLUG,
            citySlug: "visakhapatnam",
          },
          candidatePath: ROUTES.location("visakhapatnam"),
          cannibalKind: "city",
          tier: "city",
          hasCityProfile: true,
          wordCount: cityWords,
        }),
      ),
    ).toBe(true);

    const areaWords = countLocationHubWords(
      buildAreaPageContent({
        areaName: "Gajuwaka",
        cityName: "Visakhapatnam",
        district: "Visakhapatnam",
      }),
    );
    expect(areaWords).toBeGreaterThanOrEqual(indexabilityFloor("locality"));
    expect(
      isPageIndexable(
        buildProgrammaticIndexability({
          decision: {
            kind: "area",
            stateSlug: STATE_SLUG,
            citySlug: "visakhapatnam",
            areaSlug: "gajuwaka",
          },
          candidatePath: ROUTES.area("visakhapatnam", "gajuwaka"),
          cannibalKind: "area",
          tier: "locality",
          hasUniqueLocalFacts: true,
          hasCityProfile: true,
          wordCount: areaWords,
        }),
      ),
    ).toBe(true);
  });
});
