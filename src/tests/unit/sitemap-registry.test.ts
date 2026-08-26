import { describe, expect, it } from "vitest";
import { matchServiceInCityPrettyPath } from "@/lib/routing/pretty-money-urls";
import {
  buildSitemapChunks,
  buildSitemapIndexXml,
  buildSitemapRegistry,
  countAllSitemapUrls,
  getSitemapFile,
  isSitemapRedirectPath,
  listSitemapFiles,
  listSitemapIndexNames,
  SITEMAP_CHUNK_SIZE,
  SCALE_SITEMAP_CHUNK,
} from "@/lib/seo/sitemap-registry";

describe("sitemap registry", () => {
  it("never emits service-in-city or legacy silo redirect paths", () => {
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
    ).toBe(false);
    expect(
      registry.some(
        (e) =>
          e.path ===
          "/locations/andhra-pradesh/visakhapatnam/invisible-grills/",
      ),
    ).toBe(true);
  });

  it("uses absolute HTTPS URLs with trailing slash", () => {
    const registry = buildSitemapRegistry();
    expect(registry.length).toBeGreaterThan(50);
    expect(registry.length).toBeLessThan(8000);
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

  it("partitions into named files under the URL cap", () => {
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

  it("builds a sitemap index pointing at /sitemaps/*.xml files that exist", () => {
    const xml = buildSitemapIndexXml();
    expect(xml).toContain("<sitemapindex");
    expect(xml).not.toContain("<urlset");
    expect(xml).toContain("https://hiranayaenterprises.in/sitemaps/pages.xml");
    expect(xml).toContain("https://hiranayaenterprises.in/sitemaps/locations.xml");
    expect(xml).toContain(
      "https://hiranayaenterprises.in/sitemaps/local-services.xml",
    );
    expect(xml).toContain(
      "https://hiranayaenterprises.in/sitemaps/andhra-pradesh-keywords-1.xml",
    );
    expect(xml).not.toMatch(/\/sitemaps\/[^<]+\.xml\//);

    const files = listSitemapFiles();
    expect(files.some((f) => f.name === "pages")).toBe(true);
    expect(files.every((f) => f.entries.length > 0)).toBe(true);

    const names = listSitemapIndexNames();
    expect(names[0]).toBe("pages");
    expect(names.some((name) => name.startsWith("andhra-pradesh-keywords-"))).toBe(
      true,
    );
  });

  it("includes indexable hubs and excludes thank-you", () => {
    const paths = new Set(buildSitemapRegistry().map((e) => e.path));
    expect(paths.has("/")).toBe(true);
    expect(paths.has("/services/")).toBe(true);
    expect(paths.has("/locations/andhra-pradesh/")).toBe(true);
    expect(paths.has("/privacy-policy/")).toBe(true);
    expect(paths.has("/testimonials/")).toBe(true);
    expect(paths.has("/thank-you/")).toBe(false);
    expect(paths.has("/guides/invisible-grills-buying-guide/")).toBe(true);
    expect(paths.has("/locations/")).toBe(true);
  });

  it("indexes the full AP keyword × locality matrix across child sitemaps", () => {
    const total = countAllSitemapUrls();
    expect(total).toBeGreaterThan(2_000_000);
    expect(total).toBeLessThan(3_000_000);

    const first = getSitemapFile("andhra-pradesh-keywords-1");
    expect(first).not.toBeNull();
    expect(first!.entries.length).toBe(SCALE_SITEMAP_CHUNK);
    expect(first!.entries[0].path).toMatch(/^\/[a-z0-9-]+-in-[a-z0-9-]+\/$/);
    expect(first!.entries[0].url.startsWith("https://")).toBe(true);
    expect(isSitemapRedirectPath(first!.entries[0].path)).toBe(false);

    expect(getSitemapFile("andhra-pradesh-keywords-9999")).toBeNull();
  });
});
