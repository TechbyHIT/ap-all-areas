import Link from "next/link";
import { SERVICE_MEDIA, HERO_FALLBACK } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type RelatedServiceItem = {
  name: string;
  slug: string;
  summary: string;
  benefits?: string[];
  image?: string;
  href?: string;
};

export type RelatedServiceLink = {
  title: string;
  href: string;
  summary: string;
};

type RelatedServicesProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  services?: readonly RelatedServiceItem[];
  links?: readonly RelatedServiceLink[];
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function RelatedServices({
  title = "Related Services",
  description,
  eyebrow,
  services = [],
  links = [],
  variant = "default",
  className = "",
}: RelatedServicesProps) {
  if (services.length === 0 && links.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        {services.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const media = SERVICE_MEDIA[service.slug];
              return (
                <ServiceCard
                  key={service.slug}
                  name={service.name}
                  slug={service.slug}
                  summary={service.summary}
                  benefits={service.benefits}
                  image={service.image ?? media?.image ?? HERO_FALLBACK}
                  href={service.href ?? ROUTES.service(service.slug)}
                />
              );
            })}
          </div>
        ) : null}

        {links.length > 0 ? (
          <div
            className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${services.length > 0 ? "mt-6" : ""}`}
          >
            {links.map((link) => (
              <Card
                key={link.href}
                as="article"
                hover
                className="flex h-full flex-col"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  <Link
                    href={link.href}
                    className="hover:text-[var(--primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-600)]"
                  >
                    {link.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
                  {link.summary}
                </p>
                <Link
                  href={link.href}
                  className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--primary-700)] hover:text-[var(--primary-700)]"
                >
                  View service
                  <span aria-hidden="true" className="ml-1">
                    &rarr;
                  </span>
                </Link>
              </Card>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
