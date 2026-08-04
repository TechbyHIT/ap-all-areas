export type FaqItem = {
  question: string;
  answer: string;
};

const PRICING_STATEMENT =
  "Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.";

export const SERVICE_FAQS: Record<string, FaqItem[]> = {
  "invisible-grills": [
    {
      question: "What are invisible grills and where are they commonly used?",
      answer:
        "Invisible grills use slim stainless-steel wires or cables fixed across open edges so the view stays largely open while the gap becomes harder to pass through. In Andhra Pradesh homes they are commonly planned for balconies, windows, staircases, terraces and selected high-rise openings where families want fall protection without a heavy iron grill look.",
    },
    {
      question: "How do you measure for invisible grills?",
      answer:
        "We measure the clear opening width and height, note parapet or railing height, check corner returns, and review wall or frame condition at proposed anchor points. Photographs and sketches help when multiple openings need quotation. Final material quantity is confirmed after on-site measurement, not from drawings alone.",
    },
    {
      question: "Which material options are used for invisible grills?",
      answer:
        "Installations typically use stainless-steel wire systems with compatible anchors, end fittings and frame hardware. Exact grade and finish should be selected for the exposure of your building—especially near the coast—rather than assumed from a catalogue name. We discuss suitable options during the site visit based on location and usage.",
    },
    {
      question: "How is wire thickness and spacing decided?",
      answer:
        "Wire thickness and spacing are selection factors, not one fixed standard for every home. Closer spacing is often preferred where young children or pets are present. Thickness and tension need to suit span length, fixing strength and daily use. Recommended values are discussed during measurement after seeing the actual opening.",
    },
    {
      question: "Are invisible grills suitable for child safety?",
      answer:
        "They can reduce fall risk at balconies and windows when spacing, fixing strength and coverage are planned carefully. No product replaces adult supervision. We focus on covering reachable openings first and explaining what the system can and cannot do for your layout.",
    },
    {
      question: "Can invisible grills help with pet safety?",
      answer:
        "Yes, many pet owners install them where cats or dogs can reach balcony edges or open windows. Spacing should consider the size and behaviour of the pet. We still recommend supervising pets outdoors and checking that doors and side gaps are addressed in the same plan.",
    },
    {
      question: "Do invisible grills work in high-rise apartments?",
      answer:
        "They are frequently requested in high-rise flats, but access, wind exposure, parapet design and society guidelines all affect the plan. Scaffolding or rope access needs, if any, are assessed during site inspection. Height and access also influence installation complexity and quotation.",
    },
    {
      question: "What about coastal areas in Andhra Pradesh?",
      answer:
        "Coastal humidity, salt air and rain can stress metal fittings faster than dry inland locations. Material selection, fastener quality and cleaning habits matter more near the coast. We recommend discussing rust-resistance expectations openly during quotation rather than promising a fixed lifespan.",
    },
    {
      question: "Will invisible grills rust?",
      answer:
        "Stainless-steel systems are chosen for better corrosion resistance than ordinary mild steel, but no outdoor metal installation is completely maintenance-free. Coastal air, standing water, poor cleaning or mismatched fasteners can still cause staining or corrosion over time. Routine wiping and periodic inspection help.",
    },
    {
      question: "How is installation done without damaging the balcony much?",
      answer:
        "Fixing points are marked after checking concrete, railing or frame strength. Holes are drilled only where anchors are needed, then fittings are secured and wires tensioned evenly. Neat finishing and debris cleanup are part of a proper job. Fragile tiles or weak parapets may need an alternative fixing approach.",
    },
    {
      question: "Can invisible grills be installed on staircases and terraces?",
      answer:
        "Yes, staircase sides, landings and terrace edges can be covered when the structure allows secure anchoring. Each of these applications needs its own measurement because spans, heights and usage patterns differ from a standard balcony.",
    },
    {
      question: "How should invisible grills be cleaned and maintained?",
      answer:
        "Wipe wires and fittings with a soft cloth and mild soapy water, then dry the surface. Avoid harsh acids, wire brushes or abrasive pads that can damage finish. Periodically check tension, end caps and anchors, especially after heavy rain or storms. Report looseness early rather than waiting for a larger issue.",
    },
    {
      question: "How long do invisible grills last?",
      answer:
        "Lifespan varies with material quality, coastal or inland exposure, installation care and maintenance. It is more honest to talk about durability factors than to quote a fixed number of years. Well-installed systems with regular cleaning generally remain serviceable longer than neglected ones in harsh weather.",
    },
    {
      question: "How does the quotation process work?",
      answer:
        "Share opening details or request a site visit. After measurement we confirm coverage area, recommended spacing approach, material option and access needs, then share a clear quotation. Society permissions, if required, should be arranged by the resident before installation day.",
    },
    {
      question: "What factors affect invisible grill pricing?",
      answer: PRICING_STATEMENT,
    },
    {
      question: "Are invisible grills better than traditional iron grills?",
      answer:
        "They offer a lighter visual appearance and are often preferred when view and ventilation matter. Traditional grills may still suit some security or design preferences. The better choice depends on your safety goal, look, maintenance comfort and budget—not a single rule for every flat or villa.",
    },
  ],

  "safety-nets": [
    {
      question: "What problems do safety nets solve in homes?",
      answer:
        "Safety nets are used for balcony fall protection, pigeon and bird control, child and pet safety at open edges, terrace coverage, duct-area protection, staircase openings, window openings and selected open areas around a building. The mesh type and fixing method should match the purpose, not just the lowest price.",
    },
    {
      question: "How do you measure for a safety net installation?",
      answer:
        "We measure span length and height, note shape irregularities, check fixing surfaces such as walls, railings or slabs, and identify obstacles like AC outdoor units or pipes. For bird nets, nesting zones and entry points are also reviewed. Accurate measurement prevents gaps that reduce effectiveness.",
    },
    {
      question: "How is mesh size selected?",
      answer:
        "Mesh size is a selection factor based on use—closer mesh for small birds or child safety priorities, and different choices for general balcony covering. We do not lock every project to one mesh number without seeing the requirement. Purpose, ventilation need and appearance are discussed on site.",
    },
    {
      question: "Are safety nets useful against pigeons and other birds?",
      answer:
        "Properly tensioned bird or pigeon nets can discourage nesting and roosting when entry points are covered completely. Partial covering often leaves birds alternative routes. Cleaning droppings and sealing leftover gaps improves results after installation.",
    },
    {
      question: "Can safety nets help protect children and pets?",
      answer:
        "Yes, balcony, window and staircase nets are commonly chosen for child and pet safety when the opening needs a flexible barrier. Supervision remains essential. Spacing, tension and secure hooks matter as much as the net material itself.",
    },
    {
      question: "Where can safety nets be installed besides balconies?",
      answer:
        "Common applications include terraces, duct areas, staircase voids, windows, open corridors and selected building-covering jobs where birds or fall risks need addressing. Each application needs its own fixing plan and access assessment.",
    },
    {
      question: "Do weather and UV exposure affect safety nets?",
      answer:
        "Sunlight, rain, humidity and coastal air all influence how long a net remains in good condition. UV-stabilised materials are generally preferred for outdoor use in Andhra Pradesh. Even then, tension loss, fraying or fastener corrosion can appear over time, so periodic inspection is sensible.",
    },
    {
      question: "What coastal considerations apply in Andhra Pradesh?",
      answer:
        "Near the coast, salt-laden air can affect metal hooks, frames and fasteners faster. Choosing suitable hardware and planning easier cleaning access helps. We discuss exposure honestly during quotation instead of promising identical performance inland and on the coast.",
    },
    {
      question: "How is a safety net installed?",
      answer:
        "After measurement, fixing points are marked, hooks or frames are secured, and the net is stretched evenly without excessive sagging. Edges are finished so children or pets cannot push through gaps. Access equipment depends on height and site conditions.",
    },
    {
      question: "How should safety nets be cleaned?",
      answer:
        "Remove leaves, plastic bits and bird droppings regularly using a soft brush or mild soap solution where needed. Avoid sharp tools that cut the mesh. Keep drainage paths clear so water does not pool against fittings. Heavy soiling near coastal homes may need more frequent attention.",
    },
    {
      question: "When should a safety net be repaired or replaced?",
      answer:
        "Replace or repair when you notice cuts, loose tension, damaged hooks, UV brittleness or gaps that compromise safety or bird control. Waiting until the net fails completely can leave openings unprotected. A quick visual check every few months is a practical habit.",
    },
    {
      question: "How long do safety nets usually last?",
      answer:
        "Useful life depends on material quality, UV exposure, coastal conditions, installation tension and cleaning. Giving a single guaranteed year count for every site would be misleading. Well-maintained outdoor nets generally outlast neglected ones in harsh sun or salt air.",
    },
    {
      question: "Will nets block ventilation or the view completely?",
      answer:
        "Nets allow air movement compared with solid panels, though denser mesh is more visible. The balance between bird control, safety and openness is part of material selection. We help you choose based on priority rather than forcing one look for every balcony.",
    },
    {
      question: "How do I get a quotation for safety nets?",
      answer:
        "Share photos and approximate sizes, or schedule a site visit for accurate measurement. The quotation should reflect purpose (safety, birds or both), mesh approach, fixing method and access difficulty. Society rules for exterior work should be checked before installation.",
    },
    {
      question: "What affects safety net pricing?",
      answer: PRICING_STATEMENT,
    },
    {
      question: "Can safety nets cover large building faces or open areas?",
      answer:
        "Larger covering jobs are possible when structure, access and tensioning points allow a secure layout. These projects need more detailed planning than a single balcony. Site inspection is essential before committing to scope and timeline.",
    },
  ],

  "sports-nets": [
    {
      question: "Which sports can your nets be planned for?",
      answer:
        "We support cricket practice nets, box-cricket enclosures, football, volleyball, badminton, tennis and multi-sport court setups for schools, colleges, academies, clubs and residential play areas. The net plan changes with sport, ball type and whether the space is indoor or outdoor.",
    },
    {
      question: "How are sports nets measured?",
      answer:
        "Measurement covers playing length and width, required enclosure height, pole positions, clearance from walls or buildings, and any rooftop or boundary constraints. Custom sizes are normal because practice pitches and courts rarely match a single catalogue dimension.",
    },
    {
      question: "Do you install cricket and box-cricket nets?",
      answer:
        "Yes. Cricket practice and box-cricket setups need careful height planning, ball-stop coverage and secure pole or support layout. Surrounding property safety matters as much as the playing area itself, especially on rooftops or compact urban plots.",
    },
    {
      question: "Can sports nets be used on rooftops?",
      answer:
        "Rooftop installations are common where ground space is limited, but slab strength, parapet condition, wind exposure and neighbour safety must be checked first. Not every terrace is suitable without structural review. Site inspection comes before final design.",
    },
    {
      question: "What about school, college and academy grounds?",
      answer:
        "Institutional projects often need durable boundary or practice enclosures that suit daily student use. We plan around access for coaches, storage of equipment and maintenance routines. Quotation usually follows a ground visit rather than phone estimates alone.",
    },
    {
      question: "How do you choose mesh for different sports?",
      answer:
        "Mesh selection depends on ball size, impact level, visibility needs and indoor versus outdoor use. Cricket and football demands differ from badminton or tennis. We discuss options as factors during planning instead of locking every court to one mesh specification without context.",
    },
    {
      question: "Are weather-resistant materials available for outdoor courts?",
      answer:
        "Outdoor nets should be chosen with sun, rain and humidity in mind. Coastal Andhra Pradesh sites may also need more attention to metal poles and fasteners. Material suitability is reviewed against actual exposure rather than assumed from product names alone.",
    },
    {
      question: "How is pole and height planning handled?",
      answer:
        "Pole spacing, foundation or base fixing, and enclosure height are planned from the sport and site boundaries. Height must contain typical ball travel without creating unsafe overhangs onto neighbouring property. These details are finalised after seeing the ground or terrace.",
    },
    {
      question: "Can one enclosure support more than one sport?",
      answer:
        "Multi-sport layouts are possible when dimensions and net height can reasonably serve more than one game. Compromises may be needed. We explain trade-offs clearly so schools or societies can decide based on primary use.",
    },
    {
      question: "What maintenance do sports nets need?",
      answer:
        "Check for tears, loose ties, leaning poles and damaged ground fixings after heavy play or storms. Remove debris that holds moisture against the mesh. Repair small damage early. Indoor nets still need tension and attachment checks even without weather exposure.",
    },
    {
      question: "How should sports nets be cleaned?",
      answer:
        "Brush off dust and leaves; wash gently with mild soap and water when soiled. Avoid harsh chemicals that weaken fibres. Keep pole bases clear of mud and standing water, especially during monsoon months.",
    },
    {
      question: "How long do sports nets last?",
      answer:
        "Lifespan depends on play intensity, UV exposure, coastal air, installation quality and maintenance. High-usage academy nets may need attention sooner than lightly used residential setups. We prefer discussing care habits over quoting unverified year guarantees.",
    },
    {
      question: "What does the quotation process include?",
      answer:
        "After understanding the sport and visiting the site where needed, we outline enclosure size, height approach, support system, mesh direction and access needs. Optional partitions or entry points can be included. Written scope helps avoid confusion during installation.",
    },
    {
      question: "What factors affect sports net pricing?",
      answer: PRICING_STATEMENT,
    },
    {
      question: "Do you handle indoor as well as outdoor sports nets?",
      answer:
        "Yes. Indoor halls focus more on attachment points, ceiling or wall fixing and safe clearances, while outdoor courts add weather and foundation considerations. The measurement and safety checks differ, so each space is planned on its own terms.",
    },
    {
      question: "Can boundary and ball-stop nets protect nearby property?",
      answer:
        "Boundary and ball-stop nets are often requested to reduce balls leaving the play area. Effectiveness depends on height, coverage continuity and local wind. They improve containment but cannot guarantee that every ball stays inside under all conditions.",
    },
  ],

  "cloth-drying-hangers": [
    {
      question: "What types of cloth drying hangers do you install?",
      answer:
        "We install ceiling-mounted, wall-mounted, pulley and stainless-steel balcony systems suited to apartments and independent houses. Manual lifting and space-saving designs are common where utility balconies are compact. The right type depends on ceiling or wall strength and how you dry clothes daily.",
    },
    {
      question: "How do you measure for a cloth drying hanger?",
      answer:
        "We measure available length and width, ceiling height, obstruction from beams or lights, balcony depth and clear lifting path for pulley systems. Load path and fixing surface matter as much as rod length. Custom measurement avoids a hanger that looks fine on paper but fouls doors or AC units.",
    },
    {
      question: "Are ceiling-mounted hangers suitable for all apartments?",
      answer:
        "Only when the ceiling or slab can take the planned load and society rules allow drilling. Hollow sections, weak false ceilings or unknown slab condition need careful checking. If ceiling fixing is unsuitable, wall-mounted or alternate layouts may be safer.",
    },
    {
      question: "How do pulley cloth hangers work?",
      answer:
        "Pulley systems let you raise and lower the drying frame so loading clothes is easier at hand level, then lift them for airing. Rope or cable condition, smooth travel and secure ceiling anchors are important. We explain operation and basic care during handover.",
    },
    {
      question: "What load should I consider for drying clothes?",
      answer:
        "Hangers should be planned for realistic wet-clothes loads, not overloaded beyond sensible use. Exact capacity depends on design, fixing strength and span. During site visit we talk about typical household use rather than promising unverified maximum weights.",
    },
    {
      question: "Will stainless-steel hangers resist rust in coastal Andhra Pradesh?",
      answer:
        "Stainless-steel components generally handle humidity better than ordinary mild steel, but coastal salt air still demands cleaning and good fastener choice. Occasional wiping after rainy or salty weather helps. No outdoor utility fitting stays pristine forever without care.",
    },
    {
      question: "Can hangers fit small balconies?",
      answer:
        "Space-saving wall or compact ceiling layouts are often used on narrow apartment balconies. The design should leave walking space and not block windows or drainage. Measurement decides whether a single run, double run or foldable approach fits better.",
    },
    {
      question: "How is installation carried out?",
      answer:
        "Fixing points are marked after checking the surface, anchors are installed, frames or rods are aligned, and moving parts are tested for smooth operation. We clean drilling dust and confirm that the hanger sits level. Weak mounting surfaces may require a revised plan.",
    },
    {
      question: "What maintenance do cloth drying hangers need?",
      answer:
        "Check screws, wall plugs or ceiling anchors periodically. Keep pulley ropes or cables free of fray. Wipe rods to remove dust and detergent residue. Do not swing on the hanger or use it as a gym bar—these systems are for drying clothes.",
    },
    {
      question: "How should I clean the hanger?",
      answer:
        "Use a damp cloth with mild soap for rods and frames, then dry. Avoid abrasive scrubbers on finished stainless surfaces. For pulley systems, keep rope paths clear of lint build-up so movement stays smooth.",
    },
    {
      question: "How long do cloth drying hangers last?",
      answer:
        "Durability depends on material, fixing quality, coastal or inland exposure, load habits and maintenance. A carefully used indoor utility hanger often ages differently from a fully exposed coastal balcony unit. Honest care advice matters more than a blanket year claim.",
    },
    {
      question: "How do I get a quotation?",
      answer:
        "Share balcony or utility photos with rough sizes, or book a measurement visit. The quotation should mention hanger type, approximate span, fixing approach and any access notes. Final confirmation follows site measurement.",
    },
    {
      question: "What affects cloth drying hanger pricing?",
      answer: PRICING_STATEMENT,
    },
    {
      question: "Can you customise hangers for unusual balcony shapes?",
      answer:
        "Yes, L-shaped, narrow or obstructed balconies often need custom rod lengths and fixing positions. The goal is usable drying length without blocking movement. Custom work starts with accurate measurement rather than forcing a standard kit into every space.",
    },
  ],
};

