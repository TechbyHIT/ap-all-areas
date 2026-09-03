import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ROUTES } from "@/config/routes";
import {
  getServiceComparison,
  SERVICE_COMPARISON_SLUGS,
} from "@/data/comparisons";
import { PROBLEM_MAP } from "@/data/problems";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";
import { buildComparisonTableRows } from "@/lib/seo/comparison-tables";
import { buildPageMediaBundle } from "@/lib/visual/page-media";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ comparisonSlug: string }>;
};

export function generateStaticParams() {
  return SERVICE_COMPARISON_SLUGS.map((comparisonSlug) => ({ comparisonSlug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { comparisonSlug } = await params;
  const comparison = getServiceComparison(comparisonSlug);
  if (!comparison) return {};

  return generatePageMetadata({
    title: comparison.metaTitle,
    metaDescription: comparison.metaDescription,
    canonicalUrl: buildCanonicalUrl(ROUTES.comparison(comparison.slug)),
    ...staticPageIndexability(true),
  });
}

export default async function ComparisonPage({ params }: PageProps) {
  const { comparisonSlug } = await params;
  const comparison = getServiceComparison(comparisonSlug);
  if (!comparison) notFound();

  const problems = comparison.relatedProblemSlugs
    .map((slug) => PROBLEM_MAP[slug])
    .filter(Boolean);

  const media = buildPageMediaBundle({
    pageType: "comparison",
    h1: comparison.h1,
    serviceSlug: "invisible-grills",
  });

  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Comparisons", path: ROUTES.comparisons },
          {
            name: comparison.h1,
            path: ROUTES.comparison(comparison.slug),
          },
        ]}
      />
      <PageHero
        badge="Comparison"
        title={comparison.h1}
        description={comparison.intro}
        composition="decision-split"
        trustNote="Factual comparison — choose after site review"
        image={{
          src: media.heroImage.src,
          alt: media.heroImage.alt,
        }}
        actions={
          <>
            <Link
              href={comparison.optionA.href}
              className="inline-flex min-h-11 items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-amber-400"
            >
              {comparison.optionA.name}
            </Link>
            <Link
              href={comparison.optionB.href}
              className="inline-flex min-h-11 items-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
            >
              {comparison.optionB.name}
            </Link>
          </>
        }
      />

      <Section>
        <Container>
          <SectionHeading
            title="Side-by-side comparison"
            description="Best for, installation, visibility, maintenance, durability and cost factors — factual only."
          />
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-3 pr-4 font-semibold text-zinc-900 dark:text-zinc-50">
                    Factor
                  </th>
                  <th className="py-3 pr-4 font-semibold text-zinc-900 dark:text-zinc-50">
                    {comparison.optionA.name}
                  </th>
                  <th className="py-3 font-semibold text-zinc-900 dark:text-zinc-50">
                    {comparison.optionB.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {buildComparisonTableRows(comparison).map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-zinc-100 align-top dark:border-zinc-900"
                  >
                    <td className="py-3 pr-4 font-medium text-zinc-800 dark:text-zinc-200">
                      {row.label}
                    </td>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">
                      {row.optionA}
                    </td>
                    <td className="py-3 text-zinc-600 dark:text-zinc-400">
                      {row.optionB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <SectionHeading title="Ideal customer & application" />
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {comparison.optionA.name}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Customer:</strong> {comparison.idealCustomerA}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Application:</strong> {comparison.idealApplicationA}
              </p>
            </article>
            <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {comparison.optionB.name}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Customer:</strong> {comparison.idealCustomerB}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Application:</strong> {comparison.idealApplicationB}
              </p>
            </article>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading title="Which option is right for you?" />
          <ul className="mt-6 max-w-3xl space-y-3">
            {comparison.decisionHelp.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
              >
                {item}
              </li>
            ))}
          </ul>
          {comparison.relatedFamilySlug ? (
            <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
              Still unsure? Start with the{" "}
              <Link
                href={ROUTES.serviceFamily(comparison.relatedFamilySlug)}
                className="font-semibold text-amber-800 hover:underline"
              >
                service family choose page
              </Link>
              .
            </p>
          ) : null}
        </Container>
      </Section>

      {problems.length > 0 ? (
        <Section variant="muted">
          <Container>
            <SectionHeading title="Related problems" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {problems.map((problem) => (
                <li key={problem!.slug}>
                  <Link
                    href={ROUTES.solution(problem!.slug)}
                    className="text-amber-800 hover:underline"
                  >
                    {problem!.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <FinalCTA
        title="Request a measured recommendation"
        description="Share opening photos. We compare options after seeing your site—not from a fixed package list."
        whatsappMessage={`Hello, I compared ${comparison.optionA.name} vs ${comparison.optionB.name} and need help choosing for my balcony.`}
      />
    </>
  );
}
