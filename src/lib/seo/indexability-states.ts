/**
 * §54 Indexability states — do not auto-index every generated page.
 */

import type { PageIndexabilityInput } from "@/types/page";
import { isPageIndexable } from "@/lib/publishing/indexability";

export type IndexabilityState =
  | "draft"
  | "review"
  | "published"
  | "indexable"
  | "noindex"
  | "archived";

export const INDEXABILITY_STATES: IndexabilityState[] = [
  "draft",
  "review",
  "published",
  "indexable",
  "noindex",
  "archived",
];

/**
 * Resolve the editorial + technical state for robots / sitemap eligibility.
 * `indexable` means published AND cleared all quality gates.
 */
export function resolveIndexabilityState(
  page: PageIndexabilityInput,
): IndexabilityState {
  const status = page.publicationStatus.toLowerCase();

  if (status === "draft") return "draft";
  if (status === "review") return "review";
  if (status === "archived") return "archived";
  if (status === "noindex" || page.allowIndexing === false) return "noindex";

  if (status === "published") {
    return isPageIndexable(page) ? "indexable" : "published";
  }

  return "draft";
}

/** Sitemap / discovery eligibility (§51–52). */
export function isSitemapEligible(page: PageIndexabilityInput): boolean {
  return resolveIndexabilityState(page) === "indexable";
}

export function shouldEmitNoindex(page: PageIndexabilityInput): boolean {
  const state = resolveIndexabilityState(page);
  return state !== "indexable";
}
