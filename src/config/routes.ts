export const ROUTES = {
  home: "/",
  about: "/about/",
  contact: "/contact/",
  services: "/services/",
  service: (slug: string) => `/services/${slug}/`,
  locations: "/locations/",
  location: (slug: string) => `/locations/${slug}/`,
  area: (locationSlug: string, areaSlug: string) =>
    `/locations/${locationSlug}/${areaSlug}/`,
  cityService: (locationSlug: string, serviceSlug: string) =>
    `/${locationSlug}/${serviceSlug}/`,
  /** Pretty alias; middleware 308s to cityService (single canonical). */
  serviceInCity: (serviceSlug: string, citySlug: string) =>
    `/${serviceSlug}-in-${citySlug}/`,
  /** Keyword × geo money URL — safety nets / grills / etc. in area or city */
  keywordInGeo: (keywordSlug: string, geoSlug: string) =>
    `/${keywordSlug}-in-${geoSlug}/`,
  areaService: (
    locationSlug: string,
    areaSlug: string,
    serviceSlug: string,
  ) => `/${locationSlug}/${areaSlug}/${serviceSlug}/`,
  /** Pretty area money URL: /{service}/{state}/{city}/{area}/ */
  areaMoneyLanding: (
    serviceSlug: string,
    stateSlug: string,
    citySlug: string,
    areaSlug: string,
  ) => `/${serviceSlug}/${stateSlug}/${citySlug}/${areaSlug}/`,
  solutions: "/solutions/",
  solution: (slug: string) => `/solutions/${slug}/`,
  propertyTypes: "/property-types/",
  propertyTypeService: (propertyTypeSlug: string, serviceSlug: string) =>
    `/property-types/${propertyTypeSlug}/${serviceSlug}/`,
  guides: "/guides/",
  guide: (slug: string) => `/guides/${slug}/`,
  blog: "/blog/",
  blogPost: (slug: string) => `/blog/${slug}/`,
  gallery: "/gallery/",
  projects: "/projects/",
  testimonials: "/testimonials/",
  faq: "/faq/",
  thankYou: "/thank-you/",
} as const;
