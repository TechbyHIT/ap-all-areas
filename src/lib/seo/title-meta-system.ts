/**
 * §78–81 Title, meta description, heading hierarchy, readability.
 * Benefit-first titles/descriptions — coverage honesty belongs in body copy,
 * not as the first words of a SERP snippet.
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

const DEFAULT_CTA = "Free photo estimate · measured quote";

function clampTitle(title: string, max = 60): string {
  if (title.length <= max) return title;
  const cut = title.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

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
      return clampTitle(`${input.primary} | Free Photo Estimate`);
    case "local":
      return clampTitle(
        input.city
          ? `${input.primary} in ${input.city} | ${brand}`
          : `${input.primary} | ${brand}`,
      );
    case "locality":
      return clampTitle(
        input.locality && input.city
          ? `${input.primary} in ${input.locality}, ${input.city}`
          : input.primary,
      );
    case "guide":
      return clampTitle(`${input.primary} | ${brand} Guide`);
    case "comparison":
      return clampTitle(`${input.primary} | Which Fits?`);
    case "project":
      return clampTitle(`${input.primary} | Project Photo`);
    default:
      return clampTitle(input.primary);
  }
}

/**
 * Benefit → place/service → soft CTA. Do not lead with coverage disclaimers.
 */
export function buildMetaDescription(input: {
  service?: string;
  location?: string;
  differentiator?: string;
  cta?: string;
}): string {
  const cta = (input.cta ?? DEFAULT_CTA).replace(/\.$/, "");
  const parts: string[] = [];

  if (input.service && input.location) {
    parts.push(
      `${input.service} in ${input.location} — ${cta}.`,
    );
  } else if (input.service) {
    parts.push(
      `${input.service} across Andhra Pradesh — ${cta}.`,
    );
  } else if (input.location) {
    parts.push(
      `Safety nets & invisible grills in ${input.location} — ${cta}.`,
    );
  } else {
    parts.push(`Safety nets & invisible grills in Andhra Pradesh — ${cta}.`);
  }

  if (input.differentiator) {
    const diff = input.differentiator
      .replace(/we do not claim a (local )?branch[^.]*\./gi, "")
      .replace(/not a (claimed )?local branch[^.]*\./gi, "")
      .trim();
    if (diff) parts.push(diff.replace(/\.$/, "") + ".");
  }

  return parts.join(" ").replace(/\s+/g, " ").trim().slice(0, 160);
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
