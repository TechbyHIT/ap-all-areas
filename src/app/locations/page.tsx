import type { Metadata } from "next";
import Link from "next/link";
import { HERO_FALLBACK } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { LocationHero } from "@/components/sections/LocationHero";
import { LocationCards } from "@/components/sections/LocationCards";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getCityLocalProfile } from "@/data/city-local-profiles";
import { AP_DISTRICTS, HIGH_PRIORITY_CITY_AREAS } from "@/data/initial-locations";
import { KEYWORD_INTENTS } from "@/data/keyword-intents";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title:
    "Locations Across Andhra Pradesh | Safety Nets, Invisible Grills & More",
  metaDescription:
    "Browse Visakhapatnam, Vijayawada, Guntur, Tirupati, Rajahmundry, Kakinada, Nellore, Kurnool, Anantapur and districts across Andhra Pradesh for balcony safety nets, invisible grills, sports nets and cloth hangers. Coverage subject to site confirmation.",
  canonicalUrl: buildCanonicalUrl("/locations/"),
  ...staticPageIndexability(true),
});

const HIGH_PROBABILITY_KEYWORDS = KEYWORD_INTENTS.filter(
  (k) => k.priority === 0,
).slice(0, 24);

export default function LocationsPage() {
  const priorityCities = HIGH_PRIORITY_CITY_AREAS.map((city) => {
    const profile = getCityLocalProfile(city.citySlug);
    return {
      name: city.cityName,
      href: ROUTES.location(city.citySlug),
      parentLabel: "Andhra Pradesh city",
      description:
        profile?.climateLead ??
        `Installation service is available in ${city.cityName} subject to site measurements, accessibility and technician availability.`,
      serviceCount: 4,
    };
  });

  const districts = AP_DISTRICTS.map((district) => ({
    name: district.name,
    href: ROUTES.location(district.slug),
    parentLabel: "District",
    description:
      "District-level coverage planning across Andhra Pradesh. Individual towns and sites are confirmed after enquiry.",
  }));

  return (
    <>
      <LocationHero
        badge="Andhra Pradesh · Statewide coverage"
        title="Safety Nets & Invisible Grills Across Andhra Pradesh"
        description="From Visakhapatnam to Anantapur, we plan balcony safety nets, invisible grills, sports nets and cloth drying hangers by opening and locality—not by claiming a branch on every street. Pick your city, then send photos for a measured estimate."
        image={{
          src: HERO_FALLBACK,
          alt: "Service coverage across Andhra Pradesh cities and districts",
        }}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Locations" },
        ]}
      />

      <CoverageSection
        title="How statewide coverage works"
        coverageText="We provide installation services across Andhra Pradesh subject to site accessibility, measurements, technician availability and project requirements. City and area pages help with local planning context. Listing a place supports visit routing—it is not proof of a permanent neighbourhood office."
        links={[
          { label: "View services", href: ROUTES.services },
          { label: "Check coverage & quote", href: ROUTES.contact },
        ]}
      />

      <LocationCards
        title="Major cities across Andhra Pradesh"
        description="Nine priority hubs with area-level pages for high-probability local searches—safety nets, invisible grills, sports nets and cloth hangers."
        locations={priorityCities}
        variant="muted"
      />

      <Section>
        <Container>
          <h2 className="ds-h2">High-probability keyword coverage</h2>
          <p className="prose-readable mt-3 text-[var(--muted-foreground)]">
            These commercial intents map across cities and curated areas in
            Andhra Pradesh. Open a city first, then use area or keyword pages for
            a tighter local brief.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {HIGH_PROBABILITY_KEYWORDS.map((keyword) => (
              <li key={keyword.slug}>
                <Link
                  href={ROUTES.keywordInGeo(keyword.slug, "visakhapatnam")}
                  className="text-[var(--color-link)] hover:underline"
                >
                  {keyword.phrase} in Visakhapatnam
                </Link>
                <span className="text-[var(--muted-foreground)]">
                  {" "}
                  · also in other AP cities
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {HIGH_PRIORITY_CITY_AREAS.map((city) => (
              <div key={city.citySlug}>
                <h3 className="font-semibold text-[var(--foreground)]">
                  {city.cityName} areas
                </h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {city.areas
                    .slice(0, 6)
                    .map((a) => a.name)
                    .join(", ")}
                  {city.areas.length > 6
                    ? ` +${city.areas.length - 6} more`
                    : ""}
                </p>
                <Link
                  href={ROUTES.location(city.citySlug)}
                  className="mt-2 inline-block text-sm text-[var(--color-link)] hover:underline"
                >
                  View {city.cityName} coverage
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <LocationCards
        title="Districts"
        description="District groupings help with statewide planning. Town-level feasibility is reviewed per enquiry."
        locations={districts}
      />

      <FinalCTA
        title="Need coverage confirmation for your Andhra Pradesh area?"
        description="Share your city, area, opening photos and whether you need safety nets, invisible grills, sports nets or cloth hangers. We confirm installation after site review."
        whatsappMessage="Hello, I would like to check installation service coverage in my area in Andhra Pradesh."
      />
    </>
  );
}
