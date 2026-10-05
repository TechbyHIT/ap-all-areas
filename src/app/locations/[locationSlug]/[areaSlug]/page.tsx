import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { AreaServicesMatrix } from "@/components/sections/AreaServicesMatrix";
import { SeoEncyclopediaSections } from "@/components/sections/SeoEncyclopediaSections";
import { LandingPage } from "@/components/landing/LandingPage";
import { listLocationServices } from "@/lib/data/location-catalog";
import { buildAreaPageContent } from "@/data/location-page-content";
import { getAreaLocalFact } from "@/data/area-local-facts";
import { getCityLocalProfile } from "@/data/city-local-profiles";
import {
  getAreaBySlugs,
  getAreasForCity,
  getCityBySlug,
  getDistrictBySlug,
} from "@/lib/data/locations";
import { STATE_NAME, STATE_SLUG } from "@/config/geo";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { shouldGeneratePage } from "@/lib/seo/page-decision";
import { buildProgrammaticIndexability } from "@/lib/seo/programmatic-indexability";
import { countLocationHubWords } from "@/lib/seo/content-word-count";
import { getPageVisualStrategy } from "@/lib/visual/page-composition";
import { buildMetaDescription } from "@/lib/seo/title-meta-system";
import { pickPageImage } from "@/lib/visual/page-image-pick";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildEnquiryProcess,
  buildLocationProblems,
  buildLocationRelatedGroups,
  buildLocationUseCases,
  buildServiceOptions,
} from "@/lib/landing/builders/location-landing";
import type { LandingPageData } from "@/lib/landing/types";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{ locationSlug: string; areaSlug: string }>;
};

export async function generateStaticParams() {
  // Public area hubs are prerendered on the silo wrappers.
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationSlug, areaSlug } = await params;
  const city = getCityBySlug(locationSlug);
  const area = getAreaBySlugs(locationSlug, areaSlug);
  if (!city || !area) return {};

  const decision = shouldGeneratePage({
    kind: "area",
    stateSlug: STATE_SLUG,
    citySlug: locationSlug,
    areaSlug,
  });
  if (!decision.generate) return {};

  const areaFact = getAreaLocalFact(locationSlug, areaSlug);
  const canonicalPath = ROUTES.area(locationSlug, areaSlug);
  const district = city.district ? getDistrictBySlug(city.district) : undefined;
  const hubWords = countLocationHubWords(
    buildAreaPageContent({
      areaName: area.name,
      cityName: city.name,
      district: district?.name,
    }),
  );

  return generatePageMetadata({
    title: `${area.name}, ${city.name} — Installation Service Coverage`,
    metaDescription: buildMetaDescription({
      location: `${area.name}, ${city.name}`,
      differentiator:
        "Invisible grills, safety nets and cloth hangers planned after site measurement",
      cta: "Free photo estimate · measured quote",
    }),
    canonicalUrl: buildCanonicalUrl(canonicalPath),
    ...buildProgrammaticIndexability({
      decision: {
        kind: "area",
        stateSlug: STATE_SLUG,
        citySlug: locationSlug,
        areaSlug,
      },
      candidatePath: canonicalPath,
      cannibalKind: "area",
      tier: "locality",
      hasUniqueLocalFacts: Boolean(areaFact),
      hasCityProfile: Boolean(getCityLocalProfile(locationSlug)),
      wordCount: hubWords,
    }),
  });
}

