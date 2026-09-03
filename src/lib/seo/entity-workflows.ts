/**
 * §119–122 Entity expansion workflows — controlled scaling only.
 */

export type WorkflowStep = { id: string; label: string };

export const NEW_SERVICE_WORKFLOW: WorkflowStep[] = [
  { id: "entity", label: "Create service entity" },
  { id: "family", label: "Assign service family" },
  { id: "intent", label: "Define search intent" },
  { id: "core-page", label: "Create core service page" },
  { id: "map-cities", label: "Map cities" },
  { id: "availability", label: "Map actual service availability" },
  { id: "city-service", label: "Create city-service pages where justified" },
  { id: "guides", label: "Create guides" },
  { id: "projects", label: "Connect projects" },
  { id: "links", label: "Update internal links" },
  { id: "sitemap", label: "Update sitemap" },
  { id: "qa", label: "Run SEO QA" },
];

export const NEW_CITY_WORKFLOW: WorkflowStep[] = [
  { id: "verify-availability", label: "Verify service availability" },
  { id: "entity", label: "Create city entity" },
  { id: "hub", label: "Create city hub" },
  { id: "map-services", label: "Map services" },
  { id: "priority-city-service", label: "Create priority city-service pages" },
  { id: "localities", label: "Add genuine localities" },
  { id: "projects", label: "Add real projects" },
  { id: "links", label: "Add internal links" },
  { id: "sitemap", label: "Update sitemap" },
  { id: "quality-gate", label: "Run quality gate" },
];

export const NEW_LOCALITY_WORKFLOW: WorkflowStep[] = [
  { id: "city-validated", label: "City already validated" },
  { id: "verify-locality", label: "Verify locality" },
  { id: "verify-coverage", label: "Verify service coverage" },
  { id: "search-demand", label: "Determine search demand" },
  { id: "unique-value", label: "Check unique value" },
  { id: "create-locality", label: "Create locality" },
  { id: "locality-service", label: "Create relevant locality-service pages" },
  { id: "projects", label: "Connect projects" },
  { id: "duplication", label: "Run duplication check" },
  { id: "publish", label: "Publish if quality threshold passes" },
];

export const NEW_PROPERTY_WORKFLOW: WorkflowStep[] = [
  { id: "verify-property", label: "Verify property" },
  { id: "business-relevance", label: "Verify business relevance" },
  { id: "service-relevance", label: "Verify service relevance" },
  { id: "approved-info", label: "Collect approved information" },
  { id: "entity", label: "Add property entity" },
  { id: "project", label: "Add project if genuine" },
  { id: "property-page", label: "Create property page" },
  { id: "property-service", label: "Create property-service only if justified" },
];

export function workflowProgress(
  steps: WorkflowStep[],
  done: Set<string>,
): { complete: boolean; remaining: WorkflowStep[] } {
  const remaining = steps.filter((s) => !done.has(s.id));
  return { complete: remaining.length === 0, remaining };
}
