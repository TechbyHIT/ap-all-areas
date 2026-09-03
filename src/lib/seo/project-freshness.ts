/**
 * §118 Local project freshness workflow — genuine projects only.
 */

export type ProjectFreshnessStep =
  | "add-project"
  | "connect-service"
  | "connect-city"
  | "connect-locality"
  | "connect-property"
  | "add-images"
  | "update-hub-pages"
  | "add-internal-links"
  | "update-sitemap"
  | "revalidate-metadata-schema";

export const PROJECT_FRESHNESS_WORKFLOW: ProjectFreshnessStep[] = [
  "add-project",
  "connect-service",
  "connect-city",
  "connect-locality",
  "connect-property",
  "add-images",
  "update-hub-pages",
  "add-internal-links",
  "update-sitemap",
  "revalidate-metadata-schema",
];

export type ProjectFreshnessChecklist = {
  projectSlug: string;
  completed: Partial<Record<ProjectFreshnessStep, boolean>>;
  blockers: string[];
};

export function evaluateProjectFreshness(
  input: ProjectFreshnessChecklist,
): { ready: boolean; missing: ProjectFreshnessStep[]; blockers: string[] } {
  const required: ProjectFreshnessStep[] = [
    "add-project",
    "connect-service",
    "add-images",
    "add-internal-links",
    "update-sitemap",
  ];
  const missing = required.filter((step) => !input.completed[step]);
  return {
    ready: missing.length === 0 && input.blockers.length === 0,
    missing,
    blockers: input.blockers,
  };
}
