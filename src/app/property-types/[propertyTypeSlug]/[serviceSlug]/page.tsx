import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import { FAQSection } from "@/components/sections/FAQSection";
import {
  BulletListSection,
  ProseSection,
} from "@/components/sections/ContentBlocks";
import { ServiceCityAreaLinks } from "@/components/sections/ServiceCityAreaLinks";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { PROPERTY_TYPE_MAP, PROPERTY_TYPE_SLUGS } from "@/data/property-types";
import { INITIAL_SERVICE_MAP, INITIAL_SERVICES } from "@/data/initial-services";
import { SERVICE_FAQS } from "@/data/service-faqs";
import { SERVICE_PAGE_CONTENT } from "@/data/service-page-content";
import { getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{ propertyTypeSlug: string; serviceSlug: string }>;
};

export async function generateStaticParams() {
  return PROPERTY_TYPE_SLUGS.flatMap((propertyTypeSlug) => {
    const propertyType = PROPERTY_TYPE_MAP[propertyTypeSlug];
    return propertyType.suitableServices.map((serviceSlug) => ({
      propertyTypeSlug,
      serviceSlug,
    }));
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { propertyTypeSlug, serviceSlug } = await params;
  const propertyType = PROPERTY_TYPE_MAP[propertyTypeSlug];
  const service = INITIAL_SERVICE_MAP[serviceSlug];
  if (!propertyType || !service) return {};
  if (!propertyType.suitableServices.includes(serviceSlug)) return {};

  const media = getServiceMedia(service.slug);

  return generatePageMetadata({
    title: `${service.name} for ${propertyType.name} in Andhra Pradesh`,
    metaDescription: `${service.name} installation for ${propertyType.name.toLowerCase()} across Andhra Pradesh. Service available subject to site confirmation.`,
    canonicalUrl: buildCanonicalUrl(
      `/property-types/${propertyTypeSlug}/${serviceSlug}/`,
    ),
    openGraphImage: media.image,
    ...staticPageIndexability(true),
    wordCount: 1400,
    minimumRequiredWordCount: 1200,
  });
}

export default async function PropertyTypeServicePage({ params }: PageProps) {
  const { propertyTypeSlug, serviceSlug } = await params;
  const propertyType = PROPERTY_TYPE_MAP[propertyTypeSlug];
  const service = INITIAL_SERVICE_MAP[serviceSlug];

  if (
    !propertyType ||
    !service ||
    !propertyType.suitableServices.includes(serviceSlug)
  ) {
    notFound();
  }

  const serviceContent = SERVICE_PAGE_CONTENT[serviceSlug];
  const media = getServiceMedia(service.slug);
  const faqs = (SERVICE_FAQS[serviceSlug] ?? []).slice(0, 10).map((faq) => ({
    question: faq.question.replace(service.name, `${service.name} for ${propertyType.name}`),
    answer: `${faq.answer} For ${propertyType.name.toLowerCase()}, we also review ${propertyType.characteristics.slice(0, 2).join(" and ").toLowerCase()} before finalising the quotation.`,
  }));

  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Property Types", path: "/property-types/" },
          { name: propertyType.name, path: "/property-types/" },
          {
            name: service.name,
            path: `/property-types/${propertyTypeSlug}/${serviceSlug}/`,
          },
        ]}
      />
      <FaqJsonLd faqs={faqs} />
      <PageHero
        title={`${service.name} for ${propertyType.name}`}
        description={`${service.name} planning for ${propertyType.name.toLowerCase()} across Andhra Pradesh, subject to site confirmation.`}
        badge={`${propertyType.name} · Andhra Pradesh`}
        image={{ src: media.image, alt: media.alt }}
      />

      <ProseSection title={`${service.name} Needs in ${propertyType.name}`}>
        <p>{propertyType.introduction}</p>
        <p>
          {serviceContent?.uniqueIntroduction ?? service.introduction}
        </p>
        <p>
          We provide installation services for {propertyType.name.toLowerCase()}{" "}
          across Andhra Pradesh subject to site accessibility, measurements,
          technician availability and project requirements. This page does not
          claim a dedicated branch for every property type or locality.
        </p>
      </ProseSection>

      <BulletListSection
        title={`Common Concerns for ${propertyType.name}`}
        items={propertyType.commonSafetyConcerns}
        variant="muted"
      />

      <BulletListSection
        title="Installation Considerations"
        items={propertyType.installationConsiderations}
      />

      <BulletListSection
        title="Material & Selection Guidance"
        items={serviceContent?.technicalConsiderations.slice(0, 6) ?? service.materials}
        variant="muted"
      />

      <BulletListSection
        title="Pricing Factors"
        items={
          serviceContent?.pricingFactors ?? [
            "Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.",
          ]
        }
      />

      <Section>
        <Container>
          <Heading as="h2" className="mb-4">
            Related Services for {propertyType.name}
          </Heading>
          <ul className="grid gap-3 sm:grid-cols-2">
            {INITIAL_SERVICES.filter((s) =>
              propertyType.suitableServices.includes(s.slug),
            ).map((related) => (
              <li key={related.slug}>
                <Link
                  href={ROUTES.propertyTypeService(propertyType.slug, related.slug)}
                  className="block rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium hover:text-teal-800"
                >
                  {related.name} for {propertyType.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link href={ROUTES.service(service.slug)} className="text-teal-800 hover:underline">
              View full {service.name} guide →
            </Link>
          </p>
        </Container>
      </Section>

      <ServiceCityAreaLinks
        serviceSlug={service.slug}
        serviceName={service.name}
        title={`${service.name} for ${propertyType.name} — cities & areas`}
        description={`Find ${service.name.toLowerCase()} pages for ${propertyType.name.toLowerCase()} planning in every priority city and curated locality.`}
        variant="muted"
      />

      <FAQSection
        title={`FAQs — ${service.name} for ${propertyType.name}`}
        items={faqs}
      />

      <QuoteCTA
        title={`Quote for ${service.name} on ${propertyType.name}`}
        description={`Share your city, property type (${propertyType.name}) and approximate measurements. We will confirm service availability and next steps.`}
        whatsappMessage={`Hello, I need a quotation for ${service.name} for a ${propertyType.name} in Andhra Pradesh.`}
      />
    </>
  );
}
