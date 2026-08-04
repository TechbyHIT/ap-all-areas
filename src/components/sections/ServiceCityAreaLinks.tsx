import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type ServiceCityAreaLinksProps = {
  serviceSlug: string;
  serviceName: string;
  title?: string;
  description?: string;
  eyebrow?: string;
  variant?: "default" | "muted" | "brand";
  className?: string;
  /** Limit to one city (e.g. keyword landing in a city). */
  citySlug?: string;
};

/**
 * Every priority city + every curated area → this service's money URLs.
 */
export function ServiceCityAreaLinks({
  serviceSlug,
  serviceName,
  title,
  description,
  eyebrow = "Cities & areas",
  variant = "muted",
  className = "",
  citySlug,
}: ServiceCityAreaLinksProps) {
  const cities = citySlug
    ? HIGH_PRIORITY_CITY_AREAS.filter((city) => city.citySlug === citySlug)
    : HIGH_PRIORITY_CITY_AREAS;

  if (cities.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title ?? `${serviceName} across Andhra Pradesh cities & areas`}
          description={
            description ??
            `Internal links for ${serviceName} in every priority city and curated locality. Coverage is confirmed after site review.`
          }
        />

        <div className="svc-geo-stack">
          {cities.map((city) => (
            <article key={city.citySlug} className="svc-geo-city">
              <header className="svc-geo-city-head">
                <h3>
                  <Link href={ROUTES.cityService(city.citySlug, serviceSlug)}>
                    {serviceName} in {city.cityName}
                  </Link>
                </h3>
                <div className="svc-geo-city-actions">
                  <Link href={ROUTES.location(city.citySlug)}>City hub</Link>
                  <Link href={ROUTES.cityService(city.citySlug, serviceSlug)}>
                    City service page
                  </Link>
                </div>
              </header>

              <ul className="svc-geo-areas">
                {city.areas.map((area) => (
                  <li key={area.slug}>
                    <Link
                      href={ROUTES.areaService(
                        city.citySlug,
                        area.slug,
                        serviceSlug,
                      )}
                    >
                      {area.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
