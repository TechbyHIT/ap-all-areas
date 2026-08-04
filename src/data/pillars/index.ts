import { INVISIBLE_GRILLS_VISAKHAPATNAM } from "@/data/pillars/invisible-grills-visakhapatnam";
import type { PillarPage } from "@/data/pillars/types";

const PILLARS: PillarPage[] = [INVISIBLE_GRILLS_VISAKHAPATNAM];

export function getPillarPage(
  citySlug: string,
  serviceSlug: string,
): PillarPage | null {
  return (
    PILLARS.find(
      (p) => p.citySlug === citySlug && p.serviceSlug === serviceSlug,
    ) ?? null
  );
}

export type { PillarPage, PillarSection, PillarFaq } from "@/data/pillars/types";
