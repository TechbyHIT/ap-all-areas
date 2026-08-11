/** Central design + media map — prefer larger HD project photos. */

export const SERVICE_MEDIA: Record<
  string,
  { image: string; icon: string; alt: string; gallery: readonly string[] }
> = {
  "invisible-grills": {
    image: "/images/projects/installations/invisible-grill-day-city.jpg",
    icon: "/images/projects/installations/atrium-invisible-grill-circle.jpg",
    alt: "High-definition balcony invisible grill installation",
    gallery: [
      "/images/projects/installations/invisible-grill-day-city.jpg",
      "/images/projects/installations/atrium-invisible-grill-circle.jpg",
      "/images/projects/installations/night-invisible-grills-city.jpg",
      "/images/projects/installations/invisible-grill-construction-view.jpg",
      "/images/projects/balcony-invisible-grills-8.jpg",
      "/images/projects/balcony-invisible-grills-10.jpg",
    ],
  },
  "safety-nets": {
    image: "/images/projects/installations/balcony-white-net-residential.jpg",
    icon: "/images/projects/installations/night-balcony-safety-net.jpg",
    alt: "High-definition balcony safety net installation",
    gallery: [
      "/images/projects/installations/balcony-white-net-residential.jpg",
      "/images/projects/installations/night-balcony-safety-net.jpg",
      "/images/projects/installations/highrise-green-safety-net-up.jpg",
      "/images/projects/installations/facade-balcony-safety-nets.jpg",
      "/images/projects/installations/balcony-mesh-view-apartments.jpg",
      "/images/projects/balcony-safety-nets-12.jpg",
    ],
  },
  "sports-nets": {
    image: "/images/projects/installations/indoor-cricket-practice-nets.jpg",
    icon: "/images/projects/installations/outdoor-cricket-cage-nets.jpg",
    alt: "High-definition cricket practice net installation",
    gallery: [
      "/images/projects/installations/indoor-cricket-practice-nets.jpg",
      "/images/projects/installations/outdoor-cricket-cage-nets.jpg",
      "/images/projects/installations/sports-net-enclosure-wide.jpg",
      "/images/projects/cricket-nets-4.jpg",
    ],
  },
  "cloth-drying-hangers": {
    image: "/images/projects/installations/cloth-drying-hanger-ceiling.jpg",
    icon: "/images/projects/installations/cloth-drying-hanger-ceiling.jpg",
    alt: "High-definition cloth drying hanger installation",
    gallery: [
      "/images/projects/installations/cloth-drying-hanger-ceiling.jpg",
      "/images/projects/cloth-hangers-9.jpeg",
      "/images/projects/cloth-hangers-11.jpeg",
    ],
  },
};

export const HERO_FALLBACK =
  "/images/projects/installations/invisible-grill-day-city.jpg";

/** Resolve hero media for any core service slug (safe fallback). */
export function getServiceMedia(serviceSlug: string) {
  return (
    SERVICE_MEDIA[serviceSlug] ?? {
      image: HERO_FALLBACK,
      icon: HERO_FALLBACK,
      alt: "Hiranya Enterprises installation project",
      gallery: [HERO_FALLBACK] as readonly string[],
    }
  );
}

