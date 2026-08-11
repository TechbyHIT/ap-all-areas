/**
 * Intent-aware SEO copy for keyword × geo landings.
 * Uses city/area profiles + genuine product guidance — no fake ratings or stats.
 */

import { BUSINESS_CONFIG } from "@/config/business";
import { getAreaLocalFact } from "@/data/area-local-facts";
import { getCityLocalProfile } from "@/data/city-local-profiles";
import type { KeywordIntent } from "@/data/keyword-intents";
import { getServiceEncyclopedia } from "@/data/service-encyclopedia";

export type KeywordGeoContent = {
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  decisionPoints: string[];
  processSteps: string[];
  photoChecklist: string[];
  faqs: Array<{ question: string; answer: string }>;
};

type GeoInput = {
  kind: "city" | "area" | "scale";
  name: string;
  citySlug: string;
  cityName: string;
  areaSlug?: string;
};

function phraseLower(keyword: KeywordIntent): string {
  return keyword.phrase.toLowerCase();
}

function intentLead(keyword: KeywordIntent, geo: GeoInput): string {
  const p = phraseLower(keyword);
  switch (keyword.intent) {
    case "price":
      return `People searching ${p} in ${geo.name} usually want a measured range—not a single citywide teaser rate. Opening size, material grade, corners, access and how many openings you package change the final number.`;
    case "near-me":
      return `“${keyword.phrase} near me” in ${geo.name} means you want a reachable installer who can visit, measure and finish the job without vague statewide promises. ${BUSINESS_CONFIG.name} plans visits from your landmark, society name and opening photos.`;
    case "comparison":
      return `Comparison searches for ${p} in ${geo.name} are about matching the opening problem—clear view, bird coverage, budget or fall-risk spacing—not picking a brand slogan.`;
    case "problem":
      return `Problem-led searches for ${p} in ${geo.name} start with the daily risk: children near railings, pets on balconies, pigeons on ledges, or droppings in utility spaces. Product choice follows that problem.`;
    case "transactional":
      return `Installation-ready searches for ${p} in ${geo.name} need clear next steps: photos, measurement, written scope, then a scheduled fixing day subject to materials and society rules.`;
    case "property":
      return `Property-type searches for ${p} in ${geo.name} recognise that apartments, villas and independent houses need different access plans, fixing methods and society or neighbour constraints.`;
    default:
      return `Commercial searches for ${p} in ${geo.name} usually mean a real balcony, window, terrace or practice opening that needs a durable outdoor-ready system—not a catalogue placeholder.`;
  }
}

function productFit(keyword: KeywordIntent, geoName: string): string {
  switch (keyword.serviceSlug) {
    case "invisible-grills":
      return `Invisible grills in ${geoName} suit openings where a slim stainless-cable look and daylight matter as much as a supplementary fall-risk barrier. Spacing, anchors and corner returns are planned after measurement—not from a one-size package.`;
    case "sports-nets":
      return `Sports and cricket nets in ${geoName} are planned around practice length, height, ball impact and whether the space is a terrace, ground or academy lane. Home practice and school use need different durability.`;
    case "cloth-drying-hangers":
      return `Cloth drying hangers in ${geoName} are selected from ceiling strength, headroom and daily laundry load. Pulley, ceiling and balcony systems are not interchangeable without checking the fixing surface.`;
    default:
      return `Safety nets and bird-control systems in ${geoName} are matched to the opening job—child or pet fall risk, pigeon entry, duct coverage or terrace edges. Mesh size and tension follow that brief.`;
  }
}

function pricingParagraph(keyword: KeywordIntent, geoName: string): string {
  return `${keyword.phrase} price in ${geoName} is driven by measured width and height, material specification, irregular corners, AC outdoor units, floor access and whether multiple openings are completed in one visit. Ask for the price unit (sq.ft / running length / opening) and what is included—materials, labour, travel and warranty scope—in writing before work starts.`;
}

function comparisonParagraph(geoName: string): string {
  return `In ${geoName}, invisible grills usually win when you want a clearer view and discreet cables; safety nets usually win for wider bird coverage, duct wraps and budget-friendly mesh across irregular openings. Iron grills block the view more heavily. The right choice is the one that closes your real risk without forcing a product you do not need.`;
}

