import Link from "next/link";
import { ROUTES } from "@/config/routes";
import {
  AP_DISTRICTS,
  HIGH_PRIORITY_CITY_AREAS,
} from "@/data/initial-locations";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { KEYWORD_INTENTS } from "@/data/keyword-intents";
/** Keyword slugs that map 1:1 to core services for non-priority cities. */
const SERVICE_KEYWORD_SLUG: Record<string, string> = {
  "invisible-grills": "invisible-grills",
  "safety-nets": "balcony-safety-nets",
  "sports-nets": "sports-nets",
  "cloth-drying-hangers": "cloth-drying-hangers",
};

const CORE_SERVICES = INITIAL_SERVICES.map((service) => ({
  slug: service.slug,
  name: service.shortName,
}));

const P0_KEYWORDS = KEYWORD_INTENTS.filter((k) => k.priority === 0);

/** Extra district cities shown on home (no curated area money matrix yet). */
const EXTRA_DISTRICT_CITIES = [
  "eluru",
  "vizianagaram",
  "srikakulam",
] as const;

function serviceShortLabel(slug: string): string {
  if (slug === "cloth-drying-hangers") return "Cloth Hangers";
  if (slug === "invisible-grills") return "Invisible Grills";
  if (slug === "safety-nets") return "Safety Nets";
  if (slug === "sports-nets") return "Sports Nets";
  return slug;
}

