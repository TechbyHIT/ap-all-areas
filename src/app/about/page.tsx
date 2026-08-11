import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/config/business";
import { HERO_FALLBACK } from "@/config/design";
import { PageHero } from "@/components/sections/PageHero";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { InstallationProcess } from "@/components/sections/InstallationProcess";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { SafetySection } from "@/components/sections/SafetySection";
import { QualitySection } from "@/components/sections/QualitySection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { ABOUT_CONTENT } from "@/data/static-page-content";
import { ROUTES } from "@/config/routes";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: `About ${BUSINESS_CONFIG.name}`,
  metaDescription: `Learn about ${BUSINESS_CONFIG.name} — professional invisible grills, safety nets, sports nets and cloth drying hanger installation with service available across Andhra Pradesh.`,
  canonicalUrl: buildCanonicalUrl("/about/"),
  ...staticPageIndexability(true),
});

function paragraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

const howWeWorkSteps = ABOUT_CONTENT.howWeWork
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => line.replace(/^\d+\.\s*/, ""))
  .map((line, index) => {
    const shortTitle = line.split(/[.:—]/)[0]?.trim() || `Step ${index + 1}`;
    return {
      title: shortTitle.length > 56 ? `Step ${index + 1}` : shortTitle,
      description: line,
    };
  });

export default function AboutPage() {
  const faqs = [...ABOUT_CONTENT.faqs];

  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about/" },
        ]}
      />
      <FaqJsonLd faqs={faqs} />

      <PageHero
        badge="Andhra Pradesh"
        title={ABOUT_CONTENT.title}
        description={`About ${BUSINESS_CONFIG.name} — measurement-led installation services across Andhra Pradesh.`}
        image={{
          src: HERO_FALLBACK,
          alt: `${BUSINESS_CONFIG.name} installation service`,
        }}
      />

      <MaterialsSection
        title="Who We Are"
        prose={paragraphs(ABOUT_CONTENT.intro).map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
        note="We confirm coverage after reviewing your site details. Location pages support enquiry planning and are not branch claims."
      />

      <MaterialsSection
        title="Our Story"
        prose={paragraphs(ABOUT_CONTENT.story).map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
        variant="muted"
      />

      <MaterialsSection
        title="Our Approach"
        prose={paragraphs(ABOUT_CONTENT.approach).map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
      />

      <FeaturesSection
        title="Services We Provide"
        description={paragraphs(ABOUT_CONTENT.services)[0]}
        items={[
          {
            title: "Invisible Grills",
            description:
              "Slim stainless systems for balconies, windows, staircases and selected terrace edges.",
          },
          {
            title: "Safety Nets",
            description:
              "Measured netting for balconies, ducts, terraces and bird control applications.",
          },
          {
            title: "Sports Nets",
            description:
              "Practice containment for homes, schools and coaching spaces.",
          },
          {
            title: "Cloth Drying Hangers",
            description:
              "Utility drying systems where balcony railing space is limited.",
          },
        ]}
        variant="muted"
      />

      <CoverageSection
        title="Service Area Coverage"
        coverageText={paragraphs(ABOUT_CONTENT.coverage).join(" ")}
        links={[
          { label: "Browse locations", href: ROUTES.locations },
          { label: "View services", href: ROUTES.services },
        ]}
      />

      <MaterialsSection
        title="Quality Process"
        prose={paragraphs(ABOUT_CONTENT.qualityProcess).map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
        variant="muted"
      />

      <SafetySection
        title="Safety Commitment"
        items={paragraphs(ABOUT_CONTENT.safetyCommitment)}
      />

      <InstallationProcess title="How We Work" steps={howWeWorkSteps} />

      <BenefitsSection
        title="Why Families Contact Us"
        description="Everyday problems we help address across Andhra Pradesh homes and institutions"
        items={[
          {
            title: "Balcony and window safety",
            description:
              "Invisible grills and nets planned for child and pet safety at open edges.",
          },
          {
            title: "Bird and pigeon control",
            description:
              "Measured netting for utility balconies, ducts and ledges where nesting becomes a problem.",
          },
          {
            title: "Practice containment",
            description:
              "Sports nets sized for home, school and coaching use with stable input on supports.",
          },
          {
            title: "Compact drying solutions",
            description:
              "Cloth drying hangers where balcony railing space is limited or inconvenient.",
          },
        ]}
        variant="muted"
      />

      <QualitySection
        title="Honest Service-Area Principles"
        items={[
          "Location pages describe where installation can be arranged after confirmation — not branch offices.",
          "Quotations follow measured openings and site conditions, not a city name alone.",
          "We explain material and fixing trade-offs in plain language before you approve work.",
          "If a surface or access condition is unsuitable, we say so before installation proceeds.",
        ]}
      />

      <FAQSection
        title="About Us — Frequently Asked Questions"
        items={faqs}
        subtitle="Clear answers about our service-area model and working approach"
      />

      <FinalCTA
        title="Talk to Us About Your Site"
        description="Share your city or area, service need and photos. We will confirm whether measurement can be scheduled and prepare a site-specific quotation."
        whatsappMessage="Hello, I would like to know more about your installation services in Andhra Pradesh."
      />
    </>
  );
}