/** Keyword / problem intent → best matching project photo. */
export function getIntentHeroImage(intentSlug: string, serviceSlug: string): {
  src: string;
  alt: string;
} {
  const lower = intentSlug.toLowerCase();
  if (lower.includes("child") || lower.includes("kid")) {
    return {
      src: "/images/projects/children-safety-nets-1.jpg",
      alt: "Children safety net installation",
    };
  }
  if (lower.includes("pet") || lower.includes("cat") || lower.includes("dog")) {
    return {
      src: "/images/projects/pet-safety-nets-1.jpg",
      alt: "Pet safety net installation",
    };
  }
  if (lower.includes("pigeon") || lower.includes("bird") || lower.includes("anti-bird")) {
    return {
      src: "/images/projects/balcony-safety-nets-13.jpg",
      alt: "Pigeon and bird protection net installation",
    };
  }
  if (lower.includes("duct")) {
    return {
      src: "/images/projects/duct-area-nets-1.jpg",
      alt: "Duct area safety net installation",
    };
  }
  if (lower.includes("spike")) {
    return {
      src: "/images/projects/bird-spikes-1.webp",
      alt: "Bird spikes installation",
    };
  }
  if (lower.includes("cricket") || lower.includes("sport") || lower.includes("football")) {
    return {
      src: "/images/projects/cricket-nets-4.jpg",
      alt: "Sports and cricket practice net installation",
    };
  }
  if (lower.includes("cloth") || lower.includes("hanger") || lower.includes("drying")) {
    return {
      src: "/images/projects/cloth-hangers-9.jpeg",
      alt: "Cloth drying hanger installation",
    };
  }
  if (lower.includes("window") && lower.includes("grill")) {
    return {
      src: "/images/projects/window-invisible-grills-1.jpeg",
      alt: "Window invisible grill installation",
    };
  }
  if (lower.includes("mosquito")) {
    return {
      src: "/images/projects/mosquito-nets-1.png",
      alt: "Mosquito net screening",
    };
  }
  const media = getServiceMedia(serviceSlug);
  return { src: media.image, alt: media.alt };
}

export type GalleryProject = {
  title: string;
  image: string;
  alt: string;
  href?: string;
};

export type VisualServiceItem = {
  name: string;
  summary: string;
  image: string;
  alt: string;
  href: string;
};

/** Homepage + services visual catalog — all major offerings with HD photos. */
export const HOME_VISUAL_SERVICES: VisualServiceItem[] = [
  {
    name: "Invisible Grills",
    summary:
      "Stainless-steel cable systems that protect balcony and window openings while preserving daylight, airflow and a clearer outward view than bulky iron bars.",
    image: "/images/projects/balcony-invisible-grills-8.jpg",
    alt: "HD apartment balcony invisible grill installation",
    href: "/services/invisible-grills/",
  },
  {
    name: "Balcony Invisible Grills",
    summary:
      "Measured cable layouts for front and side balcony returns, including corners and AC outdoor-unit cut-outs common in Andhra Pradesh flats.",
    image: "/images/projects/balcony-invisible-grills-10.jpg",
    alt: "HD balcony invisible grill with clear street view",
    href: "/services/invisible-grills/",
  },
  {
    name: "Window Invisible Grills",
    summary:
      "Slim cable barriers for bedroom and hall windows where furniture reach and child safety matter without darkening the room.",
    image: "/images/projects/window-invisible-grills-1.jpeg",
    alt: "HD window invisible grill installation",
    href: "/services/invisible-grills/",
  },
  {
    name: "Balcony Safety Nets",
    summary:
      "Mesh systems fitted across balcony openings to reduce fall risk for children and pets while keeping the space usable for plants and seating.",
    image: "/images/projects/balcony-safety-nets-12.jpg",
    alt: "HD balcony safety net installation",
    href: "/services/safety-nets/",
  },
  {
    name: "Children Safety Nets",
    summary:
      "Closer-spaced mesh planned where toddlers use balconies, stair voids or window openings—always as a supplement to adult supervision.",
    image: "/images/projects/children-safety-nets-1.jpg",
    alt: "HD children safety net on balcony",
    href: "/solutions/child-balcony-safety/",
  },
  {
    name: "Pet Safety Nets",
    summary:
      "Climb-aware layouts for cats and small dogs on utility and living balconies, with gap and tension checks at handover.",
    image: "/images/projects/pet-safety-nets-1.jpg",
    alt: "HD pet safety net installation",
    href: "/solutions/pet-balcony-safety/",
  },
  {
    name: "Pigeon & Bird Protection Nets",
    summary:
      "Full-opening nets that close bird-entry paths on balconies, AC ledges and ducts where pigeons return repeatedly.",
    image: "/images/projects/balcony-safety-nets-13.jpg",
    alt: "HD bird protection net on residential balcony",
    href: "/solutions/pigeon-infestation/",
  },
  {
    name: "Duct Area Safety Nets",
    summary:
      "Shaft and duct coverings that block bird nesting while respecting building access and service-pipe clearances.",
    image: "/images/projects/duct-area-nets-1.jpg",
    alt: "HD duct area safety net installation",
    href: "/services/safety-nets/",
  },
  {
    name: "Bird Spikes",
    summary:
      "Narrow-ledge deterrents for parapets and AC lines where a full net is unnecessary and birds mainly perch.",
    image: "/images/projects/bird-spikes-1.webp",
    alt: "Bird spikes installation on building ledge",
    href: "/solutions/building-bird-entry/",
  },
  {
    name: "Terrace Safety Nets",
    summary:
      "Edge and open-terrace protection for family use, drying areas and bird control on exposed Andhra Pradesh rooftops.",
    image: "/images/projects/balcony-safety-nets-5.jpg",
    alt: "HD terrace and balcony safety netting",
    href: "/solutions/terrace-edge-protection/",
  },
  {
    name: "Cricket & Sports Nets",
    summary:
      "Practice enclosures and ball-stop nets for terraces, coaching spaces, schools and home practice areas.",
    image: "/images/projects/cricket-nets-4.jpg",
    alt: "HD cricket practice net enclosure",
    href: "/services/sports-nets/",
  },
  {
    name: "Cloth Drying Hangers",
    summary:
      "Ceiling and balcony drying systems that free railing space in compact apartments—especially useful in humid monsoon months.",
    image: "/images/projects/cloth-hangers-9.jpeg",
    alt: "HD ceiling cloth drying hanger installation",
    href: "/services/cloth-drying-hangers/",
  },
  {
    name: "Mosquito Net Screening",
    summary:
      "Window and balcony insect screening that improves comfort without sealing the home from ventilation.",
    image: "/images/projects/mosquito-nets-1.png",
    alt: "HD mosquito net window screening",
    href: "/services/safety-nets/",
  },
  {
    name: "Staircase Safety",
    summary:
      "Side-void nets or cable barriers for duplex staircases and open gallery edges in independent homes and apartments.",
    image: "/images/projects/balcony-invisible-grills-2.png",
    alt: "HD staircase and balcony cable safety system",
    href: "/solutions/staircase-fall-risk/",
  },
  {
    name: "Apartment Safety Packages",
    summary:
      "Combined balcony, window and duct solutions planned around society working hours and facade rules.",
    image: "/images/projects/balcony-invisible-grills-9.jpg",
    alt: "HD apartment balcony safety installation",
    href: "/property-types/apartments/safety-nets/",
  },
  {
    name: "High-Rise Balcony Protection",
    summary:
      "Wind-aware tension and fixing plans for taller Visakhapatnam and Vijayawada towers where exposure is stronger.",
    image: "/images/projects/balcony-invisible-grills-58.jpeg",
    alt: "HD high-rise balcony invisible grill finish",
    href: "/services/invisible-grills/",
  },
];

