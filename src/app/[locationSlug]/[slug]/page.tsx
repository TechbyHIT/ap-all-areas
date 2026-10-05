import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { LandingPage } from "@/components/landing/LandingPage";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { QualitySection } from "@/components/sections/QualitySection";
import { SafetySection } from "@/components/sections/SafetySection";
import { MaintenanceSection } from "@/components/sections/MaintenanceSection";
import { AreaServicesMatrix } from "@/components/sections/AreaServicesMatrix";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { PillarPageView } from "@/components/sections/PillarPageView";
import { SeoEncyclopediaSections } from "@/components/sections/SeoEncyclopediaSections";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  listLocationServices,
  resolveLocationService,
} from "@/lib/data/location-catalog";
import { buildCityServiceContent } from "@/data/location-page-content";
import { getPillarPage } from "@/data/pillars";
import { getCityLocalProfile } from "@/data/city-local-profiles";
import { getCityServiceFaqs } from "@/data/service-faqs";
import { buildVariantFaqs } from "@/data/service-variant-content";
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
} from "@/lib/seo/generate-page-metadata";
import { buildProgrammaticIndexability } from "@/lib/seo/programmatic-indexability";
import {
  countCityServiceWords,
  countPillarWords,
} from "@/lib/seo/content-word-count";
import { BUSINESS_CONFIG } from "@/config/business";
import {
  STATE_NAME,
  STATE_SLUG,
} from "@/config/geo";
import { SEO_CONFIG } from "@/config/seo";
import { shouldGeneratePage } from "@/lib/seo/page-decision";
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
  // Public city×service URLs are prerendered on the silo wrappers.
  // Legacy `/{city}/{service}/` 308s onto the silo and must not SSG.
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationSlug, slug: serviceSlug } = await params;
  const city = getCityBySlug(locationSlug);
  const service = resolveLocationService(serviceSlug);
  if (!city || !service) return {};

  const decision = shouldGeneratePage({
    kind: "city-service",
    stateSlug: STATE_SLUG,
    citySlug: locationSlug,
    serviceSlug,
  });
  if (!decision.generate) return {};

  const pillar = getPillarPage(locationSlug, serviceSlug);
  const cityProfile = getCityLocalProfile(locationSlug);
  const candidatePath = ROUTES.cityService(locationSlug, serviceSlug);
  const district = city.district ? getDistrictBySlug(city.district) : undefined;
  const wordCount = pillar
    ? countPillarWords(pillar)
    : countCityServiceWords(
        buildCityServiceContent({
          serviceSlug: service.slug,
          serviceName: service.name,
          cityName: city.name,
          citySlug: locationSlug,
          district: district?.name,
          areas: getAreasForCity(locationSlug).map((area) => area.name),
        }),
        [
          ...buildVariantFaqs(service.slug, city.name),
          ...getCityServiceFaqs(service.name, city.name),
        ],
      );
  const indexInput = buildProgrammaticIndexability({
    decision: {
      kind: "city-service",
      stateSlug: STATE_SLUG,
      citySlug: locationSlug,
      serviceSlug,
    },
    candidatePath,
    cannibalKind: "city-service",
    tier: "city-service",
    hasCityProfile: Boolean(cityProfile),
    wordCount,
  });

  if (pillar) {
    return generatePageMetadata({
      title: pillar.metaTitle,
      metaDescription: pillar.metaDescription,
      canonicalUrl: buildCanonicalUrl(candidatePath),
      openGraphTitle: pillar.openGraphTitle,
      openGraphDescription: pillar.openGraphDescription,
      openGraphImage: BUSINESS_CONFIG.defaultOpenGraphImage,
      openGraphImageAlt: pillar.openGraphTitle,
      twitterTitle: pillar.openGraphTitle,
      twitterDescription: pillar.openGraphDescription,
      ...indexInput,
    });
  }

  const title = `${service.name} in ${city.name} ${SEO_CONFIG.titleSuffix}`;

  return generatePageMetadata({
    title,
    metaDescription: generateDescription(service.name, city.name),
    canonicalUrl: buildCanonicalUrl(candidatePath),
    openGraphImage: getServiceMedia(service.slug).image,
    openGraphImageAlt: `${service.name} installation in ${city.name}`,
    ...indexInput,
  });
}

