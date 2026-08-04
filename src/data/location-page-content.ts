/**
 * Differentiated location and service-location content builders.
 * Uses only genuine inputs (name, type, district, nearby places).
 * Does not invent offices, ratings, local stats or unverified neighbourhood facts.
 */

import { getAreaLocalFact } from "@/data/area-local-facts";
import { getCityLocalProfile } from "@/data/city-local-profiles";

export type LocationPageContent = {
  introduction: string;
  servicesOverview: string;
  residentialApplications: string;
  commercialApplications: string;
  commonRequirements: string[];
  installationOverview: string;
  siteInspectionInfo: string;
  pricingFactors: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export type CityServiceContent = {
  uniqueIntroduction: string;
  localRequirements: string;
  suitablePropertyTypes: string;
  problemsSolved: string;
  materialsGuidance: string;
  installationOverview: string;
  weatherNotes: string;
  areasServedIntro: string;
  pricingNote: string;
};

export type AreaServiceContent = {
  uniqueIntroduction: string;
  serviceOverview: string;
  residentialApplications: string;
  suitablePropertyTypes: string;
  safetyRequirements: string;
  materialGuidance: string;
  measurementProcess: string;
  installationSteps: string;
  maintenanceAdvice: string;
  pricingNote: string;
};

const COASTAL_NAME_MARKERS = [
  "visakhapatnam",
  "vizag",
  "gajuwaka",
  "bheemunipatnam",
  "bheemili",
  "kakinada",
  "nellore",
  "machilipatnam",
  "srikakulam",
  "vizianagaram",
  "anakapalli",
] as const;

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isCoastalPlace(name: string): boolean {
  const normalized = normalizeToken(name);
  return COASTAL_NAME_MARKERS.some(
    (marker) =>
      normalized === marker ||
      normalized.includes(marker) ||
      marker.includes(normalized),
  );
}

function joinNearby(nearbyPlaces?: string[]): string {
  if (!nearbyPlaces || nearbyPlaces.length === 0) return "";
  if (nearbyPlaces.length === 1) return nearbyPlaces[0];
  if (nearbyPlaces.length === 2) {
    return `${nearbyPlaces[0]} and ${nearbyPlaces[1]}`;
  }
  return `${nearbyPlaces.slice(0, -1).join(", ")} and ${nearbyPlaces[nearbyPlaces.length - 1]}`;
}

function districtPhrase(district?: string): string {
  return district ? ` in ${district} district` : " in Andhra Pradesh";
}

function coverageSentence(locationName: string): string {
  return `We provide installation services across ${locationName} subject to site accessibility, measurements, technician availability and project requirements.`;
}

function serviceLabel(serviceSlug: string, serviceName: string): string {
  switch (serviceSlug) {
    case "invisible-grills":
      return "invisible grills";
    case "safety-nets":
      return "safety nets";
    case "sports-nets":
      return "sports nets";
    case "cloth-drying-hangers":
      return "cloth drying hangers";
    default:
      return serviceName.toLowerCase();
  }
}

/** Build differentiated location content using genuine variables without inventing facts. */
export function buildLocationPageContent(input: {
  name: string;
  locationType: string;
  district?: string;
  nearbyPlaces?: string[];
  isPriorityCity?: boolean;
}): LocationPageContent {
  const { name, locationType, district, nearbyPlaces, isPriorityCity } = input;
  const nearby = joinNearby(nearbyPlaces);
  const placeKind =
    locationType === "city"
      ? "city"
      : locationType === "town"
        ? "town"
        : locationType === "district"
          ? "district"
          : locationType === "area" || locationType === "locality"
            ? "area"
            : "location";

  const nearbySentence = nearby
    ? ` Customers also enquire from nearby places such as ${nearby}, and each request is assessed on its own site conditions.`
    : " Each enquiry is assessed on its own site conditions rather than assumed neighbourhood patterns.";

  const prioritySentence = isPriorityCity
    ? ` ${name} is among the locations where we regularly receive measurement and installation enquiries, so scheduling is usually planned against current technician availability.`
    : "";

  const profileKey = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const profile =
    getCityLocalProfile(profileKey) ??
    (name.toLowerCase().includes("visakhapatnam") ||
    name.toLowerCase().includes("vizag")
      ? getCityLocalProfile("visakhapatnam")
      : name.toLowerCase().includes("vijayawada")
        ? getCityLocalProfile("vijayawada")
        : null);

  const localClimate = profile
    ? ` ${profile.climateLead} ${profile.introAddon}`
    : isCoastalPlace(name)
      ? ` Local planning in ${name} should respect coastal humidity, sea breeze and salt-heavy air on exposed balconies—so stainless grade, fasteners and maintenance matter as much as the first look.`
      : name.toLowerCase().includes("guntur") ||
          name.toLowerCase().includes("eluru")
        ? ` Local planning in ${name} should respect strong summer heat, terrace exposure and busy utility balconies used for drying, plants and daily family movement.`
        : ` Local planning in ${name} should respect Andhra Pradesh sun, seasonal rain and the way balconies are used as real everyday spaces.`;

  return {
    introduction: `Choose the right protection in ${name} for balcony safety, pigeon control, invisible grills, terraces, children, pets, sports areas or cloth drying systems. Start with the opening and the problem—fall risk, bird entry, clear-view finish or utility use—then confirm locality details that affect access and exposure.${localClimate}${nearbySentence}${prioritySentence} ${coverageSentence(name)} We do not claim a branch office in every listed ${placeKind}; service is coordinated as a statewide Andhra Pradesh installation offering with site confirmation before work begins.`,

    servicesOverview: `In ${name}, pick the closest need first: balcony and family safety, pigeon and bird control, clear-view invisible grills, terrace coverage, child or pet mesh, cricket or sports nets, bird spikes for narrow ledges, or cloth drying hangers. Invisible grills suit homes where a low-visibility cable finish and open view matter. Safety nets suit broader fall-risk or bird-entry coverage. Sports nets are planned for ground or terrace practice. Cloth hangers are selected from ceiling strength, height and daily laundry load. Photos help early routing; measurement confirms mesh, cable, spacing and fixing.`,

    residentialApplications: `Residential work in ${name} typically includes apartment balconies, bedroom and hall windows, villa terraces, staircase openings, utility ducts and kitchen-side drying areas. Independent houses may need terrace edge protection or courtyard bird netting. In gated communities, society guidelines on drilling, colour finish and working hours can affect the installation plan, so we note those constraints during measurement. For families with young children or pets, spacing, fixing height and edge coverage matter more than appearance alone.`,

    commercialApplications: `Commercial and institutional requests around ${name} may include apartment associations, schools, coaching centres, hostels, clinics, small offices and sports practice grounds. These sites often need clearer access planning, larger spans and durable specifications suited to frequent use. We share a scope based on measured openings and intended use, then schedule installation when materials and site readiness are confirmed.`,

    commonRequirements: [
      "Accurate width and height of each balcony, window, duct or practice area",
      "Notes on parapet height, railing gaps and wall or ceiling condition",
      "Access details such as lift availability, terrace entry and working-hour limits",
      "Society or building permissions where external drilling is restricted",
      "Clear priority: child safety, pet safety, bird control, sports use or drying utility",
      "Preferred material look and maintenance expectations for outdoor exposure",
    ],

    installationOverview: `Installation in ${name} begins only after measurement and quotation approval. Technicians mark fixing points, prepare anchors or support frames as needed, install the selected system, check tension or cable spacing, and clean the work area before handover. For multi-opening flats, we usually complete one logical zone at a time so living spaces remain usable. ${coverageSentence(name)}`,

    siteInspectionInfo: `A site inspection in ${name} helps us verify opening dimensions, surface strength, corrosion exposure, safe working access and any society constraints. Photos can support an initial discussion, but final pricing and material advice should follow measured site conditions. If access is restricted or the structure needs preparatory work, we explain that before installation is booked.`,

    pricingFactors: [
      "Total measured area or running length across all openings",
      "Material grade and mesh or cable specification selected",
      "Number of corners, cut-outs, AC outdoor units and irregular edges",
      "Floor height, terrace access and installation difficulty",
      "Whether the work is a single balcony or a full-home package",
      "Any custom frame, gate, pulley or heavy-duty sports support requirement",
    ],

    faqs: [
      {
        question: `Do you provide installation services in ${name}?`,
        answer: coverageSentence(name),
      },
      {
        question: `Do you have an office or branch in ${name}?`,
        answer: `We operate as a service-area business serving customers across Andhra Pradesh. Listing ${name} means installation support can be arranged subject to site confirmation; it does not automatically mean a permanent local shop or branch exists there.`,
      },
      {
        question: "Which services can I request at this location?",
        answer:
          "You can enquire for invisible grills, safety nets, sports nets and cloth drying hangers. The suitable option depends on your property type, opening size and whether the main need is fall protection, bird control, sports practice or clothes drying.",
      },
      {
        question: "Is a site visit required before quotation?",
        answer:
          "Yes for most projects. Photos help with early guidance, but accurate quotation usually needs measured dimensions, surface checks and access review at the property.",
      },
      {
        question: "How long does installation usually take?",
        answer:
          "A single balcony or window job may finish in a few hours once materials and access are ready. Larger homes, sports nets or multi-opening packages can take longer. We share an expected duration after measurement.",
      },
      {
        question: "Can you work in apartments with society rules?",
        answer:
          "Yes, provided the association allows the required fixing method and working hours. Share any society guidelines during enquiry so the quotation and schedule can account for them.",
      },
      {
        question: "What should I prepare before the technician visit?",
        answer:
          "Clear the work area, arrange terrace or balcony access if needed, note AC outdoor units or planters that affect openings, and keep a decision-maker available for measurement confirmation.",
      },
      {
        question: "Are materials suited to Andhra Pradesh weather?",
        answer:
          "We recommend outdoor-appropriate stainless steel, UV-stabilised nets and corrosion-conscious fasteners based on exposure. Coastal and high-sun locations need extra attention to material choice and maintenance.",
      },
      {
        question: "Do you install for both homes and commercial properties?",
        answer:
          "Yes. Residential flats and villas are common, and we also support schools, practice grounds, hostels and other commercial sites when the scope and access are confirmed.",
      },
      {
        question: nearby
          ? `Can customers from nearby places like ${nearby} also enquire?`
          : "Can customers from nearby places also enquire?",
        answer: nearby
          ? `Yes. Enquiries from ${name} and nearby places such as ${nearby} are welcome. Each site is reviewed separately for accessibility, measurements and technician availability.`
          : `Yes. Enquiries from ${name} and surrounding places are welcome. Each site is reviewed separately for accessibility, measurements and technician availability.`,
      },
      {
        question: "Will the quotation change after measurement?",
        answer:
          "The final quotation is based on measured scope. If openings differ from earlier estimates, or if extra corners, frames or access work are needed, the price is updated and shared before installation proceeds.",
      },
      {
        question: "How do I start an enquiry for this location?",
        answer: `Share your city or area as ${name}, the service needed, approximate opening count and photos if available. We will guide you on the next measurement or quotation step based on project requirements.`,
      },
    ],
  };
}

/** Shorter area-focused content with 8 FAQs. */
export function buildAreaPageContent(input: {
  areaName: string;
  cityName: string;
  district?: string;
}): LocationPageContent {
  const { areaName, cityName, district } = input;
  const placeLabel = `${areaName}, ${cityName}`;

  return {
    introduction: `${areaName} is an area within ${cityName}${district ? `, ${district} district` : ", Andhra Pradesh"}, where residents often need practical balcony safety, bird netting, sports practice setups or compact drying solutions for apartment living. We help with invisible grills, safety nets, sports nets and cloth drying hangers after reviewing the actual openings and access at your building. ${coverageSentence(placeLabel)} Local area pages are meant to help you understand service availability; they are not claims of a permanent office inside every neighbourhood.`,

    servicesOverview: `In ${areaName}, requests commonly relate to apartment balconies, window openings, duct areas, terrace edges and limited drying spaces. Invisible grills suit families who want discreet fall protection. Safety nets are useful for pigeon control and wider coverage. Sports nets are planned where ground or terrace practice space is available. Cloth drying hangers help when outdoor drying space is limited. We match the recommendation to daily use rather than pushing a single product for every home.`,

    residentialApplications: `Homes in ${areaName} may include mid-rise flats, independent houses and villa-style residences linked to ${cityName}. Typical applications are balcony edge protection, bedroom window safety, utility balcony bird control and ceiling-mounted drying systems. Building access, parking distance and lift usage can affect installation planning, so those details are useful during enquiry.`,

    commercialApplications: `Small commercial and community sites around ${areaName} — such as coaching centres, apartment common areas or school practice corners linked to ${cityName} — can also request nets or safety installations. Scope depends on measured span, usage intensity and safe working access.`,

    commonRequirements: [
      "Building name or landmark reference within the area for visit planning",
      "Balcony, window, duct or terrace measurements where known",
      "Notes on society permissions and preferred working hours",
      "Main concern: child safety, pets, pigeons, sports use or clothes drying",
      "Photos of openings and fixing surfaces if a visit is being scheduled",
    ],

    installationOverview: `For ${areaName}, installation is scheduled after measurement and approval. The team arrives with the agreed materials, completes fixing and finishing, and checks basic safety points before handover. ${coverageSentence(placeLabel)}`,

    siteInspectionInfo: `Site inspection in ${areaName} confirms opening sizes, wall or ceiling condition, balcony access and any constraints specific to your building in ${cityName}. This step keeps the quotation realistic and avoids assumptions based only on area name.`,

    pricingFactors: [
      "Measured size of each opening in the home or site",
      "Selected material specification and finish",
      "Access difficulty within the building",
      "Number of openings included in one visit",
      "Any custom cutting around AC units, grills or ducts",
    ],

    faqs: [
      {
        question: `Do you serve ${areaName} in ${cityName}?`,
        answer: coverageSentence(placeLabel),
      },
      {
        question: "Which product is best for apartment balconies here?",
        answer:
          "Invisible grills and safety nets are both common. Choose based on whether you prioritise a more open look, bird control, budget range or coverage across irregular openings. Measurement helps decide clearly.",
      },
      {
        question: "Can installation happen on working weekdays?",
        answer:
          "Yes, subject to technician availability and any society working-hour rules at your building. Share preferred slots when you enquire.",
      },
      {
        question: "Do you need society permission?",
        answer:
          "Many apartments expect residents to inform the association before external drilling or terrace work. Check your society process early so the installation day is not delayed.",
      },
      {
        question: "Are area pages based on a local shop?",
        answer: `No. ${areaName} is listed to help customers in ${cityName} understand that installation support can be arranged here. It is not proof of a neighbourhood branch office.`,
      },
      {
        question: "What details speed up quotation?",
        answer:
          "Share service type, number of openings, approximate sizes, floor number, photos and any access limits. A measurement visit then finalises the quote.",
      },
      {
        question: "Can one visit cover multiple balconies?",
        answer:
          "Yes. Multi-opening packages are common and often more efficient when measured and installed together under one agreed scope.",
      },
      {
        question: "How do weather and sun exposure affect material choice?",
        answer:
          "Outdoor exposure in Andhra Pradesh calls for UV-aware nets and corrosion-conscious metal components. We advise based on your opening orientation and maintenance preference.",
      },
    ],
  };
}

function cityServiceIntroduction(
  serviceSlug: string,
  serviceName: string,
  cityName: string,
  district?: string,
): string {
  const districtBit = district ? ` in ${district} district` : "";
  const label = serviceLabel(serviceSlug, serviceName);

  switch (serviceSlug) {
    case "invisible-grills":
      return `Looking for ${label} in ${cityName}${districtBit}? Invisible grills use slim, tensioned stainless-steel cables to reduce visual obstruction across balconies, windows, staircase openings and utilities while adding a supplementary fall-risk barrier. A responsible site survey checks the intended risk, existing railing, cable and edge gaps, fixing substrate, sun or coastal exposure, cleaning access and building permissions before recommending a direct-fixed, fixed-frame or openable layout. ${coverageSentence(cityName)} Send opening photos for early guidance; final spacing and hardware follow measurement—not a one-rate citywide package.`;

    case "safety-nets":
      return `Safety net installation in ${cityName}${districtBit} is commonly requested for balcony edges, pigeon control, duct openings, terraces, child safety and pet zones. Start with the problem the opening needs to solve, then match mesh and fixing to that job. Full-opening bird nets differ from fall-risk child or pet nets; narrow ledges may need spikes instead of covering the whole balcony. ${coverageSentence(cityName)} We assess mesh grade, fixing method and tension against the actual span and surface condition, then share a clear measured scope before installation is scheduled.`;

    case "sports-nets":
      return `Sports nets in ${cityName}${districtBit} support cricket practice, multi-sport enclosures and school or residential training spaces where ball containment matters. We plan post positions, net height, mesh specification and entry points based on the available ground or terrace area and the intensity of use. Home practice setups differ from academy lanes, so durability and span are matched to real usage rather than a single standard kit. ${coverageSentence(cityName)} Outdoor installations across Andhra Pradesh also need attention to sun exposure, wind load and ground fixing quality. Once measurements are confirmed, we explain the installation sequence and what maintenance will keep the net serviceable.`;

    case "cloth-drying-hangers":
      return `Cloth drying hangers in ${cityName}${districtBit} help apartments and independent houses manage daily laundry where balcony space is limited or clothes need a cleaner overhead drying setup. Ceiling-mounted, pulley and wall systems are selected after checking height clearance, ceiling strength and how many loads you typically dry. ${coverageSentence(cityName)} We avoid guessing hanger capacity from photos alone; a quick site review confirms safe fixing points and usable length. For flats in ${cityName}, society preferences and neighbour clearance can also influence the final layout. The result should be a stable, easy-to-use drying arrangement suited to your routine, not just a decorative fixture.`;

    default:
      return `${serviceName} service in ${cityName}${districtBit} is arranged after we understand your property type, opening or ground dimensions and practical constraints on site. ${coverageSentence(cityName)} We provide clear measurement-led guidance and install only after the scope and materials are agreed.`;
  }
}

function materialsByService(serviceSlug: string, serviceName: string): string {
  switch (serviceSlug) {
    case "invisible-grills":
      return "Invisible grill work typically uses stainless steel cables or rods with outdoor-suitable anchors, end fittings and neat corner finishing. Grade selection and fastener quality matter for long-term outdoor exposure. We explain the practical differences in spacing and finish so you can balance safety needs with appearance.";
    case "safety-nets":
      return "Safety nets are usually UV-stabilised nylon or polyethylene meshes fixed with hooks, ropes or custom frames depending on the opening. Mesh size and thickness should match the risk — bird control, child safety or pet containment are not identical requirements. Tensioning quality is as important as the net brand claim.";
    case "sports-nets":
      return "Sports installations combine net panels suited to ball impact with posts, tension ropes and ground or wall fixing hardware. Heavier use at schools or academies needs stronger specifications than occasional home practice. We match mesh and support strength to the sport and span.";
    case "cloth-drying-hangers":
      return "Cloth drying hangers may use powder-coated or stainless components, ceiling hooks, pulleys and load-rated fasteners. Ceiling condition decides what can be installed safely. We recommend systems that suit your drying volume and available headroom rather than overloading a weak fixing surface.";
    default:
      return `${serviceName} materials are selected for the measured site, expected outdoor exposure and maintenance preference. We explain options in plain language before you approve the quotation.`;
  }
}

function problemsByService(serviceSlug: string, cityName: string): string {
  switch (serviceSlug) {
    case "invisible-grills":
      return `In ${cityName}, invisible grills are commonly chosen to reduce fall risk at balconies and windows, discourage climbing at open edges and give families more confidence when children or pets use these spaces. They also help where residents want safety without fully blocking the view.`;
    case "safety-nets":
      return `In ${cityName}, safety nets help with pigeon nesting, bird droppings on utility balconies, open duct risks and broader edge protection where a mesh barrier is practical. They are also used for pet zones and terrace sides when coverage across a wider span is needed.`;
    case "sports-nets":
      return `In ${cityName}, sports nets help contain cricket balls and practice shots, protect neighbouring spaces and create a clearer training boundary for schools, academies or residential play areas. Proper height and tension reduce ball escape and everyday frustration during practice.`;
    case "cloth-drying-hangers":
      return `In ${cityName}, cloth drying hangers address limited balcony drying space, clothes clutter on railings and the need for a neater overhead drying arrangement in apartments. A well-fixed hanger makes daily laundry more organised without occupying valuable floor area.`;
    default:
      return `Customers in ${cityName} request this service to improve safety, utility or practice usability at the property after a site-specific assessment.`;
  }
}

function weatherNotesForCity(cityName: string, citySlug?: string): string {
  const profile = citySlug ? getCityLocalProfile(citySlug) : null;
  if (profile) return profile.weatherNotes;

  if (isCoastalPlace(cityName)) {
    return `Weather planning for ${cityName} should consider coastal humidity, sea breeze, hill-to-sea wind movement and salt-heavy air that can punish cheap hardware quickly. Sea-facing or breeze-heavy balconies often need stronger stainless and fastener choices than inland flats. UV-stabilised nets also age better under prolonged sun. Compare the complete hardware specification rather than price alone, and plan periodic cleaning after monsoon and dusty spells.`;
  }

  const inlandHeat =
    cityName.toLowerCase().includes("vijayawada") ||
    cityName.toLowerCase().includes("guntur") ||
    cityName.toLowerCase().includes("eluru") ||
    cityName.toLowerCase().includes("kurnool");

  if (inlandHeat) {
    return `Weather planning for ${cityName} should consider strong summer heat, river or inland humidity where relevant, open terrace exposure and dust-heavy traffic corridors. Hot top-floor balconies and terrace edges change how mesh colour, tension and fixing are judged. UV-stabilised nets and corrosion-conscious metal components are practical choices. Periodic cleaning and visual checks after heavy weather help catch loose hooks or debris early.`;
  }

  return `Across Andhra Pradesh, including ${cityName}, outdoor installations face strong sun, seasonal rain and dusty periods that affect nets, cables and fasteners over time. UV-stabilised meshes and corrosion-conscious metal components are practical choices for balconies, terraces and open practice areas. Periodic cleaning and visual checks after heavy weather help catch loose hooks or debris early. Material advice is always tied to your opening’s actual exposure.`;
}

/** City + service differentiated content. */
export function buildCityServiceContent(input: {
  serviceSlug: string;
  serviceName: string;
  cityName: string;
  citySlug?: string;
  district?: string;
  areas?: string[];
}): CityServiceContent {
  const { serviceSlug, serviceName, cityName, citySlug, district, areas } = input;
  const label = serviceLabel(serviceSlug, serviceName);
  const areaList = joinNearby(areas);
  const profile = citySlug ? getCityLocalProfile(citySlug) : null;

  const localRequirements = (() => {
    switch (serviceSlug) {
      case "invisible-grills":
        return `For ${label} in ${cityName}, we need opening width and height, parapet or railing details, wall condition for anchors, floor level and any society restrictions on external work${district ? ` (${district} district enquiries welcome)` : ""}. Irregular corners and AC outdoor units should be mentioned early.`;
      case "safety-nets":
        return `For ${label} in ${cityName}, share the purpose — bird control, child safety, pet safety or duct covering — along with span sizes and fixing surface type. Terrace and duct jobs need clear access notes before scheduling.`;
      case "sports-nets":
        return `For ${label} in ${cityName}, we need ground or terrace dimensions, preferred height, sport type and whether the setup is for home practice or heavier institutional use. Gate or entry needs should be included in the brief.`;
      case "cloth-drying-hangers":
        return `For ${label} in ${cityName}, note ceiling height, approximate drying load, preferred system type and whether the space is an enclosed utility area or open balcony. Ceiling strength decides safe fixing options.`;
      default:
        return `Share dimensions, photos and access details for ${serviceName} in ${cityName} so measurement and quotation can be planned accurately.`;
    }
  })();

  const suitablePropertyTypes = (() => {
    switch (serviceSlug) {
      case "invisible-grills":
        return `Suitable properties in ${cityName} include apartments, villas, independent houses and high-rise flats where balconies, windows, staircases or terraces need discreet fall protection.`;
      case "safety-nets":
        return `Suitable properties include apartments with pigeon issues, villas with open terraces, buildings with duct openings, hostels and other sites in ${cityName} needing mesh barrier protection.`;
      case "sports-nets":
        return `Suitable sites include residential practice corners, school grounds, coaching spaces and community play areas in ${cityName} where ball containment is required.`;
      case "cloth-drying-hangers":
        return `Suitable homes include apartments, villas and independent houses in ${cityName} with limited drying space or a need for overhead laundry arrangements.`;
      default:
        return `Apartments, independent houses and suitable commercial sites in ${cityName} can be reviewed for ${serviceName} after site confirmation.`;
    }
  })();

  const installationOverview = (() => {
    switch (serviceSlug) {
      case "invisible-grills":
        return `Installation involves marking anchor points, fixing end hardware, running and tensioning stainless cables or rods to the agreed spacing, finishing corners and checking alignment before handover in ${cityName}.`;
      case "safety-nets":
        return `Installation involves fixing support hooks or frames, cutting and tensioning the net to the opening, securing edges and checking that coverage meets the agreed safety or bird-control scope in ${cityName}.`;
      case "sports-nets":
        return `Installation typically covers support posts or wall fixings, net hanging, tensioning, entry arrangements where required and a final stability check for the practice area in ${cityName}.`;
      case "cloth-drying-hangers":
        return `Installation covers locating safe ceiling or wall points, fixing the hanger system, checking movement of pulleys or arms where applicable, and confirming load usability before handover in ${cityName}.`;
      default:
        return `Installation in ${cityName} follows measurement, material preparation, secure fixing and a basic safety check before handover.`;
    }
  })();

  const baseIntro = cityServiceIntroduction(
    serviceSlug,
    serviceName,
    cityName,
    district,
  );
  const uniqueIntroduction = profile
    ? `${baseIntro} ${profile.introAddon} ${profile.climateLead}`
    : baseIntro;

  const corridors = profile
    ? ` Key residential corridors include ${profile.residentialCorridors.slice(0, 3).join("; ")}.`
    : "";
  const societies = profile
    ? ` Named apartment communities people often ask about include ${profile.societyExamples.slice(0, 4).join(", ")}.`
    : "";

  return {
    uniqueIntroduction,
    localRequirements,
    suitablePropertyTypes,
    problemsSolved: problemsByService(serviceSlug, cityName),
    materialsGuidance: materialsByService(serviceSlug, serviceName),
    installationOverview,
    weatherNotes: weatherNotesForCity(cityName, citySlug),
    areasServedIntro: areaList
      ? `Within ${cityName}, customers often enquire from areas such as ${areaList}.${corridors}${societies} ${coverageSentence(cityName)} Area names help with visit planning; final suitability still depends on building access and measured site conditions.`
      : `Service enquiries across ${cityName} are welcome from residential and suitable commercial sites.${corridors}${societies} ${coverageSentence(cityName)} Final suitability depends on building access and measured site conditions.`,
    pricingNote: `Pricing for ${label} in ${cityName} depends on measured size, material specification, access difficulty and total openings or span. We share a site-specific quotation after inspection rather than a one-rate list for the whole city. ${profile?.photoEstimateHint ?? "Share opening photos for a clearer first estimate."}`,
  };
}

function areaServiceIntroduction(
  serviceSlug: string,
  serviceName: string,
  areaName: string,
  cityName: string,
): string {
  const label = serviceLabel(serviceSlug, serviceName);

  switch (serviceSlug) {
    case "invisible-grills":
      return `For ${label} in ${areaName}, ${cityName}, we focus on the balconies and windows in your building rather than area-wide assumptions. Spacing, anchor points and finish are planned after measuring each opening and checking wall condition. ${coverageSentence(`${areaName}, ${cityName}`)} Families usually compare invisible grills with nets when they want a cleaner look with reliable edge protection.`;
    case "safety-nets":
      return `Safety net work in ${areaName}, ${cityName} is planned around the actual balcony, duct or terrace opening in your property. Mesh choice depends on whether bird control, child safety or pet containment is the priority. ${coverageSentence(`${areaName}, ${cityName}`)} A short site review keeps the quotation aligned with fixing surfaces and access limits in the building.`;
    case "sports-nets":
      return `Sports net enquiries from ${areaName}, ${cityName} are assessed by available practice length, height needs and how often the space will be used. Home setups and institutional lanes need different durability levels. ${coverageSentence(`${areaName}, ${cityName}`)} We confirm ground or terrace fixing options before finalising materials.`;
    case "cloth-drying-hangers":
      return `Cloth drying hanger installation in ${areaName}, ${cityName} starts with ceiling height, safe fixing points and your typical laundry load. Apartment utility areas and open balconies need different layouts. ${coverageSentence(`${areaName}, ${cityName}`)} Once measurements are done, we recommend a system that stays usable every day without overloading the ceiling.`;
    default:
      return `${serviceName} in ${areaName}, ${cityName} is arranged after site review. ${coverageSentence(`${areaName}, ${cityName}`)}`;
  }
}

/** Area + service differentiated content. */
export function buildAreaServiceContent(input: {
  serviceSlug: string;
  serviceName: string;
  areaName: string;
  cityName: string;
  citySlug?: string;
  areaSlug?: string;
}): AreaServiceContent {
  const { serviceSlug, serviceName, areaName, cityName, citySlug, areaSlug } =
    input;
  const label = serviceLabel(serviceSlug, serviceName);
  const place = `${areaName}, ${cityName}`;
  const areaFact =
    citySlug && areaSlug ? getAreaLocalFact(citySlug, areaSlug) : null;
  const cityProfile = citySlug ? getCityLocalProfile(citySlug) : null;

  const serviceOverview = (() => {
    switch (serviceSlug) {
      case "invisible-grills":
        return `${serviceName} in ${place} provide slim stainless barriers for balconies, windows and similar openings where fall protection is needed without heavy grill panels. Each opening is measured and fixed independently.`;
      case "safety-nets":
        return `${serviceName} in ${place} create a practical mesh barrier for balconies, ducts, terraces and bird-prone utility areas. Specification follows the risk you want to manage and the span to be covered.`;
      case "sports-nets":
        return `${serviceName} in ${place} support practice and ball containment for residential or institutional spaces linked to ${cityName}. Design follows measured length, height and usage level.`;
      case "cloth-drying-hangers":
        return `${serviceName} in ${place} offer overhead or wall-mounted drying capacity for flats and houses with limited balcony drying space. Safe ceiling or wall fixing is the first selection filter.`;
      default:
        return `${serviceName} is available for suitable properties in ${place} after measurement and quotation.`;
    }
  })();

  const residentialApplications = (() => {
    switch (serviceSlug) {
      case "invisible-grills":
        return `Common residential uses in ${areaName} include living-room balconies, bedroom windows, staircase sides and villa terrace edges where children or pets need better protection.`;
      case "safety-nets":
        return `Common residential uses include utility balconies with pigeon problems, child-safety balcony netting, pet areas and duct openings in apartment buildings around ${areaName}.`;
      case "sports-nets":
        return `Residential applications include terrace cricket practice setups and compact ground nets where space in or near ${areaName} allows safe ball containment.`;
      case "cloth-drying-hangers":
        return `Residential applications include apartment utility ceilings, kitchen-adjacent drying corners and villa laundry areas in ${areaName} where floor space should stay clear.`;
      default:
        return `Residential properties in ${areaName} are reviewed individually for suitability.`;
    }
  })();

  const safetyRequirements = (() => {
    switch (serviceSlug) {
      case "invisible-grills":
        return "Safety depends on correct spacing, secure anchors, sound fixing surfaces and complete coverage of climbable gaps. We do not treat decorative finish as a substitute for proper fixing.";
      case "safety-nets":
        return "Safety depends on suitable mesh size, firm edge fixing, adequate tension and coverage across the full risk opening. Loose or undersized nets reduce protection quickly.";
      case "sports-nets":
        return "Safety and usability depend on stable posts or wall fixings, correct height, secure joins and enough setback from hazards around the practice zone.";
      case "cloth-drying-hangers":
        return "Safety depends on load-appropriate fasteners, sound ceiling or wall structure and clear headroom so the hanger can be used without strain or detachment risk.";
      default:
        return "Safety requirements are confirmed on site based on structure, access and intended use.";
    }
  })();

  const baseIntro = areaServiceIntroduction(
    serviceSlug,
    serviceName,
    areaName,
    cityName,
  );
  const factIntro = areaFact
    ? ` ${areaName} is typically characterised by ${areaFact.buildingStock}. ${areaFact.accessNote}${
        areaFact.exposureHint ? ` ${areaFact.exposureHint}` : ""
      } Common local briefs include ${areaFact.commonNeeds.slice(0, 3).join(", ")}.`
    : cityProfile
      ? ` ${cityProfile.climateLead}`
      : "";

  const landmarkBit =
    areaFact && areaFact.landmarks.length > 0
      ? ` Useful visit landmarks include ${areaFact.landmarks.slice(0, 3).join(", ")}.`
      : "";

  return {
    uniqueIntroduction: `${baseIntro}${factIntro}`,
    serviceOverview,
    residentialApplications,
    suitablePropertyTypes: areaFact
      ? `Suitable properties in ${areaName} include the apartment and housing mix described above within ${cityName}. ${label} is considered after access and structure are checked.${landmarkBit}`
      : `Apartments, independent houses and other suitable buildings in ${areaName} within ${cityName} can be considered for ${label} after access and structure are checked.`,
    safetyRequirements,
    materialGuidance: materialsByService(serviceSlug, serviceName),
    measurementProcess: `Measurement in ${place} covers opening width and height, fixing surface condition, obstacles such as AC units, and access notes for installation day.${landmarkBit} These details replace guesswork based only on the area name.`,
    installationSteps: `After approval, technicians prepare the opening, install fixings, fit the ${label}, check tension or alignment, clean the area and explain basic care before leaving the site in ${areaName}.`,
    maintenanceAdvice: (() => {
      switch (serviceSlug) {
        case "invisible-grills":
          return "Wipe cables periodically, check end fittings after severe weather and avoid hanging heavy objects from the grill lines.";
        case "safety-nets":
          return "Remove leaf litter and debris, check hooks and edge ropes periodically, and report sagging or torn mesh early before gaps widen.";
        case "sports-nets":
          return "Check post stability and net joins regularly, retension when sag appears, and avoid storing wet nets in compressed heaps for long periods.";
        case "cloth-drying-hangers":
          return "Do not exceed the advised load, keep pulleys moving freely where fitted, and recheck ceiling fasteners if any unusual movement appears.";
        default:
          return "Follow the handover care notes and request a review if you notice looseness, corrosion or damage.";
      }
    })(),
    pricingNote: `Quotation for ${label} in ${place} is based on measured scope, material choice and installation access. ${coverageSentence(place)}${
      cityProfile ? ` ${cityProfile.photoEstimateHint}` : ""
    }`,
  };
}
