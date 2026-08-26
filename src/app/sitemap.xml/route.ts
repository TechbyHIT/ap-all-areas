import { buildSitemapIndexXml } from "@/lib/seo/sitemap-registry";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(buildSitemapIndexXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