export function HomeLocations() {
  const extraCities = EXTRA_DISTRICT_CITIES.flatMap((slug) => {
    for (const district of AP_DISTRICTS) {
      const place = district.places.find((p) => p.slug === slug);
      if (place) {
        return [
          {
            slug: place.slug,
            name: place.name,
            towns: district.places.filter(
              (p) =>
                p.slug !== place.slug &&
                (p.locationType === "town" || p.locationType === "city"),
            ),
          },
        ];
      }
    }
    return [];
  });

  const totalAreas = HIGH_PRIORITY_CITY_AREAS.reduce(
    (sum, city) => sum + city.areas.length,
    0,
  );
  const totalAreaServiceLinks = totalAreas * CORE_SERVICES.length;
  const totalCityServiceLinks =
    HIGH_PRIORITY_CITY_AREAS.length * CORE_SERVICES.length;

  return (
    <section className="home-section home-section--soft" id="locations">
      <div className="home-container">
        <header className="home-section-head">
          <p className="home-eyebrow">Service locations</p>
          <h2 className="home-h2">
            Every service across cities &amp; areas in Andhra Pradesh
          </h2>
          <p className="home-lead">
            Full installation coverage for {CORE_SERVICES.length} core
            services across {HIGH_PRIORITY_CITY_AREAS.length} cities and{" "}
            {totalAreas} areas ({totalCityServiceLinks} city pages +{" "}
            {totalAreaServiceLinks} area service pages). Visits are arranged
            after site confirmation—not invented branch offices.
          </p>
        </header>

        {/* Compact city overview with all 4 services */}
        <div className="home-city-grid">
          {HIGH_PRIORITY_CITY_AREAS.map((city) => {
            return (
              <article key={city.citySlug} className="home-city-card">
                <h3>
                  <Link href={ROUTES.location(city.citySlug)}>
                    {city.cityName}
                  </Link>
                </h3>
                <p>
                  All four core services across {city.areas.length} curated
                  areas in {city.cityName}.
                </p>
                <ul className="home-city-services" aria-label={`${city.cityName} services`}>
                  {CORE_SERVICES.map((service) => (
                    <li key={`${city.citySlug}-${service.slug}`}>
                      <Link
                        href={ROUTES.cityService(city.citySlug, service.slug)}
                      >
                        {serviceShortLabel(service.slug)}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="home-city-areas">
                  {city.areas.slice(0, 6).map((area) => (
                    <li key={area.slug}>
                      <Link href={ROUTES.area(city.citySlug, area.slug)}>
                        {area.name}
                      </Link>
                    </li>
                  ))}
                  {city.areas.length > 6 ? (
                    <li>
                      <a href={`#city-${city.citySlug}`}>
                        +{city.areas.length - 6} more areas
                      </a>
                    </li>
                  ) : null}
                </ul>
                <Link
                  href={`#city-${city.citySlug}`}
                  className="home-city-link"
                >
                  All {city.areas.length} areas × services ↓
                </Link>
              </article>
            );
          })}
        </div>

        {/* Full city × area × service matrix — nothing omitted */}
        <div className="home-geo-matrix">
          <header className="home-section-head home-geo-matrix-head">
            <h3 className="home-h2" style={{ fontSize: "1.35rem" }}>
              Complete services by city &amp; area
            </h3>
            <p className="home-lead">
              Every curated area lists all four installation services. Open a
              city to browse the full area list.
            </p>
          </header>

          <div className="home-geo-cities">
            {HIGH_PRIORITY_CITY_AREAS.map((city, index) => (
              <details
                key={city.citySlug}
                id={`city-${city.citySlug}`}
                className="home-geo-city"
                open={index < 2}
              >
                <summary className="home-geo-city-summary">
                  <span>
                    {city.cityName}
                    <span className="home-geo-city-meta">
                      {city.areas.length} areas · {CORE_SERVICES.length}{" "}
                      services
                    </span>
                  </span>
                </summary>

                <div className="home-geo-city-body">
                  <nav
                    className="home-geo-city-services"
                    aria-label={`${city.cityName} city-wide services`}
                  >
                    <Link
                      href={ROUTES.location(city.citySlug)}
                      className="home-geo-hub"
                    >
                      {city.cityName} hub
                    </Link>
                    {CORE_SERVICES.map((service) => (
                      <Link
                        key={`${city.citySlug}-svc-${service.slug}`}
                        href={ROUTES.cityService(city.citySlug, service.slug)}
                      >
                        {serviceShortLabel(service.slug)} in {city.cityName}
                      </Link>
                    ))}
                  </nav>

                  <div className="home-geo-area-grid">
                    {city.areas.map((area) => (
                      <article
                        key={`${city.citySlug}-${area.slug}`}
                        className="home-geo-area"
                      >
                        <h4>
                          <Link href={ROUTES.area(city.citySlug, area.slug)}>
                            {area.name}
                          </Link>
                        </h4>
                        <ul>
                          {CORE_SERVICES.map((service) => (
                            <li
                              key={`${city.citySlug}-${area.slug}-${service.slug}`}
                            >
                              <Link
                                href={ROUTES.areaService(
                                  city.citySlug,
                                  area.slug,
                                  service.slug,
                                )}
                              >
                                {serviceShortLabel(service.slug)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>

                  <details className="home-geo-keywords">
                    <summary>
                      All keyword searches in {city.cityName} areas (
                      {P0_KEYWORDS.length * city.areas.length} links)
                    </summary>
                    <div className="home-geo-keyword-areas">
                      {city.areas.map((area) => (
                        <div
                          key={`${city.citySlug}-${area.slug}-kw`}
                          className="home-geo-keyword-area"
                        >
                          <p>
                            <Link href={ROUTES.area(city.citySlug, area.slug)}>
                              {area.name}
                            </Link>
                          </p>
                          <ul>
                            {P0_KEYWORDS.map((keyword) => (
                              <li
                                key={`${keyword.slug}-in-${area.slug}`}
                              >
                                <Link
                                  href={ROUTES.keywordInGeo(
                                    keyword.slug,
                                    area.slug,
                                  )}
                                >
                                  {keyword.phrase}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Extra district cities + nearby towns */}
        {extraCities.length > 0 ? (
          <div className="home-geo-extra">
            <h3 className="home-h2" style={{ fontSize: "1.25rem" }}>
              Additional service-area cities
            </h3>
            <p className="home-lead">
              Installation support in these districts is arranged after site
              confirmation. Browse nearby towns below.
            </p>
            <div className="home-geo-extra-grid">
              {extraCities.map((city) => (
                <article key={city.slug} className="home-city-card">
                  <h3>{city.name}</h3>
                  <ul className="home-city-services">
                    {CORE_SERVICES.map((service) => (
                      <li key={`${city.slug}-${service.slug}`}>
                        <Link
                          href={ROUTES.keywordInGeo(
                            SERVICE_KEYWORD_SLUG[service.slug] ??
                              "balcony-safety-nets",
                            city.slug,
                          )}
                        >
                          {serviceShortLabel(service.slug)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <ul className="home-city-areas">
                    {city.towns.map((town) => (
                      <li key={town.slug}>
                        <Link
                          href={ROUTES.keywordInGeo(
                            "balcony-safety-nets",
                            town.slug,
                          )}
                        >
                          {town.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <nav className="home-dir-links" aria-label="Location directories">
          <Link href={ROUTES.locations}>View all locations</Link>
          <Link href={ROUTES.services}>All services</Link>
          {HIGH_PRIORITY_CITY_AREAS.map((city) => (
            <Link key={`dir-${city.citySlug}`} href={ROUTES.location(city.citySlug)}>
              {city.cityName}
            </Link>
          ))}
        </nav>

        {/* P0 keywords × every money city */}
        <div className="home-seo-prose home-keyword-matrix">
          <h3 className="home-h2" style={{ fontSize: "1.35rem" }}>
            Popular local searches by city
          </h3>
          <p className="home-lead">
            High-intent service keywords linked for every priority city (
            {P0_KEYWORDS.length} keywords × {HIGH_PRIORITY_CITY_AREAS.length}{" "}
            cities).
          </p>
          <ul className="home-keyword-list">
            {P0_KEYWORDS.map((keyword) => (
              <li key={keyword.slug}>
                <span className="home-keyword-label">{keyword.phrase}</span>
                <span className="home-keyword-cities">
                  {HIGH_PRIORITY_CITY_AREAS.map((city, i) => (
                    <span key={`${keyword.slug}-${city.citySlug}`}>
                      {i > 0 ? " · " : null}
                      <Link
                        href={ROUTES.keywordInGeo(keyword.slug, city.citySlug)}
                      >
                        {city.cityName}
                      </Link>
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
