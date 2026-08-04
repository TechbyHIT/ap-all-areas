import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/config/business";
import { HERO_FALLBACK } from "@/config/design";
import { PageHero } from "@/components/sections/PageHero";
import { InstallationProcess } from "@/components/sections/InstallationProcess";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { QualitySection } from "@/components/sections/QualitySection";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { CONTACT_CONTENT } from "@/data/static-page-content";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: `Contact ${BUSINESS_CONFIG.name}`,
  metaDescription: `Contact ${BUSINESS_CONFIG.name} for invisible grills, safety nets, sports nets and cloth drying hanger installation. Request a quotation — service available across Andhra Pradesh subject to site confirmation.`,
  canonicalUrl: buildCanonicalUrl("/contact/"),
  ...staticPageIndexability(true),
});

export default function ContactPage() {
  const faqs = [...CONTACT_CONTENT.faqs];

  return (
    <>
      <FaqJsonLd faqs={faqs} />

      <PageHero
        badge="Get in Touch"
        title="Contact Us"
        description="Request a quotation or ask about service availability in your area. We confirm coverage after reviewing your site details."
        image={{
          src: HERO_FALLBACK,
          alt: "Contact for installation quotation across Andhra Pradesh",
        }}
      />

      <MaterialsSection
        title="How to Reach Us"
        prose={<p>{CONTACT_CONTENT.intro}</p>}
        note={CONTACT_CONTENT.serviceAreaNote}
      />

      <Section variant="muted">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <Heading as="h2" className="mb-4">
                Contact Details
              </Heading>
              <dl className="space-y-3 text-sm text-zinc-600">
                <div>
                  <dt className="font-medium text-zinc-900">Phone</dt>
                  <dd>{BUSINESS_CONFIG.phone.display}</dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-900">WhatsApp</dt>
                  <dd>{BUSINESS_CONFIG.whatsapp.display}</dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-900">Email</dt>
                  <dd>{BUSINESS_CONFIG.email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-900">Address</dt>
                  <dd>
                    {BUSINESS_CONFIG.address.street}, {BUSINESS_CONFIG.address.city},{" "}
                    {BUSINESS_CONFIG.address.state} {BUSINESS_CONFIG.address.postalCode}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-900">Service area</dt>
                  <dd>{BUSINESS_CONFIG.serviceArea.displayText}</dd>
                </div>
              </dl>
            </div>
            <div>
              <Heading as="h2" className="mb-2">
                What Happens After You Enquire
              </Heading>
              <p className="text-base leading-relaxed text-zinc-700">
                {CONTACT_CONTENT.responseProcess}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <QualitySection
        title="What to Prepare Before You Contact Us"
        items={[...CONTACT_CONTENT.whatToPrepare]}
      />

      <InstallationProcess
        title="Enquiry Process"
        steps={[
          {
            title: "Share basics",
            description:
              "Share your city or area, service type and approximate openings or ground size.",
          },
          {
            title: "Add site context",
            description:
              "Add clear photos and note floor level, society rules or access limits if known.",
          },
          {
            title: "Receive next steps",
            description:
              "We respond with next-step guidance for measurement or clarification questions.",
          },
          {
            title: "Get a written quote",
            description:
              "After site review, you receive a written quotation for the agreed scope.",
          },
          {
            title: "Schedule installation",
            description:
              "Approve the quote to schedule installation when materials and technicians are ready.",
          },
        ]}
        variant="muted"
      />

      <ContactForm />

      <CoverageSection
        title="Service Area Note"
        coverageText={CONTACT_CONTENT.serviceAreaNote}
      />

      <FAQSection
        title="Contact FAQs"
        items={faqs}
        subtitle="Practical answers before you send an enquiry"
      />

      <FinalCTA
        title="Prefer WhatsApp or a Quick Call?"
        description="If you already have photos and your area name ready, reach out and we will guide you on measurement and quotation next steps."
        whatsappMessage="Hello, I would like a quotation. I am sharing my location and requirement from Andhra Pradesh."
      />
    </>
  );
}
