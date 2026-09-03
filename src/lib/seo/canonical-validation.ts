/**
 * §44 Canonical system — every indexable page must have one absolute, self-consistent canonical.
 */

import { SITE_CONFIG } from "@/config/site";
import { buildCanonicalUrl, normalizePath, publicSiteOrigin } from "@/lib/routing/paths";
import { isSitemapRedirectPath } from "@/lib/seo/sitemap-registry";
import { lookupRedirect } from "@/lib/seo/redirect-registry";

export type CanonicalCheckInput = {
  /** Path of the page being rendered (with trailing slash). */
  pagePath: string;
  /** Declared canonical URL (absolute or path). */
  canonical: string;
  indexable?: boolean;
};

export type CanonicalIssue = {
  code:
    | "missing"
    | "not-absolute"
    | "wrong-host"
    | "not-https"
    | "path-mismatch"
    | "points-to-redirect"
    | "trailing-slash"
    | "conflicting";
  message: string;
};

export function validateCanonical(input: CanonicalCheckInput): {
  ok: boolean;
  issues: CanonicalIssue[];
  expected: string;
} {
  const issues: CanonicalIssue[] = [];
  const expected = buildCanonicalUrl(input.pagePath);
  const pagePath = normalizePath(input.pagePath);

  if (!input.canonical || !input.canonical.trim()) {
    issues.push({ code: "missing", message: "Canonical is missing" });
    return { ok: false, issues, expected };
  }

  let parsed: URL;
  try {
    parsed = new URL(input.canonical);
  } catch {
    issues.push({
      code: "not-absolute",
      message: "Canonical must be an absolute URL",
    });
    return { ok: false, issues, expected };
  }

  if (parsed.protocol !== "https:") {
    issues.push({ code: "not-https", message: "Canonical must use HTTPS" });
  }

  const origin = publicSiteOrigin();
  if (parsed.origin !== origin && process.env.NODE_ENV === "production") {
    issues.push({
      code: "wrong-host",
      message: `Canonical host must be ${origin}`,
    });
  }

  const canonicalPath = normalizePath(parsed.pathname);
  if (SITE_CONFIG.trailingSlash && !parsed.pathname.endsWith("/")) {
    issues.push({
      code: "trailing-slash",
      message: "Canonical path must use trailing slash",
    });
  }

  if (input.indexable !== false && canonicalPath !== pagePath) {
    issues.push({
      code: "path-mismatch",
      message: `Indexable page canonical path (${canonicalPath}) must match page (${pagePath})`,
    });
  }

  if (
    lookupRedirect(canonicalPath) ||
    isSitemapRedirectPath(canonicalPath)
  ) {
    issues.push({
      code: "points-to-redirect",
      message: "Canonical must not point at a redirecting URL",
    });
  }

  return { ok: issues.length === 0, issues, expected };
}

/** Detect duplicate conflicting canonical declarations on one page. */
export function detectConflictingCanonicals(
  declared: string[],
): CanonicalIssue | null {
  const unique = [...new Set(declared.map((c) => c.trim()).filter(Boolean))];
  if (unique.length > 1) {
    return {
      code: "conflicting",
      message: `Multiple conflicting canonicals: ${unique.join(" | ")}`,
    };
  }
  return null;
}
