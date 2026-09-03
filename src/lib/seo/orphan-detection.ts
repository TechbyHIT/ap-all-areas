/**
 * §41 Orphan page detection — every indexable page needs inbound context,
 * a parent link, useful siblings where applicable, and a breadcrumb path.
 */

import { ROUTES } from "@/config/routes";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { SERVICE_COMPARISON_SLUGS } from "@/data/comparisons";
import { SERVICE_FAMILY_SLUGS } from "@/data/service-families";
import { PROBLEM_SLUGS } from "@/data/problems";
import { listPublishedProjects } from "@/data/projects";
import { normalizePath } from "@/lib/routing/paths";
import {
  cityServiceLinkGraph,
  serviceHubLinkGraph,
  type InternalLinkGraph,
} from "@/lib/seo/internal-links";
import { buildSitemapRegistry } from "@/lib/seo/sitemap-registry";
import { P0_MONEY_CITY_SLUGS } from "@/data/city-local-profiles";

export type OrphanFlags = {
  missingInbound: boolean;
  missingParent: boolean;
  missingSibling: boolean;
  missingBreadcrumbExpectation: boolean;
};

export type OrphanFinding = {
  path: string;
  flags: OrphanFlags;
  inboundCount: number;
  severity: "critical" | "warn";
};

function pathKey(path: string): string {
  return normalizePath(path);
}

function collectGraphEdges(graph: InternalLinkGraph, from: string): Array<{ from: string; to: string }> {
  const fromPath = pathKey(from);
  const targets = [
    ...graph.parent,
    ...graph.children,
    ...graph.siblings,
    ...graph.services,
    ...graph.locations,
    ...graph.guides,
    ...graph.conversion,
  ];
  return targets.map((link) => ({
    from: fromPath,
    to: pathKey(link.href),
  }));
}

/** Hub pages that always emit parent/sibling-style navigation. */
function hubSeedPaths(): string[] {
  return [
    ROUTES.home,
    ROUTES.services,
    ROUTES.locations,
    ROUTES.state,
    ROUTES.solutions,
    ROUTES.guides,
    ROUTES.comparisons,
    ROUTES.projects,
    ROUTES.blog,
    ROUTES.gallery,
    ROUTES.faq,
    ROUTES.contact,
    ROUTES.about,
    "/pricing-guide/",
  ].map(pathKey);
}

/**
 * Build a static internal-link graph from known hubs + service/city graphs.
 * Does not crawl rendered HTML — use report scripts for live link health.
 */
export function buildStaticLinkGraph(): {
  pages: Set<string>;
  inbound: Map<string, Set<string>>;
  outbound: Map<string, Set<string>>;
  parents: Map<string, Set<string>>;
  siblings: Map<string, Set<string>>;
} {
  const pages = new Set<string>();
  const inbound = new Map<string, Set<string>>();
  const outbound = new Map<string, Set<string>>();
  const parents = new Map<string, Set<string>>();
  const siblings = new Map<string, Set<string>>();

  const addPage = (path: string) => pages.add(pathKey(path));
  const addEdge = (
    from: string,
    to: string,
    relation?: "parent" | "sibling" | "other",
  ) => {
    const f = pathKey(from);
    const t = pathKey(to);
    addPage(f);
    addPage(t);
    if (!outbound.has(f)) outbound.set(f, new Set());
    if (!inbound.has(t)) inbound.set(t, new Set());
    outbound.get(f)!.add(t);
    inbound.get(t)!.add(f);
    if (relation === "parent") {
      if (!parents.has(t)) parents.set(t, new Set());
      parents.get(t)!.add(f);
    }
    if (relation === "sibling") {
      if (!siblings.has(t)) siblings.set(t, new Set());
      siblings.get(t)!.add(f);
    }
  };

  for (const hub of hubSeedPaths()) addPage(hub);

  // Home → primary hubs
  for (const hub of hubSeedPaths()) {
    if (hub !== ROUTES.home) addEdge(ROUTES.home, hub, "other");
  }

  addEdge(ROUTES.services, ROUTES.comparisons, "sibling");
  addEdge(ROUTES.services, ROUTES.projects, "sibling");
  addEdge(ROUTES.locations, ROUTES.state, "parent");

  for (const service of INITIAL_SERVICES) {
    const path = ROUTES.service(service.slug);
    addPage(path);
    addEdge(ROUTES.services, path, "parent");
    const graph = serviceHubLinkGraph(service.slug);
    for (const edge of collectGraphEdges(graph, path)) {
      addEdge(edge.from, edge.to, "other");
    }
    for (const parent of graph.parent) {
      addEdge(parent.href, path, "parent");
    }
    // Sibling services
    for (const other of INITIAL_SERVICES) {
      if (other.slug === service.slug) continue;
      addEdge(path, ROUTES.service(other.slug), "sibling");
    }
  }

  for (const family of SERVICE_FAMILY_SLUGS) {
    const path = ROUTES.serviceFamily(family);
    addPage(path);
    addEdge(ROUTES.services, path, "parent");
  }

  for (const slug of SERVICE_COMPARISON_SLUGS) {
    const path = ROUTES.comparison(slug);
    addPage(path);
    addEdge(ROUTES.comparisons, path, "parent");
  }

  for (const slug of PROBLEM_SLUGS) {
    const path = ROUTES.solution(slug);
    addPage(path);
    addEdge(ROUTES.solutions, path, "parent");
  }

  for (const project of listPublishedProjects()) {
    const path = ROUTES.project(project.slug);
    addPage(path);
    addEdge(ROUTES.projects, path, "parent");
  }

  for (const city of P0_MONEY_CITY_SLUGS) {
    for (const service of INITIAL_SERVICES.slice(0, 4)) {
      const path = ROUTES.cityService(city, service.slug);
      addPage(path);
      const graph = cityServiceLinkGraph(city, service.slug);
      for (const edge of collectGraphEdges(graph, path)) {
        addEdge(edge.from, edge.to, "other");
      }
      for (const parent of graph.parent) {
        addEdge(parent.href, path, "parent");
      }
      for (const sibling of graph.siblings) {
        addEdge(sibling.href, path, "sibling");
      }
    }
  }

  return { pages, inbound, outbound, parents, siblings };
}

