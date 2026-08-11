import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BUSINESS_CONFIG } from "@/config/business";
import { getIntentHeroImage, getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { KEYWORD_INTENT_MAP, KEYWORD_INTENTS } from "@/data/keyword-intents";
import { buildKeywordGeoContent } from "@/data/keyword-page-content";
import {
  PRERENDER_AREA_LIMIT,
  PRERENDER_KEYWORD_LIMIT,
  prerenderCities,
} from "@/config/prerender";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { INITIAL_SERVICE_MAP } from "@/data/initial-services";
import { findScaleLocality, pathKeywordInGeo } from "@/lib/seo/url-matrix";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { ServiceCityAreaLinks } from "@/components/sections/ServiceCityAreaLinks";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import {
  breadcrumbSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import {
  moneyPageIndexability,
  seedLocationIndexability,
} from "@/lib/seo/page-indexability";


type PageProps = {
  params: Promise<{ keywordSlug: string; geoSlug: string }>;
};

function resolveGeo(geoSlug: string) {
  const city = HIGH_PRIORITY_CITY_AREAS.find((c) => c.citySlug === geoSlug);
  if (city) {
    return {
      kind: "city" as const,
      name: city.cityName,
      citySlug: city.citySlug,
      cityName: city.cityName,
      areaSlug: undefined as string | undefined,
      indexable: true,
    };
  }
  for (const c of HIGH_PRIORITY_CITY_AREAS) {
    const area = c.areas.find((a) => a.slug === geoSlug);
    if (area) {
      return {
        kind: "area" as const,
        name: area.name,
        citySlug: c.citySlug,
        cityName: c.cityName,
        areaSlug: area.slug,
        indexable: true,
      };
    }
  }
  const scale = findScaleLocality(geoSlug);
  if (scale) {
    const parentCity = HIGH_PRIORITY_CITY_AREAS.find(
      (c) => c.citySlug === scale.routeCitySlug,
    );
    return {
      kind: "scale" as const,
      name: scale.name,
      citySlug: scale.routeCitySlug,
      cityName: parentCity?.cityName ?? scale.routeCitySlug.replace(/-/g, " "),
      areaSlug: scale.slug,
      indexable: false,
    };
  }
  return null;
}

/**
 * Keep SSG seed small so `next build` stays healthy.
 * Remaining keyword×geo URLs still work via `dynamicParams`.
 */
export async function generateStaticParams() {
  const params: Array<{ keywordSlug: string; geoSlug: string }> = [];
  const p0Keywords = KEYWORD_INTENTS.filter((k) => k.priority === 0).slice(
    0,
    PRERENDER_KEYWORD_LIMIT,
  );
  for (const city of prerenderCities()) {
    for (const keyword of p0Keywords) {
      params.push({ keywordSlug: keyword.slug, geoSlug: city.citySlug });
      for (const area of city.areas.slice(0, PRERENDER_AREA_LIMIT)) {
        params.push({ keywordSlug: keyword.slug, geoSlug: area.slug });
      }
    }
  }
  return params;
}

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { keywordSlug, geoSlug } = await params;
  const keyword = KEYWORD_INTENT_MAP[keywordSlug];
  const geo = resolveGeo(geoSlug);
  if (!keyword || !geo) return {};

  const content = buildKeywordGeoContent(keyword, geo);
  const path = pathKeywordInGeo(keywordSlug, geoSlug);
  const heroImage = getIntentHeroImage(keyword.slug, keyword.serviceSlug);

  return generatePageMetadata({
    title: content.metaTitle,
    metaDescription: content.metaDescription,
    canonicalUrl: buildCanonicalUrl(path),
    openGraphTitle: `${keyword.phrase} in ${geo.name} | ${BUSINESS_CONFIG.name}`,
    openGraphDescription: content.metaDescription,
    openGraphImage: heroImage.src,
    ...(geo.indexable
      ? moneyPageIndexability("locality-service")
      : seedLocationIndexability()),
  });
}

export default async function KeywordGeoLandingPage({ params }: PageProps) {
  const { keywordSlug, geoSlug } = await params;
  const keyword = KEYWORD_INTENT_MAP[keywordSlug];
  const geo = resolveGeo(geoSlug);
  const service = keyword ? INITIAL_SERVICE_MAP[keyword.serviceSlug] : null;
  if (!keyword || !geo || !service) notFound();

  const content = buildKeywordGeoContent(keyword, geo);
  const path = pathKeywordInGeo(keywordSlug, geoSlug);
  const pageUrl = buildCanonicalUrl(path);
  const heroImage = getIntentHeroImage(keyword.slug, service.slug);

  const related = Object.values(INITIAL_SERVICE_MAP)
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3)
    .map((s) => {
      const media = getServiceMedia(s.slug);
      return {
        name: s.name,
        slug: s.slug,
        summary: s.summary,
        image: media.image,
      };
    });

  const siblingKeywords = KEYWORD_INTENTS.filter(
    (k) =>
      k.serviceSlug === keyword.serviceSlug &&
      k.slug !== keyword.slug &&
      k.priority <= 1,
  ).slice(0, 8);

  return (
    <>
      <FaqJsonLd faqs={content.faqs} />
      <JsonLd
        data={[
          webPageSchema({
            name: `${keyword.phrase} in ${geo.name}`,
            description: content.metaDescription,
            url: pageUrl,
          }),
          serviceSchema({
            name: `${keyword.phrase} in ${geo.name}`,
            description: `${keyword.phrase} installation support in ${geo.name}, ${geo.cityName}, Andhra Pradesh.`,
            url: pageUrl,
            areaServed: `${geo.name}, ${geo.cityName}, Andhra Pradesh, India`,
          }),
          breadcrumbSchema([
            { name: "Home", url: buildCanonicalUrl("/") },
            {
              name: service.name,
              url: buildCanonicalUrl(ROUTES.service(service.slug)),
            },
            {
              name: geo.cityName,
              url: buildCanonicalUrl(ROUTES.location(geo.citySlug)),
            },
            { name: keyword.phrase, url: pageUrl },
          ]),
        ]}
      />

      <ServiceHero
        badge={`${geo.name} · ${geo.cityName} · Andhra Pradesh`}
        title={`${keyword.phrase} in ${geo.name}`}
        description={content.heroDescription}
        serviceSlug={keyword.serviceSlug}
        image={heroImage}
        quoteHref={ROUTES.contact}
        whatsappMessage={`Hello, I need ${keyword.phrase.toLowerCase()} in ${geo.name}, ${geo.cityName}. Sharing opening photos for a free estimate.`}
      />

      {!geo.indexable ? (
        <Section variant="muted">
          <Container>
            <p className="text-sm text-[var(--muted-foreground)]">
              This locality page is in the expansion graph. Coverage is confirmed
              after a site review—send photos and PIN/landmark details when you
              enquire.
            </p>
          </Container>
        </Section>
      ) : null}

      {content.sections.map((section) => (
        <Section key={section.heading}>
          <Container>
            <h2 className="ds-h2">{section.heading}</h2>
            <div className="prose-readable mt-5 space-y-4 text-[var(--muted-foreground)]">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </Container>
        </Section>
      ))}

      <Section variant="muted">
        <Container>
          <h2 className="ds-h2">Decision checklist for {geo.name}</h2>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-[var(--muted-foreground)]">
            {content.decisionPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="ds-h2">Installation process</h2>
              <ol className="mt-5 list-decimal space-y-2 pl-5 text-[var(--muted-foreground)]">
                {content.processSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className="ds-h2">Photo checklist for a faster estimate</h2>
              <ul className="mt-5 list-disc space-y-2 pl-5 text-[var(--muted-foreground)]">
                {content.photoChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="prose-readable mt-8 text-[var(--muted-foreground)]">
            Nearby service pages:{" "}
            <Link
              href={ROUTES.cityService(geo.citySlug, service.slug)}
              className="text-[var(--color-link)] hover:underline"
            >
              {service.name} in {geo.cityName}
            </Link>
            {geo.areaSlug && geo.kind === "area" ? (
              <>
                {" · "}
                <Link
                  href={ROUTES.areaService(
                    geo.citySlug,
                    geo.areaSlug,
                    service.slug,
                  )}
                  className="text-[var(--color-link)] hover:underline"
                >
                  {service.name} in {geo.name}
                </Link>
              </>
            ) : null}
            {" · "}
            <Link
              href={ROUTES.location(geo.citySlug)}
              className="text-[var(--color-link)] hover:underline"
            >
              All services in {geo.cityName}
            </Link>
          </p>
        </Container>
      </Section>

      {siblingKeywords.length > 0 ? (
        <Section variant="muted">
          <Container>
            <h2 className="ds-h2">
              Related {service.name.toLowerCase()} searches in {geo.name}
            </h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {siblingKeywords.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={ROUTES.keywordInGeo(item.slug, geoSlug)}
                    className="text-[var(--color-link)] hover:underline"
                  >
                    {item.phrase} in {geo.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <ServiceCityAreaLinks
        serviceSlug={service.slug}
        serviceName={service.name}
        citySlug={geo.citySlug}
        title={`${service.name} across ${geo.cityName} areas`}
        description={`Browse ${service.name.toLowerCase()} pages for every curated locality in ${geo.cityName}. Coverage is confirmed after site review.`}
        variant="muted"
      />

      <FAQSection
        title={`${keyword.phrase} in ${geo.name} — FAQs`}
        items={content.faqs}
      />

      <RelatedServices title="Related services" services={related} />

      <FinalCTA
        title={`Get a free estimate for ${keyword.phrase.toLowerCase()} in ${geo.name}`}
        description={`WhatsApp opening photos and your ${geo.name} landmark in ${geo.cityName}. Call ${BUSINESS_CONFIG.phone.displayFormatted}.`}
        whatsappMessage={`Hello, I need ${keyword.phrase.toLowerCase()} in ${geo.name}, ${geo.cityName}. Sharing opening photos for a free estimate.`}
      />
    </>
  );
}
