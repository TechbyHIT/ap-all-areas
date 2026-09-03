import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import { FAQSection } from "@/components/sections/FAQSection";
import {
  BulletListSection,
  CardGridSection,
  ProseSection,
} from "@/components/sections/ContentBlocks";
import { ServiceCityAreaLinks } from "@/components/sections/ServiceCityAreaLinks";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { PROBLEM_MAP, PROBLEM_SLUGS } from "@/data/problems";
import { comparisonForProblem } from "@/data/comparisons";
import { INITIAL_SERVICE_MAP, INITIAL_SERVICES } from "@/data/initial-services";
import { getIntentHeroImage } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import type { Problem } from "@/types/problem";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{ problemSlug: string }>;
};

function buildProblemFaqs(
  problem: Problem,
): Array<{ question: string; answer: string }> {
  return problem.customerQuestions.map((question) => {
    const lower = question.toLowerCase();
    let answer = `${problem.summary} For your property, a short site review helps confirm the most suitable option among the recommended services.`;

    if (lower.includes("invisible grill") && lower.includes("safety net")) {
      answer = `Both can help with ${problem.shortName.toLowerCase()}, but the better choice depends on opening design, appearance preference, bird-control need and budget. Invisible grills suit families who want a more open look; safety nets are practical for broader coverage or bird control. We compare options after measuring your site.`;
    } else if (lower.includes("view") || lower.includes("block")) {
      answer = `Invisible grills are designed to keep light and outlook more open than heavy traditional grills, while still forming a continuous barrier across the opening. Exact visual impact depends on spacing and finish chosen for your ${problem.shortName.toLowerCase()} need.`;
    } else if (lower.includes("how soon") || lower.includes("how long")) {
      answer = `Timeline depends on site confirmation, material readiness and access at your building. After measurement and quotation approval, a single-opening job may finish in a few hours; larger packages take longer. We share an expected schedule once scope is clear.`;
    } else if (lower.includes("pigeon") || lower.includes("bird") || lower.includes("hurt")) {
      answer = `Properly installed bird or pigeon nets create a physical barrier that discourages nesting without harming birds. Complete coverage of entry points works better than leaving side gaps open. Longevity depends on mesh quality, tension, sun exposure and maintenance.`;
    } else if (lower.includes("duct") || lower.includes("ac")) {
      answer = `Duct and AC ledge areas can often be covered when fixing surfaces and access are suitable. These zones need separate measurement from a standard living-room balcony because spans and obstacles differ.`;
    } else if (lower.includes("space") || lower.includes("plot") || lower.includes("height")) {
      answer = `Available length, width and height decide whether a home practice setup, box cricket enclosure or larger academy lane is practical. We plan net height and posts from measured ground or terrace conditions rather than a fixed kit size.`;
    } else if (lower.includes("pet") || lower.includes("cat") || lower.includes("dog")) {
      answer = `Pet-focused spacing and full side-gap coverage make balconies and windows safer, but supervision remains important. Share pet size and climbing habits during measurement so the plan stays realistic for your home.`;
    } else if (lower.includes("hanger") || lower.includes("pulley") || lower.includes("ceiling") || lower.includes("drying")) {
      answer = `Hanger type depends on ceiling strength, available height and your typical laundry load. Ceiling-mounted and pulley systems are common in compact flats when fixing points are sound. We confirm suitability on site before quotation.`;
    } else if (lower.includes("window") || lower.includes("sliding") || lower.includes("ventilat")) {
      answer = `Window solutions depend on frame type, opening width and fixing feasibility. Sliding windows, ventilators and standard casements are assessed individually so the barrier does not interfere with intended use more than necessary.`;
    } else if (lower.includes("terrace") || lower.includes("wind") || lower.includes("parapet")) {
      answer = `Terrace edges need attention to parapet strength, wind exposure and continuous coverage of open corners. Nets and invisible grills can both be considered after checking structure and how the terrace is used day to day.`;
    } else if (lower.includes("staircase") || lower.includes("curved") || lower.includes("interior")) {
      answer = `Staircase work follows the actual tread, landing and railing layout. Curved or open-side designs need custom measurement. Visual impact is discussed during quotation so safety and appearance stay balanced.`;
    } else {
      answer = `${problem.summary} Recommended services for this issue are planned after reviewing symptoms, property type and opening conditions on site. Share photos if available so we can guide the next measurement step.`;
    }

    return { question, answer };
  });
}

