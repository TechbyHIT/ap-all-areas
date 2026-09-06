/**
 * Duplicate-content guard for the service × city × area grid.
 *
 * Every location page in the sitemap is generated, its body text is hashed,
 * and near-duplicates are reported. Runs without a database so it can sit in
 * CI next to the other SEO checks.
 */

import { STATE_SLUG } from "@/config/geo";
import { getAreaLocalFact } from "@/data/area-local-facts";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import {
  buildAreaServiceContent,
  buildCityServiceContent,
} from "@/data/location-page-content";
import { buildVariantFaqs } from "@/data/service-variant-content";
import { getCityLocalProfile } from "@/data/city-local-profiles";
import { listLocationServices } from "@/lib/data/location-catalog";
import { ROUTES } from "@/config/routes";
import { getAreasForCity, getCityBySlug } from "@/lib/data/locations";
import { shouldGeneratePage } from "@/lib/seo/page-decision";

type PageSample = { path: string; text: string };

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Word-level Jaccard similarity — cheap and good enough to catch templates. */
function similarity(a: string, b: string): number {
  const left = new Set(normalize(a).split(" "));
  const right = new Set(normalize(b).split(" "));
  let shared = 0;
  for (const word of left) if (right.has(word)) shared += 1;
  return shared / (left.size + right.size - shared);
}

function collect(): PageSample[] {
  const samples: PageSample[] = [];
  const services = listLocationServices();

  for (const citySeed of HIGH_PRIORITY_CITY_AREAS) {
    const city = getCityBySlug(citySeed.citySlug);
    if (!city) continue;
    const areaNames = getAreasForCity(citySeed.citySlug).map((a) => a.name);

    for (const service of services) {
      if (
        shouldGeneratePage({
          kind: "city-service",
          stateSlug: STATE_SLUG,
          citySlug: citySeed.citySlug,
          serviceSlug: service.slug,
        }).generate
      ) {
        const content = buildCityServiceContent({
          serviceSlug: service.slug,
          serviceName: service.name,
          cityName: city.name,
          citySlug: citySeed.citySlug,
          areas: areaNames,
        });
        samples.push({
          path: ROUTES.cityService(citySeed.citySlug, service.slug),
          text: [
            content.uniqueIntroduction,
            content.localRequirements,
            content.problemsSolved,
            content.materialsGuidance,
            content.pricingNote,
            ...buildVariantFaqs(service.slug, city.name).map(
              (f) => `${f.question} ${f.answer}`,
            ),
          ].join(" "),
        });
      }

      for (const area of citySeed.areas) {
        if (
          !shouldGeneratePage({
            kind: "area-service",
            stateSlug: STATE_SLUG,
            citySlug: citySeed.citySlug,
            areaSlug: area.slug,
            serviceSlug: service.slug,
          }).generate
        ) {
          continue;
        }
        const content = buildAreaServiceContent({
          serviceSlug: service.slug,
          serviceName: service.name,
          areaName: area.name,
          cityName: city.name,
          citySlug: citySeed.citySlug,
          areaSlug: area.slug,
        });
        samples.push({
          path: ROUTES.areaService(citySeed.citySlug, area.slug, service.slug),
          text: [
            content.uniqueIntroduction,
            content.serviceOverview,
            content.residentialApplications,
            content.safetyRequirements,
            content.measurementProcess,
            content.pricingNote,
            ...buildVariantFaqs(
              service.slug,
              `${area.name}, ${city.name}`,
            ).map((f) => `${f.question} ${f.answer}`),
          ].join(" "),
        });
      }
    }
  }

  return samples;
}

function main() {
  const samples = collect();
  const byHash = new Map<string, string[]>();

  for (const sample of samples) {
    const key = normalize(sample.text);
    byHash.set(key, [...(byHash.get(key) ?? []), sample.path]);
  }

  const exactDuplicateGroups = [...byHash.values()].filter(
    (paths) => paths.length > 1,
  );

  console.log(`Location pages generated: ${samples.length}`);
  console.log(`Exact duplicate bodies:   ${exactDuplicateGroups.length} group(s)`);

  for (const group of exactDuplicateGroups.slice(0, 5)) {
    console.log(`  duplicate: ${group.slice(0, 3).join(" | ")}`);
  }

  // Near-duplicate scan across siblings that share a locality (same place,
  // different service) and siblings that share a service (same service,
  // different place). Those are the two ways a grid goes thin.
  const byPlace = new Map<string, PageSample[]>();
  const byService = new Map<string, PageSample[]>();
  for (const sample of samples) {
    const parts = sample.path.split("/").filter(Boolean);
    const service = parts[parts.length - 1]!;
    const place = parts.slice(0, -1).join("/");
    byPlace.set(place, [...(byPlace.get(place) ?? []), sample]);
    byService.set(service, [...(byService.get(service) ?? []), sample]);
  }

  function worstPair(groups: Map<string, PageSample[]>, label: string) {
    let worst = { score: 0, a: "", b: "" };
    let total = 0;
    let count = 0;
    for (const group of groups.values()) {
      for (let i = 0; i < group.length; i += 1) {
        for (let j = i + 1; j < Math.min(group.length, i + 4); j += 1) {
          const score = similarity(group[i]!.text, group[j]!.text);
          total += score;
          count += 1;
          if (score > worst.score) {
            worst = { score, a: group[i]!.path, b: group[j]!.path };
          }
        }
      }
    }
    console.log(
      `${label}: mean overlap ${(total / Math.max(count, 1)).toFixed(3)}, worst ${worst.score.toFixed(3)}`,
    );
    if (worst.a) console.log(`  ${worst.a}\n  ${worst.b}`);
  }

  worstPair(byPlace, "Same place, different service");
  worstPair(byService, "Same service, different place");

  const missingProfile = HIGH_PRIORITY_CITY_AREAS.filter(
    (c) => !getCityLocalProfile(c.citySlug),
  ).map((c) => c.citySlug);
  const areasWithFacts = HIGH_PRIORITY_CITY_AREAS.reduce(
    (n, city) =>
      n + city.areas.filter((a) => getAreaLocalFact(city.citySlug, a.slug)).length,
    0,
  );
  console.log(`Cities without a local profile: ${missingProfile.length}`);
  console.log(`Areas with curated local facts: ${areasWithFacts}`);

  if (exactDuplicateGroups.length > 0) process.exitCode = 1;
}

main();
