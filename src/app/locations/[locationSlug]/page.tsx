import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { LocationHero } from "@/components/sections/LocationHero";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { AreaCards } from "@/components/sections/AreaCards";
import { AreaServicesMatrix } from "@/components/sections/AreaServicesMatrix";
import { LocationCards } from "@/components/sections/LocationCards";
import { NearbyLocations } from "@/components/sections/NearbyLocations";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { QualitySection } from "@/components/sections/QualitySection";
import { PricingFactors } from "@/components/sections/PricingFactors";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { SeoEncyclopediaSections } from "@/components/sections/SeoEncyclopediaSections";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getCityLocalProfile } from "@/data/city-local-profiles";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { KEYWORD_INTENTS } from "@/data/keyword-intents";
import { buildLocationPageContent } from "@/data/location-page-content";
import {
  findLocationBySlug,
  getAreasForCity,
  getDistrictBySlug,
  getMainCitySlugs,
} from "@/lib/data/locations";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata, generateTitle } from "@/lib/seo/generate-page-metadata";
import {
  moneyPageIndexability,
  seedLocationIndexability,
} from "@/lib/seo/page-indexability";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{ locationSlug: string }>;
};

export async function generateStaticParams() {
  return HIGH_PRIORITY_CITY_AREAS.map((c) => ({
    locationSlug: c.citySlug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationSlug } = await params;
  const location = findLocationBySlug(locationSlug);
  if (!location) return {};

  const isPriority = HIGH_PRIORITY_CITY_AREAS.some(
    (c) => c.citySlug === locationSlug,
  );

  return generatePageMetadata({
    title: generateTitle(location.name, "location"),
    metaDescription: `Invisible grills, safety nets, sports nets and cloth drying hanger installation service available in ${location.name}, Andhra Pradesh. Coverage subject to site confirmation — not a claimed local branch.`,
    canonicalUrl: buildCanonicalUrl(`/locations/${locationSlug}/`),
    ...(isPriority
      ? moneyPageIndexability("city")
      : seedLocationIndexability()),
  });
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { locationSlug } = await params;
  const location = findLocationBySlug(locationSlug);
  const districtRecord = getDistrictBySlug(locationSlug);

  if (!location && !districtRecord) notFound();

  const displayName = location?.name ?? districtRecord!.name;
  const locationType = location?.locationType ?? "district";
  const districtSlug =
    location?.district ?? location?.parentSlug ?? districtRecord?.slug;
  const district = districtSlug ? getDistrictBySlug(districtSlug) : districtRecord;
  const districtName = district?.name;

  const areas = getAreasForCity(locationSlug);
  const isCity =
    getMainCitySlugs().includes(locationSlug) || location?.locationType === "city";
  const isPriorityCity = getMainCitySlugs().includes(locationSlug);

  const nearbyPlaces =
    areas.length > 0
      ? areas.slice(0, 8).map((a) => a.name)
      : (district?.places ?? [])
          .filter((p) => p.slug !== locationSlug)
          .slice(0, 8)
          .map((p) => p.name);

  const content = buildLocationPageContent({
    name: displayName,
    locationType,
    district: districtName,
    nearbyPlaces,
    isPriorityCity,
  });
  const profile = getCityLocalProfile(locationSlug);
  const cityKeywords = isPriorityCity
    ? KEYWORD_INTENTS.filter((k) => k.priority === 0).slice(0, 18)
    : [];

  const heroMedia = getServiceMedia("safety-nets");
  const services = INITIAL_SERVICES.map((service) => {
    const media = getServiceMedia(service.slug);
    return {
      name: service.name,
      slug: service.slug,
      summary: `${service.summary} Installation service is available in ${displayName} subject to site confirmation.`,
      benefits: service.benefits.slice(0, 3),
      image: media.image,
      href: ROUTES.cityService(locationSlug, service.slug),
      quoteHref: `${ROUTES.contact}?service=${encodeURIComponent(service.slug)}&city=${encodeURIComponent(displayName)}`,
    };
  });

  return (
    <>
      <FaqJsonLd faqs={content.faqs} />

      <LocationHero
        badge={districtName ?? "Andhra Pradesh"}
        title={`${displayName} — Safety Nets, Invisible Grills & Local Installation`}
        description={
          profile
            ? `${profile.climateLead} Installation support in ${displayName} is confirmed after site review — this page is not a local branch claim.`
            : `Installation service is available in ${displayName}, Andhra Pradesh. We confirm coverage for each enquiry after a site review — this page does not represent a local branch office.`
        }
        image={{
          src: heroMedia.image,
          alt: heroMedia.alt,
        }}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Locations", href: "/locations/" },
          { label: displayName },
        ]}
      />

      <MaterialsSection
        title={`About Service Coverage in ${displayName}`}
        prose={
          <>
            <p>{content.introduction}</p>
            <p>{content.servicesOverview}</p>
            <p>{content.buyingGuide}</p>
            <p>{content.localDecisionGuide}</p>
            {profile ? (
              <>
                <p>{profile.weatherNotes}</p>
                <p>
                  Key residential corridors:{" "}
                  {profile.residentialCorridors.join("; ")}.
                </p>
              </>
            ) : null}
          </>
        }
        note="Listing this location means installation support can be arranged subject to site confirmation — not that a shop or branch exists here."
      />

      <SeoEncyclopediaSections sections={content.encyclopedia} />

      <ServiceCards
        title={`Services Available in ${displayName}`}
        description="Each service link leads to a location-specific page. Availability is confirmed after reviewing your address and site access."
        services={services}
        variant="muted"
      />

      <FeaturesSection
        title={`Residential Applications in ${displayName}`}
        items={[
          {
            title: "Homes and apartments",
            description: content.residentialApplications,
          },
        ]}
      />

      <BenefitsSection
        title="Commercial & Institutional Applications"
        items={[
          {
            title: "Commercial and community sites",
            description: content.commercialApplications,
          },
        ]}
        variant="muted"
      />

      <QualitySection
        title="Common Requirements Before Quotation"
        items={content.commonRequirements}
      />

      <MaterialsSection
        title="Installation Overview"
        prose={
          <>
            <p>{content.installationOverview}</p>
            <p>{content.siteInspectionInfo}</p>
          </>
        }
        variant="muted"
      />

      <PricingFactors
        title="Pricing Factors"
        items={content.pricingFactors}
        honestStatement={`Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity. We do not show fixed package prices because every site in ${displayName} differs.`}
      />

      {isCity && areas.length > 0 ? (
        <>
          <AreaCards
            title={`Areas in ${displayName}`}
            description="Area pages help residents find service coverage by locality. Listing an area means installation support can be arranged subject to site confirmation — not that a shop exists in every neighbourhood."
            areas={areas.map((area) => ({
              name: area.name,
              href: ROUTES.area(locationSlug, area.slug),
              cityName: displayName,
              description: `Service coverage reference in ${displayName} — confirmed after site review.`,
            }))}
          />
          <AreaServicesMatrix
            citySlug={locationSlug}
            cityName={displayName}
            areas={areas}
            title={`Every area in ${displayName} × all services`}
            description={`Full internal links: each of the ${areas.length} localities includes Invisible Grills, Safety Nets, Sports Nets and Cloth Hangers.`}
            variant="muted"
          />
        </>
      ) : null}

      {cityKeywords.length > 0 ? (
        <Section variant="muted">
          <Container>
            <h2 className="ds-h2">
              High-probability searches in {displayName}
            </h2>
            <p className="prose-readable mt-3 text-[var(--muted-foreground)]">
              Local keyword pages for balcony safety nets, invisible grills,
              bird control, sports nets and cloth hangers across {displayName},
              Andhra Pradesh.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {cityKeywords.map((keyword) => (
                <li key={keyword.slug}>
                  <Link
                    href={ROUTES.keywordInGeo(keyword.slug, locationSlug)}
                    className="text-[var(--color-link)] hover:underline"
                  >
                    {keyword.phrase} in {displayName}
                  </Link>
                </li>
              ))}
            </ul>
            {profile ? (
              <p className="prose-readable mt-6 text-sm text-[var(--muted-foreground)]">
                {profile.photoEstimateHint}
              </p>
            ) : null}
          </Container>
        </Section>
      ) : null}

      {nearbyPlaces.length > 0 ? (
        <NearbyLocations
          title="Nearby Places & Related Coverage"
          description={`Customers also enquire from nearby places such as ${nearbyPlaces.slice(0, 6).join(", ")}. Each request is reviewed on its own access and measurement conditions.`}
          locations={
            district
              ? district.places
                  .filter((p) => p.slug !== locationSlug)
                  .slice(0, 12)
                  .map((place) => ({
                    name: place.name,
                    href: ROUTES.location(place.slug),
                    parentLabel: district.name,
                    description: `Service availability in ${place.name} is confirmed after site review.`,
                  }))
              : []
          }
          variant="muted"
        />
      ) : null}

      {districtRecord && !isCity ? (
        <LocationCards
          title={`Places in ${districtRecord.name} District`}
          locations={districtRecord.places.slice(0, 12).map((place) => ({
            name: place.name,
            href: ROUTES.location(place.slug),
            parentLabel: districtRecord.name,
            description: `Installation service may be arranged in ${place.name} subject to site confirmation.`,
          }))}
        />
      ) : null}

      <CoverageSection
        title={`Coverage Summary for ${displayName}`}
        coverageText={`We provide installation services in ${displayName} subject to site accessibility, measurements, technician availability and project requirements. This page supports enquiry planning and is not a local branch claim.`}
        links={[
          { label: "All services", href: ROUTES.services },
          { label: "Request quote", href: ROUTES.contact },
        ]}
        variant="muted"
      />

      <FAQSection
        title={`FAQs — Service in ${displayName}`}
        items={content.faqs}
      />

      <FinalCTA
        title={`Request Service in ${displayName}`}
        description={`Share your requirement for ${displayName}. We will confirm whether installation service is available at your specific address — without claiming a local branch.`}
        whatsappMessage={`Hello, I need installation service in ${displayName}, Andhra Pradesh.`}
      />
    </>
  );
}
