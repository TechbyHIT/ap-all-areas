import { BUSINESS_CONFIG } from "./business";

export const SITE_CONFIG = {
  name: BUSINESS_CONFIG.name,
  description: BUSINESS_CONFIG.description,
  url: BUSINESS_CONFIG.websiteUrl,
  locale: "en-IN",
  trailingSlash: true,
  defaultRevalidate: 86400,
} as const;
