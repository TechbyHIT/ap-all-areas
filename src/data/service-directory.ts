import { ROUTES } from "@/config/routes";

export type DirectoryLink = {
  label: string;
  href: string;
};

export type DirectoryCategory = {
  title: string;
  href?: string;
  links: DirectoryLink[];
};

const S = {
  invisible: ROUTES.service("invisible-grills"),
  safety: ROUTES.service("safety-nets"),
  sports: ROUTES.service("sports-nets"),
  hangers: ROUTES.service("cloth-drying-hangers"),
  child: ROUTES.solution("child-balcony-safety"),
  pet: ROUTES.solution("pet-balcony-safety"),
  pigeon: ROUTES.solution("pigeon-infestation"),
  bird: ROUTES.solution("building-bird-entry"),
  terrace: ROUTES.solution("terrace-edge-protection"),
  stair: ROUTES.solution("staircase-fall-risk"),
  cricket: ROUTES.solution("cricket-practice-space"),
  boxCricket: ROUTES.solution("box-cricket-space"),
  drying: ROUTES.solution("limited-drying-space"),
  apartments: ROUTES.propertyTypeService("apartments", "safety-nets"),
  villas: ROUTES.propertyTypeService("villas", "invisible-grills"),
  aptGrills: ROUTES.propertyTypeService("apartments", "invisible-grills"),
};

/**
 * Full services library for mega menu, /services/, homepage directory, footer.
 * Labels match high-intent commercial searches; hrefs point to real content pages.
 */
export const SERVICE_DIRECTORY: DirectoryCategory[] = [
  {
    title: "Invisible Grills",
    href: S.invisible,
    links: [
      { label: "Balcony Invisible Grills", href: S.invisible },
      { label: "Window Invisible Grills", href: S.invisible },
      { label: "Invisible Grills for Apartments", href: S.aptGrills },
      { label: "Invisible Grills for Villas", href: S.villas },
      { label: "Invisible Grills for Child Safety", href: S.child },
      { label: "Invisible Grills for Pets", href: S.pet },
    ],
  },
  {
    title: "Pigeon Nets",
    href: S.pigeon,
    links: [
      { label: "Anti Pigeon Nets", href: S.pigeon },
      { label: "Pigeon Safety Nets", href: S.pigeon },
      { label: "Balcony Pigeon Nets", href: S.pigeon },
      { label: "Window Pigeon Nets", href: S.safety },
      { label: "Duct Area Pigeon Nets", href: S.safety },
    ],
  },
  {
    title: "Terrace Safety Nets",
    href: S.terrace,
    links: [
      { label: "Terrace Nets Near Me", href: S.terrace },
      { label: "Open Terrace Protection", href: S.terrace },
      { label: "Terrace Fall Protection", href: S.terrace },
    ],
  },
  {
    title: "Safety Nets",
    href: S.safety,
    links: [
      { label: "Balcony Safety Nets", href: S.safety },
      { label: "Kids Safety Nets", href: S.child },
      { label: "Child Safety Nets", href: S.child },
      { label: "Pet Safety Nets", href: S.pet },
      { label: "Cat Safety Nets", href: S.pet },
      { label: "Dog Safety Nets", href: S.pet },
    ],
  },
  {
    title: "Sports Nets",
    href: S.sports,
    links: [
      { label: "Cricket Nets", href: S.cricket },
      { label: "Cricket Practice Nets", href: S.cricket },
      { label: "Football Nets", href: S.sports },
      { label: "Football Goal Nets", href: S.sports },
      { label: "Golf Nets", href: S.sports },
      { label: "Volleyball Nets", href: S.sports },
    ],
  },
  {
    title: "Duct Area Nets",
    href: S.safety,
    links: [
      { label: "Duct Pigeon Nets", href: S.pigeon },
      { label: "Kitchen Duct Nets", href: S.safety },
      { label: "Bird Nets for Ducts", href: S.bird },
    ],
  },
  {
    title: "Balcony Nets",
    href: S.safety,
    links: [
      { label: "Balcony Protection Nets", href: S.safety },
      { label: "Balcony Children Safety Nets", href: S.child },
      { label: "Balcony Pet Safety Nets", href: S.pet },
      { label: "Balcony Cat Nets", href: S.pet },
      { label: "Apartment Balcony Nets", href: S.apartments },
      { label: "High Rise Balcony Nets", href: S.apartments },
    ],
  },
  {
    title: "Cloth Hangers",
    href: S.hangers,
    links: [
      { label: "Ceiling Cloth Hangers", href: S.hangers },
      { label: "Balcony Cloth Hangers", href: S.hangers },
      { label: "Wall Mounted Cloth Hangers", href: S.hangers },
      { label: "Pulley Cloth Hangers", href: S.hangers },
      { label: "Stainless Steel Cloth Hangers", href: S.hangers },
      { label: "Clothes Drying Hangers", href: S.drying },
    ],
  },
  {
    title: "Mosquito Nets",
    href: S.safety,
    links: [
      { label: "Window Mosquito Nets", href: S.safety },
      { label: "Balcony Mosquito Nets", href: S.safety },
    ],
  },
  {
    title: "Bird Nets",
    href: S.bird,
    links: [
      { label: "Anti Bird Nets", href: S.bird },
      { label: "Bird Protection Nets", href: S.bird },
      { label: "Balcony Bird Nets", href: S.pigeon },
      { label: "Window Bird Nets", href: S.safety },
      { label: "Duct Area Bird Nets", href: S.bird },
    ],
  },
  {
    title: "Bird Spikes",
    href: S.pigeon,
    links: [
      { label: "Pigeon Spikes", href: S.pigeon },
      { label: "Anti Bird Spikes", href: S.bird },
      { label: "Anti Pigeon Spikes", href: S.pigeon },
      { label: "Bird Control Spikes", href: S.bird },
      { label: "Pigeon Control Spikes", href: S.pigeon },
      { label: "Stainless Steel Bird Spikes", href: S.pigeon },
    ],
  },
  {
    title: "Staircase Safety Nets",
    href: S.stair,
    links: [
      { label: "Staircase Child Safety", href: S.stair },
      { label: "Open Staircase Nets", href: S.stair },
    ],
  },
];

