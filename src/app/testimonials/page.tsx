import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Testimonials — Customer Reviews",
  metaDescription:
    "Customer testimonials for invisible grills, safety nets, sports nets and cloth drying hanger installation in Andhra Pradesh.",
  canonicalUrl: buildCanonicalUrl("/testimonials/"),
  ...staticPageIndexability(true),
});

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        title="Testimonials"
        description="What our customers say about our installation services."
      />
      <Container>
        <p className="text-zinc-600 dark:text-zinc-400">
          Customer testimonials will be published here after verification. Contact us
          for references relevant to your service and location.
        </p>
      </Container>
    </>
  );
}
