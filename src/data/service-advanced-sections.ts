/**
 * Extra §13 service-page sections — honest, no invented credentials.
 * Merged at render time with SERVICE_PAGE_CONTENT.
 */

export type ServiceAdvancedSections = {
  whoNeeds: { title: string; description: string }[];
  howToChoose: { title: string; description: string }[];
  limitations: string[];
  whenAnotherServiceBetter: { title: string; description: string; href?: string }[];
};

export const SERVICE_ADVANCED_SECTIONS: Record<string, ServiceAdvancedSections> =
  {
    "invisible-grills": {
      whoNeeds: [
        {
          title: "Families wanting a clearer view than iron grills",
          description:
            "Households that want continuous fall protection at balconies and windows without a heavy cage look.",
        },
        {
          title: "Apartment and villa openings at reachable height",
          description:
            "Sit-outs, bedroom windows and stair voids where children or pets can reach the edge.",
        },
        {
          title: "Homes that already discussed society drilling rules",
          description:
            "Flats where exterior work needs association approval, lift booking and neighbour-facing care.",
        },
      ],
      howToChoose: [
        {
          title: "Match spacing to the real risk",
          description:
            "Closer spacing for child or pet briefs; living balconies may prioritise outlook. Decide after seeing the opening.",
        },
        {
          title: "Confirm frame and anchor points",
          description:
            "Wire systems need sound fixing. Weak parapets or decorative rails change the plan.",
        },
        {
          title: "Compare with safety nets on utility openings",
          description:
            "Large utility rectangles and bird-heavy ledges are often better as nets. Living balconies may suit grills.",
        },
      ],
      limitations: [
        "Invisible grills are not a guarantee against climbing from furniture placed against the opening.",
        "Coastal and dusty sites need honest cleaning and hardware discussion—no rust-proof fantasy claims.",
        "Society rules, access height and neighbour elevations can delay or change the install method.",
        "We do not invent fixed package prices; quotation follows measurement.",
      ],
      whenAnotherServiceBetter: [
        {
          title: "Safety nets for large utility or bird-pressure balconies",
          description:
            "When the brief is broad coverage for pigeons or a fast rectangle enclose, nets are often the clearer fit.",
          href: "/services/safety-nets/",
        },
        {
          title: "Balcony safety family for mixed needs",
          description:
            "If you are unsure between nets and grills, start with the balcony-safety choose page.",
          href: "/services/balcony-safety/",
        },
      ],
    },
    "safety-nets": {
      whoNeeds: [
        {
          title: "Parents and pet owners securing sit-outs",
          description:
            "Balconies and voids where continuous mesh coverage is needed at reach height.",
        },
        {
          title: "Homes with pigeon or bird roosting",
          description:
            "AC ledges, ducts and unused balconies where birds land repeatedly.",
        },
        {
          title: "Utility and terrace openings",
          description:
            "Drying balconies, shafts and terrace edges that need broad, practical coverage.",
        },
      ],
      howToChoose: [
        {
          title: "Define the job: fall stop, bird block, or both",
          description:
            "Mesh size and colour follow the brief. Child/pet and bird control are not identical installs.",
        },
        {
          title: "Check doors, drains and outdoor units",
          description:
            "Nets must leave doors usable and not trap debris against floor drains.",
        },
        {
          title: "Use invisible grills when outlook is the priority",
          description:
            "Living balconies that need a lighter look may suit stainless-wire grills instead.",
        },
      ],
      limitations: [
        "Safety nets do not replace adult supervision or remove climbable furniture near the edge.",
        "Bird netting protects specific openings; it does not clear every bird from a neighbourhood.",
        "High-rise and duct work depend on access equipment and society permissions.",
        "Pricing is measurement-based—no statewide flat rate cards.",
      ],
      whenAnotherServiceBetter: [
        {
          title: "Invisible grills for open-view living balconies",
          description:
            "When appearance and airflow matter more than mesh coverage, compare invisible grills.",
          href: "/services/invisible-grills/",
        },
        {
          title: "Bird-control family for roost-focused briefs",
          description:
            "If the main problem is pigeons on ledges and ducts, start with the bird-control pillar.",
          href: "/services/bird-control/",
        },
      ],
    },
    "sports-nets": {
      whoNeeds: [
        {
          title: "Home practice and terrace cricket",
          description:
            "Households enclosing a practice lane or keeping balls inside a plot boundary.",
        },
        {
          title: "Academies, schools and clubs",
          description:
            "Coaches who need practice cages sized to bowling length and shared use.",
        },
        {
          title: "Multi-sport or box-cricket courts",
          description:
            "Community spaces that need side and roof enclosure beyond balcony mesh.",
        },
      ],
      howToChoose: [
        {
          title: "Size to the game, not to a balcony drawing",
          description:
            "Bowling length, side run-off and roof height drive the quote.",
        },
        {
          title: "Plan neighbours and lighting",
          description:
            "Open practice near houses needs honest boundary planning.",
        },
        {
          title: "Confirm ground fixing",
          description:
            "Posts and anchors depend on ground type and landlord or society permission.",
        },
      ],
      limitations: [
        "Sports nets are not balcony safety mesh—materials and posts differ.",
        "We do not promise tournament-grade performance without measuring the plot.",
        "Indoor vs outdoor cages change fixing, mesh and access completely.",
        "Coverage is confirmed after site review; listing a city is not a branch claim.",
      ],
      whenAnotherServiceBetter: [
        {
          title: "Balcony safety nets for fall protection at home",
          description:
            "If the need is child or pet safety on a sit-out, use safety nets—not sports yarn.",
          href: "/services/safety-nets/",
        },
        {
          title: "Sports-enclosures family for layout decisions",
          description:
            "Start with the sports family page when comparing cricket, box-cricket and school options.",
          href: "/services/sports-enclosures/",
        },
      ],
    },
    "cloth-drying-hangers": {
      whoNeeds: [
        {
          title: "Apartments with limited drying space",
          description:
            "Flats that need overhead or wall hangers on a small balcony.",
        },
        {
          title: "Balconies that already have nets or grills",
          description:
            "Utility installs that must share space with safety systems and outdoor units.",
        },
        {
          title: "Monsoon-season drying planning",
          description:
            "Homes that need a planned height when outdoor lines stay wet.",
        },
      ],
      howToChoose: [
        {
          title: "Measure after seeing the balcony",
          description:
            "Hanger travel must clear doors, nets and AC units.",
        },
        {
          title: "Coordinate with safety installs",
          description:
            "If a net or grill is planned, design anchors and drip lines together.",
        },
        {
          title: "Match mechanism to daily use",
          description:
            "Ceiling pulley, wall-mounted and balcony hangers suit different habits.",
        },
      ],
      limitations: [
        "Hangers are a utility install—not a structural safety barrier for children or pets.",
        "Society rules may limit ceiling drilling or outer-face hardware.",
        "We do not invent capacity claims without seeing the span and wall/ceiling type.",
        "Quotation follows measurement and access confirmation.",
      ],
      whenAnotherServiceBetter: [
        {
          title: "Safety nets when fall protection is the real need",
          description:
            "If the balcony edge is unsafe, solve fall protection first, then plan hangers.",
          href: "/services/safety-nets/",
        },
        {
          title: "Cloth-drying family for option comparison",
          description:
            "Use the cloth-drying pillar to compare hanger types and related problem pages.",
          href: "/services/cloth-drying/",
        },
      ],
    },
  };

export function getServiceAdvancedSections(
  serviceSlug: string,
): ServiceAdvancedSections | null {
  return SERVICE_ADVANCED_SECTIONS[serviceSlug] ?? null;
}
