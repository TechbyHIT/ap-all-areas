import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/config/business";
import { PageHero } from "@/components/sections/PageHero";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { Container } from "@/components/ui/Container";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms and Conditions",
  metaDescription: `Terms and conditions for using ${BUSINESS_CONFIG.name} website and services.`,
  canonicalUrl: buildCanonicalUrl("/terms-and-conditions/"),
  ...staticPageIndexability(true),
});

export default function TermsPage() {
  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Terms and Conditions", path: "/terms-and-conditions/" },
        ]}
      />
      <PageHero title="Terms and Conditions" />
      <Container>
        <div className="prose prose-zinc max-w-none dark:prose-invert">
          <p>Last updated: August 2026</p>
          <p>
            By using {BUSINESS_CONFIG.websiteUrl}, you agree to these terms. If you do
            not agree, please do not use this website.
          </p>
          <h2>Service Availability</h2>
          <p>
            Location pages describe where installation service may be available across
            Andhra Pradesh. Listing a city or area does not mean we operate a physical
            branch there. Coverage is confirmed individually for each enquiry after
            site review.
          </p>
          <h2>Quotations</h2>
          <p>
            Quotations are based on on-site measurement and stated scope. Final pricing
            may change if site conditions differ from initial information provided.
          </p>
          <h2>Website Content</h2>
          <p>
            Content is provided for general information. Specifications, images and
            descriptions may be updated without notice.
          </p>
        </div>
      </Container>
    </>
  );
}
