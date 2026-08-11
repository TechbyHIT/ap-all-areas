import type { Metadata } from "next";
import { HERO_FALLBACK } from "@/config/design";
import { PageHero } from "@/components/sections/PageHero";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { SafetySection } from "@/components/sections/SafetySection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { SAFETY_GUIDE_CONTENT } from "@/data/static-page-content";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { moneyPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Safety Guide — Usage & Maintenance",
  metaDescription:
    "Safety information and maintenance tips for invisible grills, safety nets, sports nets and cloth drying hangers.",
  canonicalUrl: buildCanonicalUrl("/safety-guide/"),
  ...moneyPageIndexability("maintenance-guide"),
});

export default function SafetyGuidePage() {
  const content = SAFETY_GUIDE_CONTENT;
  const faqs = [...content.faqs];

  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Safety Guide", path: "/safety-guide/" },
        ]}
      />
      <FaqJsonLd faqs={faqs} />

      <PageHero
        badge="Guides"
        title={content.title}
        description="Important safety information for homes, balconies and practice areas — products reduce risk but do not replace sensible daily habits."
        image={{
          src: HERO_FALLBACK,
          alt: "Safety guidance for balcony and practice area installations",
        }}
      />

      <MaterialsSection
        title="Using This Safety Guide"
        prose={<p>{content.intro}</p>}
        note="Installed systems support safer everyday use. Supervision habits and prompt repair of damage remain essential."
      />

      <SafetySection
        title="Child Safety"
        items={[content.childSafety]}
      />

      <SafetySection
        title="Pet Safety"
        items={[content.petSafety]}
        variant="default"
      />

      <SafetySection
        title="High-Rise Considerations"
        items={[content.highRise]}
      />

      <BenefitsSection
        title="Balcony Planning"
        items={[
          {
            title: "Balcony openings",
            description: content.balcony,
          },
          {
            title: "Bird control",
            description: content.birdControl,
          },
          {
            title: "Sports area safety",
            description: content.sportsAreaSafety,
          },
        ]}
        variant="muted"
      />

      <FAQSection
        title="Safety FAQs"
        subtitle="Supervision, spacing, pets, birds, terraces and repair timing"
        items={faqs}
      />

      <FinalCTA
        title="Plan Safer Openings for Your Home"
        description="Walk your property, list risky openings, then request measurement so we can recommend suitable grills, nets or hangers for your layout."
        whatsappMessage="Hello, I need safety guidance for balcony or window openings in Andhra Pradesh."
      />
    </>
  );
}
