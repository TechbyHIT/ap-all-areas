import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { Container } from "@/components/ui/Container";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Projects — Completed Installations",
  metaDescription:
    "Browse completed invisible grill, safety net, sports net and cloth drying hanger projects across Andhra Pradesh.",
  canonicalUrl: buildCanonicalUrl("/projects/"),
  ...staticPageIndexability(true),
});

export default function ProjectsPage() {
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
        description="Case studies and completed installations will be featured here."
      />
      <Container>
        <p className="text-zinc-600 dark:text-zinc-400">
          Project case studies are being prepared. Request a quotation to discuss
          similar work for your balcony, terrace, sports ground or utility area.
        </p>
      </Container>
      <CTASection />
    </>
  );
}
