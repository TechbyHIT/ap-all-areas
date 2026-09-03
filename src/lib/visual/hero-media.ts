/**
 * §134–137 / §146–147 Hero + image entity selection.
 * Prefer genuine project/service photos; never invent project evidence.
 */

import { INSTALLATION_PHOTOS } from "@/config/installation-photos";
import { getServiceMedia, HERO_FALLBACK } from "@/config/design";
import { listPublishedProjects } from "@/data/projects";
import type { HeroComposition, VisualPageType } from "@/lib/visual/page-composition";
import { getPageVisualStrategy } from "@/lib/visual/page-composition";

export type ImageType =
  | "hero"
  | "service"
  | "application"
  | "project"
  | "beforeAfter"
  | "process"
  | "material"
  | "comparison"
  | "property"
  | "location"
  | "gallery"
  | "team"
  | "illustration";

export type ImageSourceKind =
  | "real-project"
  | "real-business"
  | "real-service-install"
  | "approved-professional"
  | "licensed-stock"
  | "illustrative-generated";

export type ImageEntity = {
  imageId: string;
  file: string;
  alt: string;
  caption: string | null;
  service: string | null;
  serviceFamily: string | null;
  city: string | null;
  locality: string | null;
  property: string | null;
  project: string | null;
  imageType: ImageType;
  date: string | null;
  source: ImageSourceKind;
  license: string | null;
  /** True only for verified installation photography */
  isAuthenticProjectEvidence: boolean;
};

const SOURCE_PRIORITY: ImageSourceKind[] = [
  "real-project",
  "real-business",
  "real-service-install",
  "approved-professional",
  "licensed-stock",
  "illustrative-generated",
];

export function sourceRank(source: ImageSourceKind): number {
  const idx = SOURCE_PRIORITY.indexOf(source);
  return idx === -1 ? 99 : idx;
}

export function buildInstallationImageEntities(): ImageEntity[] {
  return INSTALLATION_PHOTOS.map((photo, index) => {
    const file = photo.src;
    const slug = file.split("/").pop()?.replace(/\.[^.]+$/, "") ?? `img-${index}`;
    return {
      imageId: `install-${slug}`,
      file,
      alt: photo.alt,
      caption: null,
      service: photo.service,
      serviceFamily: null,
      city: photo.citySlug ?? null,
      locality: photo.localitySlug ?? null,
      property: photo.propertyTypeSlug ?? null,
      project: slug,
      imageType: "project" as const,
      date: null,
      source: "real-service-install" as const,
      license: "business-owned",
      isAuthenticProjectEvidence: true,
    };
  });
}

export type ResolvedHeroMedia = {
  src: string;
  alt: string;
  caption: string | null;
  composition: HeroComposition;
  source: ImageSourceKind;
  isAuthenticProjectEvidence: boolean;
  priorityLoad: true;
};

/**
 * Select hero media by page context with authenticity priority (§137).
 * Location terms only appear in alt/caption when verified on the image entity.
 */
export function resolveHeroMedia(input: {
  pageType: VisualPageType;
  serviceSlug?: string;
  cityName?: string;
  localityName?: string;
  projectSlug?: string;
  h1: string;
}): ResolvedHeroMedia {
  const strategy = getPageVisualStrategy(input.pageType);
  const entities = buildInstallationImageEntities();

  if (input.projectSlug) {
    const project = listPublishedProjects().find((p) => p.slug === input.projectSlug);
    const img = project?.images[0];
    if (img) {
      return {
        src: img.src,
        alt: img.alt,
        caption: project.projectName,
        composition: strategy.hero,
        source: "real-project",
        isAuthenticProjectEvidence: true,
        priorityLoad: true,
      };
    }
  }

  const serviceMatches = entities
    .filter((e) => !input.serviceSlug || e.service === input.serviceSlug)
    .sort((a, b) => sourceRank(a.source) - sourceRank(b.source));

  const pick = serviceMatches[0];
  if (pick) {
    const locationBit =
      pick.locality && pick.city
        ? ` in ${pick.locality}, ${pick.city}`
        : pick.city
          ? ` in ${pick.city}`
          : "";
    return {
      src: pick.file,
      alt: `${pick.alt}${locationBit}`,
      caption: null,
      composition: strategy.hero,
      source: pick.source,
      isAuthenticProjectEvidence: pick.isAuthenticProjectEvidence,
      priorityLoad: true,
    };
  }

  if (input.serviceSlug) {
    const media = getServiceMedia(input.serviceSlug);
    return {
      src: media.image,
      alt: media.alt,
      caption: null,
      composition: strategy.hero,
      source: "real-service-install",
      isAuthenticProjectEvidence: true,
      priorityLoad: true,
    };
  }

  return {
    src: HERO_FALLBACK,
    alt: input.h1,
    caption: null,
    composition: strategy.hero,
    source: "real-service-install",
    isAuthenticProjectEvidence: true,
    priorityLoad: true,
  };
}

/** Hero H1 patterns (§134) — what + where + why without stuffing. */
export function buildHeroHeadline(input: {
  pageType: VisualPageType;
  serviceName?: string;
  cityName?: string;
  localityName?: string;
  projectName?: string;
  guideTitle?: string;
  comparisonTitle?: string;
}): string {
  switch (input.pageType) {
    case "service":
      return `${input.serviceName ?? "Safety Solutions"} for Safer Openings`;
    case "city":
      return `Safety Net & Grill Services in ${input.cityName ?? "Your City"}`;
    case "city-service":
      return `${input.serviceName ?? "Installation"} in ${input.cityName ?? "Your City"}`;
    case "locality":
      return `Safety Net Services in ${input.localityName ?? "Your Area"}`;
    case "locality-service":
      return `${input.serviceName ?? "Installation"} in ${input.localityName ?? "Your Area"}, ${input.cityName ?? ""}`.trim();
    case "project":
      return input.projectName ?? "Installation Project";
    case "guide":
      return input.guideTitle ?? "Buying & Installation Guide";
    case "comparison":
      return input.comparisonTitle ?? "Compare Your Options";
    default:
      return input.serviceName ?? "Hiranya Enterprises";
  }
}
