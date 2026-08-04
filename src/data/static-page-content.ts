/**
 * Static marketing and guide content for the Andhra Pradesh safety products site.
 * Honest service-area wording only — no fake offices, ratings, years or invented stats.
 */

export type FaqItem = {
  question: string;
  answer: string;
};

export type TitleDescription = {
  title: string;
  description: string;
};

export type RelatedGuide = {
  title: string;
  href: string;
  summary: string;
};

export const HOMEPAGE_CONTENT = {
  businessIntroduction: `A balcony or window opening is both a source of light and air and, when unprotected, a fall-risk edge. Hiranya Enterprises helps Andhra Pradesh households choose the right barrier for that edge—stainless-steel invisible grills that keep the view largely open, safety nets that add a mesh plane for children and pets, bird-control nets that close nesting routes, sports nets that contain practice balls, and cloth drying hangers that reclaim railing space in compact flats.

In encyclopaedic terms, an “invisible grill” is a tensioned cable system fixed across an opening so that sightlines remain clearer than with conventional iron bars, while a safety net is a textile mesh barrier sized to the opening and purpose. Neither product replaces a sound original railing or adult supervision; both are supplementary protections whose spacing, material grade and fixing method should match how the space is used.

Choosing by the household problem is faster than comparing dozens of product names. Start with fall risk, bird entry, clear-view finish, pets, sports use or drying space; the exact mesh, cable, spacing and fixing are confirmed after measurement. Installation support can be arranged in Visakhapatnam, Vijayawada, Kakinada, Rajahmundry, Eluru, Guntur, Nellore, Tirupati and nearby Andhra Pradesh locations, subject to site accessibility, measurements, technician availability and project requirements.

Listing a place on this website does not mean a permanent office exists there. We operate as a service-area business: confirm the opening, measure carefully, quote the inclusions in writing, then install with neat finishing and basic safety checks before handover. Coastal Vizag belts, hot Vijayawada terraces and inland apartment corridors need different exposure planning—so material advice follows the actual site, not a one-rate statewide claim.`,

  whyChooseUs: [
    {
      title: "Start with the problem, not the product name",
      description:
        "Balcony safety, pigeon control, clear-view grills, pets, sports or drying—pick the need first, then compare the right fitting.",
    },
    {
      title: "Photo-led estimates, measurement-final pricing",
      description:
        "Share opening photos and your city for early guidance; final quotes follow measured size, access and fixing surface.",
    },
    {
      title: "Andhra Pradesh local planning",
      description:
        "Coastal humidity, strong sun, terrace heat and apartment society rules are part of the plan—not afterthoughts.",
    },
    {
      title: "Clear price-unit conversation",
      description:
        "A useful estimate states measured area, material, fixing plan and extras—not only the lowest teaser number.",
    },
    {
      title: "Installation with edge checks",
      description:
        "Perimeter fixing, tension or cable spacing, corners and gaps are checked before handover and basic care notes.",
    },
    {
      title: "Honest service-area coverage",
      description:
        "We arrange installation across listed AP cities and areas after confirmation—without inventing a branch in every locality.",
    },
  ] satisfies TitleDescription[],

  problemsSolved: [
    {
      title: "Keep the view open",
      description:
        "Compare slim invisible grills and low-visibility nets for front-facing balconies, windows and high-rise views.",
    },
    {
      title: "Protect children or pets",
      description:
        "Plan around the opening and how it is used—balcony railing, staircase side, window, terrace edge or pet corner.",
    },
    {
      title: "Stop birds returning",
      description:
        "Use full-opening pigeon or anti-bird nets for balconies and ducts, or targeted bird spikes for narrow ledges.",
    },
    {
      title: "Understand the price",
      description:
        "A useful estimate accounts for measured opening, net or grill type, access, fixing surface and finish—not city name alone.",
    },
    {
      title: "Terrace and utility openings",
      description:
        "Cover exposed terrace edges, ducts, shafts and working utility balconies where daily use and bird entry overlap.",
    },
    {
      title: "Practice and drying space",
      description:
        "Cricket or sports nets contain balls; ceiling cloth hangers free railing space in compact Andhra Pradesh apartments.",
    },
  ] satisfies TitleDescription[],

  propertyTypesServed: [
    {
      title: "Apartments and high-rise flats",
      description:
        "Balcony safety, window protection, duct nets and ceiling hangers planned around society access and working hours.",
    },
    {
      title: "Villas and independent houses",
      description:
        "Terrace edges, courtyard bird control, staircase openings and outdoor drying or practice setups as needed.",
    },
    {
      title: "Gated communities",
      description:
        "Multi-opening homes where finish consistency and association guidelines influence the installation plan.",
    },
    {
      title: "Schools and coaching spaces",
      description:
        "Sports nets and selected safety installations sized for frequent use and clearer practice boundaries.",
    },
    {
      title: "Hostels and small commercial sites",
      description:
        "Utility safety and bird control where openings, access and durability requirements are confirmed on site.",
    },
  ] satisfies TitleDescription[],

  installationProcess: [
    "Share a clear photo of the opening, your Andhra Pradesh city or area, and what you need to protect.",
    "Confirm dimensions, access, fixing points and day-to-day use—children, pets, pigeons, view or sports.",
    "Compare the estimate: material, fitting scope, price unit and included work.",
    "Install the chosen option, check edges and gaps, then review basic care before handover.",
  ],

  materialQualityInfo: `Useful outdoor installations depend on suitable materials and correct fixing, not brand claims alone. Invisible grills need stainless cables or rods with secure channels, terminations and anchors. Safety and sports nets need UV-stabilised mesh, the right thickness for the use case and firm edge support. Bird spikes suit narrow perch lines; they are not a substitute for full-opening bird nets. Cloth drying hangers need load-appropriate fasteners and a ceiling or wall that can take the weight. In coastal Visakhapatnam belts and high-sun Vijayawada terraces, corrosion resistance and UV stability deserve extra attention during selection and later maintenance.`,

  safetyAssurance: `Safety improves when spacing, mesh size, fixing depth and coverage match the real risk at the opening. Child and pet protection must be selected for the actual opening and does not replace a sound railing, responsible supervision or routine inspection. During installation, work areas are kept as orderly as the site allows, and handover includes what to check if fittings loosen or nets sag over time. If a surface is unsuitable for safe anchoring, we say so before proceeding.`,

  coverageOverview: `Service is available across Andhra Pradesh, India, as a statewide installation offering focused on cities such as Visakhapatnam, Vijayawada, Kakinada, Rajahmundry, Eluru, Guntur, Nellore, Tirupati and nearby listed towns and areas. We provide installation services across listed places subject to site accessibility, measurements, technician availability and project requirements. Coverage language on this site means service can be arranged after confirmation — not that a physical office exists in every place named.`,

  enquiryProcess: [
    "Send the opening photo, your city or neighbourhood, and the main concern—children, pets, birds, visibility or sports.",
    "Note floor level, society rules or access limits if known.",
    "We respond with next-step guidance for measurement or clarification questions.",
    "After site review, you receive a written quotation for the agreed scope.",
    "Approve the quote to schedule installation when materials and technicians are ready.",
  ],

  pricingFactorsExplanation: `Netting is often measured by fitted area, while some grills, spikes, frames and utility products use a different price unit. A reliable quote should identify the unit and the exact scope—not only show the lowest number. Price varies with measured size and shape, purpose and material, height and access, finish and aftercare. We do not publish one unverified statewide rate because two balconies in the same Andhra Pradesh city can need different work.`,

  maintenanceGuidance: `Wipe stainless cables periodically, clear debris from nets, check hooks and tension after heavy weather, and avoid overloading drying hangers. Report sagging, rust spots on non-stainless fittings, or loose end caps early. Simple seasonal checks usually prevent small issues from becoming larger repairs.`,

  faqs: [
    {
      question: "Which safety net is best for a balcony in Andhra Pradesh?",
      answer:
        "The best choice depends on the job. A balcony or child-safety net suits fall-risk openings, a pigeon net closes bird-entry gaps, a reinforced net is better for monkey-prone areas, and an invisible grill suits homes where a clear view is the priority. The opening and anchor points still need to be checked before fitting.",
    },
    {
      question: "How much does a balcony safety net or invisible grill cost?",
      answer:
        "Final price depends on measured area, material or cable type, mesh specification, access, fixing surface, border finish, minimum job charge and warranty terms. Ask for the price unit and included installation work in writing so quotes can be compared fairly. We do not publish one unverified citywide rate.",
    },
    {
      question: "How do I find safety nets near me in Andhra Pradesh?",
      answer:
        "Open the locations page, choose the nearest listed city such as Visakhapatnam, Vijayawada, Kakinada or Rajahmundry, then select your neighbourhood or service. Send a clear photo and your location before booking so availability can be confirmed.",
    },
    {
      question: "Will a safety net block airflow or the balcony view?",
      answer:
        "Most mesh still allows daylight and airflow, but visibility changes with strand thickness, colour, mesh size, distance and lighting. Transparent nets and slim invisible grills reduce visual weight when the view is especially important.",
    },
    {
      question: "Are pigeon nets and children safety nets the same?",
      answer:
        "No. Bird-control and fall-risk needs should be assessed separately because mesh, strength, fixing, edge treatment and expected loads can differ. A net is an added protective layer and does not replace a sound railing or adult supervision.",
    },
    {
      question: "What should I send for a clear installation estimate?",
      answer:
        "Send a full photo of the opening, one closer photo of the top and side fixing surfaces, approximate width and height if known, the city or neighbourhood, and whether the priority is children, pets, pigeons, monkeys, visibility or sports use.",
    },
    {
      question: "Do you have branches in every city listed?",
      answer:
        "No. We are a service-area business. Location pages indicate where installation can be arranged after site confirmation, not permanent offices in each place.",
    },
    {
      question: "Are materials suitable for coastal Visakhapatnam?",
      answer:
        "Coastal and near-coastal sites need more attention to stainless quality, fasteners and maintenance. Sea-facing or breeze-heavy balconies should compare the complete hardware specification rather than price alone.",
    },
    {
      question: "Do Vijayawada homes need different planning?",
      answer:
        "Often yes. Hot exposed balconies, terrace use and dense apartment utility corners change how mesh, fixing and finish are judged. Measurement still decides the final scope.",
    },
    {
      question: "Can you install in apartments with society rules?",
      answer:
        "Yes, when the association allows the required fixing method and working hours. Share guidelines during enquiry.",
    },
    {
      question: "Do products eliminate the need to supervise children?",
      answer:
        "No. Installations reduce risk at openings but do not replace adult supervision or safe household habits.",
    },
    {
      question: "How do I start?",
      answer:
        "Call, WhatsApp or use the contact form with your Andhra Pradesh city or area, service need and opening photos. We will guide the next measurement step.",
    },
  ] satisfies FaqItem[],

  relatedGuides: [
    {
      title: "Pricing Guide",
      href: "/pricing-guide/",
      summary:
        "What changes installation cost for grills, nets and hangers across Andhra Pradesh.",
    },
    {
      title: "Materials Guide",
      href: "/materials-guide/",
      summary:
        "Honest notes on stainless options, UV-stabilised nets and coastal considerations.",
    },
    {
      title: "Installation Process",
      href: "/installation-process/",
      summary:
        "From enquiry and measurement to fixing, checks and aftercare.",
    },
    {
      title: "Safety Guide",
      href: "/safety-guide/",
      summary:
        "Child, pet, balcony, high-rise, bird control and sports-area safety basics.",
    },
  ] satisfies RelatedGuide[],
} as const;

