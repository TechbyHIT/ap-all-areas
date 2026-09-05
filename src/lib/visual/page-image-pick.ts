/**
 * §5 Image selection — diversify photos per page; prefer geo-tagged when present.
 * Never invent city claims on untagged photos.
 */

import {
  INSTALLATION_PHOTOS,
  installationPhotosForService,
  type InstallationPhoto,
} from "@/config/installation-photos";
import { getServiceMedia, HERO_FALLBACK } from "@/config/design";
import { preferWebpPath } from "@/lib/visual/visual-quality";
import { pickByHash, rotateByHash } from "@/lib/visual/hash-pick";

export type PageImagePick = {
  src: string;
  alt: string;
  caption: string | null;
  isLocallyVerified: boolean;
  isGenericFallback: boolean;
};

function withWebp(src: string): string {
  return preferWebpPath(src);
}

function geoMatches(
  photo: InstallationPhoto,
  citySlug?: string,
  localitySlug?: string,
): boolean {
  if (localitySlug && photo.localitySlug === localitySlug) return true;
  if (citySlug && photo.citySlug === citySlug) return true;
  return false;
}

function describeAlt(
  photo: InstallationPhoto,
  cityName?: string,
  localityName?: string,
): string {
  if (photo.localitySlug && photo.citySlug && localityName && cityName) {
    return `${photo.alt} in ${localityName}, ${cityName}`;
  }
  if (photo.citySlug && cityName) {
    return `${photo.alt} in ${cityName}`;
  }
  return photo.alt;
}

/**
 * Pick the best image for a page context.
 * Priority: verified locality → verified city → service pool (hash-diversified) → fallback.
 */
export function pickPageImage(input: {
  pageKey: string;
  serviceSlug?: string;
  citySlug?: string;
  localitySlug?: string;
  cityName?: string;
  localityName?: string;
}): PageImagePick {
  const pool = input.serviceSlug
    ? installationPhotosForService(input.serviceSlug)
    : INSTALLATION_PHOTOS;

  const geoHits = pool.filter((p) =>
    geoMatches(p, input.citySlug, input.localitySlug),
  );
  if (geoHits.length > 0) {
    const photo = pickByHash(geoHits, input.pageKey)!;
    return {
      src: withWebp(photo.src),
      alt: describeAlt(photo, input.cityName, input.localityName),
      caption: null,
      isLocallyVerified: true,
      isGenericFallback: false,
    };
  }

  const rotated = rotateByHash(pool, input.pageKey);
  const photo = rotated[0];
  if (photo) {
    return {
      src: withWebp(photo.src),
      alt: describeAlt(photo, undefined, undefined),
      caption: "Representative installation photograph",
      isLocallyVerified: false,
      isGenericFallback: false,
    };
  }

  if (input.serviceSlug) {
    const media = getServiceMedia(input.serviceSlug);
    return {
      src: withWebp(media.image),
      alt: media.alt,
      caption: "Representative installation photograph",
      isLocallyVerified: false,
      isGenericFallback: true,
    };
  }

  return {
    src: withWebp(HERO_FALLBACK),
    alt: "Safety net and invisible grill installation",
    caption: "Representative installation photograph",
    isLocallyVerified: false,
    isGenericFallback: true,
  };
}

/** Distinct card images for a list of services on one page. */
export function pickDistinctServiceCardImages(
  pageKey: string,
  serviceSlugs: readonly string[],
): Record<string, PageImagePick> {
  const used = new Set<string>();
  const out: Record<string, PageImagePick> = {};

  for (const slug of serviceSlugs) {
    const pool = rotateByHash(
      installationPhotosForService(slug),
      `${pageKey}:${slug}`,
    );
    const fresh = pool.find((p) => !used.has(p.src)) ?? pool[0];
    if (fresh) {
      used.add(fresh.src);
      out[slug] = {
        src: withWebp(fresh.src),
        alt: fresh.alt,
        caption: null,
        isLocallyVerified: Boolean(fresh.citySlug),
        isGenericFallback: false,
      };
    } else {
      out[slug] = pickPageImage({ pageKey: `${pageKey}:${slug}`, serviceSlug: slug });
    }
  }

  return out;
}
