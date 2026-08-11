import type { MetadataRoute } from "next";
import {
  buildSitemapRegistry,
  toMetadataSitemap,
} from "@/lib/seo/sitemap-registry";

/**
 * Single sitemap at `/sitemap.xml`.
 *
 * Do NOT use `generateSitemaps()` here — in Next.js 16 it serves
 * `/sitemap/0.xml` etc. but often leaves `/sitemap.xml` as a 404, which
 * Google Search Console reports as "Couldn't fetch".
 *
 * ~11k URLs is well under the 50,000 URL / 50 MB protocol limits.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return toMetadataSitemap(buildSitemapRegistry());
}