export const ABOUT_CONTENT = {
  title: "About Our Andhra Pradesh Installation Service",
  intro: `We are a service-area installation business focused on balcony safety nets, pigeon nets, invisible grills, sports nets and cloth drying hangers across Andhra Pradesh. Customers usually start with a problem—an exposed edge, birds returning, a clear-view preference, pets, practice space or drying clutter—then send photos from Visakhapatnam, Vijayawada or another listed city. Our role is to measure carefully, recommend suitable materials and install with clear communication — without exaggerated claims or invented local presence.`,

  story: `Many households in Andhra Pradesh live with open balconies, wide railing gaps, bird-prone ledges and compact utility spaces. Traditional heavy grills solve some problems but change the look and light of a home. Soft netting solves others but needs the right mesh and tension. Sports practice spaces need boundaries that hold up to repeated use. Drying clothes on railings is common, yet it is often inconvenient in smaller flats.

We built our service offering around these everyday needs rather than around a showroom-first model. That means we travel to the property, assess the openings and explain options in ordinary language. If a site is difficult to access, if a ceiling cannot safely hold a hanger, or if a wall is not suitable for the anchors required, we say so. Honest constraints protect both the customer and the quality of the finished job.

Because Andhra Pradesh is large and diverse — inland towns, growing cities and coastal belts — we do not pretend that every locality has the same weather stress or building style. Coastal moisture, strong sun on west-facing balconies and high-rise access limits all change the practical recommendation. Our story is therefore simple: be useful on site, stay clear about coverage, and keep the four service lines focused so customers are not lost in unrelated product catalogues.`,

  approach: `Our approach starts with listening. Is the priority child safety, pet safety, bird control, sports use or drying utility? The answer changes the product conversation immediately. Next comes measurement: width, height, gaps, surface condition and obstacles such as AC outdoor units. Only then do we firm up materials and price.

We avoid two common shortcuts. First, we do not quote final amounts from a city name alone. Second, we do not treat “premium” as a substitute for correct fixing. A neat-looking installation that is poorly anchored is not a good outcome. During handover, we explain basic care — cleaning, visual checks and what not to hang from cables or nets — so the system remains serviceable.

For apartment work, society rules are part of the plan. Working hours, drilling permissions and colour or finish preferences can affect scheduling. For schools and commercial sites, durability and access planning take priority. In every case, installation services across a location remain subject to site accessibility, measurements, technician availability and project requirements.`,

  services: `Invisible grills use slim stainless cables or rods to reduce fall risk at balconies, windows, staircases and selected terrace edges while keeping the view more open than bulky grill panels. Spacing is planned for the safety need, and anchors are chosen for the surface condition.

Safety nets provide broader mesh coverage for balconies, ducts, terraces and bird control. Mesh size and thickness should match the job: pigeon netting and child-safety netting are related ideas but not identical specifications. Tension and edge fixing decide whether the net stays effective.

Sports nets support cricket and multi-sport practice for homes, schools and coaching spaces. Post design, height, mesh grade and entry points follow the available ground or terrace and the intensity of use.

Cloth drying hangers help apartments and houses organise laundry overhead or on wall systems when balcony drying space is limited. Ceiling strength and height clearance decide what can be installed safely.`,

  coverage: `We serve customers across Andhra Pradesh, India. Cities, towns, mandals and neighbourhoods may appear in our location structure to help people find relevant service information. That structure supports enquiry and planning; it is not a map of branch offices. We provide installation services across listed places subject to site accessibility, measurements, technician availability and project requirements.

If your area is newly developing or access is restricted, we still welcome the enquiry. The next step is simply to confirm whether a measurement visit can be scheduled and what constraints apply. Statewide coverage language on this website should always be read in that honest service-area sense.`,

  qualityProcess: `Quality, for us, is a sequence rather than a slogan. Requirement discussion prevents wrong-product recommendations. Measurement prevents size errors. Material selection matches exposure and use. Installation focuses on secure fixing, correct spacing or tension, and tidy finishing around corners and obstacles. Final checks catch obvious alignment or looseness issues before handover.

We also document scope clearly in the quotation so inclusions and exclusions are understood. If extra openings are added later, pricing is updated rather than silently stretched. If a surface needs preparatory work outside our scope, we flag it. This process is not glamorous, but it is how outdoor safety and utility installations stay dependable in real homes.`,

  safetyCommitment: `Safety commitment means recommending coverage that matches the risk, declining unsafe fixing where the structure cannot support it, and reminding families that products reduce hazard — they do not replace supervision. For high-rise balconies, edge completeness matters. For pets, climb gaps and chew exposure need thought. For sports areas, stable supports and sensible setbacks matter. For drying hangers, load limits matter.

During installation, tools and materials are handled with ordinary site care, and work areas are left usable. After installation, customers should periodically inspect visible fittings, especially after severe weather. If something looks wrong, early reporting is better than waiting for a larger failure.`,

  howWeWork: `1. Enquiry: share location, service type, photos and priorities.
2. Clarification: we ask about openings, access, society rules and timelines.
3. Measurement: site visit confirms dimensions and fixing conditions.
4. Quotation: written scope with material direction and commercial terms for the measured work.
5. Scheduling: installation date based on approval, materials and technician availability.
6. Installation: fixing, finishing and basic checks on site.
7. Handover: usage and maintenance notes for everyday care.

Throughout, communication stays practical. We would rather delay a job than install on an unsuitable surface. We would rather explain a cost factor than hide it inside an unclear package.`,

  faqs: [
    {
      question: "What makes this a service-area business?",
      answer:
        "We arrange measurement and installation across Andhra Pradesh without claiming a permanent office in every listed city or area. Coverage is confirmed per site.",
    },
    {
      question: "Which services are in scope?",
      answer:
        "Invisible grills, safety nets, sports nets and cloth drying hangers, including common residential and selected commercial applications.",
    },
    {
      question: "Do you publish customer counts or ratings here?",
      answer:
        "We prefer not to invent or inflate proof points. Ask for relevant project examples or site-specific advice during enquiry instead.",
    },
    {
      question: "Can rural or smaller towns enquire?",
      answer:
        "Yes. Feasibility still depends on access, measurements, technician availability and project requirements.",
    },
    {
      question: "Do you upsell unnecessary products?",
      answer:
        "No. We recommend based on the stated problem and measured openings. Sometimes a simpler net is enough; sometimes a grill is the better fit.",
    },
    {
      question: "What if my society restricts drilling?",
      answer:
        "Share the restriction early. We will discuss workable fixing methods or explain if the preferred system cannot be installed safely under those rules.",
    },
    {
      question: "How should coastal customers think about materials?",
      answer:
        "Prioritise corrosion-conscious metal components, suitable fasteners and periodic cleaning. UV-stabilised nets also matter under strong sun.",
    },
    {
      question: "How do I contact you to start?",
      answer:
        "Use the contact page with your city or area, service needed and photos. We will outline the measurement and quotation steps.",
    },
  ] satisfies FaqItem[],
} as const;

