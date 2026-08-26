/**
 * First-class sub-service hubs under /services/{slug}/.
 * Copy is specific to the opening type; materials and process inherit the parent.
 */

export type SubService = {
  slug: string;
  parentSlug: string;
  name: string;
  summary: string;
  h1: string;
  intro: string;
};

export const SUB_SERVICES: SubService[] = [
  {
    slug: "balcony-invisible-grills",
    parentSlug: "invisible-grills",
    name: "Balcony Invisible Grills",
    summary:
      "Stainless-steel wire systems planned for balcony railings, side returns and AC ledges across Andhra Pradesh homes.",
    h1: "Invisible Grills for Balconies",
    intro:
      "Balcony invisible grills are planned around railing height, corner returns, sliding-door tracks and how the family actually uses the sit-out. In Andhra Pradesh apartments the usual need is a clear view with a continuous barrier at reachable gaps—not a decorative cage. We measure each opening, note wind and sun exposure, and quote after seeing access for drilling and finishing. Spacing and wire grade are selected for the balcony, not copied from a window job.",
  },
  {
    slug: "window-invisible-grills",
    parentSlug: "invisible-grills",
    name: "Window Invisible Grills",
    summary:
      "Window-span invisible grills for ventilation openings where a lighter look is preferred over heavy bars.",
    h1: "Invisible Grills for Windows",
    intro:
      "Window invisible grills cover openable spans used for air and light. The layout follows frame type, shutter swing and whether the window sits above a usable ledge. Coastal and dusty sites need honest talk about cleaning and hardware. We do not treat a window as a small balcony: anchor points, mesh of wires and insect-screen conflicts are checked on site before installation.",
  },
  {
    slug: "invisible-grills-for-apartments",
    parentSlug: "invisible-grills",
    name: "Invisible Grills for Apartments",
    summary:
      "Apartment-focused invisible grill planning that respects society rules, drilling hours and high-rise access.",
    h1: "Invisible Grills for Apartments",
    intro:
      "Apartment invisible grills are scheduled around society permissions, lift booking and neighbour-facing elevations. High-rise openings need extra attention to access equipment and wind. We confirm what the association allows on the outer face, then measure balconies and windows that the household actually uses. This page is about flat living in Andhra Pradesh—not villa stair voids or farmhouses.",
  },
  {
    slug: "invisible-grills-for-villas",
    parentSlug: "invisible-grills",
    name: "Invisible Grills for Villas",
    summary:
      "Villa and independent-home invisible grills for stair voids, sit-outs and taller openings.",
    h1: "Invisible Grills for Villas",
    intro:
      "Villa invisible grills often cover stair sides, double-height voids and wider sit-outs that apartments rarely have. Anchoring depends on masonry, stone cladding or metal frames already on site. Independent homes in Andhra Pradesh also mix courtyard and terrace edges. We plan each span after seeing structure—not from a flat-balcony template.",
  },
  {
    slug: "balcony-safety-nets",
    parentSlug: "safety-nets",
    name: "Balcony Safety Nets",
    summary:
      "Balcony netting planned for fall protection, bird control and utility use on Andhra Pradesh flats and villas.",
    h1: "Balcony Safety Nets",
    intro:
      "Balcony safety nets are specified for railing gaps, side returns and how the sit-out is used for drying, plants or seating. Mesh size and tension depend on whether the brief is children, pets, pigeons or a mix. We measure after seeing the opening—not from a city-wide rate card. This page is the service explanation; city pages cover local building patterns.",
  },
  {
    slug: "children-safety-nets",
    parentSlug: "safety-nets",
    name: "Children Safety Nets",
    summary:
      "Balcony and void netting planned for child reach, mesh size and how the opening is used day to day.",
    h1: "Children Safety Nets",
    intro:
      "Children safety nets are specified for reach height, mesh aperture and continuous coverage at play-facing balconies. They are not a promise that a child cannot climb furniture nearby. We look at railing gaps, AC outdoor units used as steps, and whether a net or an invisible grill better fits the opening. Quotation follows measurement, not a generic ‘kids net’ price list.",
  },
  {
    slug: "pet-safety-nets",
    parentSlug: "safety-nets",
    name: "Pet Safety Nets",
    summary:
      "Netting planned for cats and dogs that test balcony edges, side gaps and utility ledges.",
    h1: "Pet Safety Nets",
    intro:
      "Pet safety nets focus on side returns, planter gaps and the way cats or dogs push at mesh. Clawing and chewing affect material choice. We still confirm building access and neighbour-facing elevations. This is a service-area installation after site review—not a veterinary or behaviour guarantee.",
  },
  {
    slug: "pigeon-safety-nets",
    parentSlug: "safety-nets",
    name: "Pigeon Safety Nets",
    summary:
      "Bird-control netting for ledges, ducts and sit-outs where pigeons roost in Andhra Pradesh buildings.",
    h1: "Pigeon Nets for Balconies, Windows and Ducts",
    intro:
      "Pigeon nets close the landing spots birds actually use: AC trays, duct mouths, unused balconies and window ledges. Mesh and colour are chosen for the opening, not for decoration. We do not claim to eliminate every bird in a neighbourhood. After photos and a site look we explain whether netting, a grill, or both is the honest fit.",
  },
  {
    slug: "balcony-pigeon-nets",
    parentSlug: "safety-nets",
    name: "Balcony Pigeon Nets",
    summary:
      "Netting for balconies used as roosts or drop zones, planned around railings and outdoor units.",
    h1: "Balcony Pigeon Nets",
    intro:
      "Balcony pigeon nets cover the sit-out volume where birds land on rails, pots and AC units. The install has to leave doors usable and not trap debris against the floor drain. We measure the rectangle, note neighbour walls, and quote after seeing how the balcony is used for drying clothes or seating.",
  },
  {
    slug: "window-pigeon-nets",
    parentSlug: "safety-nets",
    name: "Window Pigeon Nets",
    summary:
      "Compact bird nets for window ledges and chajjas without treating the whole balcony.",
    h1: "Window Pigeon Nets",
    intro:
      "Window pigeon nets are for ledges and chajjas where birds sit outside a bedroom or kitchen window. The span is smaller than a balcony but frames, grills and insect screens compete for the same edge. We check opening direction and cleaning access before fixing mesh.",
  },
  {
    slug: "duct-area-pigeon-nets",
    parentSlug: "safety-nets",
    name: "Duct Area Pigeon Nets",
    summary:
      "Duct and shaft netting where pigeons enter service voids in apartment buildings.",
    h1: "Duct Area Pigeon Nets",
    intro:
      "Duct-area pigeon nets close kitchen and toilet shaft mouths that birds use as roosts. Access is often from a service balcony or by rope/scaffold, so quotation depends on height and society rules. We do not treat a duct as a living-room balcony: airflow, grease and maintenance hatches matter.",
  },
  {
    slug: "terrace-safety-nets",
    parentSlug: "safety-nets",
    name: "Terrace Safety Nets",
    summary:
      "Open-terrace edge and void netting planned around parapets and how the terrace is used.",
    h1: "Terrace Safety Nets",
    intro:
      "Terrace safety nets are for open roofs used for play, plants or evening sitting. Parapet height, water tanks and stair bulkheads change the layout. Wind on Andhra Pradesh terraces is a real factor. We measure after seeing the terrace—not from a balcony-net drawing.",
  },
  {
    slug: "cricket-practice-nets",
    parentSlug: "sports-nets",
    name: "Cricket Practice Nets",
    summary:
      "Practice cages and boundary nets for cricket, sized to the plot and bowling length you actually use.",
    h1: "Cricket Practice Nets",
    intro:
      "Cricket practice nets are sized to bowling length, side fencing and whether the cage is indoor or open. Sports-net yarn, mesh and posts differ from balcony safety mesh. We plan around nearby houses, lighting and how many batters share the lane. Installation still depends on ground fixing and local access.",
  },
  {
    slug: "balcony-cloth-hangers",
    parentSlug: "cloth-drying-hangers",
    name: "Balcony Cloth Hangers",
    summary:
      "Ceiling and wall hangers planned for balcony drying without blocking doors or nets.",
    h1: "Balcony Cloth Drying Hangers",
    intro:
      "Balcony cloth hangers have to share space with safety nets, invisible grills and outdoor units. Pulley height, drip and neighbour sightlines are part of the brief. We measure the ceiling or wall after seeing how clothes are dried today. This is a utility install, quoted after site confirmation.",
  },
];

export const SUB_SERVICE_SLUGS = SUB_SERVICES.map((s) => s.slug);

export const SUB_SERVICE_MAP: Record<string, SubService> = Object.fromEntries(
  SUB_SERVICES.map((s) => [s.slug, s]),
);
