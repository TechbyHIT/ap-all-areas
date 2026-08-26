/**
 * People-first SEO score. Pages below the floor must not be indexed.
 */

export const SEO_PUBLISH_MIN_SCORE = 85;

export type SeoScoreBreakdown = {
  searchIntent: number;
  originality: number;
  localRelevance: number;
  contentUsefulness: number;
  topicalCompleteness: number;
  entityRelevance: number;
  internalLinking: number;
  technicalSeo: number;
  indexability: number;
  conversionValue: number;
};

export type SeoScoreInput = {
  searchIntent: number;
  originality: number;
  localRelevance: number;
  contentUsefulness: number;
  topicalCompleteness: number;
  entityRelevance: number;
  internalLinking: number;
  technicalSeo: number;
  indexability: number;
  conversionValue: number;
};

function clamp10(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(10, Math.round(value)));
}

export function scoreSeoPage(input: SeoScoreInput): {
  breakdown: SeoScoreBreakdown;
  total: number;
  publishable: boolean;
} {
  const breakdown: SeoScoreBreakdown = {
    searchIntent: clamp10(input.searchIntent),
    originality: clamp10(input.originality),
    localRelevance: clamp10(input.localRelevance),
    contentUsefulness: clamp10(input.contentUsefulness),
    topicalCompleteness: clamp10(input.topicalCompleteness),
    entityRelevance: clamp10(input.entityRelevance),
    internalLinking: clamp10(input.internalLinking),
    technicalSeo: clamp10(input.technicalSeo),
    indexability: clamp10(input.indexability),
    conversionValue: clamp10(input.conversionValue),
  };

  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  return {
    breakdown,
    total,
    publishable: total >= SEO_PUBLISH_MIN_SCORE,
  };
}

/** Default score for a fully unique, linked, technically valid commercial page. */
export function uniqueLocalPageScore(options?: {
  hasLocalFacts?: boolean;
  hasCityProfile?: boolean;
}): ReturnType<typeof scoreSeoPage> {
  const local = options?.hasLocalFacts || options?.hasCityProfile ? 9 : 5;
  const original = options?.hasLocalFacts ? 9 : options?.hasCityProfile ? 8 : 4;
  return scoreSeoPage({
    searchIntent: 9,
    originality: original,
    localRelevance: local,
    contentUsefulness: 9,
    topicalCompleteness: 8,
    entityRelevance: 9,
    internalLinking: 9,
    technicalSeo: 9,
    indexability: 9,
    conversionValue: 9,
  });
}
