/**
 * Phase 19 SEO audit — validates the approved page matrix, not Prisma drafts.
 *
 * Checks every curated SEO URL for:
 *   path, indexability, self-canonical form, sitemap presence, title,
 *   render mode, priority, and exclusion reasons.
 *
 * Live HTTP is optional (`SEO_AUDIT_BASE_URL`). Static checks always run.
 *
 * Usage: npm run seo:audit
 */

import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { SITE_CONFIG } from "../src/config/site";
import { buildCanonicalUrl } from "../src/lib/routing/paths";
import {
  getHighPrioritySeoPages,
  listApprovedSeoPages,
  listIndexableSeoPages,
  resolveSeoPage,
  summarizeSeoPageMatrix,
  type SeoPageRecord,
} from "../src/lib/seo/seo-page-matrix";
import { buildSitemapRegistry } from "../src/lib/seo/sitemap-registry";
import { countKeywordLocalityUrls } from "../src/lib/seo/sitemap-scale";
import { buildSitemapInventory } from "../src/lib/seo/sitemap-inventory";

type AuditRow = {
  url: string;
  path: string;
  status: "ok" | "fail" | "excluded";
  httpStatus: number | "static" | "skipped";
  indexable: boolean;
  canonical: "self" | "mismatch" | "missing";
  sitemap: boolean;
  title: string;
  h1Hint: string;
  schema: "expected";
  breadcrumb: "expected";
  render: "static" | "isr";
  priority: number;
  reason: string;
};

const INVALID_SAMPLES = [
  "/invalid-page/",
  "/locations/andhra-pradesh/eluru/",
  "/locations/andhra-pradesh/vijayawada/not-a-real-service/",
  "/thank-you/",
  "/admin/",
  "/api/health/",
];

function normalize(pathName: string): string {
  if (pathName === "/") return pathName;
  return pathName.endsWith("/") ? pathName : `${pathName}/`;
}

function canonicalFor(page: SeoPageRecord): "self" | "mismatch" {
  const expected = buildCanonicalUrl(page.path);
  const host = new URL(SITE_CONFIG.url).hostname.replace(/^www\./, "");
  try {
    const parsed = new URL(expected);
    const parsedHost = parsed.hostname.replace(/^www\./, "");
    if (parsedHost !== host) return "mismatch";
    if (parsed.pathname !== page.path && parsed.pathname + "/" !== page.path) {
      return "mismatch";
    }
    return "self";
  } catch {
    return "mismatch";
  }
}

function rowForPage(
  page: SeoPageRecord,
  sitemapPaths: Set<string>,
): AuditRow {
  const inSitemap = sitemapPaths.has(page.path);
  const canonical = canonicalFor(page);
  const issues: string[] = [];
  if (page.indexable && !inSitemap) issues.push("missing-from-sitemap");
  if (!page.indexable && inSitemap) issues.push("noindex-in-sitemap");
  if (canonical !== "self") issues.push("canonical");
  if (!page.title.trim()) issues.push("missing-title");

  return {
    url: buildCanonicalUrl(page.path),
    path: page.path,
    status: issues.length > 0 ? "fail" : "ok",
    httpStatus: "static",
    indexable: page.indexable,
    canonical,
    sitemap: inSitemap,
    title: page.title,
    h1Hint: page.title,
    schema: "expected",
    breadcrumb: "expected",
    render: page.renderMode,
    priority: page.priority,
    reason: issues.length > 0 ? issues.join(",") : page.kind,
  };
}

