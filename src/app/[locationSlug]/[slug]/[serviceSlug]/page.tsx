import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import {
  STATE_NAME,
  STATE_SLUG,
} from "@/config/geo";
import { SEO_CONFIG } from "@/config/seo";
import { LandingPage } from "@/components/landing/LandingPage";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { SafetySection } from "@/components/sections/SafetySection";
import { MaintenanceSection } from "@/components/sections/MaintenanceSection";
import { AreaServicesMatrix } from "@/components/sections/AreaServicesMatrix";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { SeoEncyclopediaSections } from "@/components/sections/SeoEncyclopediaSections";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  listLocationServices,
  resolveLocationService,
} from "@/lib/data/location-catalog";
import { getAreaLocalFact } from "@/data/area-local-facts";
import { getCityLocalProfile } from "@/data/city-local-profiles";
import { buildAreaServiceContent } from "@/data/location-page-content";
import { getAreaServiceFaqs } from "@/data/service-faqs";
import { buildVariantFaqs } from "@/data/service-variant-content";
import {
  getAreaBySlugs,
  getAreasForCity,
  getCityBySlug,
} from "@/lib/data/locations";
import { shouldGeneratePage } from "@/lib/seo/page-decision";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import {
  breadcrumbSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";
import {
  generateDescription,
  generatePageMetadata,
} from "@/lib/seo/generate-page-metadata";
import { buildProgrammaticIndexability } from "@/lib/seo/programmatic-indexability";
import { countAreaServiceWords } from "@/lib/seo/content-word-count";
import { buildLocationUseCases } from "@/lib/landing/builders/location-landing";
import {
  buildServiceQuickStart,
  buildServiceRelatedGroups,
  buildServiceVariantOptions,
} from "@/lib/landing/builders/service-landing";
import type { LandingPageData } from "@/lib/landing/types";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{
    locationSlug: string;
    slug: string;
    serviceSlug: string;
  }>;
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

/**
 * Public area×service URLs are prerendered on the silo wrappers.
 * This internal module stays reachable through `dynamicParams` + ISR.
 */
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationSlug, slug: areaSlug, serviceSlug } = await params;
  const city = getCityBySlug(locationSlug);
  const area = getAreaBySlugs(locationSlug, areaSlug);
  const service = resolveLocationService(serviceSlug);
  if (!city || !area || !service) return {};

  const title = `${service.name} in ${area.name}, ${city.name} ${SEO_CONFIG.titleSuffix}`;
  const decision = shouldGeneratePage({
    kind: "area-service",
    stateSlug: STATE_SLUG,
    citySlug: locationSlug,
    areaSlug,
    serviceSlug,
  });
  if (!decision.generate) return {};

  const areaFact = getAreaLocalFact(locationSlug, areaSlug);
  const candidatePath = ROUTES.areaService(locationSlug, areaSlug, serviceSlug);
  const content = buildAreaServiceContent({
    serviceSlug: service.slug,
    serviceName: service.name,
    areaName: area.name,
    cityName: city.name,
    citySlug: locationSlug,
    areaSlug,
  });
  const faqs = [
    ...buildVariantFaqs(service.slug, `${area.name}, ${city.name}`),
    ...getAreaServiceFaqs(service.name, area.name, city.name),
  ];

  return generatePageMetadata({
    title,
    metaDescription: generateDescription(
      service.name,
      `${area.name}, ${city.name}`,
    ),
    canonicalUrl: buildCanonicalUrl(candidatePath),
    openGraphImage: getServiceMedia(service.slug).image,
    openGraphImageAlt: `${service.name} installation near ${area.name}, ${city.name}`,
    ...buildProgrammaticIndexability({
      decision: {
        kind: "area-service",
        stateSlug: STATE_SLUG,
        citySlug: locationSlug,
        areaSlug,
        serviceSlug,
      },
      candidatePath,
      cannibalKind: "area-service",
      tier: "locality-service",
      hasUniqueLocalFacts: Boolean(areaFact),
      hasCityProfile: Boolean(getCityLocalProfile(locationSlug)),
      wordCount: countAreaServiceWords(content, faqs),
    }),
  });
}

