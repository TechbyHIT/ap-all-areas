/**
 * §124 SEO red flags — must be detected before scale.
 */

export type SeoRedFlag =
  | "keyword-stuffing"
  | "duplicate-city-pages"
  | "fake-projects"
  | "fake-reviews"
  | "fake-addresses"
  | "fake-local-claims"
  | "doorway-pages"
  | "thin-pages"
  | "irrelevant-faqs"
  | "excessive-internal-links"
  | "unnatural-anchor-text"
  | "duplicate-metadata"
  | "conflicting-canonicals"
  | "sitemap-noindex-mismatch"
  | "blocked-resources"
  | "orphan-pages"
  | "broken-links"
  | "mass-generated-no-unique-value";

export type RedFlagFinding = {
  flag: SeoRedFlag;
  severity: "critical" | "warn";
  detail: string;
  path?: string;
};

const STUFFING = /\b(best|top|cheap)\b.{0,40}\b(best|top|cheap)\b/i;
const UNNATURAL_ANCHOR = /^(click here|read more|link|here)$/i;

export function detectCopyRedFlags(input: {
  path?: string;
  title?: string;
  description?: string;
  body?: string;
  anchorTexts?: string[];
  claimsLocalBranch?: boolean;
  hasCoordinates?: boolean;
  isDoorwayRisk?: boolean;
  wordCount?: number;
  internalLinkCount?: number;
  inSitemap?: boolean;
  noindex?: boolean;
}): RedFlagFinding[] {
  const findings: RedFlagFinding[] = [];
  const text = `${input.title ?? ""} ${input.description ?? ""} ${input.body ?? ""}`;

  if (STUFFING.test(text) || /\b(\w+)\s+\1\s+\1\b/i.test(text)) {
    findings.push({
      flag: "keyword-stuffing",
      severity: "critical",
      detail: "Possible keyword stuffing in copy",
      path: input.path,
    });
  }

  if (input.claimsLocalBranch && !input.hasCoordinates) {
    findings.push({
      flag: "fake-local-claims",
      severity: "critical",
      detail: "Local branch claim without verified physical location",
      path: input.path,
    });
  }

  if (input.isDoorwayRisk) {
    findings.push({
      flag: "doorway-pages",
      severity: "critical",
      detail: "Doorway / city-name-swap risk",
      path: input.path,
    });
  }

  if ((input.wordCount ?? 999) < 150) {
    findings.push({
      flag: "thin-pages",
      severity: "warn",
      detail: "Very low word count",
      path: input.path,
    });
  }

  if ((input.internalLinkCount ?? 0) > 80) {
    findings.push({
      flag: "excessive-internal-links",
      severity: "warn",
      detail: "Unusually high internal link count",
      path: input.path,
    });
  }

  for (const anchor of input.anchorTexts ?? []) {
    if (UNNATURAL_ANCHOR.test(anchor.trim())) {
      findings.push({
        flag: "unnatural-anchor-text",
        severity: "warn",
        detail: `Unnatural anchor: ${anchor}`,
        path: input.path,
      });
    }
  }

  if (input.inSitemap && input.noindex) {
    findings.push({
      flag: "sitemap-noindex-mismatch",
      severity: "critical",
      detail: "URL is in sitemap but noindex",
      path: input.path,
    });
  }

  return findings;
}

export const ALL_SEO_RED_FLAGS: SeoRedFlag[] = [
  "keyword-stuffing",
  "duplicate-city-pages",
  "fake-projects",
  "fake-reviews",
  "fake-addresses",
  "fake-local-claims",
  "doorway-pages",
  "thin-pages",
  "irrelevant-faqs",
  "excessive-internal-links",
  "unnatural-anchor-text",
  "duplicate-metadata",
  "conflicting-canonicals",
  "sitemap-noindex-mismatch",
  "blocked-resources",
  "orphan-pages",
  "broken-links",
  "mass-generated-no-unique-value",
];
