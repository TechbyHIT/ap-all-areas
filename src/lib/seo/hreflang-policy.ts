/**
 * §45–47 Hreflang / international / multilingual policy.
 *
 * This site is single-locale (en-IN) and single-country (India / Andhra Pradesh).
 * Do not emit hreflang until genuine alternate language or region URLs exist.
 */

import { SITE_CONFIG } from "@/config/site";

export const HREFLANG_ENABLED = false;

export const SITE_LOCALE = SITE_CONFIG.locale; // en-IN
export const SITE_COUNTRY = "IN";
export const SITE_LANGUAGE = "en";

export type HreflangAlternate = {
  lang: string; // e.g. en-IN, te-IN, x-default
  href: string; // absolute URL
};

/**
 * Validate reciprocal hreflang clusters when (and only when) enabled.
 * Each URL in the set must list every other member, including itself.
 */
export function validateHreflangCluster(
  pages: Array<{ url: string; alternates: HreflangAlternate[] }>,
): { ok: boolean; issues: string[] } {
  if (!HREFLANG_ENABLED) {
    return {
      ok: true,
      issues: [],
    };
  }

  const issues: string[] = [];
  const byUrl = new Map(pages.map((p) => [p.url, p]));

  for (const page of pages) {
    const langs = new Set(page.alternates.map((a) => a.lang));
    if (!langs.has("x-default")) {
      issues.push(`${page.url}: missing x-default hreflang`);
    }
    for (const alt of page.alternates) {
      const target = byUrl.get(alt.href);
      if (!target) {
        issues.push(`${page.url}: alternate ${alt.lang} → ${alt.href} not in cluster`);
        continue;
      }
      const reverse = target.alternates.find((a) => a.href === page.url);
      if (!reverse) {
        issues.push(
          `${page.url}: missing reciprocal link from ${alt.href}`,
        );
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

/** Metadata helper — returns undefined so Next never emits unused alternates.languages. */
export function hreflangMetadataAlternates(): undefined {
  return undefined;
}
