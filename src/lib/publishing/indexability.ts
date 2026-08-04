import type { PageIndexabilityInput } from "@/types/page";

export function isPageIndexable(page: PageIndexabilityInput): boolean {
  return (
    page.publicationStatus === "published" &&
    page.allowIndexing &&
    page.qualityScore >= 80 &&
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
  const indexable = isPageIndexable(page);
  return { index: indexable, follow: true };
}
