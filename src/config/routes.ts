import { STATE_SLUG } from "@/config/geo";
import {
  canonicalCitySlug,
  siloAreaPath,
  siloAreaServicePath,
  siloCityPath,
  siloCityServicePath,
  siloStatePath,
} from "@/lib/routing/location-silo";

export const ROUTES = {
  home: "/",
  about: "/about/",
  contact: "/contact/",
  services: "/services/",
  service: (slug: string) => `/services/${slug}/`,
  locations: "/locations/",
  state: siloStatePath(),
  location: (slug: string) => {
    const city = canonicalCitySlug(slug);
    return city ? siloCityPath(city) : `/locations/${slug}/`;
  },
  area: (citySlug: string, areaSlug: string) => siloAreaPath(citySlug, areaSlug),
  cityService: (citySlug: string, serviceSlug: string) => {
    const city = canonicalCitySlug(citySlug);
    return city
      ? siloCityServicePath(city, serviceSlug)
      : `/${citySlug}/${serviceSlug}/`;
  },
  /** Pretty alias; proxy 308s to cityService (single canonical). */
  serviceInCity: (serviceSlug: string, citySlug: string) =>
    `/${serviceSlug}-in-${citySlug}/`,
  /** Keyword × geo money URL — safety nets / grills / etc. in area or city */
  keywordInGeo: (keywordSlug: string, geoSlug: string) =>
    `/${keywordSlug}-in-${geoSlug}/`,
  areaService: (citySlug: string, areaSlug: string, serviceSlug: string) => {
    const city = canonicalCitySlug(citySlug);
    return city
      ? siloAreaServicePath(city, areaSlug, serviceSlug)
      : `/${citySlug}/${areaSlug}/${serviceSlug}/`;
  },
  /** Pretty area money URL: /{service}/{state}/{city}/{area}/ */
  areaMoneyLanding: (
    serviceSlug: string,
    stateSlug: string,
    citySlug: string,
    areaSlug: string,
  ) => `/${serviceSlug}/${stateSlug}/${citySlug}/${areaSlug}/`,
  serviceFamily: (slug: string) => `/services/${slug}/`,
  solutions: "/solutions/",
  solution: (slug: string) => `/solutions/${slug}/`,
  propertyTypes: "/property-types/",
  propertyTypeService: (propertyTypeSlug: string, serviceSlug: string) =>
    `/property-types/${propertyTypeSlug}/${serviceSlug}/`,
  guides: "/guides/",
  guide: (slug: string) => `/guides/${slug}/`,
  comparisons: "/comparisons/",
  comparison: (slug: string) => `/comparisons/${slug}/`,
  blog: "/blog/",
  blogPost: (slug: string) => `/blog/${slug}/`,
  gallery: "/gallery/",
  projects: "/projects/",
  project: (slug: string) => `/projects/${slug}/`,
  testimonials: "/testimonials/",
  faq: "/faq/",
  thankYou: "/thank-you/",
  terms: "/terms-and-conditions/",
  serviceAreas: siloStatePath(),
} as const;

export { STATE_SLUG };
