/**
 * §89–91 Location / property quality gates + privacy rules.
 */

import { STATE_SLUG } from "@/config/geo";
import { getArea, getCity } from "@/lib/data/location-catalog";
import { shouldGeneratePage } from "@/lib/seo/page-decision";
import { scorePageQuality, PAGE_QUALITY_PUBLISH } from "@/lib/seo/page-quality";

export type GateResult = {
  publish: boolean;
  index: boolean;
  reasons: string[];
};

export function locationQualityGate(input: {
  citySlug: string;
  areaSlug?: string;
  serviceSlug?: string;
  hasUniqueLocalFacts?: boolean;
  hasRealPhotos?: boolean;
  searchIntentValid?: boolean;
}): GateResult {
  const reasons: string[] = [];
  const city = getCity(STATE_SLUG, input.citySlug);
  if (!city) {
    return { publish: false, index: false, reasons: ["invalid-locality-or-city"] };
  }

  if (input.areaSlug) {
    const area = getArea(STATE_SLUG, input.citySlug, input.areaSlug);
    if (!area) {
      return { publish: false, index: false, reasons: ["invalid-locality"] };
    }
  }

  const kind = input.serviceSlug
    ? input.areaSlug
      ? "area-service"
      : "city-service"
    : input.areaSlug
      ? "area"
      : "city";

  const decision = shouldGeneratePage({
    kind,
    citySlug: input.citySlug,
    areaSlug: input.areaSlug,
    serviceSlug: input.serviceSlug,
  });

  if (!decision.generate) {
    reasons.push(decision.reason);
    return { publish: false, index: false, reasons };
  }

  if (input.searchIntentValid === false) {
    reasons.push("search-intent-invalid");
    return { publish: false, index: false, reasons };
  }

  const quality = scorePageQuality({
    hasUniqueLocalFacts: input.hasUniqueLocalFacts ?? Boolean(city),
    hasRealPhotos: input.hasRealPhotos ?? false,
    hasTrustContact: true,
    hasInternalLinks: true,
    searchIntentClarity: 12,
    serviceSpecificity: input.serviceSlug ? 12 : 8,
    usefulInformation: input.hasUniqueLocalFacts ? 12 : 8,
    localUniqueness: input.hasUniqueLocalFacts ? 12 : 6,
  });

  if (quality.total < PAGE_QUALITY_PUBLISH) {
    reasons.push(`quality-below-publish:${quality.total}`);
    return { publish: true, index: false, reasons };
  }

  return {
    publish: true,
    index: decision.index,
    reasons: ["location-quality-passed"],
  };
}

export function propertyQualityGate(input: {
  propertyExists: boolean;
  propertyNameAccurate: boolean;
  businessRelevance: boolean;
  serviceRelevant: boolean;
  usefulInformation: boolean;
  privacySafe: boolean;
  noFabricatedProjects: boolean;
}): GateResult {
  const reasons: string[] = [];
  const checks: Array<[boolean, string]> = [
    [input.propertyExists, "property-does-not-exist"],
    [input.propertyNameAccurate, "property-name-inaccurate"],
    [input.businessRelevance, "no-legitimate-business-relevance"],
    [input.serviceRelevant, "service-not-relevant"],
    [input.usefulInformation, "insufficient-useful-information"],
    [input.privacySafe, "privacy-risk"],
    [input.noFabricatedProjects, "fabricated-project-claims"],
  ];

  for (const [ok, code] of checks) {
    if (!ok) reasons.push(code);
  }

  if (reasons.length > 0) {
    return { publish: false, index: false, reasons };
  }

  return { publish: true, index: true, reasons: ["property-quality-passed"] };
}

/** §91 Privacy — patterns that must not be published. */
export const PRIVACY_BLOCKLIST_PATTERNS = [
  /\bflat\s*no\.?\s*\d+/i,
  /\bunit\s*#?\s*\d+/i,
  /\bapartment\s*no\.?\s*\d+/i,
  /\b\d{10}\b/, // bare personal mobiles in body copy
  /\bgate\s*code\b/i,
  /\baccess\s*code\b/i,
  /\bpassword\b/i,
];

export function findPrivacyRisks(text: string): string[] {
  const hits: string[] = [];
  for (const pattern of PRIVACY_BLOCKLIST_PATTERNS) {
    if (pattern.test(text)) {
      hits.push(pattern.source);
    }
  }
  return hits;
}

export function isPrivacySafePublicCopy(text: string): boolean {
  return findPrivacyRisks(text).length === 0;
}