export default async function AreaServicePage({ params }: PageProps) {
  const { locationSlug, slug: areaSlug, serviceSlug } = await params;
  const city = getCityBySlug(locationSlug);
  const area = getAreaBySlugs(locationSlug, areaSlug);
  const service = resolveLocationService(serviceSlug);

  if (!city || !area || !service) notFound();

  const decision = shouldGeneratePage({
    kind: "area-service",
    stateSlug: STATE_SLUG,
    citySlug: locationSlug,
    areaSlug,
    serviceSlug,
  });
  if (!decision.generate) notFound();

  const areaFact = getAreaLocalFact(locationSlug, areaSlug);
  const indexMeta = buildProgrammaticIndexability({
    decision: {
      kind: "area-service",
      stateSlug: STATE_SLUG,
      citySlug: locationSlug,
      areaSlug,
      serviceSlug,
    },
    candidatePath: ROUTES.areaService(locationSlug, areaSlug, serviceSlug),
    cannibalKind: "area-service",
    tier: "locality-service",
    hasUniqueLocalFacts: Boolean(areaFact),
  });
  const shouldIndex = indexMeta.allowIndexing;

  const content = buildAreaServiceContent({
    serviceSlug: service.slug,
    serviceName: service.name,
    areaName: area.name,
    cityName: city.name,
    citySlug: locationSlug,
    areaSlug,
  });

  /* Variant questions first — they are what separates this page from the
     sibling variation in the same locality. Parent-service FAQs follow. */
  const faqs = [
    ...buildVariantFaqs(service.slug, `${area.name}, ${city.name}`),
    ...getAreaServiceFaqs(service.name, area.name, city.name, {
      buildingStock: areaFact?.buildingStock,
      accessNote: areaFact?.accessNote,
      commonNeeds: areaFact?.commonNeeds,
    }),
  ];
  const allCityAreas = getAreasForCity(locationSlug);
  const siblingAreas = allCityAreas.filter((a) => a.slug !== areaSlug);
  const relatedServices = listLocationServices().filter(
    (s) => s.slug !== service.slug,
  );
  const media = getServiceMedia(service.slug);
  const pageUrl = buildCanonicalUrl(
    ROUTES.areaService(locationSlug, areaSlug, serviceSlug),
  );
  const metaDescription = generateDescription(
    service.name,
    `${area.name}, ${city.name}`,
  );

  const installationSteps =
    service.installationSteps.length > 0
      ? service.installationSteps
      : [
          content.measurementProcess,
          content.installationSteps,
          "Complete finishing checks and share basic care notes before handover.",
        ];

  const pricingItems =
    service.pricingFactors.length > 0
      ? service.pricingFactors
      : [
          "Measured opening or span size",
          "Material specification selected",
          "Building access in the area",
          "Number of openings in one visit",
        ];

  const landing: LandingPageData = {
    pageType: "locality-service",
    intent: "transactional",
    canonicalUrl: pageUrl,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Locations", href: ROUTES.locations },
      { label: STATE_NAME, href: ROUTES.state },
      { label: city.name, href: ROUTES.location(locationSlug) },
      { label: area.name, href: ROUTES.area(locationSlug, areaSlug) },
      { label: service.name },
    ],
    hero: {
      title: `${service.name} in ${area.name}, ${city.name}`,
      description: `Send a photo of the opening in ${area.name} for a clear estimate. ${service.name} coverage is confirmed after site review — not a claimed neighbourhood branch.`,
      badge: `${area.name}, ${city.name}`,
      composition: "locality-service-split",
      image: { src: media.image, alt: media.alt },
    },
    trustLabel: `${area.name}, ${city.name}`,
    quickStart: {
      title: `Not sure which ${service.shortName.toLowerCase()} fits?`,
      options: buildServiceQuickStart({
        serviceSlug: service.slug,
        citySlug: locationSlug,
      }),
    },
    primaryContentTitle: `${service.name} in ${area.name}`,
    primaryContent: (
      <>
        <p>{content.uniqueIntroduction}</p>
        <p>{content.serviceOverview}</p>
        <p>{content.buyingGuide}</p>
        <p>{content.localAuthorityNote}</p>
      </>
    ),
    primaryContentNote:
      "Address-level coverage is confirmed after reviewing access, measurements and technician availability.",
    contentBlocks: (
      <>
        <SeoEncyclopediaSections sections={content.encyclopedia} />
        <SafetySection
          title="Safety Requirements"
          items={[content.safetyRequirements, ...service.safetyInformation]}
        />
        <MaterialsSection
          title="Materials Guidance"
          prose={<p>{content.materialGuidance}</p>}
          cards={service.materials.map((item) => ({
            title: item,
            description:
              "Confirmed after on-site measurement and exposure review.",
          }))}
          variant="muted"
        />
        <MaintenanceSection
          title="Maintenance Advice"
          items={[content.maintenanceAdvice, ...service.maintenanceTips]}
        />
      </>
    ),
    benefits: {
      title: `Residential Applications in ${area.name}`,
      items: [
        {
          title: "Homes and apartments",
          description: content.residentialApplications,
        },
        {
          title: "Suitable property types",
          description: content.suitablePropertyTypes,
        },
        {
          title: "On-site measurement",
          description: content.measurementProcess,
        },
      ],
    },
    useCases: {
      title: `Local planning notes for ${area.name}`,
      description: `Conditions we check in ${area.name} before recommending a ${service.shortName.toLowerCase()} specification.`,
      items: buildLocationUseCases({
        citySlug: locationSlug,
        cityName: city.name,
        areaSlug,
        areaName: area.name,
      }),
    },
    options: {
      title: `${service.name} variations`,
      description: `Availability of each variation in ${area.name} follows a site review.`,
      items: buildServiceVariantOptions({
        serviceSlug: service.slug,
        serviceName: service.name,
        place: area.name,
        citySlug: locationSlug,
        areaSlug,
      }),
    },
    requirements: {
      title: "Product Features",
      items: service.features,
    },
    process: {
      title: `Installation Steps in ${area.name}`,
      description: content.installationSteps,
      steps: toProcessSteps(installationSteps),
    },
    pricing: {
      title: "Pricing Factors",
      factors: pricingItems,
      honestStatement: `${content.pricingNote} Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.`,
    },
    coverage: {
      title: "Parent City & Area Links",
      text: `${area.name} is part of ${city.name} coverage planning. Use the links below for broader context or nearby localities.`,
      links: [
        {
          label: `${service.name} in ${city.name}`,
          href: ROUTES.cityService(locationSlug, service.slug),
        },
        {
          label: `All services in ${area.name}`,
          href: ROUTES.area(locationSlug, areaSlug),
        },
        {
          label: `${city.name} service coverage`,
          href: ROUTES.location(locationSlug),
        },
        {
          label: `${service.name} overview`,
          href: ROUTES.service(service.slug),
        },
      ],
    },
    related: buildServiceRelatedGroups({
      serviceSlug: service.slug,
      serviceName: service.name,
      citySlug: locationSlug,
      cityName: city.name,
    }),
    faqs,
    faqTitle: `${service.name} in ${area.name} — FAQs`,
    emitFaqSchema: shouldIndex,
    appendSections: (
      <>
        {siblingAreas.length > 0 ? (
          <AreaServicesMatrix
            citySlug={locationSlug}
            cityName={city.name}
            areas={allCityAreas}
            excludeAreaSlug={areaSlug}
            highlightServiceSlug={service.slug}
            title={`All other ${city.name} areas × every service`}
            description={`${service.name} and the other core services for every neighbouring locality in ${city.name}.`}
          />
        ) : null}
        <RelatedServices
          title={`Related Services in ${area.name}`}
          services={relatedServices.map((related) => ({
            name: related.name,
            slug: related.slug,
            summary: related.summary,
            benefits: related.benefits.slice(0, 3),
            image: getServiceMedia(related.slug).image,
            href: ROUTES.areaService(locationSlug, areaSlug, related.slug),
          }))}
          variant="muted"
        />
      </>
    ),
    cta: {
      title: `Ready for a measured ${service.shortName.toLowerCase()} quote in ${area.name}?`,
      description: `Send the opening photo, your building access notes, and the main concern. We confirm availability for your specific address in ${area.name}, ${city.name}.`,
      message: `Hello, I am sharing opening photos for ${service.name} in ${area.name}, ${city.name}.`,
    },
  };

  return (
    <>
      {shouldIndex ? (
        <JsonLd
          data={[
            webPageSchema({
              name: `${service.name} in ${area.name}, ${city.name}`,
              description: metaDescription,
              url: pageUrl,
            }),
            serviceSchema({
              name: `${service.name} in ${area.name}, ${city.name}`,
              description: content.uniqueIntroduction.slice(0, 300),
              url: pageUrl,
              areaServed: `${area.name}, ${city.name}, Andhra Pradesh`,
            }),
            breadcrumbSchema([
              { name: "Home", url: buildCanonicalUrl("/") },
              { name: "Locations", url: buildCanonicalUrl(ROUTES.locations) },
              { name: STATE_NAME, url: buildCanonicalUrl(ROUTES.state) },
              {
                name: city.name,
                url: buildCanonicalUrl(ROUTES.location(locationSlug)),
              },
              {
                name: area.name,
                url: buildCanonicalUrl(ROUTES.area(locationSlug, areaSlug)),
              },
              { name: service.name, url: pageUrl },
            ]),
          ]}
        />
      ) : null}

      <LandingPage data={landing} />
    </>
  );
}
