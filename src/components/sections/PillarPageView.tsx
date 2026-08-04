import Link from "next/link";
import { getServiceMedia } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ServiceCityAreaLinks } from "@/components/sections/ServiceCityAreaLinks";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { PillarPage, PillarSection } from "@/data/pillars/types";

function EntityStrip({ pillar }: { pillar: PillarPage }) {
  const groups = [
    { label: "Climate entities", items: pillar.entityGraph.climate },
    { label: "Landmarks", items: pillar.entityGraph.landmarks },
    { label: "Apartment mentions", items: pillar.entityGraph.apartments },
    { label: "Transport context", items: pillar.entityGraph.transport },
  ];

  return (
    <Section variant="muted">
      <Container>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Vizag context that changes the install brief
        </h2>
        <p className="mt-3 max-w-3xl text-zinc-600">
          Climate, landmarks, apartment belts and access corridors that affect
          material grade, spacing and visit planning—kept short so you can reach
          pricing, process and contact quickly.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {groups.map((group) => (
            <div
              key={group.label}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--gold-dark)]">
                {group.label}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function SectionBlock({ section }: { section: PillarSection }) {
  switch (section.kind) {
    case "prose":
      return (
        <Section>
          <Container>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {section.heading}
            </h2>
            <div className="prose-readable mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-zinc-700">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </Container>
        </Section>
      );

    case "split-list":
      return (
        <Section variant="muted">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {section.heading}
            </h2>
            <p className="mt-3 max-w-3xl text-zinc-600">{section.lead}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {section.items.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-zinc-200 bg-white p-5"
                >
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      );

    case "comparison":
      return (
        <Section>
          <Container>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {section.heading}
            </h2>
            <p className="mt-3 max-w-3xl text-zinc-600">{section.lead}</p>
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500">
                    <th className="py-3 pr-4 font-semibold">Option</th>
                    <th className="py-3 pr-4 font-semibold">Best when</th>
                    <th className="py-3 font-semibold">Watch out</th>
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row) => (
                    <tr key={row.option} className="border-b border-zinc-100">
                      <td className="py-4 pr-4 align-top font-semibold text-zinc-900">
                        {row.option}
                      </td>
                      <td className="py-4 pr-4 align-top text-zinc-700">
                        {row.bestWhen}
                      </td>
                      <td className="py-4 align-top text-zinc-600">
                        {row.watchOut}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </Section>
      );

    case "pricing":
      return (
        <Section variant="muted">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {section.heading}
            </h2>
            <p className="mt-3 max-w-3xl text-zinc-600">{section.lead}</p>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {section.bands.map((band) => (
                <article
                  key={band.context}
                  className="rounded-xl border border-zinc-200 bg-white p-5"
                >
                  <h3 className="font-semibold text-zinc-900">{band.context}</h3>
                  <p className="mt-2 text-sm text-zinc-700">{band.rangeNote}</p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Drivers: {band.drivers}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-sm text-zinc-600">
              {section.disclaimer}
            </p>
          </Container>
        </Section>
      );

    case "process":
      return (
        <Section>
          <Container>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {section.heading}
            </h2>
            <p className="mt-3 max-w-3xl text-zinc-600">{section.lead}</p>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {section.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-xl border border-zinc-200 bg-white p-5"
                >
                  <p className="text-sm font-bold text-[var(--gold-dark)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-semibold text-zinc-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      );

    case "link-graph":
      return (
        <Section variant="muted">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {section.heading}
            </h2>
            <p className="mt-3 max-w-3xl text-zinc-600">{section.lead}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-[var(--gold)]"
                  >
                    <span className="font-semibold text-[var(--gold-dark)]">
                      {link.label}
                    </span>
                    {link.note ? (
                      <span className="mt-1 block text-sm text-zinc-500">
                        {link.note}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      );

    case "faq":
      return <FAQSection title={section.heading} items={section.items} />;

    default:
      return null;
  }
}

type PillarPageViewProps = {
  pillar: PillarPage;
};

export function PillarPageView({ pillar }: PillarPageViewProps) {
  const media = getServiceMedia(pillar.serviceSlug);
  const faqSection = pillar.sections.find((s) => s.kind === "faq");

  return (
    <>
      <ServiceHero
        badge={pillar.hero.badge}
        title={pillar.hero.h1}
        description={pillar.hero.deck}
        trustLine={pillar.hero.trustLine}
        whatsappMessage={pillar.hero.whatsappMessage}
        image={{
          src: media.image,
          alt: media.alt,
        }}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Services", href: ROUTES.services },
          {
            label: "Invisible Grills",
            href: ROUTES.service(pillar.serviceSlug),
          },
          { label: "Visakhapatnam" },
        ]}
        quoteHref={`${ROUTES.contact}?service=${encodeURIComponent(pillar.serviceSlug)}&city=Visakhapatnam`}
      />

      <EntityStrip pillar={pillar} />

      {pillar.sections
        .filter((s) => s.kind !== "faq")
        .map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}

      {faqSection && faqSection.kind === "faq" ? (
        <FAQSection title={faqSection.heading} items={faqSection.items} />
      ) : null}

      <ServiceCityAreaLinks
        serviceSlug={pillar.serviceSlug}
        serviceName="Invisible Grills"
        citySlug="visakhapatnam"
        title="Invisible grills across Visakhapatnam areas"
        description="Browse every curated Visakhapatnam locality page for invisible grill installation."
        variant="muted"
      />

      <FinalCTA
        title={pillar.finalCta.title}
        description={pillar.finalCta.description}
        whatsappMessage={pillar.finalCta.whatsappMessage}
      />
    </>
  );
}
