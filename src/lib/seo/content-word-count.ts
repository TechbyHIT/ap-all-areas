/**
 * Honest unique-word counts from generated copy — used for robots floors.
 * Do not invent a count higher than the strings we actually render.
 */

import type {
  AreaServiceContent,
  CityServiceContent,
  LocationPageContent,
} from "@/data/location-page-content";
import type { EncyclopediaSection } from "@/data/service-encyclopedia";
import type { PillarPage, PillarSection } from "@/data/pillars/types";

export function countWords(
  ...parts: Array<string | readonly string[] | undefined | null>
): number {
  const chunks: string[] = [];
  for (const part of parts) {
    if (!part) continue;
    if (typeof part === "string") chunks.push(part);
    else chunks.push(...part);
  }
  const text = chunks.join(" ").replace(/\s+/g, " ").trim();
  if (!text) return 0;
  return text.split(" ").length;
}

export function countEncyclopediaWords(
  sections: readonly EncyclopediaSection[],
): number {
  return countWords(
    ...sections.flatMap((section) => [section.heading, ...section.paragraphs]),
  );
}

export function countFaqWords(
  faqs: ReadonlyArray<{ question: string; answer: string }>,
): number {
  return countWords(...faqs.flatMap((faq) => [faq.question, faq.answer]));
}

export function countLocationHubWords(content: LocationPageContent): number {
  return (
    countWords(
      content.introduction,
      content.servicesOverview,
      content.residentialApplications,
      content.commercialApplications,
      content.buyingGuide,
      content.localDecisionGuide,
      content.commonRequirements,
      content.installationOverview,
      content.siteInspectionInfo,
      content.pricingFactors,
    ) +
    countEncyclopediaWords(content.encyclopedia) +
    countFaqWords(content.faqs)
  );
}

export function countCityServiceWords(
  content: CityServiceContent,
  faqs: ReadonlyArray<{ question: string; answer: string }> = [],
): number {
  return (
    countWords(
      content.uniqueIntroduction,
      content.localRequirements,
      content.suitablePropertyTypes,
      content.problemsSolved,
      content.materialsGuidance,
      content.installationOverview,
      content.weatherNotes,
      content.areasServedIntro,
      content.pricingNote,
      content.buyingGuide,
      content.localAuthorityNote,
    ) +
    countEncyclopediaWords(content.encyclopedia) +
    countFaqWords(faqs)
  );
}

export function countAreaServiceWords(
  content: AreaServiceContent,
  faqs: ReadonlyArray<{ question: string; answer: string }> = [],
): number {
  return (
    countWords(
      content.uniqueIntroduction,
      content.serviceOverview,
      content.residentialApplications,
      content.suitablePropertyTypes,
      content.safetyRequirements,
      content.materialGuidance,
      content.measurementProcess,
      content.installationSteps,
      content.maintenanceAdvice,
      content.pricingNote,
      content.buyingGuide,
      content.localAuthorityNote,
    ) +
    countEncyclopediaWords(content.encyclopedia) +
    countFaqWords(faqs)
  );
}

function countPillarSection(section: PillarSection): number {
  switch (section.kind) {
    case "prose":
      return countWords(section.heading, section.paragraphs);
    case "split-list":
      return countWords(
        section.heading,
        section.lead,
        ...section.items.flatMap((item) => [item.title, item.body]),
      );
    case "comparison":
      return countWords(
        section.heading,
        section.lead,
        ...section.rows.flatMap((row) => [
          row.option,
          row.bestWhen,
          row.watchOut,
        ]),
      );
    case "pricing":
      return countWords(
        section.heading,
        section.lead,
        section.disclaimer,
        ...section.bands.flatMap((band) => [
          band.context,
          band.rangeNote,
          band.drivers,
        ]),
      );
    case "process":
      return countWords(
        section.heading,
        section.lead,
        ...section.steps.flatMap((step) => [step.title, step.detail]),
      );
    case "link-graph":
      return countWords(
        section.heading,
        section.lead,
        ...section.links.flatMap((link) => [link.label, link.note]),
      );
    case "faq":
      return countWords(section.heading) + countFaqWords(section.items);
    default:
      return 0;
  }
}

export function countPillarWords(pillar: PillarPage): number {
  return (
    countWords(
      pillar.hero.h1,
      pillar.hero.deck,
      pillar.hero.trustLine,
      pillar.finalCta.title,
      pillar.finalCta.description,
    ) + pillar.sections.reduce((sum, section) => sum + countPillarSection(section), 0)
  );
}
