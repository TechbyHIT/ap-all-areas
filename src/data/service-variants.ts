/**
 * Per-service angle model — the reason a service×city×area page is not a
 * name-swap doorway.
 *
 * Every service that owns a location URL has its own openings, audience,
 * risk, honest limitation, site checks and cost drivers. Two services in the
 * same locality therefore read differently because the *work* differs, not
 * because a template rotated its adjectives.
 *
 * Nothing here states a branch, a rating, a price or a project count.
 */

import { CORE_SERVICE_SLUGS } from "@/config/geo";

export type ServiceVariant = {
  slug: string;
  parentSlug: string;
  name: string;
  /** Short label for grids and breadcrumb-style link lists. */
  shortLabel: string;
  /** One line: what the visitor is actually shopping for. */
  searchIntent: string;
  /** Physical openings this service is fitted to. */
  openings: string[];
  /** Who typically raises this brief. */
  audience: string;
  /** The specific problem it addresses. */
  solves: string;
  /** What it does NOT solve — stated on the page, not hidden. */
  notSolved: string;
  /** Material / mesh / cable emphasis specific to this variant. */
  specFocus: string;
  /** What gets measured or checked before quoting. */
  siteChecks: string[];
  /** Quantity and access factors that move the price. */
  costDrivers: string[];
  /** Aftercare specific to this product. */
  maintenance: string;
  /** How coastal salt/humidity changes this particular job. */
  coastalNote: string;
  /** How inland heat, dust and terrace exposure change this job. */
  inlandNote: string;
  /** Row for the "compare the design" table. */
  comparison: { bestFor: string; look: string };
  /** Service-specific questions, phrased the way people ask them. */
  faqSeeds: Array<{ question: string; answer: string }>;
};

