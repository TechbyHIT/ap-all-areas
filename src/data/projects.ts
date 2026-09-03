/**
 * Project / installation evidence — photo-based case records only.
 * No invented cities, customers, ratings, or before/after stories.
 */

import { INSTALLATION_PHOTOS } from "@/config/installation-photos";
import { INITIAL_SERVICE_MAP } from "@/data/initial-services";
import type { KeywordClusterId } from "@/types/keyword-ownership";

export type ProjectCase = {
  slug: string;
  projectName: string;
  service: string;
  serviceFamily: KeywordClusterId | null;
  city: string | null;
  locality: string | null;
  property: string | null;
  customerType: string | null;
  problem: string | null;
  solution: string;
  materials: string | null;
  installationMethod: string | null;
  accessConditions: string | null;
  projectDate: string | null;
  images: Array<{ src: string; alt: string }>;
  review: string | null;
  status: "published" | "draft";
  evidenceNote: string;
};

const SERVICE_TO_FAMILY: Record<string, KeywordClusterId> = {
  "safety-nets": "safety-nets",
  "invisible-grills": "invisible-grills",
  "sports-nets": "sports-nets",
  "cloth-drying-hangers": "cloth-drying-hangers",
};

function slugFromSrc(src: string): string {
  const file = src.split("/").pop() ?? "project";
  return file.replace(/\.(jpe?g|png|webp|avif)$/i, "");
}

function titleFromAlt(alt: string, serviceName: string): string {
  const trimmed = alt.trim();
  if (trimmed.length > 8) return trimmed;
  return `${serviceName} installation photo`;
}

function buildCases(): ProjectCase[] {
  return INSTALLATION_PHOTOS.map((photo) => {
    const service = INITIAL_SERVICE_MAP[photo.service];
    const serviceName = service?.name ?? photo.service;
    const slug = slugFromSrc(photo.src);
    return {
      slug,
      projectName: titleFromAlt(photo.alt, serviceName),
      service: photo.service,
      serviceFamily: SERVICE_TO_FAMILY[photo.service] ?? null,
      city: null,
      locality: null,
      property: null,
      customerType: null,
      problem: null,
      solution: `Documented ${serviceName.toLowerCase()} installation from our Andhra Pradesh work.`,
      materials: null,
      installationMethod: null,
      accessConditions: null,
      projectDate: null,
      images: [{ src: photo.src, alt: photo.alt }],
      review: null,
      status: "published" as const,
      evidenceNote:
        "This page shows a real installation photograph. City, customer name and review are omitted unless separately verified—we do not invent project stories.",
    };
  });
}

export const PROJECT_CASES: ProjectCase[] = buildCases();

export const PROJECT_CASE_MAP: Record<string, ProjectCase> = Object.fromEntries(
  PROJECT_CASES.map((p) => [p.slug, p]),
);

export function getProjectCase(slug: string): ProjectCase | null {
  return PROJECT_CASE_MAP[slug] ?? null;
}

export function listPublishedProjects(serviceSlug?: string): ProjectCase[] {
  return PROJECT_CASES.filter(
    (p) =>
      p.status === "published" &&
      (!serviceSlug || p.service === serviceSlug),
  );
}

export function projectsAsGalleryItems(serviceSlug?: string) {
  return listPublishedProjects(serviceSlug).map((p) => ({
    title: p.projectName,
    image: p.images[0]!.src,
    alt: p.images[0]!.alt,
    href: `/projects/${p.slug}/`,
  }));
}
