/**
 * §73 Search Console optimization loop — recurring workflow types.
 * Does not invent query data; ingest from exports / API later.
 */

export type GscQueryRow = {
  query: string;
  page: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  country?: string;
  device?: string;
};

export type GscOpportunity =
  | "missed-intent"
  | "title-opportunity"
  | "content-gap"
  | "cannibalization"
  | "new-service-demand"
  | "new-location-demand";

export type GscInsight = {
  opportunity: GscOpportunity;
  query: string;
  page: string;
  reason: string;
};

/** Heuristic flags from a GSC export row — human review still required. */
export function flagGscOpportunities(row: GscQueryRow): GscInsight[] {
  const insights: GscInsight[] = [];

  if (row.impressions >= 50 && row.ctr < 0.02 && row.position <= 12) {
    insights.push({
      opportunity: "title-opportunity",
      query: row.query,
      page: row.page,
      reason: "Meaningful impressions with low CTR — review title/description",
    });
  }

  if (row.impressions >= 30 && row.position > 15 && row.clicks <= 1) {
    insights.push({
      opportunity: "content-gap",
      query: row.query,
      page: row.page,
      reason: "Query visible but weak engagement — check content depth/intent",
    });
  }

  if (/\bvs\b|\bor\b|difference|compare/i.test(row.query)) {
    insights.push({
      opportunity: "missed-intent",
      query: row.query,
      page: row.page,
      reason: "Comparison-shaped query — confirm page type matches SERP",
    });
  }

  if (/\bin\s+[a-z]/i.test(row.query) && row.page.includes("/services/")) {
    insights.push({
      opportunity: "new-location-demand",
      query: row.query,
      page: row.page,
      reason: "Local modifier on a non-local URL — evaluate city/locality page",
    });
  }

  return insights;
}

export const GSC_LOOP_CADENCE = {
  weekly: ["queries", "pages", "ctr", "position"],
  monthly: ["cannibalization", "content-gaps", "new-demand"],
} as const;