const VARIANTS: ServiceVariant[] = [
  // ---------------------------------------------------------------- core
  {
    slug: "invisible-grills",
    parentSlug: "invisible-grills",
    name: "Invisible Grills",
    shortLabel: "Invisible Grills",
    searchIntent:
      "a barrier at the balcony or window edge that does not block the view",
    openings: [
      "balcony railings and side returns",
      "openable windows",
      "staircase voids",
      "terrace edges",
    ],
    audience:
      "families who want fall protection but refuse a heavy iron grill across the view",
    solves:
      "a reachable gap at height, closed with tensioned stainless cable instead of welded bars",
    notSolved:
      "birds. Cable spacing is designed for people, so pigeons still pass through — that needs netting or spikes.",
    specFocus:
      "cable grade, spacing between runs, track type and the anchor the tension actually pulls against",
    siteChecks: [
      "clear opening width and height at every span",
      "existing railing height and whether it stays",
      "wall or frame substrate at each anchor point",
      "corner returns and any L-shaped section",
      "sliding-door tracks and shutter swing",
      "drilling permission and working hours",
    ],
    costDrivers: [
      "total running length across all openings",
      "cable spacing you approve",
      "number of corners and returns",
      "substrate condition at anchor points",
      "working height and access equipment",
    ],
    maintenance:
      "wipe cables during regular balcony cleaning, look at end fittings after storms, and never hang planters or laundry from the runs.",
    coastalNote:
      "Salt air attacks fasteners before it attacks cable, so end fittings and anchors deserve as much attention as the wire grade.",
    inlandNote:
      "Long sun on a west-facing span means tension shifts with heat; corner returns and end caps are where that shows up first.",
    comparison: {
      bestFor: "Modern balconies and windows that need a clear view",
      look: "Slim vertical stainless cables in fixed top and bottom channels",
    },
    faqSeeds: [
      {
        question: "Do invisible grills really stay invisible?",
        answer:
          "From inside, at normal viewing distance, the cables read as thin lines rather than a panel. Up close, in direct sun, or against a bright sky they are visible. Anyone promising a completely unseen barrier is overselling it.",
      },
      {
        question: "Will an invisible grill stop pigeons?",
        answer:
          "No. Spacing is set for human safety, which leaves far more room than a bird needs. If both fall risk and bird entry matter at the same opening, the honest answer is a combined specification, not one product doing both jobs.",
      },
    ],
  },
  {
    slug: "safety-nets",
    parentSlug: "safety-nets",
    name: "Safety Nets",
    shortLabel: "Safety Nets",
    searchIntent: "mesh across an opening that is currently unsafe or open to birds",
    openings: [
      "balcony openings",
      "utility and service balconies",
      "duct and shaft mouths",
      "terrace sides",
    ],
    audience:
      "households that need the opening closed quickly and want to know which mesh matches the reason",
    solves:
      "an open span covered edge to edge with UV-stabilised mesh sized to the actual concern",
    notSolved:
      "a weak or loose railing. Netting is an added layer; it does not repair the structure it is tied to.",
    specFocus:
      "mesh aperture, yarn thickness, border rope and how the edge is anchored along its full perimeter",
    siteChecks: [
      "span width and height including any side return",
      "whether the brief is children, pets, birds or debris",
      "fixing surface along the full perimeter",
      "AC outdoor units and planters inside the span",
      "floor drain position so debris does not collect",
      "how the balcony is used day to day",
    ],
    costDrivers: [
      "fitted area of the opening",
      "mesh specification chosen for the purpose",
      "border finishing and edge fixing method",
      "floor height and safe access",
      "number of separate openings in one visit",
    ],
    maintenance:
      "clear leaf litter and debris, check hooks and the border rope after heavy weather, and report sag early before a gap opens.",
    coastalNote:
      "Constant breeze works the edge fixings loose faster than the mesh wears out, so the perimeter is the part to inspect.",
    inlandNote:
      "Prolonged heat and dust fade and stiffen mesh; colour choice and tension matter more on an exposed top floor.",
    comparison: {
      bestFor: "Family, pet and everyday fall-risk openings",
      look: "Visible square mesh with flexible edge fixing",
    },
    faqSeeds: [
      {
        question: "How long does a balcony safety net last?",
        answer:
          "Service life depends on sun exposure, yarn specification and how well the edge is fixed — not on a brand claim. An exposed south or west balcony ages faster than a shaded utility one. Ask what the warranty actually covers and for how long, in writing.",
      },
      {
        question: "Does a safety net block air and light?",
        answer:
          "Mesh reduces both slightly. How much depends on aperture, yarn thickness and colour. If keeping the outlook matters more than cost, compare a transparent net or an invisible grill before defaulting to standard mesh.",
      },
    ],
  },
  {
    slug: "sports-nets",
    parentSlug: "sports-nets",
    name: "Sports Nets",
    shortLabel: "Sports Nets",
    searchIntent: "ball containment for a practice area, ground or terrace",
    openings: [
      "practice cages and lanes",
      "terrace practice areas",
      "school and academy grounds",
      "boundary and side screens",
    ],
    audience:
      "schools, coaching setups and households with enough ground or terrace to practise on",
    solves:
      "balls kept inside the practice area instead of reaching neighbours, glass or parked vehicles",
    notSolved:
      "balcony fall protection. Sports mesh and posts are built for impact, not for a residential railing gap.",
    specFocus:
      "impact-rated netting, post spacing, tension rope and the ground or parapet fixing that carries the load",
    siteChecks: [
      "usable length, width and required height",
      "sport and how hard the ball is struck",
      "ground type or terrace slab for post fixing",
      "wind exposure across the open span",
      "entry point and how players get in",
      "distance to windows, vehicles and neighbours",
    ],
    costDrivers: [
      "enclosed area and net height",
      "number and type of support posts",
      "ground versus parapet or wall fixing",
      "indoor versus fully exposed outdoor use",
      "entry arrangements and side screens",
    ],
    maintenance:
      "check post stability and joins each season, retension when sag appears, and never store the net wet in a compressed heap.",
    coastalNote:
      "Open coastal wind loads posts continuously, so the fixing detail matters more than the mesh specification.",
    inlandNote:
      "Hot open grounds and dust shorten rope life; joins and tie-offs are the first things to inspect.",
    comparison: {
      bestFor: "Practice areas that must contain a struck ball",
      look: "Heavy knotted mesh on posts, cables and ground anchors",
    },
    faqSeeds: [
      {
        question: "Can a balcony safety net be reused as a cricket net?",
        answer:
          "No. Balcony mesh is not built for repeated ball impact, and the fixings are designed for a static edge load. Practice netting uses different yarn, aperture and support. Reusing the wrong one fails at the tie-offs first.",
      },
      {
        question: "What height should a practice net be?",
        answer:
          "It follows the lane length, how hard the ball is struck and what sits behind the net. A short home terrace lane and a full coaching lane are different jobs. Height is confirmed after seeing the space, not quoted from a standard kit.",
      },
    ],
  },
  {
    slug: "cloth-drying-hangers",
    parentSlug: "cloth-drying-hangers",
    name: "Cloth Drying Hangers",
    shortLabel: "Cloth Hangers",
    searchIntent: "somewhere to dry laundry that does not eat the balcony floor",
    openings: [
      "balcony ceilings",
      "utility area soffits",
      "wall-mounted drying corners",
      "covered service balconies",
    ],
    audience:
      "flats where laundry currently lives on the railing and the balcony has to do several jobs at once",
    solves:
      "overhead drying capacity that clears the floor and works around nets, grills and outdoor units",
    notSolved:
      "fall protection of any kind. A hanger is a utility fitting and carries no safety role at the edge.",
    specFocus:
      "rod or rail material, bracket spacing, pulley mechanism and the ceiling fastener that carries a wet load",
    siteChecks: [
      "ceiling height and usable clear length",
      "slab or false-ceiling condition at fixing points",
      "clearance from any installed net or grill",
      "position of the outdoor AC unit",
      "typical laundry load per wash",
      "door and shutter swing under the rods",
    ],
    costDrivers: [
      "span and number of rods or rails",
      "pulley versus fixed mechanism",
      "ceiling condition and fastener type",
      "coordination with an existing net or grill",
      "finish and corrosion specification",
    ],
    maintenance:
      "stay inside the advised load, keep pulleys and cords running freely, and recheck the ceiling fasteners if the travel feels uneven.",
    coastalNote:
      "Salt-laden air pits cheap brackets and cords long before the rods fail, so fastener grade is the deciding factor.",
    inlandNote:
      "Fast summer drying means heavier daily use, so bracket spacing and cord wear matter more than the rod finish.",
    comparison: {
      bestFor: "Daily laundry in a balcony that is already busy",
      look: "Ceiling rods or a pulley rail set above the usable floor",
    },
    faqSeeds: [
      {
        question: "Can a cloth hanger be fitted after a safety net?",
        answer:
          "Usually yes, but the order matters. Fitting the hanger first often leaves the net installer with no clean line for the perimeter. If both are planned, measure them together so the rods clear the mesh and the doors still open.",
      },
      {
        question: "How much laundry can a ceiling hanger hold?",
        answer:
          "It depends on the mechanism and, more importantly, on what the ceiling can carry. A sound concrete slab and a false ceiling are not the same fixing. Load guidance is given after seeing the fixing surface.",
      },
    ],
  },

  // ------------------------------------------------- invisible grill line
  {
    slug: "balcony-invisible-grills",
    parentSlug: "invisible-grills",
    name: "Balcony Invisible Grills",
    shortLabel: "Balcony Grills",
    searchIntent: "clear-view protection specifically across a balcony railing",
    openings: [
      "main living-room balconies",
      "bedroom sit-outs",
      "L-shaped corner balconies",
      "AC ledge gaps beside the railing",
    ],
    audience:
      "apartment households whose balcony stays in daily use for seating, plants and drying",
    solves:
      "the gap above and beside an existing railing, closed without giving up the outlook",
    notSolved:
      "a railing that is already loose. The cable pulls against the structure, so weak railings get fixed first.",
    specFocus:
      "run spacing above the railing line, corner return detail and track fixing into the parapet",
    siteChecks: [
      "railing height and whether it is retained",
      "parapet width available for the bottom track",
      "corner returns on L-shaped balconies",
      "AC outdoor unit position inside the span",
      "sliding-door track clearance",
      "society rules on drilling the outer face",
    ],
    costDrivers: [
      "running length above the railing",
      "number of corner returns",
      "parapet condition at track fixing",
      "spacing you approve for the runs",
      "floor level and access",
    ],
    maintenance:
      "wipe the runs when you clean the balcony and check corner end caps after storms.",
    coastalNote:
      "Sea-facing balconies push salt straight onto the bottom track, which is where standing water and fasteners meet.",
    inlandNote:
      "A west-facing balcony bakes the bottom track all afternoon, so allow for tension movement at the returns.",
    comparison: {
      bestFor: "A balcony that must stay open, usable and clear",
      look: "Vertical cables tracking the railing line and corner returns",
    },
    faqSeeds: [
      {
        question: "Can invisible grills be fitted over an existing balcony railing?",
        answer:
          "Yes, and that is the usual case. The cables close the gap above and beside the railing rather than replacing it. The railing does have to be sound, because the bottom track is often fixed to the same parapet.",
      },
      {
        question: "What spacing is used on a balcony?",
        answer:
          "Spacing is chosen from who uses the balcony and what they can reach, then confirmed at measurement. Tighter spacing costs more running length. We show you the difference on your own opening rather than quoting one default.",
      },
    ],
  },
  {
    slug: "window-invisible-grills",
    parentSlug: "invisible-grills",
    name: "Window Invisible Grills",
    shortLabel: "Window Grills",
    searchIntent: "protection at a window opening without blocking light or air",
    openings: [
      "bedroom and hall windows",
      "kitchen ventilation openings",
      "windows above a usable ledge",
      "openable casement and sliding spans",
    ],
    audience:
      "homes where a window, not the balcony, is the reachable opening a child can get to",
    solves:
      "an openable window span closed at reach height while the shutter still works normally",
    notSolved:
      "insect entry. Cables and mosquito mesh are separate fittings competing for the same frame edge.",
    specFocus:
      "frame-fixed anchors, shutter clearance and how the runs avoid the insect screen track",
    siteChecks: [
      "frame type and material at the fixing line",
      "shutter swing or slide direction",
      "whether an insect screen is already fitted",
      "ledge below the window and whether it is climbable",
      "clear span versus fixed panel sections",
      "cleaning access from inside",
    ],
    costDrivers: [
      "number of windows in one visit",
      "span per window and total running length",
      "frame material and anchor type",
      "conflict with an existing screen or grill",
      "floor level for outside access",
    ],
    maintenance:
      "clean along the runs when you wash the glass and check anchors on the frame side once a year.",
    coastalNote:
      "Window frames on the sea side collect salt in the track, so anchors need to tolerate what sits in that channel.",
    inlandNote:
      "Dust settles in the frame track and grinds against fittings, so cleaning access is worth planning for.",
    comparison: {
      bestFor: "Windows that must keep opening normally",
      look: "Short cable runs fixed to the window frame line",
    },
    faqSeeds: [
      {
        question: "Will a window invisible grill stop the window from opening?",
        answer:
          "It should not. The runs sit clear of the shutter path, which is why swing or slide direction is checked before fixing. If a window already carries an insect screen, both fittings need planning together.",
      },
      {
        question: "Is a window grill cheaper than a balcony one?",
        answer:
          "Usually per opening, because the span is shorter. But several windows in one home can add up to more running length than a single balcony. Quotation follows total measured length, not the count of openings.",
      },
    ],
  },
  {
    slug: "invisible-grills-for-apartments",
    parentSlug: "invisible-grills",
    name: "Invisible Grills for Apartments",
    shortLabel: "Apartment Grills",
    searchIntent:
      "invisible grills that a housing society will actually permit and allow access for",
    openings: [
      "high-rise balconies",
      "neighbour-facing elevations",
      "utility balconies in flats",
      "windows on upper floors",
    ],
    audience:
      "flat owners who need the association's approval and a lift booking before anyone drills",
    solves:
      "protection planned around society permission, drilling hours and high-rise access",
    notSolved:
      "an association's decision. We can supply the specification and drawing, but permission is between you and the committee.",
    specFocus:
      "uniform external appearance, fixings that suit the building's outer face and access equipment for height",
    siteChecks: [
      "what the association permits on the outer elevation",
      "approved drilling hours and lift booking",
      "floor level and access for equipment",
      "whether neighbouring flats have a set finish",
      "wind exposure at that height",
      "common-area rules for material movement",
    ],
    costDrivers: [
      "floor level and access arrangements",
      "running length across the flat's openings",
      "any finish the association mandates",
      "restricted working hours",
      "corner returns and utility spans",
    ],
    maintenance:
      "check end fittings after cyclone-season winds and keep the association informed if the outer finish needs touch-up.",
    coastalNote:
      "Higher floors on the sea side take the harshest salt-laden wind in the building, which changes fastener choice.",
    inlandNote:
      "Upper-floor heat and dust are strongest on the exposed elevation, so the finish is judged there rather than at ground level.",
    comparison: {
      bestFor: "Flats where the committee has a say in the outer look",
      look: "A consistent cable line matching neighbouring balconies",
    },
    faqSeeds: [
      {
        question: "Does my apartment association need to approve invisible grills?",
        answer:
          "Most do, because the outer elevation is common property in practice. Ask the committee before booking a date. We can provide the specification and a simple drawing to support your request.",
      },
      {
        question: "Can you work on a high floor?",
        answer:
          "Access is confirmed at survey, not promised in advance. Height, balcony depth and whether equipment can be brought through common areas all affect whether and how the job is scheduled.",
      },
    ],
  },
  {
    slug: "invisible-grills-for-villas",
    parentSlug: "invisible-grills",
    name: "Invisible Grills for Villas",
    shortLabel: "Villa Grills",
    searchIntent: "clear-view protection for stair voids and taller villa openings",
    openings: [
      "internal staircase voids",
      "double-height atrium edges",
      "wide sit-outs and verandas",
      "first-floor terrace edges",
    ],
    audience:
      "independent-home owners with spans and voids that flats simply do not have",
    solves:
      "tall or irregular openings closed with cable runs planned around the actual structure",
    notSolved:
      "a decorative railing upgrade. This is a barrier at the gap, not a replacement for balustrade joinery.",
    siteChecks: [
      "void height and whether it is single or double storey",
      "masonry, stone cladding or metal frame at anchor points",
      "stair landing edges and changing floor levels",
      "courtyard and terrace edges in the same visit",
      "span width beyond standard balcony sizes",
      "internal versus exposed outdoor position",
    ],
    specFocus:
      "long-span tension, anchoring into cladding or masonry and how runs handle changing levels",
    costDrivers: [
      "total span across voids and terraces",
      "anchor difficulty in stone or clad surfaces",
      "height needing access equipment",
      "number of separate openings in one property",
      "internal finish expectations",
    ],
    maintenance:
      "check internal void anchors annually and wipe outdoor runs after dusty or salty spells.",
    coastalNote:
      "Outdoor villa spans face the weather on more sides than a flat balcony, so exposed anchors get specified up.",
    inlandNote:
      "Courtyards and terraces on independent homes see the full day's sun, so long spans are planned for movement.",
    comparison: {
      bestFor: "Stair voids, atriums and wide independent-home spans",
      look: "Long cable runs following the structure rather than a railing",
    },
    faqSeeds: [
      {
        question: "Can invisible grills cover an internal staircase void?",
        answer:
          "Yes, and it is one of the more common villa requests. The anchor points depend on what the void is built from, so masonry, cladding and metal frames are checked before any span is committed.",
      },
      {
        question: "Are villa jobs quoted differently from apartments?",
        answer:
          "The measuring logic is the same — running length, anchors and access — but villas usually have more openings of different shapes in one visit. That is why the survey covers the whole property rather than a single balcony.",
      },
    ],
  },

  // ------------------------------------------------------ safety net line
  {
    slug: "balcony-safety-nets",
    parentSlug: "safety-nets",
    name: "Balcony Safety Nets",
    shortLabel: "Balcony Nets",
    searchIntent: "mesh across the balcony opening, fitted to the railing line",
    openings: [
      "main balcony openings",
      "side returns beside the railing",
      "utility balconies used for drying",
      "gaps above a low parapet",
    ],
    audience:
      "households wanting the balcony closed quickly while it stays usable for daily life",
    solves:
      "the full balcony opening covered edge to edge, with mesh matched to the actual reason",
    notSolved:
      "one net doing every job. Child, pet and bird briefs use different aperture and strength.",
    specFocus:
      "aperture chosen for the purpose, border rope along the perimeter and tension across the span",
    siteChecks: [
      "clear opening width and height",
      "which concern leads: children, pets or birds",
      "perimeter fixing surface on all four sides",
      "planters, AC units and furniture inside the span",
      "floor drain so debris does not pile up",
      "how the balcony is used every day",
    ],
    costDrivers: [
      "fitted area of the opening",
      "mesh chosen for the stated purpose",
      "border and edge fixing method",
      "floor height and access",
      "how many balconies in one visit",
    ],
    maintenance:
      "sweep debris off the lower edge, check the border rope after storms and report sag before it becomes a gap.",
    coastalNote:
      "Sea breeze works the perimeter fixings continuously, so the edge — not the middle — is what ages.",
    inlandNote:
      "Sun on an exposed balcony fades and stiffens mesh, so colour and tension choices matter more here.",
    comparison: {
      bestFor: "Everyday balcony use with children, pets or bird pressure",
      look: "Square mesh spanning the full opening with a roped edge",
    },
    faqSeeds: [
      {
        question: "Can one balcony net handle children and pigeons together?",
        answer:
          "Sometimes, but not always well. A child-safety aperture is often larger than what reliably stops a determined pigeon. Where both matter, we say so and quote the specification that genuinely covers both rather than pretending one mesh does everything.",
      },
      {
        question: "Will the net stop us using the balcony?",
        answer:
          "It should not. Drying, plants and seating are exactly what we ask about at survey, because the answer changes where the perimeter is fixed and how the lower edge is finished.",
      },
    ],
  },
  {
    slug: "children-safety-nets",
    parentSlug: "safety-nets",
    name: "Children Safety Nets",
    shortLabel: "Child Safety Nets",
    searchIntent: "a net specifically sized so a small child cannot get through",
    openings: [
      "play-facing balconies",
      "windows a child can reach",
      "staircase side gaps",
      "internal void edges",
    ],
    audience: "parents of toddlers and young children in upper-floor homes",
    solves:
      "reach-height coverage with an aperture small enough that a child cannot pass or wedge through",
    notSolved:
      "climbing. A net does not stop a child dragging a chair or using an AC unit as a step, and it never replaces supervision.",
    specFocus:
      "smaller aperture, higher strength yarn and continuous coverage with no gap at the corners",
    siteChecks: [
      "child's reach height and age",
      "anything climbable near the opening",
      "aperture needed for that age",
      "corner and side-return gaps",
      "railing gaps below the main span",
      "whether a grill suits the opening better",
    ],
    costDrivers: [
      "fitted area at the opening",
      "tighter aperture and stronger yarn",
      "continuous coverage around returns",
      "number of openings a child can reach",
      "floor height and access",
    ],
    maintenance:
      "check the lower edge and corners monthly, because that is where a gap opens first, and retension at any sag.",
    coastalNote:
      "Constant breeze pushes at the lower edge, which is exactly the part that matters most on a child-safety brief.",
    inlandNote:
      "Heat stiffens mesh over time; on a child-safety net the corners are the first place to inspect for that.",
    comparison: {
      bestFor: "Homes with toddlers using or passing an open edge",
      look: "Tighter square mesh, fully closed at corners and returns",
    },
    faqSeeds: [
      {
        question: "What mesh size is right for a child safety net?",
        answer:
          "It follows the child's age and reach rather than one standard number. The point is that a head or limb cannot pass or wedge. We confirm the aperture against your opening at survey and explain the trade-off in visibility.",
      },
      {
        question: "Is a net or an invisible grill better for child safety?",
        answer:
          "Both work when specified properly. A net covers a wide span cheaply and quickly; a grill keeps the view clearer and resists climbing better. If the balcony has furniture or an AC unit a child can climb, we will usually say so.",
      },
    ],
  },
  {
    slug: "pet-safety-nets",
    parentSlug: "safety-nets",
    name: "Pet Safety Nets",
    shortLabel: "Pet Safety Nets",
    searchIntent: "netting that a cat or dog cannot push, climb or chew through",
    openings: [
      "balcony edges cats sit on",
      "side gaps beside planters",
      "utility ledges",
      "window openings pets reach",
    ],
    audience: "cat and dog owners whose animal tests the balcony boundary daily",
    solves:
      "a boundary at the balcony edge built for an animal that pushes, claws and climbs at it",
    notSolved:
      "behaviour. A determined animal will keep testing the mesh, so material choice matters more than on a child brief.",
    specFocus:
      "claw- and chew-resistant yarn, tighter edge fixing and coverage of the gaps pets actually squeeze through",
    siteChecks: [
      "species, size and whether the animal climbs",
      "gaps beside planters and furniture",
      "railing gaps at floor level",
      "surfaces the pet uses to reach height",
      "whether the animal is left alone on the balcony",
      "how the mesh will be cleaned",
    ],
    costDrivers: [
      "fitted area at the opening",
      "stronger claw-resistant specification",
      "closing low-level and planter gaps",
      "number of openings the pet reaches",
      "access and floor height",
    ],
    maintenance:
      "inspect where the animal habitually pushes, look for pulled strands at claw height and retie the edge early.",
    coastalNote:
      "Salt plus repeated clawing wears the edge fixing faster, so the tie-off points are the ones to check.",
    inlandNote:
      "Sun-stiffened mesh tears more easily where a pet works at it daily, so the favoured corner is the weak point.",
    comparison: {
      bestFor: "Cats and dogs that use the balcony unsupervised",
      look: "Stronger square mesh closed right down to floor level",
    },
    faqSeeds: [
      {
        question: "Can a cat get through a normal balcony net?",
        answer:
          "A cat can work at mesh in a way a child does not — claws, weight and patience. That is why pet briefs use a different specification and why the low-level gaps beside planters get closed rather than ignored.",
      },
      {
        question: "Will my pet damage the net?",
        answer:
          "Possibly, over time, at the spot it favours. We would rather tell you where to check than claim the mesh is chew-proof. Early retying at that spot is what keeps the boundary intact.",
      },
    ],
  },
  {
    slug: "pigeon-safety-nets",
    parentSlug: "safety-nets",
    name: "Pigeon Safety Nets",
    shortLabel: "Pigeon Nets",
    searchIntent: "stopping pigeons roosting and dropping mess on a balcony or ledge",
    openings: [
      "unused and utility balconies",
      "AC outdoor unit trays",
      "window ledges and chajjas",
      "duct and shaft mouths",
    ],
    audience:
      "residents dealing with droppings, nesting material and the cleaning that follows",
    solves:
      "the landing and nesting points closed off so the space becomes usable and cleanable again",
    notSolved:
      "birds in the neighbourhood. Netting redirects them off your opening; it does not clear the building or the street.",
    specFocus:
      "fine aperture that a pigeon cannot pass, colour chosen to disappear against the facade, and a fully sealed perimeter",
    siteChecks: [
      "where birds actually land and nest today",
      "AC trays, ledges and pipe runs inside the span",
      "existing droppings needing clearance first",
      "gaps at the top corner where birds re-enter",
      "access for cleaning behind the mesh",
      "whether spikes suit a narrow ledge better",
    ],
    costDrivers: [
      "fitted area across the opening",
      "fine bird-grade aperture",
      "sealing every re-entry gap",
      "height and access to ledges or shafts",
      "clearance work before fitting",
    ],
    maintenance:
      "check the top corners each season, since one loose corner is all a pigeon needs to get back in.",
    coastalNote:
      "Salt and damp accelerate droppings staining the facade, so sealing the perimeter properly saves repainting later.",
    inlandNote:
      "Dry dusty conditions make nesting material build up faster behind mesh, so leave a cleaning route.",
    comparison: {
      bestFor: "Balconies, ledges and shafts with repeat bird entry",
      look: "Fine full-opening mesh sealed at every edge and corner",
    },
    faqSeeds: [
      {
        question: "Will pigeon netting get rid of the birds completely?",
        answer:
          "It closes your opening, which is what you control. The birds move to another perch nearby. Anyone claiming to clear pigeons from a whole building with one balcony net is not describing how this works.",
      },
      {
        question: "Should I clean the droppings before installation?",
        answer:
          "Yes, and it is worth doing properly. Fitting mesh over an active nesting spot traps the mess behind it and makes future cleaning harder. We will flag this at survey rather than net over it.",
      },
    ],
  },
  {
    slug: "balcony-pigeon-nets",
    parentSlug: "safety-nets",
    name: "Balcony Pigeon Nets",
    shortLabel: "Balcony Pigeon Nets",
    searchIntent: "closing a whole balcony that pigeons have taken over",
    openings: [
      "unused balconies birds have claimed",
      "sit-outs with railing droppings",
      "planter shelves birds nest in",
      "balconies with AC units inside the span",
    ],
    audience:
      "households who have stopped using a balcony because of the mess on it",
    solves:
      "the full balcony volume closed so railings, pots and floor stay clean enough to use again",
    notSolved:
      "fall protection. The aperture is set for birds, and the yarn is not specified for a child or pet load.",
    specFocus:
      "full-volume coverage including the top corner, with the door line kept usable and the drain kept clear",
    siteChecks: [
      "which surfaces birds currently land on",
      "door and shutter line that must stay usable",
      "AC unit and pipe penetrations through the span",
      "floor drain and where debris will settle",
      "neighbour wall junctions where gaps appear",
      "how the balcony will be used afterwards",
    ],
    costDrivers: [
      "fitted area of the balcony opening",
      "sealing around AC units and pipes",
      "keeping a usable access panel",
      "floor height and safe access",
      "pre-installation clearance",
    ],
    maintenance:
      "brush debris off the lower edge and check the junction against the neighbour's wall each season.",
    coastalNote:
      "Damp coastal air keeps droppings sticky and staining, so the sooner the perimeter is sealed the less facade damage.",
    inlandNote:
      "Dry nesting material accumulates fast against the lower edge, so plan how you will sweep behind the mesh.",
    comparison: {
      bestFor: "A whole balcony lost to roosting and droppings",
      look: "Fine mesh across the full balcony volume, door line clear",
    },
    faqSeeds: [
      {
        question: "Can I still dry clothes on a netted balcony?",
        answer:
          "Yes, and that is worth saying at survey. Where drying continues, the access panel and the hanger position get planned into the same layout instead of being cut in afterwards.",
      },
      {
        question: "Do pigeons come back after netting?",
        answer:
          "Not through a properly sealed opening. They come back through the gap that was missed — usually a top corner or the junction with a neighbour's wall. That is the part worth inspecting each season.",
      },
    ],
  },
  {
    slug: "window-pigeon-nets",
    parentSlug: "safety-nets",
    name: "Window Pigeon Nets",
    shortLabel: "Window Pigeon Nets",
    searchIntent: "stopping birds on a window ledge without netting the whole balcony",
    openings: [
      "bedroom and kitchen window ledges",
      "chajjas above windows",
      "narrow sills birds perch on",
      "AC brackets beside a window",
    ],
    audience:
      "residents whose bird problem is one ledge outside one window, not the whole flat",
    solves:
      "a compact ledge or chajja closed off without committing to a full balcony installation",
    notSolved:
      "the rest of the building. Closing one ledge often moves the birds to the next one along.",
    specFocus:
      "small-span mesh that works around the frame, existing grill and insect screen already at that edge",
    siteChecks: [
      "ledge or chajja depth birds sit on",
      "window frame and any existing grill",
      "insect screen already fitted",
      "opening direction of the shutter",
      "cleaning access from inside",
      "whether spikes would suit better",
    ],
    costDrivers: [
      "span of the ledge or chajja",
      "working around existing fittings",
      "floor level and outside access",
      "number of windows in one visit",
      "minimum job charge on a small span",
    ],
    maintenance:
      "check the frame-side fixing each season and clear anything that collects on the ledge behind the mesh.",
    coastalNote:
      "Salt collects in the window track and around small fixings, so the anchors are specified for that channel.",
    inlandNote:
      "Dust on a narrow ledge builds up behind mesh quickly, so cleaning access is part of the design.",
    comparison: {
      bestFor: "One window ledge, not the whole balcony",
      look: "A compact mesh panel fitted to the frame or chajja line",
    },
    faqSeeds: [
      {
        question: "Are bird spikes better than a window net?",
        answer:
          "On a narrow ledge where birds only perch, spikes are often the neater answer. Where birds nest in a recess or behind an AC bracket, mesh closes the space properly. We will say which one the ledge actually calls for.",
      },
      {
        question: "Is there a minimum charge for one window?",
        answer:
          "Usually yes, because a visit, measurement and fitting cost the same whether the span is small or large. Doing several windows in one visit is what brings the per-window figure down.",
      },
    ],
  },
  {
    slug: "duct-area-pigeon-nets",
    parentSlug: "safety-nets",
    name: "Duct Area Pigeon Nets",
    shortLabel: "Duct Nets",
    searchIntent: "closing a building shaft or duct that birds are nesting in",
    openings: [
      "kitchen and toilet shaft mouths",
      "ventilation and service ducts",
      "light wells between blocks",
      "utility voids behind service balconies",
    ],
    audience:
      "flat owners and associations dealing with birds and smell coming from a shared shaft",
    solves:
      "the shaft mouth closed so birds stop nesting in a space nobody can easily reach",
    notSolved:
      "airflow problems or existing debris in the shaft. Netting a blocked duct traps the problem inside it.",
    specFocus:
      "mesh that survives grease and damp, fixed so maintenance hatches and airflow are not sealed shut",
    siteChecks: [
      "shaft mouth dimensions and shape",
      "airflow the duct must keep",
      "grease and damp levels at kitchen shafts",
      "existing debris or nests inside",
      "maintenance hatch access to retain",
      "whether the shaft is shared common property",
    ],
    costDrivers: [
      "shaft opening area and shape",
      "height and rope or scaffold access",
      "clearing debris before fitting",
      "keeping a maintenance opening",
      "association approval for shared shafts",
    ],
    maintenance:
      "inspect the mesh at the greasy side of a kitchen shaft yearly and keep the maintenance hatch usable.",
    coastalNote:
      "Damp shafts on the coast corrode fixings faster than an open balcony ever will, so hardware is specified up.",
    inlandNote:
      "Dry shafts fill with dust and nesting debris, so a cleanable detail matters more than the finish.",
    comparison: {
      bestFor: "Shafts and service voids nobody can easily reach",
      look: "Mesh across the shaft mouth with a retained access hatch",
    },
    faqSeeds: [
      {
        question: "Who approves netting a shared duct?",
        answer:
          "Usually the association, because the shaft serves more than one flat. Access is often from a service balcony or by rope, so approval and scheduling matter as much as the mesh specification.",
      },
      {
        question: "Will netting the duct block ventilation?",
        answer:
          "It should not, and that is exactly what gets checked first. Mesh aperture is chosen so air still moves. If the shaft is already blocked with debris, netting over it makes the problem worse, so clearance comes first.",
      },
    ],
  },
  {
    slug: "terrace-safety-nets",
    parentSlug: "safety-nets",
    name: "Terrace Safety Nets",
    shortLabel: "Terrace Nets",
    searchIntent: "making an open roof terrace safe to use",
    openings: [
      "open terrace edges above a low parapet",
      "stair bulkhead surrounds",
      "water tank platform edges",
      "light wells opening onto the roof",
    ],
    audience:
      "households using the roof for play, plants or evening sitting where the parapet is too low",
    solves:
      "the gap above a low parapet closed across long open runs on an exposed roof",
    notSolved:
      "waterproofing or parapet repair. Fixing into a failing parapet is not a safety upgrade.",
    specFocus:
      "wind-rated mesh and tension, with post or parapet fixing that suits a fully exposed roof",
    siteChecks: [
      "parapet height against intended use",
      "total run length around the terrace",
      "parapet condition at every fixing point",
      "water tank and bulkhead obstructions",
      "wind exposure across an open roof",
      "whether children will use it unsupervised",
    ],
    costDrivers: [
      "total perimeter length",
      "height needed above the parapet",
      "parapet condition and fixing method",
      "wind exposure driving specification",
      "obstructions to work around",
    ],
    maintenance:
      "retension after cyclone-season winds and check fixings where the parapet takes standing water.",
    coastalNote:
      "An exposed roof takes the strongest wind on the whole building, so terrace fixings are specified above balcony level.",
    inlandNote:
      "Roof slabs get extremely hot, so material choice and tension allowance matter more than on a shaded balcony.",
    comparison: {
      bestFor: "Open roofs used for play, plants or sitting",
      look: "Long mesh runs raised above a low parapet line",
    },
    faqSeeds: [
      {
        question: "How high should a terrace net go above the parapet?",
        answer:
          "It depends on the parapet height you already have and who uses the roof. A low parapet with children playing needs more than a chest-height one used only for plants. Height is set at survey against that use.",
      },
      {
        question: "Can a terrace net handle cyclone-season wind?",
        answer:
          "It is specified with that in mind, which is why an open roof gets a stronger detail than a sheltered balcony. Retensioning after severe wind is still part of normal aftercare, and we say so upfront.",
      },
    ],
  },
  {
    slug: "cricket-practice-nets",
    parentSlug: "sports-nets",
    name: "Cricket Practice Nets",
    shortLabel: "Cricket Nets",
    searchIntent: "a practice lane or cage that keeps the ball in",
    openings: [
      "practice lanes and cages",
      "terrace practice areas",
      "school and coaching grounds",
      "side and rear containment screens",
    ],
    audience:
      "coaching setups, schools and households with enough length to practise properly",
    solves:
      "a bowling lane enclosed so the struck ball stays inside instead of finding a window",
    notSolved:
      "a short run-up. Netting cannot create length the ground does not have, and we will say when a space is too small.",
    specFocus:
      "impact-rated knotted mesh, post spacing along the lane and tension that survives repeated strikes",
    siteChecks: [
      "usable bowling length and lane width",
      "required height over the striker",
      "ground type or terrace slab for posts",
      "wind across the open lane",
      "how many batters share the lane",
      "distance to glass, vehicles and neighbours",
    ],
    costDrivers: [
      "lane length, width and height",
      "number of posts and their fixing",
      "indoor versus fully exposed outdoor",
      "side and rear screen extent",
      "entry arrangement for players",
    ],
    maintenance:
      "check post bases and joins each season, retension at sag, and dry the net before storing it.",
    coastalNote:
      "Steady coastal wind loads the lane sideways all day, so post fixing carries more of the design than the mesh does.",
    inlandNote:
      "Hot open grounds harden ropes and tie-offs, so the joins are what to inspect before a new season.",
    comparison: {
      bestFor: "Regular batting and bowling practice",
      look: "Knotted impact mesh on posts, enclosing a lane",
    },
    faqSeeds: [
      {
        question: "How much space is needed for a practice net?",
        answer:
          "Enough bowling length to be worth using, plus room behind the striker and clearance at the sides. If the space is genuinely too short we will tell you rather than sell a lane nobody enjoys batting in.",
      },
      {
        question: "Can a cricket net go on a terrace?",
        answer:
          "Often yes, but the slab, parapet and wind exposure decide the fixing method, and the neighbours decide the height. Terrace lanes are surveyed differently from ground-level cages.",
      },
    ],
  },
  {
    slug: "balcony-cloth-hangers",
    parentSlug: "cloth-drying-hangers",
    name: "Balcony Cloth Hangers",
    shortLabel: "Balcony Hangers",
    searchIntent: "a drying rack for a balcony that already has a net or grill",
    openings: [
      "balcony ceilings above the usable floor",
      "covered utility balcony soffits",
      "wall corners beside the drying zone",
      "service balconies behind the kitchen",
    ],
    audience:
      "flats where the balcony is already carrying a net, a grill and an outdoor unit",
    solves:
      "drying capacity fitted into the space left over once safety work and the AC unit are in place",
    notSolved:
      "a shortage of ceiling. Where the slab or clearance is not there, more rods will not help.",
    specFocus:
      "rod length and bracket position planned around the installed mesh, cables and outdoor unit",
    siteChecks: [
      "clear ceiling length after the net or grill",
      "slab versus false ceiling at fixing points",
      "outdoor AC unit position and drip line",
      "door and shutter swing beneath the rods",
      "how much laundry is dried per wash",
      "neighbour sightlines from the balcony",
    ],
    costDrivers: [
      "usable span after existing fittings",
      "number of rods and the mechanism",
      "ceiling condition and fastener type",
      "coordination with a planned net or grill",
      "corrosion specification for an open balcony",
    ],
    maintenance:
      "keep the pulley cords running freely, stay inside the load guidance and recheck brackets if travel gets uneven.",
    coastalNote:
      "An open coastal balcony pits cords and brackets first, so those are the parts specified for the exposure.",
    inlandNote:
      "Fast drying in summer means heavier daily cycling, so cord wear shows up sooner than rod wear.",
    comparison: {
      bestFor: "A balcony already carrying safety work",
      look: "Ceiling rods set to clear the mesh and the AC unit",
    },
    faqSeeds: [
      {
        question: "Can a hanger be fitted on a balcony that already has a net?",
        answer:
          "Usually yes. The rods are set to clear the mesh line and the outdoor unit, which is why the clear ceiling length is measured after the net rather than before it.",
      },
      {
        question: "Should the hanger or the safety net go in first?",
        answer:
          "The net or grill usually goes first, because it needs a clean perimeter line. If both are planned together we measure them in one visit so neither fitting compromises the other.",
      },
    ],
  },
];

