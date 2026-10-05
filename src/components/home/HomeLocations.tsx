import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { listLocationServices } from "@/lib/data/location-catalog";

/** Areas shown per city on the homepage matrix. Full lists live on city hubs. */
const AREAS_PER_CITY = 6;

/**
 * Homepage location band. City cards link every published location service
 * (cores + specialists) so Google and visitors can reach money URLs from home.
 * Full area × service grids stay on city hubs — not dumped onto `/`.
 */
export function HomeLocations() {
  const services = listLocationServices();
  const totalAreas = HIGH_PRIORITY_CITY_AREAS.reduce(
    (sum, city) => sum + city.areas.length,
    0,
  );

  return (
    <section className="home-section home-section--soft" id="locations">
      <div className="home-container">
        <header className="home-section-head">
          <p className="home-eyebrow">Service locations</p>
          <h2 className="home-h2">
            Every service across cities &amp; areas in Andhra Pradesh
          </h2>
          <p className="home-lead">
            Coverage for {services.length} installation types across{" "}
            {HIGH_PRIORITY_CITY_AREAS.length} cities and {totalAreas} curated
            areas. Each city hub lists every locality; key areas are previewed
            below. Visits are arranged after site confirmation—not invented
            branch offices.
          </p>
        </header>

        <div className="home-city-grid">
          {HIGH_PRIORITY_CITY_AREAS.map((city) => {
            const preview = city.areas.slice(0, AREAS_PER_CITY);
            const remaining = city.areas.length - preview.length;
            return (
              <article key={city.citySlug} className="home-city-card">
                <h3>
                  <Link href={ROUTES.location(city.citySlug)}>
                    {city.cityName}
                  </Link>
                </h3>
                <p>
                  All {services.length} published services across{" "}
                  {city.areas.length} curated areas in {city.cityName}.
                </p>
                <ul
                  className="home-city-services"
                  aria-label={`${city.cityName} services`}
                >
                  {services.map((service) => (
                    <li key={`${city.citySlug}-${service.slug}`}>
                      <Link
                        href={ROUTES.cityService(city.citySlug, service.slug)}
                      >
                        {service.shortName ?? service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="home-city-areas">
                  {preview.map((area) => (
                    <li key={area.slug}>
                      <Link href={ROUTES.area(city.citySlug, area.slug)}>
                        {area.name}
                      </Link>
                    </li>
                  ))}
                  {remaining > 0 ? (
                    <li>
                      <Link href={ROUTES.location(city.citySlug)}>
                        +{remaining} more areas in {city.cityName}
                      </Link>
                    </li>
                  ) : null}
                </ul>
                <Link
                  href={ROUTES.location(city.citySlug)}
                  className="home-city-link"
                >
                  {city.cityName} hub →
                </Link>
              </article>
            );
          })}
        </div>

        <p className="home-lead" style={{ marginTop: "1.5rem" }}>
          Other Andhra Pradesh towns are reviewed after a site request — start
          from the{" "}
          <Link href={ROUTES.state}>Andhra Pradesh hub</Link>, not a separate
          city page we have not published.
        </p>

        <nav className="home-dir-links" aria-label="Location directories">
          <Link href={ROUTES.locations}>View all locations</Link>
          <Link href={ROUTES.state}>Andhra Pradesh hub</Link>
          <Link href={ROUTES.services}>All services</Link>
          {HIGH_PRIORITY_CITY_AREAS.map((city) => (
            <Link
              key={`dir-${city.citySlug}`}
              href={ROUTES.location(city.citySlug)}
            >
              {city.cityName}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