function localContext(geo: GeoInput): string | null {
  const profile = getCityLocalProfile(geo.citySlug);
  const areaFact =
    geo.kind === "area" && geo.areaSlug
      ? getAreaLocalFact(geo.citySlug, geo.areaSlug)
      : null;

  const bits: string[] = [];
  if (areaFact) {
    bits.push(
      `${geo.name} in ${geo.cityName} is typically characterised by ${areaFact.buildingStock}. ${areaFact.accessNote}`,
    );
    if (areaFact.exposureHint) bits.push(areaFact.exposureHint);
    if (areaFact.landmarks.length > 0) {
      bits.push(
        `Useful visit landmarks include ${areaFact.landmarks.slice(0, 3).join(", ")}.`,
      );
    }
  } else if (profile) {
    bits.push(profile.climateLead);
    bits.push(profile.introAddon);
  } else {
    bits.push(
      `${geo.name} sits within the ${geo.cityName} service belt in Andhra Pradesh. Visit planning uses your landmark, PIN and building access—not a claim of a permanent branch in every neighbourhood.`,
    );
  }
  return bits.filter(Boolean).join(" ");
}

function faqsFor(
  keyword: KeywordIntent,
  geo: GeoInput,
): Array<{ question: string; answer: string }> {
  const p = phraseLower(keyword);
  const base = [
    {
      question: `Do you provide ${p} in ${geo.name}?`,
      answer: `Yes. ${BUSINESS_CONFIG.name} can arrange ${p} in ${geo.name}, ${geo.cityName}, subject to site accessibility, measurements, technician availability and project requirements. Listing this place supports visit planning—it is not a permanent branch claim.`,
    },
    {
      question: `What affects ${p} price in ${geo.name}?`,
      answer:
        "Price follows measured opening size, material grade, spacing, access, corners and whether multiple openings are packaged. Ask for the price unit and inclusions in writing.",
    },
    {
      question: "What photos should I send for a free estimate?",
      answer: `Send a full opening photo, closer shots of fixing surfaces, approximate sizes if known, your ${geo.name} landmark or society name, and whether children, pets, birds or clear view lead the brief.`,
    },
    {
      question: "How fast can installation happen?",
      answer:
        "Same-day or next-day work depends on material readiness, society permissions and technician schedules. Photo enquiry helps confirm the fastest realistic slot.",
    },
    {
      question: `Is ${keyword.phrase} different from other balcony products?`,
      answer: `${keyword.phrase} is matched to a specific opening problem. If pigeon entry, child fall risk or clear-view finish is the real need, we recommend the product that fits—not a one-size catalogue push.`,
    },
    {
      question: `Do you cover other areas near ${geo.name} in ${geo.cityName}?`,
      answer: `Yes. Enquiries from ${geo.name} and surrounding localities in ${geo.cityName} are welcome. Each site is reviewed separately for access and measured scope.`,
    },
    {
      question: "Will you invent ratings or installation counts on this page?",
      answer:
        "No. We do not publish fake reviews, years-in-business claims or fabricated city stats. Ask for recent project references during your enquiry if you want proof of work quality.",
    },
    {
      question: `How do Andhra Pradesh weather conditions affect ${p}?`,
      answer:
        "Strong sun, seasonal rain, dust and coastal salt (where relevant) affect mesh, cables and fasteners. We recommend outdoor-appropriate specifications and simple maintenance checks after heavy weather.",
    },
  ];

  if (keyword.intent === "comparison") {
    base.splice(4, 0, {
      question: "Invisible grill or safety net—which should I choose?",
      answer: comparisonParagraph(geo.name),
    });
  }
  if (keyword.intent === "price") {
    base.splice(1, 0, {
      question: `Is there a fixed ${p} rate for all of ${geo.cityName}?`,
      answer: `No trustworthy installer uses one fixed rate for every opening in ${geo.cityName}. Teaser rates often exclude corners, higher floors, frames or travel. Measured quotations are clearer.`,
    });
  }
  return base;
}

