import { SITE_CONFIG } from "@/config/site";

const LIVE_ORIGIN = "https://hiranayaenterprises.in";

/** Canonical site origin for public URLs. Never emit localhost in production. */
export function publicSiteOrigin(): string {
  const configured = SITE_CONFIG.url.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    try {
      const host = new URL(configured).hostname;
      if (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "::1" ||
        host.endsWith(".local")
      ) {
        return LIVE_ORIGIN;
      }
    } catch {
      return LIVE_ORIGIN;
    }
  }
  return configured;
}

export function normalizePath(path: string): string {
  let normalized = path.toLowerCase();
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  if (SITE_CONFIG.trailingSlash && !normalized.endsWith("/")) {
    normalized = `${normalized}/`;
  }
  return normalized;
}

export function buildCanonicalUrl(path: string): string {
  return `${publicSiteOrigin()}${normalizePath(path)}`;
}

/** Absolute URL for a file path such as `/sitemap.xml`. Never adds a trailing slash. */
export function buildFileUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${publicSiteOrigin()}${normalized.replace(/\/+$/, "")}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
