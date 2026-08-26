import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { LocationHero } from "@/components/sections/LocationHero";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { AreaServicesMatrix } from "@/components/sections/AreaServicesMatrix";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { QualitySection } from "@/components/sections/QualitySection";
import { PricingFactors } from "@/components/sections/PricingFactors";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { SeoEncyclopediaSections } from "@/components/sections/SeoEncyclopediaSections";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { prerenderAreas, prerenderCities } from "@/config/prerender";
import { buildAreaPageContent } from "@/data/location-page-content";
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
import { moneyPageIndexability } from "@/lib/seo/page-indexability";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{ locationSlug: string; areaSlug: string }>;
};

export async function generateStaticParams() {
  return prerenderCities().flatMap((city) =>
    prerenderAreas(city).map((area) => ({
      locationSlug: city.citySlug,
      areaSlug: area.slug,
    })),
  );
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

  return generatePageMetadata({
    title: `${area.name}, ${city.name} — Installation Service Coverage`,
    metaDescription: `Safety and utility installation service available in ${area.name}, ${city.name}, Andhra Pradesh. Invisible grills, safety nets, sports nets and cloth drying hangers — coverage subject to site confirmation.`,
    canonicalUrl: buildCanonicalUrl(ROUTES.area(locationSlug, areaSlug)),
    ...moneyPageIndexability("locality"),
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

  const nearbyAreas = getAreasForCity(locationSlug).filter(
    (a) => a.slug !== areaSlug,
  );

  const heroMedia = getServiceMedia("invisible-grills");
  const services = INITIAL_SERVICES.map((service) => {
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

  return (
    <>
      <FaqJsonLd faqs={content.faqs} />

      <LocationHero
        badge={city.name}
        title={`${area.name}, ${city.name}`}
        description={`Installation service is available in ${area.name}, ${city.name}. We confirm address-level coverage after a site review — not via a claimed local branch.`}
        image={{
          src: heroMedia.image,
          alt: `${heroMedia.alt} — ${area.name}, ${city.name}`,
        }}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Locations", href: ROUTES.locations },
          { label: STATE_NAME, href: ROUTES.state },
          { label: city.name, href: ROUTES.location(locationSlug) },
          { label: area.name },
        ]}
        className="[&>div]:py-8 md:[&>div]:py-10"
      />

      <MaterialsSection
        title={`Service Coverage in ${area.name}`}
        prose={
          <>
            <p>{content.introduction}</p>
            <p>{content.servicesOverview}</p>
            <p>{content.buyingGuide}</p>
            <p>{content.localDecisionGuide}</p>
          </>
        }
        note={`${area.name} is part of ${city.name} service-area coverage. Final suitability depends on building access and measured site conditions.`}
      />

      <SeoEncyclopediaSections sections={content.encyclopedia} />

      <ServiceCards
        title={`Services Available in ${area.name}`}
        description={`${city.name} area coverage — subject to building access and site confirmation`}
        services={services}
        variant="muted"
      />

      <BenefitsSection
        title={`Residential Applications in ${area.name}`}
        items={[
          {
            title: "Homes and apartments",
            description: content.residentialApplications,
          },
          {
            title: "Commercial & community",
            description: content.commercialApplications,
          },
        ]}
      />

      <QualitySection
        title="Details That Help Quotation"
        items={content.commonRequirements}
        variant="muted"
      />

      <MaterialsSection
        title="Installation Overview"
        prose={
          <>
            <p>{content.installationOverview}</p>
            <p>{content.siteInspectionInfo}</p>
          </>
        }
      />

      <PricingFactors
        title="Pricing Factors"
        items={content.pricingFactors}
        honestStatement={`Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity. Quotes for ${area.name} are based on measured scope, not a single area-wide rate.`}
      />

      <CoverageSection
        title="Parent City Coverage"
        coverageText={`${area.name} is part of our ${city.name} service-area coverage. Review the city page for broader context, then use the service links below for this locality.`}
        links={[
          {
            label: `All services in ${city.name}`,
            href: ROUTES.location(locationSlug),
          },
          ...INITIAL_SERVICES.map((service) => ({
            label: `${service.shortName} in ${city.name}`,
            href: ROUTES.cityService(locationSlug, service.slug),
          })),
        ]}
        variant="muted"
      />

      {nearbyAreas.length > 0 ? (
        <AreaServicesMatrix
          citySlug={locationSlug}
          cityName={city.name}
          areas={nearbyAreas}
          excludeAreaSlug={areaSlug}
          title={`Nearby ${city.name} areas with local notes`}
          description="Neighbouring localities with verified planning notes, plus remaining area hubs for coverage."
        />
      ) : null}

      <FAQSection
        title={`FAQs — ${area.name}, ${city.name}`}
        items={content.faqs}
      />

      <FinalCTA
        title={`Get a Quote for ${area.name}`}
        description={`Request installation service in ${area.name}, ${city.name}. We will confirm availability for your specific address.`}
        whatsappMessage={`Hello, I need installation service in ${area.name}, ${city.name}.`}
      />
    </>
  );
}
