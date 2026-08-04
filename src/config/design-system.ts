/**
 * Design system map for SK Invisible Grills.
 * Tokens live in src/styles/tokens.css — this file documents usage for engineers.
 */

export const DESIGN_SYSTEM = {
  brand: {
    primary: "Warm brass / gold — trustworthy local service, not purple SaaS",
    accent: "WhatsApp green — conversion CTAs only",
    ink: "Deep slate — typography and ink sections",
  },
  layoutInspiration: {
    reference: "hiranayaenterprises.in section flow only",
    flow: [
      "Hero",
      "About / intro",
      "Services",
      "Featured solutions",
      "Why choose",
      "Areas",
      "Gallery",
      "FAQ",
      "Final CTA",
    ],
    forbidden: "Do not copy CSS, colors, HTML, animations, or assets from any competitor",
  },
  performance: {
    avoid: [
      "Particle canvases on programmatic pages",
      "Heavy parallax on city/area templates",
      "Unverified animated counters",
      "Glow / neon stacks",
    ],
    prefer: [
      "CSS variables + cascade layers",
      "clamp() type scale",
      "Lazy images",
      "Reduced-motion respect",
    ],
  },
  pageTemplates: {
    moneyPage: "Focused CTA + local facts + FAQ + link graphs",
    guidePage: "Deep intent without padding location URLs",
  },
} as const;
