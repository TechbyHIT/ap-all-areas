/**
 * §76–77 SERP intent validation + zero-click answer structure.
 */

export type SerpDominantIntent =
  | "service"
  | "local-commercial"
  | "guide"
  | "comparison"
  | "mixed"
  | "unknown";

export type PageTypeForIntent =
  | "service"
  | "city-service"
  | "locality-service"
  | "guide"
  | "comparison"
  | "solution";

export function pageTypeForSerpIntent(
  intent: SerpDominantIntent,
): PageTypeForIntent | null {
  switch (intent) {
    case "service":
      return "service";
    case "local-commercial":
      return "city-service";
    case "guide":
      return "guide";
    case "comparison":
      return "comparison";
    default:
      return null;
  }
}

export function intentMatchesPageType(
  intent: SerpDominantIntent,
  pageType: PageTypeForIntent,
): boolean {
  const expected = pageTypeForSerpIntent(intent);
  if (!expected) return true; // unknown/mixed → human decision
  if (expected === "city-service") {
    return pageType === "city-service" || pageType === "locality-service";
  }
  return expected === pageType;
}

/** §77 Concise answer block kinds — write naturally, not for snippet farming. */
export type ZeroClickBlockKind =
  | "definition"
  | "short-answer"
  | "comparison"
  | "list"
  | "process"
  | "faq"
  | "pricing-factors";

export type ZeroClickBlock = {
  kind: ZeroClickBlockKind;
  heading: string;
  conciseAnswer: string;
};

export function buildZeroClickOutline(
  blocks: ZeroClickBlock[],
): Array<{ h2: string; lead: string }> {
  return blocks.map((b) => ({
    h2: b.heading,
    lead: b.conciseAnswer,
  }));
}
