import type { Metadata } from "next";
import Link from "next/link";
import { getServiceMedia, HOME_VISUAL_SERVICES } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { VisualServiceGrid } from "@/components/sections/VisualServiceGrid";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { LinkDirectory } from "@/components/sections/LinkDirectory";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { ServiceCityAreaLinks } from "@/components/sections/ServiceCityAreaLinks";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { SERVICE_DIRECTORY } from "@/data/service-directory";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Services — Invisible Grills, Safety Nets, Sports Nets & Cloth Hangers",
  metaDescription:
    "Explore our installation services across Andhra Pradesh: invisible grills, safety nets, sports nets and cloth drying hangers. Service available subject to site confirmation.",
  canonicalUrl: buildCanonicalUrl("/services/"),
  openGraphImage: getServiceMedia("invisible-grills").image,
  ...staticPageIndexability(true),
});

export default function ServicesPage() {
  const services = INITIAL_SERVICES.map((service) => {
    const media = getServiceMedia(service.slug);
    return {
      name: service.name,
      slug: service.slug,
      summary: service.summary,
      benefits: service.benefits.slice(0, 3),
      image: media.image,
    };
  });

  const heroMedia = getServiceMedia("invisible-grills");

  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services/" },
        ]}
      />
      <PageHero
        badge="Andhra Pradesh"
        title="Our Services"
        description="Professional installation services available across Andhra Pradesh. Coverage is confirmed after a site review for each enquiry — listing a place does not mean we operate a branch office there."
        image={{
          src: heroMedia.image,
          alt: heroMedia.alt,
        }}
        actions={
          <>
            <Link
              href={ROUTES.contact}
              className="inline-flex min-h-11 items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-amber-400"
            >
              Get Quote
            </Link>
            <Link
              href={ROUTES.locations}
              className="inline-flex min-h-11 items-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
            >
              View Locations
            </Link>
          </>
        }
      />

      <ServiceCards
        title="Four Main Installation Services"
        description="Choose the service that matches your safety, bird control, sports or drying requirement. Final specification is confirmed after measurement."
        services={services}
      />

      <VisualServiceGrid
        title="Complete photo catalog of services"
        description="Every major offering with a high-definition installation photograph—balcony nets, invisible grills, bird control, sports nets, cloth hangers and more."
        services={HOME_VISUAL_SERVICES}
        variant="muted"
      />

      <ProjectGallery
        title="Service installation gallery"
        description="Browse finished work across Andhra Pradesh homes and buildings."
      />

      <BenefitsSection
        title="What You Can Expect"
        description="Practical installation planning with honest coverage confirmation."
        items={[
          {
            title: "Measurement before final quote",
            description:
              "Pricing follows measured openings, access conditions and material choice — not a city-wide flat rate.",
          },
          {
            title: "Honest service-area wording",
            description:
              "We confirm whether installation can be arranged at your address. Location pages are not branch claims.",
          },
          {
            title: "Clear material discussion",
            description:
              "Spacing, mesh grade, anchors and finish options are explained in plain language before you approve work.",
          },
        ]}
        variant="muted"
      />

      <CoverageSection
        title="Statewide Coverage Model"
        coverageText="Installation services are available across Andhra Pradesh subject to site accessibility, measurements, technician availability and project requirements. We do not claim a physical office in every listed city or neighbourhood."
        links={[
          { label: "Browse locations", href: ROUTES.locations },
          { label: "Contact for coverage check", href: ROUTES.contact },
        ]}
      />

      {INITIAL_SERVICES.map((service, index) => (
        <ServiceCityAreaLinks
          key={service.slug}
          serviceSlug={service.slug}
          serviceName={service.name}
          title={`${service.name} — all cities & areas`}
          description={`Open every priority city and curated locality page for ${service.name.toLowerCase()}.`}
          variant={index % 2 === 0 ? "default" : "muted"}
        />
      ))}

      <LinkDirectory
        title="Browse All Service Categories"
        description="Find balcony, bird, sports and drying solutions by category. Each link opens a verified service or solution page."
        categories={SERVICE_DIRECTORY}
      />

      <FinalCTA
        title="Need help choosing a service?"
        description="Share photos of your openings on WhatsApp for a free estimate. We confirm coverage after reviewing your site."
        whatsappMessage="Hello, I need help choosing the right installation service in Andhra Pradesh."
      />
    </>
  );
}
