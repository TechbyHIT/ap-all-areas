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
} from "@/lib/seo/sitemap-registry";
import {
  buildKeywordLocalityChunk,
  buildKeywordSitemapIndexXml,
  countKeywordLocalityUrls,
  SCALE_SITEMAP_CHUNK,
} from "@/lib/seo/sitemap-scale";

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

  it("builds a small named sitemap index like core / services / city-services", () => {
    const xml = buildSitemapIndexXml();
    expect(xml).toContain("<sitemapindex");
    expect(xml).not.toContain("<urlset");
    expect(xml).toContain("https://hiranayaenterprises.in/sitemaps/core.xml");
    expect(xml).toContain("https://hiranayaenterprises.in/sitemaps/services.xml");
    expect(xml).toContain(
      "https://hiranayaenterprises.in/sitemaps/city-services.xml",
    );
    expect(xml).toContain("https://hiranayaenterprises.in/sitemaps/societies.xml");
    expect(xml).toContain("https://hiranayaenterprises.in/sitemaps/images.xml");
    expect(xml).toContain("https://hiranayaenterprises.in/sitemaps/areas.xml");
    expect(xml).toContain(
      "https://hiranayaenterprises.in/sitemaps/area-services.xml",
    );
    expect(xml).not.toContain("andhra-pradesh-keywords-1.xml");
    expect(xml).not.toMatch(/\/sitemaps\/[^<]+\.xml\//);
    expect(xml).not.toContain("localhost");
    expect(xml).not.toContain("http://hiranayaenterprises.in");
    expect(xml).not.toContain("http://127.");

    const files = listSitemapFiles();
    expect(files.some((f) => f.name === "core")).toBe(true);
    expect(files.every((f) => f.entries.length > 0)).toBe(true);

    const names = listSitemapIndexNames();
    expect(names).toEqual([
      "core",
      "services",
      "city-services",
      "societies",
      "images",
      "areas",
      "area-services",
    ]);
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
    expect(paths.has("/property-types/")).toBe(true);
    expect(paths.has("/locations/")).toBe(true);
  });

  it("keeps /sitemap.xml as a small index of child files only", () => {
    const xml = buildSitemapIndexXml();
    const childCount = (xml.match(/<sitemap>/g) ?? []).length;
    expect(xml).toContain("<sitemapindex");
    expect(xml).not.toContain("<urlset");
    expect(xml).not.toContain("<url>");
    expect(xml.length).toBeLessThan(8_000);
    expect(childCount).toBe(7);
    expect(listSitemapIndexNames().length).toBe(childCount);
  });

  it("resolves every named child except images via the registry", () => {
    for (const name of listSitemapIndexNames()) {
      if (name === "images") continue;
      const file = getSitemapFile(name);
      expect(file, name).not.toBeNull();
      expect(file!.entries.length).toBeGreaterThan(0);
    }
  });

  it("lists keyword chunks in a separate keywords index", () => {
    const xml = buildKeywordSitemapIndexXml();
    expect(xml).toContain("<sitemapindex");
    expect(xml).toContain(
      "https://hiranayaenterprises.in/sitemaps/andhra-pradesh-keywords-1.xml",
    );
    expect((xml.match(/<sitemap>/g) ?? []).length).toBeGreaterThan(600);
  });

  it("does not put the keyword matrix in the master sitemap index", () => {
    const total = countAllSitemapUrls();
    expect(total).toBe(buildSitemapRegistry().length);
    expect(total).toBeGreaterThan(50);
    expect(total).toBeLessThan(8000);
    expect(countKeywordLocalityUrls()).toBeGreaterThan(2_000_000);

    const first = buildKeywordLocalityChunk(1);
    expect(first.length).toBe(SCALE_SITEMAP_CHUNK);
    expect(first[0].path).toMatch(/^\/[a-z0-9-]+-in-[a-z0-9-]+\/$/);
    expect(first[0].url.startsWith("https://")).toBe(true);
    expect(isSitemapRedirectPath(first[0].path)).toBe(false);

    expect(getSitemapFile("andhra-pradesh-keywords-1")).toBeNull();
  });
});
