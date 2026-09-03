import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PremiumPageHero } from "@/components/sections/PremiumPageHero";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { INITIAL_SERVICE_MAP } from "@/data/initial-services";
import {
  getProjectCase,
  listPublishedProjects,
} from "@/data/projects";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";
import { buildPageMediaBundle } from "@/lib/visual/page-media";
import { preferWebpPath } from "@/lib/visual/visual-quality";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ projectSlug: string }>;
};

export function generateStaticParams() {
  return listPublishedProjects().map((project) => ({
    projectSlug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { projectSlug } = await params;
  const project = getProjectCase(projectSlug);
  if (!project) return {};
  const service = INITIAL_SERVICE_MAP[project.service];
  const serviceName = service?.name ?? project.service;
  const og = preferWebpPath(project.images[0]?.src ?? "");

  return generatePageMetadata({
    title: `${serviceName} Project Photo | Hiranya Enterprises`,
    metaDescription: `${project.projectName}. Real installation photograph — location and customer details published only when verified.`,
    canonicalUrl: buildCanonicalUrl(ROUTES.project(project.slug)),
    openGraphImage: og || undefined,
    openGraphImageAlt: project.images[0]?.alt,
    ...staticPageIndexability(true),
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { projectSlug } = await params;
  const project = getProjectCase(projectSlug);
  if (!project || project.status !== "published") notFound();

  const service = INITIAL_SERVICE_MAP[project.service];
  const serviceName = service?.name ?? project.service;
  const media = buildPageMediaBundle({
    pageType: "project",
    serviceSlug: project.service,
    projectSlug: project.slug,
    h1: project.projectName,
  });
  const image = {
    src: preferWebpPath(project.images[0]!.src),
    alt: project.images[0]!.alt,
    caption: project.projectName,
  };

  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects/" },
          { name: project.projectName, path: ROUTES.project(project.slug) },
        ]}
      />

      <PremiumPageHero
        badge="Installation evidence"
        title={`${serviceName} Project in Andhra Pradesh`}
        description={project.solution}
        composition="project-gallery-lead"
        image={image}
        actions={
          <>
            <Link
              href={ROUTES.contact}
              className="inline-flex min-h-11 items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-amber-400"
            >
              Request similar installation
            </Link>
            {service ? (
              <Link
                href={ROUTES.service(service.slug)}
                className="inline-flex min-h-11 items-center rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                View {service.name}
              </Link>
            ) : null}
          </>
        }
      />

      <Section variant="muted">
        <Container>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 960px"
              />
            </div>
            <div className="space-y-4 p-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Project overview
              </h2>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {project.evidenceNote}
              </p>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-zinc-900 dark:text-zinc-50">
                    Service
                  </dt>
                  <dd className="text-zinc-600 dark:text-zinc-400">
                    {serviceName}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-900 dark:text-zinc-50">
                    City / locality
                  </dt>
                  <dd className="text-zinc-600 dark:text-zinc-400">
                    {project.city ?? project.locality
                      ? [project.locality, project.city].filter(Boolean).join(", ")
                      : "Verified location details not published"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      {media.secondaryImages.length > 0 ? (
        <Section>
          <Container>
            <h2 className="text-xl font-semibold text-zinc-900">Related visuals</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Additional installation photography for the same service family —
              not claimed as the same site unless verified.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {media.secondaryImages.map((img) => (
                <li
                  key={img.src}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <FinalCTA
        title="Need a similar installation?"
        description="Send opening photos for an estimate. We confirm access and coverage after site review."
      />
    </>
  );
}
