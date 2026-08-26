import Link from "next/link";
import {
  BUSINESS_CONFIG,
  getTelLink,
  getWhatsAppLink,
} from "@/config/business";
import { ROUTES } from "@/config/routes";
import { HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { Button } from "@/components/ui/Button";

const SERVICE_LINKS = [
  {
    label: "Invisible Grills",
    href: ROUTES.service("invisible-grills"),
  },
  {
    label: "Balcony Safety Nets",
    href: ROUTES.service("safety-nets"),
  },
  {
    label: "Sports & Cricket Nets",
    href: ROUTES.service("sports-nets"),
  },
  {
    label: "Cloth Drying Hangers",
    href: ROUTES.service("cloth-drying-hangers"),
  },
] as const;

const TRUST = [
  "Measured around your opening",
  "Family, bird, pet & sports options",
  "Photo for clear estimate",
  "Andhra Pradesh service-area coverage",
];

export function HomeHero() {
  const tel = getTelLink();
  const wa = getWhatsAppLink(
    "Hello, I am sharing balcony photos for a free estimate in Andhra Pradesh.",
  );
  const localSamples = INITIAL_SERVICES.map((service) => ({
    label: `${service.shortName} in Visakhapatnam`,
    href: ROUTES.cityService("visakhapatnam", service.slug),
  }));
  const cities = HIGH_PRIORITY_CITY_AREAS;

  return (
    <section className="hero">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(720px 320px at 90% 0%, rgb(47 116 240 / 0.12), transparent 55%), radial-gradient(520px 280px at 0% 100%, rgb(184 137 47 / 0.08), transparent 50%)",
        }}
      />

      <div className="hero-container">
        <div className="hero-content">
          <p className="ds-badge ds-badge--champagne mb-4">
            {BUSINESS_CONFIG.name} · Andhra Pradesh
          </p>
          <h1>
            Invisible Grills, Balcony Safety Nets &amp; Bird Protection Across
            Andhra Pradesh
          </h1>
          <p className="hero-description">
            Professional installation for apartments, villas and practice spaces
            in Visakhapatnam, Vijayawada, Guntur, Tirupati, Rajahmundry, Kakinada,
            Nellore, Kurnool, Anantapur and nearby areas. Match the product to the
            opening—then send photos for a measured estimate.
          </p>

          <div className="hero-actions">
            {wa ? (
              <Button href={wa} variant="whatsapp" className="button">
                Send a Photo for Estimate
              </Button>
            ) : null}
            {tel ? (
              <Button href={tel} variant="primary" className="button">
                Call {BUSINESS_CONFIG.phone.displayFormatted}
              </Button>
            ) : null}
            <Button href={ROUTES.locations} variant="outline" className="button">
              Find your service city
            </Button>
            <Link
              href={ROUTES.services}
              className="button button-secondary inline-flex min-h-[54px] items-center justify-center rounded-[var(--radius-lg)] px-6 text-sm font-semibold tracking-tight"
            >
              Browse all services
            </Link>
          </div>

          <ul className="hero-chips">
            {TRUST.map((item) => (
              <li key={item} className="hero-chip">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-directory">
          <div>
            <h2>Core services</h2>
            <ul>
              {SERVICE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href={ROUTES.gallery}>Installation photo gallery</Link>
              </li>
              <li>
                <Link href={ROUTES.faq}>Safety net FAQs</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2>Cities we plan for</h2>
            <ul>
              {cities.map((city) => (
                <li key={city.citySlug}>
                  <Link href={ROUTES.location(city.citySlug)}>
                    {city.cityName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Popular local searches</h2>
            <ul>
              {localSamples.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Same intents also map to{" "}
              <Link
                href={ROUTES.location("vijayawada")}
                className="text-[var(--color-link)] hover:underline"
              >
                Vijayawada
              </Link>
              ,{" "}
              <Link
                href={ROUTES.location("guntur")}
                className="text-[var(--color-link)] hover:underline"
              >
                Guntur
              </Link>
              ,{" "}
              <Link
                href={ROUTES.locations}
                className="text-[var(--color-link)] hover:underline"
              >
                and all AP hubs
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
