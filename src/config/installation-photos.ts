/**
 * Installation photos (Aug 2026 WhatsApp set). All 24 live under
 * /public/images/projects/installations/.
 */
export const INSTALLATION_PHOTOS = [
  {
    src: "/images/projects/installations/night-balcony-safety-net.jpg",
    alt: "Night balcony safety net installation",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/cloth-drying-hanger-ceiling.jpg",
    alt: "White balcony safety net with apartment view",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/atrium-invisible-grill-circle.jpg",
    alt: "Circular atrium invisible grill cables",
    service: "invisible-grills",
  },
  {
    src: "/images/projects/installations/indoor-cricket-practice-nets.jpg",
    alt: "Indoor cricket practice net lanes",
    service: "sports-nets",
  },
  {
    src: "/images/projects/installations/outdoor-cricket-cage-nets.jpg",
    alt: "Outdoor cricket practice cage nets",
    service: "sports-nets",
  },
  {
    src: "/images/projects/installations/highrise-green-safety-net-up.jpg",
    alt: "High-rise green safety net looking up",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/facade-balcony-safety-nets.jpg",
    alt: "Building facade balcony safety nets",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/installer-harness-green-net.jpg",
    alt: "Installer securing green safety netting",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/night-invisible-grills-city.jpg",
    alt: "Invisible grills over city lights at night",
    service: "invisible-grills",
  },
  {
    src: "/images/projects/installations/balcony-mesh-view-apartments.jpg",
    alt: "Balcony mesh with apartment view",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/sports-net-enclosure-wide.jpg",
    alt: "Wide outdoor sports net enclosure",
    service: "sports-nets",
  },
  {
    src: "/images/projects/installations/green-facade-netting-street.jpg",
    alt: "Ceiling cloth drying hanger on green balcony wall",
    service: "cloth-drying-hangers",
  },
  {
    src: "/images/projects/installations/balcony-white-net-palm.jpg",
    alt: "White balcony safety net with palm trees",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/balcony-white-net-palm-alt.jpg",
    alt: "White balcony safety net overlooking palms",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/invisible-grill-construction-view.jpg",
    alt: "Invisible grill cables with construction view",
    service: "invisible-grills",
  },
  {
    src: "/images/projects/installations/balcony-white-net-residential.jpg",
    alt: "White residential balcony safety net",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/invisible-grill-day-city.jpg",
    alt: "Daytime invisible grill city view",
    service: "invisible-grills",
  },
  {
    src: "/images/projects/installations/balcony-net-daylight-view.jpg",
    alt: "Daylight balcony safety net installation",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/balcony-safety-net-detail.jpg",
    alt: "Close detail of balcony safety netting",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/balcony-safety-net-detail-b.jpg",
    alt: "Balcony safety net mesh and rail detail",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/balcony-safety-net-detail-c.jpg",
    alt: "Balcony safety net corner fixing detail",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/project-install-31.jpg",
    alt: "Completed installation project photo",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/project-install-32.jpg",
    alt: "Completed installation project photo",
    service: "invisible-grills",
  },
  {
    src: "/images/projects/installations/project-install-32b.jpg",
    alt: "Completed installation project photo",
    service: "safety-nets",
  },
] as const;

export type InstallationPhoto = (typeof INSTALLATION_PHOTOS)[number];

/** Full set for homepage rotation / gallery (every photo). */
export const HOME_ROTATION_PHOTOS = INSTALLATION_PHOTOS;

/**
 * Hero bleed uses cover-fit — prefer wider, clear compositions that fill the
 * frame without awkward letterboxing.
 */
const HERO_SRCS = new Set([
  "/images/projects/installations/invisible-grill-day-city.jpg",
  "/images/projects/installations/night-balcony-safety-net.jpg",
  "/images/projects/installations/night-invisible-grills-city.jpg",
  "/images/projects/installations/facade-balcony-safety-nets.jpg",
  "/images/projects/installations/balcony-mesh-view-apartments.jpg",
  "/images/projects/installations/balcony-white-net-palm.jpg",
  "/images/projects/installations/balcony-net-daylight-view.jpg",
  "/images/projects/installations/sports-net-enclosure-wide.jpg",
  "/images/projects/installations/outdoor-cricket-cage-nets.jpg",
  "/images/projects/installations/atrium-invisible-grill-circle.jpg",
  "/images/projects/installations/highrise-green-safety-net-up.jpg",
  "/images/projects/installations/facade-balcony-safety-nets.jpg",
]);

export const HERO_SCROLL_IMAGES = INSTALLATION_PHOTOS.filter((photo) =>
  HERO_SRCS.has(photo.src),
);

export function installationPhotosForService(serviceSlug: string) {
  const matched = INSTALLATION_PHOTOS.filter((p) => p.service === serviceSlug);
  return matched.length > 0 ? matched : HERO_SCROLL_IMAGES;
}
