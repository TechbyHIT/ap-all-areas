import type { Metadata } from "next";
import { HERO_FALLBACK } from "@/config/design";
import { PageHero } from "@/components/sections/PageHero";
import { InstallationProcess } from "@/components/sections/InstallationProcess";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { SafetySection } from "@/components/sections/SafetySection";
import { MaintenanceSection } from "@/components/sections/MaintenanceSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { INSTALLATION_PROCESS_CONTENT } from "@/data/static-page-content";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { moneyPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Installation Process — What to Expect",
  metaDescription:
    "Step-by-step installation process for invisible grills, safety nets, sports nets and cloth drying hangers in Andhra Pradesh.",
  canonicalUrl: buildCanonicalUrl("/installation-process/"),
  ...moneyPageIndexability("installation-guide"),
});

export default function InstallationProcessPage() {
  const content = INSTALLATION_PROCESS_CONTENT;
  const faqs = [...content.faqs];
  const steps = content.steps.map((step) => ({
    title: step.title.replace(/^\d+\.\s*/, ""),
    description: step.detail,
  }));

  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Installation Process", path: "/installation-process/" },
        ]}
      />
      <FaqJsonLd faqs={faqs} />

      <PageHero
        badge="Guides"
        title={content.title}
        description="From site visit to handover — how we plan and complete each installation across Andhra Pradesh."
        image={{
          src: HERO_FALLBACK,
          alt: "Step-by-step installation process overview",
        }}
      />

      <MaterialsSection
        title="What to Expect"
        prose={<p>{content.intro}</p>}
        note="Timelines vary by scope and access. Coverage remains subject to site accessibility, measurements, technician availability and project requirements."
      />

      <InstallationProcess
        title="Step-by-Step Installation Process"
        description="A reliable installation is mostly decided before the first fastener goes in"
        steps={steps}
        variant="muted"
      />

      <MaterialsSection
        title="Site Inspection"
        prose={<p>{content.siteInspection}</p>}
      />

      <SafetySection
        title="Safety During Installation"
        items={[content.safetyDuringInstall]}
      />

      <MaintenanceSection
        title="Aftercare"
        items={[content.aftercare]}
        variant="muted"
      />

      <FAQSection
        title="Installation Process FAQs"
        subtitle="Scheduling, access, weather, cleanup and on-site changes"
        items={faqs}
      />

      <FinalCTA
        title="Ready to Schedule Measurement?"
        description="Share your city or area, service need and photos. We will confirm whether a measurement visit can be arranged and outline the next steps."
        whatsappMessage="Hello, I would like to understand the installation process and schedule measurement in Andhra Pradesh."
      />
    </>
  );
}
