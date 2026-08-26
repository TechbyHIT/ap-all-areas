import { describe, expect, it } from "vitest";
import {
  matchLegacySiloRedirect,
  matchSiloInternalRewrite,
} from "@/lib/routing/location-silo";
import { matchKeywordCityConsolidatePath } from "@/lib/routing/pretty-money-urls";

describe("location silo routing", () => {
  it("rewrites public city hubs to existing location modules", () => {
    expect(
      matchSiloInternalRewrite("/locations/andhra-pradesh/visakhapatnam/"),
    ).toBe("/locations/visakhapatnam/");
    expect(
      matchSiloInternalRewrite(
        "/locations/andhra-pradesh/visakhapatnam/invisible-grills/",
      ),
    ).toBe("/visakhapatnam/invisible-grills/");
    expect(
      matchSiloInternalRewrite(
        "/locations/andhra-pradesh/visakhapatnam/madhurawada/",
      ),
    ).toBe("/locations/visakhapatnam/madhurawada/");
  });

  it("rewrites Gajuwaka invisible grills to the unique landing module", () => {
    expect(
      matchSiloInternalRewrite(
        "/locations/andhra-pradesh/visakhapatnam/gajuwaka/invisible-grills/",
      ),
    ).toBe(
      "/landings/area/invisible-grills/andhra-pradesh/visakhapatnam/gajuwaka/",
    );
  });

  it("308s legacy public URLs onto the silo", () => {
    expect(matchLegacySiloRedirect("/locations/visakhapatnam/")).toBe(
      "/locations/andhra-pradesh/visakhapatnam/",
    );
    expect(matchLegacySiloRedirect("/visakhapatnam/invisible-grills/")).toBe(
      "/locations/andhra-pradesh/visakhapatnam/invisible-grills/",
    );
    expect(matchLegacySiloRedirect("/services/pigeon-nets/")).toBe(
      "/services/pigeon-safety-nets/",
    );
    expect(matchLegacySiloRedirect("/locations/andhra-pradesh/")).toBeNull();
    expect(matchLegacySiloRedirect("/locations/guntur/")).toBe(
      "/locations/andhra-pradesh/guntur/",
    );
  });

  it("maps Guntur silo URL to the city module path (legacy 308 inverse)", () => {
    expect(matchSiloInternalRewrite("/locations/andhra-pradesh/guntur/")).toBe(
      "/locations/guntur/",
    );
  });
});

describe("keyword city consolidation", () => {
  it("maps overlapping keyword×city URLs onto the silo city+service page", () => {
    expect(
      matchKeywordCityConsolidatePath(
        "/balcony-safety-nets-in-visakhapatnam/",
      ),
    ).toBe("/locations/andhra-pradesh/visakhapatnam/safety-nets/");
    expect(
      matchKeywordCityConsolidatePath("/invisible-grills-in-vijayawada/"),
    ).toBe("/locations/andhra-pradesh/vijayawada/invisible-grills/");
    expect(
      matchKeywordCityConsolidatePath("/pigeon-nets-in-madhurawada/"),
    ).toBeNull();
  });
});
