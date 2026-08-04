/**
 * Programmatic SEO scale blueprint — target ≥ 9 lakh (900,000) addressable URLs.
 *
 * Principle:
 * - Capacity can be millions of intent combinations.
 * - Indexable publish is quality-gated (unique facts, links, FAQ, photo CTA).
 * - Do not ship thin doorway pages that only swap city names.
 */

import { KEYWORD_INTENTS } from "@/data/keyword-intents";
import { countScaleLocalities } from "@/data/ap-locality-expansion";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import {
  ALL_SUB_SERVICES,
  INITIAL_SERVICES,
} from "@/data/initial-services";

export const SCALE_TARGET_URLS = 900_000; // 9 lakh

export type ScaleLayer = {
  id: string;
  label: string;
  formula: string;
  count: number;
  indexDefault: boolean;
  notes: string;
};

export type ScaleReport = {
  target: number;
  addressableTotal: number;
  meetsNineLakh: boolean;
  layers: ScaleLayer[];
  publishTiers: {
    p0IndexNow: number;
    p1DraftExpand: number;
    p2CapacityOnly: number;
  };
};

export function buildScaleReport(): ScaleReport {
  const cities = HIGH_PRIORITY_CITY_AREAS.length;
  const curatedAreas = HIGH_PRIORITY_CITY_AREAS.reduce(
    (n, c) => n + c.areas.length,
    0,
  );
  const scaleLocalities = countScaleLocalities();
  const services = INITIAL_SERVICES.length;
  const subServices = ALL_SUB_SERVICES.length;
  const keywords = KEYWORD_INTENTS.length;

  const cityService = cities * services;
  const areaHubCurated = curatedAreas;
  const areaServiceCurated = curatedAreas * services;
  const areaSubCurated = curatedAreas * subServices;
  const keywordInCity = keywords * cities;
  const keywordInLocality = keywords * scaleLocalities;
  const localityService = scaleLocalities * services;
  const localitySub = scaleLocalities * subServices;
  const citySub = cities * subServices;

  // Intent depth: each locality×keyword is a money candidate URL
  // Plus classic area×service and area×sub graphs
  const layers: ScaleLayer[] = [
    {
      id: "city-service",
      label: "City × core service",
      formula: `${cities} × ${services}`,
      count: cityService,
      indexDefault: true,
      notes: "P0 money hubs — index when unique climate copy exists",
    },
    {
      id: "city-sub",
      label: "City × sub-service keyword",
      formula: `${cities} × ${subServices}`,
      count: citySub,
      indexDefault: true,
      notes: "Pretty /{keyword}-in-{city}/ aliases",
    },
    {
      id: "area-hub-curated",
      label: "Curated area hubs",
      formula: `${curatedAreas}`,
      count: areaHubCurated,
      indexDefault: true,
      notes: "Hand-listed Vizag/Vijayawada/… areas",
    },
    {
      id: "area-service-curated",
      label: "Curated area × core service",
      formula: `${curatedAreas} × ${services}`,
      count: areaServiceCurated,
      indexDefault: true,
      notes: "/{city}/{area}/{service}/ — primary money grid",
    },
    {
      id: "area-sub-curated",
      label: "Curated area × sub-service",
      formula: `${curatedAreas} × ${subServices}`,
      count: areaSubCurated,
      indexDefault: false,
      notes: "Draft until unique FAQ/photo notes exist",
    },
    {
      id: "scale-localities",
      label: "Scale locality graph (AP expansion)",
      formula: `district places × locality labels (+ curated)`,
      count: scaleLocalities,
      indexDefault: false,
      notes: "Capacity layer — publish progressively",
    },
    {
      id: "locality-service",
      label: "Scale locality × core service",
      formula: `${scaleLocalities} × ${services}`,
      count: localityService,
      indexDefault: false,
      notes: "Long-tail money capacity",
    },
    {
      id: "locality-sub",
      label: "Scale locality × sub-service",
      formula: `${scaleLocalities} × ${subServices}`,
      count: localitySub,
      indexDefault: false,
      notes: "Deep long-tail — quality gate required",
    },
    {
      id: "keyword-in-city",
      label: "Keyword intent × city",
      formula: `${keywords} × ${cities}`,
      count: keywordInCity,
      indexDefault: true,
      notes: "/{keyword}-in-{city}/",
    },
    {
      id: "keyword-in-locality",
      label: "Keyword intent × locality (9L engine)",
      formula: `${keywords} × ${scaleLocalities}`,
      count: keywordInLocality,
      indexDefault: false,
      notes: "/{keyword}-in-{locality}/ — main scale vector",
    },
  ];

  // Addressable = unique URL families (not double-count overlapping)
  // Primary scale vector is keyword × locality; add curated area×service not already covered
  const addressableTotal =
    keywordInLocality + areaServiceCurated + cityService + keywordInCity;

  const p0IndexNow =
    cityService + areaServiceCurated + keywordInCity + Math.min(curatedAreas, 200);
  const p1DraftExpand = Math.min(
    50_000,
    areaSubCurated + keywords * curatedAreas,
  );
  const p2CapacityOnly = Math.max(0, addressableTotal - p0IndexNow - p1DraftExpand);

  return {
    target: SCALE_TARGET_URLS,
    addressableTotal,
    meetsNineLakh: addressableTotal >= SCALE_TARGET_URLS,
    layers,
    publishTiers: {
      p0IndexNow,
      p1DraftExpand,
      p2CapacityOnly,
    },
  };
}

/** Sitemap / ISR: index curated area×service for ALL high-priority cities (not only Vizag/Vijayawada). */
export const SITEMAP_ALL_CURATED_AREA_SERVICES = true;

/** Max keyword×locality URLs to emit into sitemap chunk per run (crawl budget). */
export const SITEMAP_KEYWORD_LOCALITY_CHUNK = 5000;
