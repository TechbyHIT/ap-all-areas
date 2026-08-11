import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { Container } from "@/components/ui/Container";
import { PROBLEMS } from "@/data/problems";
import { ROUTES } from "@/config/routes";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Safety Solutions — Common Problems We Solve",
  metaDescription:
    "Explore common safety and utility problems solved with invisible grills, safety nets, sports nets and cloth drying hangers across Andhra Pradesh.",
  canonicalUrl: buildCanonicalUrl("/solutions/"),
  ...staticPageIndexability(true),
});

export default function SolutionsPage() {
  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions/" },
        ]}
      />
      <PageHero
        title="Solutions"
        description="Find the right installation service for your safety, bird control, sports or drying needs across Andhra Pradesh."
      />
      <Container>
        <div className="grid gap-6 md:grid-cols-2">
          {PROBLEMS.map((problem) => (
            <article
              key={problem.slug}
              className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <h2 className="text-xl font-semibold">
                <Link href={ROUTES.solution(problem.slug)} className="hover:text-blue-600">
                  {problem.name}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {problem.summary}
              </p>
              <Link
                href={ROUTES.solution(problem.slug)}
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                View solution →
              </Link>
            </article>
          ))}
        </div>
      </Container>
      <CTASection />
    </>
  );
}
