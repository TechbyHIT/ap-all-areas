/**
 * Keyword ownership — one primary owner URL per keyword × geo (or hub).
 * Derived from KEYWORD_INTENTS + real geos; never invents phrases or places.
 */

export type KeywordClusterId =
  | "safety-nets"
  | "invisible-grills"
  | "sports-nets"
  | "cloth-drying-hangers"
  | "bird-control"
  | "child-pet-safety";

export type KeywordOwnershipPageType =
  | "service-hub"
  | "city-service"
  | "keyword-city"
  | "keyword-locality"
  | "solution"
  | "property-type-service";

/**
 * owner — this targetURL is the canonical discovery URL
 * redirect-to-owner — pretty/target exists but consolidates to another canonical
 * supporting — live URL, lower priority / secondary intent
 * deferred — keep in catalog, do not push for index yet
 */
export type KeywordOwnershipStatus =
  | "owner"
  | "redirect-to-owner"
  | "supporting"
  | "deferred";

export type KeywordOwnershipRecord = {
  keyword: string;
  keywordCluster: KeywordClusterId;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  entity: string;
  service: string;
  serviceFamily: KeywordClusterId;
  problem: string | null;
  customerType: string | null;
  state: string;
  city: string | null;
  locality: string | null;
  property: string | null;
  /** Public path users/Google may request */
  targetURL: string;
  /** Single owner canonical path (may equal targetURL) */
  canonicalURL: string;
  pageType: KeywordOwnershipPageType;
  priority: 0 | 1 | 2;
  status: KeywordOwnershipStatus;
};
