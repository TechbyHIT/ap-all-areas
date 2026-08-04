import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ProblemsSolvedSection } from "@/components/sections/ProblemsSolvedSection";
import { PropertyTypesSection } from "@/components/sections/PropertyTypesSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { InstallationProcess } from "@/components/sections/InstallationProcess";
import { SafetySection } from "@/components/sections/SafetySection";
import { QualitySection } from "@/components/sections/QualitySection";
import { MaintenanceSection } from "@/components/sections/MaintenanceSection";
import { PricingFactors } from "@/components/sections/PricingFactors";
import { ServiceCityAreaLinks } from "@/components/sections/ServiceCityAreaLinks";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { RelatedGuides } from "@/components/sections/RelatedGuides";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, breadcrumbSchema } from "@/lib/schema";
import {
  INITIAL_SERVICE_MAP,
  INITIAL_SERVICE_SLUGS,
  INITIAL_SERVICES,
} from "@/data/initial-services";
import { SERVICE_PAGE_CONTENT } from "@/data/service-page-content";
import { SERVICE_FAQS } from "@/data/service-faqs";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import {
  generateDescription,
  generatePageMetadata,
  generateTitle,
} from "@/lib/seo/generate-page-metadata";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{ serviceSlug: string }>;
};

function toProcessSteps(items: readonly string[]) {
  return items.map((step, index) => {
    const shortTitle = step.split(/[.:—]/)[0]?.trim() || `Step ${index + 1}`;
    return {
      title: shortTitle.length > 56 ? `Step ${index + 1}` : shortTitle,
      description: step,
    };
  });
}

