/**
 * Blog listing data with featured images for homepage / teaser cards.
 */

export type BlogPostMeta = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  image: string;
  imageAlt: string;
};

export const HOME_BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "balcony-safety-tips-andhra-pradesh",
    title: "Balcony Safety Tips for Andhra Pradesh Homes",
    summary:
      "Practical safety steps for families with children and pets in flats and villas across Andhra Pradesh.",
    publishedAt: "2026-08-01",
    image: "/images/projects/balcony-invisible-grills-8.jpg",
    imageAlt: "Balcony invisible grill installation overlooking the city",
  },
  {
    slug: "pigeon-net-vs-invisible-grill",
    title: "Pigeon Net vs Invisible Grill — Which Is Better?",
    summary:
      "Compare bird control and fall-protection options for apartment balconies before you request a quote.",
    publishedAt: "2026-07-15",
    image: "/images/projects/balcony-safety-nets-13.jpg",
    imageAlt: "Balcony safety net used for pigeon and bird protection",
  },
  {
    slug: "how-to-choose-cloth-drying-hangers",
    title: "How to Choose Cloth Drying Hangers for Apartments",
    summary:
      "Ceiling, pulley and balcony hangers that free railing space in compact Andhra Pradesh flats.",
    publishedAt: "2026-07-01",
    image: "/images/projects/cloth-hangers-9.jpeg",
    imageAlt: "Ceiling cloth drying hanger installation",
  },
  {
    slug: "children-safety-nets-buying-checklist",
    title: "Children Safety Nets: A Buying Checklist",
    summary:
      "Mesh spacing, coverage and handover checks that matter when toddlers use balconies.",
    publishedAt: "2026-06-20",
    image: "/images/projects/children-safety-nets-1.jpg",
    imageAlt: "Children safety net on a residential balcony",
  },
  {
    slug: "sports-nets-for-terrace-practice",
    title: "Sports Nets for Terrace & Home Practice",
    summary:
      "What to plan for cricket practice nets on terraces and coaching spaces without disturbing neighbours.",
    publishedAt: "2026-06-05",
    image: "/images/projects/cricket-nets-4.jpg",
    imageAlt: "Cricket practice net enclosure",
  },
  {
    slug: "duct-area-bird-control-basics",
    title: "Duct Area Bird Control Basics",
    summary:
      "Why pigeons nest in ducts and how shaft nets close entry without blocking service access.",
    publishedAt: "2026-05-22",
    image: "/images/projects/duct-area-nets-1.jpg",
    imageAlt: "Duct area safety net installation",
  },
];
