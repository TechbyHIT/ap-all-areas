/**
 * §36 cannibalization checks — before publishing a new money/hub URL.
 */

import { SERVICE_SLUG_REDIRECTS } from "@/config/geo";
import { getKeywordOwnerPath } from "@/lib/seo/keyword-ownership";
import { matchKeywordCityConsolidatePath } from "@/lib/routing/pretty-money-urls";

export type CannibalizationAction =
  | "ok"
  | "merge"
  | "redirect"
  | "canonicalize"
  | "change-intent"
  | "noindex"
  | "delete";

export type CannibalizationFinding = {
  risk: "none" | "low" | "high";
  action: CannibalizationAction;
  reason: string;
  ownerPath?: string;
};

export type CannibalizationInput = {
  candidatePath: string;
  kind:
    | "service"
    | "city"
    | "area"
    | "city-service"
    | "area-service"
    | "keyword-city"
    | "comparison"
    | "guide"
    | "project";
  serviceSlug?: string;
  citySlug?: string;
  keywordSlug?: string;
  primaryIntent?: string;
};

/**
 * Detect obvious ownership conflicts using existing consolidate rules.
 * Does not invent overlap scores from scraped SERPs.
 */
export function checkCannibalization(
  input: CannibalizationInput,
): CannibalizationFinding {
  const path = input.candidatePath.endsWith("/")
    ? input.candidatePath
    : `${input.candidatePath}/`;

  if (input.kind === "keyword-city" && input.keywordSlug && input.citySlug) {
    const owner =
      getKeywordOwnerPath(input.keywordSlug, input.citySlug) ??
      matchKeywordCityConsolidatePath(path);
    if (owner && owner !== path) {
      return {
        risk: "high",
        action: "canonicalize",
        reason:
          "keyword-city intent is owned by silo city×service — do not index a competing landing",
        ownerPath: owner,
      };
    }
  }

  if (
    (input.kind === "city-service" || input.kind === "area-service") &&
    input.serviceSlug
  ) {
    // Alias slugs (pigeon-nets, anti-pigeon-nets) share intent with a real
    // sub-service page, so they consolidate. Genuine sub-services do not:
    // they describe a different opening and specification from the parent.
    const canonical = SERVICE_SLUG_REDIRECTS[input.serviceSlug];
    if (canonical) {
      return {
        risk: "high",
        action: "redirect",
        reason: "alias service slug consolidates to its canonical variation",
        ownerPath: path.replace(`/${input.serviceSlug}/`, `/${canonical}/`),
      };
    }
  }

  if (input.kind === "comparison") {
    return {
      risk: "none",
      action: "ok",
      reason: "comparison intent is distinct from single-service hubs",
    };
  }

  return {
    risk: "none",
    action: "ok",
    reason: "no automatic cannibalization rule matched",
  };
}
