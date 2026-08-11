import type { Metadata } from "next";
import { HERO_FALLBACK } from "@/config/design";
import { PageHero } from "@/components/sections/PageHero";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { QualitySection } from "@/components/sections/QualitySection";
import { SafetySection } from "@/components/sections/SafetySection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { MATERIALS_GUIDE_CONTENT } from "@/data/static-page-content";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { moneyPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Materials Guide — Grills, Nets & Hanger Components",
  metaDescription:
    "Learn about stainless steel, UV-stabilised nets and hanger materials used for installations across Andhra Pradesh.",
  canonicalUrl: buildCanonicalUrl("/materials-guide/"),
  ...moneyPageIndexability("maintenance-guide"),
});

const SERVICE_ORDER = [
  "invisible-grills",
  "safety-nets",
  "sports-nets",
  "cloth-drying-hangers",
] as const;

export default function MaterialsGuidePage() {
  const content = MATERIALS_GUIDE_CONTENT;
  const faqs = [...content.faqs];

  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Materials Guide", path: "/materials-guide/" },
        ]}
      />
      <FaqJsonLd faqs={faqs} />

      <PageHero
        badge="Guides"
        title={content.title}
        description="Material quality affects durability, safety and long-term maintenance across Andhra Pradesh conditions."
        image={{
          src: HERO_FALLBACK,
          alt: "Materials used in safety and utility installations",
        }}
      />

      <MaterialsSection
        title="Why Materials Matter"
        prose={<p>{content.intro}</p>}
        note="Exact material grade, cable or net spacing, fixing hardware and finish options are confirmed after on-site measurement."
      />

      {SERVICE_ORDER.map((slug, index) => {
        const block = content.materialsByService[slug];
        return (
          <MaterialsSection
            key={slug}
            title={`${block.title} Materials`}
            prose={block.guidance
              .split(/\n\n+/)
              .map((p) => p.trim())
              .filter(Boolean)
              .map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            variant={index % 2 === 0 ? "muted" : "default"}
          />
        );
      })}

      <SafetySection
        title="Coastal and Weather Considerations"
        items={[content.coastalConsiderations]}
      />

      <QualitySection
        title="Material Selection Tips"
        items={[...content.selectionTips]}
        variant="muted"
      />

      <FAQSection
        title="Materials FAQs"
        subtitle="Practical questions about stainless, UV nets, sports mesh and hangers"
        items={faqs}
      />

      <FinalCTA
        title="Need Material Advice for Your Openings?"
        description="Send photos and your location. After measurement we recommend specifications that match exposure, use and fixing conditions."
        whatsappMessage="Hello, I need material guidance for installation in Andhra Pradesh."
      />
    </>
  );
}
