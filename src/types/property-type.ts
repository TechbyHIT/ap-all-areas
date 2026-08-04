import type { PublicationStatus } from "./service";

export type PropertyType = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  publicationStatus: PublicationStatus;
  allowIndexing: boolean;
  summary: string;
  introduction: string;
  characteristics: string[];
  commonSafetyConcerns: string[];
  installationConsiderations: string[];
  suitableServices: string[];
  primaryKeywords: string[];
  secondaryKeywords: string[];
  customerQuestions: string[];
  contentReviewed: boolean;
  qualityScore: number;
  createdAt: string;
  updatedAt: string;
};
