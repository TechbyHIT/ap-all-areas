/**
 * §101–105 Crawl efficiency, depth, URL normalization, HTTP status, security.
 */

import { normalizePath } from "@/lib/routing/paths";
import { IGNORED_TRACKING_PARAMS, evaluateFacetUrl } from "@/lib/seo/facet-seo";
import { resolveRedirectTarget } from "@/lib/seo/redirect-registry";

export type CrawlRisk =
  | "parameter-url"
  | "duplicate-path"
  | "redirect-chain"
  | "orphan"
  | "infinite-combination"
  | "sitemap-mismatch"
  | "canonical-mismatch";

export function assessCrawlUrl(input: {
  pathname: string;
  search?: string;
}): { ok: boolean; risks: CrawlRisk[] } {
  const risks: CrawlRisk[] = [];
  const params = new URLSearchParams(input.search ?? "");
  const facet = evaluateFacetUrl({
    pathname: input.pathname,
    searchParams: params,
  });
  if (!facet.indexable) risks.push("parameter-url");

  for (const key of params.keys()) {
    if (IGNORED_TRACKING_PARAMS.has(key.toLowerCase())) {
      risks.push("parameter-url");
      break;
    }
  }

  const redirected = resolveRedirectTarget(input.pathname);
  if (redirected.chain) risks.push("redirect-chain");
  if (redirected.loop) risks.push("redirect-chain");

  const lower = input.pathname.toLowerCase();
  if (input.pathname !== lower) risks.push("duplicate-path");

  return { ok: risks.length === 0, risks: [...new Set(risks)] };
}

/** §102 Important commercial paths should be shallow. */
export function estimateCrawlDepth(path: string): number {
  return normalizePath(path).split("/").filter(Boolean).length;
}

export function isShallowCommercialPath(path: string, maxDepth = 4): boolean {
  return estimateCrawlDepth(path) <= maxDepth;
}

/** §103 URL normalization helpers beyond normalizePath. */
export function normalizePublicUrlPath(raw: string): {
  path: string;
  issues: string[];
} {
  const issues: string[] = [];
  let path = raw.trim();

  try {
    if (path.includes("://")) {
      const u = new URL(path);
      path = u.pathname;
      if ([...u.searchParams.keys()].length > 0) {
        issues.push("stripped-query-params");
      }
    }
  } catch {
    issues.push("unparseable-url");
  }

  if (path !== path.toLowerCase()) {
    issues.push("uppercased-path");
    path = path.toLowerCase();
  }

  if (path.includes("%")) {
    try {
      const decoded = decodeURIComponent(path);
      if (decoded !== path) {
        issues.push("encoded-path");
        path = decoded;
      }
    } catch {
      issues.push("bad-encoding");
    }
  }

  path = normalizePath(path);
  return { path, issues };
}

/** §104 Expected HTTP outcomes for public URLs. */
export type ExpectedHttpStatus = 200 | 301 | 308 | 404 | 410;

export function classifyHttpStatus(status: number): {
  ok: boolean;
  expected: boolean;
  label: string;
} {
  if (status === 200) return { ok: true, expected: true, label: "valid-page" };
  if (status === 301 || status === 308) {
    return { ok: true, expected: true, label: "intentional-redirect" };
  }
  if (status === 404) return { ok: true, expected: true, label: "missing-page" };
  if (status === 410) {
    return { ok: true, expected: true, label: "intentionally-removed" };
  }
  if (status >= 500) {
    return { ok: false, expected: false, label: "server-error" };
  }
  return { ok: false, expected: false, label: `unexpected-${status}` };
}

/** §105 Security surfaces that must stay out of SEO crawl. */
export const SEO_SECURITY_DISALLOW = [
  "/admin/",
  "/api/",
  "/thank-you/",
  "/landings/",
] as const;
