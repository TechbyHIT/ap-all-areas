import { BUSINESS_CONFIG } from "@/config/business";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BUSINESS_CONFIG.name,
    url: BUSINESS_CONFIG.websiteUrl,
    logo: `${BUSINESS_CONFIG.websiteUrl}${BUSINESS_CONFIG.logoCircle ?? BUSINESS_CONFIG.logo}`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BUSINESS_CONFIG.phone.display,
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: input.url,
    provider: {
      "@type": "Organization",
      name: BUSINESS_CONFIG.name,
    },
    areaServed: input.areaServed ?? "Andhra Pradesh, India",
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
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

export function localBusinessSchema() {
  // Require verified coordinates before emitting LocalBusiness geo markup.
  const hasAddress = BUSINESS_CONFIG.coordinates.latitude !== null;

  if (!hasAddress) return null;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BUSINESS_CONFIG.name,
    image: `${BUSINESS_CONFIG.websiteUrl}${BUSINESS_CONFIG.logo}`,
    telephone: BUSINESS_CONFIG.phone.display,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_CONFIG.address.street,
      addressLocality: BUSINESS_CONFIG.address.city,
      addressRegion: BUSINESS_CONFIG.address.state,
      postalCode: BUSINESS_CONFIG.address.postalCode,
      addressCountry: BUSINESS_CONFIG.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_CONFIG.coordinates.latitude,
      longitude: BUSINESS_CONFIG.coordinates.longitude,
    },
    areaServed: {
      "@type": "State",
      name: "Andhra Pradesh",
    },
  };
}
