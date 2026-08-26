import type { PageIndexabilityInput } from "@/types/page";
import { SEO_PUBLISH_MIN_SCORE } from "@/lib/seo/seo-score";

export function isPageIndexable(page: PageIndexabilityInput): boolean {
  return (
    page.publicationStatus === "published" &&
    page.allowIndexing &&
    page.qualityScore >= SEO_PUBLISH_MIN_SCORE &&
    page.contentReviewed &&
    page.localDataVerified &&
    page.hasUniqueMetadata &&
    page.hasUniqueContent &&
    page.hasValidCanonical &&
    page.hasInternalLinks &&
    page.hasValidSchema &&
    page.wordCount >= page.minimumRequiredWordCount &&
    page.similarityScore <= 0.7
  );
}

export function getRobotsDirective(page: PageIndexabilityInput): {
  index: boolean;
  follow: boolean;
} {
  const index =
    page.publicationStatus === "published" && page.allowIndexing;
  return { index, follow: true };
}
