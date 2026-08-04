import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { PLACEHOLDER_GUIDES } from "@/data/placeholder-content";
import { ROUTES } from "@/config/routes";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Guides — Installation & Buying Guides",
  metaDescription:
    "Helpful guides for choosing invisible grills, safety nets, sports nets and cloth drying hangers in Andhra Pradesh.",
  canonicalUrl: buildCanonicalUrl("/guides/"),
  ...staticPageIndexability(true),
});

export default function GuidesPage() {
  return (
    <>
      <PageHero
        title="Guides"
        description="Practical guides to help you choose and plan safety and utility installations."
      />
      <Container>
        <div className="grid gap-6 md:grid-cols-2">
          {PLACEHOLDER_GUIDES.map((guide) => (
            <article
              key={guide.slug}
              className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <h2 className="text-xl font-semibold">
                <Link href={ROUTES.guide(guide.slug)} className="hover:text-blue-600">
                  {guide.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {guide.summary}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
