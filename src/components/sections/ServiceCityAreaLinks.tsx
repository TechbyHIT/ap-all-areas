import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { listAreaFactsForCity } from "@/data/area-local-facts";
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
  /** Areas shown per city when listing several. Ignored for a single city. */
  maxAreasPerCity?: number;
};

/**
 * Every priority city + every curated area → this service's money URLs.
 *
 * Areas are capped when several cities are listed. Uncapped, this renders one
 * anchor per curated area — around 200 of them — into every page that includes
 * it, and this section appears on eight route families covering the bulk of the
 * site. The remainder is reached through the city hub, which links all of its
 * areas, so capping costs one hop of crawl depth rather than any coverage.
 */
const AREAS_PER_CITY = 6;

export function ServiceCityAreaLinks({
  serviceSlug,
  serviceName,
  title,
  description,
  eyebrow = "Cities & areas",
  variant = "muted",
  className = "",
  citySlug,
  maxAreasPerCity = AREAS_PER_CITY,
}: ServiceCityAreaLinksProps) {
  const cities = citySlug
    ? HIGH_PRIORITY_CITY_AREAS.filter((city) => city.citySlug === citySlug)
    : HIGH_PRIORITY_CITY_AREAS;

  if (cities.length === 0) return null;

  // A single city is the page's own subject, so list it in full.
  const capAreas = cities.length > 1;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title ?? `${serviceName} across Andhra Pradesh cities & areas`}
          description={
            description ??
            (capAreas
              ? `${serviceName} in every priority city, with key localities listed and the rest on each city hub. Coverage is confirmed after site review.`
              : `Internal links for ${serviceName} in every curated locality. Coverage is confirmed after site review.`)
          }
        />

        <div className="svc-geo-stack">
          {cities.map((city) => {
            const factSlugs = new Set(
              listAreaFactsForCity(city.citySlug).map((f) => f.areaSlug),
            );
            const noted = city.areas.filter((area) => factSlugs.has(area.slug));
            const areas = capAreas
              ? noted.slice(0, maxAreasPerCity)
              : noted;
            const remainingHubs = city.areas.length - noted.length;

            return (
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
                  {areas.map((area) => (
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
                  {remainingHubs > 0 && (
                    <li>
                      <Link href={ROUTES.location(city.citySlug)}>
                        +{remainingHubs} more area hubs in {city.cityName}
                      </Link>
                    </li>
                  )}
                </ul>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
