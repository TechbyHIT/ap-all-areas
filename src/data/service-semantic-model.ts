/**
 * Semantic content model (§27) for core services.
 * Framework for writers — not a keyword-stuff list.
 */

import type { KeywordClusterId } from "@/types/keyword-ownership";

export type ServiceSemanticModel = {
  serviceSlug: string;
  entity: string;
  whatIsIt: string;
  attributes: string[];
  components: string[];
  applications: string[];
  problems: string[];
  alternatives: string[];
  constraints: string[];
  process: string[];
  maintenance: string[];
  costDrivers: string[];
  locationNote: string;
  cluster: KeywordClusterId;
  canonicalName: string;
  /** Allowed user-facing aliases that still mean the same entity */
  aliases: string[];
};

export const SERVICE_SEMANTIC_MODELS: Record<string, ServiceSemanticModel> = {
  "invisible-grills": {
    serviceSlug: "invisible-grills",
    canonicalName: "Invisible Grills",
    aliases: ["SS invisible grills", "stainless steel invisible grills"],
    cluster: "invisible-grills",
    entity: "Invisible grill system",
    whatIsIt:
      "A stainless-steel wire barrier fixed across balconies, windows or voids to reduce fall risk while keeping a lighter visual profile than heavy iron grills.",
    attributes: [
      "wire grade",
      "spacing",
      "tension",
      "anchor type",
      "finish",
      "coastal exposure care",
    ],
    components: [
      "stainless wires",
      "end anchors",
      "corner hardware",
      "optional openable sections where specified",
    ],
    applications: [
      "living balconies",
      "bedroom windows",
      "stair voids",
      "terrace edges",
    ],
    problems: [
      "child balcony safety",
      "pet escape risk",
      "open railing gaps",
      "preference against bulky iron grills",
    ],
    alternatives: ["safety nets", "traditional iron grills"],
    constraints: [
      "needs sound fixing points",
      "society drilling rules",
      "not a climb-from-furniture guarantee",
    ],
    process: [
      "photo review",
      "site measurement",
      "spacing selection",
      "installation",
      "handover checks",
    ],
    maintenance: [
      "periodic cleaning",
      "hardware inspection",
      "honest coastal care discussion",
    ],
    costDrivers: [
      "span count",
      "spacing",
      "wire grade",
      "building height",
      "access",
      "total openings",
    ],
    locationNote:
      "Available across Andhra Pradesh subject to site confirmation—not a claimed branch in every city.",
  },
  "safety-nets": {
    serviceSlug: "safety-nets",
    canonicalName: "Safety Nets",
    aliases: ["balcony safety nets", "pigeon nets", "bird protection nets"],
    cluster: "safety-nets",
    entity: "Safety / bird-control netting",
    whatIsIt:
      "Tensioned outdoor mesh used for fall protection, bird control or both across balconies, ducts and terraces.",
    attributes: [
      "mesh aperture",
      "UV grade",
      "colour",
      "tension",
      "coverage continuity",
    ],
    components: ["mesh panels", "rope/edge finish", "fixings", "support points"],
    applications: [
      "balconies",
      "duct mouths",
      "AC ledges",
      "terraces",
      "utility sit-outs",
    ],
    problems: [
      "child and pet fall risk",
      "pigeon infestation",
      "open shaft exposure",
    ],
    alternatives: ["invisible grills", "bird spikes on narrow ledges"],
    constraints: [
      "protects openings you cover only",
      "access height and society rules",
      "not a neighbourhood-wide bird wipeout",
    ],
    process: [
      "map landing spots or fall risks",
      "measure",
      "mesh selection",
      "install and tension",
      "handover",
    ],
    maintenance: ["debris clearing", "tension checks", "UV wear watch"],
    costDrivers: [
      "area covered",
      "mesh grade",
      "height",
      "access",
      "number of openings",
    ],
    locationNote:
      "Statewide installation support after site review; listing a locality is not a shop claim.",
  },
  "sports-nets": {
    serviceSlug: "sports-nets",
    canonicalName: "Sports Nets",
    aliases: ["cricket practice nets", "box cricket nets"],
    cluster: "sports-nets",
    entity: "Sports enclosure netting",
    whatIsIt:
      "Practice and boundary netting sized to bowling length, court use and neighbouring houses—not balcony safety mesh.",
    attributes: ["mesh type", "height", "post spacing", "indoor vs outdoor"],
    components: ["sports yarn/mesh", "posts", "ground anchors", "entrance details"],
    applications: [
      "home practice lanes",
      "academy cages",
      "school grounds",
      "box-cricket courts",
    ],
    problems: [
      "balls leaving the plot",
      "shared practice space",
      "neighbour impact",
    ],
    alternatives: ["temporary soft nets", "permanent fencing where allowed"],
    constraints: [
      "plot size",
      "ground fixing",
      "landlord or society permission",
    ],
    process: [
      "measure length and height",
      "plan neighbours and lighting",
      "fix posts",
      "hang mesh",
      "handover",
    ],
    maintenance: ["mesh wear", "post stability", "entrance wear"],
    costDrivers: [
      "lane length",
      "height",
      "posts",
      "ground type",
      "access for equipment",
    ],
    locationNote:
      "Quoted after seeing the actual ground or terrace—not from a balcony-net rate card.",
  },
  "cloth-drying-hangers": {
    serviceSlug: "cloth-drying-hangers",
    canonicalName: "Cloth Drying Hangers",
    aliases: ["ceiling cloth hangers", "pulley cloth hangers", "balcony cloth hangers"],
    cluster: "cloth-drying-hangers",
    entity: "Cloth drying hanger system",
    whatIsIt:
      "Ceiling, wall or balcony hanger systems for laundry that must share space with nets, grills and outdoor units.",
    attributes: ["mechanism", "load habit", "travel clearance", "fixing surface"],
    components: ["rails or rods", "brackets", "pulley parts where used", "anchors"],
    applications: ["apartment balconies", "utility sit-outs", "compact drying zones"],
    problems: ["limited drying space", "monsoon drying difficulty"],
    alternatives: ["floor stands", "shared drying areas where available"],
    constraints: [
      "ceiling/wall strength",
      "society drilling rules",
      "not a fall-protection product",
    ],
    process: [
      "see drying habit",
      "measure clearance with nets/grills",
      "select mechanism",
      "install",
      "handover",
    ],
    maintenance: ["smooth travel", "bracket tightness", "corrosion watch"],
    costDrivers: [
      "span",
      "mechanism type",
      "ceiling condition",
      "coordination with safety installs",
    ],
    locationNote:
      "Installed after balcony measurement; coordinates with any planned net or grill.",
  },
};

export function getServiceSemanticModel(
  serviceSlug: string,
): ServiceSemanticModel | null {
  return SERVICE_SEMANTIC_MODELS[serviceSlug] ?? null;
}
