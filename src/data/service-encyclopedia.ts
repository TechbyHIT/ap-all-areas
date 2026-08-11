/**
 * Wikipedia-style service explainers reused across money, keyword and hub pages.
 * Place-aware sentences keep pages useful without inventing local offices or stats.
 */

export type EncyclopediaSection = {
  heading: string;
  paragraphs: string[];
};

function placeClause(placeName: string): string {
  return placeName.trim() || "Andhra Pradesh";
}

function invisibleGrills(place: string): EncyclopediaSection[] {
  return [
    {
      heading: `What invisible grills are (and are not) in ${place}`,
      paragraphs: [
        `Invisible grills are tensioned stainless-steel cable (or slim rod) systems fixed across a balcony, window, staircase side or terrace edge so daylight and outward view stay largely open compared with solid iron bars. In practical home use in ${place}, they act as a supplementary fall-risk barrier—not a replacement for a sound original railing, locked doors or adult supervision of children.`,
        `The “invisible” label means low visual bulk, not zero visibility. Cable diameter, spacing, colour and corner returns still read as a grid when you stand close. Honest selection starts with the opening’s risk (children near a railing, pets, upper-floor fall height) and only then balances clear-view finish against spacing that is hard to climb through.`,
        `Unlike decorative screens, performance depends on anchors into sound structure, correct end hardware, measured spacing and complete coverage of climbable side gaps. A neat photo of a finished balcony is not proof that every edge was closed—ask what was fixed, at what spacing, and what was excluded.`,
      ],
    },
    {
      heading: `How an invisible grill system is planned`,
      paragraphs: [
        `Planning begins with photos and approximate sizes, then on-site measurement of width, height, parapet or railing depth, wall or ceiling condition for anchors, and obstacles such as AC outdoor units, planters or irregular corners. In ${place}, society working hours and permission rules often decide when drilling can happen.`,
        `Spacing is chosen for the household brief: tighter gaps for toddler-focused openings, wider but still protective layouts where view is the priority and climbable furniture is controlled. Corner returns and side panels matter because children and pets often explore the edges first.`,
        `Material grade, fastener type and outdoor exposure (sun, rain, coastal salt where relevant in Andhra Pradesh) should be stated in the quotation. A useful written scope lists openings, spacing intent, inclusions, exclusions and basic care—not only a single teaser rate.`,
      ],
    },
    {
      heading: `When to choose invisible grills versus nets in ${place}`,
      paragraphs: [
        `Choose invisible grills when the main goal is a clearer front-facing view with a slim stainless look on balconies or windows in ${place}. Choose safety or bird nets when you need wider mesh coverage, duct wraps, pigeon entry control across irregular shapes, or a more budget-flexible plane over large spans.`,
        `Many homes combine both: cables on the living-room balcony for view, mesh on the utility balcony or duct for birds. The right mix follows the opening problem, not a single product slogan for the whole flat.`,
      ],
    },
  ];
}

function safetyNets(place: string): EncyclopediaSection[] {
  return [
    {
      heading: `What safety nets do in ${place} homes and buildings`,
      paragraphs: [
        `A safety net is a tensioned mesh barrier sized to an opening—balcony, window, terrace edge, staircase side or duct—so people, pets or birds cannot pass through the planned gap. In ${place}, households usually request nets for child safety, pet containment, pigeon control or a mix of those jobs on the same building.`,
        `Mesh size, colour, UV stabilisation and edge fixing decide whether the net matches the brief. Child-safety layouts need closer attention to climbable furniture and side gaps; bird-control layouts need full coverage of entry routes including AC ledges and duct mouths, not only the front railing plane.`,
        `Nets are supplementary protections. They do not remove the need for sound railings, careful adult supervision or building rules that limit external work. Undersized mesh, loose hooks or incomplete edges reduce protection quickly even if the centre of the net looks tight in a photo.`,
      ],
    },
    {
      heading: `Materials, fixing and Andhra Pradesh weather`,
      paragraphs: [
        `Outdoor nets in Andhra Pradesh face strong sun, seasonal rain, dust and—in coastal belts—salt-laden air. UV-aware mesh and corrosion-conscious hooks or frames are practical choices for balconies and terraces in ${place}. Indoor ducts still need firm perimeter fixing so birds cannot push past soft edges.`,
        `Installation typically covers support hooks or frames, cutting and tensioning to the measured opening, securing edges and checking coverage against the agreed scope. Access notes (floor, staircase width, society hours) should be shared early so the visit plan matches the building.`,
        `After heavy weather, a quick visual check for loose hooks, sagging spans or debris helps keep the system useful. Cleaning guidance should be simple enough that residents actually follow it.`,
      ],
    },
    {
      heading: `Choosing the right net type for ${place}`,
      paragraphs: [
        `Start with the daily risk in ${place}: toddlers near a railing, cats on a balcony, pigeons nesting on ledges, or balls leaving a terrace. Then match mesh, colour and coverage. A single “balcony net” label is too vague when bird entry and child spacing need different detailing.`,
        `If clear view matters as much as protection, compare nets with invisible grills on that specific opening. If bird return is the main complaint, inspect side gaps and ducts before buying a front-only mesh that leaves the entry path open.`,
      ],
    },
  ];
}

