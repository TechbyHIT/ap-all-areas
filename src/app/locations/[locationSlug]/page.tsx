import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { LandingPage } from "@/components/landing/LandingPage";
import { RecentCityInstalls } from "@/components/sections/RecentCityInstalls";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { AreaCards } from "@/components/sections/AreaCards";
import { AreaServicesMatrix } from "@/components/sections/AreaServicesMatrix";
import { LocationCards } from "@/components/sections/LocationCards";
import { NearbyLocations } from "@/components/sections/NearbyLocations";
import { MaterialsSection } from "@/components/sections/MaterialsSection";
import { RelatedGuides } from "@/components/sections/RelatedGuides";
import { SeoEncyclopediaSections } from "@/components/sections/SeoEncyclopediaSections";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { PROPERTY_TYPES } from "@/data/property-types";
import { projectsAsGalleryItems } from "@/data/projects";
import { getCityLocalProfile } from "@/data/city-local-profiles";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { PLACEHOLDER_GUIDES } from "@/data/placeholder-content";
import { buildLocationPageContent } from "@/data/location-page-content";
import { getCity, listLocationServices } from "@/lib/data/location-catalog";
import {
  findLocationBySlug,
  getAreasForCity,
  getDistrictBySlug,
  getMainCitySlugs,
} from "@/lib/data/locations";
import { STATE_NAME, STATE_SLUG } from "@/config/geo";
import { SEO_CONFIG } from "@/config/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { canonicalCitySlug } from "@/lib/routing/location-silo";
import { generatePageMetadata, generateTitle } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";
import { buildProgrammaticIndexability } from "@/lib/seo/programmatic-indexability";
import { countLocationHubWords } from "@/lib/seo/content-word-count";
import { getPageVisualStrategy } from "@/lib/visual/page-composition";
import { pickPageImage } from "@/lib/visual/page-image-pick";
import { buildMetaDescription } from "@/lib/seo/title-meta-system";
import {
  buildEnquiryProcess,
  buildLocationProblems,
  buildLocationRelatedGroups,
  buildServiceOptions,
} from "@/lib/landing/builders/location-landing";
import type { LandingPageData, LandingUseCase } from "@/lib/landing/types";

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

  const siloCity = canonicalCitySlug(locationSlug);
  const canonicalPath = siloCity
    ? ROUTES.location(siloCity)
    : `/locations/${locationSlug}/`;
  const title = siloCity
    ? `Safety Nets, Invisible Grills & Balcony Solutions in ${location.name} ${SEO_CONFIG.titleSuffix}`
    : generateTitle(location.name, "location");

  const profile = getCityLocalProfile(locationSlug);
  const areas = getAreasForCity(locationSlug);
  const hubWords = countLocationHubWords(
    buildLocationPageContent({
      name: location.name,
      locationType: location.locationType ?? "city",
      district: location.district
        ? getDistrictBySlug(location.district)?.name
        : undefined,
      nearbyPlaces: areas.slice(0, 8).map((area) => area.name),
      isPriorityCity: true,
    }),
  );
  const indexInput = siloCity
    ? buildProgrammaticIndexability({
        decision: {
          kind: "city",
          stateSlug: STATE_SLUG,
          citySlug: locationSlug,
        },
        candidatePath: canonicalPath,
        cannibalKind: "city",
        tier: "city",
        hasCityProfile: Boolean(profile),
        wordCount: hubWords,
      })
    : staticPageIndexability(Boolean(siloCity));

  return generatePageMetadata({
    title,
    metaDescription: buildMetaDescription({
      location: location.name,
      differentiator:
        "Invisible grills, balcony safety nets, pigeon nets and cloth hangers planned after site measurement",
      cta: "Free photo estimate · measured quote",
    }),
    canonicalUrl: buildCanonicalUrl(canonicalPath),
    ...indexInput,
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
  const siblingCities = HIGH_PRIORITY_CITY_AREAS.filter(
    (city) => city.citySlug !== locationSlug,
  ).slice(0, 8);

  const moneyServices = listLocationServices();
  const services = moneyServices.map((service) => {
    const media = getServiceMedia(service.slug);
    const catalogCity = getCity(STATE_SLUG, locationSlug);
    return {
      name: service.name,
      slug: service.slug,
      summary: `${service.summary} Installation service is available in ${displayName} subject to site confirmation.`,
      benefits: service.benefits.slice(0, 3),
      image: media.image,
      href: catalogCity
        ? ROUTES.cityService(locationSlug, service.slug)
        : ROUTES.service(service.slug),
      quoteHref: `${ROUTES.contact}?service=${encodeURIComponent(service.slug)}&city=${encodeURIComponent(displayName)}`,
    };
  });

  const isSiloCity = Boolean(canonicalCitySlug(locationSlug));
  const heroTitle = isSiloCity
    ? `Safety Nets, Invisible Grills & Balcony Solutions in ${displayName}`
    : `${displayName} — Safety Nets, Invisible Grills & Local Installation`;
  const cityCanonical = buildCanonicalUrl(
    isSiloCity ? ROUTES.location(locationSlug) : `/locations/${locationSlug}/`,
  );
  const visual = getPageVisualStrategy("city");
  const heroPick = pickPageImage({
    pageKey: `city:${locationSlug}`,
    serviceSlug: "safety-nets",
    citySlug: locationSlug,
    cityName: displayName,
  });

  /* Property types double as the "who this is for" grid — real pages behind each. */
  const useCases: LandingUseCase[] = PROPERTY_TYPES.filter(
    (p) => p.publicationStatus === "published" && p.allowIndexing,
  )
    .slice(0, 6)
    .map((propertyType) => ({
      title: propertyType.name,
      description: propertyType.summary,
      href: ROUTES.propertyTypeService(
        propertyType.slug,
        propertyType.suitableServices[0] ?? "safety-nets",
      ),
    }));

  const landing: LandingPageData = {
    pageType: "city",
    intent: "local",
    canonicalUrl: cityCanonical,
    breadcrumbs: isSiloCity
      ? [
          { label: "Home", href: "/" },
          { label: "Locations", href: ROUTES.locations },
          { label: STATE_NAME, href: ROUTES.state },
          { label: displayName },
        ]
      : [
          { label: "Home", href: "/" },
          { label: "Locations", href: ROUTES.locations },
          { label: displayName },
        ],
    hero: {
      title: heroTitle,
      description: profile
        ? `${profile.climateLead} Send opening photos for a free estimate in ${displayName} — we confirm access after site review.`
        : `Send opening photos for a free estimate in ${displayName}, Andhra Pradesh. We confirm coverage after a site review.`,
      badge: districtName ?? STATE_NAME,
      composition: visual.hero,
      image: { src: heroPick.src, alt: heroPick.alt },
      trustLine: heroPick.isLocallyVerified
        ? "Verified local installation photo"
        : "Representative installation · city confirmed after site review",
    },
    trustLabel: displayName,
    problems: buildLocationProblems({
      citySlug: locationSlug,
      isSiloCity,
    }),
    problemsLabel: displayName,
    primaryContentTitle: `About Service Coverage in ${displayName}`,
    primaryContent: (
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
    ),
    primaryContentNote:
      "Listing this location means installation support can be arranged subject to site confirmation — not that a shop or branch exists here.",
    offerings: {
      title: `Services Available in ${displayName}`,
      description:
        "Each service link leads to a location-specific page. Availability is confirmed after reviewing your address and site access.",
      items: services,
    },
    contentBlocks: (
      <>
        <SeoEncyclopediaSections sections={content.encyclopedia} />
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
      </>
    ),
    benefits: {
      title: `Where these installations are used in ${displayName}`,
      items: [
        {
          title: "Homes and apartments",
          description: content.residentialApplications,
        },
        {
          title: "Commercial and institutional sites",
          description: content.commercialApplications,
        },
      ],
    },
    useCases: {
      title: `Property types we commonly plan for in ${displayName}`,
      description:
        "Generic property guides — not named societies. Open the type that matches your building.",
      items: useCases,
    },
    options: {
      title: `Which option suits your opening in ${displayName}?`,
      description:
        "Each system solves a different problem — including what it does not solve.",
      items: buildServiceOptions(displayName, {
        citySlug: locationSlug,
        cityName: displayName,
        isSiloCity,
      }),
    },
    requirements: {
      title: "Common Requirements Before Quotation",
      items: content.commonRequirements,
    },
    process: buildEnquiryProcess(displayName),
    pricing: {
      title: "Pricing Factors",
      factors: content.pricingFactors,
      honestStatement: `Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity. We do not show fixed package prices because every site in ${displayName} differs.`,
    },
    evidence: (
      <>
        <RecentCityInstalls citySlug={locationSlug} cityName={displayName} />
        <ReviewsSection
          citySlug={locationSlug}
          title={`Reviews for ${displayName} installations`}
          description="Verified customer reviews for this city appear here when authorized — we never fabricate local ratings."
        />
        <ProjectGallery
          title="Installation photos (statewide evidence)"
          description={`Real photographs from our install set. We do not invent ${displayName}-specific project stories without verified records.`}
          projects={projectsAsGalleryItems().slice(0, 6)}
          showViewAll
        />
      </>
    ),
    coverage: {
      title: `Coverage Summary for ${displayName}`,
      text: `We provide installation services in ${displayName} subject to site accessibility, measurements, technician availability and project requirements. This page supports enquiry planning and is not a local branch claim.`,
      links: [
        { label: "All services", href: ROUTES.services },
        { label: "Request quote", href: ROUTES.contact },
      ],
    },
    related: buildLocationRelatedGroups({
      citySlug: locationSlug,
      cityName: displayName,
      isSiloCity,
      nearbyAreas: areas.map((a) => ({ slug: a.slug, name: a.name })),
      siblingCities: isSiloCity
        ? siblingCities.map((c) => ({
            citySlug: c.citySlug,
            cityName: c.cityName,
          }))
        : undefined,
    }),
    faqs: content.faqs,
    faqTitle: `FAQs — Service in ${displayName}`,
    appendSections: (
      <>
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
              title={`Every service in every ${displayName} area`}
              description={`${moneyServices.length} installation types × every curated locality in ${displayName}.`}
              variant="muted"
            />
          </>
        ) : null}

        <RelatedGuides
          title="Guides that help before a site visit"
          description="Read these before sending photos if you are still comparing invisible grills, nets or hangers."
          guides={PLACEHOLDER_GUIDES.map((guide) => ({
            title: guide.title,
            href: ROUTES.guide(guide.slug),
            summary: guide.summary,
          }))}
        />

        {nearbyPlaces.length > 0 && district ? (
          <NearbyLocations
            title="Nearby Places & Related Coverage"
            description={`Customers also enquire from nearby places such as ${nearbyPlaces.slice(0, 6).join(", ")}. Each request is reviewed on its own access and measurement conditions.`}
            locations={district.places
              .filter((p) => p.slug !== locationSlug)
              .slice(0, 12)
              .map((place) => ({
                name: place.name,
                href: ROUTES.location(place.slug),
                parentLabel: district.name,
                description: `Service availability in ${place.name} is confirmed after site review.`,
              }))}
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
      </>
    ),
    cta: {
      title: `Request Service in ${displayName}`,
      description: `Share your requirement for ${displayName}. We will confirm whether installation service is available at your specific address — without claiming a local branch.`,
      message: `Hello, I need installation service in ${displayName}, Andhra Pradesh.`,
    },
  };

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: `Safety net & grill installation in ${displayName}`,
          description: `Measured installation of balcony safety nets, invisible grills, pigeon nets, sports nets and cloth hangers in ${displayName}, Andhra Pradesh.`,
          url: cityCanonical,
          areaServed: `${displayName}, Andhra Pradesh, India`,
        })}
      />
      {isSiloCity ? (
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", url: buildCanonicalUrl("/") },
            { name: "Locations", url: buildCanonicalUrl(ROUTES.locations) },
            { name: STATE_NAME, url: buildCanonicalUrl(ROUTES.state) },
            { name: displayName, url: cityCanonical },
          ])}
        />
      ) : null}

      <LandingPage data={landing} />
    </>
  );
}
