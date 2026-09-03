/**
 * Keyword Ownership Database (build-time, static catalog).
 *
 * Maps each keyword cluster × known geo to exactly one canonical owner URL.
 * Reuses KEYWORD_INTENTS + HIGH_PRIORITY_CITY_AREAS + consolidate rules.
 * Does not invent keywords, cities, or claims.
 */

import { BUSINESS_CONFIG } from "@/config/business";
import { STATE_NAME, STATE_SLUG } from "@/config/geo";
import { ROUTES } from "@/config/routes";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { INITIAL_SERVICES } from "@/data/initial-services";
import {
  KEYWORD_INTENTS,
  type KeywordIntent,
} from "@/data/keyword-intents";
import { matchKeywordCityConsolidatePath } from "@/lib/routing/pretty-money-urls";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { pathKeywordInGeo } from "@/lib/seo/url-matrix";
import type {
  KeywordClusterId,
  KeywordOwnershipRecord,
  KeywordOwnershipStatus,
} from "@/types/keyword-ownership";

const BIRD_SLUG_RE =
  /pigeon|bird-spike|bird-net|bird-protection|anti-bird|anti-pigeon|bird-dropping|pigeon-control|pigeon-netting|pigeon-proof/;

const CHILD_PET_SLUG_RE =
  /child|kids|pet-|pets|fall-protection|balcony-child|pet-balcony/;

const PROPERTY_BY_SLUG: Record<string, string> = {
  apartment: "apartments",
  villa: "villas",
  flat: "apartments",
  building: "buildings",
  school: "schools",
  academy: "sports-academies",
};

const PROBLEM_BY_SLUG: Record<string, string> = {
  "balcony-child-safety": "child-balcony-safety",
  "safety-nets-for-kids": "child-balcony-safety",
  "children-safety-nets": "child-balcony-safety",
  "child-safety-nets": "child-balcony-safety",
  "child-safety-invisible-grills": "child-balcony-safety",
  "pet-balcony-safety": "pet-balcony-safety",
  "pet-safety-nets": "pet-balcony-safety",
  "safety-nets-for-pets": "pet-balcony-safety",
  "pet-safe-invisible-grills": "pet-balcony-safety",
  "pigeon-control": "pigeon-infestation",
  "pigeon-netting": "pigeon-infestation",
  "pigeon-proofing": "pigeon-infestation",
  "stop-pigeons-on-balcony": "pigeon-infestation",
  "bird-droppings-balcony": "pigeon-infestation",
  "pigeon-safety-nets": "pigeon-infestation",
  "cricket-practice-nets": "cricket-practice-space",
  "box-cricket-nets": "box-cricket-space",
  "school-sports-nets": "school-playground-enclosure",
};

const CUSTOMER_BY_PROPERTY: Record<string, string> = {
  apartments: "apartment-residents",
  villas: "homeowners",
  buildings: "property-managers",
  schools: "schools",
  "sports-academies": "sports-academies",
};

export function resolveKeywordCluster(
  keyword: KeywordIntent,
): KeywordClusterId {
  if (BIRD_SLUG_RE.test(keyword.slug)) return "bird-control";
  if (
    CHILD_PET_SLUG_RE.test(keyword.slug) &&
    (keyword.serviceSlug === "safety-nets" ||
      keyword.serviceSlug === "invisible-grills")
  ) {
    return "child-pet-safety";
  }
  return keyword.serviceSlug as KeywordClusterId;
}

function inferProperty(slug: string): string | null {
  for (const [needle, property] of Object.entries(PROPERTY_BY_SLUG)) {
    if (slug.includes(needle)) return property;
  }
  return null;
}

function secondaryKeywordsForService(serviceSlug: string): string[] {
  const service = INITIAL_SERVICES.find((s) => s.slug === serviceSlug);
  if (!service) return [];
  return [...service.primaryKeywords, ...service.secondaryKeywords].slice(0, 8);
}

function ownershipStatus(
  priority: 0 | 1 | 2,
  targetURL: string,
  canonicalURL: string,
): KeywordOwnershipStatus {
  if (targetURL !== canonicalURL) return "redirect-to-owner";
  if (priority >= 2) return "deferred";
  if (priority === 1) return "supporting";
  return "owner";
}

function baseFields(keyword: KeywordIntent): Pick<
  KeywordOwnershipRecord,
  | "keyword"
  | "keywordCluster"
  | "primaryKeyword"
  | "secondaryKeywords"
  | "searchIntent"
  | "entity"
  | "service"
  | "serviceFamily"
  | "problem"
  | "customerType"
  | "state"
  | "property"
  | "priority"
