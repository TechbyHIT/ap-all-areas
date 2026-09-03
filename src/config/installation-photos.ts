/**
 * Installation photos (Aug 2026 WhatsApp set). All live under
 * /public/images/projects/installations/ as optimized WebP (§139).
 *
 * Alt text describes what is visible (§62). Location fields stay null until
 * verified — never invent city/property claims on photos (§63).
 */

export type InstallationPhoto = {
  src: string;
  alt: string;
  service: string;
  /** Verified only — omit rather than guess */
  citySlug?: string | null;
  localitySlug?: string | null;
  propertyTypeSlug?: string | null;
  application?: string | null;
};

export const INSTALLATION_PHOTOS: InstallationPhoto[] = [
  {
    src: "/images/projects/installations/night-balcony-safety-net.webp",
    alt: "Balcony safety net installed across an apartment balcony at night",
    service: "safety-nets",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/cloth-drying-hanger-ceiling.webp",
    alt: "Ceiling-mounted cloth drying hanger fixed on a balcony soffit",
    service: "cloth-drying-hangers",
    application: "utility-drying",
  },
  {
    src: "/images/projects/installations/atrium-invisible-grill-circle.webp",
    alt: "Circular atrium invisible grill cables spanning an indoor void",
    service: "invisible-grills",
    application: "void-protection",
  },
  {
    src: "/images/projects/installations/indoor-cricket-practice-nets.webp",
    alt: "Indoor cricket practice net lanes inside a covered enclosure",
    service: "sports-nets",
    application: "sports-enclosure",
  },
  {
    src: "/images/projects/installations/outdoor-cricket-cage-nets.webp",
    alt: "Outdoor cricket practice cage enclosed with sports nets",
    service: "sports-nets",
    application: "sports-enclosure",
  },
  {
    src: "/images/projects/installations/highrise-green-safety-net-up.webp",
    alt: "Green balcony safety net viewed looking up a high-rise opening",
    service: "safety-nets",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/facade-balcony-safety-nets.webp",
    alt: "Green balcony safety nets fitted across a multi-floor building facade",
    service: "safety-nets",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/installer-harness-green-net.webp",
    alt: "Installer in a harness securing green safety netting on site",
    service: "safety-nets",
    application: "installation-process",
  },
  {
    src: "/images/projects/installations/night-invisible-grills-city.webp",
    alt: "Invisible grill wires across a balcony with city lights beyond",
    service: "invisible-grills",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/balcony-mesh-view-apartments.webp",
    alt: "Balcony safety mesh with neighbouring apartment buildings in view",
    service: "safety-nets",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/sports-net-enclosure-wide.webp",
    alt: "Wide outdoor sports net enclosure around a practice area",
    service: "sports-nets",
    application: "sports-enclosure",
  },
  {
    src: "/images/projects/installations/green-facade-netting-street.webp",
    alt: "Green facade safety netting on a building viewed from street level",
    service: "safety-nets",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/balcony-white-net-palm.webp",
    alt: "White balcony safety net overlooking palm trees",
    service: "safety-nets",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/balcony-white-net-palm-alt.webp",
    alt: "Balcony invisible grill cables overlooking palm trees",
    service: "invisible-grills",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/invisible-grill-construction-view.webp",
    alt: "Invisible grill cables with a construction site visible beyond",
    service: "invisible-grills",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/balcony-white-net-residential.webp",
    alt: "White residential balcony safety net with tree view",
    service: "safety-nets",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/invisible-grill-day-city.webp",
    alt: "Daytime invisible grill across a balcony with city buildings beyond",
    service: "invisible-grills",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/balcony-net-daylight-view.webp",
    alt: "Balcony safety net in daylight with an open outdoor view",
    service: "safety-nets",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/balcony-safety-net-detail.webp",
    alt: "Close detail of balcony safety net mesh and edge fixing",
    service: "safety-nets",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/balcony-safety-net-detail-b.webp",
    alt: "Invisible grill cables fixed along a terrace ledge",
    service: "invisible-grills",
    application: "terrace-protection",
  },
  {
    src: "/images/projects/installations/balcony-safety-net-detail-c.webp",
    alt: "Balcony safety net corner fixing detail",
    service: "safety-nets",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/project-install-31.webp",
    alt: "Completed balcony safety net installation on an apartment opening",
    service: "safety-nets",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/project-install-32.webp",
    alt: "Completed invisible grill installation across a balcony opening",
    service: "invisible-grills",
    application: "balcony-protection",
  },
  {
    src: "/images/projects/installations/project-install-32b.webp",
    alt: "Invisible grill installed on a glass balcony railing",
    service: "invisible-grills",
    application: "balcony-protection",
  },
];

/** Full set for homepage rotation / gallery (every photo). */
export const HOME_ROTATION_PHOTOS = INSTALLATION_PHOTOS;

/**
 * Hero bleed uses cover-fit — prefer wider, clear compositions that fill the
 * frame without awkward letterboxing.
 */
const HERO_SRCS = new Set([
  "/images/projects/installations/invisible-grill-day-city.webp",
  "/images/projects/installations/night-balcony-safety-net.webp",
  "/images/projects/installations/night-invisible-grills-city.webp",
  "/images/projects/installations/balcony-mesh-view-apartments.webp",
  "/images/projects/installations/balcony-white-net-palm.webp",
  "/images/projects/installations/balcony-net-daylight-view.webp",
  "/images/projects/installations/outdoor-cricket-cage-nets.webp",
  "/images/projects/installations/atrium-invisible-grill-circle.webp",
  "/images/projects/installations/highrise-green-safety-net-up.webp",
  "/images/projects/installations/facade-balcony-safety-nets.webp",
  "/images/projects/installations/cloth-drying-hanger-ceiling.webp",
]);

export const HERO_SCROLL_IMAGES = INSTALLATION_PHOTOS.filter((photo) =>
  HERO_SRCS.has(photo.src),
);

export function installationPhotosForService(serviceSlug: string) {
  const matched = INSTALLATION_PHOTOS.filter((p) => p.service === serviceSlug);
  return matched.length > 0 ? matched : HERO_SCROLL_IMAGES;
}
