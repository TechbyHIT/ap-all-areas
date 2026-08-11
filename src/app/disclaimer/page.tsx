import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/config/business";
import { PageHero } from "@/components/sections/PageHero";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { Container } from "@/components/ui/Container";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Disclaimer",
  metaDescription: `Disclaimer for ${BUSINESS_CONFIG.name} website content and service listings.`,
  canonicalUrl: buildCanonicalUrl("/disclaimer/"),
  ...staticPageIndexability(true),
});

export default function DisclaimerPage() {
  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Disclaimer", path: "/disclaimer/" },
        ]}
      />
      <PageHero title="Disclaimer" />
      <Container>
        <div className="prose prose-zinc max-w-none dark:prose-invert">
          <p>
            The information on {BUSINESS_CONFIG.websiteUrl} is provided by{" "}
            {BUSINESS_CONFIG.legalName} for general guidance about invisible grills,
            safety nets, sports nets and cloth drying hanger installation.
          </p>
          <h2>Service Area Wording</h2>
          <p>
            We use phrases such as &ldquo;service available in&rdquo; to describe
            geographic coverage. This does not imply ownership of a branch, showroom or
            permanent office in every listed city, town or area.
          </p>
          <h2>No Professional Advice</h2>
          <p>
            Website content does not replace on-site inspection. Safety requirements
            vary by property structure, usage and local conditions. Always confirm
            specifications during a site visit.
          </p>
          <h2>External Links</h2>
          <p>
            Links to third-party websites are provided for convenience. We are not
            responsible for their content or policies.
          </p>
        </div>
      </Container>
    </>
  );
}
