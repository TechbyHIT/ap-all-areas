import { describe, expect, it } from "vitest";
import { matchServiceInCityPrettyPath } from "@/lib/routing/pretty-money-urls";
import {
  buildSitemapChunks,
  buildSitemapRegistry,
  isSitemapRedirectPath,
  SITEMAP_CHUNK_SIZE,
} from "@/lib/seo/sitemap-registry";

describe("sitemap registry", () => {
  it("never emits service-in-city redirect paths", () => {
    const registry = buildSitemapRegistry();
    const redirects = registry.filter((entry) =>
      isSitemapRedirectPath(entry.path),
    );
    expect(redirects).toEqual([]);

    const serviceInCity = registry.filter((entry) =>
      matchServiceInCityPrettyPath(entry.path),
    );
    expect(serviceInCity).toEqual([]);

    expect(
      registry.some((e) => e.path === "/invisible-grills-in-visakhapatnam/"),
    ).toBe(false);
    expect(
      registry.some((e) => e.path === "/visakhapatnam/invisible-grills/"),
    ).toBe(true);
  });

  it("uses absolute HTTPS URLs with trailing slash", () => {
    const registry = buildSitemapRegistry();
    expect(registry.length).toBeGreaterThan(100);
    for (const entry of registry) {
      expect(entry.url.startsWith("https://")).toBe(true);
      expect(entry.url.endsWith("/")).toBe(true);
      expect(entry.path.endsWith("/")).toBe(true);
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });

  it("contains unique URLs only", () => {
    const registry = buildSitemapRegistry();
    const urls = registry.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("partitions into CHUNK-sized files when needed", () => {
    const chunks = buildSitemapChunks();
    expect(chunks.length).toBeGreaterThan(0);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(SITEMAP_CHUNK_SIZE);
    }
    const flat = chunks.flat();
    expect(flat.length).toBe(buildSitemapRegistry().length);
  });

  it("stays under Google single-sitemap URL limit", () => {
    expect(buildSitemapRegistry().length).toBeLessThanOrEqual(50000);
  });

  it("expands beyond the prior ~11k curated baseline", () => {
    expect(buildSitemapRegistry().length).toBeGreaterThan(20000);
  });

  it("includes indexable hubs and excludes thank-you", () => {
    const paths = new Set(buildSitemapRegistry().map((e) => e.path));
    expect(paths.has("/")).toBe(true);
    expect(paths.has("/services/")).toBe(true);
    expect(paths.has("/privacy-policy/")).toBe(true);
    expect(paths.has("/testimonials/")).toBe(true);
    expect(paths.has("/thank-you/")).toBe(false);
    expect(paths.has("/guides/invisible-grills-buying-guide/")).toBe(false);
  });
});