/**
 * 4-column mega menu — even column heights so the panel rarely needs scroll.
 */
export const SERVICES_MEGA_MENU_COLUMNS: DirectoryCategory[][] = [
  [
    SERVICE_DIRECTORY[0], // Invisible Grills
    SERVICE_DIRECTORY[1], // Pigeon Nets
    SERVICE_DIRECTORY[8], // Mosquito Nets
  ],
  [
    SERVICE_DIRECTORY[3], // Safety Nets
    SERVICE_DIRECTORY[4], // Sports Nets
    SERVICE_DIRECTORY[11], // Staircase Safety Nets
  ],
  [
    SERVICE_DIRECTORY[6], // Balcony Nets
    SERVICE_DIRECTORY[7], // Cloth Hangers
    SERVICE_DIRECTORY[2], // Terrace Safety Nets
  ],
  [
    SERVICE_DIRECTORY[9], // Bird Nets
    SERVICE_DIRECTORY[10], // Bird Spikes
    SERVICE_DIRECTORY[5], // Duct Area Nets
  ],
];

/** Flat category list for mobile accordion menu. */
export const SERVICES_MENU_CATEGORIES = SERVICE_DIRECTORY;

/** Compact top-level service links (fallback / simple menus). */
export const CORE_SERVICE_LINKS: DirectoryLink[] = [
  { label: "Invisible Grills", href: S.invisible },
  { label: "Safety Nets", href: S.safety },
  { label: "Sports Nets", href: S.sports },
  { label: "Cloth Drying Hangers", href: S.hangers },
  { label: "View All Services", href: ROUTES.services },
];
