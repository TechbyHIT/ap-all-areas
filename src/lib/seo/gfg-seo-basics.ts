/**
 * GeeksforGeeks organic SEO checklist → Hiranya implementation map.
 * @see https://www.geeksforgeeks.org/techtips/search-engine-optimization-seo-basics/
 *
 * White-hat only. Off-page (backlinks, GBP, PPC) = marketing ops outside code.
 */

export type GfgChecklistItem = {
  /** GFG section name */
  gfg: string;
  /** What we ship in this repo */
  site: string;
  /** organic | technical | off-page */
  category: "organic" | "technical" | "off-page" | "ops";
  status: "done" | "partial" | "ops";
};

/** Full GFG organic SEO tutorial mapped to codebase systems. */
export const GFG_ORGANIC_CHECKLIST: GfgChecklistItem[] = [
  {
    gfg: "Keyword research (seed, long-tail, LSI, intent)",
    site: "keyword-intents.ts · keyword-ownership.ts · serp-intent.ts · seo:keyword-ownership",
    category: "organic",
    status: "done",
  },
  {
    gfg: "Keyword optimization (titles, meta, H1, body, URLs)",
    site: "title-meta-system.ts · generatePageMetadata · location silo routes",
    category: "organic",
    status: "done",
  },
  {
    gfg: "On-page SEO (structure, navigation, headers)",
    site: "PremiumPageHero/ServiceHero H1 · Breadcrumbs · ChooseByNeed · internal-links.ts",
    category: "organic",
    status: "done",
  },
  {
    gfg: "Quality content + E-E-A-T",
    site: "location-page-content.ts · city-local-profiles · area-local-facts · AuthorByline · about",
    category: "organic",
    status: "partial",
  },
  {
    gfg: "Content audit + cannibalization avoidance",
    site: "cannibalization.ts · page-decision.ts · thin-content report · seo-red-flags.ts",
    category: "organic",
    status: "done",
  },
  {
    gfg: "Internal linking",
    site: "ServiceCards · AreaCards · RelatedGuides · LinkDirectory · orphan-detection.ts",
    category: "organic",
    status: "done",
  },
  {
    gfg: "Image SEO (alt, lazy load, WebP)",
    site: "image-alt.ts · page-image-pick.ts · HeroLcpImage · images:optimize",
    category: "technical",
    status: "done",
  },
  {
    gfg: "Local SEO",
    site: "AP silo /locations/andhra-pradesh/ · Service schema · honest coverage copy",
    category: "organic",
    status: "done",
  },
  {
    gfg: "Mobile-friendly / responsive",
    site: "responsive-shell.css · mobile nav · touch CTAs",
    category: "technical",
    status: "done",
  },
  {
    gfg: "Site speed / Core Web Vitals",
    site: "HeroLcpImage · WebP · font subset · lazy FAB · FAST_LOADING_RULES",
    category: "technical",
    status: "done",
  },
  {
    gfg: "Technical SEO (crawl, index, canonical)",
    site: "robots.ts · sitemap-registry · programmatic-indexability · proxy 308 fixes",
    category: "technical",
    status: "done",
  },
  {
    gfg: "Sitemap (XML) + robots.txt",
    site: "/sitemap.xml · /sitemaps/{name}/ · SEARCH_CONSOLE_SETUP.md",
    category: "technical",
    status: "done",
  },
  {
    gfg: "SSL/HTTPS",
    site: "metadataBase HTTPS · canonical URLs · VPS nginx TLS (deploy)",
    category: "technical",
    status: "ops",
  },
  {
    gfg: "Structured data (LocalBusiness, Service, FAQ, Breadcrumb)",
    site: "lib/schema/index.ts · FaqJsonLd · articleSchema for guides/blog",
    category: "organic",
    status: "done",
  },
  {
    gfg: "White-hat guardrails (no stuffing, doorways, fake local)",
    site: "seo-red-flags.ts · canPublishProgrammaticPage · robots via isPageIndexable",
    category: "organic",
    status: "done",
  },
  {
    gfg: "Analytics + Search Console monitoring",
    site: "seo:qa · organic-seo-audit · GSC loop docs · admin/audits",
    category: "ops",
    status: "partial",
  },
  {
    gfg: "Off-page SEO (backlinks, social, domain authority)",
    site: "OUT OF CODE — genuine citations, GBP, partner links",
    category: "off-page",
    status: "ops",
  },
  {
    gfg: "Link building (editorial, quality over quantity)",
    site: "OUT OF CODE — guides/blog as linkable assets only",
    category: "off-page",
    status: "ops",
  },
];

export const GFG_SEO_STRATEGY_MAP = GFG_ORGANIC_CHECKLIST.map(({ gfg, site }) => ({
  gfg,
  site,
}));

/** GFG site-speed checklist enforced in shared templates. */
export const FAST_LOADING_RULES = [
  "Single LCP hero with priority + sized next/image",
  "Lazy-load below-fold images",
  "Defer non-critical client JS (floating CTA only)",
  "Avoid mounting mega-menus in DOM until open",
  "Limit homepage link dumps; keep crawl hubs focused",
  "WebP via next/image; long-cache /images/*",
  "Server Components for primary SEO content (js-seo-policy.ts)",
  "Gzip compression + immutable static cache (next.config.ts)",
] as const;

/** Black-hat patterns we detect and block (GFG § Black-Hat SEO). */
export const BLACK_HAT_BLOCKED = [
  "keyword-stuffing",
  "doorway-pages",
  "fake-local-claims",
  "thin-pages",
  "sitemap-noindex-mismatch",
  "mass-generated-no-unique-value",
] as const;

export function gfgChecklistSummary(): {
  done: number;
  partial: number;
  ops: number;
  total: number;
} {
  const done = GFG_ORGANIC_CHECKLIST.filter((i) => i.status === "done").length;
  const partial = GFG_ORGANIC_CHECKLIST.filter((i) => i.status === "partial").length;
  const ops = GFG_ORGANIC_CHECKLIST.filter((i) => i.status === "ops").length;
  return { done, partial, ops, total: GFG_ORGANIC_CHECKLIST.length };
}
