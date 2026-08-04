/**
 * Curated area fact overlays for Andhra Pradesh money pages.
 * Only genuine, non-fabricated locality character — no fake ratings or counts.
 */

export type AreaLocalFact = {
  citySlug: string;
  areaSlug: string;
  buildingStock: string;
  accessNote: string;
  exposureHint?: string;
  landmarks: string[];
  commonNeeds: string[];
};

function fact(
  citySlug: string,
  areaSlug: string,
  buildingStock: string,
  accessNote: string,
  landmarks: string[],
  commonNeeds: string[],
  exposureHint?: string,
): AreaLocalFact {
  return {
    citySlug,
    areaSlug,
    buildingStock,
    accessNote,
    landmarks,
    commonNeeds,
    ...(exposureHint ? { exposureHint } : {}),
  };
}

/** High-demand curated areas — expand as QA confirms more locality notes. */
export const AREA_LOCAL_FACTS: AreaLocalFact[] = [
  // Visakhapatnam
  fact(
    "visakhapatnam",
    "madhurawada",
    "mid- and high-rise apartment growth with gated communities along the northern corridor",
    "Visit timing should allow for NH/beach-road traffic and society entry checks at newer towers.",
    ["MVP–Madhurawada belt", "Kommadi junction approaches", "PM Palem link roads"],
    ["balcony child safety", "pigeon nets on utility ledges", "clear-view invisible grills"],
    "Newer towers often have larger view balconies that need neat side returns and UV-aware materials.",
  ),
  fact(
    "visakhapatnam",
    "mvp-colony",
    "established family apartment blocks and mixed residential streets",
    "Parking and lift access vary by society—share gate and floor details when booking measurement.",
    ["Sector layouts", "beach-road approach from MVP", "nearby Seethammadhara"],
    ["children safety nets", "balcony invisible grills", "cloth drying hangers"],
  ),
  fact(
    "visakhapatnam",
    "rushikonda",
    "view-oriented apartments and hillside residential pockets near the coast",
    "Steep approaches and coastal breeze mean access and hardware grade both need early notes.",
    ["Rushikonda beach approach", "IT corridor link", "Yendada side"],
    ["coastal-grade invisible grills", "bird nets on exposed ledges"],
    "Sea breeze and salt-heavy air favour stronger stainless and fastener choices.",
  ),
  fact(
    "visakhapatnam",
    "gajuwaka",
    "dense apartment and independent-house mix near industrial and NH corridors",
    "Dusty approaches and busy junction traffic affect visit slots—landmark PIN helps routing.",
    ["NH16 approaches", "Sheela Nagar side", "Kurmannapalem link"],
    ["pigeon control", "balcony safety nets", "utility balcony coverage"],
    "Industrial-side dust and sun exposure make tension checks and UV-stable mesh practical.",
  ),
  fact(
    "visakhapatnam",
    "seethammadhara",
    "central family residential flats with active utility balconies",
    "Older and newer buildings sit close together—confirm drilling permissions per society.",
    ["MVP Colony side", "Akkayyapalem link", "central Vizag approach"],
    ["pet safety nets", "window nets", "ceiling cloth hangers"],
  ),
  fact(
    "visakhapatnam",
    "yendada",
    "growth apartments between beach and northern IT residential belts",
    "Share society name early; several towers use controlled entry and limited visitor parking.",
    ["Madhurawada corridor", "Rushikonda side", "PM Palem"],
    ["view balcony invisible grills", "child safety", "bird nets"],
  ),
  fact(
    "visakhapatnam",
    "beach-road",
    "premium and mid-rise homes with sea-facing or breeze-heavy openings",
    "Coastal exposure and visitor parking constraints should be mentioned in the enquiry.",
    ["RK Beach stretch", "Siripuram side", "coastal apartments"],
    ["SS invisible grills", "anti-bird nets", "terrace edge protection"],
    "Salt air and strong sun argue for outdoor-grade stainless and UV-stabilised nets.",
  ),
  fact(
    "visakhapatnam",
    "pm-palem",
    "apartment clusters in the northern residential expansion belt",
    "Gate security and tower parking rules vary—send landmark and block details with photos.",
    ["Madhurawada", "Yendada", "Kommadi"],
    ["apartment safety nets", "invisible grills", "duct bird nets"],
  ),
  fact(
    "visakhapatnam",
    "kommadi",
    "newer residential pockets linked to Madhurawada growth",
    "Many societies are still settling access routines—confirm working hours before installation day.",
    ["Madhurawada main corridor", "PM Palem", "northern Vizag"],
    ["balcony nets", "invisible grills", "cloth hangers"],
  ),
  fact(
    "visakhapatnam",
    "pendurthi",
    "mixed residential and transit-side housing on the western approaches",
    "Distance from central Vizag affects slot planning; PIN and landmark improve routing.",
    ["Pendurthi junction approaches", "western Vizag belt"],
    ["balcony safety nets", "pigeon nets", "cloth drying hangers"],
  ),

  // Vijayawada
  fact(
    "vijayawada",
    "benz-circle",
    "busy central apartment and mixed-use belt around a major junction",
    "Traffic peaks affect visit timing—prefer landmark-based meeting points near the society gate.",
    ["Benz Circle junction", "MG Road side", "Patamata approach"],
    ["balcony child safety", "invisible grills", "utility bird nets"],
    "Hot, exposed top-floor balconies need careful mesh colour and tension planning.",
  ),
  fact(
    "vijayawada",
    "patamata",
    "dense residential apartments with active drying and utility balconies",
    "Society working-hour rules are common—note preferred slots in the enquiry.",
    ["Benz Circle", "Auto Nagar side", "canal-adjacent pockets"],
    ["pigeon safety nets", "cloth hangers", "window invisible grills"],
  ),
  fact(
    "vijayawada",
    "kanuru",
    "family housing and apartment growth on the eastern residential belt",
    "Share society or street landmark; some pockets sit off the main carriageways.",
    ["Poranki side", "Penamaluru link", "eastern Vijayawada"],
    ["children safety nets", "apartment invisible grills", "terrace nets"],
  ),
  fact(
    "vijayawada",
    "poranki",
    "expanding residential localities with mid-rise flats and independent houses",
    "Access roads vary—send Google-pin style landmark notes with opening photos.",
    ["Kanuru", "Penamaluru", "Ring Road approaches"],
    ["balcony safety nets", "pet nets", "ceiling cloth hangers"],
  ),
  fact(
    "vijayawada",
    "currency-nagar",
    "apartment communities along growth corridors and ring-road links",
    "Controlled-entry societies need gate passes arranged before technician arrival.",
    ["Ring Road belt", "Patamata side", "central Vijayawada link"],
    ["invisible grills", "bird nets", "duct coverage"],
  ),
  fact(
    "vijayawada",
    "labbipet",
    "established central residential streets and apartment blocks",
    "Older buildings may need careful anchor checks—photos of walls help early guidance.",
    ["Governorpet side", "MG Road approach", "central city"],
    ["window invisible grills", "balcony nets", "staircase protection"],
  ),
  fact(
    "vijayawada",
    "gunadala",
    "mixed residential belt with flats and terrace-home pockets",
    "Hill-side and slope approaches can affect material carrying—mention floor and lift status.",
    ["Gunadala temple side", "eastern city links"],
    ["terrace safety nets", "child balcony safety", "sports practice nets"],
  ),

  // Guntur
  fact(
    "guntur",
    "brodipet",
    "central commercial-residential mix with older and renovated homes",
    "Street parking is tight in peak hours—share a clear gate or landmark for the visit.",
    ["Arundelpet side", "central Guntur"],
    ["balcony safety nets", "pigeon control", "cloth hangers"],
    "Strong inland summer heat on exposed balconies favours UV-stable mesh and firm tension.",
  ),
  fact(
    "guntur",
    "arundelpet",
    "busy central residential and shop-house fabric",
    "Confirm stair or lift access for material movement before installation day.",
    ["Brodipet", "Lakshmipuram approach"],
    ["window nets", "invisible grills", "bird spikes on ledges"],
  ),
  fact(
    "guntur",
    "lakshmipuram",
    "family residential colonies with apartment and independent-house mix",
    "Society and street homes both appear—state property type in the enquiry.",
    ["Pattabhipuram side", "Vidya Nagar link"],
    ["children safety nets", "pet balcony safety", "ceiling hangers"],
  ),
  fact(
    "guntur",
    "mangalagiri",
    "growth town-residential belt linked to the Amaravati / Guntur corridor",
    "Distance from central Guntur affects scheduling—share PIN and preferred half-day.",
    ["Amaravathi Road approaches", "Tadepalli side"],
    ["apartment safety nets", "invisible grills", "terrace cricket nets"],
  ),
  fact(
    "guntur",
    "gorantla",
    "expanding residential pockets on the city fringe",
    "Newer layouts may have incomplete internal roads—landmark photos help routing.",
    ["Nallapadu side", "outer Guntur"],
    ["villa safety nets", "balcony invisible grills", "cloth hangers"],
  ),

  // Tirupati
  fact(
    "tirupati",
    "tiruchanur",
    "pilgrim-route residential and apartment pockets south of the temple city core",
    "Festival and weekend traffic can delay visits—prefer mid-week measurement slots when possible.",
    ["Tiruchanur Road", "temple-town approaches"],
    ["balcony child safety", "pigeon nets", "invisible grills"],
  ),
  fact(
    "tirupati",
    "renigunta-road",
    "mixed residential growth along the Renigunta approach corridor",
    "Highway-side dust and access turns should be noted for technician routing.",
    ["Renigunta", "airport-side approaches", "Tirupati city link"],
    ["apartment safety nets", "bird nets", "cloth drying hangers"],
  ),
  fact(
    "tirupati",
    "alipiri",
    "residential belt near the Alipiri footpath approach to the hills",
    "Slope and visitor traffic vary by season—share exact society or street cues.",
    ["Alipiri Road", "Kapila Theertham side"],
    ["window invisible grills", "monkey-aware netting discussions", "balcony nets"],
    "Hill-edge exposure and wind paths can affect tension and fixing choices.",
  ),
  fact(
    "tirupati",
    "mr-palli",
    "established residential colonies with family apartments",
    "Confirm society drilling rules; many flats share utility balconies used for drying.",
    ["RC Road side", "central Tirupati residential belt"],
    ["cloth hangers", "children safety nets", "pigeon control"],
  ),
  fact(
    "tirupati",
    "chandragiri",
    "town-residential pocket linked to the wider Tirupati belt",
    "Treat as a linked service locality—send landmark and PIN with photos.",
    ["Chandragiri fort approach", "Tirupati–Chandragiri road"],
    ["villa nets", "terrace safety", "invisible grills"],
  ),

  // Rajahmundry
  fact(
    "rajamahendravaram",
    "danavaipeta",
    "central residential apartments and family streets",
    "River-city humidity and busy internal roads mean clear landmarks help visit planning.",
    ["AVA Road side", "central Rajahmundry"],
    ["balcony safety nets", "invisible grills", "bird nets"],
  ),
  fact(
    "rajamahendravaram",
    "morampudi",
    "growth residential belt with newer apartment clusters",
    "Share society name and block; fringe roads can confuse first-time routing.",
    ["Lalacheruvu side", "eastern city expansion"],
    ["apartment invisible grills", "children nets", "cloth hangers"],
  ),
  fact(
    "rajamahendravaram",
    "bommuru",
    "mixed residential localities on the city approaches",
    "Confirm whether the property is apartment or independent house before quoting access time.",
    ["Dowleswaram side", "Godavari-linked approaches"],
    ["terrace nets", "pigeon control", "safety nets"],
  ),
  fact(
    "rajamahendravaram",
    "lalacheruvu",
    "expanding apartment and housing pockets",
    "Controlled societies need advance gate intimation for measurement teams.",
    ["Morampudi", "eastern Rajahmundry"],
    ["balcony child safety", "SS invisible grills", "utility bird nets"],
  ),

  // Kakinada
  fact(
    "kakinada",
    "bhanugudi-junction",
    "central junction residential and mixed-use fabric",
    "Peak traffic around the junction affects ETA—prefer landmark + alternate pin.",
    ["Sarpavaram side", "central Kakinada"],
    ["balcony safety nets", "invisible grills", "pigeon nets"],
    "Coastal humidity in the Kakinada belt favours corrosion-conscious hardware.",
  ),
  fact(
    "kakinada",
    "sarpavaram",
    "residential growth with apartments and independent houses",
    "Share society or cross-road details; some pockets sit off the main spine.",
    ["Bhanugudi Junction", "Ramanayyapeta link"],
    ["children safety nets", "cloth hangers", "bird protection nets"],
  ),
  fact(
    "kakinada",
    "ramanayyapeta",
    "established residential localities with utility balconies in daily use",
    "Photos of AC ledges help when pigeon return is the main complaint.",
    ["Jagannaickpur side", "central-east Kakinada"],
    ["anti-bird nets", "pet safety nets", "window nets"],
  ),
  fact(
    "kakinada",
    "jagannaickpur",
    "coastal-city residential streets and apartment blocks",
    "Salt-air exposure should be considered for stainless and fastener grade.",
    ["port-side approaches", "central Kakinada residential"],
    ["SS invisible grills", "balcony nets", "terrace edge nets"],
  ),

  // Nellore
  fact(
    "nellore",
    "magunta-layout",
    "planned residential layout with family houses and low- to mid-rise flats",
    "Internal layout roads are usually clearer with a plot or landmark reference.",
    ["Mini Bypass links", "central Nellore residential"],
    ["balcony safety nets", "invisible grills", "cloth hangers"],
  ),
  fact(
    "nellore",
    "vedayapalem",
    "dense residential belt with active apartment living",
    "Society permissions for external drilling should be checked early.",
    ["Stonehousepet side", "Ramalingapuram link"],
    ["pigeon safety nets", "children nets", "ceiling cloth hangers"],
  ),
  fact(
    "nellore",
    "stonehousepet",
    "central residential and mixed streets",
    "Parking near older streets can be tight—arrange gate access before the visit.",
    ["Dargamitta side", "central Nellore"],
    ["window invisible grills", "bird spikes", "balcony nets"],
  ),
  fact(
    "nellore",
    "balaji-nagar",
    "family residential colonies with drying and utility balcony use",
    "State whether the opening is kitchen utility or living balcony—mesh choice differs.",
    ["Nawabpet side", "layout residential belt"],
    ["utility balcony nets", "pet safety", "pulley cloth hangers"],
  ),

  // Kurnool
  fact(
    "kurnool",
    "a-camp",
    "established camp-side residential fabric with apartments and houses",
    "Hot inland summers make UV-stable materials and firm tension practical for exposed openings.",
    ["B Camp side", "central Kurnool"],
    ["balcony safety nets", "invisible grills", "terrace nets"],
  ),
  fact(
    "kurnool",
    "b-camp",
    "busy residential camp locality with mixed building ages",
    "Share floor and lift notes; older blocks need careful anchor assessment.",
    ["A Camp", "C Camp approaches"],
    ["children safety nets", "pigeon control", "cloth hangers"],
  ),
  fact(
    "kurnool",
    "kallur",
    "expanding residential pockets on the city approaches",
    "Fringe routing benefits from a clear PIN and society name with photos.",
    ["Nandyal Check Post side", "outer Kurnool"],
    ["apartment nets", "villa invisible grills", "bird nets"],
  ),
  fact(
    "kurnool",
    "ashok-nagar",
    "central residential colony living with utility balconies",
    "Confirm society working hours before booking installation.",
    ["camp localities", "central Kurnool residential"],
    ["window nets", "pet balcony safety", "ceiling hangers"],
  ),

  // Anantapur
  fact(
    "anantapur",
    "ram-nagar",
    "family residential colony fabric with houses and low-rise flats",
    "Dry inland heat and dust argue for UV-aware mesh and periodic cleaning notes.",
    ["Srinagar Colony side", "central Anantapur"],
    ["balcony safety nets", "invisible grills", "cloth hangers"],
  ),
  fact(
    "anantapur",
    "srinagar-colony",
    "established residential colony with active balcony use",
    "Share cross-streets or landmark temples/shops for easier first visit.",
    ["Ram Nagar", "Housing Board Colony side"],
    ["children safety nets", "pigeon nets", "window invisible grills"],
  ),
  fact(
    "anantapur",
    "housing-board-colony",
    "planned housing-board residential stock with repeating balcony patterns",
    "Similar openings across blocks still need individual measurement for accurate quotes.",
    ["Tapovanam side", "central residential Anantapur"],
    ["apartment safety nets", "cloth drying hangers", "bird protection nets"],
  ),
  fact(
    "anantapur",
    "rudrampeta",
    "mixed residential growth on the city approaches",
    "Distance from the core affects slot planning—prefer a half-day window in the enquiry.",
    ["Gooty Road approaches", "outer Anantapur"],
    ["villa nets", "terrace safety", "invisible grills"],
  ),
];

const AREA_FACT_MAP: Record<string, AreaLocalFact> = Object.fromEntries(
  AREA_LOCAL_FACTS.map((f) => [`${f.citySlug}/${f.areaSlug}`, f]),
);

export function getAreaLocalFact(
  citySlug: string,
  areaSlug: string,
): AreaLocalFact | null {
  return AREA_FACT_MAP[`${citySlug}/${areaSlug}`] ?? null;
}

export function listAreaFactsForCity(citySlug: string): AreaLocalFact[] {
  return AREA_LOCAL_FACTS.filter((f) => f.citySlug === citySlug);
}