export const SERVICE_VARIANTS: ServiceVariant[] = VARIANTS;

export const SERVICE_VARIANT_MAP: Record<string, ServiceVariant> =
  Object.fromEntries(VARIANTS.map((variant) => [variant.slug, variant]));

/** Every service slug that owns city and area URLs. */
export const LOCATION_SERVICE_SLUGS: string[] = VARIANTS.map((v) => v.slug);

export function getServiceVariant(slug: string): ServiceVariant | null {
  return SERVICE_VARIANT_MAP[slug] ?? null;
}

export function isCoreVariant(slug: string): boolean {
  return (CORE_SERVICE_SLUGS as readonly string[]).includes(slug);
}

/** Sibling variants under the same parent service. */
export function listVariantsForParent(parentSlug: string): ServiceVariant[] {
  return VARIANTS.filter(
    (variant) => variant.parentSlug === parentSlug && variant.slug !== parentSlug,
  );
}

/** Variants grouped by parent — used for menu-complete link blocks. */
export function listVariantGroups(): Array<{
  parentSlug: string;
  parentName: string;
  variants: ServiceVariant[];
}> {
  return VARIANTS.filter((variant) => isCoreVariant(variant.slug)).map((core) => ({
    parentSlug: core.slug,
    parentName: core.name,
    variants: listVariantsForParent(core.slug),
  }));
}
