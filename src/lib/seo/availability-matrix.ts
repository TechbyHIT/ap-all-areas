/**
 * §88 Service availability matrix — page generation depends on this.
 */

import { STATE_SLUG } from "@/config/geo";
import { P0_MONEY_CITY_SLUGS } from "@/data/city-local-profiles";
import { INITIAL_SERVICES } from "@/data/initial-services";
import {
  isServiceAvailableInArea,
  isServiceAvailableInCity,
  listFactAreas,
} from "@/lib/data/location-catalog";
import { listPublishedProjects } from "@/data/projects";
import { shouldGeneratePage } from "@/lib/seo/page-decision";

export type AvailabilityStatus =
  | "available"
  | "priority"
  | "limited"
  | "unavailable"
  | "draft";

export type AvailabilityRow = {
  service: string;
  city: string;
  locality: string | null;
  available: boolean;
  priority: number;
  projectCount: number;
  status: AvailabilityStatus;
};

function projectCountFor(service: string, city: string, locality: string | null) {
  return listPublishedProjects(service).filter(
    (p) =>
      (p.city == null || p.city === city) &&
      (locality == null || p.locality == null || p.locality === locality),
  ).length;
}

export function buildAvailabilityMatrix(options?: {
  includeLocalities?: boolean;
  localityLimitPerCity?: number;
}): AvailabilityRow[] {
  const includeLocalities = options?.includeLocalities === true;
  const localityLimit = options?.localityLimitPerCity ?? 8;
  const rows: AvailabilityRow[] = [];

  for (const city of P0_MONEY_CITY_SLUGS) {
    for (const service of INITIAL_SERVICES) {
      if (!service.allowIndexing) continue;
      const available = isServiceAvailableInCity(
        STATE_SLUG,
        city,
        service.slug,
      );
      const decision = shouldGeneratePage({
        kind: "city-service",
        citySlug: city,
        serviceSlug: service.slug,
      });
      const projects = projectCountFor(service.slug, city, null);
      rows.push({
        service: service.slug,
        city,
        locality: null,
        available: available && decision.generate,
        priority: available ? 80 : 0,
        projectCount: projects,
        status: !available
          ? "unavailable"
          : decision.index
            ? "priority"
            : "limited",
      });

      if (!includeLocalities || !available) continue;

      for (const area of listFactAreas(city).slice(0, localityLimit)) {
        const areaOk = isServiceAvailableInArea(
          STATE_SLUG,
          city,
          area.slug,
          service.slug,
        );
        const areaDecision = shouldGeneratePage({
          kind: "area-service",
          citySlug: city,
          areaSlug: area.slug,
          serviceSlug: service.slug,
        });
        rows.push({
          service: service.slug,
          city,
          locality: area.slug,
          available: areaOk && areaDecision.generate,
          priority: areaOk ? 60 : 0,
          projectCount: projectCountFor(service.slug, city, area.slug),
          status: !areaOk
            ? "unavailable"
            : areaDecision.index
              ? "available"
              : "limited",
        });
      }
    }
  }

  return rows;
}

export function isMatrixCellIndexable(row: AvailabilityRow): boolean {
  return row.available && row.status !== "unavailable" && row.status !== "draft";
}
