/**
 * §178 Page media bundle — hero + supporting imagery per page context.
 */

import { installationPhotosForService } from "@/config/installation-photos";
import { getServiceMedia } from "@/config/design";
import { listPublishedProjects } from "@/data/projects";
import {
  resolveHeroMedia,
  type ResolvedHeroMedia,
} from "@/lib/visual/hero-media";
import type { VisualPageType } from "@/lib/visual/page-composition";
import { preferWebpPath } from "@/lib/visual/visual-quality";

export type PageMediaBundle = {
  heroImage: ResolvedHeroMedia;
  secondaryImages: Array<{ src: string; alt: string }>;
  serviceImages: Array<{ src: string; alt: string }>;
  applicationImages: Array<{ src: string; alt: string }>;
  processImages: Array<{ src: string; alt: string }>;
  projectImages: Array<{ src: string; alt: string }>;
  galleryImages: Array<{ src: string; alt: string }>;
  ogImage: string;
};

function withWebp(src: string): string {
  return preferWebpPath(src);
}

export function buildPageMediaBundle(input: {
  pageType: VisualPageType;
  serviceSlug?: string;
  cityName?: string;
  localityName?: string;
  projectSlug?: string;
  h1: string;
}): PageMediaBundle {
  const hero = resolveHeroMedia(input);
  hero.src = withWebp(hero.src);

  const servicePhotos = input.serviceSlug
    ? installationPhotosForService(input.serviceSlug).map((p) => ({
        src: withWebp(p.src),
        alt: p.alt,
      }))
    : [];

  const projects = listPublishedProjects(input.serviceSlug).slice(0, 6).map((p) => ({
    src: withWebp(p.images[0]?.src ?? hero.src),
    alt: p.images[0]?.alt ?? p.projectName,
  }));

  const serviceMedia = input.serviceSlug
    ? getServiceMedia(input.serviceSlug)
    : null;

  const gallery = (serviceMedia?.gallery ?? servicePhotos.map((p) => p.src)).map(
    (src, i) => ({
      src: withWebp(src),
      alt: servicePhotos[i]?.alt ?? hero.alt,
    }),
  );

  return {
    heroImage: hero,
    secondaryImages: servicePhotos.slice(1, 4),
    serviceImages: servicePhotos.slice(0, 3),
    applicationImages: servicePhotos.slice(0, 3),
    processImages: servicePhotos.filter((p) =>
      /install|harness|detail/i.test(p.src + p.alt),
    ).slice(0, 3),
    projectImages: projects,
    galleryImages: gallery.slice(0, 8),
    ogImage: withWebp(hero.src),
  };
}
