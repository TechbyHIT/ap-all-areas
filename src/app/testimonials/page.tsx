import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { Container } from "@/components/ui/Container";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";
import { listPublishableReviews } from "@/data/reviews";
import { contextualCta } from "@/lib/seo/contextual-cta";

export const metadata: Metadata = generatePageMetadata({
  title: "Testimonials — Verified Customer Reviews",
  metaDescription:
    "We publish only genuine, permissioned customer reviews for installation work in Andhra Pradesh. No fabricated or location-invented testimonials.",
  canonicalUrl: buildCanonicalUrl("/testimonials/"),
  ...staticPageIndexability(true),
});

export default function TestimonialsPage() {
  const reviews = listPublishableReviews();
  const cta = contextualCta({ kind: "service" });

  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Testimonials", path: "/testimonials/" },
        ]}
      />
      <PageHero
        title="Testimonials"
        description="Verified customer reviews only — linked to real services and locations when authorised."
      />
      <Container className="py-10">
        {reviews.length === 0 ? (
          <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
            Customer testimonials will appear here after verification and
            permission to publish. We do not invent reviews or create artificial
            location-specific quotes. Until then, use installation photos and a
            measured quotation conversation to evaluate fit.
          </p>
        ) : (
          <ul className="grid gap-6">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-xl border border-zinc-200 bg-white p-5"
              >
                <p className="text-zinc-800">{review.reviewText}</p>
                <p className="mt-3 text-sm text-zinc-500">
                  {review.reviewerName}
                  {review.citySlug ? ` · ${review.citySlug}` : ""}
                  {review.serviceSlug ? ` · ${review.serviceSlug}` : ""}
                  {" · "}
                  {review.date}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Container>
      <FinalCTA
        title={cta.primaryLabel}
        description="Share your requirement and location for a measured quotation."
        whatsappMessage={cta.whatsappHint}
      />
    </>
  );
}
