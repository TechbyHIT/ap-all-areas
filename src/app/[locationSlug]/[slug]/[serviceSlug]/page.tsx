import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { InstallationProcess } from "@/components/sections/InstallationProcess";
import { SafetySection } from "@/components/sections/SafetySection";
import { MaintenanceSection } from "@/components/sections/MaintenanceSection";
import { PricingFactors } from "@/components/sections/PricingFactors";
import { AreaServicesMatrix } from "@/components/sections/AreaServicesMatrix";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { RelatedGuides } from "@/components/sections/RelatedGuides";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { SeoEncyclopediaSections } from "@/components/sections/SeoEncyclopediaSections";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  P0_MONEY_CITY_SLUGS,
} from "@/data/city-local-profiles";
import {
  INITIAL_SERVICE_MAP,
  INITIAL_SERVICES,
} from "@/data/initial-services";
import { prerenderAreas, prerenderCities } from "@/config/prerender";
import { getAreaLocalFact } from "@/data/area-local-facts";
import { buildAreaServiceContent } from "@/data/location-page-content";
import { getAreaServiceFaqs } from "@/data/service-faqs";
import {
  getAreaBySlugs,
  getAreasForCity,
  getCityBySlug,
} from "@/lib/data/locations";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import {
  breadcrumbSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";
import {
  generateDescription,
  generatePageMetadata,
  generateTitle,
} from "@/lib/seo/generate-page-metadata";
import {
  moneyPageIndexability,
  seedLocationIndexability,
} from "@/lib/seo/page-indexability";

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
 * Seed only — full matrix stays live via `dynamicParams` + ISR.
 * Uncapped SSG of area×service is what balloons standalone to multi-GB.
 */
export async function generateStaticParams() {
  return prerenderCities().flatMap((city) =>
    prerenderAreas(city).flatMap((area) =>
      Object.keys(INITIAL_SERVICE_MAP).map((serviceSlug) => ({
        locationSlug: city.citySlug,
        slug: area.slug,
        serviceSlug,
      })),
    ),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationSlug, slug: areaSlug, serviceSlug } = await params;
  const city = getCityBySlug(locationSlug);
  const area = getAreaBySlugs(locationSlug, areaSlug);
  const service = INITIAL_SERVICE_MAP[serviceSlug];
  if (!city || !area || !service) return {};

  const title = generateTitle(
    `${service.name} in ${area.name}, ${city.name}`,
    "service-area",
  );

  const isP0 = (P0_MONEY_CITY_SLUGS as readonly string[]).includes(
    locationSlug,
  );

  return generatePageMetadata({
    title,
    metaDescription: generateDescription(
      service.name,
      `${area.name}, ${city.name}`,
    ),
    canonicalUrl: buildCanonicalUrl(
      `/${locationSlug}/${areaSlug}/${serviceSlug}/`,
    ),
    ...(isP0
      ? moneyPageIndexability("locality-service")
      : seedLocationIndexability()),
  });
}

export default async function AreaServicePage({ params }: PageProps) {
  const { locationSlug, slug: areaSlug, serviceSlug } = await params;
  const city = getCityBySlug(locationSlug);
  const area = getAreaBySlugs(locationSlug, areaSlug);
  const service = INITIAL_SERVICE_MAP[serviceSlug];

  if (!city || !area || !service) notFound();

  const areaFact = getAreaLocalFact(locationSlug, areaSlug);
  const content = buildAreaServiceContent({
    serviceSlug: service.slug,
    serviceName: service.name,
    areaName: area.name,
    cityName: city.name,
    citySlug: locationSlug,
    areaSlug,
  });

  const faqs = getAreaServiceFaqs(service.name, area.name, city.name, {
    buildingStock: areaFact?.buildingStock,
    accessNote: areaFact?.accessNote,
    commonNeeds: areaFact?.commonNeeds,
  });
  const allCityAreas = getAreasForCity(locationSlug);
  const siblingAreas = allCityAreas.filter((a) => a.slug !== areaSlug);
  const relatedServices = INITIAL_SERVICES.filter((s) => s.slug !== service.slug);
  const media = getServiceMedia(service.slug);
  const pageUrl = buildCanonicalUrl(
    `/${locationSlug}/${areaSlug}/${serviceSlug}/`,
  );
  const metaDescription = generateDescription(
    service.name,
    `${area.name}, ${city.name}`,
  );
  const isP0 = (P0_MONEY_CITY_SLUGS as readonly string[]).includes(
    locationSlug,
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

  return (
    <>
      <FaqJsonLd faqs={faqs} />
      {isP0 ? (
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

      <ServiceHero
        badge={`${area.name}, ${city.name}`}
        title={`${service.name} in ${area.name}, ${city.name}`}
        description={`Send a photo of the opening in ${area.name} for a clear estimate. ${service.name} coverage is confirmed after site review — not a claimed neighbourhood branch.`}
        serviceSlug={service.slug}
        image={{
          src: media.image,
          alt: media.alt,
        }}
        gallery={media.gallery.map((src) => ({ src, alt: media.alt }))}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: city.name, href: ROUTES.location(locationSlug) },
          { label: area.name, href: ROUTES.area(locationSlug, areaSlug) },
          { label: service.name },
        ]}
        quoteHref={`${ROUTES.contact}?service=${encodeURIComponent(service.slug)}&city=${encodeURIComponent(city.name)}`}
        whatsappMessage={`Hello, I am sharing opening photos for ${service.name} in ${area.name}, ${city.name}.`}
        className="[&>div]:py-8 md:[&>div]:py-10"
      />

      <MaterialsSection
        title={`${service.name} in ${area.name}`}
        prose={
          <>
            <p>{content.uniqueIntroduction}</p>
            <p>{content.serviceOverview}</p>
          </>
        }
        note="Address-level coverage is confirmed after reviewing access, measurements and technician availability."
      />

      <SeoEncyclopediaSections sections={content.encyclopedia} />

      <BenefitsSection
        title={`Residential Applications in ${area.name}`}
        items={[
          {
            title: "Homes and apartments",
            description: content.residentialApplications,
          },
          {
            title: "Suitable property types",
            description: content.suitablePropertyTypes,
          },
        ]}
        variant="muted"
      />

      <SafetySection
        title="Safety Requirements"
        items={[content.safetyRequirements, ...service.safetyInformation]}
      />

      <MaterialsSection
        title="Materials Guidance"
        prose={<p>{content.materialGuidance}</p>}
        cards={service.materials.map((item) => ({
          title: item,
          description: "Confirmed after on-site measurement and exposure review.",
        }))}
        variant="muted"
      />

      <FeaturesSection
        title="Measurement Process"
        items={[
          {
            title: "On-site measurement",
            description: content.measurementProcess,
          },
        ]}
      />

      <InstallationProcess
        title={`Installation Steps in ${area.name}`}
        steps={toProcessSteps(installationSteps)}
        description={content.installationSteps}
        variant="muted"
      />

      <MaintenanceSection
        title="Maintenance Advice"
        items={[content.maintenanceAdvice, ...service.maintenanceTips]}
      />

      <PricingFactors
        title="Pricing Factors"
        items={pricingItems}
        honestStatement={`${content.pricingNote} Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.`}
      />

      <CoverageSection
        title="Parent City & Area Links"
        coverageText={`${area.name} is part of ${city.name} coverage planning. Use the links below for broader context or nearby localities.`}
        links={[
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
        ]}
        variant="muted"
      />

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

      <RelatedGuides
        title="Helpful Guides"
        guides={[
          {
            title: "Pricing guide",
            href: "/pricing-guide/",
            summary: "Understand what affects installation cost.",
          },
          {
            title: "Materials guide",
            href: "/materials-guide/",
            summary: "Material notes for outdoor installations.",
          },
          {
            title: "Installation process",
            href: "/installation-process/",
            summary: "What to expect from measurement to handover.",
          },
          {
            title: "Safety guide",
            href: "/safety-guide/",
            summary: "Usage and maintenance safety information.",
          },
        ]}
      />

      <FAQSection
        title={`${service.name} in ${area.name} — FAQs`}
        items={faqs}
      />

      <FinalCTA
        title={`Ready for a measured ${service.shortName.toLowerCase()} quote in ${area.name}?`}
        description={`Send the opening photo, your building access notes, and the main concern. We confirm availability for your specific address in ${area.name}, ${city.name}.`}
        whatsappMessage={`Hello, I am sharing opening photos for ${service.name} in ${area.name}, ${city.name}.`}
      />
    </>
  );
}
