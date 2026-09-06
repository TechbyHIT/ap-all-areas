/**
 * City and area copy composed from the per-service angle model.
 *
 * The differentiator is the service, not the place name. Two localities in one
 * city share climate and corridor context, but "duct area pigeon nets" and
 * "children safety nets" describe different openings, different checks and
 * different honest limits — so the pages read differently even where the
 * locality detail we can verify is thin.
 */

import { getAreaLocalFact } from "@/data/area-local-facts";
import { deriveAreaContext, type AreaPosition } from "@/data/area-context";
import { getCityLocalProfile } from "@/data/city-local-profiles";
import { getServiceEncyclopedia } from "@/data/service-encyclopedia";
import type {
  AreaServiceContent,
  CityServiceContent,
} from "@/data/location-page-content";
import {
  getServiceVariant,
  listVariantsForParent,
  type ServiceVariant,
} from "@/data/service-variants";

function sentenceList(items: string[], limit = 4): string {
  const picked = items.slice(0, limit);
  if (picked.length === 0) return "";
  if (picked.length === 1) return picked[0];
  return `${picked.slice(0, -1).join(", ")} and ${picked[picked.length - 1]}`;
}

const COASTAL_CITIES = new Set(["visakhapatnam", "kakinada", "nellore"]);

/**
 * Salt note or heat-and-dust note. At city level this follows the city. At
 * area level the locality wins, because an inland pocket of a coastal city
 * should not be told its balcony faces the sea.
 */
function climateNote(
  variant: ServiceVariant,
  citySlug?: string,
  areaPosition?: AreaPosition,
): string {
  if (areaPosition) {
    return areaPosition === "sea-facing"
      ? variant.coastalNote
      : variant.inlandNote;
  }
  return citySlug && COASTAL_CITIES.has(citySlug)
    ? variant.coastalNote
    : variant.inlandNote;
}

function siblingSentence(variant: ServiceVariant): string {
  const siblings = listVariantsForParent(variant.parentSlug).filter(
    (s) => s.slug !== variant.slug,
  );
  if (siblings.length === 0) return "";
  return ` If your opening is closer to ${sentenceList(
    siblings.map((s) => s.name.toLowerCase()),
    3,
  )}, that variation is a better starting point than this one.`;
}

