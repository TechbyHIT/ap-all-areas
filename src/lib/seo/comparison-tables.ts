/**
 * §82 Service comparison tables — factual factor rows only.
 */

import type { ComparisonDimension, ServiceComparison } from "@/data/comparisons";

/** Recommended comparison factors (prompt §82). */
export const STANDARD_COMPARISON_FACTORS = [
  "Best for",
  "Installation",
  "Visibility",
  "Maintenance",
  "Durability",
  "Cost factors",
] as const;

export type StandardComparisonFactor =
  (typeof STANDARD_COMPARISON_FACTORS)[number];

/** Map existing dimension labels onto the standard set where possible. */
const LABEL_ALIASES: Record<string, StandardComparisonFactor> = {
  purpose: "Best for",
  "best for": "Best for",
  ideal: "Best for",
  installation: "Installation",
  install: "Installation",
  appearance: "Visibility",
  visibility: "Visibility",
  look: "Visibility",
  maintenance: "Maintenance",
  durability: "Durability",
  "cost factors": "Cost factors",
  cost: "Cost factors",
  pricing: "Cost factors",
};

export function normalizeFactorLabel(label: string): string {
  const key = label.trim().toLowerCase();
  return LABEL_ALIASES[key] ?? label;
}

/**
 * Build a display table preferring standard factors, then remaining factual rows.
 * Does not invent cells — missing standard factors are omitted.
 */
export function buildComparisonTableRows(
  comparison: ServiceComparison,
): ComparisonDimension[] {
  const byStandard = new Map<string, ComparisonDimension>();
  const extras: ComparisonDimension[] = [];

  for (const row of comparison.dimensions) {
    const normalized = normalizeFactorLabel(row.label);
    const isStandard = (STANDARD_COMPARISON_FACTORS as readonly string[]).includes(
      normalized,
    );
    if (isStandard && !byStandard.has(normalized)) {
      byStandard.set(normalized, {
        label: normalized,
        optionA: row.optionA,
        optionB: row.optionB,
      });
    } else if (!isStandard) {
      extras.push(row);
    }
  }

  // Ideal customer/application often encode "Best for"
  if (!byStandard.has("Best for")) {
    byStandard.set("Best for", {
      label: "Best for",
      optionA: comparison.idealApplicationA || comparison.idealCustomerA,
      optionB: comparison.idealApplicationB || comparison.idealCustomerB,
    });
  }

  const ordered = STANDARD_COMPARISON_FACTORS.filter((f) =>
    byStandard.has(f),
  ).map((f) => byStandard.get(f)!);

  return [...ordered, ...extras];
}

/** §83 — never mass-produce City A vs City B pages. */
export function allowGeographicComparisonPage(reason: string): boolean {
  const trimmed = reason.trim();
  if (!trimmed) return false;
  // Require an explicit editorial justification string stored with the page.
  return trimmed.length >= 40;
}