export default async function AreaDetailPage({ params }: PageProps) {
  const { locationSlug, areaSlug } = await params;
  const city = getCityBySlug(locationSlug);
  const area = getAreaBySlugs(locationSlug, areaSlug);

  if (!city || !area) notFound();

  const decision = shouldGeneratePage({
    kind: "area",
    stateSlug: STATE_SLUG,
    citySlug: locationSlug,
    areaSlug,
  });
  if (!decision.generate) notFound();

  const district = city.district ? getDistrictBySlug(city.district) : undefined;
  const content = buildAreaPageContent({
    areaName: area.name,
    cityName: city.name,
    district: district?.name,
  });

  const areaFact = getAreaLocalFact(locationSlug, areaSlug);
  const nearbyAreas = getAreasForCity(locationSlug).filter(
    (a) => a.slug !== areaSlug,
  );

  const visual = getPageVisualStrategy("locality");
  const heroPick = pickPageImage({
    pageKey: `area:${locationSlug}:${areaSlug}`,
    serviceSlug: "invisible-grills",
    citySlug: locationSlug,
    localitySlug: areaSlug,
    cityName: city.name,
    localityName: area.name,
  });

  /* Every variation gets its own locality URL, so the area hub is the crawl
     entry point for all of them — not just the four core hubs. */
  const services = listLocationServices().map((service) => {
    const media = getServiceMedia(service.slug);
    return {
      name: service.name,
      slug: service.slug,
      summary: `${service.summary} Service can be arranged in ${area.name}, ${city.name} after site confirmation.`,
      benefits: service.benefits.slice(0, 3),
      image: media.image,
      href: ROUTES.areaService(locationSlug, areaSlug, service.slug),
      quoteHref: `${ROUTES.contact}?service=${encodeURIComponent(service.slug)}&city=${encodeURIComponent(city.name)}`,
    };
  });

  const pageUrl = buildCanonicalUrl(ROUTES.area(locationSlug, areaSlug));

  const landing: LandingPageData = {
    pageType: "locality",
    intent: "local",
    canonicalUrl: pageUrl,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Locations", href: ROUTES.locations },
      { label: STATE_NAME, href: ROUTES.state },
      { label: city.name, href: ROUTES.location(locationSlug) },
      { label: area.name },
    ],
    hero: {
      title: `Safety Nets & Invisible Grills in ${area.name}, ${city.name}`,
      description: `Send opening photos for a free estimate in ${area.name}. We confirm address-level access after a site review.`,
      badge: city.name,
      composition: visual.hero,
      image: { src: heroPick.src, alt: heroPick.alt },
      trustLine: heroPick.isLocallyVerified
        ? `Verified photo · ${area.name}`
        : "Representative installation · locality confirmed after site review",
    },
    trustLabel: `${area.name}, ${city.name}`,
    problems: buildLocationProblems({
      citySlug: locationSlug,
      areaSlug,
      isSiloCity: true,
    }),
    problemsLabel: area.name,
    primaryContentTitle: `Service Coverage in ${area.name}`,
    primaryContent: (
      <>
        {areaFact ? (
          <p>
            Planning in {area.name} accounts for {areaFact.buildingStock}
            {areaFact.landmarks.length > 0
              ? `, with visits typically arranged around ${areaFact.landmarks.slice(0, 3).join(", ")}`
              : ""}
            . {areaFact.accessNote}
            {areaFact.exposureHint ? ` ${areaFact.exposureHint}` : ""}
          </p>
        ) : null}
        <p>{content.introduction}</p>
        <p>{content.servicesOverview}</p>
        <p>{content.buyingGuide}</p>
        <p>{content.localDecisionGuide}</p>
      </>
    ),
    primaryContentNote: `${area.name} is part of ${city.name} service-area coverage. Final suitability depends on building access and measured site conditions.`,
    offerings: {
      title: `Services Available in ${area.name}`,
      description: `${city.name} area coverage — subject to building access and site confirmation`,
      items: services,
    },
    contentBlocks: <SeoEncyclopediaSections sections={content.encyclopedia} />,
    benefits: {
      title: `Where these installations are used in ${area.name}`,
      items: [
        {
          title: "Homes and apartments",
          description: content.residentialApplications,
        },
        {
          title: "Commercial and community sites",
          description: content.commercialApplications,
        },
      ],
    },
    useCases: {
      title: `Local planning notes for ${area.name}`,
      description:
        "Conditions we check here before recommending a specification.",
      items: buildLocationUseCases({
        citySlug: locationSlug,
        cityName: city.name,
        areaSlug,
        areaName: area.name,
      }),
    },
    options: {
      title: `Which option suits your opening in ${area.name}?`,
      description:
        "Each system solves a different problem — including what it does not solve.",
      items: buildServiceOptions(area.name, {
        citySlug: locationSlug,
        cityName: city.name,
        areaSlug,
        areaName: area.name,
        isSiloCity: true,
      }),
    },
    requirements: {
      title: "Details That Help Quotation",
      items: content.commonRequirements,
    },
    process: buildEnquiryProcess(area.name),
    pricing: {
      title: "Pricing Factors",
      factors: content.pricingFactors,
      honestStatement: `Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity. Quotes for ${area.name} are based on measured scope, not a single area-wide rate.`,
    },
    coverage: {
      title: "Parent City Coverage",
      text: `${area.name} is part of our ${city.name} service-area coverage. Review the city page for broader context, then use the service links below for this locality.`,
      links: [
        {
          label: `All services in ${city.name}`,
          href: ROUTES.location(locationSlug),
        },
        ...listLocationServices().map((service) => ({
          label: `${service.shortName} in ${city.name}`,
          href: ROUTES.cityService(locationSlug, service.slug),
        })),
      ],
    },
    related: buildLocationRelatedGroups({
      citySlug: locationSlug,
      cityName: city.name,
      isSiloCity: true,
      areaSlug,
      areaName: area.name,
      nearbyAreas: nearbyAreas.map((a) => ({ slug: a.slug, name: a.name })),
    }),
    faqs: content.faqs,
    faqTitle: `FAQs — ${area.name}, ${city.name}`,
    appendSections:
      nearbyAreas.length > 0 ? (
        <AreaServicesMatrix
          citySlug={locationSlug}
          cityName={city.name}
          areas={nearbyAreas}
          excludeAreaSlug={areaSlug}
          title={`Every service in every nearby ${city.name} area`}
          description={`Every curated locality in ${city.name}, with every installation type we publish.`}
        />
      ) : null,
    cta: {
      title: `Get a Quote for ${area.name}`,
      description: `Request installation service in ${area.name}, ${city.name}. We will confirm availability for your specific address.`,
      message: `Hello, I need installation service in ${area.name}, ${city.name}.`,
    },
  };

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: `Safety net services in ${area.name}, ${city.name}`,
            description: `Measured balcony safety nets, invisible grills and related installations for ${area.name}, ${city.name}.`,
            url: pageUrl,
            areaServed: `${area.name}, ${city.name}, Andhra Pradesh, India`,
          }),
          breadcrumbSchema([
            { name: "Home", url: buildCanonicalUrl("/") },
            { name: "Locations", url: buildCanonicalUrl(ROUTES.locations) },
            { name: STATE_NAME, url: buildCanonicalUrl(ROUTES.state) },
            {
              name: city.name,
              url: buildCanonicalUrl(ROUTES.location(locationSlug)),
            },
            { name: area.name, url: pageUrl },
          ]),
        ]}
      />

      <LandingPage data={landing} />
    </>
  );
}