function sportsNets(place: string): EncyclopediaSection[] {
  return [
    {
      heading: `Sports and cricket nets explained for ${place}`,
      paragraphs: [
        `Sports nets contain practice balls so terrace, ground or academy lanes stay usable without constant retrieval or neighbour risk. In ${place}, requests range from compact home terrace cricket setups to taller school or coaching lanes where impact and daily use are heavier.`,
        `Design follows measured length, height, ball type and how often the space is used. Home practice and institutional use are not the same durability problem. Gates or entry gaps must be planned so people can enter without leaving a permanent ball escape path.`,
        `Support posts, wall fixings, joins and tension decide whether the net stays upright after repeated impact. A quotation should state the practice envelope, height and fixing method—not only “cricket net” as a catalogue name.`,
      ],
    },
    {
      heading: `Site planning and safety around practice areas`,
      paragraphs: [
        `Before installation in ${place}, confirm setbacks from edges, glass, neighbouring balconies and electrical hazards. Terrace practice needs clear notes on parapet strength and society rules. Ground setups need level footing and stable posts.`,
        `Andhra Pradesh sun and seasonal rain affect outdoor mesh and metal parts. UV-aware nets and corrosion-conscious hardware reduce early wear. Periodic checks after storms catch loose joins before a lane fails mid-practice.`,
      ],
    },
  ];
}

function clothHangers(place: string): EncyclopediaSection[] {
  return [
    {
      heading: `Cloth drying hangers for compact homes in ${place}`,
      paragraphs: [
        `Cloth drying hangers reclaim railing and floor space by moving laundry to a ceiling pulley, wall arm or balcony system sized for daily load. In ${place} apartments, utility ceilings and compact balconies are the usual sites; villas may use dedicated laundry corners.`,
        `Safe fixing is the first filter: ceiling strength, headroom and wall condition decide whether a pulley, ceiling frame or wall system is appropriate. Overloading a weak false ceiling is a failure mode no brand sticker can fix.`,
        `Selection should state typical load, number of lines, operation style and whether the space is enclosed or open to weather. Outdoor exposure in Andhra Pradesh means sun and rain on fabrics and metal parts—indoor utility rooms avoid that trade-off.`,
      ],
    },
    {
      heading: `Installation and everyday usability`,
      paragraphs: [
        `Installation in ${place} covers locating safe fixing points, mounting the system, checking pulley or arm movement, and confirming that residents can raise and lower lines without strain. Clear headroom and path of travel matter as much as the product photo.`,
        `A useful quotation lists system type, fixing method and load guidance. After handover, simple care—avoiding overload, checking fasteners periodically—keeps the hanger usable longer than ignoring the ceiling structure.`,
      ],
    },
  ];
}

function genericService(serviceName: string, place: string): EncyclopediaSection[] {
  return [
    {
      heading: `Understanding ${serviceName} in ${place}`,
      paragraphs: [
        `${serviceName} for homes and suitable buildings in ${place} should be planned around the actual opening, risk and access—not a statewide teaser rate. Measurement, material choice and written inclusions decide whether the finished job matches the brief.`,
        `Andhra Pradesh weather (strong sun, seasonal rain, dust and coastal exposure where relevant) should influence outdoor specifications. Share photos and landmark details early so visit planning and quotation stay realistic.`,
      ],
    },
  ];
}

/** Deep explainer blocks for a service, localised with a place name. */
export function getServiceEncyclopedia(
  serviceSlug: string,
  placeName: string,
  serviceName = serviceSlug.replace(/-/g, " "),
): EncyclopediaSection[] {
  const place = placeClause(placeName);
  switch (serviceSlug) {
    case "invisible-grills":
      return invisibleGrills(place);
    case "safety-nets":
    case "balcony-safety-nets":
    case "pigeon-nets":
    case "children-safety-nets":
    case "pet-safety-nets":
    case "duct-area-safety-nets":
      return safetyNets(place);
    case "sports-nets":
    case "cricket-nets":
      return sportsNets(place);
    case "cloth-drying-hangers":
      return clothHangers(place);
    default:
      return genericService(serviceName, place);
  }
}