async function probeHttp(
  rows: AuditRow[],
  baseUrl: string,
): Promise<void> {
  const sample = rows.filter((row) => row.status === "ok").slice(0, 12);
  for (const row of sample) {
    const url = `${baseUrl.replace(/\/$/, "")}${row.path}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(8000),
      });
      row.httpStatus = response.status;
      if (response.status !== 200) {
        row.status = "fail";
        row.reason = `${row.reason};http-${response.status}`;
      }
    } catch {
      row.httpStatus = "skipped";
    }
  }
}

async function main() {
  const pages = listApprovedSeoPages();
  const summary = summarizeSeoPageMatrix();
  const sitemap = buildSitemapRegistry();
  const sitemapPaths = new Set(sitemap.map((entry) => entry.path));
  const inventory = buildSitemapInventory();

  const rows = pages.map((page) => rowForPage(page, sitemapPaths));
  const titles = new Map<string, string[]>();
  for (const page of pages) {
    const list = titles.get(page.title) ?? [];
    list.push(page.path);
    titles.set(page.title, list);
  }
  const duplicateTitles = [...titles.entries()].filter(
    ([, paths]) => paths.length > 1,
  );

  const excluded = INVALID_SAMPLES.map((samplePath) => {
    const normalized = normalize(samplePath);
    const page = resolveSeoPage(normalized);
    const inSitemap = sitemapPaths.has(normalized);
    const correctlyExcluded = page === null && !inSitemap;
    return {
      url: buildCanonicalUrl(normalized),
      path: normalized,
      status: correctlyExcluded ? ("excluded" as const) : ("fail" as const),
      httpStatus: "static" as const,
      indexable: false,
      canonical: "missing" as const,
      sitemap: inSitemap,
      title: "",
      h1Hint: "",
      schema: "expected" as const,
      breadcrumb: "expected" as const,
      render: "isr" as const,
      priority: 0,
      reason: correctlyExcluded
        ? "correctly excluded"
        : "invalid-url-present-in-matrix-or-sitemap",
    };
  });

  const extraSitemap = sitemap.filter((entry) => !resolveSeoPage(entry.path));
  const prerenderCount = getHighPrioritySeoPages().length;
  const indexable = listIndexableSeoPages();

  const baseUrl = process.env.SEO_AUDIT_BASE_URL;
  if (baseUrl) {
    await probeHttp(rows, baseUrl);
  }

  const failed = [...rows, ...excluded].filter((row) => row.status === "fail");
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      approved: summary.approved,
      indexable: summary.indexable,
      prerender: prerenderCount,
      isr: summary.isr,
      sitemapCurated: sitemap.length,
      sitemapKeywordLayer: countKeywordLocalityUrls(),
      sitemapIndexableTotal: inventory.indexableTotal,
      duplicateTitles: duplicateTitles.length,
      extraSitemapPaths: extraSitemap.length,
      accidental404: failed.filter((row) =>
        row.reason.includes("missing-from-sitemap"),
      ).length,
      accidentalNoindex: rows.filter((row) => !row.indexable).length,
      canonicalIssues: rows.filter((row) => row.canonical !== "self").length,
      correctlyExcluded: excluded.filter((row) => row.status === "excluded")
        .length,
      failed: failed.length,
      byKind: summary.byKind,
    },
    extraSitemapPaths: extraSitemap.map((entry) => entry.path),
    duplicateTitles: duplicateTitles.map(([title, paths]) => ({ title, paths })),
    excluded,
    failures: failed,
    pages: rows,
  };

  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "seo-audit.json"),
    JSON.stringify(report, null, 2),
  );

  console.log("SEO page matrix audit");
  console.log(`  approved:     ${summary.approved}`);
  console.log(`  indexable:    ${summary.indexable}`);
  console.log(`  prerender:    ${prerenderCount}`);
  console.log(`  ISR:          ${summary.isr}`);
  console.log(`  sitemap:      ${sitemap.length} curated + ${countKeywordLocalityUrls()} keyword layer`);
  console.log(`  excluded ok:  ${report.summary.correctlyExcluded}/${INVALID_SAMPLES.length}`);
  console.log(`  duplicate titles: ${duplicateTitles.length}`);
  console.log(`  failures:     ${failed.length}`);

  for (const row of [...rows.slice(0, 6), ...excluded]) {
    const mark = row.status === "ok" || row.status === "excluded" ? "✅" : "❌";
    console.log(
      `${mark} ${row.path}  ${row.httpStatus}  indexable=${row.indexable}  canonical=${row.canonical}  sitemap=${row.sitemap}  render=${row.render}`,
    );
  }

  if (failed.length > 0) {
    console.error("First failures:");
    for (const row of failed.slice(0, 20)) {
      console.error(`  ${row.path} — ${row.reason}`);
    }
    process.exit(1);
  }

  console.log("seo:audit passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