export const CONTACT_CONTENT = {
  intro: `Share your city or area in Andhra Pradesh, the service you need and a few details about the openings or ground space. We use your enquiry to plan measurement guidance and a site-specific quotation. We provide installation services across Andhra Pradesh subject to site accessibility, measurements, technician availability and project requirements.`,

  whatToPrepare: [
    "City, town or area name and approximate landmark if useful for visit planning",
    "Service needed: invisible grills, safety nets, sports nets or cloth drying hangers",
    "Number of balconies, windows, ducts or the practice area size",
    "Photos showing openings, railings, ceilings or ground conditions",
    "Floor level, lift access notes and any society working-hour rules",
    "Primary goal: child safety, pet safety, bird control, sports use or drying utility",
  ],

  responseProcess: `After you submit an enquiry, we review the details and respond with clarification questions or measurement next steps. If photos are unclear, we may ask for additional angles. A visit is scheduled when the site can be accessed and a technician is available. Final pricing follows measured scope, not an estimate based only on the area name.`,

  serviceAreaNote: `Contacting us from any listed or unlisted place in Andhra Pradesh is welcome. A reply does not automatically confirm same-week installation. Feasibility and timing depend on access, measurements, technician availability and project requirements. Location names on the website are for service navigation, not proof of local branches.`,

  faqs: [
    {
      question: "What is the fastest way to get a useful reply?",
      answer:
        "Send clear photos, your location, service type and approximate opening count in one message so we can assess the next step quickly.",
    },
    {
      question: "Can I get an exact price on the first call?",
      answer:
        "You may get a rough idea for similar work, but exact pricing should follow measurement because sizes and access change cost.",
    },
    {
      question: "Do you visit on weekends?",
      answer:
        "Weekend visits may be possible subject to technician availability and building access rules. Mention your preferred slots in the enquiry.",
    },
    {
      question: "What if I am unsure which service I need?",
      answer:
        "Describe the problem — for example pigeons, child safety or drying space — and share photos. We will suggest suitable options to compare.",
    },
    {
      question: "Can association managers or school admins enquire?",
      answer:
        "Yes. Share site type, approximate span or opening list, and who will coordinate access for measurement.",
    },
    {
      question: "Will my enquiry create a site visit automatically?",
      answer:
        "Not always. We confirm details first, then schedule a visit when the scope and access make a measurement useful.",
    },
  ] satisfies FaqItem[],
} as const;