export const GENERAL_FAQS: FaqItem[] = [
  {
    question: "Which services do you provide across Andhra Pradesh?",
    answer:
      "We provide invisible grills, safety nets, sports nets and cloth drying hangers for homes, apartments, villas, institutions and selected commercial spaces. Coverage is on a service-area basis and final availability is confirmed after understanding the site location and access.",
  },
  {
    question: "Do you have a branch in every city?",
    answer:
      "No. We serve customers across Andhra Pradesh as a service-area business. That means installation support can be arranged in many districts and cities subject to site confirmation, without claiming a physical shop or office in every locality.",
  },
  {
    question: "How do I know whether I need invisible grills or safety nets?",
    answer:
      "Invisible grills are often chosen when a slim, view-friendly barrier is preferred at balconies or windows. Safety nets are frequently chosen for bird control, wider coverage or a more flexible barrier. Many families compare both after a site look. We explain practical differences without pushing one product for every home.",
  },
  {
    question: "Do you serve apartments as well as independent houses?",
    answer:
      "Yes. Apartments, villas, duplex homes and independent houses all have different railing, parapet and access conditions. Society permissions, lift access and exterior work rules are especially important in apartments and should be checked before installation day.",
  },
  {
    question: "Is a site visit necessary before quotation?",
    answer:
      "For most balcony, high-rise, terrace or sports projects, on-site measurement gives a more reliable quotation than phone estimates. Photo-based guidance can start the conversation, but final scope is best confirmed after seeing fixing surfaces and access.",
  },
  {
    question: "How should I prepare for measurement?",
    answer:
      "Clear stored items from the working edge, note any society rules, and keep pets away from the measurement area. If multiple openings need work, list priority rooms in advance. Sharing photos beforehand helps the visit stay focused.",
  },
  {
    question: "What information appears in a typical quotation?",
    answer:
      "A clear quotation usually covers the openings or area to be covered, suggested system type, material direction, key inclusions and exclusions, and commercial terms. Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.",
  },
  {
    question: "Do you publish fixed package prices online?",
    answer:
      "No. Fixed online packages often mislead because balconies, mesh needs and access differ widely. We use transparent factor-based pricing and confirm numbers after measurement rather than advertising unverified flat rates.",
  },
  {
    question: "Can you work in coastal cities of Andhra Pradesh?",
    answer:
      "Yes, coastal work is common, but material and maintenance expectations should be discussed openly. Salt air and humidity can affect metal fittings and outdoor nets faster than dry inland sites. Cleaning habits become part of long-term performance.",
  },
  {
    question: "Are your products suitable for child and pet safety?",
    answer:
      "Invisible grills and safety nets are frequently installed for child and pet safety at open edges. Suitability still depends on spacing, tension, coverage continuity and fixing strength. These solutions support safer homes but do not replace supervision.",
  },
  {
    question: "Do you install sports nets for schools and academies?",
    answer:
      "Yes. Cricket, box-cricket, football, volleyball, badminton, tennis and multi-sport enclosures can be planned for schools, colleges and academies. Ground or rooftop suitability is checked before finalising poles, height and mesh approach.",
  },
  {
    question: "What about cloth drying hangers for compact flats?",
    answer:
      "Ceiling-mounted, pulley, wall-mounted and balcony stainless-steel systems are commonly used in apartments where drying space is limited. Ceiling compatibility and safe load path are checked before drilling.",
  },
  {
    question: "How long does installation usually take?",
    answer:
      "Duration depends on the number of openings, height, access method and product type. A single balcony may be completed faster than a full flat, terrace bird-netting job or school sports enclosure. Timeline is shared after scope is clear.",
  },
  {
    question: "Will installation make a lot of dust or noise?",
    answer:
      "Drilling and fixing create some noise and dust, especially in apartments. We plan cleaner work practices and ask residents to cover nearby belongings when needed. High-rise exterior access can add extra coordination time.",
  },
  {
    question: "How should I maintain these installations?",
    answer:
      "Wipe metal parts, remove debris from nets, check for looseness after storms, and avoid overloading cloth hangers. Coastal homes benefit from more frequent cleaning. Early reporting of damage is cheaper than waiting for full failure.",
  },
  {
    question: "Do you help with society or builder permissions?",
    answer:
      "Residents or facility managers usually obtain society or builder permissions. We can share basic work descriptions and installation notes to support your application, but approval remains the property stakeholder’s responsibility.",
  },
  {
    question: "What payment or booking details should I confirm?",
    answer:
      "Confirm scope, material direction, inclusions, measurement basis and warranty or support terms in writing before work starts. Avoid verbal-only agreements on large projects. Ask for clarity on what happens if site conditions differ from the first visit.",
  },
  {
    question: "How do I start the process?",
    answer:
      "Contact us with your city or area, service needed and a few photos if available. We will guide you on whether a site visit is needed, then proceed with measurement, quotation and scheduled installation after you approve the scope.",
  },
];

