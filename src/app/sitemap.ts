import type { MetadataRoute } from "next";
import {
  buildSitemapChunks,
  toMetadataSitemap,
} from "@/lib/seo/sitemap-registry";

export async function generateSitemaps() {
  return buildSitemapChunks().map((_, id) => ({ id }));
}

export default async function sitemap(props: {
  id: number | Promise<number>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const chunks = buildSitemapChunks();
  return toMetadataSitemap(chunks[id] ?? []);
}