> {
  const cluster = resolveKeywordCluster(keyword);
  const property = inferProperty(keyword.slug);
  return {
    keyword: keyword.slug,
    keywordCluster: cluster,
    primaryKeyword: keyword.phrase,
    secondaryKeywords: secondaryKeywordsForService(keyword.serviceSlug),
    searchIntent: keyword.intent,
    entity: BUSINESS_CONFIG.name,
    service: keyword.serviceSlug,
    serviceFamily: cluster,
    problem: PROBLEM_BY_SLUG[keyword.slug] ?? null,
    customerType: property ? (CUSTOMER_BY_PROPERTY[property] ?? null) : null,
    state: STATE_NAME,
    property,
    priority: keyword.priority,
  };
}

/** Hub ownership: keyword cluster → service pillar (no geo). */
export function buildKeywordHubOwnershipRows(): KeywordOwnershipRecord[] {
  const seen = new Set<string>();
  const out: KeywordOwnershipRecord[] = [];

  for (const keyword of KEYWORD_INTENTS) {
    const cluster = resolveKeywordCluster(keyword);
    // One hub row per cluster using the highest-priority keyword in that cluster
    // as the label; owner URL is always the service hub.
    if (seen.has(cluster)) continue;
    // Prefer priority-0 phrase for the cluster label
    const lead =
      KEYWORD_INTENTS.find(
        (k) =>
          resolveKeywordCluster(k) === cluster &&
          k.priority === 0 &&
          k.serviceSlug === keyword.serviceSlug,
      ) ?? keyword;

    const targetURL = ROUTES.service(lead.serviceSlug);
    out.push({
      ...baseFields(lead),
      city: null,
      locality: null,
      targetURL,
      canonicalURL: targetURL,
      pageType: "service-hub",
      status: "owner",
    });
    seen.add(cluster);
  }

  return out;
}

/**
 * Geo ownership for curated cities only (no invented localities).
 * City-level keyword URLs that consolidate to silo city×service get
 * status `redirect-to-owner` with that silo path as canonicalURL.
 */
export function buildKeywordCityOwnershipRows(
  priorityMax: 0 | 1 | 2 = 2,
): KeywordOwnershipRecord[] {
  const out: KeywordOwnershipRecord[] = [];

  for (const city of HIGH_PRIORITY_CITY_AREAS) {
    for (const keyword of KEYWORD_INTENTS) {
      if (keyword.priority > priorityMax) continue;

      const targetURL = pathKeywordInGeo(keyword.slug, city.citySlug);
      const consolidated = matchKeywordCityConsolidatePath(targetURL);
      const canonicalURL = consolidated ?? targetURL;

      out.push({
        ...baseFields(keyword),
        city: city.citySlug,
        locality: null,
        targetURL,
        canonicalURL,
        pageType: consolidated ? "city-service" : "keyword-city",
        status: ownershipStatus(keyword.priority, targetURL, canonicalURL),
      });
    }
  }

  return out;
}

/** Full ownership catalog: hubs + keyword × curated cities. */
export function buildKeywordOwnershipDatabase(
  priorityMax: 0 | 1 | 2 = 2,
): KeywordOwnershipRecord[] {
  return [
    ...buildKeywordHubOwnershipRows(),
    ...buildKeywordCityOwnershipRows(priorityMax),
  ];
}

/** Absolute HTTPS canonical for a record. */
export function ownershipAbsoluteCanonical(
  record: KeywordOwnershipRecord,
): string {
  return buildCanonicalUrl(record.canonicalURL);
}

/**
 * Resolve the single owner path for a keyword × optional city.
 * Prefer silo consolidate when it applies.
 */
export function getKeywordOwnerPath(
  keywordSlug: string,
  citySlug?: string,
): string | null {
  const keyword = KEYWORD_INTENTS.find((k) => k.slug === keywordSlug);
  if (!keyword) return null;

  if (!citySlug) {
    return ROUTES.service(keyword.serviceSlug);
  }

  const target = pathKeywordInGeo(keywordSlug, citySlug);
  return matchKeywordCityConsolidatePath(target) ?? target;
}

/** Distinct owner URLs that should appear in sitemaps / internal links. */
export function listPrimaryOwnerPaths(
  records: KeywordOwnershipRecord[] = buildKeywordOwnershipDatabase(0),
): string[] {
  const owners = new Set<string>();
  for (const row of records) {
    if (row.status === "owner" || row.status === "supporting") {
      owners.add(row.canonicalURL);
    }
    if (row.status === "redirect-to-owner") {
      owners.add(row.canonicalURL);
    }
  }
  return [...owners].sort();
}

export function summarizeKeywordOwnership(
  records: KeywordOwnershipRecord[] = buildKeywordOwnershipDatabase(),
): {
  total: number;
  byStatus: Record<string, number>;
  byCluster: Record<string, number>;
  uniqueOwners: number;
} {
  const byStatus: Record<string, number> = {};
  const byCluster: Record<string, number> = {};
  const owners = new Set<string>();

  for (const row of records) {
    byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
    byCluster[row.keywordCluster] = (byCluster[row.keywordCluster] ?? 0) + 1;
    owners.add(row.canonicalURL);
  }

  return {
    total: records.length,
    byStatus,
    byCluster,
    uniqueOwners: owners.size,
  };
}

export { STATE_SLUG };
