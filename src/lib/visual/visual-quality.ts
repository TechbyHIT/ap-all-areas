/**
 * §138–180 Image aspect ratios, relevance scoring, visual quality gate.
 */

import type { ImageEntity, ImageSourceKind } from "@/lib/visual/hero-media";
import type { VisualPageType } from "@/lib/visual/page-composition";
import { validateImageAlt } from "@/lib/seo/image-alt";

export const ASPECT_RATIOS = {
  hero: "16 / 9",
  heroAlt: "3 / 2",
  card: "4 / 3",
  project: "4 / 3",
  gallerySquare: "1 / 1",
  portrait: "3 / 4",
} as const;

export const RESPONSIVE_WIDTHS = [
  320, 480, 640, 768, 1024, 1280, 1536, 1920,
] as const;

export type ImageRelevanceInput = {
  serviceMatch: boolean;
  locationMatch: boolean;
  pageMatch: boolean;
  visualQuality: number; // 0–25
  uniqueness: number; // 0–25
  authenticity: number; // 0–25 (higher for real installs)
};

export function scoreImageRelevance(input: ImageRelevanceInput): {
  total: number;
  publish: boolean;
} {
  const total =
    (input.serviceMatch ? 15 : 0) +
    (input.locationMatch ? 10 : 0) +
    (input.pageMatch ? 15 : 0) +
    Math.min(25, input.visualQuality) +
    Math.min(25, input.uniqueness) +
    Math.min(25, input.authenticity);
  return { total, publish: total >= 55 };
}

export type VisualQualityGateInput = {
  pageType: VisualPageType;
  hasDedicatedHero: boolean;
  heroExplainsPage: boolean;
  meaningfulAboveFoldVisual: boolean;
  imagesRelevant: boolean;
  visualVarietyVsParent: boolean;
  visualVarietyVsSibling: boolean;
  imagesOptimized: boolean;
  rastersAreWebpOrNextOptimized: boolean;
  altTextsAccurate: boolean;
  mobileLayoutOk: boolean;
  feelsHumanNotAssembled: boolean;
  claimsStockAsProject?: boolean;
};

export type VisualQualityGateResult = {
  ok: boolean;
  failures: string[];
  publish: boolean;
};

export function runVisualQualityGate(
  input: VisualQualityGateInput,
): VisualQualityGateResult {
  const failures: string[] = [];
  const checks: Array<[boolean, string]> = [
    [input.hasDedicatedHero, "missing-dedicated-hero"],
    [input.heroExplainsPage, "hero-does-not-explain-page"],
    [input.meaningfulAboveFoldVisual, "no-meaningful-above-fold-visual"],
    [input.imagesRelevant, "images-not-relevant"],
    [input.visualVarietyVsParent, "looks-like-parent-page"],
    [input.visualVarietyVsSibling, "looks-like-sibling-page"],
    [input.imagesOptimized, "images-not-optimized"],
    [input.rastersAreWebpOrNextOptimized, "non-webp-raster-in-production-path"],
    [input.altTextsAccurate, "inaccurate-alt-text"],
    [input.mobileLayoutOk, "mobile-layout-not-ok"],
    [input.feelsHumanNotAssembled, "feels-programmatically-assembled"],
  ];

  for (const [ok, code] of checks) {
    if (!ok) failures.push(code);
  }
  if (input.claimsStockAsProject) {
    failures.push("stock-presented-as-project");
  }

  return {
    ok: failures.length === 0,
    failures,
    publish: failures.length === 0,
  };
}

export function assertImageNotPresentedAsFakeProject(entity: ImageEntity): boolean {
  if (entity.isAuthenticProjectEvidence) return true;
  return (
    entity.source !== "illustrative-generated" &&
    entity.source !== "licensed-stock"
  );
}

export function validateHeroAsset(src: string, alt: string): {
  ok: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  if (!src) issues.push("missing-src");
  const altCheck = validateImageAlt(alt, src);
  if (!altCheck.ok) {
    issues.push(...altCheck.issues.map((i) => i.message));
  }
  return { ok: issues.length === 0, issues };
}

/** Preferred static delivery extension for public raster assets. */
export function preferWebpPath(src: string): string {
  if (/\.webp$/i.test(src)) return src;
  if (/\.(jpe?g|png)$/i.test(src)) {
    return src.replace(/\.(jpe?g|png)$/i, ".webp");
  }
  return src;
}

export function isRasterExtension(path: string): boolean {
  return /\.(jpe?g|png|webp|avif|gif)$/i.test(path);
}

export function isUnoptimizedRaster(path: string): boolean {
  return /\.(jpe?g|png)$/i.test(path);
}

export const GENERATED_IMAGE_RULE =
  "Never present AI/stock imagery as a real Hiranya installation project.";

export function authenticityScoreForSource(source: ImageSourceKind): number {
  switch (source) {
    case "real-project":
      return 25;
    case "real-business":
      return 22;
    case "real-service-install":
      return 20;
    case "approved-professional":
      return 14;
    case "licensed-stock":
      return 6;
    case "illustrative-generated":
      return 4;
    default:
      return 0;
  }
}
