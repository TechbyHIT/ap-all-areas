import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { PROPERTY_TYPES } from "@/data/property-types";
import { INITIAL_SERVICE_MAP } from "@/data/initial-services";
import { ROUTES } from "@/config/routes";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Property Types — Safety Solutions by Building Type",
  metaDescription:
    "Explore invisible grills, safety nets, sports nets and cloth drying hanger solutions tailored for apartments, villas, schools and commercial buildings in Andhra Pradesh.",
  canonicalUrl: buildCanonicalUrl("/property-types/"),
  ...staticPageIndexability(true),
});

export default function PropertyTypesPage() {
  return (
    <>
      <PageHero
        title="Property Types"
        description="Safety and utility solutions tailored to how you live, work and use your space across Andhra Pradesh."
      />
      <Container>
        <div className="grid gap-8">
          {PROPERTY_TYPES.map((propertyType) => (
            <article
              key={propertyType.slug}
              className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <h2 className="text-xl font-semibold">{propertyType.name}</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {propertyType.introduction}
              </p>
              <h3 className="mt-4 text-sm font-semibold">Suitable Services</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {propertyType.suitableServices.map((serviceSlug) => {
                  const service = INITIAL_SERVICE_MAP[serviceSlug];
                  return (
                    <li key={serviceSlug}>
                      {service ? (
                        <Link
                          href={ROUTES.propertyTypeService(
                            propertyType.slug,
                            serviceSlug,
                          )}
                          className="text-blue-600 hover:underline"
                        >
                          {service.name} for {propertyType.name}
                        </Link>
                      ) : (
                        serviceSlug
                      )}
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