export const PRICING_GUIDE_CONTENT = {
  title: "Pricing Guide for Safety Installations in Andhra Pradesh",
  intro: `Installation cost for invisible grills, safety nets, sports nets and cloth drying hangers varies by measured size, material specification, access difficulty and total scope. This guide explains the factors we use when preparing quotations across Andhra Pradesh. It is not a fixed price list. Two balconies in the same building can differ if one has complex corners, weaker fixing surfaces or harder terrace access. We provide installation services across the state subject to site accessibility, measurements, technician availability and project requirements.`,

  factorsByService: {
    "invisible-grills": {
      title: "Invisible Grills",
      factors: [
        "Total running length and height of each opening",
        "Cable or rod specification and spacing for the safety need",
        "Number of corners, end posts and custom cut-outs",
        "Wall or railing condition for anchors",
        "Floor height and external access difficulty",
        "Finish preferences and multi-opening package scope",
      ],
      notes:
        "Closer spacing and complex shapes usually increase material and labour time. High-rise access can also affect scheduling and cost.",
    },
    "safety-nets": {
      title: "Safety Nets",
      factors: [
        "Total area or span to be covered",
        "Mesh size and thickness suited to bird control or fall-risk use",
        "Hook, rope or frame fixing method required",
        "Irregular edges, ducts and AC outdoor unit cut-arounds",
        "Terrace versus balcony access",
        "Whether one opening or a full-home netting plan is required",
      ],
      notes:
        "Bird netting over awkward ledges can need more custom cutting than a straight balcony run, even when the square area looks similar.",
    },
    "sports-nets": {
      title: "Sports Nets",
      factors: [
        "Length, width and height of the practice enclosure",
        "Mesh grade for expected ball impact",
        "Number and type of posts or wall fixings",
        "Ground condition and foundation or ballast needs",
        "Gates, overlaps and multi-lane layouts",
        "Indoor versus outdoor exposure",
      ],
      notes:
        "School and academy use typically needs stronger specifications than occasional home practice, which changes both material and support cost.",
    },
    "cloth-drying-hangers": {
      title: "Cloth Drying Hangers",
      factors: [
        "Hanger type: ceiling, pulley, wall or foldable layouts",
        "Usable drying length and load expectation",
        "Ceiling height and structural suitability",
        "Number of fixing points and accessory hardware",
        "Access inside utility areas or enclosed balconies",
        "Any custom sizing beyond standard spans",
      ],
      notes:
        "If the ceiling cannot safely take the load, we may recommend an alternative layout rather than force an unsafe fixing.",
    },
  },

  howQuotationsWork: `A useful quotation has three parts: measured scope, material direction and commercial clarity. Measured scope lists openings or ground dimensions. Material direction states the grade or mesh approach suited to your use and exposure. Commercial clarity states what is included — such as standard fixing and finishing — and what is excluded, such as civil repair or society liaison beyond normal coordination.

Photos can support an indicative discussion. They rarely replace measurement for final pricing. If you add openings after the quote, or if site conditions differ from earlier assumptions, we revise the quotation before installation proceeds. That keeps both sides aligned.`,

  whatAffectsCost: [
    "Measured size is usually the largest driver of material quantity.",
    "Higher specifications for safety-critical spacing or heavy sports use cost more than light-duty options.",
    "Difficult access, upper floors without convenient material movement, or restricted working hours can increase labour time.",
    "Custom frames, gates, pulley systems and heavy posts add components beyond basic runs.",
    "Coastal exposure may justify better corrosion-conscious components, which can change material choice.",
    "Package work across many openings can be more efficient per opening than repeated single visits, depending on travel and setup.",
  ],

  mistakesToAvoid: [
    "Choosing only by the lowest rate without checking mesh size, stainless quality or fixing method.",
    "Assuming one city-wide price applies to every balcony design.",
    "Skipping society permission checks until installation day.",
    "Underestimating corners, ducts and AC cut-outs when comparing quotes.",
    "Overloading cloth hangers or treating sports nets as interchangeable with balcony bird nets.",
    "Delaying measurement and then expecting an urgent final price from unclear photos alone.",
  ],

  faqs: [
    {
      question: "Why is there no standard rate list on the website?",
      answer:
        "Because openings, access and specifications differ widely. A published single rate would mislead more often than it would help.",
    },
    {
      question: "Are travel charges included?",
      answer:
        "Commercial inclusions depend on the project location and scope. Ask for clarity in your quotation so travel or visit terms are not assumed.",
    },
    {
      question: "Do larger packages reduce cost per opening?",
      answer:
        "Often they can improve efficiency, but the final figure still depends on total complexity, not only opening count.",
    },
    {
      question: "Does floor number always increase price?",
      answer:
        "Not always, but difficult material movement and external access can increase labour time on some high-rise jobs.",
    },
    {
      question: "Is bird netting priced the same as child-safety netting?",
      answer:
        "Not necessarily. Mesh specification and fixing detail can differ even when the opening looks similar.",
    },
    {
      question: "Do invisible grills cost more than nets?",
      answer:
        "Often they can, but not in every case. Compare measured quotes for the same openings rather than assuming a fixed hierarchy.",
    },
    {
      question: "How long is a quotation valid?",
      answer:
        "Validity is stated on the quote where applicable. Material availability and scope changes can require a fresh review later.",
    },
    {
      question: "Can I partially install now and add openings later?",
      answer:
        "Yes. Many customers phase work. Later openings are freshly measured and quoted.",
    },
    {
      question: "Do society rules affect price?",
      answer:
        "They can affect method and schedule. If a more complex fixing method is required, cost may change.",
    },
    {
      question: "Are spare parts or future repairs included?",
      answer:
        "Standard quotations cover the agreed installation scope. Future repairs or additions are separate unless stated.",
    },
    {
      question: "Does coastal location automatically mean higher price?",
      answer:
        "Not automatically, but better corrosion-conscious components may be recommended, which can influence material cost.",
    },
    {
      question: "What payment terms should I expect?",
      answer:
        "Terms are confirmed in the quotation for your project. Do not assume a website-wide payment rule.",
    },
    {
      question: "Can schools get a different commercial structure?",
      answer:
        "Institutional projects may have different spans and durability needs. Pricing still follows measured scope and specification.",
    },
    {
      question: "Why did two vendors quote differently?",
      answer:
        "Scope, mesh or cable grade, fixing hardware and exclusions often differ. Compare inclusions, not only the final number.",
    },
    {
      question: "How do I request a quote?",
      answer:
        "Use the contact page with location, service, photos and opening details so measurement can be planned.",
    },
  ] satisfies FaqItem[],
} as const;

