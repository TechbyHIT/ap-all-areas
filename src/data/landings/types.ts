export type LandingFaq = { question: string; answer: string };

export type LandingLink = { label: string; href: string };

export type LandingReview = {
  author: string;
  locality: string;
  rating: number;
  quote: string;
  /** Only true when review is verified first-party / published consent */
  verified: boolean;
};

export type MoneyLanding = {
  serviceSlug: string;
  serviceName: string;
  stateSlug: string;
  stateName: string;
  citySlug: string;
  cityName: string;
  areaSlug?: string;
  areaName?: string;
  companyName: string;
  phoneDisplay: string;
  /** Public pretty URL path with trailing slash */
  slugPath: string;
  seo: {
    title: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
  };
  hero: {
    h1: string;
    subtitle: string;
  };
  introduction: string[];
  whoNeedsThis: Array<{ title: string; body: string }>;
  benefits: Array<{ title: string; body: string }>;
  features: Array<{ label: string; value: string }>;
  applications: string[];
  materials: string[];
  installationSteps: Array<{ title: string; detail: string }>;
  whyChooseUs: Array<{ title: string; body: string }>;
  serviceAreas: string[];
  pricing: {
    lead: string;
    factors: string[];
    disclaimer: string;
  };
  /** Empty unless real verified reviews exist */
  reviews: LandingReview[];
  galleryAlts: string[];
  faqs: LandingFaq[];
  relatedServices: LandingLink[];
  relatedCities: LandingLink[];
  internalLinks: LandingLink[];
  cta: {
    title: string;
    description: string;
    whatsappMessage: string;
  };
};
