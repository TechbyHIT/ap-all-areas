export type {
  ContentModule,
  ContentModuleType,
  FaqContentModule,
  FaqItem,
} from "@/types/content";

import type { ContentModule, FaqContentModule } from "@/types/content";

export const SAMPLE_CONTENT_MODULES: ContentModule[] = [
  {
    id: "module-service-intro-invisible-grills",
    type: "service-intro",
    title: "Invisible Grills Service Introduction",
    heading: "What Are Invisible Grills and Why Homeowners Choose Them",
    body:
      "Invisible grills are stainless steel safety grills fixed along balconies, windows and open edges using strong anchor points. Unlike traditional iron grills, they use slim horizontal cables or rods spaced closely to reduce fall risk while keeping the view largely open. Across Andhra Pradesh, flat and villa owners choose invisible grills when they want child and pet safety without a heavy visual block. The right specification depends on floor height, gap size, wind exposure and whether the property is an apartment, villa or high-rise tower.",
    bulletPoints: [
      "Suitable for balconies, windows, staircases and terraces",
      "Commonly used for child and pet safety",
      "Preferred where light and view should remain largely open",
      "Installed after on-site measurement and fixing assessment",
    ],
    applicablePageTypes: ["service", "service-location", "service-area"],
    applicableServices: ["invisible-grills"],
    priority: 10,
    minWordCount: 80,
    maxWordCount: 180,
  },
  {
    id: "module-local-intro-template",
    type: "local-intro",
    title: "Local Service Introduction Template",
    heading: "Professional Installation Service Available in Your Area",
    body:
      "We provide measurement, quotation and installation support for customers in this location across Andhra Pradesh. Service availability is confirmed after a quick site review because balcony design, society guidelines and access conditions can vary from one neighbourhood to another. Our team focuses on neat finishing, secure fixing and practical recommendations based on your property type and daily usage needs.",
    bulletPoints: [
      "Service-area coverage subject to site confirmation",
      "On-site measurement before final quotation",
      "Support for apartments, villas and independent houses",
      "Clear guidance on material and fixing options",
    ],
    applicablePageTypes: ["service-location", "service-area", "location"],
    priority: 20,
    minWordCount: 70,
    maxWordCount: 150,
  },
  {
    id: "module-customer-problem-child-safety",
    type: "customer-problem",
    title: "Child Safety Problem Module",
    heading: "When Balcony Safety Becomes a Daily Worry",
    body:
      "Many families contact us after noticing wide railing gaps, low parapet height or active children using balcony spaces regularly. The goal is not only to install a product, but to reduce daily anxiety with a solution matched to the opening size, floor height and maintenance expectations. We explain the difference between invisible grills and safety nets so you can choose based on ventilation, appearance and long-term upkeep.",
    bulletPoints: [
      "Identify high-risk openings first",
      "Compare invisible grills and safety nets honestly",
      "Recommend fixing based on wall or railing condition",
      "Plan child-safe coverage without unnecessary clutter",
    ],
    applicablePageTypes: ["solution", "service-location", "property-type-service"],
    applicableServices: ["invisible-grills", "safety-nets"],
    priority: 15,
  },
  {
    id: "module-benefits-safety-nets",
    type: "benefits",
    title: "Safety Nets Benefits Module",
    heading: "Key Benefits of Installing Safety Nets at Home",
    body:
      "Safety nets offer a practical barrier for balconies, ducts, terraces and windows where bird control or fall protection is needed. Quality nets are UV-stabilised, tensioned properly and fixed with durable hooks or anchor systems suited to the surface. For many Andhra Pradesh homes, nets are a cost-effective way to handle pigeon problems and open-edge safety in one planned installation.",
    bulletPoints: [
      "Helps reduce bird entry and nesting in open areas",
      "Can provide protection at balconies, ducts and terraces",
      "Allows ventilation compared with solid grill panels",
      "Useful where quick coverage is needed across larger spans",
    ],
    applicablePageTypes: ["service", "service-location", "solution"],
    applicableServices: ["safety-nets"],
    priority: 25,
  },
  {
    id: "module-features-invisible-grills",
    type: "features",
    title: "Invisible Grills Features Module",
    heading: "Features That Matter in a Good Invisible Grill Installation",
    body:
      "A reliable invisible grill installation depends as much on fixing quality as on the steel itself. We look at grade of stainless steel, spacing between cables or rods, anchor depth, corner finishing and alignment across the opening. In coastal cities such as Visakhapatnam, corrosion resistance is especially important, so material selection and edge sealing should not be treated as optional.",
    bulletPoints: [
      "Stainless steel components selected for outdoor exposure",
      "Spacing planned for child or pet safety requirements",
      "Secure anchor fixing based on surface condition",
      "Neat alignment and finish for visible balcony areas",
    ],
    applicablePageTypes: ["service", "service-location", "guide"],
    applicableServices: ["invisible-grills"],
    priority: 30,
  },
  {
    id: "module-materials-sports-nets",
    type: "materials",
    title: "Sports Nets Materials Module",
    heading: "Materials Used for Cricket and Multi-Sport Practice Nets",
    body:
      "Sports net installations typically combine galvanised steel posts, heavy-duty nylon or polyethylene net panels, tension ropes and ground fixing accessories. Net mesh size and thickness depend on the sport, ball impact level and whether the setup is outdoor or indoor. For academy and school use, we recommend heavier specifications because daily training creates far more wear than occasional home practice.",
    bulletPoints: [
      "Galvanised posts for outdoor durability",
      "Sport-specific mesh size and net thickness",
      "Tensioning accessories for long-span stability",
      "Optional gate arrangement for academy lanes",
    ],
    applicablePageTypes: ["service", "guide", "property-type-service"],
    applicableServices: ["sports-nets"],
    priority: 35,
  },
  {
    id: "module-installation-process",
    type: "installation",
    title: "Standard Installation Process Module",
    heading: "How Our Installation Process Works",
    body:
      "Our standard process starts with requirement discussion, followed by site measurement and quotation sharing. After you approve the specification, we schedule installation with the required anchors, accessories and skilled fitters. We check alignment, tension and basic safety before handover, and explain simple maintenance steps so you know what to inspect periodically at home or on site.",
    bulletPoints: [
      "Step 1: Requirement call and basic opening details",
      "Step 2: Site visit and exact measurement",
      "Step 3: Quotation with material and scope clarity",
      "Step 4: Installation, finishing and basic usage guidance",
    ],
    applicablePageTypes: [
      "service",
      "service-location",
      "service-area",
      "guide",
    ],
    priority: 40,
  },
  {
    id: "module-measurement-process",
    type: "measurement",
    title: "Measurement Process Module",
    heading: "Why Accurate Measurement Matters Before Quotation",
    body:
      "Accurate measurement prevents cost surprises and helps choose the right fixing method. Our team measures width, height, depth, gap spacing and surface condition at each opening. For apartments and high-rise flats, we also note society constraints and safe access for installation. Correct measurements are especially important for invisible grills, custom sports nets and ceiling cloth hanger layouts.",
    bulletPoints: [
      "Measure every opening separately",
      "Record surface type for anchor selection",
      "Confirm access and working conditions on site",
      "Share final scope before installation booking",
    ],
    applicablePageTypes: ["service", "service-location", "guide"],
    priority: 45,
  },
  {
    id: "module-pricing-factors",
    type: "pricing-factors",
    title: "Pricing Factors Module",
    heading: "What Affects the Final Quotation",
    body:
      "Pricing depends on opening size, material grade, number of openings, fixing difficulty, floor access and travel to location. A single balcony invisible grill quote can differ from a full flat package covering windows and utility areas. We share item-wise scope where possible so you can stage the work by priority instead of guessing from a generic rate card.",
    bulletPoints: [
      "Total measurable area and number of openings",
      "Material grade and custom specifications",
      "Height, access and working conditions",
      "Add-ons such as extra corners, gates or pulley lines",
    ],
    applicablePageTypes: ["service", "service-location", "pricing-guide"],
    priority: 50,
  },
  {
    id: "module-maintenance-cloth-hangers",
    type: "maintenance",
    title: "Cloth Hanger Maintenance Module",
    heading: "Simple Maintenance for Cloth Drying Hangers",
    body:
      "Cloth drying hangers usually need only basic care if installed correctly. Wipe stainless steel parts periodically, check pulley smoothness, and avoid overloading beyond recommended capacity. In coastal or high-humidity areas, inspect screws and anchors every few months. Proper usage habits extend the life of pulley ropes, hooks and ceiling brackets significantly.",
    bulletPoints: [
      "Do not exceed recommended load capacity",
      "Clean pulley tracks and hooks periodically",
      "Check anchor tightness after heavy seasonal use",
      "Report stiffness or noise early for simple adjustment",
    ],
    applicablePageTypes: ["service", "guide", "service-location"],
    applicableServices: ["cloth-drying-hangers"],
    priority: 55,
  },
  {
    id: "module-local-coverage",
    type: "local-coverage",
    title: "Local Coverage Module",
    heading: "Service Coverage in Andhra Pradesh",
    body:
      "We serve customers across Andhra Pradesh with installation support available in major cities, towns and nearby localities subject to site confirmation. Coverage is managed as a service-area business, so scheduling depends on team availability, access conditions and project scope in your exact locality. Nearby areas may also be supported when routing and installation planning allow efficient service.",
    bulletPoints: [
      "Statewide service-area coverage model",
      "Site confirmation required for exact locality",
      "Support for urban, semi-urban and town locations",
      "Nearby area service may be possible based on routing",
    ],
    applicablePageTypes: ["service-location", "service-area", "location"],
    priority: 60,
  },
  {
    id: "module-related-services",
    type: "related-services",
    title: "Related Services Module",
    heading: "Related Solutions You May Also Consider",
    body:
      "Many customers review related services together during a home safety or utility upgrade. For example, balcony invisible grills are often checked alongside bird nets, window grills or cloth drying hangers for utility balconies. Combining related solutions in one site visit can reduce repeated measurement visits and help you plan a cleaner overall installation schedule.",
    bulletPoints: [
      "Review complementary safety and utility options together",
      "Combine site visits where possible",
      "Prioritise high-risk openings first",
      "Ask for staged quotation if budget planning is needed",
    ],
    applicablePageTypes: ["service", "service-location", "solution"],
    priority: 65,
  },
  {
    id: "module-cta-request-quote",
    type: "cta",
    title: "Request Quote CTA Module",
    heading: "Request a Site Measurement or Quotation",
    body:
      "Share your location, property type and opening photos if available. We will guide you on the suitable service, explain the next steps and arrange site measurement for an accurate quotation. Final pricing and installation timing are confirmed only after assessing the site conditions in person.",
    bulletPoints: [
      "Share location and service requirement",
      "Send opening photos for faster initial guidance",
      "Book site visit for exact measurement",
      "Receive quotation with clear scope before work starts",
    ],
    applicablePageTypes: [
      "service",
      "service-location",
      "service-area",
      "solution",
      "property-type-service",
    ],
    priority: 90,
  },
];

