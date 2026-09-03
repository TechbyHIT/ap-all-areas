/**
 * §55–57 Facet / filter / internal search / pagination crawl control.
 *
 * Unlimited filter combinations must not become crawlable landing pages.
 */

export type FacetDecision = {
  indexable: boolean;
  reason: string;
};

/** Query params that may appear on public URLs without creating SEO variants. */
export const IGNORED_TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
]);

/** Params that must never create an indexable URL. */
export const BLOCKED_FACET_PARAMS = new Set([
  "sort",
  "order",
  "filter",
  "filters",
  "q",
  "query",
  "search",
  "page",
  "session",
  "ref",
]);

/**
 * Only allow indexing of clean path URLs. Any blocked facet/search/sort
 * query makes the URL noindex (canonical should point at the clean path).
 */
export function evaluateFacetUrl(input: {
  pathname: string;
  searchParams?: URLSearchParams | Record<string, string | string[] | undefined>;
}): FacetDecision {
  const params =
    input.searchParams instanceof URLSearchParams
      ? input.searchParams
      : new URLSearchParams(
          Object.entries(input.searchParams ?? {}).flatMap(([key, value]) => {
            if (value == null) return [];
            if (Array.isArray(value)) return value.map((v) => [key, v] as [string, string]);
            return [[key, value] as [string, string]];
          }),
        );

  for (const key of params.keys()) {
    const lower = key.toLowerCase();
    if (IGNORED_TRACKING_PARAMS.has(lower)) continue;
    if (BLOCKED_FACET_PARAMS.has(lower)) {
      return {
        indexable: false,
        reason: `Blocked facet/search param: ${key}`,
      };
    }
    // Unknown params also stay noindex to prevent parameter sprawl.
    return {
      indexable: false,
      reason: `Uncontrolled query param: ${key}`,
    };
  }

  return { indexable: true, reason: "Clean path URL" };
}

/** Internal search result pages are not SEO landings (§56). */
export function isInternalSearchPath(pathname: string): boolean {
  return /^\/search\/?$/i.test(pathname) || /\/search\//i.test(pathname);
}

/**
 * Pagination policy (§57): page 1 is the canonical hub; deeper pages may
 * exist for crawlability but should noindex unless uniquely valuable.
 */
export function paginationIndexability(pageNumber: number): FacetDecision {
  if (pageNumber <= 1) {
    return { indexable: true, reason: "First page / hub" };
  }
  return {
    indexable: false,
    reason: "Paginated pages stay noindex unless uniquely valuable",
  };
}
