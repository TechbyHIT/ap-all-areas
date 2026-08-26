import type { Metadata } from "next";
import Link from "next/link";
import { HERO_FALLBACK } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { STATE_NAME } from "@/config/geo";
import { SEO_CONFIG } from "@/config/seo";
import { LocationHero } from "@/components/sections/LocationHero";
import { LocationCards } from "@/components/sections/LocationCards";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FAQSection } from "@/components/sections/FAQSection";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getCityLocalProfile } from "@/data/city-local-profiles";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { listEnabledCities } from "@/lib/data/location-catalog";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

const canonical = buildCanonicalUrl(ROUTES.state);

const faqs = [
  {
    question: "Does Hiranya Enterprises have a branch in every Andhra Pradesh city?",
    answer:
      "No. These pages describe service-area coverage. We confirm whether a technician can visit your building after reviewing address, access and the opening photos—not by listing a shop in every locality.",
  },
  {
    question: "Which cities have dedicated planning pages?",
    answer:
      "Priority city hubs currently include Visakhapatnam, Vijayawada, Guntur, Tirupati, Rajamahendravaram, Kakinada, Nellore, Kurnool and Anantapur. Other towns can still be reviewed case by case from the contact form.",
  },
  {
    question: "How do I request a quotation in Andhra Pradesh?",
    answer:
      "Send balcony or window photos on WhatsApp or the quote form, mention your city and area, and share approximate opening sizes if you have them. Pricing is explained after measurement—not as a published rate card.",
  },
];

export const metadata: Metadata = generatePageMetadata({
  title: `Safety Nets, Invisible Grills & Balcony Solutions in ${STATE_NAME} ${SEO_CONFIG.titleSuffix}`,
  metaDescription:
    "Hiranya Enterprises installs invisible grills, balcony safety nets, pigeon nets, sports nets and cloth hangers across Andhra Pradesh as a service area—not as a chain of local branches. Open a city hub, then request a measured quote.",
  canonicalUrl: canonical,
  ...staticPageIndexability(true),
});

export default function AndhraPradeshHubPage() {
  const cities = listEnabledCities().map((city) => {
    const profile = getCityLocalProfile(city.slug);
    return {
      name: city.name,
      href: ROUTES.location(city.slug),
      parentLabel: STATE_NAME,
      description:
        profile?.climateLead ??
        `Installation support in ${city.name} is confirmed after site review.`,
      serviceCount: INITIAL_SERVICES.length,
    };
  });

  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Locations", path: ROUTES.locations },
          { name: STATE_NAME, path: ROUTES.state },
        ]}
      />
      <LocationHero
        badge={`${STATE_NAME} · Service area`}
        title={`Safety Nets, Invisible Grills & Balcony Solutions in ${STATE_NAME}`}
        description="Hiranya Enterprises plans balcony protection, bird-control netting, sports nets and drying hangers for homes across Andhra Pradesh. City pages explain local building patterns. They are not claims of a physical branch in each town."
        image={{
          src: HERO_FALLBACK,
          alt: "Balcony and window protection work planned across Andhra Pradesh",
        }}
      />

      <CoverageSection
        title="How Andhra Pradesh coverage works"
        coverageText="We operate as a statewide installation service. A listed city means we regularly plan visits there when access and scheduling allow. Always treat the contact step as the confirmation of a specific address—not the city page as a storefront."
        links={[
          { label: "Core services", href: ROUTES.services },
          { label: "Request a quote", href: ROUTES.contact },
        ]}
      />

      <LocationCards
        title="City hubs"
        description="Start with the city you live in, then open an area or a service page when you need a tighter brief for balconies, windows, ducts or practice nets."
        locations={cities}
        variant="muted"
      />

      <Section>
        <Container>
          <h2 className="text-2xl font-semibold tracking-tight">
            Services we plan across the state
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {INITIAL_SERVICES.map((service) => (
              <li key={service.slug}>
                <Link
                  href={ROUTES.service(service.slug)}
                  className="text-[var(--color-link)] hover:underline"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FAQSection
        title={`Questions about ${STATE_NAME} coverage`}
        items={faqs}
      />

      <FinalCTA
        title="Share photos from your opening"
        description="Call, WhatsApp or use the quote form with city, area and clear pictures of the balcony, window, duct or terrace."
      />
    </>
  );
}
