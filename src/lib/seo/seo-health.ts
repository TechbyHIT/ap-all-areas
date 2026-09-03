/**
 * §110–112 Automated SEO QA + health / content quality dashboards.
 */

import { buildSitemapRegistry } from "@/lib/seo/sitemap-registry";
import { detectOrphanPages, summarizeOrphans } from "@/lib/seo/orphan-detection";
import { auditInternalLinksStatic } from "@/lib/seo/link-health";
import { auditRedirectRegistry } from "@/lib/seo/redirect-registry";
import { validateCanonical } from "@/lib/seo/canonical-validation";
import { organizationSchema, webSiteSchema } from "@/lib/schema";
import { validateJsonLd } from "@/lib/seo/schema-validation";
import { INSTALLATION_PHOTOS } from "@/config/installation-photos";
import { validateImageAlt } from "@/lib/seo/image-alt";
import { buildAvailabilityMatrix } from "@/lib/seo/availability-matrix";
import { analyzeServiceContentGaps } from "@/lib/seo/content-gap";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { listRelevantLegalPages, SEO_CHANGE_LOG } from "@/lib/seo/content-governance";
import { getLocalBusinessModel } from "@/lib/seo/local-business-model";
import { assessCrawlUrl } from "@/lib/seo/crawl-url-qa";

export type SeoQaIssue = {
  severity: "critical" | "warn" | "info";
  area: string;
  message: string;
  path?: string;
};

export type SeoHealthDashboard = {
  generatedAt: string;
  totals: {
    sitemapUrls: number;
    indexableUrls: number;
    availabilityRows: number;
    availabilityIndexable: number;
    orphanCritical: number;
    orphanWarn: number;
    brokenLinkStatic: number;
    redirectChains: number;
    redirectLoops: number;
    schemaErrors: number;
    altErrors: number;
    missingMetadataSample: number;
    duplicateTitleRisk: number;
  };
  byPageType: Record<string, number>;
  legalPages: ReturnType<typeof listRelevantLegalPages>;
  changeLogRecent: typeof SEO_CHANGE_LOG;
  business: ReturnType<typeof getLocalBusinessModel>["business"];
};

export type ContentQualityDashboard = {
  generatedAt: string;
  servicesNeedingGaps: Array<{ service: string; gapCount: number }>;
  lowQualityCandidates: number;
  notes: string[];
};

export function runAutomatedSeoQa(): {
  ok: boolean;
  critical: number;
  warn: number;
  issues: SeoQaIssue[];
} {
  const issues: SeoQaIssue[] = [];
  const registry = buildSitemapRegistry();

  for (const entry of registry.slice(0, 80)) {
    const canonical = validateCanonical({
      pagePath: entry.path,
      canonical: entry.url,
      indexable: true,
    });
    if (!canonical.ok) {
      issues.push({
        severity: "critical",
        area: "canonical",
        message: canonical.issues.map((i) => i.message).join("; "),
        path: entry.path,
      });
    }

    const crawl = assessCrawlUrl({ pathname: entry.path });
    if (!crawl.ok) {
      issues.push({
        severity: "warn",
        area: "crawl",
        message: crawl.risks.join(", "),
        path: entry.path,
      });
    }
  }

  const orphans = summarizeOrphans(detectOrphanPages({ sitemapOnly: true }));
  if (orphans.critical > 0) {
    issues.push({
      severity: "critical",
      area: "orphans",
      message: `${orphans.critical} critical orphan findings`,
    });
  }

  const links = auditInternalLinksStatic();
  const linkCritical = links.filter(
    (l) => l.type === "redirect-loop" || l.type === "internal-unknown",
  );
  for (const link of linkCritical.slice(0, 20)) {
    issues.push({
      severity: link.type === "redirect-loop" ? "critical" : "warn",
      area: "links",
      message: `${link.type}: ${link.from} → ${link.to}`,
      path: link.from,
    });
  }

  const redirects = auditRedirectRegistry();
  if (redirects.loops.length > 0) {
    issues.push({
      severity: "critical",
      area: "redirects",
      message: `${redirects.loops.length} redirect loops`,
    });
  }

  for (const schema of [organizationSchema(), webSiteSchema()]) {
    const result = validateJsonLd(schema);
    if (!result.ok) {
      issues.push({
        severity: "critical",
        area: "schema",
        message: result.issues.map((i) => i.message).join("; "),
      });
    }
  }

  for (const photo of INSTALLATION_PHOTOS) {
    const alt = validateImageAlt(photo.alt, photo.src);
    if (!alt.ok) {
      issues.push({
        severity: "warn",
        area: "media",
        message: alt.issues.map((i) => i.message).join("; "),
        path: photo.src,
      });
    }
  }

  const critical = issues.filter((i) => i.severity === "critical").length;
  const warn = issues.filter((i) => i.severity === "warn").length;

  return {
    ok: critical === 0,
    critical,
    warn,
    issues,
  };
}

export function buildSeoHealthDashboard(): SeoHealthDashboard {
  const registry = buildSitemapRegistry();
  const orphans = summarizeOrphans(detectOrphanPages({ sitemapOnly: true }));
  const links = auditInternalLinksStatic();
  const redirects = auditRedirectRegistry();
  const matrix = buildAvailabilityMatrix({ includeLocalities: false });
  const model = getLocalBusinessModel();

  let schemaErrors = 0;
  for (const schema of [organizationSchema(), webSiteSchema()]) {
    if (!validateJsonLd(schema).ok) schemaErrors += 1;
  }

  let altErrors = 0;
  for (const photo of INSTALLATION_PHOTOS) {
    if (!validateImageAlt(photo.alt, photo.src).ok) altErrors += 1;
  }

  const byPageType: Record<string, number> = {};
  for (const entry of registry) {
    const type = entry.path.startsWith("/services/")
      ? "service"
      : entry.path.startsWith("/locations/")
        ? "location"
        : entry.path.startsWith("/projects/")
          ? "project"
          : entry.path.startsWith("/guides/")
            ? "guide"
            : entry.path.startsWith("/comparisons/")
              ? "comparison"
              : "other";
    byPageType[type] = (byPageType[type] ?? 0) + 1;
  }

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      sitemapUrls: registry.length,
      indexableUrls: registry.length,
      availabilityRows: matrix.length,
      availabilityIndexable: matrix.filter((r) => r.available).length,
      orphanCritical: orphans.critical,
      orphanWarn: orphans.warn,
      brokenLinkStatic: links.length,
      redirectChains: redirects.chains.length,
      redirectLoops: redirects.loops.length,
      schemaErrors,
      altErrors,
      missingMetadataSample: 0,
      duplicateTitleRisk: 0,
    },
    byPageType,
    legalPages: listRelevantLegalPages(),
    changeLogRecent: SEO_CHANGE_LOG.slice(-10),
    business: model.business,
  };
}

export function buildContentQualityDashboard(): ContentQualityDashboard {
  const servicesNeedingGaps = INITIAL_SERVICES.filter((s) => s.allowIndexing)
    .map((s) => ({
      service: s.slug,
      gapCount: analyzeServiceContentGaps(s.slug).length,
    }))
    .filter((s) => s.gapCount > 0)
    .sort((a, b) => b.gapCount - a.gapCount);

  return {
    generatedAt: new Date().toISOString(),
    servicesNeedingGaps: servicesNeedingGaps.slice(0, 20),
    lowQualityCandidates: servicesNeedingGaps.reduce((n, s) => n + s.gapCount, 0),
    notes: [
      "Traffic/CTR/conversion panels require Search Console + analytics imports.",
      "Do not invent declining-traffic flags without real data.",
    ],
  };
}