/**
 * Infer hierarchical parent from silo / hub URL shape when the static graph
 * has not yet wired an explicit edge (most money pages).
 */
export function inferStructuralParent(path: string): string | null {
  const p = pathKey(path);
  if (p === ROUTES.home) return null;

  const segments = p.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  // /services/{slug}/ → /services/
  if (segments[0] === "services" && segments.length === 2) return ROUTES.services;
  // /comparisons/{slug}/ → /comparisons/
  if (segments[0] === "comparisons" && segments.length === 2) {
    return ROUTES.comparisons;
  }
  if (segments[0] === "solutions" && segments.length === 2) return ROUTES.solutions;
  if (segments[0] === "projects" && segments.length === 2) return ROUTES.projects;
  if (segments[0] === "guides" && segments.length === 2) return ROUTES.guides;
  if (segments[0] === "blog" && segments.length === 2) return ROUTES.blog;
  if (segments[0] === "property-types") return ROUTES.propertyTypes;

  // /locations/andhra-pradesh/{city}/... → strip last segment
  if (segments[0] === "locations" && segments.length >= 2) {
    return `/${segments.slice(0, -1).join("/")}/`;
  }

  // Top-level hubs → home
  if (segments.length === 1) return ROUTES.home;

  return `/${segments.slice(0, -1).join("/")}/`;
}

export function detectOrphanPages(options?: {
  /** Limit to sitemap paths (default true). */
  sitemapOnly?: boolean;
  /**
   * When true, also warn for pages whose only inbound is structural hierarchy
   * (no explicit contextual edge in the static graph). Default false — too noisy
   * until HTML crawl wiring is complete.
   */
  includeContextualGaps?: boolean;
}): OrphanFinding[] {
  const graph = buildStaticLinkGraph();
  const sitemapOnly = options?.sitemapOnly !== false;
  const includeContextualGaps = options?.includeContextualGaps === true;
  const sitemapPaths = new Set(
    buildSitemapRegistry().map((e) => pathKey(e.path)),
  );
  const candidates = sitemapOnly ? [...sitemapPaths] : [...graph.pages];

  const findings: OrphanFinding[] = [];

  for (const path of candidates) {
    if (path === ROUTES.home) continue;

    const contextualInbound = graph.inbound.get(path)?.size ?? 0;
    const hasParentEdge = (graph.parents.get(path)?.size ?? 0) > 0;
    const hasSibling = (graph.siblings.get(path)?.size ?? 0) > 0;
    const linkedFromHome = graph.inbound.get(path)?.has(ROUTES.home) ?? false;

    const structuralParent = inferStructuralParent(path);
    const structuralParentExists =
      structuralParent != null &&
      (sitemapPaths.has(structuralParent) ||
        graph.pages.has(structuralParent) ||
        structuralParent === ROUTES.home);

    const effectiveParent =
      hasParentEdge || linkedFromHome || structuralParentExists;

    const missingParent = !effectiveParent;
    const missingBreadcrumbExpectation = !effectiveParent;
    // True orphan: nothing points here and hierarchy parent is missing/broken.
    const missingInbound = contextualInbound === 0 && !structuralParentExists;

    const missingSibling =
      includeContextualGaps &&
      path.startsWith("/services/") &&
      path !== ROUTES.services &&
      !hasSibling &&
      !linkedFromHome;

    const contextualGap =
      includeContextualGaps &&
      contextualInbound === 0 &&
      structuralParentExists;

    if (
      !missingInbound &&
      !missingParent &&
      !missingSibling &&
      !missingBreadcrumbExpectation &&
      !contextualGap
    ) {
      continue;
    }

    const flags: OrphanFlags = {
      missingInbound: missingInbound || contextualGap,
      missingParent,
      missingSibling,
      missingBreadcrumbExpectation,
    };

    findings.push({
      path,
      flags,
      inboundCount: contextualInbound,
      severity:
        missingInbound || missingParent
          ? "critical"
          : "warn",
    });
  }

  return findings.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === "critical" ? -1 : 1;
    return a.path.localeCompare(b.path);
  });
}


export function summarizeOrphans(findings: OrphanFinding[]) {
  return {
    total: findings.length,
    critical: findings.filter((f) => f.severity === "critical").length,
    warn: findings.filter((f) => f.severity === "warn").length,
    missingInbound: findings.filter((f) => f.flags.missingInbound).length,
    missingParent: findings.filter((f) => f.flags.missingParent).length,
  };
}
