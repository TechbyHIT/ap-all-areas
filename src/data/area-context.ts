/**
 * Verifiable locality context for every curated area.
 *
 * Areas with hand-written entries in `area-local-facts.ts` keep that detail.
 * This module covers the rest without inventing building stock, project counts
 * or branch claims: it states only what is checkable on a map — whether the
 * locality is sea-facing, whether it is a separate town outside the core city,
 * and which of the city's named residential corridors it belongs to.
 *
 * Those three facts change real installation planning (hardware grade, travel
 * and access), which is why they are worth publishing.
 */

import { getCityLocalProfile } from "@/data/city-local-profiles";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { getDistrictBySlug } from "@/lib/data/locations";

export type AreaPosition = "sea-facing" | "outlying-town" | "core-city";

export type AreaContext = {
  citySlug: string;
  areaSlug: string;
  areaName: string;
  cityName: string;
  districtSlug: string;
  position: AreaPosition;
  /** Named corridor from the city profile that lists this locality, if any. */
  corridor: string | null;
  /** One sentence on where the locality sits relative to the city. */
  positionNote: string;
  /** One sentence on what that position changes for an installation visit. */
  accessNote: string;
  /** One sentence on outdoor exposure at this position. */
  exposureNote: string;
};

/**
 * Localities on or immediately behind the shoreline. Salt-laden air here is
 * materially harsher than a few kilometres inland in the same city.
 */
const SEA_FACING: Record<string, string[]> = {
  visakhapatnam: [
    "beach-road",
    "rushikonda",
    "bheemunipatnam",
    "yendada",
    "kommadi",
  ],
  kakinada: ["kakinada-port-area", "vakalapudi", "jagannaickpur"],
  nellore: ["indukurpet", "muthukur", "allur"],
};

/**
 * Separate towns and outer settlements served from the parent city. Travel,
 * scheduling and material movement differ from a core-city address.
 */
const OUTLYING_TOWNS: Record<string, string[]> = {
  visakhapatnam: ["bheemunipatnam", "tagarapuvalasa", "pendurthi"],
  vijayawada: [
    "gollapudi",
    "tadepalli",
    "penamaluru",
    "nidamanuru",
    "enikepadu",
    "ramavarappadu",
  ],
  guntur: [
    "mangalagiri",
    "tadepalli",
    "tenali",
    "ponnur",
    "tadikonda",
    "pedakakani",
  ],
  tirupati: [
    "chandragiri",
    "renigunta",
    "puttur",
    "srikalahasti",
    "naidupeta",
    "gudur",
    "sullurpeta",
    "srinivasa-mangapuram",
  ],
  rajamahendravaram: [
    "kovvur",
    "nidadavole",
    "anaparthi",
    "rajanagaram",
    "kadiam",
    "dowleswaram",
  ],
  kakinada: ["samalkot", "pithapuram", "peddapuram", "tuni", "jaggampeta"],
  nellore: [
    "buchireddypalem",
    "kovur",
    "kavali",
    "atmakur",
    "udayagiri",
    "allur",
    "indukurpet",
    "muthukur",
  ],
  kurnool: [
    "adoni",
    "yemmiganur",
    "mantralayam",
    "pathikonda",
    "alur",
    "gudur",
  ],
  anantapur: ["guntakal", "tadipatri", "rayadurg", "kalyandurg", "uravakonda"],
};

/** Prefer the seeded district record so "ntr" renders as "NTR", not "Ntr". */
function districtName(districtSlug: string): string {
  const district = getDistrictBySlug(districtSlug);
  if (district) return district.name;
  return districtSlug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function seedArea(citySlug: string, areaSlug: string) {
  const city = HIGH_PRIORITY_CITY_AREAS.find((c) => c.citySlug === citySlug);
  if (!city) return null;
  const area = city.areas.find((a) => a.slug === areaSlug);
  if (!area) return null;
  return { city, area };
}

/** The city-profile corridor whose description names this locality. */
function matchCorridor(citySlug: string, areaName: string): string | null {
  const profile = getCityLocalProfile(citySlug);
  if (!profile) return null;
  const needle = areaName.toLowerCase();
  return (
    profile.residentialCorridors.find((corridor) =>
      corridor.toLowerCase().includes(needle),
    ) ?? null
  );
}

export function deriveAreaContext(
  citySlug: string,
  areaSlug: string,
): AreaContext | null {
  const seed = seedArea(citySlug, areaSlug);
  if (!seed) return null;

  const { city, area } = seed;
  const isSeaFacing = (SEA_FACING[citySlug] ?? []).includes(areaSlug);
  const isOutlying = (OUTLYING_TOWNS[citySlug] ?? []).includes(areaSlug);
  const position: AreaPosition = isSeaFacing
    ? "sea-facing"
    : isOutlying
      ? "outlying-town"
      : "core-city";

  const corridor = matchCorridor(citySlug, area.name);
  const corridorBit = corridor ? ` It falls in the ${corridor}.` : "";

  const positionNote = (() => {
    switch (position) {
      case "sea-facing":
        return `${area.name} sits on the sea-facing side of ${city.cityName}, where openings take salt-laden air directly rather than the softer version a few kilometres inland.${corridorBit}`;
      case "outlying-town":
        return `${area.name} is served from ${city.cityName} as an outlying location rather than a core-city address, so visits are planned as a scheduled trip.${corridorBit}`;
      default:
        return `${area.name} is a core ${city.cityName} locality within ${districtName(city.districtSlug)} district.${corridorBit}`;
    }
  })();

  const accessNote = (() => {
    switch (position) {
      case "sea-facing":
        return `Parking and lift access near the shoreline can be tight, so send the building name with your photos and we will plan the measurement visit around it.`;
      case "outlying-town":
        return `Because this is a trip out from ${city.cityName}, it helps to measure every opening in one visit — mention all balconies, windows and utility areas when you enquire.`;
      default:
        return `Access is usually straightforward, but lift availability and society drilling hours still decide the installation slot.`;
    }
  })();

  const exposureNote = (() => {
    switch (position) {
      case "sea-facing":
        return `Fasteners and end fittings are the first things salt attacks here, so hardware grade matters more than it would on an inland opening of the same size.`;
      case "outlying-town":
        return `Outer locations often mean more open plots around the building, which usually means more wind on the opening than a sheltered inner-city balcony.`;
      default:
        return `Exposure follows the elevation your opening faces rather than the locality itself, so we check sun and wind direction at survey.`;
    }
  })();

  return {
    citySlug,
    areaSlug,
    areaName: area.name,
    cityName: city.cityName,
    districtSlug: city.districtSlug,
    position,
    corridor,
    positionNote,
    accessNote,
    exposureNote,
  };
}

export function isSeaFacingArea(citySlug: string, areaSlug: string): boolean {
  return (SEA_FACING[citySlug] ?? []).includes(areaSlug);
}

export function isOutlyingArea(citySlug: string, areaSlug: string): boolean {
  return (OUTLYING_TOWNS[citySlug] ?? []).includes(areaSlug);
}
