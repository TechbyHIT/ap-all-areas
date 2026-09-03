/**
 * §30 / §38 — entity + freshness from central business config.
 * Do not invent updated dates; bump only when material facts change.
 */

import { BUSINESS_CONFIG } from "@/config/business";
import { SEO_CONFIG } from "@/config/seo";

export const LOCAL_ENTITY = {
  name: BUSINESS_CONFIG.name,
  legalName: BUSINESS_CONFIG.legalName,
  phoneDisplay: BUSINESS_CONFIG.phone.displayFormatted,
  phoneRaw: BUSINESS_CONFIG.phone.raw,
  email: BUSINESS_CONFIG.email,
  websiteUrl: BUSINESS_CONFIG.websiteUrl,
  address: BUSINESS_CONFIG.address,
  serviceAreaText: BUSINESS_CONFIG.serviceArea.displayText,
  primaryCity: BUSINESS_CONFIG.serviceArea.primaryCity,
  state: BUSINESS_CONFIG.serviceArea.state,
  socialLinks: BUSINESS_CONFIG.socialLinks,
} as const;

/** ISO day from SEO content revision — for matrix pages without per-page dates. */
export function contentRevisionDay(): string {
  return SEO_CONFIG.sitemapContentRevision;
}

export type FreshnessFlag =
  | "ok"
  | "review-business-info"
  | "review-service-area"
  | "review-pricing-factors"
  | "stale-placeholder-social";

export function auditLocalEntityFreshness(): FreshnessFlag[] {
  const flags: FreshnessFlag[] = [];
  const social = BUSINESS_CONFIG.socialLinks;
  if (
    social.instagram.includes("[") ||
    social.facebook.includes("[") ||
    social.youtube.includes("[")
  ) {
    flags.push("stale-placeholder-social");
  }
  if (!BUSINESS_CONFIG.coordinates.latitude) {
    flags.push("review-business-info");
  }
  return flags.length > 0 ? flags : ["ok"];
}
