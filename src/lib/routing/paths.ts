import { SITE_CONFIG } from "@/config/site";

export function normalizePath(path: string): string {
  let normalized = path.toLowerCase();
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  if (SITE_CONFIG.trailingSlash && !normalized.endsWith("/")) {
    normalized = `${normalized}/`;
  }
  return normalized;
}

export function buildCanonicalUrl(path: string): string {
  const base = SITE_CONFIG.url.replace(/\/$/, "");
  return `${base}${normalizePath(path)}`;
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
