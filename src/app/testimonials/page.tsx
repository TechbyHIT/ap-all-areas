import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";
import { reviewsSchema } from "@/lib/schema";
import { contextualCta } from "@/lib/seo/contextual-cta";
import { buildMetaDescription } from "@/lib/seo/title-meta-system";

export const metadata: Metadata = generatePageMetadata({
  title: "Customer Reviews | Verified Testimonials",
  metaDescription: buildMetaDescription({
    differentiator:
      "Genuine permissioned customer reviews for safety net and invisible grill installations in Andhra Pradesh",
    cta: "Read verified feedback · request a photo estimate",
  }),
  canonicalUrl: buildCanonicalUrl("/testimonials/"),
  ...staticPageIndexability(true),
});

export default function TestimonialsPage() {
  const cta = contextualCta({ kind: "service" });
  const reviewLd = reviewsSchema();

  return (
    <>
      {reviewLd ? <JsonLd data={reviewLd} /> : null}
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Testimonials", path: "/testimonials/" },
        ]}
      />
      <PageHero
        title="Customer reviews"
        description="Verified reviews only — never fabricated ratings or invented location testimonials."
        composition="editorial"
      />
      <ReviewsSection />
      <FinalCTA
        title={cta.primaryLabel}
        description="Share your requirement and location for a measured quotation."
        whatsappMessage={cta.whatsappHint}
      />
    </>
  );
}
