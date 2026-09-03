/**
 * §95–97 Design system / mobile / a11y — token + checklist layer.
 * Visual tokens live in CSS variables; this documents SEO-supporting UX rules.
 */

export const DESIGN_SYSTEM_SURFACES = [
  "typography",
  "spacing",
  "colors",
  "cards",
  "buttons",
  "badges",
  "breadcrumbs",
  "accordions",
  "tables",
  "image-galleries",
  "service-cards",
  "location-cards",
  "project-cards",
  "reviews",
  "cta-sections",
] as const;

export const MOBILE_FIRST_CHECKS = [
  "readable-font-sizes",
  "thumb-friendly-buttons",
  "fast-navigation",
  "sticky-cta-where-appropriate",
  "simple-forms",
  "compressed-media",
  "accessible-menus",
  "no-seo-nav-overload",
] as const;

export const ACCESSIBILITY_CHECKS = [
  "semantic-html",
  "keyboard-navigation",
  "accessible-buttons",
  "form-labels",
  "alt-text",
  "proper-contrast",
  "focus-states",
  "aria-only-where-needed",
] as const;

export function designSystemCoverage(): {
  surfaces: readonly string[];
  mobile: readonly string[];
  a11y: readonly string[];
} {
  return {
    surfaces: DESIGN_SYSTEM_SURFACES,
    mobile: MOBILE_FIRST_CHECKS,
    a11y: ACCESSIBILITY_CHECKS,
  };
}