/** Curated HD homepage gallery preview. */
export const GALLERY_PROJECTS: GalleryProject[] = [
  {
    title: "Invisible Grill — Day City View",
    image: "/images/projects/installations/invisible-grill-day-city.jpg",
    alt: "Daytime invisible grill city view",
    href: "/services/invisible-grills/",
  },
  {
    title: "Atrium Invisible Grill",
    image: "/images/projects/installations/atrium-invisible-grill-circle.jpg",
    alt: "Circular atrium invisible grill cables",
    href: "/services/invisible-grills/",
  },
  {
    title: "Night Invisible Grills",
    image: "/images/projects/installations/night-invisible-grills-city.jpg",
    alt: "Invisible grills over city lights at night",
    href: "/services/invisible-grills/",
  },
  {
    title: "Balcony Safety Net",
    image: "/images/projects/installations/balcony-white-net-residential.jpg",
    alt: "White residential balcony safety net",
    href: "/services/safety-nets/",
  },
  {
    title: "Night Balcony Net",
    image: "/images/projects/installations/night-balcony-safety-net.jpg",
    alt: "Night balcony safety net installation",
    href: "/services/safety-nets/",
  },
  {
    title: "High-Rise Green Net",
    image: "/images/projects/installations/highrise-green-safety-net-up.jpg",
    alt: "High-rise green safety net looking up",
    href: "/services/safety-nets/",
  },
  {
    title: "Indoor Cricket Nets",
    image: "/images/projects/installations/indoor-cricket-practice-nets.jpg",
    alt: "Indoor cricket practice net lanes",
    href: "/services/sports-nets/",
  },
  {
    title: "Outdoor Cricket Cage",
    image: "/images/projects/installations/outdoor-cricket-cage-nets.jpg",
    alt: "Outdoor cricket practice cage nets",
    href: "/services/sports-nets/",
  },
  {
    title: "Cloth Drying Hanger",
    image: "/images/projects/installations/cloth-drying-hanger-ceiling.jpg",
    alt: "Ceiling cloth drying hanger on balcony",
    href: "/services/cloth-drying-hangers/",
  },
  {
    title: "Facade Safety Nets",
    image: "/images/projects/installations/facade-balcony-safety-nets.jpg",
    alt: "Building facade balcony safety nets",
    href: "/services/safety-nets/",
  },
  {
    title: "Sports Net Enclosure",
    image: "/images/projects/installations/sports-net-enclosure-wide.jpg",
    alt: "Wide outdoor sports net enclosure",
    href: "/services/sports-nets/",
  },
  {
    title: "Installer at Work",
    image: "/images/projects/installations/installer-harness-green-net.jpg",
    alt: "Installer securing green safety netting",
    href: "/gallery/",
  },
];

