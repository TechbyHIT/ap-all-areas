import type { Service, SubService } from "@/types/service";

const TIMESTAMP = "2026-08-04T00:00:00.000Z";
const CATEGORY_PRIMARY = "primary-services";

function createSubService(
  parentServiceSlug: string,
  slug: string,
  name: string,
  shortName: string,
  content: Omit<
    SubService,
    "id" | "slug" | "name" | "shortName" | "parentServiceSlug"
  >,
): SubService {
  return {
    id: `sub-${slug}`,
    slug,
    name,
    shortName,
    parentServiceSlug,
    ...content,
  };
}

const INVISIBLE_GRILL_SUB_SERVICES: SubService[] = [
  createSubService(
    "invisible-grills",
    "balcony-invisible-grills",
    "Balcony Invisible Grills",
    "Balcony Grills",
    {
      summary:
        "Balcony invisible grills provide discreet fall protection while keeping your view largely open.",
      introduction:
        "Balcony invisible grills are ideal for flats and villas where families want safety without bulky traditional grills. We measure balcony width, parapet height and railing condition before recommending cable spacing and anchor points suited to daily use and local weather.",
      benefits: [
        "Improves child and pet safety at balcony edges",
        "Maintains openness compared with heavy grill panels",
        "Suitable for modern apartment balconies",
        "Neat finish for visible living spaces",
      ],
      features: [
        "Stainless steel cables or rods with secure anchors",
        "Custom spacing based on safety requirement",
        "Corner and end-cap finishing",
        "Options for straight and L-shaped balconies",
      ],
      applications: [
        "Flat balconies in gated communities",
        "Villa first-floor and upper balconies",
        "Utility balconies connected to kitchen or bedroom",
      ],
      materials: ["304-grade stainless steel", "Rust-resistant anchors and fasteners"],
      primaryKeywords: ["balcony invisible grills", "balcony safety grills"],
      secondaryKeywords: ["apartment balcony invisible grill", "balcony child safety grill"],
      customerProblems: ["child-balcony-safety", "pet-balcony-safety"],
    },
  ),
  createSubService(
    "invisible-grills",
    "window-invisible-grills",
    "Window Invisible Grills",
    "Window Grills",
    {
      summary:
        "Window invisible grills protect open windows while allowing ventilation and natural light.",
      introduction:
        "Window invisible grills are commonly installed at bedrooms, hall windows and utility openings where children or pets may reach the edge. Fixing depends on frame type, width and wall condition, so we inspect each window separately before final quotation.",
      benefits: [
        "Adds safety to open windows at accessible height",
        "Less visual bulk than conventional window grills",
        "Useful for flats with limited external space",
        "Can be planned room by room based on priority",
      ],
      features: [
        "Sized to window opening and frame condition",
        "Close spacing options for child safety",
        "Clean alignment with existing window lines",
        "Durable outdoor-grade components",
      ],
      applications: [
        "Bedroom and hall windows in apartments",
        "Villa windows overlooking open areas",
        "High-rise windows with ventilation need",
      ],
      materials: ["Stainless steel cables or rods", "Weather-resistant fixing hardware"],
      primaryKeywords: ["window invisible grills", "window safety grills"],
      secondaryKeywords: ["flat window invisible grill", "child safe window grill"],
      customerProblems: ["open-window-risk", "child-balcony-safety"],
    },
  ),
  createSubService(
    "invisible-grills",
    "staircase-invisible-grills",
    "Staircase Invisible Grills",
    "Staircase Grills",
    {
      summary:
        "Staircase invisible grills secure open stair sides and landings in duplex homes and villas.",
      introduction:
        "Staircase invisible grills are used where decorative railings have wide gaps or open sides along the flight. Each staircase is measured for tread width, landing turns and height so the installation follows the contour safely and neatly.",
      benefits: [
        "Reduces fall risk along open staircase sides",
        "Maintains visibility for supervision",
        "Suitable for indoor and outdoor staircases",
        "Custom fit for landing and turn sections",
      ],
      features: [
        "Section-wise measurement for flights and landings",
        "Secure fixing to railing or wall surface",
        "Spacing planned for child safety",
        "Finish aligned to interior or exterior setting",
      ],
      applications: [
        "Duplex villa staircases",
        "Indoor stairwells with open sides",
        "Outdoor service staircase areas",
      ],
      materials: ["Stainless steel components", "Strong anchors for vibration-prone areas"],
      primaryKeywords: ["staircase invisible grills", "staircase safety grills"],
      secondaryKeywords: ["duplex staircase grill", "villa staircase safety"],
      customerProblems: ["staircase-fall-risk"],
    },
  ),
  createSubService(
    "invisible-grills",
    "terrace-invisible-grills",
    "Terrace Invisible Grills",
    "Terrace Grills",
    {
      summary:
        "Terrace invisible grills protect open parapet edges on rooftops used by families.",
      introduction:
        "Terrace invisible grills are recommended where rooftop spaces are used for drying, seating or supervised activities. Wind exposure and parapet condition are checked carefully because terrace installations face stronger outdoor stress than balcony-level work.",
      benefits: [
        "Improves safety at open terrace edges",
        "Allows continued rooftop use with more confidence",
        "Discreet look along parapet lines",
        "Useful for villas and independent houses",
      ],
      features: [
        "Parapet strength assessment before fixing",
        "Outdoor-grade stainless steel selection",
        "Continuous edge coverage options",
        "Corner and end termination finishing",
      ],
      applications: [
        "Villa terrace parapets",
        "Independent house rooftop edges",
        "Commercial terrace zones needing edge protection",
      ],
      materials: ["High-grade stainless steel", "Corrosion-resistant anchors"],
      primaryKeywords: ["terrace invisible grills", "terrace safety grills"],
      secondaryKeywords: ["rooftop parapet grill", "terrace edge safety"],
      customerProblems: ["terrace-edge-protection"],
    },
  ),
  createSubService(
    "invisible-grills",
    "apartment-invisible-grills",
    "Apartment Invisible Grills",
    "Apartment Grills",
    {
      summary:
        "Apartment invisible grills are planned for flat balconies, windows and utility openings.",
      introduction:
        "Apartment invisible grills are tailored for flat layouts where society rules, neighbour visibility and space constraints matter. We help owners prioritise openings and choose specifications that balance safety, appearance and maintenance in shared buildings.",
      benefits: [
        "Suitable for flat balconies and windows",
        "Neat finish for society-facing elevations",
        "Can be staged opening by opening if needed",
        "Supports child safety in compact homes",
      ],
      features: [
        "Flat-specific measurement workflow",
        "Options for utility and front-facing balconies",
        "Low-visual-impact cable systems",
        "Guidance on society approval where applicable",
      ],
      applications: [
        "Gated community flats",
        "Mid-rise and high-rise apartments",
        "Owner-occupied and rental flats needing safety upgrade",
      ],
      materials: ["Stainless steel invisible grill systems", "Quality anchor hardware"],
      primaryKeywords: ["apartment invisible grills", "flat invisible grills"],
      secondaryKeywords: ["gated community invisible grill", "flat balcony safety grill"],
      customerProblems: ["child-balcony-safety", "open-window-risk"],
    },
  ),
  createSubService(
    "invisible-grills",
    "villa-invisible-grills",
    "Villa Invisible Grills",
    "Villa Grills",
    {
      summary:
        "Villa invisible grills cover balconies, windows, staircases and terraces in independent homes.",
      introduction:
        "Villa invisible grills often involve multiple openings across floors, including balconies, staircases, terrace edges and large windows. A full home walkthrough helps identify priority zones and consistent material specification throughout the property.",
      benefits: [
        "Whole-home safety planning for villas",
        "Custom coverage for larger openings",
        "Consistent finish across floors",
        "Supports family use of indoor-outdoor spaces",
      ],
      features: [
        "Multi-opening site assessment",
        "Options for front elevation and rear utility areas",
        "Durable specification for outdoor exposure",
        "Phased installation possible by floor or zone",
      ],
      applications: [
        "Independent villas in layouts",
        "Duplex and triplex homes",
        "Villa communities across Andhra Pradesh",
      ],
      materials: ["Premium stainless steel cables or rods", "Heavy-duty fixing accessories"],
      primaryKeywords: ["villa invisible grills", "independent house invisible grills"],
      secondaryKeywords: ["duplex villa safety grills", "villa balcony invisible grill"],
      customerProblems: ["child-balcony-safety", "terrace-edge-protection", "staircase-fall-risk"],
    },
  ),
  createSubService(
    "invisible-grills",
    "child-safety-invisible-grills",
    "Child-Safety Invisible Grills",
    "Child Safety Grills",
    {
      summary:
        "Child-safety invisible grills use closer spacing and secure fixing for families with young children.",
      introduction:
        "Child-safety invisible grills are specified when the main concern is preventing children from slipping through railing gaps or climbing unsafe edges. Spacing, anchor depth and opening coverage are planned more conservatively than standard decorative installations.",
      benefits: [
        "Focused on child fall prevention",
        "Closer spacing options at critical openings",
        "Helps parents use balconies with more confidence",
        "Cleaner look than many temporary barriers",
      ],
      features: [
        "Reduced gap spacing at priority openings",
        "Strong anchor selection for active pressure points",
        "Room-by-room prioritisation available",
        "Clear safety guidance after installation",
      ],
      applications: [
        "Families with toddlers and young children",
        "Bedroom windows at reachable height",
        "Balconies used daily for play or study",
      ],
      materials: ["High-tensile stainless steel", "Reinforced anchor systems"],
      primaryKeywords: ["child safety invisible grills", "child proof balcony grills"],
      secondaryKeywords: ["kids safety grill for balcony", "child safe invisible grill"],
      customerProblems: ["child-balcony-safety", "open-window-risk"],
    },
  ),
  createSubService(
    "invisible-grills",
    "pet-safety-invisible-grills",
    "Pet-Safety Invisible Grills",
    "Pet Safety Grills",
    {
      summary:
        "Pet-safety invisible grills help prevent cats and dogs from passing through open railing gaps.",
      introduction:
        "Pet-safety invisible grills are chosen when cats or small dogs can squeeze through balcony or window gaps. We assess gap width, pet behaviour and preferred ventilation before recommending spacing and coverage that reduces escape and fall risk.",
      benefits: [
        "Reduces pet escape through railing gaps",
        "Useful for cat-friendly flats and villas",
        "Maintains airflow better than solid barriers",
        "Can cover balcony and window zones together",
      ],
      features: [
        "Spacing based on pet size and gap width",
        "Secure fixing for push-and-climb behaviour",
        "Options for balcony and window combinations",
        "Durable components for daily pet activity",
      ],
      applications: [
        "Cat owners in apartments",
        "Homes with small dogs using balcony areas",
        "Utility balconies used by pets",
      ],
      materials: ["Stainless steel grill systems", "Strong anchors and end fittings"],
      primaryKeywords: ["pet safety invisible grills", "cat balcony safety grill"],
      secondaryKeywords: ["dog balcony grill", "pet proof invisible grill"],
      customerProblems: ["pet-balcony-safety"],
    },
  ),
  createSubService(
    "invisible-grills",
    "high-rise-invisible-grills",
    "High-Rise Invisible Grills",
    "High-Rise Grills",
    {
      summary:
        "High-rise invisible grills are specified for upper-floor flats needing stronger fixing and premium materials.",
      introduction:
        "High-rise invisible grills demand careful fixing because wind load and fall risk increase at upper levels. We use stronger anchors and quality stainless steel components suitable for tower apartments, subject to society guidelines and safe working access during installation.",
      benefits: [
        "Designed for upper-floor safety requirements",
        "Premium fixing approach for taller buildings",
        "Discreet finish suitable for tower elevations",
        "Supports child and pet safety at height",
      ],
      features: [
        "High-rise anchor and material specification",
        "Balcony and window packages for flats",
        "Alignment planning for visible tower facades",
        "Site review for access and safety compliance",
      ],
      applications: [
        "High-rise apartment balconies",
        "Upper-floor windows in towers",
        "Premium flats needing low-visual safety barriers",
      ],
      materials: ["High-grade stainless steel", "Tested anchor systems for elevated fixing"],
      primaryKeywords: ["high rise invisible grills", "upper floor balcony grills"],
      secondaryKeywords: ["tower apartment invisible grill", "high rise child safety grill"],
      customerProblems: ["child-balcony-safety", "pet-balcony-safety"],
    },
  ),
  createSubService(
    "invisible-grills",
    "stainless-steel-invisible-grills",
    "Stainless-Steel Invisible Grills",
    "SS Invisible Grills",
    {
      summary:
        "Stainless-steel invisible grills offer strong outdoor durability for coastal and high-humidity areas.",
      introduction:
        "Stainless-steel invisible grills are recommended when long-term rust resistance matters, especially in coastal cities and humid districts. Material grade, edge finishing and anchor quality are explained clearly so customers understand why specification affects durability and price.",
      benefits: [
        "Better corrosion resistance for outdoor use",
        "Longer service life in humid climates",
        "Strong option for balconies and terraces",
        "Low maintenance when installed correctly",
      ],
      features: [
        "Grade selection based on exposure level",
        "Corrosion-aware anchor and cap finishing",
        "Suitable for coastal and inland outdoor areas",
        "Consistent specification across openings",
      ],
      applications: [
        "Coastal apartments and villas",
        "Terrace and balcony outdoor exposure zones",
        "Customers prioritising durability over lowest cost",
      ],
      materials: ["304 or higher grade stainless steel", "Rust-resistant hardware"],
      primaryKeywords: ["stainless steel invisible grills", "ss invisible grills"],
      secondaryKeywords: ["rust proof invisible grill", "coastal balcony invisible grill"],
      customerProblems: ["terrace-edge-protection", "child-balcony-safety"],
    },
  ),
];

