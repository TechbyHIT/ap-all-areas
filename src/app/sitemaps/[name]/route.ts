import {
  buildImagesUrlsetXml,
  buildUrlsetXml,
  getSitemapFile,
} from "@/lib/seo/sitemap-registry";
import {
  buildKeywordLocalityUrlsetXml,
  buildKeywordSitemapIndexXml,
  parseKeywordSitemapPart,
} from "@/lib/seo/sitemap-scale";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ name: string }>;
};

const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

const EMPTY_URLSET = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>
`;

function xml(body: string, status = 200) {
  return new Response(body, { status, headers: XML_HEADERS });
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { name } = await context.params;
    const slug = name.replace(/\.xml$/i, "");

    if (slug === "keywords") {
      return xml(buildKeywordSitemapIndexXml());
    }

    if (slug === "images") {
      return xml(buildImagesUrlsetXml());
    }

    const keywordPart = parseKeywordSitemapPart(slug);
    if (keywordPart !== null) {
      const keywordXml = buildKeywordLocalityUrlsetXml(keywordPart);
      if (!keywordXml) return xml(EMPTY_URLSET, 404);
      return xml(keywordXml);
    }

    const file = getSitemapFile(slug);
    if (!file) return xml(EMPTY_URLSET, 404);

    return xml(buildUrlsetXml(file.entries));
  } catch (error) {
    console.error("[sitemaps] failed to build urlset", error);
    return xml(EMPTY_URLSET, 404);
  }
}

export async function HEAD(request: Request, context: RouteContext) {
  const res = await GET(request, context);
  return new Response(null, { status: res.status, headers: res.headers });
}