export const MATERIALS_GUIDE_CONTENT = {
  title: "Materials Guide for Grills, Nets and Hangers",
  intro: `Material choice decides how an installation looks on day one and how it behaves after seasons of sun, rain and dust in Andhra Pradesh. This guide gives honest, practical direction for invisible grills, safety nets, sports nets and cloth drying hangers. It is not a laboratory certification sheet and it does not invent proprietary “secret grades”. The right specification is the one that matches your opening, exposure and maintenance willingness after a site review.`,

  materialsByService: {
    "invisible-grills": {
      title: "Invisible Grills",
      guidance: `Stainless steel cables or rods with suitable end fittings and anchors are the core of a proper invisible grill. Outdoor exposure needs corrosion-conscious components; ordinary mild steel hardware is a poor long-term match for balconies. Spacing between lines should follow the safety need — closer spacing is common where child safety is the priority. Corner finishing and alignment affect both appearance and whether gaps remain at edges. Ask what is being used for cables, anchors and end hardware, and how the system is tensioned.`,
    },
    "safety-nets": {
      title: "Safety Nets",
      guidance: `UV-stabilised nylon or polyethylene meshes are commonly used outdoors. Mesh aperture and twine thickness should match the job: bird control, child safety and pet containment are not identical. Hooks, ropes, frames and wall plugs must suit the surface. A thick net fixed loosely can still fail its purpose. For ducts and irregular ledges, cutting quality and edge security matter as much as the net label.`,
    },
    "sports-nets": {
      title: "Sports Nets",
      guidance: `Sports nets need mesh and support strength matched to ball impact and span. Occasional home cricket practice differs from daily academy use. Posts may be galvanised or otherwise protected for outdoor duty; ground fixing must resist loosening. Joins, overlaps and entry gates are wear points. Choosing the lowest-cost garden net for repeated cricket use usually leads to early replacement.`,
    },
    "cloth-drying-hangers": {
      title: "Cloth Drying Hangers",
      guidance: `Hangers may use powder-coated steel, stainless parts, pulleys and ceiling hooks. The hidden material decision is often the fastener and the ceiling substrate. A strong-looking frame on a weak slab fixing is still unsafe. Match drying length and load to real laundry habits. Moving parts such as pulleys need occasional free movement checks so cables or cords do not fray unnoticed.`,
    },
  },

  coastalConsiderations: `Coastal and near-coastal places in Andhra Pradesh — including areas around Visakhapatnam, Gajuwaka, Bheemunipatnam, Kakinada, Nellore, Machilipatnam, Srikakulam, Vizianagaram and Anakapalli — often combine moist air with strong sun. That combination is harder on ordinary ferrous fittings and on nets with poor UV resistance. Prefer corrosion-conscious metal components, thoughtful fastener selection and periodic cleaning of salt film or dust. Stainless still needs basic care; it is resistant, not magical. Inland cities still face UV and rain stress, so outdoor-rated materials remain relevant statewide.`,

  selectionTips: [
    "State the primary risk or use case before comparing materials.",
    "Match mesh size or cable spacing to that use case, not to a neighbour’s different balcony problem.",
    "Ask how edges, corners and AC cut-outs will be finished.",
    "For coastal homes, discuss fasteners and cleaning habits explicitly.",
    "For sports use, size durability to weekly hours of practice, not only to ground length.",
    "For hangers, verify ceiling suitability before falling in love with a particular design.",
    "Keep a simple maintenance plan: cleaning, visual checks and early reporting of damage.",
  ],

  faqs: [
    {
      question: "Is stainless steel always necessary for invisible grills?",
      answer:
        "For outdoor balconies and windows, stainless components are the practical default for longevity. Exact grade and hardware should be confirmed in your quotation.",
    },
    {
      question: "What does UV-stabilised mean for nets?",
      answer:
        "It means the mesh is formulated to resist sun damage better than untreated material. It still ages and still needs inspection over time.",
    },
    {
      question: "Can one net type cover birds and child safety together?",
      answer:
        "Sometimes a specification can address both, but aperture and fixing details must be chosen carefully. Measurement helps decide.",
    },
    {
      question: "Do coloured nets change durability?",
      answer:
        "Colour is mostly preference. Durability depends more on UV quality, thickness, fixing and exposure than on colour alone.",
    },
    {
      question: "Are imported materials always better?",
      answer:
        "Not automatically. Fixing quality and correct specification matter more than origin stories.",
    },
    {
      question: "What fails first in coastal installations?",
      answer:
        "Often inexpensive fasteners, neglected cleaning points and underspecified edges — not only the visible cable or net face.",
    },
    {
      question: "How often should materials be inspected?",
      answer:
        "A simple visual check every few months and after severe weather is sensible for outdoor systems.",
    },
    {
      question: "Can rust appear on stainless systems?",
      answer:
        "Surface staining can occur from contamination or mixed fasteners. Good component matching and cleaning reduce this risk.",
    },
    {
      question: "What mesh is typical for pigeon control?",
      answer:
        "Smaller apertures are commonly used so birds cannot pass easily. Exact choice depends on the ledge and fixing plan.",
    },
    {
      question: "Do sports nets use the same material as balcony nets?",
      answer:
        "Not usually. Impact load and span needs differ, so sports specifications are selected separately.",
    },
    {
      question: "What ceiling issues block hanger installation?",
      answer:
        "Weak or unsuitable substrates, hidden services and insufficient height clearance are common blockers.",
    },
    {
      question: "Should I reuse old hooks for a new net?",
      answer:
        "Only if they are sound and correctly placed for the new tension pattern. Many jobs need fresh fixings.",
    },
    {
      question: "Does thicker always mean better?",
      answer:
        "Thicker can help for heavy use, but poor tension or wrong aperture can still make a thick net ineffective.",
    },
    {
      question: "Can materials be matched across multiple balconies?",
      answer:
        "Yes. Package work often uses a consistent specification for a cleaner look and simpler maintenance.",
    },
    {
      question: "How do I get material advice for my home?",
      answer:
        "Send photos and location details, then complete measurement so recommendations follow real openings and exposure.",
    },
  ] satisfies FaqItem[],
} as const;

