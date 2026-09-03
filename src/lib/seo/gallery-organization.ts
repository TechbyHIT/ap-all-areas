/**
 * §65 Gallery SEO — organize media; not an undifferentiated dump.
 */

import { INSTALLATION_PHOTOS } from "@/config/installation-photos";
import { INITIAL_SERVICE_MAP } from "@/data/initial-services";
import { linkImageEntities, type ImageEntityLinks } from "@/lib/seo/image-entities";
import { listPublishedProjects } from "@/data/projects";

export type GalleryFacet =
  | "service"
  | "project"
  | "city"
  | "property"
  | "application";

export type GalleryItem = ImageEntityLinks & {
  title: string;
  href: string | null;
  caption: string;
};

function applicationFromService(serviceSlug: string): string {
  const map: Record<string, string> = {
    "safety-nets": "Balcony & opening protection",
    "invisible-grills": "Fall protection with open view",
    "sports-nets": "Practice / enclosure nets",
    "cloth-drying-hangers": "Utility drying",
  };
  return map[serviceSlug] ?? "Installation";
}

export function buildGalleryItems(): GalleryItem[] {
  const projects = listPublishedProjects();
  const bySrc = new Map(projects.map((p) => [p.images[0]?.src, p]));

  return INSTALLATION_PHOTOS.map((photo) => {
    const project = bySrc.get(photo.src);
    const serviceName =
      INITIAL_SERVICE_MAP[photo.service]?.name ?? photo.service;
    const links = linkImageEntities({
      src: photo.src,
      alt: photo.alt,
      projectSlug: project?.slug ?? null,
      serviceSlug: photo.service,
      application: photo.application ?? applicationFromService(photo.service),
      citySlug: photo.citySlug ?? project?.city ?? null,
      localitySlug: photo.localitySlug ?? project?.locality ?? null,
      propertyTypeSlug: photo.propertyTypeSlug ?? project?.property ?? null,
    });

    return {
      ...links,
      title: project?.projectName ?? photo.alt,
      href: project ? `/projects/${project.slug}/` : `/services/${photo.service}/`,
      caption: `${serviceName} — ${photo.alt}`,
    };
  });
}

export function organizeGallery(
  items: GalleryItem[],
  facet: GalleryFacet,
): Map<string, GalleryItem[]> {
  const groups = new Map<string, GalleryItem[]>();

  for (const item of items) {
    let key = "Uncategorised";
    if (facet === "service") {
      key = item.serviceSlug
        ? (INITIAL_SERVICE_MAP[item.serviceSlug]?.name ?? item.serviceSlug)
        : "Uncategorised";
    } else if (facet === "project") {
      key = item.projectSlug ?? "Photo only";
    } else if (facet === "city") {
      key = item.citySlug ?? "Location not verified";
    } else if (facet === "property") {
      key = item.propertyTypeSlug ?? "Property type not verified";
    } else if (facet === "application") {
      key = item.application ?? "General installation";
    }

    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  return groups;
}

export function galleryFacetLabels(): GalleryFacet[] {
  return ["service", "application", "project", "city", "property"];
}
