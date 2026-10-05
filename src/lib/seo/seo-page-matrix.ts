/**
 * Authoritative SEO page dataset.
 *
 * One list powers route validation (via the same catalog as shouldGeneratePage),
 * generateStaticParams (prerender flag only), sitemap, audit, and priority.
 *
 * generateStaticParams is NOT this list. It is the prerender=true subset.
 * A valid page missing from generateStaticParams is still indexable + ISR.
 */

import { CORE_SERVICE_SLUGS, STATE_NAME, STATE_SLUG } from "@/config/geo";
import { shouldPrerenderArea } from "@/config/prerender";
import { ROUTES } from "@/config/routes";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { PLACEHOLDER_BLOG_POSTS, PLACEHOLDER_GUIDES } from "@/data/placeholder-content";
import { PROBLEMS } from "@/data/problems";
import { PROPERTY_TYPES } from "@/data/property-types";
import { listPublishedProjects } from "@/data/projects";
import { SERVICE_COMPARISON_SLUGS } from "@/data/comparisons";
import { SERVICE_FAMILY_SLUGS, SERVICE_FAMILY_MAP } from "@/data/service-families";
import { SUB_SERVICE_SLUGS, SUB_SERVICE_MAP } from "@/data/sub-services";
import {
  listLocationServices,
  resolveLocationService,
} from "@/lib/data/location-catalog";
import { shouldGeneratePage } from "@/lib/seo/page-decision";

export type SeoMatrixKind =
  | "home"
  | "static"
  | "state"
  | "city"
  | "area"
  | "service"
  | "sub-service"
  | "service-family"
  | "city-service"
  | "area-service"
  | "solution"
  | "guide"
  | "blog"
  | "project"
  | "comparison"
  | "property-type";

export type SeoPageRecord = {
  kind: SeoMatrixKind;
  path: string;
  title: string;
  priority: number;
  indexable: boolean;
  prerender: boolean;
  renderMode: "static" | "isr";
  citySlug?: string;
  areaSlug?: string;
  serviceSlug?: string;
};

const CORE_SERVICE_SET = new Set<string>(CORE_SERVICE_SLUGS);

const STATIC_HUBS: Array<{ path: string; title: string; priority: number }> = [
  { path: "/", title: "Home", priority: 1 },
  { path: "/about/", title: "About", priority: 0.7 },
  { path: "/contact/", title: "Contact", priority: 0.7 },
  { path: "/solutions/", title: "Solutions", priority: 0.7 },
  { path: "/faq/", title: "FAQ", priority: 0.7 },
  { path: "/gallery/", title: "Gallery", priority: 0.65 },
  { path: "/testimonials/", title: "Testimonials", priority: 0.6 },
  { path: "/pricing-guide/", title: "Pricing guide", priority: 0.7 },
  { path: "/materials-guide/", title: "Materials guide", priority: 0.7 },
  { path: "/installation-process/", title: "Installation process", priority: 0.7 },
  { path: "/safety-guide/", title: "Safety guide", priority: 0.7 },
  { path: "/privacy-policy/", title: "Privacy policy", priority: 0.3 },
  { path: "/terms-and-conditions/", title: "Terms", priority: 0.3 },
  { path: "/disclaimer/", title: "Disclaimer", priority: 0.3 },
  { path: "/services/", title: "Services", priority: 0.75 },
  { path: "/locations/", title: "Locations", priority: 0.75 },
  { path: "/guides/", title: "Guides", priority: 0.65 },
  { path: "/blog/", title: "Blog", priority: 0.65 },
  { path: "/projects/", title: "Projects", priority: 0.65 },
  { path: "/comparisons/", title: "Comparisons", priority: 0.7 },
  { path: "/property-types/", title: "Property types", priority: 0.7 },
];

function withSlash(path: string): string {
  if (path === "/") return path;
  return path.endsWith("/") ? path : `${path}/`;
}

function record(input: Omit<SeoPageRecord, "renderMode">): SeoPageRecord {
  return {
    ...input,
    path: withSlash(input.path),
    renderMode: input.prerender ? "static" : "isr",
  };
}