function normalizeServiceKey(serviceName: string): string {
  const key = serviceName.trim().toLowerCase();
  if (key.includes("invisible")) return "invisible-grills";
  if (key.includes("safety") && key.includes("net")) return "safety-nets";
  if (key.includes("sport")) return "sports-nets";
  if (key.includes("cloth") || key.includes("hanger") || key.includes("drying"))
    return "cloth-drying-hangers";
  return key;
}

function cityFaqsInvisibleGrills(serviceName: string, cityName: string): FaqItem[] {
  return [
    {
      question: `Is ${serviceName} installation available in ${cityName}?`,
      answer: `Yes, ${serviceName.toLowerCase()} installation support is available for customers in ${cityName}, subject to site confirmation. Balcony design, society guidelines and access conditions can vary across neighbourhoods, so we confirm practicality after reviewing the property details.`,
    },
    {
      question: `How do you plan ${serviceName.toLowerCase()} for apartments in ${cityName}?`,
      answer: `In ${cityName}, apartment work usually starts with railing or parapet checks, opening measurements and a quick review of exterior access. We also ask whether your society has rules for drilling or facade work before finalising the installation plan.`,
    },
    {
      question: `Can families in ${cityName} use ${serviceName.toLowerCase()} for child safety?`,
      answer: `${serviceName} can support child safety at balconies and windows in ${cityName} homes when spacing and fixing are planned carefully. We prioritise reachable openings first and explain that supervision remains important after installation.`,
    },
    {
      question: `Are pet-friendly ${serviceName.toLowerCase()} options discussed for ${cityName} homes?`,
      answer: `Yes. Pet owners in ${cityName} often ask about closer spacing and full-edge coverage where cats or dogs use the balcony. We match the discussion to pet size and behaviour rather than using one spacing approach for every flat.`,
    },
    {
      question: `Do coastal or humid conditions around ${cityName} affect material choice?`,
      answer: `If your ${cityName} property faces humid, rainy or coastal-influenced air, material and fastener selection deserve extra attention. We discuss rust-resistance expectations honestly during quotation instead of promising identical performance in every micro-location.`,
    },
    {
      question: `How is measurement handled for ${serviceName.toLowerCase()} in ${cityName}?`,
      answer: `We measure each opening on site in ${cityName}, note corner returns and check anchor surfaces. Photos help for preliminary discussion, but final quantity and spacing recommendations follow physical measurement.`,
    },
    {
      question: `What should ${cityName} residents prepare before installation day?`,
      answer: `Clear the balcony or window area, arrange society permissions if required, and keep children and pets away from the work zone. Lift or stair access notes for ${cityName} apartment buildings help the team plan tools and timing.`,
    },
    {
      question: `How does quotation work for ${serviceName.toLowerCase()} in ${cityName}?`,
      answer: `After understanding your openings in ${cityName}, we share a quotation based on measured scope and site conditions. ${PRICING_STATEMENT}`,
    },
    {
      question: `Can villas as well as flats in ${cityName} get ${serviceName.toLowerCase()}?`,
      answer: `Yes. Villas and independent houses in ${cityName} may need staircase, terrace or taller window coverage in addition to balconies. Each property type gets its own fixing assessment rather than a copy-paste apartment layout.`,
    },
    {
      question: `How should ${serviceName.toLowerCase()} be maintained in ${cityName} weather?`,
      answer: `Wipe wires and fittings periodically, especially after dusty or rainy spells common in many ${cityName} seasons. Check tension and anchors if you notice movement. Prompt attention to looseness keeps the system dependable.`,
    },
    {
      question: `Will ${serviceName.toLowerCase()} block the view from my ${cityName} balcony?`,
      answer: `Invisible grill systems are chosen because they keep the view more open than bulky traditional grills. From a ${cityName} balcony you will still see the wires at closer range, but most households find the trade-off acceptable for the safety gain.`,
    },
    {
      question: `Can high-rise buildings in ${cityName} be covered?`,
      answer: `High-rise openings in ${cityName} can be covered when access and fixing conditions allow. Wind exposure and working height influence both method and quotation, so these projects need a proper site review before commitment.`,
    },
  ];
}