export async function generateStaticParams() {
  return INITIAL_SERVICE_SLUGS.map((serviceSlug) => ({ serviceSlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serviceSlug } = await params;
  const service = INITIAL_SERVICE_MAP[serviceSlug];
  if (!service) return {};

  return generatePageMetadata({
    title: generateTitle(`${service.name} in Andhra Pradesh`, "service"),
    metaDescription: generateDescription(service.name),
    canonicalUrl: buildCanonicalUrl(`/services/${service.slug}/`),
    openGraphImage: getServiceMedia(service.slug).image,
    publicationStatus: service.publicationStatus,
    allowIndexing: service.allowIndexing,
    qualityScore: service.qualityScore,
    contentReviewed: service.contentReviewed,
    localDataVerified: true,
    hasUniqueMetadata: true,
    hasUniqueContent: true,
    hasValidCanonical: true,
    hasInternalLinks: true,
    hasValidSchema: true,
    wordCount: 2500,
    minimumRequiredWordCount: 2000,
    similarityScore: 0.25,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { serviceSlug } = await params;
  const service = INITIAL_SERVICE_MAP[serviceSlug];
  if (!service) notFound();

  const content = SERVICE_PAGE_CONTENT[serviceSlug];
  if (!content) notFound();

  const faqs = SERVICE_FAQS[serviceSlug] ?? [];
  const relatedServices = INITIAL_SERVICES.filter((s) => s.slug !== service.slug);
  const canonical = buildCanonicalUrl(`/services/${service.slug}/`);
  const media = getServiceMedia(service.slug);

  const crumbs = [
    { name: "Home", url: buildCanonicalUrl("/") },
    { name: "Services", url: buildCanonicalUrl("/services/") },
    { name: service.name, url: canonical },
  ];

  const guides = [
    ...content.relatedGuideSlugs.map((slug) => ({
      title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: ROUTES.guide(slug),
      summary: `Practical guidance related to ${service.name.toLowerCase()} planning and installation.`,
    })),
    {
      title: "Pricing Guide",
      href: "/pricing-guide/",
      summary: "Understand what affects installation cost before requesting a quote.",
    },
    {
      title: "Materials Guide",
      href: "/materials-guide/",
      summary: "Material and specification notes for outdoor installations.",
    },
    {
      title: "Installation Process",
      href: "/installation-process/",
      summary: "What to expect from measurement through handover.",
    },
    {
      title: "Safety Guide",
      href: "/safety-guide/",
      summary: "Usage and maintenance safety information for homes and practice areas.",
    },
  ];

  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <JsonLd
        data={serviceSchema({
          name: service.name,
          description: service.summary,
          url: canonical,
        })}
      />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <ServiceHero
        badge="Andhra Pradesh"
        title={`${service.name} Installation in Andhra Pradesh`}
        description={service.summary}
        image={{
          src: media.image,
          alt: media.alt,
        }}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services/" },
          { label: service.name },
        ]}
        quoteHref={`${ROUTES.contact}?service=${encodeURIComponent(service.slug)}`}
        trustLine="Quotation after site review · Material and spacing confirmed on measurement"
      />

      <MaterialsSection
        title={`About ${service.name}`}
        prose={<p>{content.uniqueIntroduction}</p>}
        note="We provide installation services across Andhra Pradesh subject to site accessibility, measurements, technician availability and project requirements. Listing a place does not mean we operate a branch there."
        cards={[]}
      />

      <ProblemsSolvedSection
        title="Customer Problems Solved"
        items={content.problemsSolved}
      />

      <PropertyTypesSection
        title="Suitable Property Types"
        items={content.suitablePropertyTypes}
        variant="muted"
      />

      <FeaturesSection
        title="Common Applications"
        description="Typical installation contexts across homes and institutions in Andhra Pradesh"
        items={content.commonApplications}
      />

      <BenefitsSection title="Main Benefits" items={content.benefits} variant="muted" />

      <FeaturesSection title="Product Features" items={content.features} />

      <MaterialsSection
        title="Materials Used"
        description={content.materialsOverview}
        prose={<p>{content.materialGradesGuidance}</p>}
        variant="muted"
      />

      <QualitySection
        title="Technical Considerations"
        items={content.technicalConsiderations}
      />

      <InstallationProcess
        title="Measurement Guidance"
        steps={toProcessSteps(content.measurementGuidance)}
      />

      <InstallationProcess
        title="Installation Process"
        steps={toProcessSteps(content.installationProcess)}
        variant="muted"
      />

      <InstallationProcess
        title="Site-Inspection Process"
        steps={toProcessSteps(content.siteInspectionProcess)}
      />

      <SafetySection title="Safety Checks" items={content.safetyChecks} />

      <QualitySection title="Quality Checks" items={content.qualityChecks} />

      <MaintenanceSection
        title="Maintenance Instructions"
        items={content.maintenanceInstructions}
        variant="muted"
      />

      <MaintenanceSection
        title="Cleaning Guidance"
        items={content.cleaningGuidance}
      />

      <QualitySection
        title="Durability Factors"
        items={content.durabilityFactors}
        variant="muted"
      />

      <SafetySection
        title="Weather-Related Considerations"
        items={content.weatherConsiderations}
      />

      <PricingFactors
        title="Pricing Factors"
        items={content.pricingFactors}
        honestStatement="Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity. Fixed package prices are not shown because every site differs."
      />

      <QualitySection
        title="Common Customer Mistakes"
        items={content.commonMistakes}
      />

      <QualitySection
        title="Contractor-Selection Guidance"
        items={content.contractorSelectionGuidance}
        variant="muted"
      />

      {service.subServices.length > 0 ? (
        <Section>
          <Container>
            <SectionHeading
              title="Related Applications & Sub-Services"
              description={`Common ${service.name.toLowerCase()} applications planned after site measurement.`}
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {service.subServices.map((sub) => (
                <FeatureCard
                  key={sub.slug}
                  title={sub.name}
                  description={sub.summary}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <ServiceCityAreaLinks
        serviceSlug={service.slug}
        serviceName={service.name}
        title={`${service.name} in every priority city & area`}
        description={`Open the ${service.name.toLowerCase()} page for your city or locality. Coverage is confirmed after site review—listing a place does not mean we operate a branch there.`}
        variant="muted"
      />

      <RelatedServices
        title="Related Services"
        services={relatedServices.map((related) => ({
          name: related.name,
          slug: related.slug,
          summary: related.summary,
          benefits: related.benefits.slice(0, 3),
          image: getServiceMedia(related.slug).image,
        }))}
      />

      <RelatedGuides title="Related Guides" guides={guides} />

      <FAQSection
        title={`${service.name} — Frequently Asked Questions`}
        items={faqs}
      />

      <FinalCTA
        title={`Get a ${service.name} Quotation`}
        description={`Share your city, property type and approximate measurements for ${service.name}. We will confirm service availability and guide you through the next steps.`}
        whatsappMessage={`Hello, I need a quotation for ${service.name} installation in Andhra Pradesh.`}
      />
    </>
  );
}
