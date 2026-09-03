/**
 * Service-family pillars — choose/compare hubs above individual services.
 * Slugs must not collide with INITIAL_SERVICES or SUB_SERVICES.
 */

import { ROUTES } from "@/config/routes";
import type { KeywordClusterId } from "@/types/keyword-ownership";

export type ServiceFamilyOption = {
  name: string;
  href: string;
  summary: string;
  bestFor: string;
};

export type ServiceFamily = {
  slug: string;
  name: string;
  shortName: string;
  /** Maps to keyword-ownership clusters for internal linking. */
  keywordClusters: KeywordClusterId[];
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  whoItsFor: string[];
  howToChoose: Array<{ title: string; body: string }>;
  options: ServiceFamilyOption[];
  relatedProblemSlugs: string[];
  relatedGuideSlugs: string[];
  relatedCitySlugs: string[];
  primaryServiceSlug: string;
};

export const SERVICE_FAMILIES: ServiceFamily[] = [
  {
    slug: "balcony-safety",
    name: "Balcony Safety",
    shortName: "Balcony Safety",
    keywordClusters: ["safety-nets", "invisible-grills", "child-pet-safety"],
    h1: "Balcony Safety Solutions in Andhra Pradesh",
    metaTitle:
      "Balcony Safety — Nets vs Invisible Grills in Andhra Pradesh",
    metaDescription:
      "Compare balcony safety nets and invisible grills for child, pet and fall protection across Andhra Pradesh. Choose the right opening solution after measurement.",
    intro:
      "Balcony safety is not one product. Families in Andhra Pradesh flats and villas usually need either a tensioned safety net, a stainless-steel invisible grill, or a mix on different openings. This pillar helps you choose by how the balcony is used—not by copying a neighbour’s install.",
    whoItsFor: [
      "Parents securing sit-outs and reachable rail gaps",
      "Pet owners whose cats or dogs test balcony edges",
      "Homeowners who want a clearer view than heavy iron grills",
      "Apartments that need society-friendly drilling and finish",
    ],
    howToChoose: [
      {
        title: "Start with the job: fall stop, bird block, or both",
        body: "Child and pet fall protection needs continuous coverage at reach height. Bird control needs closed landing spots on ledges and returns. Many balconies need both—and the mesh or wire spacing should match that brief.",
      },
      {
        title: "Decide how much view and airflow you want",
        body: "Invisible grills keep a more open look with stainless wires. Safety nets are faster to cover large rectangles and utility balconies. Neither is “better” in every opening—site photos decide.",
      },
      {
        title: "Check access, railing and society rules",
        body: "High-rise access, neighbour-facing elevations and association rules often decide schedule and fixing method. We quote after measurement, not from a city-wide flat rate.",
      },
    ],
    options: [
      {
        name: "Safety Nets",
        href: ROUTES.service("safety-nets"),
        summary:
          "Tensioned netting for balconies, ducts and terraces when you need broad coverage for children, pets or birds.",
        bestFor: "Utility balconies, bird pressure, fast rectangle coverage",
      },
      {
        name: "Invisible Grills",
        href: ROUTES.service("invisible-grills"),
        summary:
          "Stainless-steel wire systems for a clearer view with a continuous barrier at railing and window gaps.",
        bestFor: "Living balconies and windows where appearance matters",
      },
      {
        name: "Balcony Safety Nets",
        href: ROUTES.service("balcony-safety-nets"),
        summary:
          "Balcony-focused netting planned around railings, side returns and day-to-day use.",
        bestFor: "Sit-outs used for drying, plants or seating",
      },
      {
        name: "Balcony Invisible Grills",
        href: ROUTES.service("balcony-invisible-grills"),
        summary:
          "Wire layouts for balcony railings, corners and AC ledges without a cage look.",
        bestFor: "Open-view balconies in apartments and villas",
      },
      {
        name: "Children Safety Nets",
        href: ROUTES.service("children-safety-nets"),
        summary:
          "Mesh and height planned for child reach—not a claim that furniture climbing is impossible.",
        bestFor: "Play-facing balconies and voids",
      },
      {
        name: "Pet Safety Nets",
        href: ROUTES.service("pet-safety-nets"),
        summary:
          "Side gaps and ledge coverage for pets that push and climb at edges.",
        bestFor: "Cat and dog households on upper floors",
      },
    ],
    relatedProblemSlugs: [
      "child-balcony-safety",
      "pet-balcony-safety",
      "terrace-edge-protection",
      "open-window-risk",
    ],
    relatedGuideSlugs: [
      "invisible-grills-buying-guide",
      "safety-nets-installation-guide",
    ],
    relatedCitySlugs: ["visakhapatnam", "vijayawada", "guntur", "tirupati"],
    primaryServiceSlug: "safety-nets",
  },
  {
    slug: "bird-control",
    name: "Bird Control",
    shortName: "Bird Control",
    keywordClusters: ["bird-control", "safety-nets"],
    h1: "Bird Control Nets & Spikes in Andhra Pradesh",
    metaTitle:
      "Bird Control — Pigeon Nets & Protection in Andhra Pradesh",
    metaDescription:
      "Plan pigeon and bird control for balconies, windows and ducts across Andhra Pradesh. Compare nets and related solutions without fake branch claims.",
    intro:
      "Bird control closes the places pigeons and other birds actually land—AC trays, duct mouths, unused balconies and window ledges. Netting and related fixes are site-specific. We do not promise to clear every bird from a neighbourhood; we protect the openings you care about after a site look.",
    whoItsFor: [
      "Flats with roosting on AC ledges and railings",
      "Buildings with duct or shaft bird entry",
      "Homes dealing with droppings on usable balconies",
      "Societies planning honest, maintainable bird barriers",
    ],
    howToChoose: [
      {
        title: "Map the landing spots, not the whole elevation",
        body: "Effective bird work starts with where birds sit today. Closing one balcony while leaving a duct mouth open rarely solves the complaint.",
      },
      {
        title: "Match mesh and colour to the opening",
        body: "Balcony volumes, window ledges and ducts need different spans and access. Material choice follows the opening—not a decorative catalogue.",
      },
      {
        title: "Plan cleaning and society access",
        body: "High ledges and shafts need realistic access. Quotation depends on height, permissions and how the opening is used for drying or seating.",
      },
    ],
    options: [
      {
        name: "Pigeon Safety Nets",
        href: ROUTES.service("pigeon-safety-nets"),
        summary:
          "Bird-control netting for ledges, ducts and sit-outs where pigeons roost.",
        bestFor: "Repeated roosting on balconies and AC trays",
      },
      {
        name: "Balcony Pigeon Nets",
        href: ROUTES.service("balcony-pigeon-nets"),
        summary:
          "Netting for balconies used as roosts or drop zones around rails and outdoor units.",
        bestFor: "Usable sit-outs with bird pressure",
      },
      {
        name: "Window Pigeon Nets",
        href: ROUTES.service("window-pigeon-nets"),
        summary:
          "Compact nets for window ledges and chajjas without covering a full balcony.",
        bestFor: "Bedroom and kitchen window ledges",
      },
      {
        name: "Duct Area Pigeon Nets",
        href: ROUTES.service("duct-area-pigeon-nets"),
        summary:
          "Shaft and duct mouth netting where birds enter service voids.",
        bestFor: "Kitchen and toilet duct openings",
      },
      {
        name: "Pigeon Infestation Solution",
        href: ROUTES.solution("pigeon-infestation"),
        summary:
          "Problem-first guide to choosing bird control for Andhra Pradesh homes.",
        bestFor: "Understanding the problem before picking a product",
      },
      {
        name: "Building Bird Entry Solution",
        href: ROUTES.solution("building-bird-entry"),
        summary:
          "How bird entry points on buildings are assessed before installation.",
        bestFor: "Society and multi-opening buildings",
      },
    ],
    relatedProblemSlugs: ["pigeon-infestation", "building-bird-entry"],
    relatedGuideSlugs: ["safety-nets-installation-guide"],
    relatedCitySlugs: [
      "visakhapatnam",
      "vijayawada",
      "rajamahendravaram",
      "kakinada",
    ],
    primaryServiceSlug: "safety-nets",
  },
  {
    slug: "sports-enclosures",
    name: "Sports Enclosures",
    shortName: "Sports Nets",
    keywordClusters: ["sports-nets"],
    h1: "Sports Nets & Practice Enclosures in Andhra Pradesh",
    metaTitle:
      "Sports Nets — Cricket & Practice Enclosures in Andhra Pradesh",
    metaDescription:
      "Plan cricket practice nets and sports enclosures across Andhra Pradesh. Sized to your plot, bowling length and neighbouring houses—not balcony mesh.",
    intro:
      "Sports nets are a different product family from balcony safety mesh. Practice cages and boundary nets are sized to bowling length, side fencing and whether the space is open or covered. We plan around nearby houses and how many players share the lane.",
    whoItsFor: [
      "Home terraces used for casual cricket practice",
      "Academies and schools needing practice lanes",
      "Clubs enclosing box-cricket or multi-sport courts",
      "Plots that must keep balls inside the boundary",
    ],
    howToChoose: [
      {
        title: "Size to the game, not to a balcony drawing",
        body: "Cricket length, side run-off and roof height drive the quote. Sports yarn and posts differ from HDPE balcony netting.",
      },
      {
        title: "Respect neighbours and lighting",
        body: "Open practice areas near houses need honest boundary planning. Indoor or covered cages change fixing and mesh choice.",
      },
      {
        title: "Confirm ground fixing and access",
        body: "Installation still depends on ground anchors, society or landlord permission, and how equipment reaches the site.",
      },
    ],
    options: [
      {
        name: "Sports Nets",
        href: ROUTES.service("sports-nets"),
        summary:
          "Core sports-net installation for practice and enclosure needs across Andhra Pradesh.",
        bestFor: "General sports enclosure planning",
      },
      {
        name: "Cricket Practice Nets",
        href: ROUTES.service("cricket-practice-nets"),
        summary:
          "Practice cages and lanes sized to bowling length and plot constraints.",
        bestFor: "Home and academy cricket practice",
      },
      {
        name: "Cricket Practice Space Solution",
        href: ROUTES.solution("cricket-practice-space"),
        summary:
          "Problem page for homeowners and coaches planning a practice area.",
        bestFor: "Deciding layout before buying mesh",
      },
      {
        name: "Box Cricket Space Solution",
        href: ROUTES.solution("box-cricket-space"),
        summary:
          "Guidance for enclosing box-cricket and multi-use courts.",
        bestFor: "Shared community or club courts",
      },
    ],
    relatedProblemSlugs: [
      "cricket-practice-space",
      "box-cricket-space",
      "school-playground-enclosure",
      "indoor-sports-setup",
    ],
    relatedGuideSlugs: [],
    relatedCitySlugs: ["visakhapatnam", "vijayawada", "guntur", "nellore"],
    primaryServiceSlug: "sports-nets",
  },
  {
    slug: "cloth-drying",
    name: "Cloth Drying",
    shortName: "Cloth Drying",
    keywordClusters: ["cloth-drying-hangers"],
    h1: "Cloth Drying Hangers for Andhra Pradesh Homes",
    metaTitle:
      "Cloth Drying Hangers — Balcony & Ceiling Systems in Andhra Pradesh",
    metaDescription:
      "Choose ceiling, balcony and pulley cloth drying hangers that share space with nets and grills. Measured installs across Andhra Pradesh.",
    intro:
      "Cloth drying hangers have to share balcony space with safety nets, invisible grills and outdoor units. Pulley height, drip and neighbour sightlines are part of the brief. This family helps you pick a utility system that fits how clothes are dried today.",
    whoItsFor: [
      "Apartment balconies with limited drying space",
      "Homes that already have nets or grills on the sit-out",
      "Families wanting overhead pulley systems",
      "Monsoon-season drying that needs a planned height",
    ],
    howToChoose: [
      {
        title: "Measure the ceiling or wall after seeing the balcony",
        body: "Hanger travel must clear doors, nets and AC units. We quote after seeing the opening—not from a catalogue sketch.",
      },
      {
        title: "Coordinate with safety or bird netting",
        body: "If a net or grill is already planned, hanger anchors and drip lines should be designed together.",
      },
      {
        title: "Match the mechanism to daily use",
        body: "Ceiling pulley, wall-mounted and balcony hangers serve different habits. Pick for how clothes are actually dried.",
      },
    ],
    options: [
      {
        name: "Cloth Drying Hangers",
        href: ROUTES.service("cloth-drying-hangers"),
        summary:
          "Core hanger installation for Andhra Pradesh homes and apartments.",
        bestFor: "Most balcony and utility drying needs",
      },
      {
        name: "Balcony Cloth Hangers",
        href: ROUTES.service("balcony-cloth-hangers"),
        summary:
          "Ceiling and wall hangers planned for balcony drying without blocking doors or nets.",
        bestFor: "Sit-outs used mainly for laundry",
      },
      {
        name: "Limited Drying Space Solution",
        href: ROUTES.solution("limited-drying-space"),
        summary:
          "Problem page for flats that lack safe outdoor drying room.",
        bestFor: "Understanding options before choosing hardware",
      },
      {
        name: "Monsoon Drying Issue Solution",
        href: ROUTES.solution("monsoon-drying-issue"),
        summary:
          "Planning drying when rain and humidity limit outdoor lines.",
        bestFor: "Monsoon-heavy coastal cities",
      },
    ],
    relatedProblemSlugs: ["limited-drying-space", "monsoon-drying-issue"],
    relatedGuideSlugs: ["choosing-cloth-drying-hangers"],
    relatedCitySlugs: [
      "visakhapatnam",
      "vijayawada",
      "kakinada",
      "rajamahendravaram",
    ],
    primaryServiceSlug: "cloth-drying-hangers",
  },
];

export const SERVICE_FAMILY_SLUGS = SERVICE_FAMILIES.map((f) => f.slug);

export const SERVICE_FAMILY_MAP: Record<string, ServiceFamily> =
  Object.fromEntries(SERVICE_FAMILIES.map((f) => [f.slug, f]));

export function getServiceFamily(slug: string): ServiceFamily | null {
  return SERVICE_FAMILY_MAP[slug] ?? null;
}