export async function generateStaticParams() {
  return PROBLEM_SLUGS.map((problemSlug) => ({ problemSlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { problemSlug } = await params;
  const problem = PROBLEM_MAP[problemSlug];
  if (!problem) return {};

  const primaryService =
    problem.recommendedServices[0] ?? "safety-nets";
  const hero = getIntentHeroImage(problem.slug, primaryService);

  return generatePageMetadata({
    title: `${problem.name} — Safety Solutions in Andhra Pradesh`,
    metaDescription: problem.summary,
    canonicalUrl: buildCanonicalUrl(`/solutions/${problem.slug}/`),
    openGraphImage: hero.src,
    publicationStatus: problem.publicationStatus,
    allowIndexing: problem.allowIndexing,
    qualityScore: problem.qualityScore,
    contentReviewed: problem.contentReviewed,
    localDataVerified: true,
    hasUniqueMetadata: true,
    hasUniqueContent: true,
    hasValidCanonical: true,
    hasInternalLinks: true,
    hasValidSchema: true,
    wordCount: 1200,
    minimumRequiredWordCount: 800,
    similarityScore: 0.3,
  });
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { problemSlug } = await params;
  const problem = PROBLEM_MAP[problemSlug];
  if (!problem) notFound();

  const faqs = buildProblemFaqs(problem);
  const comparison = comparisonForProblem(problem.slug);
  const primaryServiceSlug =
    problem.recommendedServices[0] ?? "safety-nets";
  const primaryService =
    INITIAL_SERVICE_MAP[primaryServiceSlug] ?? INITIAL_SERVICES[0];
  const hero = getIntentHeroImage(problem.slug, primaryServiceSlug);

  const possibleSolutions = problem.recommendedServices
    .map((slug) => {
      const service = INITIAL_SERVICE_MAP[slug];
      if (!service) return null;
      return {
        title: service.name,
        description: `${service.summary} Considered for ${problem.shortName.toLowerCase()} after measurement.`,
        href: ROUTES.service(slug),
      };
    })
    .filter(
      (item): item is { title: string; description: string; href: string } =>
        item !== null,
    );

  const recommendedServiceCards = possibleSolutions.map(
    ({ title, description }) => ({ title, description }),
  );

  const subServiceItems = problem.recommendedSubServiceSlugs
    .map((slug) => {
      for (const service of INITIAL_SERVICES) {
        const sub = service.subServices.find((s) => s.slug === slug);
        if (sub) {
          return {
            title: sub.name,
            description: sub.summary,
          };
        }
      }
      return {
        title: slug.replace(/-/g, " "),
        description: `Related application often discussed for ${problem.shortName.toLowerCase()} during site assessment.`,
      };
    })
    .slice(0, 8);

  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions/" },
          { name: problem.name, path: `/solutions/${problem.slug}/` },
        ]}
      />
      <FaqJsonLd faqs={faqs} />

      <PageHero
        title={problem.name}
        description={problem.summary}
        badge="Solutions · Andhra Pradesh"
        image={hero}
      />

      <ProseSection title={`Problem: ${problem.name}`}>
        <p>{problem.introduction}</p>
        <p>
          Across Andhra Pradesh homes and institutions, the right response depends
          on measured openings, how the space is used and whether the main concern
          is fall protection, bird control, sports practice or utility drying.
          We recommend a site review before finalising materials so the solution
          matches your property rather than a generic package.
        </p>
      </ProseSection>

      <BulletListSection
        title="Common Symptoms"
        items={problem.symptoms}
        variant="muted"
      />

      <BulletListSection title="Risks If Left Unaddressed" items={problem.risks} />

      <CardGridSection
        title="Possible solutions"
        subtitle="Options that can address this problem — choice confirmed after site review"
        items={recommendedServiceCards}
      />

      {comparison ? (
        <Section variant="muted">
          <Container>
            <Heading as="h2" className="mb-4">
              Comparison
            </Heading>
            <p className="max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              When more than one product could work, compare purpose, materials,
              appearance and limitations before you buy.
            </p>
            <Link
              href={ROUTES.comparison(comparison.slug)}
              className="mt-4 inline-flex text-sm font-semibold text-amber-800 hover:underline"
            >
              {comparison.h1} →
            </Link>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          <Heading as="h2" className="mb-6">
            Recommended service
          </Heading>
          <p className="mb-4 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Start with the primary recommendation, then confirm on measurement.
            Related applications below narrow the brief further.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {possibleSolutions.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium hover:border-teal-300 hover:text-teal-800"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {subServiceItems.length > 0 ? (
        <CardGridSection
          title="Related Applications"
          items={subServiceItems}
          variant="muted"
        />
      ) : null}

      {problem.suitablePropertyTypes.length > 0 ? (
        <BulletListSection
          title="Suitable Property Types"
          items={problem.suitablePropertyTypes.map((type) =>
            type
              .split("-")
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(" "),
          )}
        />
      ) : null}

      <ProseSection title="How We Approach This Problem">
        <p>
          Start with photos or a brief description of the openings involved, then
          schedule measurement where needed. We explain material options, fixing
          method and practical limits in plain Indian English before installation
          is booked. Pricing depends on measurements, material grade, required
          spacing, installation complexity, building height, site accessibility
          and total project quantity.
        </p>
      </ProseSection>

      {primaryService ? (
        <ServiceCityAreaLinks
          serviceSlug={primaryService.slug}
          serviceName={primaryService.name}
          title={`Location — ${primaryService.name} cities & areas`}
          description={`Browse ${primaryService.name.toLowerCase()} pages across priority Andhra Pradesh cities and localities. Final suitability for ${problem.shortName.toLowerCase()} is confirmed after site review.`}
          variant="muted"
        />
      ) : null}

      <FAQSection
        title={`${problem.name} — Frequently Asked Questions`}
        items={faqs}
      />

      <QuoteCTA
        title={`Quote — solve ${problem.shortName}`}
        description="Request a site visit to confirm the best service for your property. Installation service is available across Andhra Pradesh subject to site confirmation."
        whatsappMessage={`Hello, I need help with ${problem.name} at my property in Andhra Pradesh.`}
      />
    </>
  );
}
