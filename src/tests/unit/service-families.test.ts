import { describe, expect, it } from "vitest";
import { INITIAL_SERVICE_SLUGS } from "@/data/initial-services";
import {
  SERVICE_FAMILIES,
  SERVICE_FAMILY_SLUGS,
} from "@/data/service-families";
import { SUB_SERVICE_SLUGS } from "@/data/sub-services";
import { ROUTES } from "@/config/routes";

describe("service families", () => {
  it("uses unique slugs that do not collide with services or sub-services", () => {
    const taken = new Set([...INITIAL_SERVICE_SLUGS, ...SUB_SERVICE_SLUGS]);
    for (const slug of SERVICE_FAMILY_SLUGS) {
      expect(taken.has(slug)).toBe(false);
    }
    expect(new Set(SERVICE_FAMILY_SLUGS).size).toBe(SERVICE_FAMILY_SLUGS.length);
  });

  it("links only to real service/solution routes", () => {
    for (const family of SERVICE_FAMILIES) {
      expect(family.options.length).toBeGreaterThanOrEqual(3);
      expect(ROUTES.serviceFamily(family.slug)).toBe(`/services/${family.slug}/`);
      for (const option of family.options) {
        expect(option.href.startsWith("/")).toBe(true);
        expect(option.href.endsWith("/")).toBe(true);
      }
    }
  });

  it("covers the four choose/compare pillars", () => {
    expect(SERVICE_FAMILY_SLUGS).toEqual(
      expect.arrayContaining([
        "balcony-safety",
        "bird-control",
        "sports-enclosures",
        "cloth-drying",
      ]),
    );
  });
});
