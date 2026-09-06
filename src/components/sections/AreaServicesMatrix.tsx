import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { listAreaFactsForCity } from "@/data/area-local-facts";
import { listLocationServices } from "@/lib/data/location-catalog";
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

/**
 * Full area × every money-service mesh for a city — cores and specialists.
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

  const services = listLocationServices().map((service) => ({
    slug: service.slug,
    name: service.shortName ?? service.name,
  }));

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title ?? `Every service in every ${cityName} area`}
          description={
            description ??
            `${services.length} installation types × ${list.length} localities in ${cityName}. Coverage is confirmed after site review.`
          }
        />

        <div className="area-svc-matrix">
          {list.map((area) => (
            <article key={area.slug} className="area-svc-matrix-card">
              <h3>
                <Link href={ROUTES.area(citySlug, area.slug)}>{area.name}</Link>
              </h3>
              <p className="area-svc-matrix-meta">
                {cityName}
                {factAreas.has(area.slug) ? " · local notes" : ""}
              </p>
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
      </Container>
    </Section>
  );
}
