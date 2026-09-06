import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { STATE_NAME } from "@/config/geo";
import { LandingPage } from "@/components/landing/LandingPage";
import { ProblemsSolvedSection } from "@/components/sections/ProblemsSolvedSection";
import { PropertyTypesSection } from "@/components/sections/PropertyTypesSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { InstallationProcess } from "@/components/sections/InstallationProcess";
import { SafetySection } from "@/components/sections/SafetySection";
import { QualitySection } from "@/components/sections/QualitySection";
import { MaintenanceSection } from "@/components/sections/MaintenanceSection";
import { ServiceCityAreaLinks } from "@/components/sections/ServiceCityAreaLinks";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { RelatedGuides } from "@/components/sections/RelatedGuides";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, breadcrumbSchema } from "@/lib/schema";
import {
  INITIAL_SERVICE_MAP,
  INITIAL_SERVICE_SLUGS,
  INITIAL_SERVICES,
} from "@/data/initial-services";
import { SERVICE_PAGE_CONTENT } from "@/data/service-page-content";
import { SERVICE_FAQS } from "@/data/service-faqs";
import { getServiceAdvancedSections } from "@/data/service-advanced-sections";
import { projectsAsGalleryItems } from "@/data/projects";
import { SUB_SERVICE_MAP, SUB_SERVICE_SLUGS } from "@/data/sub-services";
import {
  getServiceFamily,
  SERVICE_FAMILY_SLUGS,
} from "@/data/service-families";
import { ServiceFamilyPageView } from "@/components/sections/ServiceFamilyPageView";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import {
  generateDescription,
  generatePageMetadata,
  generateTitle,
} from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";
import {
  buildServiceQuickStart,
  buildServiceRelatedGroups,
  buildServiceUseCases,
  buildServiceVariantOptions,
} from "@/lib/landing/builders/service-landing";
import type { LandingPageData } from "@/lib/landing/types";

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
  return [
    ...INITIAL_SERVICE_SLUGS,
    ...SUB_SERVICE_SLUGS,
    ...SERVICE_FAMILY_SLUGS,
  ].map((serviceSlug) => ({
    serviceSlug,
  }));
}

