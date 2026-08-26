import {
  CORE_SERVICE_LINKS,
  SERVICE_DIRECTORY,
} from "@/data/service-directory";

import { ROUTES } from "@/config/routes";

export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services/" },
  { label: "Locations", href: "/locations/" },
  { label: "Projects", href: "/gallery/" },
  { label: "About", href: "/about/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contact", href: "/contact/" },
] as const;

/** Compact services list (legacy / simple menus). */
export const NAV_SERVICES = CORE_SERVICE_LINKS;

/** Full category list for mobile accordion. */
export const NAV_SERVICE_CATEGORIES = SERVICE_DIRECTORY;

export const NAV_LOCATIONS = [
  { label: "Visakhapatnam", href: ROUTES.location("visakhapatnam") },
  { label: "Vijayawada", href: ROUTES.location("vijayawada") },
  { label: "Guntur", href: ROUTES.location("guntur") },
  { label: "Tirupati", href: ROUTES.location("tirupati") },
  { label: "Rajahmundry", href: ROUTES.location("rajamahendravaram") },
  { label: "Kakinada", href: ROUTES.location("kakinada") },
  { label: "Nellore", href: ROUTES.location("nellore") },
  { label: "Kurnool", href: ROUTES.location("kurnool") },
  { label: "Anantapur", href: ROUTES.location("anantapur") },
  { label: "Eluru", href: "/locations/eluru/" },
  { label: "Vizianagaram", href: "/locations/vizianagaram/" },
  { label: "Andhra Pradesh hub", href: ROUTES.state },
  { label: "View All Locations", href: ROUTES.locations },
] as const;

/** Footer: category hubs only (full list lives in mega menu + /services/). */
export const FOOTER_SERVICES = SERVICE_DIRECTORY.map((category) => ({
  label: category.title,
  href: category.href ?? "/services/",
}));

export const FOOTER_LOCATIONS = [
  { label: "Visakhapatnam", href: ROUTES.location("visakhapatnam") },
  { label: "Vijayawada", href: ROUTES.location("vijayawada") },
  { label: "Guntur", href: ROUTES.location("guntur") },
  { label: "Tirupati", href: ROUTES.location("tirupati") },
  { label: "Rajamahendravaram", href: ROUTES.location("rajamahendravaram") },
  { label: "Kakinada", href: ROUTES.location("kakinada") },
  { label: "Nellore", href: ROUTES.location("nellore") },
  { label: "Kurnool", href: ROUTES.location("kurnool") },
  { label: "Anantapur", href: ROUTES.location("anantapur") },
  { label: "Andhra Pradesh", href: ROUTES.state },
] as const;

export const FOOTER_QUICK_LINKS = [
  { label: "Solutions", href: "/solutions/" },
  { label: "Guides", href: "/guides/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Gallery", href: "/gallery/" },
  { label: "Blog", href: "/blog/" },
  { label: "Testimonials", href: "/testimonials/" },
] as const;

export const FOOTER_POLICY_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Terms & Conditions", href: "/terms-and-conditions/" },
  { label: "Disclaimer", href: "/disclaimer/" },
] as const;
