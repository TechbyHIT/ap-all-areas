import Image from "next/image";
import Link from "next/link";
import {
  BUSINESS_CONFIG,
  getTelLink,
  getWhatsAppLink,
} from "@/config/business";
import { GALLERY_ALL_PROJECTS, HERO_FALLBACK, getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ServiceCityAreaLinks } from "@/components/sections/ServiceCityAreaLinks";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { MoneyLanding } from "@/data/landings/types";

type MoneyLandingViewProps = {
  landing: MoneyLanding;
};

export function MoneyLandingView({ landing }: MoneyLandingViewProps) {
  const tel = getTelLink();
  const wa = getWhatsAppLink(landing.cta.whatsappMessage);
  const place = landing.areaName
    ? `${landing.areaName}, ${landing.cityName}`
    : landing.cityName;
  const gallery = GALLERY_ALL_PROJECTS.slice(0, landing.galleryAlts.length);
  const media = getServiceMedia(landing.serviceSlug);

  return (
    <>
      <section className="border-b border-[var(--border)] bg-[var(--secondary-950)] text-white">
        <Container className="py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="text-[length:var(--text-caption)] font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--primary-300)]">
                {place} · {landing.stateName}
              </p>
              <h1 className="ds-h1 mt-3 max-w-4xl text-balance text-white">
                {landing.hero.h1}
              </h1>
              <p className="mt-4 max-w-2xl text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-white/80">
                {landing.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {tel ? (
                  <Button href={tel} variant="primary">
                    Call Now
                  </Button>
                ) : null}
                {wa ? (
                  <Button href={wa} variant="whatsapp">
                    WhatsApp
                  </Button>
                ) : null}
                <Button href={ROUTES.contact} variant="ghost">
                  Get Free Quote
                </Button>
              </div>
              <p className="mt-4 text-sm text-white/60">
                {landing.companyName} · {landing.phoneDisplay}
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] border border-white/15 bg-white/5 shadow-lg">
              <Image
                src={media.image}
                alt={media.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <h2 className="ds-h2">Why {landing.serviceName.toLowerCase()} matter in {landing.areaName ?? landing.cityName}</h2>
          <div className="prose-readable mt-5 space-y-4 text-[var(--muted-foreground)]">
            {landing.introduction.map((p) => (
              <p key={p.slice(0, 36)}>{p}</p>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <h2 className="ds-h2">Who needs this in {place}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {landing.whoNeedsThis.map((item) => (
              <article key={item.title} className="ds-card p-5">
                <h3 className="font-semibold text-[var(--foreground)]">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="ds-h2">Benefits of professional installation</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {landing.benefits.map((item) => (
              <article key={item.title} className="rounded-[var(--radius-xl)] border border-[var(--border)] p-5">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <h2 className="ds-h2">Features &amp; specification notes</h2>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {landing.features.map((f) => (
              <div key={f.label} className="rounded-[var(--radius-xl)] bg-[var(--card)] p-5 border border-[var(--border)]">
                <dt className="text-sm font-semibold uppercase tracking-wide text-[var(--primary-700)]">
                  {f.label}
                </dt>
                <dd className="mt-2 text-sm text-[var(--muted-foreground)]">{f.value}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-10 text-xl font-semibold">Materials discussed on site</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--muted-foreground)]">
            {landing.materials.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="ds-h2">Applications across {place}</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {landing.applications.map((app) => (
              <li
                key={app}
                className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-sm"
              >
                {app}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <h2 className="ds-h2">Installation process</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {landing.installationSteps.map((step, i) => (
              <li key={step.title} className="ds-card p-5">
                <p className="text-sm font-bold text-[var(--primary-700)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="ds-h2">Why choose {landing.companyName}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {landing.whyChooseUs.map((item) => (
              <article key={item.title} className="border-l-2 border-[var(--primary-500)] pl-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <h2 className="ds-h2">Service areas near {landing.areaName ?? landing.cityName}</h2>
          <p className="mt-3 max-w-3xl text-[var(--muted-foreground)]">
            Nearby localities help with visit planning. Coverage remains subject to site confirmation.
          </p>
          <ul className="mt-6 columns-2 gap-x-8 text-sm text-[var(--foreground)] sm:columns-3 md:columns-4">
            {landing.serviceAreas.map((area) => (
              <li key={area} className="mb-2 break-inside-avoid">
                {area}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="ds-h2">Pricing guide for {landing.serviceName.toLowerCase()} in {place}</h2>
          <p className="mt-3 max-w-3xl text-[var(--muted-foreground)]">{landing.pricing.lead}</p>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-[var(--muted-foreground)]">
            {landing.pricing.factors.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--secondary-700)]">{landing.pricing.disclaimer}</p>
        </Container>
      </Section>

      {landing.reviews.length > 0 ? (
        <Section variant="muted">
          <Container>
            <h2 className="ds-h2">Customer reviews</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {landing.reviews.map((review) => (
                <blockquote key={review.author + review.locality} className="ds-card p-5">
                  <p className="text-sm text-[var(--muted-foreground)]">&ldquo;{review.quote}&rdquo;</p>
                  <footer className="mt-3 text-sm font-semibold">
                    {review.author} · {review.locality}
                  </footer>
                </blockquote>
              ))}
            </div>
          </Container>
        </Section>
      ) : (
        <Section variant="muted">
          <Container>
            <h2 className="ds-h2">Reviews</h2>
            <p className="mt-3 max-w-3xl text-[var(--muted-foreground)]">
              Verified customer reviews for this locality will be published here as consent and
              first-party confirmations are collected. Until then, ask for recent{" "}
              {landing.areaName ?? landing.cityName} or {landing.cityName} project
              references when you enquire.
            </p>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <h2 className="ds-h2">Project gallery</h2>
          <p className="mt-3 text-[var(--muted-foreground)]">
            Real installation photos. Alt text is written for {place} search context.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, index) => (
              <figure key={item.image + index} className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image || HERO_FALLBACK}
                    alt={landing.galleryAlts[index] ?? item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <figcaption className="p-3 text-xs text-[var(--muted-foreground)]">
                  {landing.galleryAlts[index] ?? item.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </Section>

      <FAQSection
        title={`${landing.serviceName} in ${place} — FAQs`}
        items={landing.faqs}
      />

      <Section variant="muted">
        <Container>
          <h2 className="ds-h2">Related services</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {landing.relatedServices.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="ds-link-underline font-medium text-[var(--primary-700)]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mt-10 text-xl font-semibold">Related cities</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {landing.relatedCities.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="ds-link-underline text-[var(--foreground)]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mt-10 text-xl font-semibold">More internal links</h3>
          <ul className="mt-4 columns-1 gap-x-8 text-sm sm:columns-2">
            {landing.internalLinks.map((link) => (
              <li key={link.href} className="mb-2 break-inside-avoid">
                <Link href={link.href} className="text-[var(--primary-700)] hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <ServiceCityAreaLinks
        serviceSlug={landing.serviceSlug}
        serviceName={landing.serviceName}
        citySlug={landing.citySlug}
        title={`${landing.serviceName} across ${landing.cityName} areas`}
        description={`Internal links for ${landing.serviceName.toLowerCase()} in every curated locality of ${landing.cityName}. Coverage is confirmed after site review.`}
        variant="muted"
      />

      <FinalCTA
        title={landing.cta.title}
        description={landing.cta.description}
        whatsappMessage={landing.cta.whatsappMessage}
      />

      <Section>
        <Container>
          <h2 className="text-lg font-semibold">Business details (NAP)</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {BUSINESS_CONFIG.name}
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Phone: {BUSINESS_CONFIG.phone.displayFormatted}
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Email: {BUSINESS_CONFIG.email}
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Address: {BUSINESS_CONFIG.address.street}, {BUSINESS_CONFIG.address.city}{" "}
            {BUSINESS_CONFIG.address.postalCode}
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Service area: {place}, {landing.stateName} (site confirmation required)
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Hours: share preferred slot on WhatsApp — scheduling follows technician availability.
          </p>
        </Container>
      </Section>
    </>
  );
}
