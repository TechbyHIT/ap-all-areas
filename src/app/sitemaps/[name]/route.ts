import { notFound } from "next/navigation";
import { buildUrlsetXml, getSitemapFile } from "@/lib/seo/sitemap-registry";

type RouteContext = {
  params: Promise<{ name: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { name } = await context.params;
  const file = getSitemapFile(name);
  if (!file) notFound();

  return new Response(buildUrlsetXml(file.entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
