import Link from "next/link";
import { getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import type { ServiceFamily } from "@/data/service-families";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { RelatedGuides } from "@/components/sections/RelatedGuides";
import { ServiceCityAreaLinks } from "@/components/sections/ServiceCityAreaLinks";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { INITIAL_SERVICE_MAP } from "@/data/initial-services";
import { PROBLEMS } from "@/data/problems";

type ServiceFamilyPageViewProps = {
  family: ServiceFamily;
};

export function ServiceFamilyPageView({ family }: ServiceFamilyPageViewProps) {
  const media = getServiceMedia(family.primaryServiceSlug);
  const primary = INITIAL_SERVICE_MAP[family.primaryServiceSlug];

  const problemLinks = family.relatedProblemSlugs
    .map((slug) => PROBLEMS.find((p) => p.slug === slug))
    .filter(Boolean)
    .map((problem) => ({
      name: problem!.name,
      href: ROUTES.solution(problem!.slug),
      summary: problem!.summary,
    }));

  const guides = family.relatedGuideSlugs.map((slug) => ({
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    href: ROUTES.guide(slug),
    summary: `Guidance related to ${family.shortName.toLowerCase()} planning.`,
  }));

  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services/" },
          { name: family.name, path: ROUTES.serviceFamily(family.slug) },
        ]}
      />
      <PageHero
        badge="Service family"
        title={family.h1}
        description={family.intro}
        composition="service-split"
        image={{ src: media.image, alt: media.alt }}
        gallery={media.gallery.map((src) => ({ src, alt: media.alt }))}
        actions={
          <>
            <Link
              href={ROUTES.contact}
              className="inline-flex min-h-11 items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-amber-400"
            >
              Get Quote
            </Link>
            {primary ? (
              <Link
                href={ROUTES.service(primary.slug)}
                className="inline-flex min-h-11 items-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
              >
                View {primary.name}
              </Link>
            ) : null}
          </>
        }
      />

      <Section>
        <Container>
          <SectionHeading
            title="Who this family is for"
            description="Match your situation before opening a product page."
          />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {family.whoItsFor.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <SectionHeading
            title="How to choose"
            description="One primary decision path—avoid opening three thin product pages for the same intent."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {family.howToChoose.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            title="Compare options in this family"
            description="Each link opens a real service or solution page—not a duplicate keyword doorway."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {family.options.map((option) => (
              <article
                key={option.href + option.name}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  <Link href={option.href} className="hover:text-amber-700">
                    {option.name}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {option.summary}
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Best for: {option.bestFor}
                </p>
                <Link
                  href={option.href}
                  className="mt-4 inline-flex text-sm font-semibold text-amber-800 hover:underline"
                >
                  Open page →
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {problemLinks.length > 0 ? (
        <Section variant="muted">
          <Container>
            <SectionHeading
              title="Problems this family solves"
              description="Problem pages explain the situation; service pages explain the install."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {problemLinks.map((problem) => (
                <Link
                  key={problem.href}
                  href={problem.href}
                  className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-amber-300 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {problem.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {problem.summary}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <RelatedGuides
        title={`${family.shortName} guides`}
        description="Supporting articles in this topic cluster."
        guides={guides}
      />

      <ServiceCityAreaLinks
        serviceSlug={family.primaryServiceSlug}
        serviceName={primary?.name ?? family.shortName}
        title={`${family.shortName} in priority cities`}
        description="City pages own local intent. Open a city only when you need place-specific planning."
      />

      <FinalCTA
        title={`Need help choosing ${family.shortName.toLowerCase()}?`}
        description="Share opening photos on WhatsApp. We confirm coverage after reviewing your site—not from a map pin alone."
        whatsappMessage={`Hello, I need help choosing ${family.name.toLowerCase()} options in Andhra Pradesh.`}
      />
    </>
  );
}
