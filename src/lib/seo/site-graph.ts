/**
 * §125–127 Site graph + final publish principles.
 */

export const SITE_GRAPH = {
  root: "BUSINESS",
  branches: {
    SERVICES: ["SERVICE_FAMILY", "SERVICE", "PROJECTS"],
    AREAS: ["STATES", "CITIES", "LOCALITIES", "PROPERTIES", "PROJECTS"],
    GUIDES: ["TOPICS", "QUESTIONS", "COMMERCIAL_PAGES"],
  },
  evidence: "REAL_EVIDENCE",
  conversion: "CONVERSION",
} as const;

/** §126 — entity journey, not keyword→page spam. */
export const SEO_JOURNEY = [
  "ENTITY",
  "INTENT",
  "INFORMATION",
  "LOCATION",
  "EVIDENCE",
  "INTERNAL_LINK",
  "CONVERSION",
] as const;

/** User journey from Google (§130). */
export const USER_JOURNEY = [
  "Question",
  "Answer",
  "Service",
  "Location",
  "Evidence",
  "Contact",
] as const;

export type PublishJustification = {
  whyExists: string;
  whoFor: string;
  questionAnswered: string;
  uniqueInformation: string;
  entityRepresented: string;
  nextPage: string;
  businessRelevant: boolean;
};

/** §127 — if unanswered, do not publish. */
export function canPublishByContentPrinciple(
  j: Partial<PublishJustification>,
): { ok: boolean; missing: string[] } {
  const required: Array<keyof PublishJustification> = [
    "whyExists",
    "whoFor",
    "questionAnswered",
    "uniqueInformation",
    "entityRepresented",
    "nextPage",
  ];
  const missing: string[] = [];
  for (const key of required) {
    const value = j[key];
    if (typeof value !== "string" || value.trim().length < 8) {
      missing.push(key);
    }
  }
  if (j.businessRelevant !== true) missing.push("businessRelevant");
  return { ok: missing.length === 0, missing };
}
