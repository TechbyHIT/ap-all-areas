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
 * Public sub-service slugs that should resolve to a parent service
 * in the location silo (city + service pages stay on the four cores).
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

/** Unique area landings that should render at the silo area+service URL. */
export const AREA_MONEY_LANDING_KEYS = [
  "invisible-grills/andhra-pradesh/visakhapatnam/gajuwaka",
] as const;
