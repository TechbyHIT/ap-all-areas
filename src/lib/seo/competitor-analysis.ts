/**
 * §75 Competitor analysis checklist — find opportunities; never copy.
 */

export type CompetitorLens =
  | "service-architecture"
  | "location-coverage"
  | "content-depth"
  | "internal-links"
  | "serp-intent"
  | "structured-data"
  | "ux"
  | "conversion-paths"
  | "content-gaps";

export type CompetitorNote = {
  lens: CompetitorLens;
  observation: string;
  ourOpportunity: string;
  doNotCopy: true;
};

export const COMPETITOR_LENSES: CompetitorLens[] = [
  "service-architecture",
  "location-coverage",
  "content-depth",
  "internal-links",
  "serp-intent",
  "structured-data",
  "ux",
  "conversion-paths",
  "content-gaps",
];

export function competitorOpportunityTemplate(
  lens: CompetitorLens,
  observation: string,
  ourOpportunity: string,
): CompetitorNote {
  return {
    lens,
    observation,
    ourOpportunity,
    doNotCopy: true,
  };
}
