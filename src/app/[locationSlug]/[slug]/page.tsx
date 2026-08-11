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
import { QualitySection } from "@/components/sections/QualitySection";
import { MaintenanceSection } from "@/components/sections/MaintenanceSection";
import { PricingFactors } from "@/components/sections/PricingFactors";
import { AreaServicesMatrix } from "@/components/sections/AreaServicesMatrix";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { RelatedGuides } from "@/components/sections/RelatedGuides";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PillarPageView } from "@/components/sections/PillarPageView";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  INITIAL_SERVICE_MAP,
  INITIAL_SERVICES,
} from "@/data/initial-services";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { buildCityServiceContent } from "@/data/location-page-content";
import { getPillarPage } from "@/data/pillars";
import { getCityServiceFaqs } from "@/data/service-faqs";
import {
  getAreasForCity,
  getCityBySlug,
  getDistrictBySlug,
} from "@/lib/data/locations";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import {
  breadcrumbSchema,
  howToSchema,
  itemListSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";
import {
  generateDescription,
  generatePageMetadata,
  generateTitle,
} from "@/lib/seo/generate-page-metadata";
import { moneyPageIndexability } from "@/lib/seo/page-indexability";
import { BUSINESS_CONFIG } from "@/config/business";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{ locationSlug: string; slug: string }>;
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
  return HIGH_PRIORITY_CITY_AREAS.flatMap((city) =>
    Object.keys(INITIAL_SERVICE_MAP).map((slug) => ({
      locationSlug: city.citySlug,
      slug,
    })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationSlug, slug: serviceSlug } = await params;
  const city = getCityBySlug(locationSlug);
  const service = INITIAL_SERVICE_MAP[serviceSlug];
  if (!city || !service) return {};

  const pillar = getPillarPage(locationSlug, serviceSlug);
  if (pillar) {
    return generatePageMetadata({
      title: pillar.metaTitle,
      metaDescription: pillar.metaDescription,
      canonicalUrl: buildCanonicalUrl(`/${locationSlug}/${serviceSlug}/`),
      openGraphTitle: pillar.openGraphTitle,
      openGraphDescription: pillar.openGraphDescription,
      openGraphImage: BUSINESS_CONFIG.defaultOpenGraphImage,
      openGraphImageAlt: pillar.openGraphTitle,
      twitterTitle: pillar.openGraphTitle,
      twitterDescription: pillar.openGraphDescription,
      ...moneyPageIndexability("city-service"),
    });
  }

  const title = generateTitle(
    `${service.name} in ${city.name}`,
    "service-location",
  );

  return generatePageMetadata({
    title,
    metaDescription: generateDescription(service.name, city.name),
    canonicalUrl: buildCanonicalUrl(`/${locationSlug}/${serviceSlug}/`),
    ...moneyPageIndexability("city-service"),
  });
}

export default async function CityServicePage({ params }: PageProps) {
  const { locationSlug, slug: serviceSlug } = await params;
  const city = getCityBySlug(locationSlug);
  const service = INITIAL_SERVICE_MAP[serviceSlug];

  if (!city || !service) notFound();

  const pillar = getPillarPage(locationSlug, serviceSlug);
  if (pillar) {
    const pageUrl = buildCanonicalUrl(`/${locationSlug}/${serviceSlug}/`);
    const faqSection = pillar.sections.find((s) => s.kind === "faq");
    const processSection = pillar.sections.find((s) => s.kind === "process");
    const areaGraph = pillar.sections.find(
      (s) => s.kind === "link-graph" && s.id === "area-graph",
    );
    const faqs =
      faqSection && faqSection.kind === "faq" ? faqSection.items : [];

    return (
      <>
        <FaqJsonLd faqs={faqs} />
        <JsonLd
          data={[
            webPageSchema({
              name: pillar.metaTitle,
              description: pillar.metaDescription,
              url: pageUrl,
            }),
            serviceSchema({
              name: pillar.keyword,
              description: pillar.metaDescription,
              url: pageUrl,
              areaServed: "Visakhapatnam, Andhra Pradesh, India",
            }),
            breadcrumbSchema([
              { name: "Home", url: buildCanonicalUrl("/") },
              { name: "Services", url: buildCanonicalUrl("/services/") },
              {
                name: "Invisible Grills",
                url: buildCanonicalUrl(ROUTES.service("invisible-grills")),
              },
              { name: "Visakhapatnam", url: pageUrl },
            ]),
            ...(processSection && processSection.kind === "process"
              ? [
                  howToSchema({
                    name: `How invisible grill installation works in Visakhapatnam`,
                    description: processSection.lead,
                    steps: processSection.steps,
                  }),
                ]
              : []),
            ...(areaGraph && areaGraph.kind === "link-graph"
              ? [
                  itemListSchema({
                    name: "Invisible grills by Visakhapatnam locality",
                    items: areaGraph.links.map((link) => ({
                      name: link.label,
                      url: buildCanonicalUrl(link.href),
                    })),
                  }),
                ]
              : []),
          ]}
        />
        <PillarPageView pillar={pillar} />
        <AreaServicesMatrix
          citySlug={locationSlug}
          cityName={city.name}
          areas={getAreasForCity(locationSlug)}
          highlightServiceSlug={service.slug}
          title={`All ${city.name} areas × every service`}
          description={`Complete internal links for ${service.name} and the other core services across every curated locality in ${city.name}.`}
          variant="muted"
        />
      </>
    );
  }

  const district = city.district ? getDistrictBySlug(city.district) : undefined;
  const areas = getAreasForCity(locationSlug);
  const areaNames = areas.map((a) => a.name);
  const media = getServiceMedia(service.slug);
  const pageUrl = buildCanonicalUrl(`/${locationSlug}/${serviceSlug}/`);
  const metaDescription = generateDescription(service.name, city.name);

  const content = buildCityServiceContent({
    serviceSlug: service.slug,
    serviceName: service.name,
    cityName: city.name,
    citySlug: locationSlug,
    district: district?.name,
    areas: areaNames,
  });

  const faqs = getCityServiceFaqs(service.name, city.name);
  const relatedServices = INITIAL_SERVICES.filter((s) => s.slug !== service.slug);

  const pricingItems =
    service.pricingFactors.length > 0
      ? service.pricingFactors
      : [
          "Measured size of each opening or span",
          "Material grade and specification selected",
          "Access difficulty and floor height",
          "Number of openings in one project",
        ];

  const installSteps =
    service.installationSteps.length > 0
      ? service.installationSteps
      : [content.installationOverview];

  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <JsonLd
        data={[
          webPageSchema({
            name: `${service.name} in ${city.name}`,
            description: metaDescription,
            url: pageUrl,
          }),
          serviceSchema({
            name: `${service.name} in ${city.name}`,
            description: content.uniqueIntroduction.slice(0, 300),
            url: pageUrl,
            areaServed: `${city.name}, Andhra Pradesh, India`,
          }),
          breadcrumbSchema([
            { name: "Home", url: buildCanonicalUrl("/") },
            { name: "Services", url: buildCanonicalUrl("/services/") },
            {
              name: service.name,
              url: buildCanonicalUrl(ROUTES.service(service.slug)),
            },
            { name: city.name, url: pageUrl },
          ]),
        ]}
      />

      <ServiceHero
        badge={`${city.name} · Andhra Pradesh`}
        title={`${service.name} in ${city.name}`}
        description={`Compare the right fit for your balcony, window, terrace or duct in ${city.name}. Send a photo for a clear local estimate — coverage confirmed after site review, not a claimed branch office.`}
        serviceSlug={service.slug}
        image={{
          src: media.image,
          alt: media.alt,
        }}
        gallery={media.gallery.map((src) => ({ src, alt: media.alt }))}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services/" },
          { label: service.name, href: ROUTES.service(service.slug) },
          { label: city.name },
        ]}
        quoteHref={`${ROUTES.contact}?service=${encodeURIComponent(service.slug)}&city=${encodeURIComponent(city.name)}`}
        whatsappMessage={`Hello, I am sharing opening photos for ${service.name} estimate in ${city.name}, Andhra Pradesh.`}
      />

      <MaterialsSection
        title={`${service.name} Overview in ${city.name}`}
        prose={
          <>
            <p>{content.uniqueIntroduction}</p>
            <p>{content.localRequirements}</p>
          </>
        }
        note="Service availability is confirmed after reviewing site access, measurements and technician scheduling."
      />

      <FeaturesSection
        title="Suitable Property Types"
        items={[
          {
            title: "Property fit",
            description: content.suitablePropertyTypes,
          },
        ]}
        variant="muted"
      />

      <BenefitsSection
        title="Customer Problems Solved"
        items={[
          {
            title: "Local use cases",
            description: content.problemsSolved,
          },
        ]}
      />

      <QualitySection title="Key Benefits" items={service.benefits} variant="muted" />

      <QualitySection title="Product Features" items={service.features} />

      <MaterialsSection
        title="Materials Guidance"
        prose={
          <>
            <p>{content.materialsGuidance}</p>
            {service.materials.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5">
                {service.materials.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </>
        }
        variant="muted"
      />

      <InstallationProcess
        title={`Installation Process in ${city.name}`}
        steps={toProcessSteps(installSteps)}
        description={content.installationOverview}
      />

      <SafetySection title="Safety Information" items={service.safetyInformation} />

      <SafetySection
        title={`Weather Considerations for ${city.name}`}
        items={[content.weatherNotes]}
        variant="default"
      />

      <MaintenanceSection
        title="Maintenance Guidance"
        items={service.maintenanceTips}
        variant="muted"
      />

      <PricingFactors
        title="Pricing Factors"
        items={pricingItems}
        honestStatement={`${content.pricingNote} Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.`}
      />

      <CoverageSection
        title={`Areas Served in ${city.name}`}
        coverageText={content.areasServedIntro}
        links={[
          { label: `${service.name} overview`, href: ROUTES.service(service.slug) },
          {
            label: `All services in ${city.name}`,
            href: ROUTES.location(locationSlug),
          },
        ]}
      />

      {areas.length > 0 ? (
        <AreaServicesMatrix
          citySlug={locationSlug}
          cityName={city.name}
          areas={areas}
          highlightServiceSlug={service.slug}
          title={`${service.name} — all areas in ${city.name}`}
          description={`Every curated locality in ${city.name} with links to ${service.name} plus the other three core services.`}
          variant="muted"
        />
      ) : null}

      <RelatedServices
        title="Related Services"
        services={relatedServices.map((related) => ({
          name: related.name,
          slug: related.slug,
          summary: `${related.summary} Available in ${city.name} subject to site confirmation.`,
          benefits: related.benefits.slice(0, 3),
          image: getServiceMedia(related.slug).image,
          href: ROUTES.cityService(locationSlug, related.slug),
        }))}
      />

      <RelatedGuides
        title="Related Links & Guides"
        guides={[
          {
            title: `${service.name} service overview`,
            href: ROUTES.service(service.slug),
            summary: `Statewide overview for ${service.name.toLowerCase()} installation.`,
          },
          {
            title: `All services in ${city.name}`,
            href: ROUTES.location(locationSlug),
            summary: `Browse coverage and service options for ${city.name}.`,
          },
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
        variant="muted"
      />

      <FAQSection
        title={`${service.name} in ${city.name} — FAQs`}
        items={faqs}
      />

      <FinalCTA
        title={`Ready to compare the right ${service.shortName.toLowerCase()} for your space in ${city.name}?`}
        description={`Send the opening, your ${city.name} locality, and the main concern—children, pets, birds, visibility or sports. That is enough to start a useful conversation.`}
        whatsappMessage={`Hello, I am sharing opening photos for ${service.name} estimate in ${city.name}.`}
      />
    </>
  );
}
