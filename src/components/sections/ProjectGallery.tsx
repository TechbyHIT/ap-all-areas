import Link from "next/link";
import { GALLERY_PROJECTS, type GalleryProject } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type ProjectGalleryProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  projects?: readonly GalleryProject[];
  showViewAll?: boolean;
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function ProjectGallery({
  title = "Project Gallery",
  description = "Real installation photos from our collection — invisible grills, safety nets, sports nets and cloth drying hangers.",
  eyebrow,
  projects = GALLERY_PROJECTS,
  showViewAll = true,
  variant = "muted",
  className = "",
}: ProjectGalleryProps) {
  if (projects.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.image}
              title={project.title}
              image={project.image}
              alt={project.alt}
              href={project.href}
            />
          ))}
        </div>
        {showViewAll ? (
          <div className="mt-8">
            <Link
              href={ROUTES.gallery}
              className="inline-flex min-h-11 items-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
            >
              View full gallery
            </Link>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