/** Extended gallery for /gallery/ — HD collection photos. */
export const GALLERY_ALL_PROJECTS: GalleryProject[] = [
  ...GALLERY_PROJECTS,
  {
    title: "Balcony Mesh Apartments",
    image: "/images/projects/installations/balcony-mesh-view-apartments.jpg",
    alt: "Balcony mesh with apartment view",
    href: "/services/safety-nets/",
  },
  {
    title: "Green Facade Netting",
    image: "/images/projects/installations/green-facade-netting-street.jpg",
    alt: "Green facade netting above the street",
    href: "/services/safety-nets/",
  },
  {
    title: "Palm View Safety Net",
    image: "/images/projects/installations/balcony-white-net-palm.jpg",
    alt: "White balcony safety net with palm trees",
    href: "/services/safety-nets/",
  },
  {
    title: "Daylight Balcony Net",
    image: "/images/projects/installations/balcony-net-daylight-view.jpg",
    alt: "Daylight balcony safety net installation",
    href: "/services/safety-nets/",
  },
  {
    title: "Safety Net Detail",
    image: "/images/projects/installations/balcony-safety-net-detail.jpg",
    alt: "Close detail of balcony safety netting",
    href: "/services/safety-nets/",
  },
  {
    title: "Balcony Invisible Grills — Project 5",
    image: "/images/projects/balcony-invisible-grills-5.jpg",
    alt: "Apartment balcony invisible grill installation",
    href: "/services/invisible-grills/",
  },
  {
    title: "Balcony Invisible Grills — Project 9",
    image: "/images/projects/balcony-invisible-grills-9.jpg",
    alt: "High-rise balcony cable installation",
    href: "/services/invisible-grills/",
  },
  {
    title: "Balcony Safety Nets — Project 2",
    image: "/images/projects/balcony-safety-nets-2.jpg",
    alt: "Residential balcony safety net installation",
    href: "/services/safety-nets/",
  },
  {
    title: "Balcony Safety Nets — Project 5",
    image: "/images/projects/balcony-safety-nets-5.jpg",
    alt: "Family balcony safety net finish",
    href: "/services/safety-nets/",
  },
  {
    title: "Cloth Hangers — Ceiling System",
    image: "/images/projects/cloth-hangers-11.jpeg",
    alt: "Apartment cloth drying hanger installation",
    href: "/services/cloth-drying-hangers/",
  },
  {
    title: "Sports Nets — Practice Cage",
    image: "/images/projects/cricket-nets-4.jpg",
    alt: "Outdoor cricket net enclosure installation",
    href: "/services/sports-nets/",
  },
  {
    title: "Children Safety Nets — Project 3",
    image: "/images/projects/children-safety-nets-3.jpg",
    alt: "Child safety net on balcony opening",
    href: "/solutions/child-balcony-safety/",
  },
  {
    title: "Mosquito Net Screening",
    image: "/images/projects/mosquito-nets-1.png",
    alt: "Window mosquito net screening installation",
    href: "/services/safety-nets/",
  },
  {
    title: "Bird Spikes Installation",
    image: "/images/projects/bird-spikes-1.webp",
    alt: "Bird spikes installation photo",
    href: "/solutions/pigeon-infestation/",
  },
  {
    title: "Invisible Grills — Side Return",
    image: "/images/projects/balcony-invisible-grills-45.jpeg",
    alt: "Invisible grill side-return detail photo",
    href: "/services/invisible-grills/",
  },
  {
    title: "Invisible Grills — Living View",
    image: "/images/projects/balcony-invisible-grills-53.jpeg",
    alt: "Living-room view of balcony invisible grills",
    href: "/services/invisible-grills/",
  },
  {
    title: "Safety Nets — Utility Balcony",
    image: "/images/projects/balcony-safety-nets-21.jpg",
    alt: "Utility balcony safety net installation",
    href: "/services/safety-nets/",
  },
];

