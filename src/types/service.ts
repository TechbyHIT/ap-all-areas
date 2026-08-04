export type PublicationStatus =
  | "draft"
  | "review"
  | "published"
  | "noindex"
  | "archived";

export type SubService = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  parentServiceSlug: string;
  summary: string;
  introduction: string;
  benefits: string[];
  features: string[];
  applications: string[];
  materials: string[];
  primaryKeywords: string[];
  secondaryKeywords: string[];
  customerProblems: string[];
};

export type Service = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  categoryId: string;
  publicationStatus: PublicationStatus;
  allowIndexing: boolean;
  summary: string;
  introduction: string;
  detailedDescription: string;
  customerProblems: string[];
  benefits: string[];
  features: string[];
  applications: string[];
  materials: string[];
  specifications: string[];
  installationSteps: string[];
  safetyInformation: string[];
  maintenanceTips: string[];
  pricingFactors: string[];
  suitablePropertyTypes: string[];
  primaryKeywords: string[];
  secondaryKeywords: string[];
  customerQuestions: string[];
  searchIntents: string[];
  relatedServiceIds: string[];
  subServices: SubService[];
  heroImage: string;
  galleryImages: string[];
  contentReviewed: boolean;
  qualityScore: number;
  createdAt: string;
  updatedAt: string;
};
