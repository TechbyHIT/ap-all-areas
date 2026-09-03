/**
 * §58–60 JS SEO + Core Web Vitals — policy checklist (not fabricated scores).
 */

export const JS_SEO_REQUIREMENTS = [
  "H1 available in server-rendered HTML",
  "Primary content in server-rendered HTML",
  "Internal links in server-rendered HTML",
  "Breadcrumbs in server-rendered HTML",
  "Metadata via Next.js Metadata API",
  "Structured data in initial HTML (JSON-LD)",
] as const;

export const NEXT_SEO_PRACTICES = [
  "Prefer Server Components for SEO content",
  "Use generateMetadata / generatePageMetadata",
  "Sitemap via registry routes (/sitemap.xml + /sitemaps/*)",
  "robots.ts for crawl rules",
  "next/image with explicit width/height for CLS",
  "Do not statically generate every locality×service at build time",
  "Use revalidation (ISR / force-dynamic) appropriately for matrix pages",
] as const;

export type CwvCheck = {
  id: string;
  metric: "LCP" | "INP" | "CLS" | "TTFB" | "other";
  recommendation: string;
};

export const CWV_CHECKLIST: CwvCheck[] = [
  {
    id: "lcp-hero",
    metric: "LCP",
    recommendation: "Optimize hero images; use priority + sized next/image",
  },
  {
    id: "lcp-size",
    metric: "LCP",
    recommendation: "Serve responsive srcset; avoid oversized downloads",
  },
  {
    id: "inp-js",
    metric: "INP",
    recommendation: "Avoid unnecessary client components on marketing pages",
  },
  {
    id: "cls-images",
    metric: "CLS",
    recommendation: "Reserve image dimensions; no layout-shifting ads/banners",
  },
  {
    id: "cls-fonts",
    metric: "CLS",
    recommendation: "Use stable font loading (size-adjust / fallback metrics)",
  },
  {
    id: "ttfb-cache",
    metric: "TTFB",
    recommendation: "CDN + compression + cache headers on static assets/sitemaps",
  },
];

export function cwvChecklistIds(): string[] {
  return CWV_CHECKLIST.map((c) => c.id);
}
