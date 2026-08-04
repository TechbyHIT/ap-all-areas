import {
  CORE_SERVICE_LINKS,
  SERVICE_DIRECTORY,
} from "@/data/service-directory";

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
  { label: "Visakhapatnam", href: "/locations/visakhapatnam/" },
  { label: "Vijayawada", href: "/locations/vijayawada/" },
  { label: "Guntur", href: "/locations/guntur/" },
  { label: "Tirupati", href: "/locations/tirupati/" },
  { label: "Rajahmundry", href: "/locations/rajamahendravaram/" },
  { label: "Kakinada", href: "/locations/kakinada/" },
  { label: "Nellore", href: "/locations/nellore/" },
  { label: "Kurnool", href: "/locations/kurnool/" },
  { label: "Anantapur", href: "/locations/anantapur/" },
  { label: "Eluru", href: "/locations/eluru/" },
  { label: "Vizianagaram", href: "/locations/vizianagaram/" },
  { label: "Nearby Areas", href: "/locations/" },
  { label: "View All Locations", href: "/locations/" },
] as const;

/** Footer: category hubs only (full list lives in mega menu + /services/). */
export const FOOTER_SERVICES = SERVICE_DIRECTORY.map((category) => ({
  label: category.title,
  href: category.href ?? "/services/",
}));

export const FOOTER_LOCATIONS = [
  { label: "Visakhapatnam", href: "/locations/visakhapatnam/" },
  { label: "Vijayawada", href: "/locations/vijayawada/" },
  { label: "Guntur", href: "/locations/guntur/" },
  { label: "Tirupati", href: "/locations/tirupati/" },
  { label: "Rajamahendravaram", href: "/locations/rajamahendravaram/" },
  { label: "Kakinada", href: "/locations/kakinada/" },
  { label: "Nellore", href: "/locations/nellore/" },
  { label: "Kurnool", href: "/locations/kurnool/" },
  { label: "Anantapur", href: "/locations/anantapur/" },
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
