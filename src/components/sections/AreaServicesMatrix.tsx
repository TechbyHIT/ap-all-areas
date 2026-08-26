import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { listAreaFactsForCity } from "@/data/area-local-facts";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type AreaServicesMatrixItem = {
  slug: string;
  name: string;
};

type AreaServicesMatrixProps = {
  citySlug: string;
  cityName: string;
  areas: readonly AreaServicesMatrixItem[];
  /** When set, primary CTA points at this service for each area. */
  highlightServiceSlug?: string;
  title?: string;
  description?: string;
  eyebrow?: string;
  variant?: "default" | "muted" | "brand";
  className?: string;
  /** Exclude one area (e.g. current area on an area page). */
  excludeAreaSlug?: string;
};

const SERVICE_SHORT: Record<string, string> = {
  "invisible-grills": "Invisible Grills",
  "safety-nets": "Safety Nets",
  "sports-nets": "Sports Nets",
  "cloth-drying-hangers": "Cloth Hangers",
};

/**
 * Area hubs plus service links only where local facts exist.
 * Avoids a full area×service mesh of near-duplicate URLs.
 */
export function AreaServicesMatrix({
  citySlug,
  cityName,
  areas,
  highlightServiceSlug,
  title,
  description,
  eyebrow = "Areas & services",
  variant = "default",
  className = "",
  excludeAreaSlug,
}: AreaServicesMatrixProps) {
  const factAreas = new Set(
    listAreaFactsForCity(citySlug).map((fact) => fact.areaSlug),
  );
  const list = excludeAreaSlug
    ? areas.filter((area) => area.slug !== excludeAreaSlug)
    : areas;

  if (list.length === 0) return null;

  const services = INITIAL_SERVICES.map((service) => ({
    slug: service.slug,
    name: SERVICE_SHORT[service.slug] ?? service.shortName,
  }));
  const withLocalNotes = list.filter((area) => factAreas.has(area.slug));
  const hubOnly = list.filter((area) => !factAreas.has(area.slug));

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={
            title ??
            `Local service pages in ${cityName}`
          }
          description={
            description ??
            `Service+area pages are published only where we have verified locality notes. Other neighbourhoods still have an area hub for coverage planning.`
          }
        />

        <div className="area-svc-matrix">
          {withLocalNotes.map((area) => (
            <article key={area.slug} className="area-svc-matrix-card">
              <h3>
                <Link href={ROUTES.area(citySlug, area.slug)}>{area.name}</Link>
              </h3>
              <p className="area-svc-matrix-meta">{cityName} · local notes</p>
              <ul className="area-svc-matrix-links">
                {services.map((service) => {
                  const href = ROUTES.areaService(
                    citySlug,
                    area.slug,
                    service.slug,
                  );
                  const isHighlight = highlightServiceSlug === service.slug;
                  return (
                    <li key={service.slug}>
                      <Link
                        href={href}
                        className={
                          isHighlight
                            ? "area-svc-matrix-link is-highlight"
                            : "area-svc-matrix-link"
                        }
                      >
                        {service.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href={ROUTES.area(citySlug, area.slug)}
                className="area-svc-matrix-hub"
              >
                Area hub →
              </Link>
            </article>
          ))}
        </div>
        {hubOnly.length > 0 ? (
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-zinc-600">
            Additional area hubs in {cityName}:{" "}
            {hubOnly.map((area, index) => (
              <span key={area.slug}>
                {index > 0 ? ", " : null}
                <Link
                  href={ROUTES.area(citySlug, area.slug)}
                  className="text-[var(--color-link)] hover:underline"
                >
                  {area.name}
                </Link>
              </span>
            ))}
            . Use the city hub or send photos if your locality is not listed with
            a dedicated service page.
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
