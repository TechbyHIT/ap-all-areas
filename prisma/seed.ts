import { PrismaClient } from "../src/generated/prisma/client";
import { INITIAL_SERVICES } from "../src/data/initial-services";
import {
  AP_STATE,
  AP_DISTRICTS,
  HIGH_PRIORITY_CITY_AREAS,
} from "../src/data/initial-locations";
import { PROPERTY_TYPES } from "../src/data/property-types";
import { PROBLEMS } from "../src/data/problems";
import { BUSINESS_CONFIG } from "../src/config/business";
import { buildCanonicalUrl } from "../src/lib/routing/paths";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.business.upsert({
    where: { id: "default-business" },
    update: {},
    create: {
      id: "default-business",
      name: BUSINESS_CONFIG.name,
      legalName: BUSINESS_CONFIG.legalName,
      description: BUSINESS_CONFIG.description,
      websiteUrl: BUSINESS_CONFIG.websiteUrl,
      phone: BUSINESS_CONFIG.phone.raw,
      whatsapp: BUSINESS_CONFIG.whatsapp.raw,
      email: BUSINESS_CONFIG.email,
      street: BUSINESS_CONFIG.address.street,
      city: BUSINESS_CONFIG.address.city,
      district: BUSINESS_CONFIG.address.district,
      state: BUSINESS_CONFIG.address.state,
      postalCode: BUSINESS_CONFIG.address.postalCode,
      country: BUSINESS_CONFIG.address.country,
      phoneVerified: false,
    },
  });

  const category = await prisma.serviceCategory.upsert({
    where: { slug: "safety-solutions" },
    update: {},
    create: { slug: "safety-solutions", name: "Safety Solutions" },
  });

  for (const service of INITIAL_SERVICES) {
    const dbService = await prisma.service.upsert({
      where: { slug: service.slug },
      update: { name: service.name, summary: service.summary },
      create: {
        slug: service.slug,
        name: service.name,
        shortName: service.shortName,
        categoryId: category.id,
        publicationStatus: "published",
        allowIndexing: true,
        summary: service.summary,
        introduction: service.introduction,
        detailedDescription: service.detailedDescription,
        customerProblems: service.customerProblems,
        benefits: service.benefits,
        features: service.features,
        applications: service.applications,
        materials: service.materials,
        specifications: service.specifications,
        installationSteps: service.installationSteps,
        safetyInformation: service.safetyInformation,
        maintenanceTips: service.maintenanceTips,
        pricingFactors: service.pricingFactors,
        suitablePropertyTypes: service.suitablePropertyTypes,
        primaryKeywords: service.primaryKeywords,
        secondaryKeywords: service.secondaryKeywords,
        customerQuestions: service.customerQuestions,
        searchIntents: service.searchIntents,
        relatedServiceIds: service.relatedServiceIds,
        heroImage: service.heroImage,
        galleryImages: service.galleryImages,
        contentReviewed: true,
        qualityScore: 85,
      },
    });

    for (const sub of service.subServices ?? []) {
      await prisma.subService.upsert({
        where: { slug: sub.slug },
        update: { name: sub.name },
        create: {
          slug: sub.slug,
          name: sub.name,
          serviceId: dbService.id,
        },
      });
    }

    await prisma.page.upsert({
      where: { path: `/services/${service.slug}/` },
      update: {},
      create: {
        path: `/services/${service.slug}/`,
        slug: service.slug,
        pageType: "service",
        title: `${service.name} in Andhra Pradesh | ${BUSINESS_CONFIG.name}`,
        metaDescription: service.summary,
        h1: `${service.name} Installation in Andhra Pradesh`,
        canonicalUrl: buildCanonicalUrl(`/services/${service.slug}/`),
        openGraphTitle: service.name,
        openGraphDescription: service.summary,
        openGraphImage: service.heroImage,
        serviceId: dbService.id,
        publicationStatus: "published",
        allowIndexing: true,
        contentReviewed: true,
        localDataVerified: true,
        qualityScore: 85,
        wordCount: 1500,
        minimumRequiredWordCount: 1200,
        hasUniqueMetadata: true,
        hasUniqueContent: true,
        hasValidCanonical: true,
        hasInternalLinks: true,
        hasValidSchema: true,
        crawlPriority: "high",
        sitemapGroup: "services-1",
        publishedAt: new Date(),
      },
    });
  }

  const stateLocation = await prisma.location.upsert({
    where: { slug: AP_STATE.slug },
    update: {},
    create: {
      slug: AP_STATE.slug,
      name: AP_STATE.name,
      locationType: "state",
      state: "Andhra Pradesh",
      publicationStatus: "published",
      allowIndexing: true,
      isServed: true,
      introduction: "Statewide service coverage across Andhra Pradesh.",
      localDataVerified: true,
      contentReviewed: true,
      qualityScore: 90,
    },
  });

  for (const district of AP_DISTRICTS) {
    const districtLoc = await prisma.location.upsert({
      where: { slug: district.slug },
      update: {},
      create: {
        slug: district.slug,
        name: district.name,
        locationType: "district",
        parentId: stateLocation.id,
        state: "Andhra Pradesh",
        district: district.name,
        publicationStatus: "draft",
        allowIndexing: false,
        isServed: false,
        localDataVerified: false,
        contentReviewed: false,
      },
    });

    for (const place of district.places) {
      await prisma.location.upsert({
        where: { slug: place.slug },
        update: {},
        create: {
          slug: place.slug,
          name: place.name,
          locationType: place.locationType,
          parentId: districtLoc.id,
          state: "Andhra Pradesh",
          district: district.name,
          aliases: place.aliases ?? [],
          publicationStatus: "draft",
          allowIndexing: false,
          isServed: false,
          localDataVerified: false,
          contentReviewed: false,
        },
      });
    }
  }

  const priorityCities = [
    "visakhapatnam",
    "vijayawada",
    "guntur",
    "tirupati",
    "rajamahendravaram",
    "kakinada",
    "nellore",
    "kurnool",
    "anantapur",
  ];

  for (const citySlug of priorityCities) {
    const city = await prisma.location.findUnique({ where: { slug: citySlug } });
    if (!city) continue;

    await prisma.location.update({
      where: { id: city.id },
      data: {
        publicationStatus: "published",
        allowIndexing: true,
        isServed: true,
        introduction: `Service available in ${city.name} and surrounding areas across Andhra Pradesh.`,
        localDataVerified: true,
        contentReviewed: true,
        qualityScore: 85,
      },
    });

    await prisma.page.upsert({
      where: { path: `/locations/${citySlug}/` },
      update: {},
      create: {
        path: `/locations/${citySlug}/`,
        slug: citySlug,
        pageType: "location",
        title: `Safety Solutions in ${city.name} | ${BUSINESS_CONFIG.name}`,
        metaDescription: `Invisible grills, safety nets, sports nets and cloth drying hangers service available in ${city.name}, Andhra Pradesh.`,
        h1: `Safety Solutions in ${city.name}`,
        canonicalUrl: buildCanonicalUrl(`/locations/${citySlug}/`),
        locationId: city.id,
        publicationStatus: "published",
        allowIndexing: true,
        contentReviewed: true,
        localDataVerified: true,
        qualityScore: 85,
        wordCount: 900,
        minimumRequiredWordCount: 700,
        hasUniqueMetadata: true,
        hasUniqueContent: true,
        hasValidCanonical: true,
        hasInternalLinks: true,
        hasValidSchema: true,
        crawlPriority: "high",
        sitemapGroup: "locations-1",
        publishedAt: new Date(),
      },
    });
  }

  for (const cityData of HIGH_PRIORITY_CITY_AREAS) {
    const city = await prisma.location.findUnique({
      where: { slug: cityData.citySlug },
    });
    if (!city) continue;

    for (const area of cityData.areas) {
      await prisma.area.upsert({
        where: {
          locationId_slug: { locationId: city.id, slug: area.slug },
        },
        update: {},
        create: {
          slug: area.slug,
          name: area.name,
          locationId: city.id,
          publicationStatus: "draft",
          allowIndexing: false,
          isServed: false,
          localDataVerified: false,
          contentReviewed: false,
        },
      });
    }
  }

  for (const pt of PROPERTY_TYPES) {
    await prisma.propertyType.upsert({
      where: { slug: pt.slug },
      update: {},
      create: {
        slug: pt.slug,
        name: pt.name,
        description: pt.summary ?? "",
        suitableServices: pt.suitableServices ?? [],
        publicationStatus: "draft",
        allowIndexing: false,
      },
    });
  }

  for (const problem of PROBLEMS) {
    await prisma.problem.upsert({
      where: { slug: problem.slug },
      update: {},
      create: {
        slug: problem.slug,
        name: problem.name,
        description: problem.summary ?? "",
        recommendedServices: problem.recommendedServices ?? [],
        publicationStatus: "draft",
        allowIndexing: false,
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
