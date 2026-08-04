import type { Metadata } from "next";
import { HERO_FALLBACK } from "@/config/design";
import { PageHero } from "@/components/sections/PageHero";
import { PricingFactors } from "@/components/sections/PricingFactors";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { QualitySection } from "@/components/sections/QualitySection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { PRICING_GUIDE_CONTENT } from "@/data/static-page-content";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { moneyPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Pricing Guide — What Affects Installation Cost",
  metaDescription:
    "Understand pricing factors for invisible grills, safety nets, sports nets and cloth drying hangers in Andhra Pradesh. Request a site-specific quotation.",
  canonicalUrl: buildCanonicalUrl("/pricing-guide/"),
  ...moneyPageIndexability("price-guide"),
});

const SERVICE_ORDER = [
  "invisible-grills",
  "safety-nets",
  "sports-nets",
  "cloth-drying-hangers",
] as const;

export default function PricingGuidePage() {
  const faqs = [...PRICING_GUIDE_CONTENT.faqs];
  const content = PRICING_GUIDE_CONTENT;

  return (
    <>
      <FaqJsonLd faqs={faqs} />

      <PageHero
        badge="Guides"
        title={content.title}
        description="Installation cost depends on site conditions. We provide quotations after on-site measurement — no fixed price list without inspection."
        image={{
          src: HERO_FALLBACK,
          alt: "Pricing factors for safety installation services",
        }}
      />

      <MaterialsSection
        title="How to Read This Pricing Guide"
        prose={<p>{content.intro}</p>}
        note="This guide explains factors used when preparing quotations. It is not a statewide rate card."
      />

      {SERVICE_ORDER.map((slug, index) => {
        const block = content.factorsByService[slug];
        return (
          <PricingFactors
            key={slug}
            title={`${block.title} Pricing Factors`}
            description={block.notes}
            items={block.factors}
            honestStatement="Exact pricing follows measured openings, material grade, access conditions and total project quantity."
            variant={index % 2 === 0 ? "muted" : "default"}
          />
        );
      })}

      <MaterialsSection
        title="How Quotations Work"
        prose={content.howQuotationsWork
          .split(/\n\n+/)
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
      />

      <PricingFactors
        title="What Affects Cost Most Often"
        items={[...content.whatAffectsCost]}
        variant="muted"
      />

      <QualitySection
        title="Mistakes to Avoid When Comparing Quotes"
        items={[...content.mistakesToAvoid]}
      />

      <FAQSection
        title="Pricing FAQs"
        subtitle="Fifteen common questions about cost, packages and comparisons"
        items={faqs}
      />

      <FinalCTA
        title="Get a Site-Specific Quote"
        description="Share your location, service type and photos. Exact pricing follows measured openings and access conditions — not a statewide flat rate."
        whatsappMessage="Hello, I would like a site-specific quotation for installation in Andhra Pradesh."
      />
    </>
  );
}