function cityFaqsSafetyNets(serviceName: string, cityName: string): FaqItem[] {
  return [
    {
      question: `Do you install ${serviceName.toLowerCase()} in ${cityName}?`,
      answer: `${serviceName} installation is available for customers in ${cityName}, subject to site confirmation. We review the purpose—fall protection, bird control or both—before recommending mesh approach and fixing method.`,
    },
    {
      question: `Can ${serviceName.toLowerCase()} help with pigeon problems in ${cityName}?`,
      answer: `Yes. Many ${cityName} residents use pigeon or bird nets on balconies, ledges and duct openings. Results are best when entry routes are covered completely and leftover gaps are closed during installation.`,
    },
    {
      question: `Are balcony ${serviceName.toLowerCase()} suitable for children in ${cityName}?`,
      answer: `Balcony nets are commonly chosen by families in ${cityName} for child safety at open edges. Tension, hook strength and continuous coverage matter. Adult supervision should continue after the net is fitted.`,
    },
    {
      question: `How do you measure ${serviceName.toLowerCase()} projects in ${cityName}?`,
      answer: `On-site measurement in ${cityName} covers span, height, shape and fixing surfaces. We also note AC units, pipes or grills that affect the layout so the finished net does not leave awkward gaps.`,
    },
    {
      question: `Does ${cityName} weather affect outdoor nets?`,
      answer: `Sun, rain and humidity in and around ${cityName} can age outdoor nets and metal fittings over time. UV-aware material choices and periodic cleaning help. Coastal-influenced localities may need closer hardware attention.`,
    },
    {
      question: `Can terrace and duct areas in ${cityName} be covered?`,
      answer: `Yes. Terrace, duct-area, staircase and window netting are all common requests in ${cityName}. Each zone needs its own access and fixing plan rather than assuming a balcony method will fit everywhere.`,
    },
    {
      question: `How is cleaning handled after ${serviceName.toLowerCase()} installation in ${cityName}?`,
      answer: `Residents should remove leaves, litter and bird droppings regularly. In dustier periods in ${cityName}, a soft brush helps keep mesh open for ventilation. Avoid sharp tools that cut the net.`,
    },
    {
      question: `What influences ${serviceName.toLowerCase()} pricing in ${cityName}?`,
      answer: `Local access, opening size and purpose all affect commercials for ${cityName} projects. ${PRICING_STATEMENT}`,
    },
    {
      question: `When should ${cityName} customers repair or replace nets?`,
      answer: `Repair or replace when you see cuts, sagging, damaged hooks or gaps that reduce safety or bird control. Waiting too long leaves the opening exposed. A quick seasonal check is a practical habit for ${cityName} homes.`,
    },
    {
      question: `Do society rules in ${cityName} affect net installation?`,
      answer: `Apartment societies in ${cityName} may have rules for exterior fittings and contractor timings. Residents should obtain required permissions. We can describe the proposed work to support your internal approval process.`,
    },
    {
      question: `Can pets be safer with ${serviceName.toLowerCase()} in ${cityName} flats?`,
      answer: `Pet safety nets are a frequent request in ${cityName} apartments where pets use balconies. Coverage should include side gaps pets might squeeze through. Supervision remains part of responsible pet care.`,
    },
    {
      question: `How do I start a ${serviceName.toLowerCase()} enquiry from ${cityName}?`,
      answer: `Share your area within ${cityName}, photos of the openings and whether you need safety cover, bird control or both. We will advise if a site visit is needed before issuing a detailed quotation.`,
    },
  ];
}

