/**
 * §113 SEO priority score — optimize by business value, not traffic alone.
 * Internal prioritization score (0–100), not a Google ranking claim.
 */

export type SeoPriorityInput = {
  businessValue: number; // 0–20
  searchDemand: number; // 0–15
  currentImpressions: number; // 0–15 (opportunity awareness)
  rankingOpportunity: number; // 0–15 (room to improve)
  conversionPotential: number; // 0–20
  contentQuality: number; // 0–15
  /** If true, high traffic alone must not dominate ranking of work */
  highTrafficOnly?: boolean;
};

export type SeoPriorityResult = {
  total: number;
  band: "p0" | "p1" | "p2" | "defer";
  reason: string;
};

function clamp(n: number, max: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(max, Math.round(n)));
}

export function scoreSeoPriority(input: SeoPriorityInput): SeoPriorityResult {
  if (input.highTrafficOnly) {
    return {
      total: clamp(input.currentImpressions, 15),
      band: "defer",
      reason: "Do not prioritize solely because of traffic — add business/conversion signals",
    };
  }

  const total =
    clamp(input.businessValue, 20) +
    clamp(input.searchDemand, 15) +
    clamp(input.currentImpressions, 15) +
    clamp(input.rankingOpportunity, 15) +
    clamp(input.conversionPotential, 20) +
    clamp(input.contentQuality, 15);

  let band: SeoPriorityResult["band"] = "defer";
  if (total >= 75) band = "p0";
  else if (total >= 55) band = "p1";
  else if (total >= 35) band = "p2";

  return {
    total,
    band,
    reason:
      band === "p0"
        ? "High business + conversion + opportunity"
        : band === "defer"
          ? "Below priority threshold — improve quality or defer"
          : `Priority ${band}`,
  };
}
