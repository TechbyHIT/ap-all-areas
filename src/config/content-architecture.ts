/**
 * Page-tier content architecture for SK Invisible Grills.
 *
 * Principle: satisfy intent with the right page depth — do not pad every URL
 * toward 30k words. Invest surplus effort in photos, local FAQs, schema,
 * calculators, case studies, and unique nearby pages.
 *
 * Target ranges are editorial goals (useful unique words), not spam floors.
 */

export type PageTier =
  | "ultimate-service-guide"
  | "state"
  | "district"
  | "city"
  | "city-service"
  | "locality"
  | "locality-service"
  | "buying-guide"
  | "installation-guide"
  | "price-guide"
  | "maintenance-guide"
  | "faq-troubleshooting"
  | "service-hub"
  | "home"
  | "contact";

export type WordCountBand = {
  min: number;
  targetMin: number;
  targetMax: number;
  role: string;
};

/** Recommended unique-word bands by page type (user-aligned). */
export const PAGE_TIER_WORD_BANDS: Record<PageTier, WordCountBand> = {
  "ultimate-service-guide": {
    min: 8000,
    targetMin: 12000,
    targetMax: 20000,
    role: "Niche pillar that covers one service deeply across intents",
  },
  state: {
    min: 4000,
    targetMin: 6000,
    targetMax: 10000,
    role: "Andhra Pradesh / multi-district router + authority hub",
  },
  district: {
    min: 2000,
    targetMin: 3000,
    targetMax: 5000,
    role: "District context, cities, climate, coverage honesty",
  },
  city: {
    min: 1500,
    targetMin: 2000,
    targetMax: 4000,
    role: "City hub: services, areas, climate, photo CTA",
  },
  "city-service": {
    min: 1500,
    targetMin: 2000,
    targetMax: 4000,
    role: "Money page: company path, price factors, install, FAQs, links — not a novel",
  },
  locality: {
    min: 700,
    targetMin: 800,
    targetMax: 1500,
    role: "Locality hub: access, nearby, service links",
  },
  "locality-service": {
    min: 700,
    targetMin: 800,
    targetMax: 1500,
    role: "Local money page: quote path, local notes, parent links",
  },
  "buying-guide": {
    min: 4000,
    targetMin: 8000,
    targetMax: 12000,
    role: "Ultimate buying / comparison intent",
  },
  "installation-guide": {
    min: 3000,
    targetMin: 4000,
    targetMax: 6000,
    role: "Process, permissions, measurement, handover",
  },
  "price-guide": {
    min: 3000,
    targetMin: 4000,
    targetMax: 6000,
    role: "Price units, factors, quote comparison — no fake statewide rates",
  },
  "maintenance-guide": {
    min: 2500,
    targetMin: 4000,
    targetMax: 6000,
    role: "Care, retension, coastal / heat aftercare",
  },
  "faq-troubleshooting": {
    min: 2500,
    targetMin: 4000,
    targetMax: 6000,
    role: "PAA / troubleshooting cluster",
  },
  "service-hub": {
    min: 1500,
    targetMin: 2000,
    targetMax: 3500,
    role: "Parent service overview linking to cities + guides",
  },
  home: {
    min: 1200,
    targetMin: 1800,
    targetMax: 3000,
    role: "Problem-first router into services and cities",
  },
  contact: {
    min: 400,
    targetMin: 500,
    targetMax: 900,
    role: "Fast conversion + NAP + photo estimate",
  },
};

/** Prefer these investments over padding word count on money pages. */
export const NON_WORD_ROI_INVESTMENTS = [
  "Original project photos and before/after sets",
  "Short installation / site-visit videos",
  "Interactive cost calculator (measured inputs)",
  "Local FAQs per city and locality",
  "Area-specific testimonials (verified only)",
  "Apartment / society case studies with real constraints",
  "Comparison tables (grill vs net vs spikes)",
  "Rich JSON-LD (Service, FAQ, HowTo, Breadcrumb, ItemList)",
  "Strong contextual internal links (parent / child / nearby)",
  "Nearby locality and city×service expansion with unique facts",
] as const;

/**
 * If ~30k words of capacity exist, split across intent guides — not one URL.
 */
export const THIRTY_K_WORD_SPLIT = [
  { bucket: "Ultimate Buying Guide", words: 10000, tier: "buying-guide" as const },
  { bucket: "Installation Guide", words: 5000, tier: "installation-guide" as const },
  { bucket: "Price Guide", words: 5000, tier: "price-guide" as const },
  { bucket: "Maintenance Guide", words: 5000, tier: "maintenance-guide" as const },
  { bucket: "FAQ & Troubleshooting", words: 5000, tier: "faq-troubleshooting" as const },
] as const;

export function bandForTier(tier: PageTier): WordCountBand {
  return PAGE_TIER_WORD_BANDS[tier];
}

/** Indexability floor = tier minimum (never the target max). */
export function indexabilityFloor(tier: PageTier): number {
  return PAGE_TIER_WORD_BANDS[tier].min;
}
