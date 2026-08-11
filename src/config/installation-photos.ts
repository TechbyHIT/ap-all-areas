/**
 * New installation photos (Aug 2026). Full-ratio display — do not force a crop
 * that destroys composition; heroes use object-contain / scroll strips.
 */
export const INSTALLATION_PHOTOS = [
  {
    src: "/images/projects/installations/night-balcony-safety-net.jpg",
    alt: "Night balcony safety net installation",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/cloth-drying-hanger-ceiling.jpg",
    alt: "Ceiling cloth drying hanger on balcony",
    service: "cloth-drying-hangers",
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
    alt: "Green facade netting above the street",
    service: "safety-nets",
  },
  {
    src: "/images/projects/installations/balcony-white-net-palm.jpg",
    alt: "White balcony safety net with palm trees",
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

/** Homepage + page hero auto-scroll sequence (unique best shots). */
export const HERO_SCROLL_IMAGES = INSTALLATION_PHOTOS.filter(
  (photo, index, list) =>
    list.findIndex((p) => p.src === photo.src) === index,
);

export function installationPhotosForService(serviceSlug: string) {
  const matched = INSTALLATION_PHOTOS.filter((p) => p.service === serviceSlug);
  return matched.length > 0 ? matched : HERO_SCROLL_IMAGES.slice(0, 8);
}
