import type { PropertyType } from "@/types/property-type";

const TIMESTAMP = "2026-08-04T00:00:00.000Z";

export const PROPERTY_TYPES: PropertyType[] = [
  {
    id: "property-apartments",
    slug: "apartments",
    name: "Apartments",
    shortName: "Apartments",
    publicationStatus: "published",
    allowIndexing: true,
    summary:
      "Flats and apartment homes across Andhra Pradesh need compact, safe and society-friendly safety and utility solutions.",
    introduction:
      "Apartments are one of the most common property types we serve across Andhra Pradesh. From gated communities in Visakhapatnam and Vijayawada to mid-rise blocks in Guntur and Tirupati, flat owners often need balcony safety, bird protection, discreet grills and space-saving cloth drying systems. Our solutions are selected to suit apartment layouts, society rules and daily family use without blocking light or ventilation.",
    characteristics: [
      "Shared building structure with common walls and balconies",
      "Society or apartment association approval may be required",
      "Limited balcony and utility space",
      "High demand for child and pet safety at open edges",
      "Need for neat finish visible to neighbours and visitors",
    ],
    commonSafetyConcerns: [
      "Open balcony railings and low parapet height",
      "Children leaning or climbing near balcony edges",
      "Pigeon droppings and nesting in duct or balcony areas",
      "Clothes drying space without blocking the living area",
    ],
    installationConsiderations: [
      "Confirm drilling permissions with society management",
      "Measure balcony width, height and railing type before quotation",
      "Choose low-visual-impact grills or nets where aesthetics matter",
      "Plan installation during convenient hours to avoid disturbance",
    ],
    suitableServices: [
      "invisible-grills",
      "safety-nets",
      "cloth-drying-hangers",
    ],
    primaryKeywords: [
      "apartment safety grills",
      "flat balcony safety nets",
      "apartment cloth drying hanger",
    ],
    secondaryKeywords: [
      "gated community safety solutions",
      "society approved invisible grills",
      "flat bird net installation",
    ],
    customerQuestions: [
      "Will my apartment society allow invisible grills?",
      "Which safety solution is best for a flat balcony?",
      "Can cloth hangers be installed without damaging the ceiling?",
    ],
    contentReviewed: true,
    qualityScore: 88,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "property-villas",
    slug: "villas",
    name: "Villas",
    shortName: "Villas",
    publicationStatus: "published",
    allowIndexing: true,
    summary:
      "Independent villa homes benefit from custom safety grills, terrace protection and outdoor utility installations.",
    introduction:
      "Villa properties in Andhra Pradesh often have larger balconies, terraces, staircases and open boundary areas that need tailored safety planning. Whether it is a duplex villa in a layout near Rajamahendravaram or an independent villa in Visakhapatnam, we recommend solutions based on floor height, outdoor usage and family requirements. Villas allow more flexibility for sports practice nets and multi-point cloth drying setups compared with compact flats.",
    characteristics: [
      "Independent or duplex structure with private outdoor spaces",
      "Larger balconies, terraces and staircases",
      "Higher scope for custom measurements and layouts",
      "Often multiple open edges requiring safety coverage",
      "Outdoor lifestyle with sports and drying needs",
    ],
    commonSafetyConcerns: [
      "Multi-level open balconies and staircases",
      "Terrace access without proper edge protection",
      "Bird entry through open parapet sections",
      "Children playing near open outdoor areas",
    ],
    installationConsiderations: [
      "Inspect all open edges across floors during site visit",
      "Plan terrace and staircase coverage as part of one safety review",
      "Select corrosion-resistant materials for exposed outdoor areas",
      "Coordinate installation across multiple levels if required",
    ],
    suitableServices: [
      "invisible-grills",
      "safety-nets",
      "sports-nets",
      "cloth-drying-hangers",
    ],
    primaryKeywords: [
      "villa invisible grills",
      "villa balcony safety nets",
      "villa terrace safety",
    ],
    secondaryKeywords: [
      "independent villa safety solutions",
      "duplex villa child safety grills",
      "villa sports net installation",
    ],
    customerQuestions: [
      "Can invisible grills be installed on a duplex villa balcony?",
      "Do villas need separate terrace and balcony safety solutions?",
      "Which cloth hanger system suits a villa utility area?",
    ],
    contentReviewed: true,
    qualityScore: 88,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "property-independent-houses",
    slug: "independent-houses",
    name: "Independent Houses",
    shortName: "Independent Houses",
    publicationStatus: "published",
    allowIndexing: true,
    summary:
      "Standalone houses need practical safety and utility installations suited to local construction styles across towns and cities.",
    introduction:
      "Independent houses remain common across Andhra Pradesh in both urban neighbourhoods and semi-urban towns. These homes may have varied balcony designs, open terraces, window layouts and courtyard areas. We assess each house individually because construction styles differ from modern RCC homes to older properties with mixed railing types. Our focus is on reliable fixing, weather-ready materials and solutions that suit daily household use.",
    characteristics: [
      "Standalone structure with varied architectural styles",
      "Mix of balcony, window and terrace openings",
      "Often owner-managed decisions without society approval",
      "Utility areas may be rooftop, balcony or courtyard based",
      "Installation access is usually straightforward on ground or low-rise homes",
    ],
    commonSafetyConcerns: [
      "Uneven parapet heights on older balconies",
      "Open windows at child-accessible levels",
      "Bird nesting in open ducts and parapet gaps",
      "Limited covered space for drying clothes during monsoon",
    ],
    installationConsiderations: [
      "Check wall and railing strength before anchor fixing",
      "Recommend rust-resistant fittings for coastal and humid areas",
      "Plan net or grill coverage around irregular openings",
      "Confirm owner preference for visible versus discreet safety options",
    ],
    suitableServices: [
      "invisible-grills",
      "safety-nets",
      "sports-nets",
      "cloth-drying-hangers",
    ],
    primaryKeywords: [
      "independent house safety grills",
      "house balcony safety net",
      "home cloth drying hanger",
    ],
    secondaryKeywords: [
      "standalone house bird net",
      "individual house invisible grill",
      "house terrace safety net",
    ],
    customerQuestions: [
      "Can safety nets be fitted on an old house balcony?",
      "What is the best grill option for an independent house window?",
      "Do you install cloth hangers on rooftop slabs?",
    ],
    contentReviewed: true,
    qualityScore: 87,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "property-high-rise-apartments",
    slug: "high-rise-apartments",
    name: "High-Rise Apartments",
    shortName: "High-Rise",
    publicationStatus: "published",
    allowIndexing: true,
    summary:
      "High-rise flats require stronger fixing standards, wind-safe materials and safety systems suitable for upper-floor living.",
    introduction:
      "High-rise apartment living is growing in cities such as Visakhapatnam, Vijayawada and Guntur. Upper-floor balconies and windows create serious safety responsibilities for families with children, pets and elderly members. We recommend high-tensile stainless steel invisible grills and properly tensioned safety nets installed with secure anchoring suitable for taller buildings. Site confirmation is essential because fixing methods depend on railing design, wind exposure and society guidelines.",
    characteristics: [
      "Multi-storey towers with significant floor height",
      "Increased wind load on nets and external fittings",
      "Strong need for tested fixing and quality materials",
      "Society technical review may apply for external modifications",
      "High visibility of installation finish from neighbouring towers",
    ],
    commonSafetyConcerns: [
      "Child safety at high balcony levels",
      "Strong winds affecting loosely fitted nets",
      "Objects falling from upper balconies",
      "Bird nesting in exposed duct and ledge areas",
    ],
    installationConsiderations: [
      "Use high-grade anchors and stainless steel components",
      "Confirm safe working access for upper-floor installation",
      "Select invisible grills where appearance and light matter",
      "Follow society-approved fixing methods where applicable",
    ],
    suitableServices: ["invisible-grills", "safety-nets", "cloth-drying-hangers"],
    primaryKeywords: [
      "high rise balcony safety grills",
      "high rise invisible grills",
      "upper floor safety nets",
    ],
    secondaryKeywords: [
      "tower apartment child safety",
      "high rise bird net",
      "premium invisible grill for flats",
    ],
    customerQuestions: [
      "Are invisible grills safe for high-rise balconies?",
      "Which fixing method is used for upper-floor installations?",
      "Can safety nets handle wind on high floors?",
    ],
    contentReviewed: true,
    qualityScore: 90,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "property-commercial-buildings",
    slug: "commercial-buildings",
    name: "Commercial Buildings",
    shortName: "Commercial",
    publicationStatus: "published",
    allowIndexing: true,
    summary:
      "Offices, shops and commercial premises need bird control, facade protection and safe edge coverage where applicable.",
    introduction:
      "Commercial buildings across Andhra Pradesh often face bird infestation, open service ducts and safety concerns around windows, terraces and loading areas. We provide building-covering nets, duct-area nets and selective safety installations based on site requirements. Commercial projects are assessed separately because access, working hours, safety compliance and scale differ from residential flat work.",
    characteristics: [
      "Mixed-use or dedicated office and retail spaces",
      "Higher facade and duct exposure to birds",
      "Installation may require after-hours scheduling",
      "Larger surface areas for building covering nets",
      "Decision-making often involves facility or building management",
    ],
    commonSafetyConcerns: [
      "Pigeon infestation around AC ducts and parapets",
      "Bird droppings affecting entrance and signage areas",
      "Open service zones needing protective netting",
      "Staff safety near open terrace or service edges",
    ],
    installationConsiderations: [
      "Conduct site survey for facade and duct access",
      "Plan installation in phases for occupied buildings",
      "Use durable UV-resistant net material for external areas",
      "Provide maintenance guidance for long commercial spans",
    ],
    suitableServices: ["safety-nets", "invisible-grills"],
    primaryKeywords: [
      "commercial building bird net",
      "office building safety net",
      "building covering net installation",
    ],
    secondaryKeywords: [
      "duct area net for commercial building",
      "shop bird protection net",
      "facade pigeon net Andhra Pradesh",
    ],
    customerQuestions: [
      "Can you install bird nets on a commercial building facade?",
      "Do you work after office hours to avoid disruption?",
      "What net type is suitable for large building coverage?",
    ],
    contentReviewed: true,
    qualityScore: 86,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "property-schools",
    slug: "schools",
    name: "Schools",
    shortName: "Schools",
    publicationStatus: "published",
    allowIndexing: true,
    summary:
      "School campuses benefit from playground nets, balcony safety and bird control solutions suited to student safety.",
    introduction:
      "Schools and educational campuses in Andhra Pradesh require practical safety measures for balconies, corridors, sports zones and open play areas. We support schools with playground nets, sports practice enclosures and building safety nets where needed. Installations are planned around student schedules and campus safety rules, with emphasis on durable materials and secure fixing for daily institutional use.",
    characteristics: [
      "High priority on child safety and supervision zones",
      "Playgrounds and sports courts needing net enclosures",
      "Installation timing aligned with school hours",
      "Multiple stakeholders including management and facilities team",
      "Need for low-maintenance durable systems",
    ],
    commonSafetyConcerns: [
      "Open balcony or corridor edges in older school blocks",
      "Ball sports requiring controlled practice areas",
      "Bird droppings in courtyard and dining areas",
      "Unsafe open terraces or storage zones",
    ],
    installationConsiderations: [
      "Schedule work during holidays or non-peak hours where possible",
      "Use strong posts and netting for playground enclosures",
      "Confirm boundary dimensions for sports practice nets",
      "Provide clear maintenance instructions to school staff",
    ],
    suitableServices: ["safety-nets", "sports-nets", "invisible-grills"],
    primaryKeywords: [
      "school playground net",
      "school sports net installation",
      "school balcony safety net",
    ],
    secondaryKeywords: [
      "school cricket practice net",
      "campus bird net",
      "institutional safety nets Andhra Pradesh",
    ],
    customerQuestions: [
      "Can you install a cricket net in a school playground?",
      "Do you provide safety nets for school balconies?",
      "What is the process for school campus quotations?",
    ],
    contentReviewed: true,
    qualityScore: 87,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "property-sports-academies",
    slug: "sports-academies",
    name: "Sports Academies",
    shortName: "Sports Academies",
    publicationStatus: "published",
    allowIndexing: true,
    summary:
      "Sports academies and coaching centres need professional practice nets for cricket, football and multi-sport training.",
    introduction:
      "Sports academies and coaching centres across Andhra Pradesh require reliable practice nets for daily training sessions. From box cricket setups in urban academies to football and volleyball enclosures in larger grounds, we design net structures based on available space, sport type and ball impact levels. Academy projects are measured on-site to recommend post spacing, net height and entry layout suitable for regular coaching use.",
    characteristics: [
      "Daily high-impact use by trainees and coaches",
      "Need for sport-specific net height and mesh selection",
      "Indoor and outdoor academy setups",
      "Commercial training operations with uptime requirements",
      "Custom dimensions based on available ground space",
    ],
    commonSafetyConcerns: [
      "Balls leaving the practice area and causing damage",
      "Insufficient net height for cricket or football shots",
      "Weak post fixing under repeated impact",
      "Limited space requiring box cricket or multi-sport design",
    ],
    installationConsiderations: [
      "Confirm sport type and maximum shot height on site",
      "Recommend galvanised posts and heavy-duty net material",
      "Plan gate or entry points for academy operations",
      "Allow future expansion if additional courts are planned",
    ],
    suitableServices: ["sports-nets"],
    primaryKeywords: [
      "sports academy cricket net",
      "academy practice net installation",
      "box cricket net for academy",
    ],
    secondaryKeywords: [
      "football academy net enclosure",
      "coaching centre sports net",
      "multi sport academy net Andhra Pradesh",
    ],
    customerQuestions: [
      "What size cricket net is suitable for an academy?",
      "Can you build a box cricket net in limited space?",
      "Which net material lasts for daily academy training?",
    ],
    contentReviewed: true,
    qualityScore: 89,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
];

export const PROPERTY_TYPE_MAP: Record<string, PropertyType> =
  Object.fromEntries(PROPERTY_TYPES.map((item) => [item.slug, item]));

export const PROPERTY_TYPE_SLUGS = PROPERTY_TYPES.map((item) => item.slug);
