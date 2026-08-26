import { buildSitemapIndexXml } from "@/lib/seo/sitemap-registry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

const FALLBACK_INDEX = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</sitemapindex>
`;

export async function GET() {
  try {
    const xml = buildSitemapIndexXml();
    if (!xml.includes("<sitemapindex") || xml.includes("<urlset")) {
      throw new Error("invalid sitemap index document");
    }
    return new Response(xml, { headers: XML_HEADERS });
  } catch (error) {
    console.error("[sitemap.xml] failed to build index", error);
    return new Response(FALLBACK_INDEX, {
      status: 200,
      headers: XML_HEADERS,
    });
  }
}

export async function HEAD() {
  const res = await GET();
  return new Response(null, { status: res.status, headers: res.headers });
}