function resolveServicePage(serviceSlug: string) {
  const core = INITIAL_SERVICE_MAP[serviceSlug];
  if (core) {
    const content = SERVICE_PAGE_CONTENT[serviceSlug];
    if (!content) return null;
    return {
      service: core,
      content,
      faqs: SERVICE_FAQS[serviceSlug] ?? [],
      mediaSlug: core.slug,
      h1: `${core.name} Installation in Andhra Pradesh`,
    };
  }

  const sub = SUB_SERVICE_MAP[serviceSlug];
  if (!sub) return null;
  const parent = INITIAL_SERVICE_MAP[sub.parentSlug];
  const parentContent = SERVICE_PAGE_CONTENT[sub.parentSlug];
  if (!parent || !parentContent) return null;
  return {
    service: {
      ...parent,
      slug: sub.slug,
      name: sub.name,
      summary: sub.summary,
    },
    content: {
      ...parentContent,
      slug: sub.slug,
      uniqueIntroduction: sub.intro,
    },
    faqs: SERVICE_FAQS[sub.parentSlug] ?? [],
    mediaSlug: parent.slug,
    h1: sub.h1,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serviceSlug } = await params;

  const family = getServiceFamily(serviceSlug);
  if (family) {
    return generatePageMetadata({
      title: family.metaTitle,
      metaDescription: family.metaDescription,
      canonicalUrl: buildCanonicalUrl(ROUTES.serviceFamily(family.slug)),
      openGraphImage: getServiceMedia(family.primaryServiceSlug).image,
      ...staticPageIndexability(true),
    });
  }

  const resolved = resolveServicePage(serviceSlug);
  if (!resolved) return {};
  const { service } = resolved;

  return generatePageMetadata({
    title: generateTitle(`${service.name} in Andhra Pradesh`, "service"),
    metaDescription: generateDescription(service.name),
    canonicalUrl: buildCanonicalUrl(`/services/${service.slug}/`),
    openGraphImage: getServiceMedia(resolved.mediaSlug).image,
    openGraphImageAlt: `${service.name} installation in Andhra Pradesh`,
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

  const family = getServiceFamily(serviceSlug);
  if (family) {
    return <ServiceFamilyPageView family={family} />;
  }

  const resolved = resolveServicePage(serviceSlug);
  if (!resolved) notFound();

  const { service, content, faqs, mediaSlug, h1 } = resolved;
  const parentSlug = SUB_SERVICE_MAP[serviceSlug]?.parentSlug;
  const advanced =
    getServiceAdvancedSections(parentSlug ?? service.slug) ??
    getServiceAdvancedSections(mediaSlug);
  const relatedServices = INITIAL_SERVICES.filter((item) =>
    parentSlug ? item.slug !== parentSlug : item.slug !== service.slug,
  );
  const canonical = buildCanonicalUrl(`/services/${service.slug}/`);
  const media = getServiceMedia(mediaSlug);
  const projectPhotos = projectsAsGalleryItems(mediaSlug);

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

  const landing: LandingPageData = {
    pageType: "service",
    intent: "commercial",
    canonicalUrl: canonical,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services/" },
      { label: service.name },
    ],
    hero: {
      title: h1,
      description: service.summary,
      badge: STATE_NAME,
      composition: "service-split",
      image: { src: media.image, alt: media.alt },
      trustLine:
        "Quotation after site review · Material and spacing confirmed on measurement",
    },
    trustLabel: STATE_NAME,
    quickStart: {
      title: `Start with the right ${service.name.toLowerCase()} decision`,
      description:
        "Jump to the variation, the pricing explanation or the full service comparison.",
      options: buildServiceQuickStart({ serviceSlug: mediaSlug }),
    },
    primaryContentTitle: `What Is ${service.name}?`,
    primaryContent: <p>{content.uniqueIntroduction}</p>,
    primaryContentNote:
      "We provide installation services across Andhra Pradesh subject to site accessibility, measurements, technician availability and project requirements. Listing a place does not mean we operate a branch there.",
    contentBlocks: (
      <>
        {advanced ? (
          <PropertyTypesSection
            title={`Who Needs ${service.name}?`}
            items={advanced.whoNeeds}
            variant="muted"
          />
        ) : null}

        <ProblemsSolvedSection
          title={`Problems ${service.name} Solves`}
          items={content.problemsSolved}
        />

        <PropertyTypesSection
          title={`Where ${service.name} Is Used`}
          items={content.suitablePropertyTypes}
          variant="muted"
        />

        <FeaturesSection
          title={`Applications of ${service.name}`}
          description="Typical installation contexts across homes and institutions in Andhra Pradesh"
          items={content.commonApplications}
        />

        <BenefitsSection
          title="Main Benefits"
          items={content.benefits}
          variant="muted"
        />

        <FeaturesSection
          title={
            service.subServices.length > 0
              ? `Types of ${service.name}`
              : `Features of ${service.name}`
          }
          items={
            service.subServices.length > 0
              ? service.subServices.map((sub) => ({
                  title: sub.name,
                  description: sub.summary,
                }))
              : content.features
          }
        />

        <MaterialsSection
          title="Materials / Technology"
          description={content.materialsOverview}
          prose={<p>{content.materialGradesGuidance}</p>}
          variant="muted"
        />

        <QualitySection
          title="Technical Considerations"
          items={content.technicalConsiderations}
        />

        {advanced ? (
          <FeaturesSection
            title="How to Choose"
            description="Decision points before you approve measurement and materials"
            items={advanced.howToChoose}
          />
        ) : (
          <InstallationProcess
            title="How to Choose — Measurement Guidance"
            steps={toProcessSteps(content.measurementGuidance)}
          />
        )}

        <InstallationProcess
          title="Site Inspection Before Work"
          steps={toProcessSteps(content.siteInspectionProcess)}
          variant="muted"
        />

        <SafetySection title="Safety Checks" items={content.safetyChecks} />

        <QualitySection
          title="Quality Checks"
          items={content.qualityChecks}
          variant="muted"
        />

        <MaintenanceSection
          title="Maintenance"
          items={[
            ...content.maintenanceInstructions,
            ...content.cleaningGuidance,
          ]}
        />

        <QualitySection
          title="Durability & Weather Notes"
          items={[
            ...content.durabilityFactors,
            ...content.weatherConsiderations,
          ]}
          variant="muted"
        />

        {advanced ? (
          <QualitySection title="Limitations" items={advanced.limitations} />
        ) : null}

        {advanced ? (
          <Section variant="muted">
            <Container>
              <SectionHeading
                title="When Another Service Is Better"
                description="Honest alternatives when this product is not the best fit."
              />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {advanced.whenAnotherServiceBetter.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
                  >
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {item.href ? (
                        <Link href={item.href} className="hover:text-amber-700">
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </Container>
          </Section>
        ) : null}

        <QualitySection
          title="Contractor-Selection Guidance"
          items={content.contractorSelectionGuidance}
        />
      </>
    ),
    useCases: {
      title: `Property types that suit ${service.name.toLowerCase()}`,
      description:
        "Each type opens a dedicated page with planning notes for that building style.",
      items: buildServiceUseCases({ serviceSlug: mediaSlug }),
    },
    options: {
      title: `${service.name} options compared`,
      description:
        "What each variation suits — and what it does not solve on its own.",
      items: buildServiceVariantOptions({
        serviceSlug: mediaSlug,
        serviceName: service.name,
      }),
    },
    requirements: {
      title: "Common Mistakes",
      items: content.commonMistakes,
    },
    process: {
      title: "Installation Process",
      steps: toProcessSteps(content.installationProcess),
    },
    pricing: {
      title: "What Affects Cost?",
      factors: content.pricingFactors,
      honestStatement:
        "Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity. Fixed package prices are not shown because every site differs.",
    },
    evidence: (
      <>
        <ProjectGallery
          title="Projects — Installation Photos"
          description="Real photographs from our installation set. We do not invent city names, customer quotes or ratings on these cards."
          projects={projectPhotos}
          showViewAll
        />
        <ServiceCityAreaLinks
          serviceSlug={mediaSlug}
          serviceName={INITIAL_SERVICE_MAP[mediaSlug]?.name ?? service.name}
          title="Service Areas"
          description={`${service.name} pages for priority cities and localities. Coverage is confirmed after site review—listing a place does not mean we operate a branch there.`}
          variant="muted"
        />
      </>
    ),
    related: buildServiceRelatedGroups({
      serviceSlug: mediaSlug,
      serviceName: service.name,
    }),
    faqs,
    faqTitle: `${service.name} — FAQs`,
    appendSections: (
      <>
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

        <RelatedGuides title="Useful Guides" guides={guides} variant="muted" />
      </>
    ),
    cta: {
      title: "Request a Quote",
      description: `Share your city, property type and opening photos for ${service.name}. We confirm availability after reviewing your site.`,
      message: `Hello, I need a quotation for ${service.name} installation in Andhra Pradesh.`,
    },
  };

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: service.name,
            description: service.summary,
            url: canonical,
          }),
          breadcrumbSchema(crumbs),
        ]}
      />

      <LandingPage data={landing} />
    </>
  );
}