function buildMatrix(): SeoPageRecord[] {
  const pages: SeoPageRecord[] = [];

  for (const hub of STATIC_HUBS) {
    pages.push(
      record({
        kind: hub.path === "/" ? "home" : "static",
        path: hub.path,
        title: hub.title,
        priority: hub.priority,
        indexable: true,
        prerender: true,
      }),
    );
  }

  pages.push(
    record({
      kind: "state",
      path: ROUTES.state,
      title: `${STATE_NAME} service areas`,
      priority: 0.9,
      indexable: true,
      prerender: true,
    }),
  );

  for (const service of INITIAL_SERVICES) {
    if (!service.allowIndexing) continue;
    if (
      !shouldGeneratePage({ kind: "service", serviceSlug: service.slug }).generate
    ) {
      continue;
    }
    pages.push(
      record({
        kind: "service",
        path: ROUTES.service(service.slug),
        title: service.name,
        priority: 0.8,
        indexable: true,
        prerender: true,
        serviceSlug: service.slug,
      }),
    );
  }

  for (const slug of SUB_SERVICE_SLUGS) {
    const sub = SUB_SERVICE_MAP[slug];
    pages.push(
      record({
        kind: "sub-service",
        path: ROUTES.service(slug),
        title: sub?.name ?? slug,
        priority: 0.78,
        indexable: true,
        prerender: true,
        serviceSlug: slug,
      }),
    );
  }

  for (const slug of SERVICE_FAMILY_SLUGS) {
    const family = SERVICE_FAMILY_MAP[slug];
    pages.push(
      record({
        kind: "service-family",
        path: ROUTES.serviceFamily(slug),
        title: family?.name ?? slug,
        priority: 0.82,
        indexable: true,
        prerender: true,
        serviceSlug: slug,
      }),
    );
  }

  for (const problem of PROBLEMS) {
    if (problem.publicationStatus !== "published" || !problem.allowIndexing) {
      continue;
    }
    pages.push(
      record({
        kind: "solution",
        path: ROUTES.solution(problem.slug),
        title: problem.name,
        priority: 0.68,
        indexable: true,
        prerender: true,
      }),
    );
  }

  for (const guide of PLACEHOLDER_GUIDES) {
    pages.push(
      record({
        kind: "guide",
        path: ROUTES.guide(guide.slug),
        title: guide.title,
        priority: 0.7,
        indexable: true,
        prerender: true,
      }),
    );
  }

  for (const post of PLACEHOLDER_BLOG_POSTS) {
    pages.push(
      record({
        kind: "blog",
        path: ROUTES.blogPost(post.slug),
        title: post.title,
        priority: 0.65,
        indexable: true,
        prerender: true,
      }),
    );
  }

  for (const project of listPublishedProjects()) {
    pages.push(
      record({
        kind: "project",
        path: ROUTES.project(project.slug),
        title: project.projectName,
        priority: 0.55,
        indexable: true,
        prerender: true,
      }),
    );
  }

  for (const slug of SERVICE_COMPARISON_SLUGS) {
    pages.push(
      record({
        kind: "comparison",
        path: ROUTES.comparison(slug),
        title: slug.replace(/-/g, " "),
        priority: 0.72,
        indexable: true,
        prerender: true,
      }),
    );
  }

  for (const propertyType of PROPERTY_TYPES) {
    if (
      propertyType.publicationStatus !== "published" ||
      !propertyType.allowIndexing
    ) {
      continue;
    }
    for (const serviceSlug of propertyType.suitableServices) {
      pages.push(
        record({
          kind: "property-type",
          path: ROUTES.propertyTypeService(propertyType.slug, serviceSlug),
          title: `${propertyType.name} ${serviceSlug.replace(/-/g, " ")}`,
          priority: 0.66,
          indexable: true,
          prerender: true,
          serviceSlug,
        }),
      );
    }
  }

  const locationServices = listLocationServices();

  for (const city of HIGH_PRIORITY_CITY_AREAS) {
    if (
      !shouldGeneratePage({
        kind: "city",
        stateSlug: STATE_SLUG,
        citySlug: city.citySlug,
      }).generate
    ) {
      continue;
    }

    pages.push(
      record({
        kind: "city",
        path: ROUTES.location(city.citySlug),
        title: `${city.cityName}, ${STATE_NAME}`,
        priority: 0.9,
        indexable: true,
        prerender: true,
        citySlug: city.citySlug,
      }),
    );

    for (const service of locationServices) {
      if (
        !shouldGeneratePage({
          kind: "city-service",
          stateSlug: STATE_SLUG,
          citySlug: city.citySlug,
          serviceSlug: service.slug,
        }).generate
      ) {
        continue;
      }
      const resolved = resolveLocationService(service.slug);
      pages.push(
        record({
          kind: "city-service",
          path: ROUTES.cityService(city.citySlug, service.slug),
          title: `${resolved?.name ?? service.name} in ${city.cityName}`,
          priority: CORE_SERVICE_SET.has(service.slug) ? 0.8 : 0.7,
          indexable: true,
          prerender: true,
          citySlug: city.citySlug,
          serviceSlug: service.slug,
        }),
      );
    }

    for (const area of city.areas) {
      if (
        !shouldGeneratePage({
          kind: "area",
          stateSlug: STATE_SLUG,
          citySlug: city.citySlug,
          areaSlug: area.slug,
        }).generate
      ) {
        continue;
      }

      const areaPrerender = shouldPrerenderArea(city.citySlug, area.slug);
      pages.push(
        record({
          kind: "area",
          path: ROUTES.area(city.citySlug, area.slug),
          title: `${area.name}, ${city.cityName}`,
          priority: 0.6,
          indexable: true,
          prerender: areaPrerender,
          citySlug: city.citySlug,
          areaSlug: area.slug,
        }),
      );

      for (const service of locationServices) {
        if (
          !shouldGeneratePage({
            kind: "area-service",
            stateSlug: STATE_SLUG,
            citySlug: city.citySlug,
            areaSlug: area.slug,
            serviceSlug: service.slug,
          }).generate
        ) {
          continue;
        }
        const resolved = resolveLocationService(service.slug);
        pages.push(
          record({
            kind: "area-service",
            path: ROUTES.areaService(city.citySlug, area.slug, service.slug),
            title: `${resolved?.name ?? service.name} in ${area.name}, ${city.cityName}`,
            priority: 0.6,
            indexable: true,
            prerender: areaPrerender,
            citySlug: city.citySlug,
            areaSlug: area.slug,
            serviceSlug: service.slug,
          }),
        );
      }
    }
  }

  const seen = new Set<string>();
  const unique: SeoPageRecord[] = [];
  for (const page of pages) {
    if (seen.has(page.path)) continue;
    seen.add(page.path);
    unique.push(page);
  }
  return unique;
}

