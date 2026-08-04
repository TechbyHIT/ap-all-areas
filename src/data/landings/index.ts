import { INVISIBLE_GRILLS_GAJUWAKA } from "@/data/landings/invisible-grills-gajuwaka";
import type { MoneyLanding } from "@/data/landings/types";

const AREA_LANDINGS: MoneyLanding[] = [INVISIBLE_GRILLS_GAJUWAKA];

export function getAreaMoneyLanding(input: {
  serviceSlug: string;
  stateSlug: string;
  citySlug: string;
  areaSlug: string;
}): MoneyLanding | null {
  return (
    AREA_LANDINGS.find(
      (l) =>
        l.serviceSlug === input.serviceSlug &&
        l.stateSlug === input.stateSlug &&
        l.citySlug === input.citySlug &&
        l.areaSlug === input.areaSlug,
    ) ?? null
  );
}

export function listAreaMoneyLandings(): MoneyLanding[] {
  return AREA_LANDINGS;
}

export type { MoneyLanding } from "@/data/landings/types";