export const INSTALLATION_PROCESS_CONTENT = {
  title: "Installation Process",
  intro: `A reliable installation is mostly decided before the first fastener goes in. This page explains how enquiry, measurement, quotation, fixing and aftercare work for invisible grills, safety nets, sports nets and cloth drying hangers across Andhra Pradesh. Timelines vary by scope and access. We provide installation services across a location subject to site accessibility, measurements, technician availability and project requirements.`,

  steps: [
    {
      title: "1. Enquiry and requirement notes",
      detail:
        "You share location, service type, photos and the main problem to solve. We clarify priorities such as child safety, bird control, sports practice or drying utility.",
    },
    {
      title: "2. Pre-visit checks",
      detail:
        "If needed, we ask for extra photos, society rules, preferred slots and access notes so the measurement visit is productive.",
    },
    {
      title: "3. On-site measurement",
      detail:
        "Openings or ground dimensions are measured, surfaces are checked, obstacles are noted and a practical fixing approach is discussed.",
    },
    {
      title: "4. Quotation and scope confirmation",
      detail:
        "You receive a quotation based on measured work, material direction and inclusions. Questions about corners, ducts or hanger load should be settled here.",
    },
    {
      title: "5. Scheduling",
      detail:
        "After approval, installation is booked according to material readiness and technician availability, respecting building working hours where applicable.",
    },
    {
      title: "6. Installation day preparation",
      detail:
        "Please keep work areas reasonably clear, arrange terrace or balcony access, and keep a contact person available for decisions if unexpected site issues appear.",
    },
    {
      title: "7. Fixing and finishing",
      detail:
        "Technicians mark points, install anchors or supports, fit cables, nets or hangers, handle cut-outs carefully and finish edges neatly.",
    },
    {
      title: "8. Checks and handover",
      detail:
        "Tension, spacing, alignment, basic load usability for hangers and overall coverage are checked. You receive simple care guidance before closure.",
    },
  ],

  siteInspection: `Site inspection exists to replace assumptions. We verify sizes, substrate strength, corrosion exposure, safe working positions and constraints such as neighbouring flats or restricted drilling. For sports nets, ground condition and setback space are reviewed. For hangers, ceiling suitability comes first. If the site is not ready — for example, ongoing civil work or blocked terrace access — installation may be rescheduled rather than forced.`,

  safetyDuringInstall: `During installation, the work zone should stay as orderly as the property allows. Children and pets should be kept away from tools and open edges. Existing railings remain important; installers are adding protection systems, not creating a playground. If weather turns unsafe for external work, postponement is the responsible choice. Any structural doubt about anchors or posts is raised before continuing.`,

  aftercare: `Aftercare is mostly visual and routine. Clean dust and debris, check for sagging nets or loose end fittings, avoid hanging heavy storage items from grill cables, and stay within hanger load guidance. After storms or very high winds, inspect outdoor systems sooner. If you notice damage, share photos promptly so repair scope can be assessed. Good aftercare extends useful life more than occasional aggressive cleaning chemicals.`,

  faqs: [
    {
      question: "How long after measurement can installation happen?",
      answer:
        "It depends on approval speed, material readiness and technician availability. Your quotation or scheduling message will indicate the practical window.",
    },
    {
      question: "Do I need to be present during installation?",
      answer:
        "A responsible adult who can provide access and confirm decisions should be available, even if not watching every minute of work.",
    },
    {
      question: "Will there be drilling noise?",
      answer:
        "Many jobs need drilling for anchors or supports. Apartment residents should consider society quiet-hour rules when booking.",
    },
    {
      question: "Can installation finish in one day?",
      answer:
        "Single openings often do. Large packages, sports enclosures or complex multi-side homes may need more time.",
    },
    {
      question: "What if measurement and installation dates must differ?",
      answer:
        "That is normal. Measurement locks scope; installation follows approval and scheduling.",
    },
    {
      question: "Do you move heavy furniture?",
      answer:
        "Please clear small obstacles yourself where possible. Discuss any special access constraints before the visit.",
    },
    {
      question: "What happens if society permission is delayed?",
      answer:
        "Installation waits until required permissions and access are in place. Early coordination avoids wasted visits.",
    },
    {
      question: "Are protective sheets used indoors?",
      answer:
        "Reasonable care is taken around the work zone. Share any flooring or finish concerns before work begins.",
    },
    {
      question: "Can weather delay balcony work?",
      answer:
        "Yes. Heavy rain or unsafe external conditions can postpone installation for quality and safety reasons.",
    },
    {
      question: "Is cleanup included?",
      answer:
        "Installation debris from our work is cleared as part of normal handover. Pre-existing clutter remains the household’s responsibility.",
    },
    {
      question: "Do you explain maintenance on the same day?",
      answer:
        "Yes. Basic care points are shared at handover so you know what to monitor.",
    },
    {
      question: "What if I want changes during installation?",
      answer:
        "Material scope changes should be agreed before extra work proceeds, because they can affect price and duration.",
    },
  ] satisfies FaqItem[],
} as const;

