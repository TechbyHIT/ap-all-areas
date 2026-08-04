import type { PublicationStatus } from "./service";

export type Problem = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  publicationStatus: PublicationStatus;
  allowIndexing: boolean;
  summary: string;
  introduction: string;
  symptoms: string[];
  risks: string[];
  recommendedServices: string[];
  recommendedSubServiceSlugs: string[];
  suitablePropertyTypes: string[];
  primaryKeywords: string[];
  secondaryKeywords: string[];
  customerQuestions: string[];
  searchIntents: string[];
  contentReviewed: boolean;
  qualityScore: number;
  createdAt: string;
  updatedAt: string;
};
