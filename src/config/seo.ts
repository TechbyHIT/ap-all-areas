import {
  indexabilityFloor,
  PAGE_TIER_WORD_BANDS,
} from "@/config/content-architecture";

/**
 * SEO defaults for Hiranya Enterprises.
 * Word floors follow page-tier architecture (city money pages stay focused;
 * deep intent lives on dedicated guides — not 30k-word location URLs).
 */
export const SEO_CONFIG = {
  titleSuffix: "| Hiranya Enterprises",
  defaultTitle:
    "Invisible Grills, Safety Nets & Pigeon Nets in Andhra Pradesh | Hiranya Enterprises",
  defaultDescription:
    "Compare balcony safety nets, pigeon nets and invisible grills across Andhra Pradesh. Send a photo for a measured local estimate—Visakhapatnam, Vijayawada and nearby cities.",

  /**
   * Minimum unique words for indexability gates.
   * Targets (editorial) live in PAGE_TIER_WORD_BANDS — do not treat max as a pad-to goal.
   */
  minimumWordCounts: {
    home: indexabilityFloor("home"),
    service: indexabilityFloor("service-hub"),
    "service-location": indexabilityFloor("city-service"),
    "service-area": indexabilityFloor("locality-service"),
    location: indexabilityFloor("city"),
    area: indexabilityFloor("locality"),
    district: indexabilityFloor("district"),
    state: indexabilityFloor("state"),
    guide: indexabilityFloor("buying-guide"),
    "price-guide": indexabilityFloor("price-guide"),
    "installation-guide": indexabilityFloor("installation-guide"),
    "maintenance-guide": indexabilityFloor("maintenance-guide"),
    "faq-guide": indexabilityFloor("faq-troubleshooting"),
    blog: 1200,
    solution: 1000,
    "property-type": 1000,
    about: 1000,
    contact: indexabilityFloor("contact"),
    faq: indexabilityFloor("faq-troubleshooting"),
  },

  /** Editorial target ceilings — stop writing when intent is satisfied. */
  targetWordBands: {
    cityService: PAGE_TIER_WORD_BANDS["city-service"],
    localityService: PAGE_TIER_WORD_BANDS["locality-service"],
    ultimateGuide: PAGE_TIER_WORD_BANDS["ultimate-service-guide"],
  },

  qualityThreshold: 80,
  similarityThreshold: 0.7,
  sitemapMaxUrls: 10000,

  /**
   * Stable sitemap lastmod for matrix-driven URLs.
   * Bump when services, locations, keywords, or hub content change.
   */
  sitemapContentRevision: "2026-08-11",

  /**
   * Strategy flag: prefer more unique useful URLs over mega-pages.
   * 5,000 high-quality intent pages > 500 encyclopedic dumps.
   */
  preferBreadthWithUniqueValue: true,
} as const;