export const SAFETY_GUIDE_CONTENT = {
  title: "Safety Guide for Homes, Balconies and Practice Areas",
  intro: `Safety products help reduce risk; they do not remove the need for sensible daily habits. This guide covers child safety, pet safety, high-rise considerations, balcony planning, bird control and sports-area basics for households and institutions in Andhra Pradesh. Use it to prepare better questions before measurement — not as a substitute for site-specific advice.`,

  childSafety: `For children, the danger often sits in climbable railings, wide gaps, low parapets and furniture placed near edges. Invisible grills and safety nets can reduce fall risk when spacing or mesh size matches the need and coverage is complete at corners. Keep planters and stools away from balcony edges even after installation. Teach children that cables and nets are barriers, not play ladders. Supervision remains necessary indoors and outdoors. If a home has both toddlers and upper-floor windows that open wide, include those windows in the safety discussion rather than protecting only the main balcony.`,

  petSafety: `Pets explore edges differently from children. Cats may climb mesh; dogs may push at lower gaps; birds kept at home need separate enclosure thinking from pigeon control nets. Choose aperture and fixing height with your pet’s size and behaviour in mind. Chewing risk on cords or soft nets should be considered. Balcony doors left open during cleaning are a common incident moment — product installation helps, but household routines still matter. Share pet type during enquiry so recommendations are realistic.`,

  highRise: `High-rise flats add wind exposure, harder external access and higher consequences from falls. Edge completeness, secure anchors and material suitability for stronger sun and wind matter more as height increases. Society rules on external work are also more common in taller buildings. Do not assume a ground-floor fixing method automatically suits a high terrace screen. During installation, material movement through lifts and service stairs should be planned so openings are not left unmanaged longer than necessary.`,

  balcony: `A balcony safety plan starts with gap mapping: railing pitch, side walls, AC grills and any climb assist furniture. Decide whether you need discreet fall protection, bird control, or both. Invisible grills favour a more open look; nets favour broader coverage and bird deterrence. Utility balconies often need different treatment from living-room balconies because of ducts, washing machines and outdoor units. Measure each balcony separately even when they look similar from inside.`,

  birdControl: `Pigeons and other birds exploit ledges, AC shelves, open ducts and unused corners. Netting works when aperture is suitable and edges are sealed to the structure without leaving entry pockets. Incomplete corners are the usual failure point. Cleaning droppings and nesting material before installation improves hygiene and fixing quality. Bird control is a property-maintenance issue as much as a product issue; neighbouring ledges outside your scope may still attract birds.`,

  sportsAreaSafety: `Sports nets protect people and property by containing balls, but the enclosure itself must be stable. Posts should be fixed soundly, entry points should not create trip hazards, and practice should stay appropriate to the net height and grade. Keep spectators and younger children outside active batting lines. Damaged joins should be repaired before the next intense session. Home terrace cricket needs extra care regarding boundary walls, neighbouring windows and slippery surfaces after rain.`,

  faqs: [
    {
      question: "Can invisible grills replace adult supervision?",
      answer:
        "No. They reduce edge risk but do not replace supervision or safe furniture placement habits.",
    },
    {
      question: "What spacing is right for child safety?",
      answer:
        "Closer spacing is commonly preferred for young children. Exact spacing is confirmed against your openings during measurement.",
    },
    {
      question: "Are safety nets safe for cats?",
      answer:
        "They can help, but climbing and clawing behaviour matter. Discuss pet type so mesh and fixing expectations are realistic.",
    },
    {
      question: "Should every window get protection?",
      answer:
        "Prioritise accessible windows used by children or pets. A walkthrough during measurement helps rank openings.",
    },
    {
      question: "Do bird nets stop all pigeon problems?",
      answer:
        "They help on covered openings. Birds may still use nearby untreated ledges outside the installed scope.",
    },
    {
      question: "Is terrace cricket safe with a net alone?",
      answer:
        "A proper net improves containment, but surface grip, boundary walls and neighbouring property risk still need judgment.",
    },
    {
      question: "What makes high-rise balcony work different?",
      answer:
        "Access, wind exposure, society rules and consequence of failure all increase, so specification and planning should be more careful.",
    },
    {
      question: "Can furniture defeat a good installation?",
      answer:
        "Yes. Stacked stools or planters near edges can recreate climb risk. Keep edges clear.",
    },
    {
      question: "Should ducts be included in a safety plan?",
      answer:
        "Often yes in apartments, because ducts can be open vertical hazards or bird entry routes.",
    },
    {
      question: "Do cloth hangers affect balcony safety?",
      answer:
        "Hangers are utility products. They should not block emergency movement or encourage climbing near edges.",
    },
    {
      question: "How soon should damaged nets be repaired?",
      answer:
        "As soon as practical. Small tears and loose hooks tend to worsen with sun, wind and use.",
    },
    {
      question: "Are indoor sports nets assessed differently?",
      answer:
        "Yes. Wall fixings, ceiling height and indoor traffic patterns change the safety review compared with outdoor grounds.",
    },
    {
      question: "What should schools document before installation?",
      answer:
        "Practice area dimensions, age groups using the space, preferred entry points and any neighbouring hazard zones.",
    },
    {
      question: "Can one product solve pets, birds and child safety together?",
      answer:
        "Sometimes a well-chosen system helps across needs, but trade-offs exist. Measurement clarifies the best primary specification.",
    },
    {
      question: "What is the first safety step before buying anything?",
      answer:
        "Walk the property, list risky openings, move climb aids away from edges, and then request measurement for suitable products.",
    },
  ] satisfies FaqItem[],
} as const;

