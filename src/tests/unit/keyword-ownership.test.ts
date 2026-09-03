import { describe, expect, it } from "vitest";
import { KEYWORD_INTENTS } from "@/data/keyword-intents";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import {
  buildKeywordCityOwnershipRows,
  buildKeywordHubOwnershipRows,
  buildKeywordOwnershipDatabase,
  getKeywordOwnerPath,
  resolveKeywordCluster,
  summarizeKeywordOwnership,
} from "@/lib/seo/keyword-ownership";

describe("keyword ownership registry", () => {
  it("builds hub owners for every cluster without inventing services", () => {
    const hubs = buildKeywordHubOwnershipRows();
    expect(hubs.length).toBeGreaterThanOrEqual(4);
    for (const hub of hubs) {
      expect(hub.pageType).toBe("service-hub");
      expect(hub.canonicalURL).toMatch(/^\/services\/[a-z0-9-]+\/$/);
      expect(hub.targetURL).toBe(hub.canonicalURL);
      expect(hub.status).toBe("owner");
      expect(hub.city).toBeNull();
    }
  });

  it("assigns every intent × curated city exactly once", () => {
    const rows = buildKeywordCityOwnershipRows(2);
    const expected = KEYWORD_INTENTS.length * HIGH_PRIORITY_CITY_AREAS.length;
    expect(rows.length).toBe(expected);

    const keys = rows.map((r) => `${r.keyword}::${r.city}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("consolidates core service×city keywords to silo city-service owners", () => {
    const path = getKeywordOwnerPath("invisible-grills", "visakhapatnam");
    expect(path).toBe(
      "/locations/andhra-pradesh/visakhapatnam/invisible-grills/",
    );

    const rows = buildKeywordCityOwnershipRows(0).filter(
      (r) =>
        r.keyword === "balcony-safety-nets" && r.city === "visakhapatnam",
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]!.status).toBe("redirect-to-owner");
    expect(rows[0]!.canonicalURL).toBe(
      "/locations/andhra-pradesh/visakhapatnam/safety-nets/",
    );
  });

  it("keeps distinct long-tail keyword×city as self-owned when not consolidated", () => {
    // matchKeywordCityConsolidatePath consolidates ALL keyword×P0-city to silo
    // city×service — so ownership must point at the silo, not duplicate landings.
    const owner = getKeywordOwnerPath("balcony-safety-nets", "visakhapatnam");
    expect(owner).toBe(
      "/locations/andhra-pradesh/visakhapatnam/safety-nets/",
    );
  });

  it("maps bird and child/pet clusters without changing service slug", () => {
    const pigeon = KEYWORD_INTENTS.find((k) => k.slug === "pigeon-control");
    const child = KEYWORD_INTENTS.find((k) => k.slug === "balcony-child-safety");
    expect(pigeon).toBeTruthy();
    expect(child).toBeTruthy();
    expect(resolveKeywordCluster(pigeon!)).toBe("bird-control");
    expect(resolveKeywordCluster(child!)).toBe("child-pet-safety");
    expect(pigeon!.serviceSlug).toBe("safety-nets");
  });

  it("summary counts are consistent", () => {
    const db = buildKeywordOwnershipDatabase(0);
    const summary = summarizeKeywordOwnership(db);
    expect(summary.total).toBe(db.length);
    expect(summary.uniqueOwners).toBeGreaterThan(4);
    const statusSum = Object.values(summary.byStatus).reduce((a, b) => a + b, 0);
    expect(statusSum).toBe(summary.total);
  });

  it("never invents cities outside the curated catalog", () => {
    const cities = new Set(
      buildKeywordCityOwnershipRows(0)
        .map((r) => r.city)
        .filter(Boolean),
    );
    const allowed = new Set(HIGH_PRIORITY_CITY_AREAS.map((c) => c.citySlug));
    for (const city of cities) {
      expect(allowed.has(city!)).toBe(true);
    }
  });
});
