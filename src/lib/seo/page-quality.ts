/**
 * §35 page quality score — internal QC, not a Google ranking claim.
 *
 * 80+ publish candidate · 65–79 review · 50–64 rewrite · <50 do not index
 */

export const PAGE_QUALITY_PUBLISH = 80;
export const PAGE_QUALITY_REVIEW = 65;
export const PAGE_QUALITY_REWRITE = 50;

export type PageQualityBreakdown = {
  searchIntentClarity: number;
  serviceSpecificity: number;
  localUniqueness: number;
  usefulInformation: number;
  realEvidence: number;
  internalLinking: number;
  uxReadability: number;
  mediaQuality: number;
  businessTrustSignals: number;
};

export type PageQualityInput = Partial<PageQualityBreakdown> & {
  /** Convenience flags when scoring programmatically */
  hasUniqueLocalFacts?: boolean;
  hasRealPhotos?: boolean;
  hasTrustContact?: boolean;
  hasInternalLinks?: boolean;
  isDoorwayRisk?: boolean;
};

export type PageQualityResult = {
  breakdown: PageQualityBreakdown;
  total: number;
  band: "publish" | "review" | "rewrite" | "noindex";
  action: string;
};

function clamp(value: number, max: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(max, Math.round(value)));
}

export function scorePageQuality(input: PageQualityInput = {}): PageQualityResult {
  const breakdown: PageQualityBreakdown = {
    searchIntentClarity: clamp(input.searchIntentClarity ?? 12, 15),
    serviceSpecificity: clamp(input.serviceSpecificity ?? 12, 15),
    localUniqueness: clamp(
      input.localUniqueness ?? (input.hasUniqueLocalFacts ? 13 : 6),
      15,
    ),
    usefulInformation: clamp(input.usefulInformation ?? 12, 15),
    realEvidence: clamp(
      input.realEvidence ?? (input.hasRealPhotos ? 12 : 5),
      15,
    ),
    internalLinking: clamp(
      input.internalLinking ?? (input.hasInternalLinks ? 8 : 4),
      10,
    ),
    uxReadability: clamp(input.uxReadability ?? 4, 5),
    mediaQuality: clamp(input.mediaQuality ?? (input.hasRealPhotos ? 4 : 2), 5),
    businessTrustSignals: clamp(
      input.businessTrustSignals ?? (input.hasTrustContact ? 4 : 2),
      5,
    ),
  };

  if (input.isDoorwayRisk) {
    breakdown.localUniqueness = Math.min(breakdown.localUniqueness, 4);
    breakdown.usefulInformation = Math.min(breakdown.usefulInformation, 6);
    breakdown.searchIntentClarity = Math.min(breakdown.searchIntentClarity, 8);
  }

  const total = Object.values(breakdown).reduce((sum, n) => sum + n, 0);

  let band: PageQualityResult["band"];
  let action: string;
  if (total >= PAGE_QUALITY_PUBLISH) {
    band = "publish";
    action = "publish-candidate";
  } else if (total >= PAGE_QUALITY_REVIEW) {
    band = "review";
    action = "review-improve";
  } else if (total >= PAGE_QUALITY_REWRITE) {
    band = "rewrite";
    action = "rewrite-before-index";
  } else {
    band = "noindex";
    action = "do-not-index";
  }

  return { breakdown, total, band, action };
}