function cityFaqsSportsNets(serviceName: string, cityName: string): FaqItem[] {
  return [
    {
      question: `Can ${serviceName.toLowerCase()} be installed for facilities in ${cityName}?`,
      answer: `Yes, ${serviceName.toLowerCase()} can be planned for schools, colleges, academies, clubs and residential play spaces in ${cityName}, subject to site confirmation. Sport type and ground or rooftop conditions guide the design.`,
    },
    {
      question: `Do you set up cricket or box-cricket nets in ${cityName}?`,
      answer: `Cricket practice and box-cricket enclosures are common requests in ${cityName}. We plan height, ball-stop coverage and supports around the actual playing space and neighbouring property lines.`,
    },
    {
      question: `Are rooftop sports nets possible in ${cityName}?`,
      answer: `Rooftop setups in ${cityName} are considered when slab condition, parapets and wind exposure look suitable. Not every terrace is ready without review, so inspection comes before final enclosure planning.`,
    },
    {
      question: `How are school and academy projects handled in ${cityName}?`,
      answer: `Institutional projects in ${cityName} usually need durable layouts for daily student use, clear entry points and practical maintenance access. Quotation follows a ground visit whenever possible.`,
    },
    {
      question: `How is mesh selected for ${serviceName.toLowerCase()} in ${cityName}?`,
      answer: `Mesh depends on ball type, impact level and whether the ${cityName} facility is indoor or outdoor. We treat mesh as a selection factor discussed on site rather than a single fixed specification for every sport.`,
    },
    {
      question: `What weather points matter for outdoor courts in ${cityName}?`,
      answer: `Sun, rain and humidity affect outdoor nets and metal poles around ${cityName}. Coastal-influenced sites need extra care with fasteners. Maintenance schedules should match local exposure.`,
    },
    {
      question: `How do you measure a sports enclosure in ${cityName}?`,
      answer: `Measurement covers playing dimensions, required height, pole positions and clearances from buildings or roads near the ${cityName} site. Custom sizing is normal for practice pitches and compact courts.`,
    },
    {
      question: `What affects ${serviceName.toLowerCase()} pricing in ${cityName}?`,
      answer: `Ground access, enclosure size and support complexity influence ${cityName} quotations. ${PRICING_STATEMENT}`,
    },
    {
      question: `Can one ${cityName} court support multiple sports?`,
      answer: `Multi-sport layouts are possible when dimensions and height can reasonably serve more than one game. We explain compromises so the school or society in ${cityName} can prioritise primary use.`,
    },
    {
      question: `How should sports nets be maintained in ${cityName}?`,
      answer: `Check for tears, loose ties and leaning poles after heavy play or storms. Remove debris and keep bases clear during monsoon periods in ${cityName}. Small repairs done early prevent larger downtime.`,
    },
    {
      question: `Do you install indoor sports nets in ${cityName}?`,
      answer: `Yes. Indoor halls in ${cityName} focus on safe attachments, clearances and tensioning suited to the sport. Weather is less of a factor, but fixing quality remains critical.`,
    },
    {
      question: `How do I request a sports net quotation in ${cityName}?`,
      answer: `Tell us the sport, approximate ground or terrace size, and location within ${cityName}. Photos help; a site visit confirms poles, height planning and mesh direction before final commercials.`,
    },
  ];
}