/** Hero carousel slides with distinct HD photos. */
export const HOME_HERO_SLIDES = [
  {
    title: "Balcony Safety Nets, Pigeon Nets & Invisible Grills",
    description:
      "Professional balcony and window protection across Andhra Pradesh—compare clear-view cables, safety mesh, bird control and drying systems, then send a photo for a measured local estimate.",
    image: "/images/projects/balcony-invisible-grills-8.jpg",
    alt: "HD balcony invisible grill installation in Andhra Pradesh",
  },
  {
    title: "Invisible Grills in Visakhapatnam",
    description:
      "Low-visibility stainless-steel cables planned for coastal apartments, family flats and view-facing balconies without boxing the space in.",
    image: "/images/projects/balcony-invisible-grills-10.jpg",
    alt: "Invisible grill installation for Visakhapatnam balcony",
  },
  {
    title: "Safety Nets in Vijayawada",
    description:
      "Balcony, child, pet and pigeon nets fitted for heat-exposed utility balconies and terrace-led family homes.",
    image: "/images/projects/balcony-safety-nets-12.jpg",
    alt: "Balcony safety net installation in Vijayawada",
  },
  {
    title: "Pigeon Nets & Bird Protection",
    description:
      "Close bird-entry gaps on balconies, ducts and ledges—or use spikes only where birds perch on narrow lines.",
    image: "/images/projects/duct-area-nets-1.jpg",
    alt: "Duct area pigeon net installation",
  },
  {
    title: "Cricket Practice & Sports Nets",
    description:
      "Contain balls safely on terraces, coaching spaces and school grounds with measured sports net enclosures.",
    image: "/images/projects/cricket-nets-4.jpg",
    alt: "Cricket practice net enclosure installation",
  },
  {
    title: "Cloth Drying Hangers for Apartments",
    description:
      "Ceiling and balcony hangers that reclaim railing space and keep laundry organised in compact Andhra Pradesh homes.",
    image: "/images/projects/cloth-hangers-9.jpeg",
    alt: "Cloth drying hanger installation in apartment",
  },
] as const;

/** Process steps with supporting HD images. */
export const HOME_PROCESS_MEDIA = [
  {
    title: "Share the opening",
    body: "Send clear photos of the balcony, window, duct or terrace, plus your city and the main concern.",
    image: "/images/projects/balcony-safety-nets-2.jpg",
  },
  {
    title: "Measure and check",
    body: "Width, height, corners, railing gaps and fixing surfaces are confirmed on site—not guessed from a street view.",
    image: "/images/projects/balcony-invisible-grills-5.jpg",
  },
  {
    title: "Compare the estimate",
    body: "Material, spacing, access notes and inclusions appear in writing before drilling day.",
    image: "/images/projects/cloth-hangers-11.jpeg",
  },
  {
    title: "Install and inspect",
    body: "Tension, alignment, corners and lower gaps are checked before handover and basic care notes.",
    image: "/images/projects/balcony-invisible-grills-58.jpeg",
  },
] as const;

/** @deprecated Use GALLERY_PROJECTS — kept for older imports */
export const GALLERY_IMAGES = GALLERY_PROJECTS.map((p) => p.image);
