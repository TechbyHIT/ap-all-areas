import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { Container } from "@/components/ui/Container";
import { ROUTES } from "@/config/routes";
import { listPublishedProjects, projectsAsGalleryItems } from "@/data/projects";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Projects — Installation Photos Across Andhra Pradesh",
  metaDescription:
    "Browse real installation photographs for invisible grills, safety nets, sports nets and cloth drying hangers. We do not invent customer stories or unverified locations.",
  canonicalUrl: buildCanonicalUrl("/projects/"),
  ...staticPageIndexability(true),
});

export default function ProjectsPage() {
  const count = listPublishedProjects().length;

  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects/" },
        ]}
      />
      <PageHero
        title="Projects"
        description={`${count} installation photographs from our work set. Each card opens an honest photo page—city and customer details appear only when verified.`}
        actions={
          <Link
            href={ROUTES.contact}
            className="inline-flex min-h-11 items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-amber-400"
          >
            Request Similar Work
          </Link>
        }
      />
      <Container className="py-8">
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          These pages document real installs. We do not fabricate reviews,
          before/after claims, named societies or branch addresses. For a
          quotation, share opening photos from your site.
        </p>
      </Container>
      <ProjectGallery
        title="Installation evidence"
        description="Photo-led project records linked to the matching service."
        projects={projectsAsGalleryItems()}
        showViewAll={false}
        variant="muted"
      />
      <FinalCTA
        title="Need a similar installation?"
        description="Send balcony, window or practice-area photos on WhatsApp for a measured quote."
        whatsappMessage="Hello, I saw your project photos and need a similar installation quote in Andhra Pradesh."
      />
    </>
  );
}