function cityFaqsClothHangers(serviceName: string, cityName: string): FaqItem[] {
  return [
    {
      question: `Are ${serviceName.toLowerCase()} available for homes in ${cityName}?`,
      answer: `Yes, ${serviceName.toLowerCase()} can be installed for apartments and houses in ${cityName}, subject to ceiling or wall suitability. We confirm fixing surfaces before recommending ceiling-mounted, pulley or wall-mounted options.`,
    },
    {
      question: `Which hanger type suits compact flats in ${cityName}?`,
      answer: `Compact ${cityName} balconies often work well with space-saving ceiling or wall systems, including pulley designs for easier loading. The final choice depends on measured depth, height and obstacles like AC units.`,
    },
    {
      question: `How do you check ceiling compatibility in ${cityName} apartments?`,
      answer: `We inspect whether the slab or ceiling can take anchors safely and whether a false ceiling limits fixing. If ceiling mounting is unsuitable in your ${cityName} flat, we discuss wall-mounted alternatives.`,
    },
    {
      question: `Do stainless-steel hangers handle ${cityName} humidity?`,
      answer: `Stainless-steel components generally cope better with humidity than ordinary mild steel, but ${cityName} homes still benefit from wiping after rainy spells. Coastal-influenced localities need a little more routine care.`,
    },
    {
      question: `How is measurement done for ${serviceName.toLowerCase()} in ${cityName}?`,
      answer: `We measure drying length, balcony width, ceiling height and lifting clearance for pulley systems. Custom measurement is important because utility areas in ${cityName} flats are rarely identical.`,
    },
    {
      question: `What load guidance do you give ${cityName} customers?`,
      answer: `We discuss realistic wet-clothes use for household drying rather than unverified maximum weights. Overloading shortens hardware life. Sensible daily loads matter more than stretching capacity.`,
    },
    {
      question: `How does pricing work for hangers in ${cityName}?`,
      answer: `Span, hanger type and fixing complexity shape quotations in ${cityName}. ${PRICING_STATEMENT}`,
    },
    {
      question: `Can L-shaped balconies in ${cityName} get custom hangers?`,
      answer: `Yes. Unusual balcony shapes are common and usually need custom rod lengths or split runs. Measurement on site in ${cityName} decides a layout that still leaves walking space.`,
    },
    {
      question: `What maintenance should ${cityName} residents follow?`,
      answer: `Check anchors periodically, keep pulley ropes free of fray, and wipe rods to remove dust and detergent residue. Do not swing on the hanger. Simple care keeps systems smoother for longer.`,
    },
    {
      question: `Will installation disturb neighbours in my ${cityName} apartment?`,
      answer: `Drilling creates some noise for a limited period. Many ${cityName} societies prefer work during allowed hours. Sharing the schedule with neighbours or the association helps avoid complaints.`,
    },
    {
      question: `Are manual lifting pulley hangers easy to use?`,
      answer: `Most households find pulley systems convenient once rope travel is smooth and the frame sits level. During handover in ${cityName} homes we show basic raising, lowering and care points.`,
    },
    {
      question: `How do I start a hanger enquiry from ${cityName}?`,
      answer: `Send balcony or utility photos with your locality in ${cityName}. We will suggest suitable hanger types and confirm whether a measurement visit is needed before quotation.`,
    },
  ];
}

export const CITY_SERVICE_FAQ_TEMPLATES: Record<
  string,
  (serviceName: string, cityName: string) => FaqItem[]
> = {
  "invisible-grills": cityFaqsInvisibleGrills,
  "safety-nets": cityFaqsSafetyNets,
  "sports-nets": cityFaqsSportsNets,
  "cloth-drying-hangers": cityFaqsClothHangers,
};

export function getCityServiceFaqs(serviceName: string, cityName: string): FaqItem[] {
  const key = normalizeServiceKey(serviceName);
  const template = CITY_SERVICE_FAQ_TEMPLATES[key];
  if (!template) {
    return cityFaqsSafetyNets(serviceName, cityName);
  }
  return template(serviceName, cityName);
}

