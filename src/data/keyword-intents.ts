/**
 * Commercial / local / transactional keyword intents for programmatic SEO.
 * Used as URL + H1 modifiers with geo (city / area). Never publish thin
 * doorway pages without unique locality facts + parent links.
 */

export type KeywordIntent = {
  slug: string;
  phrase: string;
  /** Parent service for routing / internal links */
  serviceSlug: string;
  intent:
    | "commercial"
    | "transactional"
    | "price"
    | "near-me"
    | "comparison"
    | "problem"
    | "property";
  /** Higher = publish / index sooner */
  priority: 0 | 1 | 2;
};

/** Core money keywords — safety nets + all services into areas across Andhra Pradesh */
export const KEYWORD_INTENTS: KeywordIntent[] = [
  // —— Safety nets cluster ——
  { slug: "balcony-safety-nets", phrase: "Balcony Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "children-safety-nets", phrase: "Children Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "child-safety-nets", phrase: "Child Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "pet-safety-nets", phrase: "Pet Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "pigeon-safety-nets", phrase: "Pigeon Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "bird-protection-nets", phrase: "Bird Protection Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "terrace-safety-nets", phrase: "Terrace Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "duct-area-safety-nets", phrase: "Duct Area Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "window-safety-nets", phrase: "Window Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "staircase-safety-nets", phrase: "Staircase Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 1 },
  { slug: "monkey-safety-nets", phrase: "Monkey Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 1 },
  { slug: "anti-bird-nets", phrase: "Anti Bird Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "transparent-balcony-nets", phrase: "Transparent Balcony Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 1 },
  { slug: "hdpe-balcony-nets", phrase: "HDPE Balcony Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 1 },
  { slug: "nylon-safety-nets", phrase: "Nylon Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 1 },
  { slug: "best-safety-nets", phrase: "Best Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "safety-nets-for-balconies", phrase: "Safety Nets for Balconies", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "safety-nets-for-kids", phrase: "Safety Nets for Kids", serviceSlug: "safety-nets", intent: "problem", priority: 0 },
  { slug: "safety-nets-for-pets", phrase: "Safety Nets for Pets", serviceSlug: "safety-nets", intent: "problem", priority: 1 },
  { slug: "safety-nets-near-me", phrase: "Safety Nets Near Me", serviceSlug: "safety-nets", intent: "near-me", priority: 0 },
  { slug: "safety-net-installation", phrase: "Safety Net Installation", serviceSlug: "safety-nets", intent: "transactional", priority: 0 },
  { slug: "safety-net-price", phrase: "Safety Net Price", serviceSlug: "safety-nets", intent: "price", priority: 0 },
  { slug: "safety-net-cost", phrase: "Safety Net Cost", serviceSlug: "safety-nets", intent: "price", priority: 0 },
  { slug: "safety-net-rate", phrase: "Safety Net Rate", serviceSlug: "safety-nets", intent: "price", priority: 1 },
  { slug: "affordable-safety-nets", phrase: "Affordable Safety Nets", serviceSlug: "safety-nets", intent: "price", priority: 1 },
  { slug: "same-day-safety-nets", phrase: "Same Day Safety Nets", serviceSlug: "safety-nets", intent: "transactional", priority: 1 },
  { slug: "apartment-safety-nets", phrase: "Apartment Safety Nets", serviceSlug: "safety-nets", intent: "property", priority: 0 },
  { slug: "villa-safety-nets", phrase: "Villa Safety Nets", serviceSlug: "safety-nets", intent: "property", priority: 1 },
  { slug: "flat-safety-nets", phrase: "Flat Safety Nets", serviceSlug: "safety-nets", intent: "property", priority: 1 },
  { slug: "building-safety-nets", phrase: "Building Safety Nets", serviceSlug: "safety-nets", intent: "property", priority: 2 },
  { slug: "kitchen-balcony-safety-nets", phrase: "Kitchen Balcony Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 1 },
  { slug: "utility-balcony-nets", phrase: "Utility Balcony Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 1 },
  { slug: "ac-ledge-bird-nets", phrase: "AC Ledge Bird Nets", serviceSlug: "safety-nets", intent: "problem", priority: 1 },
  { slug: "open-shaft-safety-nets", phrase: "Open Shaft Safety Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 2 },
  { slug: "courtyard-bird-nets", phrase: "Courtyard Bird Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 2 },

  // —— Invisible grills ——
  { slug: "invisible-grills", phrase: "Invisible Grills", serviceSlug: "invisible-grills", intent: "commercial", priority: 0 },
  { slug: "balcony-invisible-grills", phrase: "Balcony Invisible Grills", serviceSlug: "invisible-grills", intent: "commercial", priority: 0 },
  { slug: "window-invisible-grills", phrase: "Window Invisible Grills", serviceSlug: "invisible-grills", intent: "commercial", priority: 0 },
  { slug: "staircase-invisible-grills", phrase: "Staircase Invisible Grills", serviceSlug: "invisible-grills", intent: "commercial", priority: 1 },
  { slug: "terrace-invisible-grills", phrase: "Terrace Invisible Grills", serviceSlug: "invisible-grills", intent: "commercial", priority: 1 },
  { slug: "ss-invisible-grills", phrase: "SS Invisible Grills", serviceSlug: "invisible-grills", intent: "commercial", priority: 0 },
  { slug: "stainless-steel-invisible-grills", phrase: "Stainless Steel Invisible Grills", serviceSlug: "invisible-grills", intent: "commercial", priority: 0 },
  { slug: "best-invisible-grills", phrase: "Best Invisible Grills", serviceSlug: "invisible-grills", intent: "commercial", priority: 0 },
  { slug: "invisible-grills-near-me", phrase: "Invisible Grills Near Me", serviceSlug: "invisible-grills", intent: "near-me", priority: 0 },
  { slug: "invisible-grill-installation", phrase: "Invisible Grill Installation", serviceSlug: "invisible-grills", intent: "transactional", priority: 0 },
  { slug: "invisible-grill-price", phrase: "Invisible Grill Price", serviceSlug: "invisible-grills", intent: "price", priority: 0 },
  { slug: "invisible-grill-cost", phrase: "Invisible Grill Cost", serviceSlug: "invisible-grills", intent: "price", priority: 0 },
  { slug: "invisible-grill-rate", phrase: "Invisible Grill Rate", serviceSlug: "invisible-grills", intent: "price", priority: 1 },
  { slug: "affordable-invisible-grills", phrase: "Affordable Invisible Grills", serviceSlug: "invisible-grills", intent: "price", priority: 1 },
  { slug: "invisible-grill-vs-safety-net", phrase: "Invisible Grill vs Safety Net", serviceSlug: "invisible-grills", intent: "comparison", priority: 0 },
  { slug: "invisible-grills-vs-iron-grills", phrase: "Invisible Grills vs Iron Grills", serviceSlug: "invisible-grills", intent: "comparison", priority: 1 },
  { slug: "apartment-invisible-grills", phrase: "Apartment Invisible Grills", serviceSlug: "invisible-grills", intent: "property", priority: 0 },
  { slug: "villa-invisible-grills", phrase: "Villa Invisible Grills", serviceSlug: "invisible-grills", intent: "property", priority: 1 },
  { slug: "child-safety-invisible-grills", phrase: "Child Safety Invisible Grills", serviceSlug: "invisible-grills", intent: "problem", priority: 0 },
  { slug: "pet-safe-invisible-grills", phrase: "Pet Safe Invisible Grills", serviceSlug: "invisible-grills", intent: "problem", priority: 1 },
  { slug: "openable-invisible-grills", phrase: "Openable Invisible Grills", serviceSlug: "invisible-grills", intent: "commercial", priority: 1 },
  { slug: "fixed-invisible-grills", phrase: "Fixed Invisible Grills", serviceSlug: "invisible-grills", intent: "commercial", priority: 2 },
  { slug: "transparent-invisible-grills", phrase: "Transparent Invisible Grills", serviceSlug: "invisible-grills", intent: "commercial", priority: 1 },
  { slug: "modern-invisible-grills", phrase: "Modern Invisible Grills", serviceSlug: "invisible-grills", intent: "commercial", priority: 2 },
  { slug: "invisible-grill-for-balcony", phrase: "Invisible Grill for Balcony", serviceSlug: "invisible-grills", intent: "commercial", priority: 0 },
  { slug: "invisible-grill-for-windows", phrase: "Invisible Grill for Windows", serviceSlug: "invisible-grills", intent: "commercial", priority: 1 },

  // —— Sports ——
  { slug: "sports-nets", phrase: "Sports Nets", serviceSlug: "sports-nets", intent: "commercial", priority: 0 },
  { slug: "cricket-practice-nets", phrase: "Cricket Practice Nets", serviceSlug: "sports-nets", intent: "commercial", priority: 0 },
  { slug: "box-cricket-nets", phrase: "Box Cricket Nets", serviceSlug: "sports-nets", intent: "commercial", priority: 0 },
  { slug: "football-nets", phrase: "Football Nets", serviceSlug: "sports-nets", intent: "commercial", priority: 1 },
  { slug: "volleyball-nets", phrase: "Volleyball Nets", serviceSlug: "sports-nets", intent: "commercial", priority: 2 },
  { slug: "badminton-nets", phrase: "Badminton Nets", serviceSlug: "sports-nets", intent: "commercial", priority: 2 },
  { slug: "terrace-cricket-nets", phrase: "Terrace Cricket Nets", serviceSlug: "sports-nets", intent: "commercial", priority: 0 },
  { slug: "sports-nets-near-me", phrase: "Sports Nets Near Me", serviceSlug: "sports-nets", intent: "near-me", priority: 0 },
  { slug: "cricket-net-installation", phrase: "Cricket Net Installation", serviceSlug: "sports-nets", intent: "transactional", priority: 0 },
  { slug: "cricket-net-price", phrase: "Cricket Net Price", serviceSlug: "sports-nets", intent: "price", priority: 0 },
  { slug: "cricket-net-cost", phrase: "Cricket Net Cost", serviceSlug: "sports-nets", intent: "price", priority: 1 },
  { slug: "school-sports-nets", phrase: "School Sports Nets", serviceSlug: "sports-nets", intent: "property", priority: 1 },
  { slug: "academy-cricket-nets", phrase: "Academy Cricket Nets", serviceSlug: "sports-nets", intent: "property", priority: 1 },
  { slug: "multi-sport-nets", phrase: "Multi Sport Nets", serviceSlug: "sports-nets", intent: "commercial", priority: 2 },

  // —— Cloth hangers ——
  { slug: "cloth-drying-hangers", phrase: "Cloth Drying Hangers", serviceSlug: "cloth-drying-hangers", intent: "commercial", priority: 0 },
  { slug: "ceiling-cloth-hangers", phrase: "Ceiling Cloth Hangers", serviceSlug: "cloth-drying-hangers", intent: "commercial", priority: 0 },
  { slug: "balcony-cloth-hangers", phrase: "Balcony Cloth Hangers", serviceSlug: "cloth-drying-hangers", intent: "commercial", priority: 0 },
  { slug: "pulley-cloth-hangers", phrase: "Pulley Cloth Hangers", serviceSlug: "cloth-drying-hangers", intent: "commercial", priority: 0 },
  { slug: "wall-mounted-cloth-hangers", phrase: "Wall Mounted Cloth Hangers", serviceSlug: "cloth-drying-hangers", intent: "commercial", priority: 1 },
  { slug: "foldable-cloth-hangers", phrase: "Foldable Cloth Hangers", serviceSlug: "cloth-drying-hangers", intent: "commercial", priority: 1 },
  { slug: "cloth-hangers-near-me", phrase: "Cloth Hangers Near Me", serviceSlug: "cloth-drying-hangers", intent: "near-me", priority: 0 },
  { slug: "cloth-hanger-installation", phrase: "Cloth Hanger Installation", serviceSlug: "cloth-drying-hangers", intent: "transactional", priority: 0 },
  { slug: "cloth-hanger-price", phrase: "Cloth Hanger Price", serviceSlug: "cloth-drying-hangers", intent: "price", priority: 0 },
  { slug: "cloth-hanger-cost", phrase: "Cloth Hanger Cost", serviceSlug: "cloth-drying-hangers", intent: "price", priority: 1 },
  { slug: "apartment-cloth-hangers", phrase: "Apartment Cloth Hangers", serviceSlug: "cloth-drying-hangers", intent: "property", priority: 1 },
  { slug: "overhead-cloth-drying-system", phrase: "Overhead Cloth Drying System", serviceSlug: "cloth-drying-hangers", intent: "commercial", priority: 1 },

  // —— Problem / bird control ——
  { slug: "bird-spikes", phrase: "Bird Spikes", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "pigeon-control", phrase: "Pigeon Control", serviceSlug: "safety-nets", intent: "problem", priority: 0 },
  { slug: "pigeon-netting", phrase: "Pigeon Netting", serviceSlug: "safety-nets", intent: "problem", priority: 0 },
  { slug: "bird-netting", phrase: "Bird Netting", serviceSlug: "safety-nets", intent: "commercial", priority: 0 },
  { slug: "stop-pigeons-on-balcony", phrase: "Stop Pigeons on Balcony", serviceSlug: "safety-nets", intent: "problem", priority: 0 },
  { slug: "pigeon-proofing", phrase: "Pigeon Proofing", serviceSlug: "safety-nets", intent: "problem", priority: 1 },
  { slug: "balcony-child-safety", phrase: "Balcony Child Safety", serviceSlug: "safety-nets", intent: "problem", priority: 0 },
  { slug: "pet-balcony-safety", phrase: "Pet Balcony Safety", serviceSlug: "safety-nets", intent: "problem", priority: 0 },
  { slug: "fall-protection-balcony", phrase: "Fall Protection Balcony", serviceSlug: "safety-nets", intent: "problem", priority: 1 },
  { slug: "bird-droppings-balcony", phrase: "Bird Droppings Balcony", serviceSlug: "safety-nets", intent: "problem", priority: 1 },
  { slug: "anti-pigeon-nets", phrase: "Anti Pigeon Nets", serviceSlug: "safety-nets", intent: "commercial", priority: 1 },
  { slug: "stainless-bird-spikes", phrase: "Stainless Bird Spikes", serviceSlug: "safety-nets", intent: "commercial", priority: 2 },
];

export const KEYWORD_INTENT_MAP: Record<string, KeywordIntent> = Object.fromEntries(
  KEYWORD_INTENTS.map((k) => [k.slug, k]),
);

export const KEYWORD_SLUGS: string[] = KEYWORD_INTENTS.map((k) => k.slug);

export function keywordsByPriority(priority: 0 | 1 | 2): KeywordIntent[] {
  return KEYWORD_INTENTS.filter((k) => k.priority <= priority);
}