/** Build differentiated keyword × geo SEO content. */
export function buildKeywordGeoContent(
  keyword: KeywordIntent,
  geo: GeoInput,
): KeywordGeoContent {
  const p = phraseLower(keyword);
  const local = localContext(geo);
  const brand = BUSINESS_CONFIG.name;

  const encyclopedia = getServiceEncyclopedia(
    keyword.serviceSlug,
    geo.name,
    keyword.phrase,
  );

  const sections: KeywordGeoContent["sections"] = [
    {
      heading: `Why people search ${p} in ${geo.name}`,
      paragraphs: [
        intentLead(keyword, geo),
        productFit(keyword, geo.name),
        local ??
          `${brand} plans ${p} from photos and on-site measurement in ${geo.name}. Final pricing is scoped in writing before work starts.`,
      ],
    },
    ...encyclopedia,
    {
      heading: `How ${keyword.phrase} is planned in ${geo.name}`,
      paragraphs: [
        `We start with your opening photos and the main risk—children, pets, pigeons, clear view, sports practice or drying utility. Then we confirm fixing surfaces, society rules and access in ${geo.name} before locking material and spacing.`,
        `Across Andhra Pradesh, including ${geo.cityName}, outdoor systems need UV-aware meshes or corrosion-conscious stainless hardware depending on exposure. Coastal belts and hot inland terraces are not treated the same.`,
        `${brand} supports measured quotations for ${p} in ${geo.name} after photo review—listing this locality helps visit planning and does not claim a permanent branch on every street.`,
      ],
    },
  ];

  if (keyword.intent === "price" || keyword.intent === "commercial") {
    sections.push({
      heading: `${keyword.phrase} cost factors in ${geo.name}`,
      paragraphs: [pricingParagraph(keyword, geo.name)],
    });
  }

  if (keyword.intent === "comparison") {
    sections.push({
      heading: `Choosing the right option in ${geo.name}`,
      paragraphs: [comparisonParagraph(geo.name)],
    });
  }

  if (keyword.intent === "problem") {
    sections.push({
      heading: `Solving the real problem in ${geo.name}`,
      paragraphs: [
        `If pigeons keep returning, check AC ledges, side gaps and ducts—not only the main railing. If children use the balcony, spacing and climbable edges matter more than mesh colour. ${brand} recommends the smallest effective system that closes the risk in ${geo.name}.`,
      ],
    });
  }

  sections.push({
    heading: `Serving ${geo.name} and wider ${geo.cityName}`,
    paragraphs: [
      `${brand} supports ${p} enquiries across ${geo.name} and other localities in ${geo.cityName}, Andhra Pradesh. Coverage is confirmed after site review—send photos and landmark details when you enquire. We do not claim a shop inside every neighbourhood listed online.`,
      `Residents comparing options in ${geo.cityName} should judge written scope quality—openings, materials, spacing or mesh intent, inclusions and aftercare—rather than invented rankings. That is how durable balcony and terrace work is planned across Andhra Pradesh.`,
    ],
  });

  sections.push({
    heading: `Why measured local pages matter for ${geo.name}`,
    paragraphs: [
      `Searchers looking for ${p} in ${geo.name} usually want a reachable installer who can visit, measure and finish without vague statewide promises. Local pages should explain product fit, weather-aware materials and the photo-to-measurement path—not copy-paste the same paragraph for every pin code.`,
      `${brand} keeps ${geo.name} content tied to real opening problems and Andhra Pradesh exposure notes so the page stays useful after the click—not only for the keyword.`,
    ],
  });

  return {
    metaTitle: `${keyword.phrase} in ${geo.name} | Measured Quote | ${brand}`,
    metaDescription: `${p} in ${geo.name}, ${geo.cityName}, Andhra Pradesh — photo estimate, measured quotation, weather-aware materials and clear written scope from ${brand}. Call ${BUSINESS_CONFIG.phone.displayFormatted}.`,
    heroDescription: `Professional ${p} for apartments, villas, homes and suitable commercial openings in ${geo.name}, ${geo.cityName}. Send opening photos for a measured estimate from ${brand}.`,
    sections,
    decisionPoints: [
      "Match the product to the opening problem, not only the search keyword",
      "Confirm spacing, mesh or cable grade against children, pets or birds",
      "Note society permissions and working hours before drill day",
      "Ask for written inclusions: materials, labour, travel and warranty scope",
      "Prefer photo + measurement over teaser citywide rates",
      "Ask how Andhra Pradesh sun, rain or coastal exposure affects the specification",
    ],
    processSteps: [
      `Share opening photos, ${geo.name} landmark and your main risk priority`,
      "Receive early guidance, then schedule measurement when needed",
      "Approve a written scope with material and price clarity",
      "Installation and finishing checks on the agreed slot",
      "Handover with basic care notes for Andhra Pradesh weather",
    ],
    photoChecklist: [
      `Full view of the balcony, window, terrace or practice area in ${geo.name}`,
      "Closer shots of walls, ceiling or parapet where fixings will go",
      "AC outdoor units, planters or irregular corners that affect coverage",
      "Approximate width and height if you already measured",
      "Society name or nearby landmark for visit planning",
    ],
    faqs: faqsFor(keyword, geo),
  };
}
