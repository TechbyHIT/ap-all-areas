import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { Container } from "@/components/ui/Container";
import { ROUTES } from "@/config/routes";
import { SERVICE_COMPARISONS } from "@/data/comparisons";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Comparisons — Invisible Grills, Safety Nets & Bird Control",
  metaDescription:
    "Genuine solution comparisons for Andhra Pradesh homes: invisible grills vs safety nets, iron grills and bird-control options. No mass-generated pairs.",
  canonicalUrl: buildCanonicalUrl(ROUTES.comparisons),
  ...staticPageIndexability(true),
});

export default function ComparisonsIndexPage() {
  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Comparisons", path: ROUTES.comparisons },
        ]}
      />
      <PageHero
        title="Comparisons"
        description="Only the comparisons people actually ask for. Each page ends with an honest decision guide—not a forced winner."
      />
      <Container className="py-10">
        <div className="grid gap-5 md:grid-cols-2">
          {SERVICE_COMPARISONS.map((comparison) => (
            <article
              key={comparison.slug}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                <Link
                  href={ROUTES.comparison(comparison.slug)}
                  className="hover:text-amber-700"
                >
                  {comparison.h1}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {comparison.intro.slice(0, 160)}…
              </p>
              <Link
                href={ROUTES.comparison(comparison.slug)}
                className="mt-4 inline-flex text-sm font-semibold text-amber-800 hover:underline"
              >
                Compare →
              </Link>
            </article>
          ))}
        </div>
      </Container>
      <FinalCTA
        title="Need a site-specific recommendation?"
        description="Send photos. We will say which option fits your openings."
        whatsappMessage="Hello, I need help comparing balcony protection options in Andhra Pradesh."
      />
    </>
  );
}