let cachedMatrix: SeoPageRecord[] | null = null;
let cachedByPath: Map<string, SeoPageRecord> | null = null;

export function listApprovedSeoPages(): SeoPageRecord[] {
  if (!cachedMatrix) cachedMatrix = buildMatrix();
  return cachedMatrix;
}

function pathIndex(): Map<string, SeoPageRecord> {
  if (!cachedByPath) {
    cachedByPath = new Map(
      listApprovedSeoPages().map((page) => [page.path, page]),
    );
  }
  return cachedByPath;
}

export function listIndexableSeoPages(): SeoPageRecord[] {
  return listApprovedSeoPages().filter((page) => page.indexable);
}

/** Build-time SSG seed only — not the full indexable URL list. */
export function getHighPrioritySeoPages(): SeoPageRecord[] {
  return listApprovedSeoPages().filter((page) => page.prerender);
}

export function resolveSeoPage(path: string): SeoPageRecord | null {
  return pathIndex().get(withSlash(path)) ?? null;
}

export function isApprovedSeoPath(path: string): boolean {
  return resolveSeoPage(path) !== null;
}

export function prerenderSiloCityParams(): Array<{ citySlug: string }> {
  return getHighPrioritySeoPages()
    .filter((page) => page.kind === "city" && page.citySlug)
    .map((page) => ({ citySlug: page.citySlug as string }));
}

export function prerenderSiloCityChildParams(): Array<{
  citySlug: string;
  areaSlug: string;
}> {
  const out: Array<{ citySlug: string; areaSlug: string }> = [];
  for (const page of getHighPrioritySeoPages()) {
    if (page.kind === "city-service" && page.citySlug && page.serviceSlug) {
      out.push({ citySlug: page.citySlug, areaSlug: page.serviceSlug });
    }
    if (page.kind === "area" && page.citySlug && page.areaSlug) {
      out.push({ citySlug: page.citySlug, areaSlug: page.areaSlug });
    }
  }
  return out;
}

export function prerenderSiloAreaServiceParams(): Array<{
  citySlug: string;
  areaSlug: string;
  serviceSlug: string;
}> {
  return getHighPrioritySeoPages()
    .filter(
      (page) =>
        page.kind === "area-service" &&
        page.citySlug &&
        page.areaSlug &&
        page.serviceSlug,
    )
    .map((page) => ({
      citySlug: page.citySlug as string,
      areaSlug: page.areaSlug as string,
      serviceSlug: page.serviceSlug as string,
    }));
}

export type SeoMatrixSummary = {
  approved: number;
  indexable: number;
  prerender: number;
  isr: number;
  byKind: Record<string, number>;
};

export function summarizeSeoPageMatrix(): SeoMatrixSummary {
  const pages = listApprovedSeoPages();
  const byKind: Record<string, number> = {};
  let prerender = 0;
  let isr = 0;
  for (const page of pages) {
    byKind[page.kind] = (byKind[page.kind] ?? 0) + 1;
    if (page.prerender) prerender += 1;
    else isr += 1;
  }
  return {
    approved: pages.length,
    indexable: pages.filter((page) => page.indexable).length,
    prerender,
    isr,
    byKind,
  };
}
