import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { GALLERY_ALL_PROJECTS, HERO_FALLBACK } from "@/config/design";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Gallery — Installation Photos Across Andhra Pradesh",
  metaDescription:
    "Browse real installation photos of invisible grills, safety nets, sports nets and cloth drying hangers from our project collection.",
  canonicalUrl: buildCanonicalUrl("/gallery/"),
  ...staticPageIndexability(true),
});

export default function GalleryPage() {
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
        description="Real photos from our collection — balcony and window invisible grills, safety nets, sports nets, cloth drying hangers and related installations."
        image={{
          src: HERO_FALLBACK,
          alt: "Installation project photo gallery",
        }}
      />

      <ProjectGallery
        title="Our Work"
        description="Selected installation photos. More verified project images can be added as work is documented."
        projects={GALLERY_ALL_PROJECTS}
        showViewAll={false}
        variant="default"
      />

      <FinalCTA
        title="Want Similar Work at Your Site?"
        description="Share your city, property type and requirement. We will confirm service availability and guide you through measurement and quotation."
      />
    </>
  );
}