function areaFaqsInvisibleGrills(
  serviceName: string,
  areaName: string,
  cityName: string,
): FaqItem[] {
  return [
    {
      question: `Can I get ${serviceName.toLowerCase()} in ${areaName}, ${cityName}?`,
      answer: `${serviceName} support can be arranged for ${areaName} in ${cityName} after site confirmation. Local building layouts differ, so we review your balcony or window condition before confirming installation details.`,
    },
    {
      question: `What balcony issues are common for ${serviceName.toLowerCase()} in ${areaName}?`,
      answer: `In ${areaName}, we commonly check railing gaps, parapet height, corner returns and outdoor unit placement before planning ${serviceName.toLowerCase()}. These details affect anchor positions and spacing recommendations.`,
    },
    {
      question: `Is a site visit needed in ${areaName}?`,
      answer: `For most ${areaName} homes in ${cityName}, a short measurement visit gives a clearer quotation than estimates from memory. Photos can start the discussion if you want a first opinion.`,
    },
    {
      question: `How child-safe can ${serviceName.toLowerCase()} be for families in ${areaName}?`,
      answer: `Child-focused planning in ${areaName} looks at reachable openings, spacing and secure fixing. The system reduces risk at covered edges but does not replace adult supervision in daily home life.`,
    },
    {
      question: `Do apartment societies in ${areaName} usually allow this work?`,
      answer: `Many societies in and around ${areaName} allow safety installations when residents follow their rules on timings and exterior fittings. Please obtain required approvals from your association before the installation date.`,
    },
    {
      question: `What affects pricing for ${areaName} installations?`,
      answer: `Openings in ${areaName}, ${cityName} vary in size and access. ${PRICING_STATEMENT}`,
    },
    {
      question: `How should residents of ${areaName} maintain ${serviceName.toLowerCase()}?`,
      answer: `Wipe wires and fittings periodically, watch for looseness after heavy rain, and keep end fittings clean. ${areaName} homes with more dust or sea-air influence may benefit from slightly more frequent cleaning.`,
    },
    {
      question: `Can pets use balconies safely after installation in ${areaName}?`,
      answer: `Pet-oriented spacing and side-gap coverage can make balconies in ${areaName} more secure, yet pets should still be supervised. Share pet size during measurement so the plan stays practical.`,
    },
    {
      question: `Will high-rise access in ${areaName} change the installation plan?`,
      answer: `Upper-floor access in ${areaName}, ${cityName} can influence tools, timing and complexity. We assess this during inspection rather than assuming every tower balcony is identical.`,
    },
    {
      question: `How do I request a quotation for ${areaName}?`,
      answer: `Share your building location in ${areaName}, ${cityName}, the openings to cover and a few photos. We will guide next steps for measurement and a written quotation.`,
    },
  ];
}

function areaFaqsSafetyNets(
  serviceName: string,
  areaName: string,
  cityName: string,
): FaqItem[] {
  return [
    {
      question: `Are ${serviceName.toLowerCase()} available in ${areaName}, ${cityName}?`,
      answer: `Yes, ${serviceName.toLowerCase()} can be planned for homes and selected buildings in ${areaName}, subject to site confirmation. We confirm purpose and fixing surfaces before finalising mesh and hooks.`,
    },
    {
      question: `Can bird netting help balconies in ${areaName}?`,
      answer: `Pigeon and bird netting is a frequent request in ${areaName} when ledges or open balconies attract nesting. Complete coverage of entry points works better than leaving side gaps open.`,
    },
    {
      question: `How do you measure nets for properties in ${areaName}?`,
      answer: `Measurement in ${areaName}, ${cityName} includes span, height and obstacles such as pipes or AC units. Accurate sizes reduce sagging and unfinished corners after installation.`,
    },
    {
      question: `Are child and pet safety nets used in ${areaName} apartments?`,
      answer: `Many families in ${areaName} choose balcony or window nets for children and pets. Tension and secure perimeter fixing are as important as the mesh itself.`,
    },
    {
      question: `Do terrace or duct areas in ${areaName} need a different approach?`,
      answer: `Yes. Terrace and duct-area netting around ${areaName} often needs different access and anchor planning than a standard living-room balcony. Each zone is assessed separately.`,
    },
    {
      question: `What pricing factors apply in ${areaName}?`,
      answer: `For ${areaName} in ${cityName}, scope and access drive the commercial side. ${PRICING_STATEMENT}`,
    },
    {
      question: `How should nets be cleaned in ${areaName} homes?`,
      answer: `Remove leaves, litter and droppings with a soft brush and mild cleaning where needed. Keeping mesh clear helps ventilation and makes inspection easier during ${cityName} weather changes.`,
    },
    {
      question: `When should ${areaName} residents consider net replacement?`,
      answer: `Consider repair or replacement when cuts, brittle fibres, loose hooks or gaps appear. Delayed action leaves balconies or ducts unprotected.`,
    },
    {
      question: `Will installation in ${areaName} require society permission?`,
      answer: `Apartment work in ${areaName} often needs association approval for exterior fittings. Residents should arrange this; we can share a simple description of the proposed netting work.`,
    },
    {
      question: `How do I start an enquiry from ${areaName}?`,
      answer: `Message us with your locality as ${areaName}, ${cityName}, photos of the openings and whether you need safety cover, bird control or both. We will advise on measurement and quotation.`,
    },
  ];
}

