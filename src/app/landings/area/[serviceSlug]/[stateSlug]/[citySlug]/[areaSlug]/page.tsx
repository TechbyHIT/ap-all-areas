import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BUSINESS_CONFIG } from "@/config/business";
import { ROUTES } from "@/config/routes";
import { MoneyLandingView } from "@/components/sections/MoneyLandingView";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getAreaMoneyLanding,
  listAreaMoneyLandings,
} from "@/data/landings";
import { GALLERY_ALL_PROJECTS } from "@/config/design";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import {
  breadcrumbSchema,
  howToSchema,
  localBusinessSchema,
  organizationSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { moneyPageIndexability } from "@/lib/seo/page-indexability";

type PageProps = {
  params: Promise<{
    serviceSlug: string;
    stateSlug: string;
    citySlug: string;
    areaSlug: string;
  }>;
};

export async function generateStaticParams() {
  return listAreaMoneyLandings().map((l) => ({
    serviceSlug: l.serviceSlug,
    stateSlug: l.stateSlug,
    citySlug: l.citySlug,
    areaSlug: l.areaSlug!,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const landing = getAreaMoneyLanding(p);
  if (!landing?.areaSlug) return {};

  return {
    ...generatePageMetadata({
      title: landing.seo.metaTitle,
      metaDescription: landing.seo.metaDescription,
      canonicalUrl: buildCanonicalUrl(
        ROUTES.areaService(landing.citySlug, landing.areaSlug, landing.serviceSlug),
      ),
      openGraphTitle: landing.seo.title,
      openGraphDescription: landing.seo.metaDescription,
      openGraphImage: BUSINESS_CONFIG.defaultOpenGraphImage,
      openGraphImageAlt: landing.hero.h1,
      twitterTitle: landing.seo.metaTitle,
      twitterDescription: landing.seo.metaDescription,
      ...moneyPageIndexability("locality-service"),
    }),
    keywords: landing.seo.metaKeywords,
  };
}

export default async function AreaMoneyLandingPage({ params }: PageProps) {
  const p = await params;
  const landing = getAreaMoneyLanding(p);
  if (!landing || !landing.areaSlug || !landing.areaName) notFound();

  const pageUrl = buildCanonicalUrl(
    ROUTES.areaService(landing.citySlug, landing.areaSlug, landing.serviceSlug),
  );
  const place = `${landing.areaName}, ${landing.cityName}`;
  const localBusiness = localBusinessSchema();
  const verifiedReviews = landing.reviews.filter((r) => r.verified);

  const imageObjects = landing.galleryAlts
    .slice(0, 12)
    .map((alt, index) => {
      const src = GALLERY_ALL_PROJECTS[index]?.image;
      if (!src) return null;
      return {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        contentUrl: buildCanonicalUrl(src),
        name: alt,
        description: alt,
        caption: alt,
      };
    })
    .filter(Boolean);

  const reviewNodes = verifiedReviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: review.author },
    reviewBody: review.quote,
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
    },
    itemReviewed: {
      "@type": "Service",
      name: `${landing.serviceName} in ${place}`,
    },
  }));

  const schemaGraph = [
    organizationSchema(),
    webPageSchema({
      name: landing.seo.title,
      description: landing.seo.metaDescription,
      url: pageUrl,
    }),
    serviceSchema({
      name: `${landing.serviceName} in ${place}`,
      description: landing.seo.metaDescription,
      url: pageUrl,
      areaServed: `${place}, ${landing.stateName}, India`,
    }),
    breadcrumbSchema([
      { name: "Home", url: buildCanonicalUrl("/") },
      {
        name: landing.serviceName,
        url: buildCanonicalUrl(`/services/${landing.serviceSlug}/`),
      },
      {
        name: landing.cityName,
        url: buildCanonicalUrl(`/locations/${landing.citySlug}/`),
      },
      {
        name: landing.areaName,
        url: buildCanonicalUrl(
          `/locations/${landing.citySlug}/${landing.areaSlug}/`,
        ),
      },
      { name: landing.serviceName, url: pageUrl },
    ]),
    howToSchema({
      name: `${landing.serviceName} installation process in ${place}`,
      description: `How ${landing.companyName} plans measured installation in ${place}.`,
      steps: landing.installationSteps,
    }),
    ...(localBusiness ? [localBusiness] : []),
    ...imageObjects,
    ...reviewNodes,
  ];

  return (
    <>
      <FaqJsonLd faqs={landing.faqs} />
      <JsonLd data={schemaGraph as Record<string, unknown>[]} />
      <MoneyLandingView landing={landing} />
    </>
  );
}
