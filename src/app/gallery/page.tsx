import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HERO_FALLBACK } from "@/config/design";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";
import {
  buildGalleryItems,
  organizeGallery,
} from "@/lib/seo/gallery-organization";
import { contextualCta } from "@/lib/seo/contextual-cta";
import { ProjectCard } from "@/components/cards/ProjectCard";

export const metadata: Metadata = generatePageMetadata({
  title: "Gallery — Installation Photos by Service",
  metaDescription:
    "Browse real installation photos organised by service and application — invisible grills, safety nets, sports nets and cloth drying hangers. Captions describe what is shown; cities are listed only when verified.",
  canonicalUrl: buildCanonicalUrl("/gallery/"),
  ...staticPageIndexability(true),
});

export default function GalleryPage() {
  const items = buildGalleryItems();
  const byService = organizeGallery(items, "service");
  const cta = contextualCta({ kind: "project" });

  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery/" },
        ]}
      />
      <PageHero
        badge="Project photos"
        title="Installation Gallery"
        description="Organised by service — not an undifferentiated image dump. Captions describe each photo. City or property labels appear only when separately verified."
        image={{
          src: HERO_FALLBACK,
          alt: "Installation project photo gallery",
        }}
      />

      {[...byService.entries()].map(([serviceName, group]) => (
        <Section key={serviceName} variant="muted" className="py-10">
          <Container>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
              {serviceName}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-zinc-600">
              {group[0]?.application
                ? `Application focus: ${group[0].application}`
                : "Verified installation photographs for this service."}
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((item) => (
                <ProjectCard
                  key={item.src}
                  title={item.title}
                  image={item.src}
                  alt={item.alt}
                  href={item.href ?? undefined}
                />
              ))}
            </div>
          </Container>
        </Section>
      ))}

      <Container className="py-6">
        <p className="text-sm text-zinc-600">
          Prefer project pages with evidence notes?{" "}
          <Link href="/projects/" className="font-medium text-[var(--primary-700)] underline">
            Browse /projects/
          </Link>
        </p>
      </Container>

      <FinalCTA
        title={cta.primaryLabel}
        description="Share your city, property type and requirement. We will confirm service availability and guide you through measurement and quotation."
        whatsappMessage={cta.whatsappHint}
      />
    </>
  );
}
