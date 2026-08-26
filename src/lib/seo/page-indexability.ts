import { indexabilityFloor, type PageTier } from "@/config/content-architecture";
import type { PageIndexabilityInput } from "@/types/page";

export function staticPageIndexability(indexable = true): PageIndexabilityInput {
  return {
    publicationStatus: "published",
    allowIndexing: indexable,
    qualityScore: 90,
    contentReviewed: true,
    localDataVerified: indexable,
    hasUniqueMetadata: true,
    hasUniqueContent: true,
    hasValidCanonical: true,
    hasInternalLinks: true,
    hasValidSchema: true,
    wordCount: 800,
    minimumRequiredWordCount: 300,
    similarityScore: 0.2,
  };
}

/** Public location pages that used to be draft/noindex — now indexable. */
export function seedLocationIndexability(): PageIndexabilityInput {
  return staticPageIndexability(true);
}

/** Indexable money / hub pages using tier floors (not padded maxima). */
export function moneyPageIndexability(
  tier: PageTier = "city-service",
): PageIndexabilityInput {
  const floor = indexabilityFloor(tier);
  return {
    ...staticPageIndexability(true),
    localDataVerified: true,
    wordCount: floor,
    minimumRequiredWordCount: floor,
  };
}

export function serviceIndexability(): PageIndexabilityInput {
  const floor = indexabilityFloor("service-hub");
  return {
    ...staticPageIndexability(true),
    wordCount: floor,
    minimumRequiredWordCount: floor,
  };
}
