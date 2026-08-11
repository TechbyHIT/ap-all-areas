import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";

function isStagingHost(): boolean {
  if (process.env.SEO_ALLOW_INDEXING === "true") return false;
  if (process.env.SEO_DISALLOW_ALL === "true") return true;
  if (process.env.NODE_ENV !== "production") return true;

  try {
    const host = new URL(SITE_CONFIG.url).hostname.toLowerCase();
    return (
      host === "localhost" ||
      host.endsWith(".local") ||
      host.includes("staging") ||
      host.includes("preview")
    );
  } catch {
    return process.env.NODE_ENV !== "production";
  }
}

export default function robots(): MetadataRoute.Robots {
  const base = SITE_CONFIG.url.replace(/\/$/, "");

  if (isStagingHost()) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
      sitemap: `${base}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/thank-you/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