const SAFETY_NET_SUB_SERVICES: SubService[] = [
  createSubService(
    "safety-nets",
    "balcony-safety-nets",
    "Balcony Safety Nets",
    "Balcony Nets",
    {
      summary:
        "Balcony safety nets create a protective barrier for fall prevention and bird control on balconies.",
      introduction:
        "Balcony safety nets are widely used in Andhra Pradesh flats and houses where quick coverage and ventilation are both important. Net thickness, border rope and hook quality are selected based on whether the main need is child safety, pet safety or pigeon control.",
      benefits: [
        "Cost-effective coverage for balcony openings",
        "Allows air flow compared with solid panels",
        "Useful for bird and fall protection together",
        "Can be installed on many railing types",
      ],
      features: [
        "UV-stabilised net material",
        "Border rope with reinforced edging",
        "Secure hooks or anchor fixing",
        "Custom size for straight and angled balconies",
      ],
      applications: ["Apartment balconies", "Villa balconies", "Utility balcony openings"],
      materials: ["UV-stabilised nylon or polyethylene net", "Reinforced border rope"],
      primaryKeywords: ["balcony safety nets", "balcony net installation"],
      secondaryKeywords: ["flat balcony net", "balcony bird net"],
      customerProblems: ["child-balcony-safety", "pigeon-infestation"],
    },
  ),
  createSubService(
    "safety-nets",
    "pigeon-safety-nets",
    "Pigeon Safety Nets",
    "Pigeon Nets",
    {
      summary:
        "Pigeon safety nets block birds from nesting on balconies, ducts and parapets without harming them.",
      introduction:
        "Pigeon safety nets are one of the most requested solutions in urban flats where droppings and nesting create daily cleaning work. Nets are tensioned and fixed to prevent sagging, with mesh size chosen to stop pigeons while maintaining reasonable visibility.",
      benefits: [
        "Reduces pigeon entry and roosting",
        "Improves balcony hygiene",
        "Humane bird control method",
        "Can cover multiple balcony sides together",
      ],
      features: [
        "Bird-specific mesh sizing",
        "Tensioned installation to reduce sag",
        "Durable outdoor netting",
        "Optional coverage for ducts and corners",
      ],
      applications: ["Flat balconies", "Window-adjacent ledges", "Parapet corners"],
      materials: ["Heavy-duty bird net", "UV-resistant fixing ropes and hooks"],
      primaryKeywords: ["pigeon net for balcony", "pigeon safety net"],
      secondaryKeywords: ["anti pigeon net apartment", "pigeon net installation"],
      customerProblems: ["pigeon-infestation", "building-bird-entry"],
    },
  ),
  createSubService(
    "safety-nets",
    "bird-safety-nets",
    "Bird Safety Nets",
    "Bird Nets",
    {
      summary:
        "Bird safety nets protect balconies, windows and building zones from common urban bird entry.",
      introduction:
        "Bird safety nets cover a wider range of bird-related problems beyond pigeons alone, including nesting at ducts, parapets and open service areas. We inspect the site to identify active entry points and recommend net specification for the exposure level.",
      benefits: [
        "Blocks common bird entry points",
        "Supports cleaner balconies and facades",
        "Flexible coverage for irregular openings",
        "Suitable for homes and commercial zones",
      ],
      features: [
        "Custom-cut net panels",
        "Strong border and anchor arrangement",
        "Options for large and small openings",
        "Maintenance guidance after installation",
      ],
      applications: ["Residential balconies", "Duct areas", "Building ledges and facade gaps"],
      materials: ["UV-stabilised bird net", "Galvanised hooks and nylon rope"],
      primaryKeywords: ["bird safety nets", "bird net for home"],
      secondaryKeywords: ["balcony bird net", "building bird net"],
      customerProblems: ["pigeon-infestation", "building-bird-entry"],
    },
  ),
  createSubService(
    "safety-nets",
    "children-safety-nets",
    "Children Safety Nets",
    "Children Nets",
    {
      summary:
        "Children safety nets add protection at balconies and windows where kids are at risk.",
      introduction:
        "Children safety nets are installed when families need an immediate protective barrier at open balconies or windows. Net tension and fixing height are planned carefully so the barrier remains effective under normal child contact and daily use.",
      benefits: [
        "Adds protection at child-risk openings",
        "Quick solution for many flat layouts",
        "Maintains ventilation in living spaces",
        "Can be combined with balcony bird net needs",
      ],
      features: [
        "Strong mesh and border specification",
        "Secure hook or anchor placement",
        "Full-opening coverage planning",
        "Safety check before handover",
      ],
      applications: ["Family flats", "Homes with accessible windows", "Utility balconies"],
      materials: ["High-strength safety net", "Reinforced edging and anchors"],
      primaryKeywords: ["children safety nets", "child safety balcony net"],
      secondaryKeywords: ["kids safety net for balcony", "child proof net"],
      customerProblems: ["child-balcony-safety", "open-window-risk"],
    },
  ),
  createSubService(
    "safety-nets",
    "pet-safety-nets",
    "Pet Safety Nets",
    "Pet Nets",
    {
      summary:
        "Pet safety nets help prevent cats and dogs from slipping through balcony railing gaps.",
      introduction:
        "Pet safety nets are useful when pets push against railing gaps or sit near open balcony edges. Mesh size and net height are chosen based on pet type and opening dimensions, with fixing designed for regular pet activity.",
      benefits: [
        "Reduces pet fall and escape risk",
        "Allows balcony use with more confidence",
        "Less obstructive than solid temporary boards",
        "Can cover windows and balconies together",
      ],
      features: [
        "Mesh size matched to pet requirements",
        "Tensioned net with durable borders",
        "Fixing suited to railing or wall surface",
        "Repair guidance if future adjustment is needed",
      ],
      applications: ["Cat-friendly flats", "Small dog households", "Utility balcony zones"],
      materials: ["Strong nylon safety net", "UV-resistant rope and hooks"],
      primaryKeywords: ["pet safety nets", "cat balcony net"],
      secondaryKeywords: ["dog balcony safety net", "pet proof balcony net"],
      customerProblems: ["pet-balcony-safety"],
    },
  ),
  createSubService(
    "safety-nets",
    "duct-area-safety-nets",
    "Duct-Area Safety Nets",
    "Duct Nets",
    {
      summary:
        "Duct-area safety nets block birds from nesting in service ducts and AC ledge zones.",
      introduction:
        "Duct-area safety nets target the hidden corners where pigeons often nest above AC units and service shafts. These areas are easy to ignore until droppings spread to balconies below, so duct coverage is commonly added with balcony bird net work.",
      benefits: [
        "Covers common hidden nesting zones",
        "Reduces droppings around AC areas",
        "Helps avoid repeated duct cleaning",
        "Useful in apartments and commercial buildings",
      ],
      features: [
        "Custom fit around duct geometry",
        "Secure fixing in tight service areas",
        "Bird mesh suitable for small gaps",
        "Can be combined with balcony nets",
      ],
      applications: ["Apartment duct zones", "AC parapet ledges", "Service shaft openings"],
      materials: ["Bird net panels", "Anchor hooks and nylon rope"],
      primaryKeywords: ["duct area safety nets", "AC duct bird net"],
      secondaryKeywords: ["duct bird net installation", "service duct pigeon net"],
      customerProblems: ["pigeon-infestation", "building-bird-entry"],
    },
  ),
  createSubService(
    "safety-nets",
    "terrace-safety-nets",
    "Terrace Safety Nets",
    "Terrace Nets",
    {
      summary:
        "Terrace safety nets protect open rooftop edges and large parapet spans.",
      introduction:
        "Terrace safety nets are used where full parapet coverage is needed on rooftops with regular family or staff access. Wind exposure and parapet height are assessed before recommending net thickness and anchor intervals for long spans.",
      benefits: [
        "Wide coverage for terrace edges",
        "Useful for bird control on open rooftops",
        "Can protect large parapet lengths",
        "Supports safer rooftop usage",
      ],
      features: [
        "Long-span tension planning",
        "Heavy-duty net and border rope",
        "Anchor intervals based on wind exposure",
        "Corner and end support reinforcement",
      ],
      applications: ["Villa terraces", "Independent house rooftops", "Commercial terrace zones"],
      materials: ["Heavy-duty outdoor net", "Strong anchors and border rope"],
      primaryKeywords: ["terrace safety nets", "terrace bird net"],
      secondaryKeywords: ["rooftop safety net", "parapet net installation"],
      customerProblems: ["terrace-edge-protection", "pigeon-infestation"],
    },
  ),
  createSubService(
    "safety-nets",
    "building-covering-safety-nets",
    "Building-Covering Safety Nets",
    "Building Nets",
    {
      summary:
        "Building-covering safety nets protect large facade and ledge areas from bird entry.",
      introduction:
        "Building-covering safety nets are suited to commercial buildings and larger residential blocks with multiple bird entry points. These projects are planned in phases after a facade survey because access, height and coverage area vary significantly.",
      benefits: [
        "Protects large external areas",
        "Reduces bird problems at scale",
        "Can cover ledges, ducts and facade gaps",
        "Useful for offices, shops and large apartments",
      ],
      features: [
        "Project-wise site survey",
        "Phased installation options",
        "Durable external net specification",
        "Maintenance plan for large spans",
      ],
      applications: ["Commercial buildings", "Large apartment facades", "School and office blocks"],
      materials: ["Commercial-grade bird net", "Heavy-duty rope and anchor systems"],
      primaryKeywords: ["building covering safety nets", "building bird net"],
      secondaryKeywords: ["facade bird net", "commercial building anti bird net"],
      customerProblems: ["building-bird-entry", "pigeon-infestation"],
    },
  ),
  createSubService(
    "safety-nets",
    "window-safety-nets",
    "Window Safety Nets",
    "Window Nets",
    {
      summary:
        "Window safety nets add protection to open windows while keeping ventilation possible.",
      introduction:
        "Window safety nets are commonly installed where windows remain open for airflow but are reachable by children or pets. Size, frame condition and fixing method are reviewed for each window before installation to avoid damage to frames or shutters.",
      benefits: [
        "Protects open windows at reachable height",
        "Allows ventilation compared with solid grills",
        "Useful add-on with balcony bird net work",
        "Can be installed selectively by room",
      ],
      features: [
        "Custom-cut window net panels",
        "Frame-friendly fixing approach",
        "Tensioned mesh with neat borders",
        "Option for removable maintenance access where feasible",
      ],
      applications: ["Bedroom windows", "Hall windows", "Utility and kitchen vent openings"],
      materials: ["UV-stabilised window net", "Hooks, rope and anchor accessories"],
      primaryKeywords: ["window safety nets", "window bird net"],
      secondaryKeywords: ["child safe window net", "flat window net installation"],
      customerProblems: ["open-window-risk", "pigeon-infestation"],
    },
  ),
  createSubService(
    "safety-nets",
    "staircase-safety-nets",
    "Staircase Safety Nets",
    "Staircase Nets",
    {
      summary:
        "Staircase safety nets secure open stair sides where railing gaps create fall risk.",
      introduction:
        "Staircase safety nets are used in duplex homes and commercial spaces where full grill work may not be preferred visually. Net panels are measured section by section to follow stair angles and landing turns safely.",
      benefits: [
        "Covers open stair gaps quickly",
        "Maintains visibility through the barrier",
        "Useful for temporary or long-term safety needs",
        "Can complement existing decorative railings",
      ],
      features: [
        "Section-wise custom measurement",
        "Tensioned net along stair geometry",
        "Secure fixing at rail or wall points",
        "Neat finishing at landings and turns",
      ],
      applications: ["Duplex villas", "Indoor stairwells", "Commercial staircase zones"],
      materials: ["Strong safety net panels", "Border rope and anchor hardware"],
      primaryKeywords: ["staircase safety nets", "staircase net installation"],
      secondaryKeywords: ["duplex staircase net", "indoor staircase safety net"],
      customerProblems: ["staircase-fall-risk"],
    },
  ),
];

