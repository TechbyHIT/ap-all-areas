import { notFound } from "next/navigation";
import { buildUrlsetXml, getSitemapFile } from "@/lib/seo/sitemap-registry";
import {
  buildKeywordLocalityUrlsetXml,
  parseKeywordSitemapPart,
} from "@/lib/seo/sitemap-scale";

type RouteContext = {
  params: Promise<{ name: string }>;
};

const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(_request: Request, context: RouteContext) {
  const { name } = await context.params;

  const keywordPart = parseKeywordSitemapPart(name);
  if (keywordPart !== null) {
    const xml = buildKeywordLocalityUrlsetXml(keywordPart);
    if (!xml) notFound();
    return new Response(xml, { headers: XML_HEADERS });
  }

  const file = getSitemapFile(name);
  if (!file) notFound();

  return new Response(buildUrlsetXml(file.entries), { headers: XML_HEADERS });
}