export const SAMPLE_FAQ_MODULE: FaqContentModule = {
  id: "module-faq-general-services",
  type: "faq",
  title: "General Services FAQ Module",
  heading: "Frequently Asked Questions",
  body:
    "These are common questions customers ask before booking invisible grills, safety nets, sports nets or cloth drying hangers in Andhra Pradesh.",
  applicablePageTypes: ["service", "service-location", "faq"],
  priority: 70,
  faqItems: [
    {
      question: "Do you provide installation across Andhra Pradesh?",
      answer:
        "We serve customers across Andhra Pradesh on a service-area basis. Exact availability in your locality is confirmed after checking location, access and project scope.",
    },
    {
      question: "How do I get an accurate quotation?",
      answer:
        "An accurate quotation usually requires site measurement because opening size, fixing surface and number of points vary from home to home.",
    },
    {
      question: "Which is better — invisible grills or safety nets?",
      answer:
        "It depends on your need. Invisible grills are often preferred for long-term child safety with a neat look, while nets are commonly chosen for bird control and quick large-area coverage.",
    },
    {
      question: "How long does installation usually take?",
      answer:
        "Small balcony work may finish the same day, while multi-opening or custom sports net projects can take longer depending on measurements and fixing conditions.",
    },
    {
      question: "Are materials suitable for outdoor and coastal weather?",
      answer:
        "We recommend stainless steel or UV-stabilised net materials for outdoor use. Final specification is suggested after checking exposure and location conditions on site.",
    },
  ],
};