const SPORTS_NET_SUB_SERVICES: SubService[] = [
  createSubService(
    "sports-nets",
    "cricket-practice-nets",
    "Cricket Practice Nets",
    "Cricket Nets",
    {
      summary:
        "Cricket practice nets create a safe enclosed lane for batting and bowling at home or academy.",
      introduction:
        "Cricket practice nets are designed for homes, schools and academies that need regular training without balls leaving the boundary. Net height, lane width and post strength are planned based on available space and whether the usage is recreational or intensive coaching.",
      benefits: [
        "Contains balls within the practice area",
        "Enables daily cricket training",
        "Reduces neighbour disturbance",
        "Custom size for available plot or ground",
      ],
      features: [
        "Galvanised steel posts",
        "Heavy-duty cricket net panels",
        "Height suited to bowling and batting practice",
        "Optional centre pitch lane marking support area",
      ],
      applications: ["Home cricket nets", "Academy lanes", "School cricket zones"],
      materials: ["Cricket practice net", "Galvanised posts and tension ropes"],
      primaryKeywords: ["cricket practice net", "cricket net installation"],
      secondaryKeywords: ["home cricket net Andhra Pradesh", "academy cricket net"],
      customerProblems: ["cricket-practice-space"],
    },
  ),
  createSubService(
    "sports-nets",
    "box-cricket-nets",
    "Box-Cricket Nets",
    "Box Cricket Nets",
    {
      summary:
        "Box-cricket nets fit compact spaces for recreational cricket and academy side lanes.",
      introduction:
        "Box-cricket nets are ideal when full ground space is unavailable but regular cricket play is still needed. These enclosures maximise usable area in small plots, terrace-adjacent zones where permitted, and commercial sports corners.",
      benefits: [
        "Works in compact urban plots",
        "Supports recreational and rental box cricket setups",
        "Keeps balls contained safely",
        "Flexible sizing for available length and width",
      ],
      features: [
        "Compact enclosure design",
        "Strong posts and entry arrangement",
        "Net height for box cricket shots",
        "Optional gate for player entry",
      ],
      applications: ["Small villa plots", "Sports academies", "Commercial box cricket corners"],
      materials: ["Heavy-duty cricket net", "Galvanised post structure"],
      primaryKeywords: ["box cricket net", "box cricket net installation"],
      secondaryKeywords: ["compact cricket net", "box cricket setup"],
      customerProblems: ["box-cricket-space", "cricket-practice-space"],
    },
  ),
  createSubService(
    "sports-nets",
    "football-nets",
    "Football Nets",
    "Football Nets",
    {
      summary:
        "Football nets enclose practice areas for schools, academies and private grounds.",
      introduction:
        "Football nets are used to contain balls during training drills and small-sided games. Post spacing and net height depend on the playing area size, age group and whether the setup is outdoor grass, turf or hard surface.",
      benefits: [
        "Reduces ball loss outside the ground",
        "Safer training sessions in limited space",
        "Useful for school and academy grounds",
        "Custom dimensions for ground layout",
      ],
      features: [
        "High net panels for ball containment",
        "Strong post fixing for outdoor use",
        "Side and end net coverage options",
        "Gate access for players and equipment",
      ],
      applications: ["School grounds", "Sports academies", "Private football practice areas"],
      materials: ["Football enclosure net", "Galvanised posts and guy ropes"],
      primaryKeywords: ["football net installation", "football practice net"],
      secondaryKeywords: ["school football net", "academy football enclosure"],
      customerProblems: ["school-playground-enclosure"],
    },
  ),
  createSubService(
    "sports-nets",
    "volleyball-nets",
    "Volleyball Nets",
    "Volleyball Nets",
    {
      summary:
        "Volleyball nets support school, academy and recreational court setups indoors and outdoors.",
      introduction:
        "Volleyball nets can refer to game nets, court boundary nets or combined practice enclosures depending on customer need. We clarify whether the requirement is a playable volleyball net system or a full court containment net before quotation.",
      benefits: [
        "Supports school and academy volleyball activity",
        "Can combine game net and boundary enclosure",
        "Useful for multi-sport campuses",
        "Sized to court dimensions on site",
      ],
      features: [
        "Court dimension-based planning",
        "Post and cable or rope support options",
        "Indoor and outdoor specifications",
        "Optional boundary net add-ons",
      ],
      applications: ["School courts", "Academy training areas", "Community sports zones"],
      materials: ["Volleyball net and boundary mesh", "Posts, ropes and court fixings"],
      primaryKeywords: ["volleyball net installation", "volleyball court net"],
      secondaryKeywords: ["school volleyball net", "outdoor volleyball enclosure"],
      customerProblems: ["school-playground-enclosure", "indoor-sports-setup"],
    },
  ),
  createSubService(
    "sports-nets",
    "badminton-nets",
    "Badminton Nets",
    "Badminton Nets",
    {
      summary:
        "Badminton nets are installed for courts, academies and indoor hall practice zones.",
      introduction:
        "Badminton nets are used in schools, academies and residential clubs where court setup must suit indoor or outdoor conditions. Height, post stability and surrounding clearance are checked before recommending the final arrangement.",
      benefits: [
        "Enables structured badminton practice",
        "Suitable for indoor and outdoor courts",
        "Can be part of multi-sport facility planning",
        "Custom fit for available court space",
      ],
      features: [
        "Regulation-height net options",
        "Stable post or wall fixing methods",
        "Indoor-friendly installation choices",
        "Optional side partition nets for shared halls",
      ],
      applications: ["Badminton academies", "School indoor halls", "Residential club courts"],
      materials: ["Badminton net", "Posts, tapes and support hardware"],
      primaryKeywords: ["badminton net installation", "badminton court net"],
      secondaryKeywords: ["indoor badminton net", "academy badminton setup"],
      customerProblems: ["indoor-sports-setup"],
    },
  ),
  createSubService(
    "sports-nets",
    "tennis-nets",
    "Tennis Nets",
    "Tennis Nets",
    {
      summary:
        "Tennis nets support practice courts at academies, clubs and private sports areas.",
      introduction:
        "Tennis nets are installed for training courts where durable posts and proper tension matter for daily use. Surface type, court size and exposure to wind are reviewed to recommend a suitable net and post combination.",
      benefits: [
        "Supports academy and club training",
        "Durable setup for repeated use",
        "Can include partial enclosure if needed",
        "Custom fit for available court length",
      ],
      features: [
        "Court-length net specification",
        "Post and tension system options",
        "Outdoor weather-resistant components",
        "Optional ball containment side nets",
      ],
      applications: ["Tennis academies", "Club courts", "Private sports layouts"],
      materials: ["Tennis net", "Posts, cables and ground fixings"],
      primaryKeywords: ["tennis net installation", "tennis court net"],
      secondaryKeywords: ["academy tennis net", "outdoor tennis court setup"],
      customerProblems: ["indoor-sports-setup"],
    },
  ),
  createSubService(
    "sports-nets",
    "multi-sport-court-nets",
    "Multi-Sport Court Nets",
    "Multi-Sport Nets",
    {
      summary:
        "Multi-sport court nets enclose shared grounds used for more than one sport.",
      introduction:
        "Multi-sport court nets are useful for schools and academies where one ground supports cricket, football, volleyball or mixed training sessions. We plan height, mesh type and entry gates based on the sport mix and daily schedule.",
      benefits: [
        "One enclosure supports multiple sports",
        "Better use of limited campus space",
        "Reduces ball damage outside the court",
        "Flexible design for shared grounds",
      ],
      features: [
        "Sport-mix assessment before design",
        "Adjustable gate and partition options",
        "Heavy-duty net for mixed impact levels",
        "Scalable layout for future expansion",
      ],
      applications: ["School multi-sport grounds", "Academy shared courts", "Community sports centres"],
      materials: ["Multi-sport enclosure net", "Galvanised post system"],
      primaryKeywords: ["multi sport court net", "multi sport net installation"],
      secondaryKeywords: ["school multi sport enclosure", "shared court net"],
      customerProblems: ["school-playground-enclosure", "indoor-sports-setup"],
    },
  ),
  createSubService(
    "sports-nets",
    "school-playground-nets",
    "School Playground Nets",
    "School Nets",
    {
      summary:
        "School playground nets protect campus play areas and contain ball sports safely.",
      introduction:
        "School playground nets are planned with institutional safety and durability in mind. Installation timing, access and post fixing are coordinated with school management to minimise disruption to daily classes and student activity.",
      benefits: [
        "Safer playground activity zones",
        "Protects nearby classrooms and windows",
        "Supports structured PT and sports periods",
        "Durable specification for daily student use",
      ],
      features: [
        "Campus-specific measurement",
        "Strong post and net specification",
        "Gate access for staff and equipment",
        "Maintenance guidance for school teams",
      ],
      applications: ["School cricket zones", "Football practice areas", "Multi-use playgrounds"],
      materials: ["Institutional-grade sports net", "Galvanised posts and anchors"],
      primaryKeywords: ["school playground net", "school sports net"],
      secondaryKeywords: ["school cricket net installation", "campus playground enclosure"],
      customerProblems: ["school-playground-enclosure"],
    },
  ),
  createSubService(
    "sports-nets",
    "academy-practice-nets",
    "Academy Practice Nets",
    "Academy Nets",
    {
      summary:
        "Academy practice nets are built for daily coaching with stronger posts and heavier mesh.",
      introduction:
        "Academy practice nets are specified for commercial coaching centres that need reliable daily uptime. Lane count, net height and entry flow are planned for trainee volume, sport type and available ground space.",
      benefits: [
        "Built for intensive daily training",
        "Supports academy revenue lanes",
        "Reduces ball loss and neighbour issues",
        "Scalable for future lane additions",
      ],
      features: [
        "Heavy-duty post and net specification",
        "Multiple lane layout options",
        "Player entry and equipment access planning",
        "Repair-friendly tension design",
      ],
      applications: ["Cricket academies", "Multi-sport coaching centres", "Private academy grounds"],
      materials: ["Academy-grade practice net", "Galvanised steel post framework"],
      primaryKeywords: ["academy practice net", "sports academy net installation"],
      secondaryKeywords: ["coaching centre cricket net", "academy lane net setup"],
      customerProblems: ["cricket-practice-space", "box-cricket-space"],
    },
  ),
  createSubService(
    "sports-nets",
    "indoor-sports-nets",
    "Indoor Sports Nets",
    "Indoor Nets",
    {
      summary:
        "Indoor sports nets partition halls and contain balls for badminton, cricket drills and mixed training.",
      introduction:
        "Indoor sports nets are installed in covered halls where wall clearance, lighting fixtures and roof height must be considered. These nets may serve as full enclosures or partition dividers depending on how the hall is shared.",
      benefits: [
        "Makes indoor training safer and more organised",
        "Protects lights, walls and equipment",
        "Supports shared hall usage",
        "Custom fit for academy and school interiors",
      ],
      features: [
        "Hall measurement including height clearance",
        "Partition or full enclosure options",
        "Indoor-safe fixing methods",
        "Sport-specific mesh selection",
      ],
      applications: ["Indoor academies", "School halls", "Commercial indoor sports centres"],
      materials: ["Indoor sports net panels", "Posts, ropes and wall-safe fixings"],
      primaryKeywords: ["indoor sports net", "indoor cricket net"],
      secondaryKeywords: ["indoor badminton partition net", "hall sports net installation"],
      customerProblems: ["indoor-sports-setup"],
    },
  ),
];