export const FAQ_PAGE_EXTRA: FaqItem[] = [
  {
    question: "Do you serve locations across all of Andhra Pradesh?",
    answer:
      "We arrange installation across Andhra Pradesh subject to site accessibility, measurements, technician availability and project requirements. Feasibility is confirmed per enquiry.",
  },
  {
    question: "Why do some pages mention areas without promising a local shop?",
    answer:
      "Programmatic location pages help customers find service information. They describe coverage potential, not a branch network.",
  },
  {
    question: "Can I request multiple services in one visit?",
    answer:
      "Yes. For example, balcony nets and a cloth drying hanger can be measured together when access allows.",
  },
  {
    question: "Do you install only in new apartments?",
    answer:
      "No. Older independent houses and existing flats are common, provided fixing surfaces are suitable or limitations are explained.",
  },
  {
    question: "What details belong in a good photo set?",
    answer:
      "Wide shots of each opening, close-ups of railings or ceilings, and any ducts, AC units or corners that affect fixing.",
  },
  {
    question: "Can quotations be shared on WhatsApp?",
    answer:
      "When active enquiry channels are enabled for your project, written quotations can be shared through the agreed communication method.",
  },
  {
    question: "Do you provide civil repair or railing fabrication?",
    answer:
      "Our core scope is grills, nets and hangers. Civil repair or custom metal railing fabrication is outside standard scope unless separately agreed.",
  },
  {
    question: "How should housing societies compare vendors?",
    answer:
      "Compare measured scope, material clarity, fixing method, timeline realism and exclusions — not only the headline amount.",
  },
  {
    question: "Are night installations available?",
    answer:
      "Most work is planned in ordinary daytime working hours, especially in apartments. Special timing depends on permission and technician availability.",
  },
  {
    question: "What if my locality name is missing on the website?",
    answer:
      "You can still enquire with your city and area name. Website lists are navigational and may not show every locality at once.",
  },
  {
    question: "Do you guarantee that birds will never return nearby?",
    answer:
      "No honest installer can guarantee bird behaviour on untreated neighbouring ledges. We focus on properly covering the agreed openings.",
  },
  {
    question: "Can I stay in the house during installation?",
    answer:
      "Usually yes. Keep children and pets away from the active work zone and expect some noise during drilling or fixing.",
  },
  {
    question: "Do sports nets require ground permissions?",
    answer:
      "On institutional or shared grounds, confirm authority to install posts or anchors before scheduling.",
  },
  {
    question: "What maintenance is my responsibility?",
    answer:
      "Routine cleaning, visual checks, staying within load limits and reporting damage promptly are customer-side responsibilities after handover.",
  },
  {
    question: "How do guides on this site relate to my quotation?",
    answer:
      "Guides explain general factors. Your quotation applies those factors to measured openings at your property.",
  },
  {
    question: "Can commercial sites request the same four services?",
    answer:
      "Yes when the use case fits. Durability, access and safety planning are reviewed for higher or different usage patterns.",
  },
  {
    question: "Is reinstallation on a renovated balcony treated as new work?",
    answer:
      "Usually yes, because sizes, surfaces and obstacles may have changed. Fresh measurement is the safe approach.",
  },
  {
    question: "Do you publish fake reviews or star ratings?",
    answer:
      "No. We avoid invented ratings and encourage direct questions about scope, materials and process instead.",
  },
];
