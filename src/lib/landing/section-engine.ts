/**
 * Landing section engine.
 *
 * A section renders only when its data exists AND is substantial enough to be
 * worth a visitor's scroll. This is the anti-doorway rule in code: a page that
 * cannot fill a section honestly simply does not show it, rather than padding
 * with the same paragraph and a different place name.
 */

import type { LandingPageData } from "@/lib/landing/types";

export type LandingSectionId =
  | "breadcrumbs"
  | "hero"
  | "trust"
  | "quick-start"
  | "problems"
  | "primary-content"
  | "offerings"
  | "benefits"
  | "use-cases"
  | "options"
  | "requirements"
  | "process"
  | "pricing"
  | "content-blocks"
  | "evidence"
  | "coverage"
  | "related"
  | "faq"
  | "append"
  | "final-cta";

/** Minimum items before a grid section earns its place on the page. */
const MIN_GRID_ITEMS = 2;

function hasItems(list: readonly unknown[] | undefined, min = MIN_GRID_ITEMS) {
  return Array.isArray(list) && list.length >= min;
}

/**
 * Which sections this page has real content for.
 * Order is fixed so the whole site keeps one reading rhythm.
 */
export function resolveLandingSections(
  data: LandingPageData,
): LandingSectionId[] {
  const sections: LandingSectionId[] = [];

  if (hasItems(data.breadcrumbs, 2)) sections.push("breadcrumbs");
  sections.push("hero");
  if (data.trustLabel) sections.push("trust");
  if (hasItems(data.quickStart?.options, 3)) sections.push("quick-start");
  if (hasItems(data.problems, 3)) sections.push("problems");
  if (data.primaryContent) sections.push("primary-content");
  if (hasItems(data.offerings?.items, 1)) sections.push("offerings");
  if (data.contentBlocks) sections.push("content-blocks");
  if (hasItems(data.benefits?.items, 1)) sections.push("benefits");
  if (hasItems(data.useCases?.items, MIN_GRID_ITEMS)) sections.push("use-cases");
  if (hasItems(data.options?.items, MIN_GRID_ITEMS)) sections.push("options");
  if (hasItems(data.requirements?.items, MIN_GRID_ITEMS)) {
    sections.push("requirements");
  }
  if (hasItems(data.process?.steps, 3)) sections.push("process");
  if (hasItems(data.pricing?.factors, MIN_GRID_ITEMS)) sections.push("pricing");
  if (data.evidence) sections.push("evidence");
  if (data.coverage?.text) sections.push("coverage");
  // Directories and extra link blocks sit with `related`, not after the FAQ.
  // Splitting them across the FAQ gives a page two disconnected "where to go
  // next" zones and pushes the answer block away from the closing CTA.
  if (data.appendSections) sections.push("append");
  if (hasItems(data.related, 1)) sections.push("related");
  if (hasItems(data.faqs, 3)) sections.push("faq");
  sections.push("final-cta");

  return sections;
}

export type LandingValidationIssue = {
  field: string;
  message: string;
  severity: "error" | "warn";
};

/**
 * Content validation (§55) — catch broken pages before they render.
 * Errors mean the page should not be published as-is; warnings mean it is
 * publishable but thin and should not be treated as a money page.
 */
export function validateLandingData(
  data: LandingPageData,
): { ok: boolean; issues: LandingValidationIssue[] } {
  const issues: LandingValidationIssue[] = [];

  if (!data.hero.title.trim()) {
    issues.push({ field: "hero.title", message: "Missing H1", severity: "error" });
  }
  if (!data.hero.description.trim()) {
    issues.push({
      field: "hero.description",
      message: "Missing hero description",
      severity: "error",
    });
  }
  if (!data.canonicalUrl.startsWith("http")) {
    issues.push({
      field: "canonicalUrl",
      message: "Canonical must be absolute",
      severity: "error",
    });
  }
  if (!data.cta.title.trim()) {
    issues.push({ field: "cta", message: "Missing final CTA", severity: "error" });
  }
  if (!data.hero.image?.src) {
    issues.push({
      field: "hero.image",
      message: "No hero visual",
      severity: "warn",
    });
  }

  const sections = resolveLandingSections(data);
  const hasInternalLinks =
    hasItems(data.related, 1) ||
    hasItems(data.offerings?.items, 1) ||
    hasItems(data.problems, 1) ||
    Boolean(data.coverage?.links?.length);
  if (!hasInternalLinks) {
    issues.push({
      field: "related",
      message: "No contextual internal links",
      severity: "warn",
    });
  }

  // A landing page needs substance beyond hero + CTA to deserve indexing.
  const substantive = sections.filter(
    (s) => !["breadcrumbs", "hero", "trust", "final-cta"].includes(s),
  );
  if (substantive.length < 4) {
    issues.push({
      field: "sections",
      message: `Only ${substantive.length} substantive sections — thin page risk`,
      severity: "warn",
    });
  }

  return {
    ok: issues.every((i) => i.severity !== "error"),
    issues,
  };
}
