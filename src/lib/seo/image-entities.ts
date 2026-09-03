/**
 * §63 Image entity relationships: Image → Project → Service → Location → Property
 */

export type ImageEntityLinks = {
  src: string;
  alt: string;
  projectSlug: string | null;
  serviceSlug: string | null;
  citySlug: string | null;
  localitySlug: string | null;
  propertyTypeSlug: string | null;
  application: string | null;
};

export function linkImageEntities(input: {
  src: string;
  alt: string;
  projectSlug?: string | null;
  serviceSlug?: string | null;
  citySlug?: string | null;
  localitySlug?: string | null;
  propertyTypeSlug?: string | null;
  application?: string | null;
}): ImageEntityLinks {
  return {
    src: input.src,
    alt: input.alt,
    projectSlug: input.projectSlug ?? null,
    serviceSlug: input.serviceSlug ?? null,
    citySlug: input.citySlug ?? null,
    localitySlug: input.localitySlug ?? null,
    propertyTypeSlug: input.propertyTypeSlug ?? null,
    application: input.application ?? null,
  };
}

/** Only attach location/property when verified — never invent. */
export function assertHonestImageLocality(links: ImageEntityLinks): string[] {
  const warnings: string[] = [];
  if (links.citySlug && !links.projectSlug) {
    warnings.push(
      "City on an image without a verified project record — confirm before publishing as local evidence",
    );
  }
  return warnings;
}