/** City × variant copy. */
export function buildVariantCityServiceContent(input: {
  serviceSlug: string;
  cityName: string;
  citySlug?: string;
  district?: string;
  areas?: string[];
}): CityServiceContent | null {
  const variant = getServiceVariant(input.serviceSlug);
  if (!variant) return null;

  const { cityName, citySlug, district, areas } = input;
  const profile = citySlug ? getCityLocalProfile(citySlug) : null;
  const districtBit = district ? ` in ${district} district` : "";
  const climate = climateNote(variant, citySlug);

  const uniqueIntroduction = [
    `${variant.name} in ${cityName}${districtBit} is asked for by ${variant.audience}. What you are really buying is ${variant.solves}.`,
    `We fit it at ${sentenceList(variant.openings)}, and the specification turns on ${variant.specFocus}.`,
    profile ? profile.climateLead : "",
    climate,
    `One thing this does not fix: ${variant.notSolved}${siblingSentence(variant)}`,
  ]
    .filter(Boolean)
    .join(" ");

  const corridors = profile
    ? ` Enquiries cluster around ${sentenceList(profile.residentialCorridors, 3)}.`
    : "";
  const societies = profile
    ? ` Communities people name when they call include ${sentenceList(profile.societyExamples, 4)}.`
    : "";

  return {
    uniqueIntroduction,
    localRequirements: `Before quoting ${variant.name.toLowerCase()} in ${cityName}, we confirm ${sentenceList(
      variant.siteChecks,
      5,
    )}. Sending those details with your photos is what turns a rough figure into a real one.`,
    suitablePropertyTypes: `In ${cityName} this variation suits ${variant.audience}. The openings it is planned for are ${sentenceList(
      variant.openings,
    )} — if your situation is different, say so early rather than after measurement.`,
    problemsSolved: `The problem it addresses is ${variant.solves}. People in ${cityName} usually describe it as wanting ${variant.searchIntent}. Being clear that ${variant.notSolved.toLowerCase()} keeps the quotation honest.`,
    materialsGuidance: `Material selection here centres on ${variant.specFocus}. ${climate} We explain the trade-off in plain terms rather than naming a grade and leaving you to look it up.`,
    installationOverview: `Installation in ${cityName} follows the same order every time: confirm the measured scope, prepare the fixing points identified at survey, fit and tension the ${variant.shortLabel.toLowerCase()}, then walk the opening with you before leaving. ${variant.maintenance.charAt(0).toUpperCase()}${variant.maintenance.slice(1)}`,
    weatherNotes: profile
      ? `${profile.weatherNotes} For ${variant.name.toLowerCase()} specifically, ${climate.charAt(0).toLowerCase()}${climate.slice(1)}`
      : `Across Andhra Pradesh, sun, seasonal rain and dust all shorten the life of poorly finished work. ${climate}`,
    areasServedIntro: areas && areas.length > 0
      ? `Within ${cityName}, ${variant.name.toLowerCase()} enquiries come from areas such as ${sentenceList(areas, 6)}.${corridors}${societies} Area names help us plan the visit; the measured opening still decides the specification.`
      : `${variant.name} enquiries are welcome from across ${cityName}.${corridors}${societies} The measured opening decides the specification, not the locality name.`,
    pricingNote: `Cost for ${variant.name.toLowerCase()} in ${cityName} moves with ${sentenceList(
      variant.costDrivers,
      5,
    )}. Ask for the price unit and the included work in writing so two quotes can actually be compared. ${profile?.photoEstimateHint ?? "Send opening photos for a clearer first estimate."}`,
    buyingGuide: `Before you approve ${variant.name.toLowerCase()} in ${cityName}, get the measured size, the material specification, the fixing method and the warranty terms in writing. Ask what happens if the fixing surface turns out to be weaker than it looked. And check that the quote is for ${variant.solves} rather than a cheaper product renamed.`,
    localAuthorityNote: `${cityName} pages exist so residents can compare the right variation before enquiring. We serve ${cityName} as a service area and confirm each job after measurement — we do not claim a shop on every street.`,
    encyclopedia: getServiceEncyclopedia(variant.slug, cityName, variant.name),
  };
}

