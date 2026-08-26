import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "@/proxy";

function req(path: string, headers?: HeadersInit) {
  return new NextRequest(`http://localhost:3001${path}`, { headers });
}

function rewriteTarget(response: Response) {
  return (
    response.headers.get("x-middleware-rewrite") ||
    response.headers.get("location")
  );
}

describe("proxy routing", () => {
  it("does not rewrite /sitemap.xml onto itself", () => {
    const res = proxy(req("/sitemap.xml"));
    const dest = rewriteTarget(res);
    expect(res.status).not.toBe(308);
    if (dest) {
      expect(dest.endsWith("/sitemap.xml")).toBe(true);
      expect(dest).not.toMatch(/sitemap\.xml\/sitemap\.xml/);
    }
  });

  it("does not 308 the public Guntur silo hub", () => {
    const res = proxy(req("/locations/andhra-pradesh/guntur/"));
    expect(res.status).not.toBe(308);
    expect(rewriteTarget(res) ?? "").not.toMatch(/\/locations\/guntur\/?$/);
  });

  it("308s the legacy city URL onto the silo", () => {
    const res = proxy(req("/locations/guntur/"));
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toContain(
      "/locations/andhra-pradesh/guntur/",
    );
  });
});
