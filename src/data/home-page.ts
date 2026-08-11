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
 * Main Services — original service list. Each card uses one topic-matched
 * image only (no shared/duplicate srcs with other homepage service blocks).
 */
export const HOME_BENTO_SERVICES: HomeServiceCard[] = [
  {
    name: "Invisible Grills",
    href: ROUTES.service("invisible-grills"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/invisible-grill-day-city.jpg",
    alt: "Daytime invisible grill city view",
    summary:
      "Stainless-steel cable systems that protect openings while keeping daylight and a clearer outward view.",
    benefits: ["Clear-view finish", "Balcony & window fit", "Measured spacing"],
    featured: true,
  },
  {
    name: "Balcony Safety Nets",
    href: ROUTES.service("safety-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/balcony-net-daylight-view.jpg",
    alt: "Daylight balcony safety net installation",
    summary:
      "Mesh systems fitted across balcony openings to reduce fall risk for family use while keeping the space usable.",
    benefits: ["Family openings", "Secure edge fixing", "Airflow retained"],
    featured: true,
  },
  {
    name: "Pigeon Safety Nets",
    href: ROUTES.solution("pigeon-infestation"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/green-facade-netting-street.jpg",
    alt: "Green facade bird protection netting",
    summary:
      "Full-opening nets that close bird-entry paths on balconies, AC ledges and ducts.",
    benefits: ["Stops nesting", "Full-opening cover", "Duct options"],
  },
  {
    name: "Children Safety Nets",
    href: ROUTES.solution("child-balcony-safety"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/children-safety-nets-1.jpg",
    alt: "Children safety net on balcony",
    summary:
      "Closer-spaced mesh planned where toddlers use balconies or window openings—alongside adult supervision.",
    benefits: ["Closer mesh", "Opening-specific", "Handover checks"],
  },
  {
    name: "Pet Safety Nets",
    href: ROUTES.solution("pet-balcony-safety"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/pet-safety-nets-1.jpg",
    alt: "Pet safety net installation",
    summary:
      "Climb-aware layouts for cats and small dogs on utility and living balconies.",
    benefits: ["Gap checks", "Climb-aware fit", "Utility balconies"],
  },
  {
    name: "Sports Nets",
    href: ROUTES.service("sports-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/outdoor-cricket-cage-nets.jpg",
    alt: "Outdoor cricket practice cage nets",
    summary:
      "Practice enclosures and ball-stop nets for terraces, coaching spaces and schools.",
    benefits: ["Ball containment", "Terrace ready", "Measured height"],
  },
  {
    name: "Duct Area Safety Nets",
    href: ROUTES.service("safety-nets"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/duct-area-nets-1.jpg",
    alt: "Duct area safety net",
    summary:
      "Shaft and duct coverings that block bird nesting while respecting service access.",
    benefits: ["Shaft cover", "Service clearance", "Bird control"],
  },
  {
    name: "Cloth Drying Hangers",
    href: ROUTES.service("cloth-drying-hangers"),
    quoteHref: ROUTES.contact,
    image: "/images/projects/installations/cloth-drying-hanger-ceiling.jpg",
    alt: "Ceiling cloth drying hanger on balcony",
    summary:
      "Ceiling and balcony drying systems that free railing space in compact apartments.",
    benefits: ["Ceiling systems", "Load-aware fix", "Compact flats"],
  },
];

/** Image srcs reserved by Main Services — other home sections must not reuse them. */
export const HOME_MAIN_SERVICE_IMAGE_SRCS = new Set(
  HOME_BENTO_SERVICES.map((service) => service.image),
);

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
