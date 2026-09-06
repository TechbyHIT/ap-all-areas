/**
 * Geographic silo for Hiranya Enterprises — Andhra Pradesh local SEO.
 * Keep this file small and edge-safe (imported by proxy.ts).
 */

export const STATE_SLUG = "andhra-pradesh";
export const STATE_NAME = "Andhra Pradesh";

/** Cities with unique local profiles — index-ready city hubs. */
export const SILO_CITY_SLUGS = [
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

export type SiloCitySlug = (typeof SILO_CITY_SLUGS)[number];

export const CITY_ALIASES: Record<string, string> = {
  vizag: "visakhapatnam",
  visakha: "visakhapatnam",
  rajahmundry: "rajamahendravaram",
};

/** Core service hubs (not sub-services). */
export const CORE_SERVICE_SLUGS = [
  "invisible-grills",
  "safety-nets",
  "sports-nets",
  "cloth-drying-hangers",
] as const;

/**
 * Specialist → parent hub. Used for materials/FAQ fallbacks, not for
 * collapsing public URLs — each specialist keeps its own city and area page.
 */
export const SERVICE_PARENT_BY_SLUG: Record<string, string> = {
  "balcony-invisible-grills": "invisible-grills",
  "window-invisible-grills": "invisible-grills",
  "invisible-grills-for-apartments": "invisible-grills",
  "invisible-grills-for-villas": "invisible-grills",
  "balcony-safety-nets": "safety-nets",
  "children-safety-nets": "safety-nets",
  "pet-safety-nets": "safety-nets",
  "pigeon-safety-nets": "safety-nets",
  "pigeon-nets": "safety-nets",
  "anti-pigeon-nets": "safety-nets",
  "balcony-pigeon-nets": "safety-nets",
  "window-pigeon-nets": "safety-nets",
  "duct-area-pigeon-nets": "safety-nets",
  "terrace-safety-nets": "safety-nets",
  "cricket-practice-nets": "sports-nets",
  "balcony-cloth-hangers": "cloth-drying-hangers",
};

export const SERVICE_SLUG_REDIRECTS: Record<string, string> = {
  "pigeon-nets": "pigeon-safety-nets",
  "anti-pigeon-nets": "pigeon-safety-nets",
};

/**
 * Every service slug that owns its own city and area URL.
 *
 * Sub-services are included: each one covers a different opening, audience and
 * specification, so it earns a location page instead of folding into the four
 * core hubs. Pure alias slugs stay out — they 308 to their canonical.
 */
export const LOCATION_SERVICE_SLUGS: string[] = [
  ...CORE_SERVICE_SLUGS,
  ...Object.keys(SERVICE_PARENT_BY_SLUG).filter(
    (slug) => !(slug in SERVICE_SLUG_REDIRECTS),
  ),
];

const LOCATION_SERVICE_SET = new Set(LOCATION_SERVICE_SLUGS);

/** True when the slug may appear as the service segment of a location URL. */
export function isLocationServiceSlug(slug: string): boolean {
  return LOCATION_SERVICE_SET.has(slug);
}

/**
 * The slug a location URL should actually use. Aliases resolve to their
 * canonical sub-service; everything else keeps its own identity.
 */
export function locationServiceSlug(slug: string): string | null {
  const canonical = SERVICE_SLUG_REDIRECTS[slug] ?? slug;
  return LOCATION_SERVICE_SET.has(canonical) ? canonical : null;
}

/** Unique area landings that should render at the silo area+service URL. */
export const AREA_MONEY_LANDING_KEYS = [
  "invisible-grills/andhra-pradesh/visakhapatnam/gajuwaka",
] as const;
