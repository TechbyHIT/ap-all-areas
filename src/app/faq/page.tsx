import type { Metadata } from "next";
import { HERO_FALLBACK } from "@/config/design";
import { PageHero } from "@/components/sections/PageHero";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { FAQ_PAGE_EXTRA } from "@/data/static-page-content";
import { GENERAL_FAQS, SERVICE_FAQS } from "@/data/service-faqs";
import type { FaqItem } from "@/data/service-faqs";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "FAQ — Frequently Asked Questions",
  metaDescription:
    "Answers to common questions about invisible grills, safety nets, sports nets and cloth drying hanger installation in Andhra Pradesh.",
  canonicalUrl: buildCanonicalUrl("/faq/"),
  ...staticPageIndexability(true),
});

const SERVICE_FAQ_SECTIONS: Array<{ slug: string; title: string }> = [
  { slug: "invisible-grills", title: "Invisible Grills" },
  { slug: "safety-nets", title: "Safety Nets" },
  { slug: "sports-nets", title: "Sports Nets" },
  { slug: "cloth-drying-hangers", title: "Cloth Drying Hangers" },
];

function sampleServiceFaqs(slug: string): FaqItem[] {
  return (SERVICE_FAQS[slug] ?? []).slice(0, 3);
}

export default function FAQPage() {
  const generalFaqs = [...GENERAL_FAQS, ...FAQ_PAGE_EXTRA];
  const serviceSamples = SERVICE_FAQ_SECTIONS.flatMap(({ slug }) =>
    sampleServiceFaqs(slug),
  );
  const allFaqsForSchema = [...generalFaqs, ...serviceSamples];

  return (
    <>
      <FaqJsonLd faqs={allFaqsForSchema} />

      <PageHero
        badge="Help Centre"
        title="Frequently Asked Questions"
        description="Common questions about our services, coverage, measurement, materials and installation process across Andhra Pradesh."
        image={{
          src: HERO_FALLBACK,
          alt: "Frequently asked questions about installation services",
        }}
      />

      <MaterialsSection
        title="How to Use This FAQ"
        prose={
          <>
            <p>
              Start with the general questions if you are comparing services or
              checking whether installation can be arranged in your area. Then
              review the short samples for each service line. For deeper product
              questions, open the dedicated service pages. Every answer here is
              written for real enquiry planning — not placeholder text.
            </p>
            <p>
              We provide installation services across Andhra Pradesh subject to
              site accessibility, measurements, technician availability and
              project requirements. Listing a place on this website does not mean
              a permanent office exists there.
            </p>
          </>
        }
        note="For site-specific answers, share your city, area, photos and service need via the contact form."
      />

      <FAQSection
        title="General Questions"
        subtitle="Coverage, process, apartments, pricing factors and preparation"
        items={generalFaqs}
        id="general-faq"
      />

      {SERVICE_FAQ_SECTIONS.map(({ slug, title }) => {
        const items = sampleServiceFaqs(slug);
        if (items.length === 0) return null;
        return (
          <FAQSection
            key={slug}
            title={`${title} — Sample Questions`}
            subtitle={`A short sample from our ${title.toLowerCase()} FAQ set`}
            items={items}
            id={`${slug}-faq`}
          />
        );
      })}

      <FinalCTA
        title="Still Have a Site-Specific Question?"
        description="Share your city or area, service need and photos. We will confirm next steps for measurement and quotation."
        whatsappMessage="Hello, I have a question about installation services in Andhra Pradesh."
      />
    </>
  );
}
