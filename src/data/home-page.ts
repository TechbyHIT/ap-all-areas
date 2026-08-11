/**
 * Homepage presentation data — honest values only.
 * Do not invent years, ratings, project counts, or reviews.
 */

import { ROUTES } from "@/config/routes";

export const HOME_TRUST_STATS = [
  {
    value: "Photo-first",
    label: "Estimate start",
    detail: "Share opening photos for early guidance",
  },
  {
    value: "Measured",
    label: "Final quotation",
    detail: "Price confirmed after site measurement",
  },
  {
    value: "12+",
    label: "Service locations",
    detail: "Major Andhra Pradesh cities covered",
  },
  {
    value: "Clear scope",
    label: "Written inclusions",
    detail: "Material, fixing and finish itemised",
  },
] as const;

export type HomeServiceCard = {
  name: string;
  href: string;
  quoteHref: string;
  image: string;
  alt: string;
  summary: string;
  benefits: readonly string[];
  featured?: boolean;
};

/**
 * Main Services grid — all 24 Aug-2026 installation photos as content cards
 * (same card pattern as Children Safety Nets: image + summary + benefits + CTAs).
 */
export const HOME_BENTO_SERVICES: HomeServiceCard[] = [
  {
    name: "Night Balcony Safety Nets",
    href: ROUTES.service("safety-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/night-balcony-safety-net.jpg",
    alt: "Night balcony safety net installation",
    summary:
      "Evening balcony mesh that keeps openings protected after dark while preserving usable seating and plant space.",
    benefits: ["Night-ready mesh", "Secure edge fixing", "Family openings"],
    featured: true,
  },
  {
    name: "Cloth Drying Hangers",
    href: ROUTES.service("cloth-drying-hangers"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/cloth-drying-hanger-ceiling.jpg",
    alt: "Ceiling cloth drying hanger on balcony",
    summary:
      "Ceiling drying systems that free railing space in compact apartments—load-aware fixing after site check.",
    benefits: ["Ceiling systems", "Load-aware fix", "Compact flats"],
  },
  {
    name: "Atrium Invisible Grills",
    href: ROUTES.service("invisible-grills"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/atrium-invisible-grill-circle.jpg",
    alt: "Circular atrium invisible grill cables",
    summary:
      "Circular and atrium cable layouts where clear sightlines matter as much as a supplementary fall barrier.",
    benefits: ["Clear-view cables", "Custom shapes", "Measured spacing"],
    featured: true,
  },
  {
    name: "Indoor Cricket Practice Nets",
    href: ROUTES.service("sports-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/indoor-cricket-practice-nets.jpg",
    alt: "Indoor cricket practice net lanes",
    summary:
      "Indoor practice lanes with measured height and ball containment for coaching spaces and academies.",
    benefits: ["Ball containment", "Lane layout", "Impact-ready mesh"],
  },
  {
    name: "Outdoor Cricket Cage Nets",
    href: ROUTES.service("sports-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/outdoor-cricket-cage-nets.jpg",
    alt: "Outdoor cricket practice cage nets",
    summary:
      "Outdoor cricket cages and practice enclosures planned for ground length, height and neighbour safety.",
    benefits: ["Cage enclosure", "Outdoor durability", "Measured height"],
  },
  {
    name: "High-Rise Green Safety Nets",
    href: ROUTES.service("safety-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/highrise-green-safety-net-up.jpg",
    alt: "High-rise green safety net looking up",
    summary:
      "High-floor green mesh systems for tall façades where access, tension and edge fixing need careful planning.",
    benefits: ["High-rise access", "UV-aware mesh", "Full-opening cover"],
  },
  {
    name: "Facade Balcony Safety Nets",
    href: ROUTES.service("safety-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/facade-balcony-safety-nets.jpg",
    alt: "Building facade balcony safety nets",
    summary:
      "Multi-balcony façade nets that close fall-risk and bird-entry openings across apartment elevations.",
    benefits: ["Façade coverage", "Uniform finish", "Secure hooks"],
  },
  {
    name: "Professional Net Installation",
    href: ROUTES.service("safety-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/installer-harness-green-net.jpg",
    alt: "Installer securing green safety netting",
    summary:
      "Trained fixing with harness-aware work on elevated openings—tension, corners and handover checks included.",
    benefits: ["Site-safe install", "Corner finishing", "Handover checks"],
  },
  {
    name: "Night Invisible Grills",
    href: ROUTES.service("invisible-grills"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/night-invisible-grills-city.jpg",
    alt: "Invisible grills over city lights at night",
    summary:
      "Stainless cable grills that keep city views open at night while adding a slim supplementary barrier.",
    benefits: ["Clear night view", "Stainless cables", "Balcony & window fit"],
  },
  {
    name: "Balcony Mesh with City View",
    href: ROUTES.service("safety-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/balcony-mesh-view-apartments.jpg",
    alt: "Balcony mesh with apartment view",
    summary:
      "Daylight balcony mesh that balances outward view with family protection on living-room openings.",
    benefits: ["View retained", "Family openings", "Airflow retained"],
  },
  {
    name: "Wide Sports Net Enclosure",
    href: ROUTES.service("sports-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/sports-net-enclosure-wide.jpg",
    alt: "Wide outdoor sports net enclosure",
    summary:
      "Wide outdoor sports enclosures for terrace or ground practice where balls must stay inside the lane.",
    benefits: ["Wide span", "Ball stop", "Terrace / ground"],
  },
  {
    name: "Green Facade Bird Netting",
    href: ROUTES.solution("pigeon-infestation"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/green-facade-netting-street.jpg",
    alt: "Green facade netting above the street",
    summary:
      "Street-facing green façade nets that close pigeon routes on ledges and open balcony planes.",
    benefits: ["Stops nesting", "Façade cover", "Bird control"],
  },
  {
    name: "Children Safety Nets",
    href: ROUTES.solution("child-balcony-safety"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/balcony-white-net-palm.jpg",
    alt: "White balcony safety net with palm trees",
    summary:
      "Closer-spaced white mesh planned where toddlers use balconies—alongside adult supervision and sound railings.",
    benefits: ["Closer mesh", "Opening-specific", "Handover checks"],
  },
  {
    name: "Family Balcony Safety Nets",
    href: ROUTES.solution("child-balcony-safety"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/balcony-white-net-palm-alt.jpg",
    alt: "White balcony safety net overlooking palms",
    summary:
      "Bright white balcony nets for family openings with palm and garden views kept largely open.",
    benefits: ["Family use", "Clean white finish", "Secure edges"],
  },
  {
    name: "Invisible Grills — Construction View",
    href: ROUTES.service("invisible-grills"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/invisible-grill-construction-view.jpg",
    alt: "Invisible grill cables with construction view",
    summary:
      "Cable systems for balconies facing construction or busy corridors where clear view still matters.",
    benefits: ["Slim cables", "Dust-aware finish", "Measured returns"],
  },
  {
    name: "Residential Balcony Safety Nets",
    href: ROUTES.service("safety-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/balcony-white-net-residential.jpg",
    alt: "White residential balcony safety net",
    summary:
      "Residential white nets for apartment balconies used daily for seating, plants and laundry.",
    benefits: ["Daily-use balcony", "Neat finish", "Airflow retained"],
  },
  {
    name: "Daytime Invisible Grills",
    href: ROUTES.service("invisible-grills"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/invisible-grill-day-city.jpg",
    alt: "Daytime invisible grill city view",
    summary:
      "Daylight invisible grills that keep city skyline views while adding measured cable spacing.",
    benefits: ["Clear-view finish", "City balconies", "Stainless options"],
  },
  {
    name: "Daylight Balcony Safety Nets",
    href: ROUTES.service("safety-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/balcony-net-daylight-view.jpg",
    alt: "Daylight balcony safety net installation",
    summary:
      "Bright daylight balcony nets for living spaces where airflow and outward view stay important.",
    benefits: ["Daylight mesh", "Living balconies", "Secure fixing"],
  },
  {
    name: "Balcony Safety Net Detail",
    href: ROUTES.service("safety-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/balcony-safety-net-detail.jpg",
    alt: "Close detail of balcony safety netting",
    summary:
      "Close-mesh detailing at rails and corners so gaps that children or pets could use are closed.",
    benefits: ["Detail finishing", "Gap checks", "Rail-safe fit"],
  },
  {
    name: "Pet Safety Nets",
    href: ROUTES.solution("pet-balcony-safety"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/balcony-safety-net-detail-b.jpg",
    alt: "Balcony safety net mesh and rail detail",
    summary:
      "Climb-aware mesh and rail detailing for cats and small dogs on utility and living balconies.",
    benefits: ["Gap checks", "Climb-aware fit", "Utility balconies"],
  },
  {
    name: "Corner Fixing Safety Nets",
    href: ROUTES.service("safety-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/balcony-safety-net-detail-c.jpg",
    alt: "Balcony safety net corner fixing detail",
    summary:
      "Corner returns and edge hooks finished carefully—where most incomplete jobs leave climbable gaps.",
    benefits: ["Corner returns", "Edge hooks", "Full coverage"],
  },
  {
    name: "Completed Safety Net Project",
    href: ROUTES.service("safety-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/project-install-31.jpg",
    alt: "Completed safety net installation project",
    summary:
      "Finished balcony net project after measurement, tensioning and edge checks—ready for everyday use.",
    benefits: ["Measured scope", "Neat handover", "Photo estimate first"],
  },
  {
    name: "Completed Invisible Grill Project",
    href: ROUTES.service("invisible-grills"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/project-install-32.jpg",
    alt: "Completed invisible grill installation project",
    summary:
      "Finished invisible grill project with aligned cables, corner returns and written scope handover.",
    benefits: ["Aligned cables", "Written scope", "View retained"],
  },
  {
    name: "Duct & Utility Area Nets",
    href: ROUTES.service("safety-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/project-install-32b.jpg",
    alt: "Completed duct and utility net installation",
    summary:
      "Utility and duct-area nets that block bird nesting while keeping service access workable.",
    benefits: ["Duct cover", "Bird control", "Service clearance"],
  },
];

export const HOME_WHY_BENEFITS = [
  {
    title: "Accurate site measurement",
    body: "Width, height, corners and fixing surfaces are confirmed on site—not guessed from a street view.",
  },
  {
    title: "Quality stainless-steel materials",
    body: "Cable and hardware options are selected for the opening, exposure and intended use.",
  },
  {
    title: "Neat and professional installation",
    body: "Tension, alignment, corners and lower gaps are checked before handover.",
  },
  {
    title: "Options for children, pets and birds",
    body: "Mesh, spacing and coverage follow the household problem—not a one-size product name.",
  },
  {
    title: "Transparent quotation process",
    body: "Material, fixing plan and inclusions are itemised so quotes can be compared fairly.",
  },
  {
    title: "Support across major Andhra Pradesh cities",
    body: "Installation can be arranged in listed cities after site confirmation—without inventing branch offices.",
  },
] as const;

export const HOME_MATERIAL_ROWS = [
  {
    aspect: "Best use",
    invisible: "Clear-view balconies & windows",
    nets: "Fall risk, birds, pets, sports",
  },
  {
    aspect: "Material",
    invisible: "Stainless-steel cable options",
    nets: "UV-resistant nylon / HDPE mesh",
  },
  {
    aspect: "Visibility",
    invisible: "Lower visual weight",
    nets: "Varies with mesh & colour",
  },
  {
    aspect: "Safety purpose",
    invisible: "Opening barrier with open sightlines",
    nets: "Mesh plane across the opening",
  },
  {
    aspect: "Maintenance",
    invisible: "Wipe cables; check terminations",
    nets: "Clear debris; check tension",
  },
  {
    aspect: "Suitable properties",
    invisible: "Apartments, villas, high-rise views",
    nets: "Balconies, ducts, terraces, practice areas",
  },
] as const;

export const HOME_PROCESS_STEPS = [
  {
    title: "Share your requirement",
    body: "Tell us the opening type and whether the priority is children, pets, birds, visibility or sports.",
  },
  {
    title: "Send photos or book inspection",
    body: "Clear photos of the full opening and fixing edges help us give useful early guidance.",
  },
  {
    title: "Measure the installation area",
    body: "On-site measurement confirms size, access, surface condition and practical constraints.",
  },
  {
    title: "Receive quotation",
    body: "You get a written estimate with material, scope and inclusions before work is scheduled.",
  },
  {
    title: "Complete professional installation",
    body: "Fitting, edge checks and basic care notes complete the handover.",
  },
] as const;

export const HOME_PRICE_FACTORS = [
  "Width and height",
  "Total installation area",
  "Selected material",
  "Cable or net specification",
  "Installation surface",
  "Building floor and accessibility",
  "Number of openings",
  "Location and travel requirement",
] as const;

export const HOME_COMBOS = [
  {
    title: "Invisible Grills + Balcony Safety Nets",
    why: "Homes that want a clearer front view on one opening and mesh coverage where children or pets use the space.",
    links: [
      { label: "Invisible Grills", href: ROUTES.service("invisible-grills") },
      { label: "Safety Nets", href: ROUTES.service("safety-nets") },
    ],
  },
  {
    title: "Pigeon Nets + Bird Spikes",
    why: "Full-opening nets for nesting paths, with spikes on narrow parapet or AC ledges where birds mainly perch.",
    links: [
      { label: "Pigeon Nets", href: ROUTES.solution("pigeon-infestation") },
      { label: "Bird Entry Solutions", href: ROUTES.solution("building-bird-entry") },
    ],
  },
  {
    title: "Window Grills + Child Safety Solutions",
    why: "Slim window cables paired with closer mesh where toddlers reach furniture-level openings.",
    links: [
      { label: "Invisible Grills", href: ROUTES.service("invisible-grills") },
      { label: "Child Safety", href: ROUTES.solution("child-balcony-safety") },
    ],
  },
  {
    title: "Sports Nets + Building Covering Nets",
    why: "Practice containment for balls with broader covering where building edges also need bird or fall protection.",
    links: [
      { label: "Sports Nets", href: ROUTES.service("sports-nets") },
      { label: "Safety Nets", href: ROUTES.service("safety-nets") },
    ],
  },
  {
    title: "Cloth Hangers + Balcony Safety Solutions",
    why: "Ceiling drying systems free the railing while nets or cables protect the same balcony opening.",
    links: [
      { label: "Cloth Hangers", href: ROUTES.service("cloth-drying-hangers") },
      { label: "Balcony Safety", href: ROUTES.service("safety-nets") },
    ],
  },
] as const;

export const HOME_FEATURED_CITIES = [
  {
    slug: "visakhapatnam",
    name: "Visakhapatnam",
    blurb: "Coastal apartments, view balconies and duct bird control.",
    areas: ["Gajuwaka", "Madhurawada", "MVP Colony"],
  },
  {
    slug: "vijayawada",
    name: "Vijayawada",
    blurb: "Heat-exposed utility balconies and terrace family openings.",
    areas: ["Benz Circle", "Patamata", "Auto Nagar"],
  },
  {
    slug: "guntur",
    name: "Guntur",
    blurb: "Apartment and independent-home safety installations.",
    areas: ["Brodipet", "Lakshmipuram", "Arundelpet"],
  },
  {
    slug: "tirupati",
    name: "Tirupati",
    blurb: "Residential balcony, window and bird-control fittings.",
    areas: ["Tirumala Road", "Bhavani Nagar", "Kappereddygari Palle"],
  },
  {
    slug: "rajamahendravaram",
    name: "Rajahmundry",
    blurb: "Godavari-region flats and villa openings.",
    areas: ["Danavaipeta", "Morampudi", "Diwancheruvu"],
  },
  {
    slug: "kakinada",
    name: "Kakinada",
    blurb: "Coastal-adjacent balconies and utility openings.",
    areas: ["Sarpavaram", "Ramanayyapeta", "Jagannaickpur"],
  },
  {
    slug: "nellore",
    name: "Nellore",
    blurb: "Family balcony and window protection planning.",
    areas: ["Stonehousepet", "Magunta Layout", "Vedayapalem"],
  },
  {
    slug: "kurnool",
    name: "Kurnool",
    blurb: "Apartment and terrace safety net installations.",
    areas: ["Ballari Road", "Nandyal Road", "Deva Nagar"],
  },
  {
    slug: "anantapur",
    name: "Anantapur",
    blurb: "Residential openings with measured quotations.",
    areas: ["Saptagiri Circle", "Ramnagar", "Adimurthy Nagar"],
  },
  {
    slug: "eluru",
    name: "Eluru",
    blurb: "Service-area installation after site confirmation.",
    areas: ["Nearby towns", "Apartment belts"],
  },
  {
    slug: "vizianagaram",
    name: "Vizianagaram",
    blurb: "North-coastal AP coverage with measured fittings.",
    areas: ["Nearby areas", "Town apartments"],
  },
  {
    slug: "srikakulam",
    name: "Srikakulam",
    blurb: "Installation support arranged after confirmation.",
    areas: ["Nearby towns", "Residential openings"],
  },
] as const;

/** Placeholder reviews — clearly marked until verified customer content is available. */
export const HOME_REVIEW_PLACEHOLDERS = [
  {
    name: "Customer review",
    city: "Visakhapatnam",
    service: "Invisible Grills",
    rating: null as number | null,
    content:
      "Verified customer reviews will appear here after confirmation. Until then, ask for recent project photos from your city.",
    placeholder: true,
  },
  {
    name: "Customer review",
    city: "Vijayawada",
    service: "Balcony Safety Nets",
    rating: null as number | null,
    content:
      "We do not publish fabricated ratings. Share your opening photos to discuss a measured installation plan.",
    placeholder: true,
  },
  {
    name: "Customer review",
    city: "Guntur",
    service: "Pigeon Nets",
    rating: null as number | null,
    content:
      "Placeholder for a verified local review. Browse the gallery for real installation photographs.",
    placeholder: true,
  },
] as const;

export const HOME_GALLERY_FILTERS = [
  "All",
  "Balconies",
  "Windows",
  "Staircases",
  "Apartments",
  "Sports Areas",
  "Safety Nets",
] as const;