export const CONTENT_MODULE_MAP: Record<string, ContentModule | FaqContentModule> =
  Object.fromEntries(
    [...SAMPLE_CONTENT_MODULES, SAMPLE_FAQ_MODULE].map((item) => [item.id, item]),
  );

export function selectContentModules(options: {
  pageType: string;
  serviceSlug?: string;
  maxModules?: number;
}): Array<ContentModule | FaqContentModule> {
  const max = options.maxModules ?? 6;
  const all: Array<ContentModule | FaqContentModule> = [
    ...SAMPLE_CONTENT_MODULES,
    SAMPLE_FAQ_MODULE,
  ];
  return all
    .filter((module) => module.applicablePageTypes.includes(options.pageType))
    .filter((module) => {
      if (!options.serviceSlug || !module.applicableServices?.length) return true;
      return module.applicableServices.includes(options.serviceSlug);
    })
    .sort((a, b) => a.priority - b.priority)
    .slice(0, max);
}

export const CONTENT_MODULES_BY_TYPE: Record<
  ContentModule["type"],
  Array<ContentModule | FaqContentModule>
> = [...SAMPLE_CONTENT_MODULES, SAMPLE_FAQ_MODULE].reduce(
  (accumulator, module) => {
    const existing = accumulator[module.type] ?? [];
    existing.push(module);
    accumulator[module.type] = existing;
    return accumulator;
  },
  {} as Record<ContentModule["type"], Array<ContentModule | FaqContentModule>>,
);
