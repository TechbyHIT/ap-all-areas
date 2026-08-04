import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/config/business";
import { getRobotsDirective } from "@/lib/publishing/indexability";
import type { PageIndexabilityInput } from "@/types/page";

export type PageMetadataInput = PageIndexabilityInput & {
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  openGraphImageAlt?: string;
  twitterTitle?: string;
  twitterDescription?: string;
};

export function generatePageMetadata(page: PageMetadataInput): Metadata {
  const robots = getRobotsDirective(page);

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: page.canonicalUrl },
    robots: {
      index: robots.index,
      follow: robots.follow,
      googleBot: {
        index: robots.index,
        follow: robots.follow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: page.openGraphTitle ?? page.title,
      description: page.openGraphDescription ?? page.metaDescription,
      url: page.canonicalUrl,
      siteName: BUSINESS_CONFIG.name,
      type: "website",
      images: page.openGraphImage
        ? [
            {
              url: page.openGraphImage,
              width: 1200,
              height: 630,
              alt: page.openGraphImageAlt ?? page.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: page.twitterTitle ?? page.title,
      description: page.twitterDescription ?? page.metaDescription,
      images: page.openGraphImage ? [page.openGraphImage] : undefined,
    },
  };
}

export function generateTitle(
  primary: string,
  pattern: "service" | "location" | "service-location" | "service-area" | "default" = "default",
): string {
  const patterns: Record<string, string[]> = {
    service: [`${primary} in Andhra Pradesh`, `${primary} Installation Andhra Pradesh`],
    location: [`${primary} Service Coverage`, `Safety Solutions in ${primary}`],
    "service-location": [
      `${primary}`,
      `${primary} — Service Available`,
    ],
    "service-area": [`${primary}`, `${primary} Installation`],
    default: [primary],
  };
  const options = patterns[pattern] ?? patterns.default;
  return options[0];
}

export function generateDescription(
  service: string,
  location?: string,
): string {
  if (location) {
    return `Professional ${service} installation service available in ${location}, Andhra Pradesh. Coverage subject to site confirmation. Request a free quotation.`;
  }
  return `Professional ${service} installation across Andhra Pradesh. Quality materials, expert installation and safety-focused solutions. Request a quotation.`;
}
