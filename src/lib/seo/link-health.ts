/**
 * §42 Broken link system — static registry checks + optional HTTP monitoring.
 */

import { normalizePath } from "@/lib/routing/paths";
import { buildStaticLinkGraph } from "@/lib/seo/orphan-detection";
import { lookupRedirect, resolveRedirectTarget } from "@/lib/seo/redirect-registry";
import { buildSitemapRegistry, isSitemapRedirectPath } from "@/lib/seo/sitemap-registry";

export type LinkIssueType =
  | "internal-unknown"
  | "points-to-redirect"
  | "redirect-chain"
  | "redirect-loop"
  | "http-404"
  | "http-410"
  | "http-error"
  | "external-broken";

export type LinkIssue = {
  type: LinkIssueType;
  from: string;
  to: string;
  detail: string;
};

export type LinkHealthReport = {
  generatedAt: string;
  staticIssues: LinkIssue[];
  httpIssues: LinkIssue[];
  summary: {
    staticCount: number;
    httpCount: number;
    redirectChains: number;
    redirectLoops: number;
  };
};

/** Paths we know exist but may not be in the public sitemap (noindex / utility). */
const KNOWN_VALID_OUTSIDE_SITEMAP = new Set(
  [
    "/thank-you/",
    "/admin/",
    "/privacy-policy/",
    "/disclaimer/",
    "/terms-and-conditions/",
  ].map(normalizePath),
);

function knownPathSet(): Set<string> {
  const set = new Set<string>();
  for (const entry of buildSitemapRegistry()) {
    set.add(normalizePath(entry.path));
  }
  for (const path of KNOWN_VALID_OUTSIDE_SITEMAP) set.add(path);
  const graph = buildStaticLinkGraph();
  for (const path of graph.pages) set.add(path);
  return set;
}

/**
 * Static internal link audit against sitemap + link graph + redirect registry.
 * Does not fetch the network.
 */
export function auditInternalLinksStatic(): LinkIssue[] {
  const known = knownPathSet();
  const graph = buildStaticLinkGraph();
  const issues: LinkIssue[] = [];

  for (const [from, targets] of graph.outbound) {
    for (const to of targets) {
      const redirect = lookupRedirect(to);
      if (redirect) {
        issues.push({
          type: "points-to-redirect",
          from,
          to,
          detail: `Links to redirecting URL → ${redirect.to}`,
        });
        const resolved = resolveRedirectTarget(to);
        if (resolved.loop) {
          issues.push({
            type: "redirect-loop",
            from,
            to,
            detail: `Loop via ${resolved.hops.join(" → ")}`,
          });
        } else if (resolved.chain) {
          issues.push({
            type: "redirect-chain",
            from,
            to,
            detail: `Chain ${[...resolved.hops, resolved.finalPath].join(" → ")}`,
          });
        }
        continue;
      }

      if (isSitemapRedirectPath(to)) {
        issues.push({
          type: "points-to-redirect",
          from,
          to,
          detail: "Pretty/legacy path that 308s to silo canonical",
        });
        continue;
      }

      if (!known.has(to) && !to.startsWith("/api/") && !to.startsWith("/#")) {
        issues.push({
          type: "internal-unknown",
          from,
          to,
          detail: "Target not in sitemap registry or known static graph",
        });
      }
    }
  }

  return issues;
}

export async function probeUrl(
  url: string,
): Promise<{ status: number; finalUrl: string; chainLength: number }> {
  let current = url;
  let chainLength = 0;
  for (let i = 0; i < 8; i++) {
    const res = await fetch(current, {
      method: "HEAD",
      redirect: "manual",
      headers: { "user-agent": "ap-all-areas-link-health/1.0" },
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) {
        return { status: res.status, finalUrl: current, chainLength };
      }
      chainLength += 1;
      current = new URL(loc, current).toString();
      continue;
    }
    return { status: res.status, finalUrl: current, chainLength };
  }
  return { status: 0, finalUrl: current, chainLength };
}

/**
 * Optional live HTTP monitoring for a sample of sitemap + outbound URLs.
 */
export async function auditLinksHttp(options: {
  baseUrl: string;
  samplePaths: string[];
}): Promise<LinkIssue[]> {
  const issues: LinkIssue[] = [];
  const base = options.baseUrl.replace(/\/$/, "");

  for (const path of options.samplePaths) {
    const url = `${base}${normalizePath(path)}`;
    try {
      const result = await probeUrl(url);
      if (result.status === 404) {
        issues.push({
          type: "http-404",
          from: "(sitemap)",
          to: path,
          detail: "HTTP 404",
        });
      } else if (result.status === 410) {
        issues.push({
          type: "http-410",
          from: "(sitemap)",
          to: path,
          detail: "HTTP 410",
        });
      } else if (result.chainLength > 1) {
        issues.push({
          type: "redirect-chain",
          from: "(http)",
          to: path,
          detail: `Redirect chain length ${result.chainLength} → ${result.finalUrl}`,
        });
      } else if (result.status >= 400 || result.status === 0) {
        issues.push({
          type: "http-error",
          from: "(http)",
          to: path,
          detail: `HTTP ${result.status || "network-error"}`,
        });
      }
    } catch (error) {
      issues.push({
        type: "http-error",
        from: "(http)",
        to: path,
        detail: error instanceof Error ? error.message : "fetch failed",
      });
    }
  }

  return issues;
}

export function buildLinkHealthReport(staticIssues: LinkIssue[], httpIssues: LinkIssue[] = []): LinkHealthReport {
  return {
    generatedAt: new Date().toISOString(),
    staticIssues,
    httpIssues,
    summary: {
      staticCount: staticIssues.length,
      httpCount: httpIssues.length,
      redirectChains: [...staticIssues, ...httpIssues].filter(
        (i) => i.type === "redirect-chain",
      ).length,
      redirectLoops: staticIssues.filter((i) => i.type === "redirect-loop").length,
    },
  };
}
