/**
 * City-unique local profiles for high-ROI money pages across Andhra Pradesh.
 * Differentiates city×service and keyword×geo copy beyond shared templates.
 */

export type CityLocalProfile = {
  citySlug: string;
  climateLead: string;
  weatherNotes: string;
  residentialCorridors: string[];
  societyExamples: string[];
  localSignals: Array<{ title: string; detail: string }>;
  introAddon: string;
  photoEstimateHint: string;
};

export const CITY_LOCAL_PROFILES: Record<string, CityLocalProfile> = {
  visakhapatnam: {
    citySlug: "visakhapatnam",
    climateLead:
      "Coastal humidity, sea breeze and salt-heavy air on exposed balconies shape material and fastener choices in Visakhapatnam.",
    weatherNotes:
      "Visakhapatnam installations should plan for coastal chloride, hill-to-sea wind paths and long sun exposure on north-growth towers. Sea-facing or breeze-heavy balconies around Beach Road, Rushikonda and Yendada usually need stronger stainless and hardware choices than inland Gajuwaka or Pendurthi flats. UV-stabilised nets age better under prolonged sun; compare the complete cable, track and fastener specification rather than a teaser rate alone. After monsoon and dusty spells, check hooks, tension and corner returns.",
    residentialCorridors: [
      "Madhurawada, PM Palem and Yendada growth corridors",
      "MVP Colony and Seethammadhara family apartment belts",
      "Rushikonda and Beach Road view-oriented homes",
      "Gajuwaka and industrial-side residential pockets",
      "Siripuram, Dwaraka Nagar and central apartment zones",
    ],
    societyExamples: [
      "MVV City",
      "Panorama Hills",
      "Vaisakhi Skypark",
      "Lansum Oxygen Towers",
      "MK One",
    ],
    localSignals: [
      {
        title: "Sea breeze",
        detail: "Coastal wind and humidity shape balcony briefs and hardware grade.",
      },
      {
        title: "View balconies",
        detail: "Many homes value openness and daylight as much as coverage.",
      },
      {
        title: "Ledges and ducts",
        detail: "Bird trouble often starts in service spaces before the railing.",
      },
      {
        title: "Family flats",
        detail: "Balconies still work as live spaces for drying, plants and children.",
      },
    ],
    introAddon:
      "In Visakhapatnam, start with the opening problem—fall risk, pigeon entry, clear-view finish or utility use—then confirm locality details in Madhurawada, MVP Colony, Rushikonda, Seethammadhara or Gajuwaka that affect access and coastal exposure. Society clusters such as MVV City and Panorama Hills often need neat side returns and permission-aware drilling plans.",
    photoEstimateHint:
      "Send Visakhapatnam locality, opening photos and whether the priority is children, pets, pigeons or clear view.",
  },
  vijayawada: {
    citySlug: "vijayawada",
    climateLead:
      "Strong summer heat, terrace exposure and busy utility balconies change how mesh, colour and fixing are judged in Vijayawada.",
    weatherNotes:
      "Vijayawada jobs should plan for high summer heat, river humidity where relevant, open terrace edges and dust-heavy traffic corridors. Hot top-floor balconies around Benz Circle, Patamata, Kanuru and Poranki show loose tension and faded mesh faster if edge finishing is weak. Utility balconies used for drying and plants need breathable layouts that still close bird routes at AC ledges and side gaps. Periodic cleaning and visual checks after heavy weather help catch loose hooks early.",
    residentialCorridors: [
      "Benz Circle, Patamata and Labbipet apartment zones",
      "Kanuru and Poranki family housing belts",
      "Currency Nagar and Ring Road growth apartments",
      "MG Road and central mixed-use stretches",
      "Bhavanipuram and terrace-home pockets",
    ],
    societyExamples: [
      "VRR Krishnam",
      "Apace Hill View County",
      "Invicon Navah",
      "Vertex Siris Signa",
      "Hemadurga Jewel County",
    ],
    localSignals: [
      {
        title: "Tropical heat",
        detail: "Hot exposed balconies and terraces change mesh and fixing choices.",
      },
      {
        title: "Mixed blocks",
        detail: "Apartments and terrace-led homes both drive demand.",
      },
      {
        title: "Utility balconies",
        detail: "Bird control and hygiene usually start in working balcony zones.",
      },
      {
        title: "Family safety",
        detail: "Balconies stay active for drying, plants and children.",
      },
    ],
    introAddon:
      "In Vijayawada, households often call when pigeons return via an AC ledge, the balcony feels risky for children, or a terrace needs a safer perimeter without losing airflow. Locality details in Benz Circle, Currency Nagar, Kanuru, Poranki and Gunadala affect visit timing and access more than a generic city rate.",
    photoEstimateHint:
      "Send Vijayawada area name, opening photos and whether the issue is birds, child safety, pets or clear view.",
  },
  guntur: {
    citySlug: "guntur",
    climateLead:
      "Inland summer heat, dusty corridors and busy utility balconies shape material and tension choices in Guntur.",
    weatherNotes:
      "Guntur installations should plan for strong sun on top floors, dusty monsoon spells and everyday laundry use on kitchen balconies. Exposed openings around Brodipet, Arundelpet, Lakshmipuram and Mangalagiri-linked belts fade cheaper mesh faster if UV grade and edge tension are weak. Bird return often starts at AC ledges and side gaps rather than the full railing face. Periodic cleaning after dusty winds keeps hooks and mesh readable for inspection.",
    residentialCorridors: [
      "Brodipet and Arundelpet central residential streets",
      "Lakshmipuram, Pattabhipuram and Vidya Nagar family belts",
      "Gorantla and Nallapadu fringe housing",
      "Mangalagiri and Tadepalli corridor growth",
      "Amaravathi Road and Inner Ring Road apartment pockets",
    ],
    societyExamples: [
      "Central Brodipet apartments",
      "Lakshmipuram family blocks",
      "Mangalagiri corridor residencies",
      "Gorantla layout homes",
      "SVN Colony flats",
    ],
    localSignals: [
      {
        title: "Inland heat",
        detail: "Hot top-floor balconies need UV-aware mesh and firm tension.",
      },
      {
        title: "Utility living",
        detail: "Kitchen balconies drive pigeon and drying-related enquiries.",
      },
      {
        title: "Corridor growth",
        detail: "Mangalagiri-linked homes need clear PIN-based visit planning.",
      },
      {
        title: "Family flats",
        detail: "Child and pet safety briefs are common in mid-rise blocks.",
      },
    ],
    introAddon:
      "In Guntur, start with whether the opening is a living balcony, kitchen utility, terrace edge or window. Locality details in Brodipet, Arundelpet, Lakshmipuram, Gorantla or Mangalagiri change access and traffic timing more than a single city teaser rate.",
    photoEstimateHint:
      "Send Guntur area name, opening photos and whether birds, children, pets or drying space lead the brief.",
  },
  tirupati: {
    citySlug: "tirupati",
    climateLead:
      "Temple-town traffic patterns, hill-edge wind paths and mixed apartment stock shape installation planning in Tirupati.",
    weatherNotes:
      "Tirupati jobs should allow for weekend and festival traffic near pilgrim corridors, plus sun and occasional hill breeze on elevated openings. Residential belts around Tiruchanur, Renigunta Road, Alipiri, MR Palli and Chandragiri need landmark-led visit routing. Utility balconies still collect pigeons at AC ledges; view-facing flats often prefer slim invisible grill finishes. Schedule measurement with society rules and local peak hours in mind.",
    residentialCorridors: [
      "Tiruchanur and southern residential approaches",
      "Renigunta Road and airport-linked growth",
      "Alipiri and Kapila Theertham side homes",
      "MR Palli, RC Road and Mangalam family belts",
      "Chandragiri and Renigunta linked localities",
    ],
    societyExamples: [
      "Tiruchanur Road apartments",
      "MR Palli family blocks",
      "Renigunta Road residencies",
      "Alipiri approach homes",
      "Padmavathi Puram flats",
    ],
    localSignals: [
      {
        title: "Pilgrim traffic",
        detail: "Festival peaks change visit ETA near temple approaches.",
      },
      {
        title: "Hill edge",
        detail: "Some openings see stronger breeze and need firmer tension.",
      },
      {
        title: "Family colonies",
        detail: "Child safety and drying utility briefs are frequent.",
      },
      {
        title: "Linked towns",
        detail: "Chandragiri and Renigunta enquiries need clear PIN notes.",
      },
    ],
    introAddon:
      "In Tirupati, confirm whether the property sits on Tiruchanur Road, Renigunta Road, Alipiri, MR Palli or a linked pocket like Chandragiri. Access and society permissions matter as much as mesh or cable choice for balcony safety and bird control.",
    photoEstimateHint:
      "Send Tirupati locality, landmark and opening photos noting children, pigeons or clear-view preference.",
  },
  rajamahendravaram: {
    citySlug: "rajamahendravaram",
    climateLead:
      "Godavari-side humidity, warm summers and mixed apartment growth shape outdoor hardware choices in Rajamahendravaram.",
    weatherNotes:
      "Rajahmundry-area installations should plan for humid spells, sun on terrace edges and dusty approach roads in growth belts. Localities such as Danavaipeta, Morampudi, Lalacheruvu, Bommuru and Dowleswaram need landmark-based routing. Utility balconies used for drying attract pigeons at ledges and side gaps. UV-stabilised nets and corrosion-conscious fasteners are practical; check tension after heavy rain or windy days.",
    residentialCorridors: [
      "Danavaipeta and AVA Road central residential",
      "Morampudi and Lalacheruvu growth apartments",
      "Bommuru and Dowleswaram approach homes",
      "Prakash Nagar, Innispeta and Aryapuram pockets",
      "Korukonda Road and Rajanagaram linked belts",
    ],
    societyExamples: [
      "Danavaipeta apartments",
      "Morampudi growth residencies",
      "Lalacheruvu societies",
      "AVA Road flats",
      "Alcot Gardens homes",
    ],
    localSignals: [
      {
        title: "River humidity",
        detail: "Humid spells favour outdoor-grade fasteners and mesh.",
      },
      {
        title: "Growth belts",
        detail: "Morampudi and Lalacheruvu need clear society names for visits.",
      },
      {
        title: "Utility balconies",
        detail: "Bird and drying briefs dominate kitchen-side openings.",
      },
      {
        title: "Family safety",
        detail: "Child balcony protection is a common apartment request.",
      },
    ],
    introAddon:
      "In Rajamahendravaram (Rajahmundry), start with the opening problem and your locality—Danavaipeta, Morampudi, Lalacheruvu or Bommuru—so measurement and access can be planned without assuming a permanent neighbourhood branch.",
    photoEstimateHint:
      "Send Rajahmundry-area locality, opening photos and whether birds, children or clear view lead the need.",
  },
  kakinada: {
    citySlug: "kakinada",
    climateLead:
      "Coastal humidity, port-side air and warm sun exposure shape stainless and mesh choices in Kakinada.",
    weatherNotes:
      "Kakinada installations should respect coastal moisture, salty air near port-influenced belts and strong sun on open balconies. Residential pockets around Bhanugudi Junction, Sarpavaram, Ramanayyapeta, Jagannaickpur and Madhavapatnam benefit from corrosion-conscious hardware. Bird control often starts at AC ledges on utility balconies. After humid or rainy spells, inspect hooks, cable ends and corner returns.",
    residentialCorridors: [
      "Bhanugudi Junction and central residential mix",
      "Sarpavaram and Ramanayyapeta family belts",
      "Jagannaickpur and coastal-city streets",
      "Madhavapatnam and Indrapalem growth pockets",
      "Samalkot Road and Pithapuram Road approaches",
    ],
    societyExamples: [
      "Bhanugudi-area apartments",
      "Sarpavaram residencies",
      "Ramanayyapeta family blocks",
      "Jagannaickpur homes",
      "Ashok Nagar flats",
    ],
    localSignals: [
      {
        title: "Coastal air",
        detail: "Salt-aware stainless and fasteners matter on exposed openings.",
      },
      {
        title: "Junction living",
        detail: "Central belts need landmark-led visit timing.",
      },
      {
        title: "Utility ledges",
        detail: "Pigeon return often starts beside AC outdoor units.",
      },
      {
        title: "Family flats",
        detail: "Child safety and drying hangers are frequent apartment needs.",
      },
    ],
    introAddon:
      "In Kakinada, match the product to the opening first, then confirm locality details in Bhanugudi Junction, Sarpavaram, Ramanayyapeta or Jagannaickpur that affect coastal exposure and access.",
    photoEstimateHint:
      "Send Kakinada area name, opening photos and whether coastal exposure, birds or child safety leads the brief.",
  },
  nellore: {
    citySlug: "nellore",
    climateLead:
      "Coastal-adjacent humidity inland heat spells and layout-style residential stock shape balcony work in Nellore.",
    weatherNotes:
      "Nellore jobs should plan for warm sun, seasonal humidity and dusty dry periods that stress cheap mesh colour and loose hooks. Magunta Layout, Vedayapalem, Stonehousepet, Balaji Nagar and Mini Bypass-linked homes often use utility balconies for drying—bird nets must close ledges without blocking daily use. UV-stabilised specifications and clear tensioning help longevity. Share layout landmark or plot cues for smoother first visits.",
    residentialCorridors: [
      "Magunta Layout and planned residential pockets",
      "Vedayapalem and Stonehousepet apartment belts",
      "Balaji Nagar and Nawabpet family colonies",
      "Mini Bypass, Podalakur Road and Muthukur Road approaches",
      "Kovur and Buchireddypalem linked localities",
    ],
    societyExamples: [
      "Magunta Layout homes",
      "Vedayapalem apartments",
      "Balaji Nagar residencies",
      "Stonehousepet flats",
      "Haranathapuram houses",
    ],
    localSignals: [
      {
        title: "Layout living",
        detail: "Plot and landmark cues speed Magunta-style visits.",
      },
      {
        title: "Utility balconies",
        detail: "Drying plus pigeon control is a common dual brief.",
      },
      {
        title: "Warm sun",
        detail: "UV-aware mesh helps on exposed top floors.",
      },
      {
        title: "Family colonies",
        detail: "Child and pet safety requests are frequent.",
      },
    ],
    introAddon:
      "In Nellore, clarify whether the property is in Magunta Layout, Vedayapalem, Stonehousepet or Balaji Nagar, and whether the opening is a living balcony or kitchen utility—those details change mesh choice and visit routing.",
    photoEstimateHint:
      "Send Nellore locality, layout landmark and opening photos with your main risk priority.",
  },
  kurnool: {
    citySlug: "kurnool",
    climateLead:
      "Hot inland summers, dusty spells and camp-side residential fabric shape outdoor net and grill choices in Kurnool.",
    weatherNotes:
      "Kurnool installations should plan for intense summer heat on exposed balconies, dusty winds and firm tension needs so mesh does not sag early. A Camp, B Camp, C Camp, Ashok Nagar and Kallur pockets mix older and newer stock—anchor surfaces need checking. Terrace edges and utility balconies are common enquiry types. UV-stabilised nets and corrosion-conscious metal components are practical; inspect after severe heat or dust storms.",
    residentialCorridors: [
      "A Camp, B Camp and C Camp residential fabric",
      "Ashok Nagar and Venkataramana Colony pockets",
      "Kallur and Nandyal Check Post approaches",
      "Joharapuram Road and Old Town mixed streets",
      "Adoni and Yemmiganur linked service localities",
    ],
    societyExamples: [
      "A Camp apartments",
      "B Camp family blocks",
      "Ashok Nagar residencies",
      "Kallur growth homes",
      "Venkataramana Colony flats",
    ],
    localSignals: [
      {
        title: "Inland heat",
        detail: "Top-floor openings need UV-stable materials and tension care.",
      },
      {
        title: "Camp localities",
        detail: "Clear camp and street cues help first-time routing.",
      },
      {
        title: "Mixed building age",
        detail: "Older walls need careful anchor assessment.",
      },
      {
        title: "Terrace use",
        detail: "Edge protection and practice-net briefs appear in enquiries.",
      },
    ],
    introAddon:
      "In Kurnool, share whether you are in A Camp, B Camp, Ashok Nagar or Kallur and whether the job is balcony safety, pigeon control or terrace coverage—heat and access change the practical specification.",
    photoEstimateHint:
      "Send Kurnool camp or colony name, opening photos and the main safety or bird problem.",
  },
  anantapur: {
    citySlug: "anantapur",
    climateLead:
      "Dry inland heat, dusty winds and colony-style housing shape balcony material choices in Anantapur.",
    weatherNotes:
      "Anantapur installations should plan for strong sun, dry dust and occasional wind that loosens weak edge fixing. Ram Nagar, Srinagar Colony, Housing Board Colony, Rudrampeta and Tapovanam homes often need UV-aware mesh and simple maintenance habits. Bird issues still concentrate on ledges and utility corners. Linked towns such as Guntakal or Tadipatri should include PIN and landmark notes for scheduling.",
    residentialCorridors: [
      "Ram Nagar and Srinagar Colony family belts",
      "Housing Board Colony and Tapovanam pockets",
      "Rudrampeta and Kakkalapalli approaches",
      "Sapthagiri Circle and Subash Road mixed streets",
      "Guntakal, Tadipatri and Kalyandurg linked localities",
    ],
    societyExamples: [
      "Ram Nagar residencies",
      "Srinagar Colony homes",
      "Housing Board Colony blocks",
      "Tapovanam flats",
      "Rudrampeta growth houses",
    ],
    localSignals: [
      {
        title: "Dry heat",
        detail: "UV-stable mesh and firm tension matter on exposed balconies.",
      },
      {
        title: "Colony fabric",
        detail: "Cross-street landmarks speed residential visits.",
      },
      {
        title: "Dust",
        detail: "Periodic cleaning keeps hooks and mesh inspectable.",
      },
      {
        title: "Linked towns",
        detail: "Outstation enquiries need PIN-led scheduling.",
      },
    ],
    introAddon:
      "In Anantapur, start with the opening problem and your colony—Ram Nagar, Srinagar Colony, Housing Board Colony or Rudrampeta—so measurement can respect dry-heat exposure and local access.",
    photoEstimateHint:
      "Send Anantapur colony or area name, opening photos and whether children, birds or drying space is the priority.",
  },
};

export function getCityLocalProfile(citySlug: string): CityLocalProfile | null {
  return CITY_LOCAL_PROFILES[citySlug] ?? null;
}

/** Money-page hubs with unique city profiles — index-ready across AP. */
export const P0_MONEY_CITY_SLUGS = [
  "visakhapatnam",
  "vijayawada",
  "guntur",
  "tirupati",
  "rajamahendravaram",
  "kakinada",
  "nellore",
  "kurnool",
  "anantapur",
] as const;

export const P0_AREA_LIMIT = 20;