const CLOTH_HANGER_SUB_SERVICES: SubService[] = [
  createSubService(
    "cloth-drying-hangers",
    "ceiling-mounted-cloth-hangers",
    "Ceiling-Mounted Cloth Hangers",
    "Ceiling Hangers",
    {
      summary:
        "Ceiling-mounted cloth hangers use overhead space for efficient drying in flats and utility areas.",
      introduction:
        "Ceiling-mounted cloth hangers are popular in apartments where floor space is limited and daily laundry needs are high. Installation depends on ceiling strength, height and the best line layout for bedsheets, daily wear and school uniforms.",
      benefits: [
        "Uses unused ceiling space",
        "Keeps floor area free",
        "Suitable for utility rooms and covered balconies",
        "Helpful during monsoon drying challenges",
      ],
      features: [
        "Multiple line options",
        "Stainless steel rods and brackets",
        "Smooth raising and lowering mechanism where applicable",
        "Load guidance for safe daily use",
      ],
      applications: ["Apartment utility areas", "Covered balconies", "Indoor laundry zones"],
      materials: ["Stainless steel rods", "Ceiling brackets and pulley components"],
      primaryKeywords: ["ceiling cloth drying hanger", "ceiling mounted cloth hanger"],
      secondaryKeywords: ["ceiling hanger for apartment", "utility room cloth hanger"],
      customerProblems: ["limited-drying-space", "monsoon-drying-issue"],
    },
  ),
  createSubService(
    "cloth-drying-hangers",
    "wall-mounted-cloth-hangers",
    "Wall-Mounted Cloth Hangers",
    "Wall Hangers",
    {
      summary:
        "Wall-mounted cloth hangers fit side walls in balconies and utility spaces where ceiling fixing is difficult.",
      introduction:
        "Wall-mounted cloth hangers are useful when ceiling conditions are uneven or when side wall fixing offers a better drying line angle. We inspect wall surface and available clearance before recommending foldable or fixed arm options.",
      benefits: [
        "Works where ceiling mounting is not ideal",
        "Good for narrow balconies and passages",
        "Can fold away when not in use on selected models",
        "Easy daily access for regular laundry",
      ],
      features: [
        "Fixed or foldable arm options",
        "Wall anchor specification based on surface",
        "Multiple hook or rod layouts",
        "Compact design for small spaces",
      ],
      applications: ["Narrow balconies", "Utility passages", "Service areas in villas"],
      materials: ["Stainless steel arms and hooks", "Wall anchors and brackets"],
      primaryKeywords: ["wall mounted cloth hanger", "wall cloth drying hanger"],
      secondaryKeywords: ["foldable wall hanger balcony", "compact wall drying rack"],
      customerProblems: ["limited-drying-space"],
    },
  ),
  createSubService(
    "cloth-drying-hangers",
    "pulley-cloth-hangers",
    "Pulley Cloth Hangers",
    "Pulley Hangers",
    {
      summary:
        "Pulley cloth hangers make it easy to raise and lower laundry lines in balconies and utility areas.",
      introduction:
        "Pulley cloth hangers are chosen for daily convenience, especially in flats where users prefer to adjust line height without reaching up manually. Smooth pulley operation and strong ceiling or wall anchors are essential for long-term satisfaction.",
      benefits: [
        "Easy height adjustment for all family members",
        "Ideal for daily washing routines",
        "Uses vertical space efficiently",
        "Popular in apartment balconies",
      ],
      features: [
        "Smooth pulley operation",
        "Multiple parallel lines available",
        "Stainless steel rope and hook options",
        "Ceiling or wall mounting combinations",
      ],
      applications: ["Apartment balconies", "Utility rooms", "Covered terrace drying zones"],
      materials: ["Pulley sets", "Stainless steel rope", "Ceiling or wall brackets"],
      primaryKeywords: ["pulley cloth hanger", "pulley cloth drying hanger"],
      secondaryKeywords: ["balcony pulley hanger", "apartment pulley cloth line"],
      customerProblems: ["limited-drying-space", "monsoon-drying-issue"],
    },
  ),
  createSubService(
    "cloth-drying-hangers",
    "stainless-steel-cloth-hangers",
    "Stainless-Steel Cloth Hangers",
    "SS Cloth Hangers",
    {
      summary:
        "Stainless-steel cloth hangers offer rust-resistant drying solutions for humid and coastal areas.",
      introduction:
        "Stainless-steel cloth hangers are recommended when durability matters in humid climates and coastal cities across Andhra Pradesh. Material quality affects long-term rust performance, especially on open balconies with rain exposure.",
      benefits: [
        "Better rust resistance for daily use",
        "Longer life in humid conditions",
        "Suitable for open and covered balconies",
        "Low maintenance with basic cleaning",
      ],
      features: [
        "Stainless steel rods, hooks and brackets",
        "Corrosion-aware component selection",
        "Ceiling, wall and pulley configurations",
        "Load-rated installation guidance",
      ],
      applications: ["Coastal apartments", "Open balcony drying", "High-use family laundry areas"],
      materials: ["Stainless steel rods and fittings", "Rust-resistant pulleys and anchors"],
      primaryKeywords: ["stainless steel cloth hanger", "ss cloth drying hanger"],
      secondaryKeywords: ["rust proof cloth hanger", "coastal balcony cloth hanger"],
      customerProblems: ["monsoon-drying-issue", "limited-drying-space"],
    },
  ),
  createSubService(
    "cloth-drying-hangers",
    "balcony-cloth-hangers",
    "Balcony Cloth Hangers",
    "Balcony Hangers",
    {
      summary:
        "Balcony cloth hangers help families dry clothes outdoors while keeping the home clutter-free.",
      introduction:
        "Balcony cloth hangers are configured based on balcony width, cover level and whether the area is used for seating as well as drying. We suggest ceiling, pulley or wall options depending on what keeps the balcony usable throughout the day.",
      benefits: [
        "Frees indoor space from drying racks",
        "Uses balcony area efficiently",
        "Can be planned for partially covered balconies",
        "Improves daily laundry workflow",
      ],
      features: [
        "Layout planned to balcony width",
        "Ceiling, pulley or wall options",
        "Foldable choices where space is shared",
        "Weather-aware component recommendation",
      ],
      applications: ["Flat balconies", "Villa balconies", "Utility balconies"],
      materials: ["Stainless steel hanger components", "Balcony-safe anchors"],
      primaryKeywords: ["balcony cloth hanger", "balcony cloth drying hanger"],
      secondaryKeywords: ["apartment balcony drying hanger", "balcony pulley hanger"],
      customerProblems: ["limited-drying-space", "monsoon-drying-issue"],
    },
  ),
  createSubService(
    "cloth-drying-hangers",
    "apartment-cloth-hangers",
    "Apartment Cloth Hangers",
    "Apartment Hangers",
    {
      summary:
        "Apartment cloth hangers are designed for compact flats needing smart drying solutions.",
      introduction:
        "Apartment cloth hangers focus on space efficiency for flat owners who cannot dedicate a full room to laundry drying. We recommend the best combination of ceiling, pulley and wall systems after checking utility and balcony conditions.",
      benefits: [
        "Designed for compact flat layouts",
        "Reduces indoor clutter from wet clothes",
        "Works in utility and balcony zones",
        "Can be installed in stages if required",
      ],
      features: [
        "Flat-specific layout planning",
        "Multiple mounting options",
        "Family-friendly pulley choices",
        "Neat finish for visible balcony areas",
      ],
      applications: ["Gated community flats", "High-rise apartments", "Rental flats with drying needs"],
      materials: ["Stainless steel apartment hanger kits", "Anchors suited to flat structures"],
      primaryKeywords: ["apartment cloth hanger", "flat cloth drying hanger"],
      secondaryKeywords: ["gated community cloth hanger", "flat pulley cloth hanger"],
      customerProblems: ["limited-drying-space", "monsoon-drying-issue"],
    },
  ),
  createSubService(
    "cloth-drying-hangers",
    "manual-cloth-hangers",
    "Manual Cloth Hangers",
    "Manual Hangers",
    {
      summary:
        "Manual cloth hangers offer simple fixed or adjustable lines for everyday home drying.",
      introduction:
        "Manual cloth hangers suit customers who want a straightforward drying setup without complex moving parts. These systems work well in utility areas and covered balconies where simple fixed lines are enough for daily use.",
      benefits: [
        "Simple and easy to use daily",
        "Lower maintenance than complex systems",
        "Cost-effective for basic drying needs",
        "Good for utility rooms and covered spaces",
      ],
      features: [
        "Fixed rod or line arrangements",
        "Minimal moving parts",
        "Strong hooks and anchors",
        "Quick installation in small spaces",
      ],
      applications: ["Utility rooms", "Covered balconies", "Low-traffic drying corners"],
      materials: ["Stainless steel rods and hooks", "Basic anchor and bracket sets"],
      primaryKeywords: ["manual cloth hanger", "manual cloth drying hanger"],
      secondaryKeywords: ["simple cloth hanger for home", "utility room drying hanger"],
      customerProblems: ["limited-drying-space"],
    },
  ),
  createSubService(
    "cloth-drying-hangers",
    "foldable-cloth-hangers",
    "Foldable Cloth Hangers",
    "Foldable Hangers",
    {
      summary:
        "Foldable cloth hangers save space by folding away when the balcony or passage is in use.",
      introduction:
        "Foldable cloth hangers are ideal when the same balcony is used for seating, plants and drying on different days. Wall-mounted foldable arms can be opened for laundry and folded back to keep the area visually tidy.",
      benefits: [
        "Saves space when not drying clothes",
        "Good for multi-use balconies",
        "Keeps the area looking neat for guests",
        "Flexible option for compact homes",
      ],
      features: [
        "Foldable arm mechanism",
        "Wall mounting with secure anchors",
        "Stainless steel construction",
        "Multiple arm length options",
      ],
      applications: ["Small balconies", "Passage utility walls", "Dual-use outdoor spaces"],
      materials: ["Foldable stainless steel arms", "Wall brackets and anchors"],
      primaryKeywords: ["foldable cloth hanger", "foldable cloth drying hanger"],
      secondaryKeywords: ["foldable balcony cloth hanger", "space saving foldable hanger"],
      customerProblems: ["limited-drying-space"],
    },
  ),
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: "service-invisible-grills",
    slug: "invisible-grills",
    name: "Invisible Grills",
    shortName: "Invisible Grills",
    categoryId: CATEGORY_PRIMARY,
    publicationStatus: "published",
    allowIndexing: true,
    summary:
      "Invisible grills provide modern balcony and window safety with stainless steel strength and minimal visual obstruction.",
    introduction:
      "Invisible grills are one of the most requested safety upgrades for flats and villas across Andhra Pradesh. They use stainless steel cables or rods fixed with strong anchors to reduce fall risk while keeping balconies and windows visually open. Families choose invisible grills for child safety, pet safety and a cleaner look compared with traditional heavy grills.",
    detailedDescription:
      "Our invisible grill service covers balconies, windows, staircases, terraces and apartment openings across Andhra Pradesh. Each project starts with a site visit to measure opening size, check surface condition and understand whether the priority is child safety, pet safety or general edge protection. We explain spacing, material grade and fixing method clearly before installation. Invisible grills are especially popular in Visakhapatnam, Vijayawada, Guntur and Tirupati where apartment living and villa layouts both need practical safety solutions without blocking light and ventilation completely.",
    customerProblems: [
      "child-balcony-safety",
      "pet-balcony-safety",
      "open-window-risk",
      "staircase-fall-risk",
      "terrace-edge-protection",
    ],
    benefits: [
      "Strong safety barrier with slim visual profile",
      "Suitable for balconies, windows and staircases",
      "Stainless steel durability for outdoor use",
      "Better openness compared with conventional grills",
      "Custom spacing for child and pet safety needs",
    ],
    features: [
      "On-site measurement for every opening",
      "Stainless steel cables or rods with secure anchors",
      "Custom spacing based on safety requirement",
      "Options for apartments, villas and high-rise flats",
      "Neat finishing for visible balcony areas",
    ],
    applications: [
      "Apartment and high-rise balconies",
      "Villa balconies, staircases and terraces",
      "Bedroom and hall windows",
      "Child and pet safety upgrades",
    ],
    materials: [
      "304-grade stainless steel cables or rods",
      "Rust-resistant anchors and fasteners",
      "End caps and finishing accessories",
    ],
    specifications: [
      "Spacing adjusted based on child or pet safety requirement",
      "Anchor depth based on wall or railing condition",
      "Material grade selected for exposure level",
      "Custom dimensions for each opening",
    ],
    installationSteps: [
      "Discuss requirement and book site visit",
      "Measure openings and confirm specification",
      "Share quotation with scope and timeline",
      "Install anchors and grill system with alignment check",
      "Inspect finish and explain basic maintenance",
    ],
    safetyInformation: [
      "Invisible grills improve safety but still require adult supervision for children",
      "Anchor quality and spacing are critical for performance",
      "Periodic inspection is recommended in coastal and high-wind areas",
    ],
    maintenanceTips: [
      "Wipe cables or rods periodically to remove dust and salt deposit",
      "Check anchor caps and fittings every few months",
      "Report looseness early for adjustment before major issues develop",
    ],
    pricingFactors: [
      "Total opening width and height",
      "Number of balconies, windows or staircase sections",
      "Material grade and spacing specification",
      "Floor height, access and fixing difficulty",
    ],
    suitablePropertyTypes: [
      "apartments",
      "villas",
      "independent-houses",
      "high-rise-apartments",
    ],
    primaryKeywords: [
      "invisible grills",
      "invisible grill installation",
      "balcony invisible grills",
    ],
    secondaryKeywords: [
      "stainless steel invisible grills",
      "invisible grills Andhra Pradesh",
      "child safety invisible grills",
      "window invisible grills",
    ],
    customerQuestions: [
      "Are invisible grills safe for children?",
      "Will invisible grills block the balcony view?",
      "What is the difference between invisible grills and safety nets?",
      "How long does invisible grill installation take?",
    ],
    searchIntents: ["commercial", "informational", "comparison"],
    relatedServiceIds: [
      "service-safety-nets",
      "service-cloth-drying-hangers",
    ],
    subServices: INVISIBLE_GRILL_SUB_SERVICES,
    heroImage: "/images/projects/balcony-invisible-grills-8.jpg",
    galleryImages: [
      "/images/projects/balcony-invisible-grills-10.jpg",
      "/images/projects/window-invisible-grills-1.jpeg",
    ],
    contentReviewed: true,
    qualityScore: 92,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "service-safety-nets",
    slug: "safety-nets",
    name: "Safety Nets",
    shortName: "Safety Nets",
    categoryId: CATEGORY_PRIMARY,
    publicationStatus: "published",
    allowIndexing: true,
    summary:
      "Safety nets protect balconies, ducts, terraces and windows from fall risk and bird entry across homes and buildings.",
    introduction:
      "Safety nets are a practical solution for bird control, balcony safety and large-area coverage where ventilation still matters. In Andhra Pradesh apartments and commercial buildings, pigeon nets and balcony safety nets are commonly installed after a site check of hooks, anchors and net tension requirements.",
    detailedDescription:
      "Our safety net service includes balcony nets, pigeon nets, bird nets, duct-area nets, terrace nets, building-covering nets and window nets. Each installation is sized to the opening and fixed with border rope, hooks or anchors suited to the surface. Safety nets are often chosen when customers want effective protection quickly, especially for pigeon problems, child safety on balconies and wide terrace coverage. We do not use harmful methods for bird control; nets act as a physical barrier when properly tensioned and maintained.",
    customerProblems: [
      "pigeon-infestation",
      "child-balcony-safety",
      "pet-balcony-safety",
      "open-window-risk",
      "building-bird-entry",
      "terrace-edge-protection",
    ],
    benefits: [
      "Effective coverage for balconies, ducts and terraces",
      "Humane bird control when installed correctly",
      "Allows ventilation compared with solid barriers",
      "Useful for both safety and hygiene concerns",
      "Can cover large building areas in phases",
    ],
    features: [
      "UV-stabilised net material",
      "Reinforced border rope and secure fixing",
      "Custom sizing for balconies, ducts and facade areas",
      "Options for homes, schools and commercial buildings",
      "Maintenance guidance after installation",
    ],
    applications: [
      "Balcony bird and safety protection",
      "Duct and AC ledge bird control",
      "Terrace edge and parapet coverage",
      "Window and staircase safety nets",
      "Commercial building facade protection",
    ],
    materials: [
      "UV-stabilised nylon or polyethylene nets",
      "Border rope and galvanised hooks",
      "Anchor accessories for long spans",
    ],
    specifications: [
      "Mesh size based on bird or safety requirement",
      "Net thickness based on exposure and span",
      "Hook or anchor interval based on tension plan",
      "Custom dimensions for each opening or facade section",
    ],
    installationSteps: [
      "Inspect site and identify priority coverage areas",
      "Measure openings and confirm net specification",
      "Fix hooks or anchors with border rope alignment",
      "Install and tension net panels securely",
      "Check coverage gaps and share maintenance tips",
    ],
    safetyInformation: [
      "Net tension and anchor quality are essential for performance",
      "Periodic checks are recommended after heavy wind or monsoon",
      "Do not overload nets with hanging items or storage",
    ],
    maintenanceTips: [
      "Inspect border rope and hooks every few months",
      "Clean accumulated dust and debris gently",
      "Repair minor tears early to avoid spreading",
    ],
    pricingFactors: [
      "Total net area and number of openings",
      "Access difficulty for ducts, facade or terrace",
      "Net thickness and fixing type",
      "Commercial scale and phased installation needs",
    ],
    suitablePropertyTypes: [
      "apartments",
      "villas",
      "independent-houses",
      "high-rise-apartments",
      "commercial-buildings",
      "schools",
    ],
    primaryKeywords: [
      "safety nets",
      "balcony safety nets",
      "pigeon nets",
    ],
    secondaryKeywords: [
      "bird net installation",
      "duct area safety nets",
      "building covering nets Andhra Pradesh",
      "terrace safety nets",
    ],
    customerQuestions: [
      "Are pigeon nets safe for birds?",
      "Which is better for balcony bird problem — net or grill?",
      "How long do safety nets last outdoors?",
      "Can safety nets be installed on any balcony?",
    ],
    searchIntents: ["commercial", "solution", "informational"],
    relatedServiceIds: [
      "service-invisible-grills",
      "service-sports-nets",
    ],
    subServices: SAFETY_NET_SUB_SERVICES,
    heroImage: "/images/projects/balcony-safety-nets-12.jpg",
    galleryImages: [
      "/images/projects/balcony-safety-nets-13.jpg",
      "/images/projects/duct-area-nets-1.jpg",
    ],
    contentReviewed: true,
    qualityScore: 91,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "service-sports-nets",
    slug: "sports-nets",
    name: "Sports Nets",
    shortName: "Sports Nets",
    categoryId: CATEGORY_PRIMARY,
    publicationStatus: "published",
    allowIndexing: true,
    summary:
      "Sports nets enable safe cricket, football and multi-sport practice in homes, schools and academies across Andhra Pradesh.",
    introduction:
      "Sports nets help contain balls, protect neighbouring property and create proper practice zones for cricket, football, volleyball, badminton and mixed-sport training. We design net enclosures based on available space, sport type and whether the setup is for home recreation, school playground use or commercial academy training.",
    detailedDescription:
      "Our sports net installations include cricket practice nets, box-cricket nets, football nets, volleyball nets, badminton nets, tennis nets, school playground nets, academy practice nets and indoor sports nets. Posts, net height and mesh specification are selected after measuring the ground or hall and understanding how frequently the setup will be used. For academies and schools, durability and safe entry layout are prioritised. For home plots, we focus on making the best use of limited space without compromising ball containment.",
    customerProblems: [
      "cricket-practice-space",
      "box-cricket-space",
      "school-playground-enclosure",
      "indoor-sports-setup",
    ],
    benefits: [
      "Safer practice with contained ball movement",
      "Better use of limited ground or hall space",
      "Reduced risk of damage to nearby property",
      "Custom design for home, school or academy use",
      "Supports daily training routines",
    ],
    features: [
      "Galvanised steel post structures",
      "Sport-specific net height and mesh selection",
      "Custom lane and court dimensions",
      "Indoor and outdoor installation options",
      "Gate and entry planning for academies",
    ],
    applications: [
      "Home cricket and box cricket setups",
      "School playground enclosures",
      "Sports academy practice lanes",
      "Indoor hall partition and training nets",
      "Multi-sport shared court coverage",
    ],
    materials: [
      "Heavy-duty sports net panels",
      "Galvanised steel posts and anchors",
      "Tension ropes and gate hardware",
    ],
    specifications: [
      "Net height based on sport and shot type",
      "Post spacing based on span and impact load",
      "Mesh size based on ball type",
      "Indoor or outdoor specification as required",
    ],
    installationSteps: [
      "Confirm sport type and available space",
      "Measure ground or hall and finalise layout",
      "Install posts and anchor foundations",
      "Fit net panels with proper tension",
      "Check entry gate clearance and handover usage guidance",
    ],
    safetyInformation: [
      "Keep entry gates closed during active practice",
      "Inspect post anchors after heavy wind or continuous use",
      "Do not climb net panels or hang equipment on them",
    ],
    maintenanceTips: [
      "Check net tension monthly in academy use",
      "Replace frayed net sections before full tear develops",
      "Lubricate gate hinges and inspect post bases periodically",
    ],
    pricingFactors: [
      "Ground or hall size and lane count",
      "Sport type and net height requirement",
      "Indoor versus outdoor specification",
      "Gate, partition and custom layout needs",
    ],
    suitablePropertyTypes: [
      "villas",
      "independent-houses",
      "schools",
      "sports-academies",
      "commercial-buildings",
    ],
    primaryKeywords: [
      "sports nets",
      "cricket practice net",
      "box cricket net",
    ],
    secondaryKeywords: [
      "school playground net",
      "academy practice net",
      "football net installation Andhra Pradesh",
      "indoor sports net",
    ],
    customerQuestions: [
      "What space is needed for a home cricket net?",
      "Can one ground support multiple sports nets?",
      "Do you install indoor sports nets in halls?",
      "Which net height is suitable for cricket practice?",
    ],
    searchIntents: ["commercial", "solution", "institutional"],
    relatedServiceIds: [
      "service-safety-nets",
      "service-cloth-drying-hangers",
    ],
    subServices: SPORTS_NET_SUB_SERVICES,
    heroImage: "/images/projects/cricket-nets-4.jpg",
    galleryImages: [
      "/images/projects/cricket-nets-5.jpg",
      "/images/projects/cricket-nets-8.jpg",
    ],
    contentReviewed: true,
    qualityScore: 90,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
  {
    id: "service-cloth-drying-hangers",
    slug: "cloth-drying-hangers",
    name: "Cloth Drying Hangers",
    shortName: "Cloth Hangers",
    categoryId: CATEGORY_PRIMARY,
    publicationStatus: "published",
    allowIndexing: true,
    summary:
      "Cloth drying hangers help apartments and homes dry clothes efficiently using ceiling, pulley, wall and balcony systems.",
    introduction:
      "Cloth drying hangers solve everyday laundry problems in flats and houses where floor space is limited and monsoon drying becomes difficult. We install ceiling-mounted, pulley, wall-mounted, balcony and foldable hanger systems using stainless steel components suited to daily family use.",
    detailedDescription:
      "Our cloth drying hanger service supports apartments, villas and independent houses across Andhra Pradesh with practical drying layouts for balconies, utility rooms and covered outdoor areas. Customers often search using terms like cloth hangers, clothes drying hangers and ceiling cloth hangers, but the canonical service remains cloth drying hangers. We recommend the right system after checking ceiling or wall condition, balcony width and whether the area is fully open, partially covered or indoors.",
    customerProblems: [
      "limited-drying-space",
      "monsoon-drying-issue",
    ],
    benefits: [
      "Uses vertical space efficiently in compact homes",
      "Reduces indoor clutter from temporary drying stands",
      "Stainless steel options for humid climates",
      "Daily-use pulley and ceiling layouts for families",
      "Better monsoon drying management in covered areas",
    ],
    features: [
      "Ceiling, pulley, wall and foldable options",
      "Stainless steel rods, hooks and brackets",
      "Layout planned for balcony and utility areas",
      "Load guidance for safe daily usage",
      "Neat installation for visible flat balconies",
    ],
    applications: [
      "Apartment balconies and utility rooms",
      "Villa utility and terrace-side drying zones",
      "Covered balcony monsoon drying",
      "Compact flat laundry management",
    ],
    materials: [
      "Stainless steel rods and hooks",
      "Pulley sets and nylon or steel rope",
      "Ceiling and wall anchor brackets",
    ],
    specifications: [
      "Line count and length based on family laundry load",
      "Mounting type based on ceiling or wall condition",
      "Component grade selected for humidity exposure",
      "Foldable or fixed layout based on space sharing needs",
    ],
    installationSteps: [
      "Check balcony or utility area layout",
      "Confirm ceiling or wall fixing feasibility",
      "Recommend hanger type and line configuration",
      "Install brackets, pulleys and rods securely",
      "Demonstrate smooth daily operation and load limits",
    ],
    safetyInformation: [
      "Do not exceed recommended load capacity",
      "Ensure children do not swing on pulley lines or rods",
      "Inspect anchors if heavy wet loads are used regularly",
    ],
    maintenanceTips: [
      "Wipe rods and pulleys periodically",
      "Check anchor tightness after monsoon season",
      "Apply basic lubrication if pulley movement stiffens",
    ],
    pricingFactors: [
      "Number of lines and total span",
      "Ceiling, wall or pulley system type",
      "Stainless steel component grade",
      "Access and installation complexity",
    ],
    suitablePropertyTypes: [
      "apartments",
      "villas",
      "independent-houses",
      "high-rise-apartments",
    ],
    primaryKeywords: [
      "cloth drying hangers",
      "ceiling cloth hanger",
      "balcony cloth hanger",
    ],
    secondaryKeywords: [
      "pulley cloth hanger",
      "stainless steel cloth hanger",
      "apartment cloth drying hanger Andhra Pradesh",
      "clothes drying hangers",
    ],
    customerQuestions: [
      "Which cloth hanger is best for a flat balcony?",
      "Can pulley hangers be installed on covered balconies?",
      "Will stainless steel hangers rust in humid weather?",
      "How many lines are needed for a family of four?",
    ],
    searchIntents: ["commercial", "solution", "comparison"],
    relatedServiceIds: [
      "service-invisible-grills",
      "service-safety-nets",
    ],
    subServices: CLOTH_HANGER_SUB_SERVICES,
    heroImage: "/images/projects/cloth-hangers-9.jpeg",
    galleryImages: [
      "/images/projects/cloth-hangers-11.jpeg",
      "/images/projects/cloth-hangers-1.jpg",
    ],
    contentReviewed: true,
    qualityScore: 89,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  },
];

export const INITIAL_SERVICE_MAP: Record<string, Service> = Object.fromEntries(
  INITIAL_SERVICES.map((service) => [service.slug, service]),
);

export const INITIAL_SERVICE_SLUGS = INITIAL_SERVICES.map((service) => service.slug);

export const ALL_SUB_SERVICES: SubService[] = INITIAL_SERVICES.flatMap(
  (service) => service.subServices,
);

export const SUB_SERVICE_MAP: Record<string, SubService> = Object.fromEntries(
  ALL_SUB_SERVICES.map((subService) => [subService.slug, subService]),
);
