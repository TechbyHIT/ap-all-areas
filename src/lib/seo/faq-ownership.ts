/**
 * §26 FAQ ownership — one FAQ set per page type to avoid identical blocks.
 */

export type FaqOwner =
  | "service-hub"
  | "service-family"
  | "city-hub"
  | "city-service"
  | "area-service"
  | "problem"
  | "comparison"
  | "pricing-guide"
  | "keyword-geo";

/**
 * Which FAQ source is allowed to render on a page.
 * Keyword landings should prefer short intent FAQs, not full service FAQ dumps.
 */
export const FAQ_OWNERSHIP: Record<FaqOwner, string> = {
  "service-hub": "SERVICE_FAQS[serviceSlug]",
  "service-family": "inline family decision FAQs only (optional)",
  "city-hub": "buildLocationPageContent FAQs",
  "city-service": "getCityServiceFaqs / encyclopedia FAQs",
  "area-service": "getAreaServiceFaqs",
  problem: "problem.customerQuestions → buildProblemFaqs",
  comparison: "decisionHelp list (not a pasted service FAQ)",
  "pricing-guide": "PRICING_GUIDE_CONTENT.faqs",
  "keyword-geo": "buildKeywordGeoContent FAQs (intent-specific)",
};

export function faqOwnerForPage(kind: FaqOwner): string {
  return FAQ_OWNERSHIP[kind];
}