export default async function CityServicePage({ params }: PageProps) {
  const { locationSlug, slug: serviceSlug } = await params;
  const city = getCityBySlug(locationSlug);
  const service = resolveLocationService(serviceSlug);

  if (!city || !service) notFound();

  const decision = shouldGeneratePage({
    kind: "city-service",
    stateSlug: STATE_SLUG,
    citySlug: locationSlug,
    serviceSlug,
  });
  if (!decision.generate) notFound();

  const pageUrl = buildCanonicalUrl(
    ROUTES.cityService(locationSlug, serviceSlug),
  );

  /* Pillar cities keep their bespoke editorial layout — it is hand-authored,
     not generated, so the universal template would flatten it. */
  const pillar = getPillarPage(locationSlug, serviceSlug);
  if (pillar) {
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
              areaServed: `${city.name}, Andhra Pradesh, India`,
            }),
            breadcrumbSchema([
              { name: "Home", url: buildCanonicalUrl("/") },
              { name: "Locations", url: buildCanonicalUrl(ROUTES.locations) },
              { name: STATE_NAME, url: buildCanonicalUrl(ROUTES.state) },
              {
                name: city.name,
                url: buildCanonicalUrl(ROUTES.location(locationSlug)),
              },
              { name: service.name, url: pageUrl },
            ]),
            ...(processSection && processSection.kind === "process"
              ? [
                  howToSchema({
                    name: `How ${service.name.toLowerCase()} installation works in ${city.name}`,
                    description: processSection.lead,
                    steps: processSection.steps,
                  }),
                ]
              : []),
            ...(areaGraph && areaGraph.kind === "link-graph"
              ? [
                  itemListSchema({
                    name: `${service.name} by ${city.name} locality`,
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
          title={`Local ${service.name} pages in ${city.name}`}
          description={`${service.name} pages for every curated ${city.name} locality.`}
          variant="muted"
        />
      </>
    );
  }

  const district = city.district ? getDistrictBySlug(city.district) : undefined;
  const areas = getAreasForCity(locationSlug);
  const areaNames = areas.map((a) => a.name);
  const media = getServiceMedia(service.slug);
  const metaDescription = generateDescription(service.name, city.name);

  const content = buildCityServiceContent({
    serviceSlug: service.slug,
    serviceName: service.name,
    cityName: city.name,
    citySlug: locationSlug,
    district: district?.name,
    areas: areaNames,
  });

  /* Variant questions first — they are what separates this page from the
     sibling variation in the same city. Parent-service FAQs follow. */
  const faqs = [
    ...buildVariantFaqs(service.slug, city.name),
    ...getCityServiceFaqs(service.name, city.name),
  ];
  const relatedServices = listLocationServices().filter(
    (s) => s.slug !== service.slug,
  );

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

  const landing: LandingPageData = {
    pageType: "city-service",
    intent: "transactional",
    canonicalUrl: pageUrl,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Locations", href: ROUTES.locations },
      { label: STATE_NAME, href: ROUTES.state },
      { label: city.name, href: ROUTES.location(locationSlug) },
      { label: service.name },
    ],
    hero: {
      title: `${service.name} in ${city.name}`,
      description: `Compare the right fit for your balcony, window, terrace or duct in ${city.name}. Send a photo for a clear local estimate — coverage confirmed after site review, not a claimed branch office.`,
      badge: `${city.name} · ${STATE_NAME}`,
      composition: "service-local-split",
      image: { src: media.image, alt: media.alt },
    },
    trustLabel: `${service.name} · ${city.name}`,
    quickStart: {
      title: `Start with the right ${service.shortName.toLowerCase()} for your opening`,
      description:
        "Jump straight to the variation, the city hub or the pricing explanation.",
      options: buildServiceQuickStart({
        serviceSlug: service.slug,
        citySlug: locationSlug,
      }),
    },
    primaryContentTitle: `${service.name} Overview in ${city.name}`,
    primaryContent: (
      <>
        <p>{content.uniqueIntroduction}</p>
        <p>{content.localRequirements}</p>
        <p>{content.buyingGuide}</p>
        <p>{content.localAuthorityNote}</p>
      </>
    ),
    primaryContentNote:
      "Service availability is confirmed after reviewing site access, measurements and technician scheduling.",
    contentBlocks: (
      <>
        <SeoEncyclopediaSections sections={content.encyclopedia} />
        <QualitySection
          title="Key Benefits"
          items={service.benefits}
          variant="muted"
        />
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
        />
        <SafetySection
          title="Safety Information"
          items={service.safetyInformation}
          variant="muted"
        />
        <SafetySection
          title={`Weather Considerations for ${city.name}`}
          items={[content.weatherNotes]}
        />
        <MaintenanceSection
          title="Maintenance Guidance"
          items={service.maintenanceTips}
          variant="muted"
        />
      </>
    ),
    benefits: {
      title: `Why ${city.name} customers ask for this`,
      items: [
        {
          title: "Customer problems solved",
          description: content.problemsSolved,
        },
        {
          title: "Suitable property types",
          description: content.suitablePropertyTypes,
        },
      ],
    },
    useCases: {
      title: `Where ${service.shortName.toLowerCase()} fits in ${city.name}`,
      description:
        "Property types that list this service as suitable — each opens a dedicated page.",
      items: buildServiceUseCases({
        serviceSlug: service.slug,
        place: city.name,
      }),
    },
    options: {
      title: `${service.name} variations`,
      description:
        "Pick the variation that matches the opening — including what each one does not solve.",
      items: buildServiceVariantOptions({
        serviceSlug: service.slug,
        serviceName: service.name,
        place: city.name,
        citySlug: locationSlug,
      }),
    },
    requirements: {
      title: "Product Features",
      items: service.features,
    },
    process: {
      title: `Installation Process in ${city.name}`,
      description: content.installationOverview,
      steps: toProcessSteps(installSteps),
    },
    pricing: {
      title: "Pricing Factors",
      factors: pricingItems,
      honestStatement: `${content.pricingNote} Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.`,
    },
    coverage: {
      title: `Areas Served in ${city.name}`,
      text: content.areasServedIntro,
      links: [
        {
          label: `${service.name} overview`,
          href: ROUTES.service(service.slug),
        },
        {
          label: `All services in ${city.name}`,
          href: ROUTES.location(locationSlug),
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
    faqTitle: `${service.name} in ${city.name} — FAQs`,
    appendSections: (
      <>
        {areas.length > 0 ? (
          <AreaServicesMatrix
            citySlug={locationSlug}
            cityName={city.name}
            areas={areas}
            highlightServiceSlug={service.slug}
            title={`${service.name} in every ${city.name} area`}
            description={`${service.name} × every curated locality in ${city.name}.`}
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
      </>
    ),
    cta: {
      title: `Ready to compare the right ${service.shortName.toLowerCase()} for your space in ${city.name}?`,
      description: `Send the opening, your ${city.name} locality, and the main concern — children, pets, birds, visibility or sports. That is enough to start a useful conversation.`,
      message: `Hello, I am sharing opening photos for ${service.name} estimate in ${city.name}.`,
    },
  };

  return (
    <>
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
            { name: "Locations", url: buildCanonicalUrl(ROUTES.locations) },
            { name: STATE_NAME, url: buildCanonicalUrl(ROUTES.state) },
            {
              name: city.name,
              url: buildCanonicalUrl(ROUTES.location(locationSlug)),
            },
            { name: service.name, url: pageUrl },
          ]),
        ]}
      />

      <LandingPage data={landing} />
    </>
  );
}
