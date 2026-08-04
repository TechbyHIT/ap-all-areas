export type ContentModuleType =
  | "service-intro"
  | "local-intro"
  | "customer-problem"
  | "service-explanation"
  | "benefits"
  | "features"
  | "materials"
  | "specifications"
  | "installation"
  | "measurement"
  | "safety-checks"
  | "maintenance"
  | "pricing-factors"
  | "property-recommendations"
  | "local-coverage"
  | "nearby-areas"
  | "related-services"
  | "faq"
  | "cta";

export type ContentModule = {
  id: string;
  type: ContentModuleType;
  title: string;
  heading: string;
  body: string;
  bulletPoints?: string[];
  applicablePageTypes: string[];
  applicableServices?: string[];
  applicablePropertyTypes?: string[];
  priority: number;
  minWordCount?: number;
  maxWordCount?: number;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqContentModule = ContentModule & {
  type: "faq";
  faqItems: FaqItem[];
};
