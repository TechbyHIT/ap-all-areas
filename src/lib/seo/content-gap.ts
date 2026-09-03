/**
 * §74 Content gap analysis against the semantic model.
 * Only recommend gaps that would add real value.
 */

import {
  getServiceSemanticModel,
  type ServiceSemanticModel,
} from "@/data/service-semantic-model";
import { SERVICE_COMPARISONS } from "@/data/comparisons";
import { listPublishedProjects } from "@/data/projects";
import { SERVICE_FAQS } from "@/data/service-faqs";
import { SERVICE_ADVANCED_SECTIONS } from "@/data/service-advanced-sections";

export type ContentGapKind =
  | "questions"
  | "applications"
  | "materials"
  | "comparisons"
  | "pricing"
  | "maintenance"
  | "locations"
  | "projects";

export type ContentGap = {
  serviceSlug: string;
  kind: ContentGapKind;
  detail: string;
  valuable: boolean;
};

export function analyzeServiceContentGaps(serviceSlug: string): ContentGap[] {
  const model = getServiceSemanticModel(serviceSlug);
  if (!model) return [];

  const gaps: ContentGap[] = [];
  const faqs = SERVICE_FAQS[serviceSlug] ?? [];
  const advanced = SERVICE_ADVANCED_SECTIONS[serviceSlug];
  const projects = listPublishedProjects(serviceSlug);
  const comparisons = SERVICE_COMPARISONS.filter(
    (c) =>
      c.optionA.href.includes(`/${serviceSlug}/`) ||
      c.optionB.href.includes(`/${serviceSlug}/`),
  );

  if (faqs.length < 4) {
    gaps.push({
      serviceSlug,
      kind: "questions",
      detail: "Fewer than 4 owned FAQs — add only real customer questions",
      valuable: true,
    });
  }

  if (model.applications.length < 3) {
    gaps.push({
      serviceSlug,
      kind: "applications",
      detail: "Thin applications list in semantic model",
      valuable: true,
    });
  }

  if (model.attributes.filter((a) => /material|grade|mesh|wire/i.test(a)).length === 0) {
    gaps.push({
      serviceSlug,
      kind: "materials",
      detail: "No clear material attributes documented",
      valuable: true,
    });
  }

  if (comparisons.length === 0) {
    gaps.push({
      serviceSlug,
      kind: "comparisons",
      detail: "No genuine comparison page linked — create only if users compare",
      valuable: false,
    });
  }

  if (model.costDrivers.length < 3) {
    gaps.push({
      serviceSlug,
      kind: "pricing",
      detail: "Pricing factors under-documented (factors only — no fake rates)",
      valuable: true,
    });
  }

  if (model.maintenance.length < 2) {
    gaps.push({
      serviceSlug,
      kind: "maintenance",
      detail: "Maintenance guidance thin",
      valuable: true,
    });
  }

  if (projects.length < 2) {
    gaps.push({
      serviceSlug,
      kind: "projects",
      detail: "Few verified project photos for this service",
      valuable: true,
    });
  }

  if (!advanced?.limitations?.length) {
    gaps.push({
      serviceSlug,
      kind: "applications",
      detail: "Missing limitations / when-another-service section",
      valuable: Boolean(advanced),
    });
  }

  return gaps.filter((g) => g.valuable);
}

export function summarizeModelCoverage(model: ServiceSemanticModel) {
  return {
    applications: model.applications.length,
    problems: model.problems.length,
    costDrivers: model.costDrivers.length,
    maintenance: model.maintenance.length,
  };
}
