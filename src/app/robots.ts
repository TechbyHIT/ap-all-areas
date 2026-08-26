import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = SITE_CONFIG.url.replace(/\/$/, "");

  if (process.env.SEO_DISALLOW_ALL === "true") {
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
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
