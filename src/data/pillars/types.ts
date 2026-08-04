export type PillarLink = {
  label: string;
  href: string;
  note?: string;
};

export type PillarFaq = {
  question: string;
  answer: string;
};

export type PillarSection =
  | {
      kind: "prose";
      id: string;
      heading: string;
      paragraphs: string[];
    }
  | {
      kind: "split-list";
      id: string;
      heading: string;
      lead: string;
      items: Array<{ title: string; body: string }>;
    }
  | {
      kind: "comparison";
      id: string;
      heading: string;
      lead: string;
      rows: Array<{
        option: string;
        bestWhen: string;
        watchOut: string;
      }>;
    }
  | {
      kind: "pricing";
      id: string;
      heading: string;
      lead: string;
      bands: Array<{
        context: string;
        rangeNote: string;
        drivers: string;
      }>;
      disclaimer: string;
    }
  | {
      kind: "process";
      id: string;
      heading: string;
      lead: string;
      steps: Array<{ title: string; detail: string }>;
    }
  | {
      kind: "link-graph";
      id: string;
      heading: string;
      lead: string;
      links: PillarLink[];
    }
  | {
      kind: "faq";
      id: string;
      heading: string;
      items: PillarFaq[];
    };

export type PillarPage = {
  citySlug: string;
  serviceSlug: string;
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  openGraphTitle: string;
  openGraphDescription: string;
  hero: {
    badge: string;
    h1: string;
    deck: string;
    trustLine: string;
    whatsappMessage: string;
  };
  entityGraph: {
    primary: string[];
    climate: string[];
    transport: string[];
    landmarks: string[];
    apartments: string[];
    nearbyServices: string[];
  };
  sections: PillarSection[];
  finalCta: {
    title: string;
    description: string;
    whatsappMessage: string;
  };
};
