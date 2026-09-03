import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/config/business";
import { getRobotsDirective } from "@/lib/publishing/indexability";
import type { PageIndexabilityInput } from "@/types/page";
import {
  buildIntentTitle,
  buildMetaDescription,
  type TitleIntent,
} from "@/lib/seo/title-meta-system";

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

/** §78 Intent-based titles (preferred for new pages). */
export function generateTitle(
  primary: string,
  pattern:
    | "service"
    | "location"
    | "service-location"
    | "service-area"
    | "guide"
    | "comparison"
    | "default" = "default",
  extras?: { city?: string; locality?: string },
): string {
  const intentMap: Record<string, TitleIntent> = {
    service: "service",
    location: "local",
    "service-location": "local",
    "service-area": "locality",
    guide: "guide",
    comparison: "comparison",
    default: "default",
  };

  if (pattern === "service-location" && extras?.city) {
    return buildIntentTitle({
      intent: "local",
      primary,
      city: extras.city,
    });
  }
  if (pattern === "service-area" && extras?.city && extras?.locality) {
    return buildIntentTitle({
      intent: "locality",
      primary,
      city: extras.city,
      locality: extras.locality,
    });
  }
  if (pattern === "location" && extras?.city) {
    return buildIntentTitle({
      intent: "local",
      primary,
      city: extras.city,
    });
  }

  return buildIntentTitle({
    intent: intentMap[pattern] ?? "default",
    primary,
    city: extras?.city,
    locality: extras?.locality,
  });
}

/** §79 Unique meta descriptions with differentiator + optional CTA. */
export function generateDescription(
  service: string,
  location?: string,
  differentiator =
    "Coverage is confirmed after site review — not a claimed local branch",
  cta = "Request a measured quotation",
): string {
  return buildMetaDescription({
    service,
    location,
    differentiator,
    cta,
  });
}
