import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const PROBLEMS = [
  {
    title: "Keep the view open",
    description:
      "Compare slim invisible grills and low-visibility nets for front-facing balconies, windows, and high-rise views across Andhra Pradesh.",
    image: "/images/projects/balcony-invisible-grills-8.jpg",
    links: [
      { label: "Invisible grills", href: "/services/invisible-grills/" },
      { label: "Transparent-style nets", href: "/services/safety-nets/" },
    ],
  },
  {
    title: "Protect children or pets",
    description:
      "Start with the opening and how it is used—balcony railing, staircase side, window, terrace edge, or pet corner.",
    image: "/images/projects/children-safety-nets-1.jpg",
    links: [
      { label: "Child safety", href: "/solutions/child-balcony-safety/" },
      { label: "Pet safety", href: "/solutions/pet-balcony-safety/" },
    ],
  },
  {
    title: "Stop birds returning",
    description:
      "Use full-opening nets for balconies and ducts, or targeted bird spikes for narrow ledges where birds perch.",
    image: "/images/projects/duct-area-nets-1.jpg",
    links: [
      { label: "Pigeon nets", href: "/solutions/pigeon-infestation/" },
      { label: "Bird spikes", href: "/solutions/building-bird-entry/" },
    ],
  },
  {
    title: "Understand the price",
    description:
      "A useful estimate should account for measured opening, net or grill type, access, fixing surface, and finish.",
    image: "/images/projects/balcony-safety-nets-12.jpg",
    links: [
      { label: "See price factors", href: "/pricing-guide/" },
      { label: "Request an estimate", href: "/contact/" },
    ],
  },
] as const;

const POPULAR = [
  {
    title: "Balcony Safety Nets",
    description:
      "A practical choice when children, pets, or daily balcony use need safer edges—measured to your railing and wall points.",
    href: "/services/safety-nets/",
    image: "/images/projects/balcony-safety-nets-12.jpg",
  },
  {
    title: "Pigeon Safety Nets",
    description:
      "Useful for balconies, ledges, shafts, and window gaps where pigeons keep sitting or nesting.",
    href: "/solutions/pigeon-infestation/",
    image: "/images/projects/balcony-safety-nets-13.jpg",
  },
  {
    title: "Invisible Grills",
    description:
      "Best for families who want balcony safety without closing the view—stainless cables with neat spacing and firm anchoring.",
    href: "/services/invisible-grills/",
    image: "/images/projects/balcony-invisible-grills-10.jpg",
  },
  {
    title: "Children Safety Nets",
    description:
      "Planned for open balconies, windows, staircases, and terrace edges in homes with young children.",
    href: "/solutions/child-balcony-safety/",
    image: "/images/projects/children-safety-nets-1.jpg",
  },
  {
    title: "Cricket Practice Nets",
    description:
      "For terraces, coaching spaces, schools, and home practice areas that need safer ball containment.",
    href: "/solutions/cricket-practice-space/",
    image: "/images/projects/cricket-nets-4.jpg",
  },
  {
    title: "Cloth Hangers",
    description:
      "Ceiling and balcony cloth hanger systems that make drying easier without using floor space.",
    href: "/services/cloth-drying-hangers/",
    image: "/images/projects/cloth-hangers-9.jpeg",
  },
] as const;

export function SolutionsGrid() {
  return (
    <>
      <Section>
        <Container>
          <p className="ds-eyebrow">
            Find your starting point
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            What do you want the safety net to solve?
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Choosing by the problem is faster than comparing dozens of product
            names. Pick the closest need now; the exact mesh, cable, spacing, and
            fixing can be confirmed after measurement.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEMS.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10] bg-zinc-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {item.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {item.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm font-semibold text-[var(--color-link)] hover:underline"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <p className="ds-eyebrow">
            Popular safety net services
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Start with the result you need, then compare the right fitting
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Common choices for Andhra Pradesh homes, bird-control needs, and
            practice spaces. Each card shows a real installation photograph.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <Link href={item.href} className="relative block aspect-[16/10] bg-zinc-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </Link>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {item.description}
                  </p>
                  <Link
                    href={item.href}
                    className="mt-4 inline-block text-sm font-semibold text-[var(--color-link)] hover:underline"
                  >
                    Compare {item.title} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
