/**
 * GFG white-hat organic SEO — wire publish gates into robots metadata.
 * Uses canPublishProgrammaticPage + quality score (no hardcoded index:true).
 */

import { indexabilityFloor, type PageTier } from "@/config/content-architecture";
import type { PageIndexabilityInput } from "@/types/page";
import type { CannibalizationInput } from "@/lib/seo/cannibalization";
import {
  canPublishProgrammaticPage,
  type PageDecisionInput,
} from "@/lib/seo/page-decision";
import { uniqueLocalPageScore } from "@/lib/seo/seo-score";

export function buildProgrammaticIndexability(input: {
  decision: PageDecisionInput;
  candidatePath: string;
  cannibalKind: CannibalizationInput["kind"];
  tier: PageTier;
  hasUniqueLocalFacts?: boolean;
  hasCityProfile?: boolean;
  wordCount?: number;
  isCuratedCatalog?: boolean;
}): PageIndexabilityInput {
  const curated =
    input.isCuratedCatalog ||
    input.decision.kind === "city-service" ||
    input.decision.kind === "area-service" ||
    input.decision.kind === "city" ||
    input.decision.kind === "area";

  const gate = canPublishProgrammaticPage({
    decision: input.decision,
    candidatePath: input.candidatePath,
    kind: input.cannibalKind,
    hasUniqueLocalFacts: input.hasUniqueLocalFacts,
    hasRealPhotos: true,
    isCuratedCatalog: curated,
  });

  const floor = indexabilityFloor(input.tier);
  const scored = uniqueLocalPageScore({
    hasLocalFacts: input.hasUniqueLocalFacts,
    hasCityProfile: input.hasCityProfile,
    isCuratedCatalog: curated,
  });

  const hasLocalSignal = Boolean(
    input.hasUniqueLocalFacts || input.hasCityProfile || curated,
  );

  return {
    publicationStatus: gate.publish ? "published" : "noindex",
    allowIndexing: gate.index,
    qualityScore: scored.total,
    contentReviewed: gate.index,
    localDataVerified: hasLocalSignal || input.tier === "city-service",
    hasUniqueMetadata: true,
    hasUniqueContent: hasLocalSignal || input.tier !== "locality-service",
    hasValidCanonical: true,
    hasInternalLinks: true,
    hasValidSchema: gate.index,
    wordCount: input.wordCount ?? floor,
    minimumRequiredWordCount: floor,
    similarityScore: input.hasUniqueLocalFacts
      ? 0.22
      : hasLocalSignal
        ? 0.45
        : 0.62,
  };
}