function areaFaqsSportsNets(
  serviceName: string,
  areaName: string,
  cityName: string,
): FaqItem[] {
  return [
    {
      question: `Can ${serviceName.toLowerCase()} be set up near ${areaName} in ${cityName}?`,
      answer: `${serviceName} projects can be planned for suitable grounds, schools or rooftop spaces serving ${areaName}, subject to site confirmation. Sport type and boundary conditions guide the enclosure design.`,
    },
    {
      question: `Are cricket practice nets possible for ${areaName} locations?`,
      answer: `Cricket and box-cricket nets are often requested for practice spaces connected to ${areaName}, ${cityName}. Height, ball-stop coverage and neighbour safety are reviewed before installation.`,
    },
    {
      question: `What site checks matter for sports nets in ${areaName}?`,
      answer: `We check playing dimensions, surface for poles or bases, overhead clearance and nearby buildings around ${areaName}. Rooftop ideas need extra structural and wind-related caution.`,
    },
    {
      question: `Can schools near ${areaName} request multi-sport netting?`,
      answer: `Yes. Schools and academies serving ${areaName} can plan multi-sport layouts when court size and height allow. Primary sport priority should be clear before mesh and height decisions.`,
    },
    {
      question: `How does weather around ${cityName} affect outdoor nets in ${areaName}?`,
      answer: `Outdoor nets near ${areaName} face sun, rain and humidity typical of the wider ${cityName} region. Poles and fasteners need inspection after storms, and debris should not sit against the mesh.`,
    },
    {
      question: `What affects sports net pricing for ${areaName}?`,
      answer: `Enclosure size and access at the ${areaName} site influence cost. ${PRICING_STATEMENT}`,
    },
    {
      question: `How is maintenance handled after installation near ${areaName}?`,
      answer: `Coaches or facility staff should check tears, ties and pole alignment regularly. Early repair keeps practice schedules steadier for groups using spaces around ${areaName}.`,
    },
    {
      question: `Do indoor halls near ${areaName} need different planning?`,
      answer: `Indoor projects focus on wall or ceiling attachments and safe clearances rather than weatherproofing. Measurement still needs to be exact for the hall serving ${areaName}.`,
    },
    {
      question: `Can ball-stop nets protect adjoining property in ${areaName}?`,
      answer: `Boundary and ball-stop netting can reduce balls leaving the play area near ${areaName}, though no enclosure guarantees capture of every ball in strong wind. Height planning is discussed on site.`,
    },
    {
      question: `How do I enquire for a sports net project from ${areaName}?`,
      answer: `Share the sport, approximate dimensions, and that the site is in ${areaName}, ${cityName}. Photos or a ground visit help us prepare a practical quotation.`,
    },
  ];
}

function areaFaqsClothHangers(
  serviceName: string,
  areaName: string,
  cityName: string,
): FaqItem[] {
  return [
    {
      question: `Do you install ${serviceName.toLowerCase()} in ${areaName}, ${cityName}?`,
      answer: `Yes, ${serviceName.toLowerCase()} can be installed for suitable apartments and houses in ${areaName} after checking ceiling or wall fixing points. Availability is confirmed with the site review.`,
    },
    {
      question: `Which hanger styles fit balconies in ${areaName}?`,
      answer: `Ceiling-mounted, pulley, wall-mounted and stainless-steel balcony systems are considered for ${areaName} homes based on measured space. Compact layouts are common where utility balconies are narrow.`,
    },
    {
      question: `How do you measure hangers for ${areaName} flats?`,
      answer: `We measure length, width, height and obstacles in the utility area. Custom sizing matters because balcony depths in ${areaName}, ${cityName} are not uniform across every society.`,
    },
    {
      question: `Can pulley hangers be used in ${areaName} apartments?`,
      answer: `Pulley systems are popular where residents want easier loading at hand level. Ceiling compatibility in your ${areaName} building must be checked before committing to this style.`,
    },
    {
      question: `How does humidity in ${cityName} affect hangers in ${areaName}?`,
      answer: `Humidity can stress ordinary mild steel faster. Stainless-steel options and routine wiping help ${areaName} households, especially if the balcony is open to rain.`,
    },
    {
      question: `What pricing factors apply for ${areaName}?`,
      answer: `Hanger type and span in ${areaName}, ${cityName} shape the quotation. ${PRICING_STATEMENT}`,
    },
    {
      question: `What load habits should ${areaName} residents follow?`,
      answer: `Dry normal household loads and avoid treating the hanger as a support bar for people or storage crates. Sensible use protects anchors and rods over time.`,
    },
    {
      question: `Will drilling for hangers disturb my ${areaName} neighbours?`,
      answer: `Drilling is usually brief but audible. Following society work hours in ${areaName} keeps the process smoother. Covering nearby clothes and vessels reduces dust annoyance.`,
    },
    {
      question: `How should hangers be maintained in ${areaName}?`,
      answer: `Wipe rods, inspect screws or ceiling anchors, and check pulley ropes for fray. Seasonal attention is enough for most homes if loads stay reasonable.`,
    },
    {
      question: `How do I request a hanger quotation from ${areaName}?`,
      answer: `Send photos of your balcony or utility room with your location as ${areaName}, ${cityName}. We will suggest suitable systems and confirm measurement next steps.`,
    },
  ];
}

export const AREA_SERVICE_FAQ_TEMPLATES: Record<
  string,
  (serviceName: string, areaName: string, cityName: string) => FaqItem[]
> = {
  "invisible-grills": areaFaqsInvisibleGrills,
  "safety-nets": areaFaqsSafetyNets,
  "sports-nets": areaFaqsSportsNets,
  "cloth-drying-hangers": areaFaqsClothHangers,
};

export function getAreaServiceFaqs(
  serviceName: string,
  areaName: string,
  cityName: string,
  extras?: {
    buildingStock?: string;
    accessNote?: string;
    commonNeeds?: string[];
  },
): FaqItem[] {
  const key = normalizeServiceKey(serviceName);
  const template = AREA_SERVICE_FAQ_TEMPLATES[key];
  const base = template
    ? template(serviceName, areaName, cityName)
    : areaFaqsSafetyNets(serviceName, areaName, cityName);

  if (!extras?.buildingStock && !extras?.accessNote) return base;

  const localFaqs: FaqItem[] = [
    {
      question: `What should installers know about buildings in ${areaName}?`,
      answer: extras.buildingStock
        ? `${areaName} is typically characterised by ${extras.buildingStock}. ${extras.accessNote ?? ""} ${
            extras.commonNeeds?.length
              ? `Residents often ask about ${extras.commonNeeds.slice(0, 3).join(", ")}.`
              : ""
          }`.replace(/\s+/g, " ").trim()
        : `${extras.accessNote ?? `Share building access notes for ${areaName}, ${cityName}.`}`,
    },
    {
      question: `Is ${areaName} covered across Andhra Pradesh service planning?`,
      answer: `Yes. ${areaName} in ${cityName} is part of our Andhra Pradesh installation coverage graph. Listing the area supports visit planning after photos and site confirmation—it is not a claim of a permanent shop on every street.`,
    },
  ];

  return [...localFaqs, ...base];
}
