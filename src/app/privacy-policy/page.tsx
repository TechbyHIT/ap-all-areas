import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/config/business";
import { PageHero } from "@/components/sections/PageHero";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { Container } from "@/components/ui/Container";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy",
  metaDescription: `Privacy policy for ${BUSINESS_CONFIG.name} website and enquiry forms.`,
  canonicalUrl: buildCanonicalUrl("/privacy-policy/"),
  ...staticPageIndexability(true),
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy/" },
        ]}
      />
      <PageHero title="Privacy Policy" />
      <Container>
        <div className="prose prose-zinc max-w-none dark:prose-invert">
          <p>Last updated: August 2026</p>
          <p>
            {BUSINESS_CONFIG.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects
            your privacy. This policy explains how we collect and use information when
            you visit {BUSINESS_CONFIG.websiteUrl} or submit an enquiry form.
          </p>
          <h2>Information We Collect</h2>
          <ul>
            <li>Name, phone number and email when you submit a contact or quote form</li>
            <li>Location and service requirement details you provide</li>
            <li>Basic analytics data such as pages visited and device type</li>
          </ul>
          <h2>How We Use Information</h2>
          <ul>
            <li>To respond to enquiries and provide quotations</li>
            <li>To confirm service availability in your area</li>
            <li>To improve our website and services</li>
          </ul>
          <h2>Contact</h2>
          <p>
            For privacy-related questions, contact us at {BUSINESS_CONFIG.email}.
          </p>
        </div>
      </Container>
    </>
  );
}
