/**
 * §123 Content deletion strategy — quality over URL count.
 */

export type DeletionAction =
  | "improve"
  | "merge"
  | "redirect"
  | "noindex"
  | "archive"
  | "delete";

export type DeletionDecisionInput = {
  qualityScore: number;
  hasTraffic: boolean;
  hasConversions: boolean;
  isDuplicate: boolean;
  isObsoleteService: boolean;
  isFakeOrMisleading: boolean;
  canMergeInto?: string;
};

export function recommendDeletionAction(
  input: DeletionDecisionInput,
): { action: DeletionAction; reason: string } {
  if (input.isFakeOrMisleading) {
    return { action: "delete", reason: "Fake or misleading — remove" };
  }
  if (input.isObsoleteService) {
    return {
      action: input.canMergeInto ? "redirect" : "archive",
      reason: "Obsolete service — redirect or archive",
    };
  }
  if (input.isDuplicate && input.canMergeInto) {
    return { action: "merge", reason: `Merge into ${input.canMergeInto}` };
  }
  if (input.qualityScore < 50 && !input.hasConversions) {
    return input.hasTraffic
      ? { action: "improve", reason: "Weak but traffic — improve before removal" }
      : { action: "noindex", reason: "Thin/low quality without conversions" };
  }
  if (input.qualityScore < 65) {
    return { action: "improve", reason: "Below publish bar — improve" };
  }
  return { action: "improve", reason: "Keep and maintain" };
}
