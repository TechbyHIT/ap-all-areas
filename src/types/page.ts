export type PageIndexabilityInput = {
  publicationStatus: string;
  allowIndexing: boolean;
  qualityScore: number;
  contentReviewed: boolean;
  localDataVerified: boolean;
  hasUniqueMetadata: boolean;
  hasUniqueContent: boolean;
  hasValidCanonical: boolean;
  hasInternalLinks: boolean;
  hasValidSchema: boolean;
  wordCount: number;
  minimumRequiredWordCount: number;
  similarityScore: number;
};

export type PageType =
  | "home"
  | "service"
  | "location"
  | "area"
  | "service-location"
  | "service-area"
  | "solution"
  | "property-type"
  | "guide"
  | "blog"
  | "static";

/**
 * Editorial lifecycle (§54).
 * Use `resolveIndexabilityState()` for the full machine including `indexable`.
 */
export type PublicationStatus =
  | "draft"
  | "review"
  | "published"
  | "noindex"
  | "archived";
