import { BUSINESS_CONFIG } from "@/config/business";
import { P0_MONEY_CITY_SLUGS } from "@/data/city-local-profiles";
import {
  aggregateRatingFromReviews,
  listPublishableReviews,
  type GenuineReview,
} from "@/data/reviews";

const AP_CITY_LABELS: Record<string, string> = {
  visakhapatnam: "Visakhapatnam",
  vijayawada: "Vijayawada",
  guntur: "Guntur",
  tirupati: "Tirupati",
  rajahmundry: "Rajahmundry",
  kakinada: "Kakinada",
  nellore: "Nellore",
  kurnool: "Kurnool",
  anantapur: "Anantapur",
  eluru: "Eluru",
  vizianagaram: "Vizianagaram",
  srikakulam: "Srikakulam",
};

function areaServedCities() {
  return P0_MONEY_CITY_SLUGS.map((slug) => ({
    "@type": "City" as const,
    name: AP_CITY_LABELS[slug] ?? slug.replace(/-/g, " "),
  }));
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BUSINESS_CONFIG.name,
    url: BUSINESS_CONFIG.websiteUrl,
    logo: `${BUSINESS_CONFIG.websiteUrl}${BUSINESS_CONFIG.logoCircle ?? BUSINESS_CONFIG.logo}`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+91${BUSINESS_CONFIG.phone.raw.replace(/\D/g, "")}`,
      contactType: "customer service",
      areaServed: "IN-AP",
      availableLanguage: ["English", "Telugu"],
    },
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BUSINESS_CONFIG.name,
    url: BUSINESS_CONFIG.websiteUrl,
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  url: string;
  areaServed?: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: input.url,
    serviceType: input.serviceType ?? input.name,
    provider: {
      "@type": "Organization",
      name: BUSINESS_CONFIG.name,
      url: BUSINESS_CONFIG.websiteUrl,
    },
    areaServed: input.areaServed ?? "Andhra Pradesh, India",
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function webPageSchema(input: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: {
      "@type": "WebSite",
      name: BUSINESS_CONFIG.name,
      url: BUSINESS_CONFIG.websiteUrl,
    },
  };
}

/** §64 — only call with genuine published videos. */
export function videoObjectSchema(input: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  uploadDate: string;
  duration?: string;
  transcript?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: input.name,
    description: input.description,
    thumbnailUrl: input.thumbnailUrl,
    contentUrl: input.contentUrl,
    uploadDate: input.uploadDate,
    ...(input.duration ? { duration: input.duration } : {}),
    ...(input.transcript ? { transcript: input.transcript } : {}),
  };
}

export function imageObjectSchema(input: {
  contentUrl: string;
  description: string;
  name?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: input.contentUrl,
    description: input.description,
    ...(input.name ? { name: input.name } : {}),
  };
}

export function howToSchema(input: {
  name: string;
  description: string;
  steps: Array<{ title: string; detail: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.detail,
    })),
  };
}

export function itemListSchema(input: {
  name: string;
  items: Array<{ name: string; url: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * HomeAndConstructionBusiness — NAP + AP service area.
 * Geo only when verified. AggregateRating only with real reviews.
 */
export function localBusinessSchema() {
  const reviews = listPublishableReviews();
  const aggregate = aggregateRatingFromReviews(reviews);
  const hasGeo =
    BUSINESS_CONFIG.coordinates.latitude !== null &&
    BUSINESS_CONFIG.coordinates.longitude !== null;

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: BUSINESS_CONFIG.name,
    image: `${BUSINESS_CONFIG.websiteUrl}${BUSINESS_CONFIG.logo}`,
    url: BUSINESS_CONFIG.websiteUrl,
    telephone: `+91${BUSINESS_CONFIG.phone.raw.replace(/\D/g, "")}`,
    email: BUSINESS_CONFIG.email,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_CONFIG.address.street,
      addressLocality: BUSINESS_CONFIG.address.city,
      addressRegion: BUSINESS_CONFIG.address.state,
      postalCode: BUSINESS_CONFIG.address.postalCode,
      addressCountry: BUSINESS_CONFIG.address.country,
    },
    ...(hasGeo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: BUSINESS_CONFIG.coordinates.latitude,
            longitude: BUSINESS_CONFIG.coordinates.longitude,
          },
        }
      : {}),
    areaServed: [
      { "@type": "State", name: "Andhra Pradesh" },
      ...areaServedCities(),
    ],
    ...(aggregate
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: aggregate.ratingValue,
            reviewCount: aggregate.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

/** Review JSON-LD — only when approved genuine reviews exist. */
export function reviewsSchema(reviews?: GenuineReview[]) {
  const list = reviews ?? listPublishableReviews();
  const aggregate = aggregateRatingFromReviews(list);
  if (!aggregate || list.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BUSINESS_CONFIG.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: aggregate.ratingValue,
      reviewCount: aggregate.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: list.map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.customerLabel ?? r.reviewerName,
      },
      datePublished: r.date,
      reviewBody: r.reviewText,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}
