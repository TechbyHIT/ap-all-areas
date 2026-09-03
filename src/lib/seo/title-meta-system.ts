/**
 * §78–81 Title, meta description, heading hierarchy, readability.
 */

import { BUSINESS_CONFIG } from "@/config/business";

export type TitleIntent =
  | "service"
  | "local"
  | "locality"
  | "guide"
  | "comparison"
  | "project"
  | "default";

export function buildIntentTitle(input: {
  intent: TitleIntent;
  primary: string;
  city?: string;
  locality?: string;
  brand?: string;
}): string {
  const brand = input.brand ?? BUSINESS_CONFIG.name;

  switch (input.intent) {
    case "service":
      return `${input.primary} | Installation & Service Guide`;
    case "local":
      return input.city
        ? `${input.primary} in ${input.city} | ${brand}`
        : `${input.primary} | Service Coverage`;
    case "locality":
      return input.locality && input.city
        ? `${input.primary} in ${input.locality}, ${input.city}`
        : input.primary;
    case "guide":
      return `${input.primary} | ${brand} Guide`;
    case "comparison":
      return `${input.primary} | Which Option Fits?`;
    case "project":
      return `${input.primary} | Installation Photo`;
    default:
      return input.primary;
  }
}

export function buildMetaDescription(input: {
  service?: string;
  location?: string;
  differentiator: string;
  cta?: string;
}): string {
  const parts: string[] = [];
  if (input.service && input.location) {
    parts.push(`${input.service} in ${input.location}.`);
  } else if (input.service) {
    parts.push(`${input.service} installation across Andhra Pradesh.`);
  } else if (input.location) {
    parts.push(`Installation support in ${input.location}, Andhra Pradesh.`);
  }
  parts.push(input.differentiator.replace(/\.$/, "") + ".");
  if (input.cta) parts.push(input.cta.replace(/\.$/, "") + ".");
  return parts.join(" ").slice(0, 160);
}

export type HeadingNode = {
  level: 1 | 2 | 3;
  text: string;
};

export function validateHeadingHierarchy(headings: HeadingNode[]): {
  ok: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count !== 1) {
    issues.push(`Expected exactly one H1, found ${h1Count}`);
  }

  let last = 0;
  for (const heading of headings) {
    if (last === 0 && heading.level !== 1) {
      issues.push("Document should start with H1");
    }
    if (last > 0 && heading.level > last + 1) {
      issues.push(
        `Skipped heading level before "${heading.text}" (H${last} → H${heading.level})`,
      );
    }
    last = heading.level;
  }

  return { ok: issues.length === 0, issues };
}

export const READABILITY_PRACTICES = [
  "short paragraphs",
  "bullets",
  "tables where comparing options",
  "comparison blocks",
  "FAQs",
  "visual sections",
  "clear CTAs",
] as const;

export const READABILITY_ANTI_PATTERNS = [
  "giant text walls",
  "repetitive keyword paragraphs",
  "meaningless headings",
  "filler",
] as const;

export function readabilityChecklist(): {
  prefer: readonly string[];
  avoid: readonly string[];
} {
  return {
    prefer: READABILITY_PRACTICES,
    avoid: READABILITY_ANTI_PATTERNS,
  };
}