/** Area × variant copy. */
export function buildVariantAreaServiceContent(input: {
  serviceSlug: string;
  areaName: string;
  cityName: string;
  citySlug?: string;
  areaSlug?: string;
}): AreaServiceContent | null {
  const variant = getServiceVariant(input.serviceSlug);
  if (!variant) return null;

  const { areaName, cityName, citySlug, areaSlug } = input;
  const place = `${areaName}, ${cityName}`;
  const fact = citySlug && areaSlug ? getAreaLocalFact(citySlug, areaSlug) : null;
  const context = citySlug && areaSlug ? deriveAreaContext(citySlug, areaSlug) : null;
  const profile = citySlug ? getCityLocalProfile(citySlug) : null;
  const climate = climateNote(variant, citySlug, context?.position);

  const localLead = fact
    ? `${areaName} is characterised by ${fact.buildingStock} ${fact.accessNote}${
        fact.exposureHint ? ` ${fact.exposureHint}` : ""
      }`
    : context
      ? `${context.positionNote} ${context.accessNote}`
      : "";

  const uniqueIntroduction = [
    `${variant.name} in ${place} is planned around ${sentenceList(variant.openings, 3)} rather than an area-wide assumption.`,
    localLead,
    `For this variation the specification turns on ${variant.specFocus}, and ${climate.charAt(0).toLowerCase()}${climate.slice(1)}`,
    `Worth stating plainly: ${variant.notSolved}`,
  ]
    .filter(Boolean)
    .join(" ");

  const exposure = fact?.exposureHint ?? context?.exposureNote ?? "";

  return {
    uniqueIntroduction,
    serviceOverview: `In ${place}, ${variant.name.toLowerCase()} covers ${sentenceList(
      variant.openings,
    )}. It is chosen by ${variant.audience}, and what it delivers is ${variant.solves}.`,
    residentialApplications: fact
      ? `Briefs we hear from ${areaName} include ${sentenceList(fact.commonNeeds, 3)}. Against that, this variation is the right fit when the priority is ${variant.searchIntent}.`
      : `In ${areaName} this variation fits homes where the priority is ${variant.searchIntent}. ${context?.positionNote ?? ""}`,
    suitablePropertyTypes: `Suitable properties in ${areaName} are those with ${sentenceList(
      variant.openings,
      3,
    )}. ${
      fact
        ? `The local mix is ${fact.buildingStock}`
        : context
          ? context.accessNote
          : `Access and structure are still checked building by building.`
    }`,
    safetyRequirements: `The outcome depends on ${variant.specFocus}. We check ${sentenceList(
      variant.siteChecks,
      4,
    )} before committing to a scope. What this variation does not do is straightforward: ${variant.notSolved}`,
    materialGuidance: `Specification for ${variant.name.toLowerCase()} centres on ${variant.specFocus}. ${climate} ${exposure}`,
    measurementProcess: `Measurement in ${place} covers ${sentenceList(
      variant.siteChecks,
      6,
    )}. ${
      fact?.landmarks && fact.landmarks.length > 0
        ? `Useful landmarks for planning the visit include ${sentenceList(fact.landmarks, 3)}.`
        : (context?.accessNote ?? "")
    }`,
    installationSteps: `On the day, technicians prepare the fixing points agreed at survey, fit the ${variant.shortLabel.toLowerCase()} across ${sentenceList(
      variant.openings,
      2,
    )}, check tension and coverage, clear up, and walk the opening with you before leaving ${areaName}.`,
    maintenanceAdvice: `${variant.maintenance.charAt(0).toUpperCase()}${variant.maintenance.slice(1)} ${exposure}`,
    pricingNote: [
      `A quotation for ${variant.name.toLowerCase()} in ${place} is built from ${sentenceList(variant.costDrivers, 4)}.`,
      context?.position === "outlying-town"
        ? `Since ${areaName} is served as a trip out from ${cityName}, covering every opening in one visit keeps the total sensible.`
        : "",
      profile?.photoEstimateHint ?? "Send opening photos for a clearer first estimate.",
    ]
      .filter(Boolean)
      .join(" "),
    buyingGuide: `For ${variant.name.toLowerCase()} in ${areaName}, send the society or landmark name, one wide photo of the opening and one close photo of the fixing surface. Approve the measured size, the specification and the warranty terms before installation day. ${cityName} context helps, but your building's access decides the final plan.`,
    localAuthorityNote: `${areaName} pages help residents pick the right variation before enquiring. We cover ${areaName} from ${cityName} on a service-area basis and confirm every job after measurement.`,
    encyclopedia: getServiceEncyclopedia(variant.slug, place, variant.name),
  };
}

/** Variant-specific FAQs, blended with the locality where one is given. */
export function buildVariantFaqs(
  serviceSlug: string,
  place?: string,
): Array<{ question: string; answer: string }> {
  const variant = getServiceVariant(serviceSlug);
  if (!variant) return [];

  const scoped = place
    ? [
        {
          question: `Do you install ${variant.name.toLowerCase()} in ${place}?`,
          answer: `Yes, ${place} is inside our service area. We are a service-area business rather than a shop on that street, so the visit is scheduled after we see photos and confirm access. ${variant.notSolved.startsWith("a ") ? "" : ""}Send the opening dimensions if you already have them.`,
        },
        {
          question: `What decides the price of ${variant.name.toLowerCase()} in ${place}?`,
          answer: `Mainly ${sentenceList(variant.costDrivers, 4)}. Ask any installer for the price unit and the included work in writing — that is the only way two quotes compare fairly.`,
        },
      ]
    : [];

  return [...variant.faqSeeds, ...scoped];
}
