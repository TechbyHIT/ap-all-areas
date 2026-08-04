import { SERVICE_MEDIA, HERO_FALLBACK } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type ServiceCardsItem = {
  name: string;
  slug: string;
  summary: string;
  benefits?: string[];
  image?: string;
  href?: string;
  quoteHref?: string;
};

type ServiceCardsProps = {
  services: readonly ServiceCardsItem[];
  title?: string;
  description?: string;
  eyebrow?: string;
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function ServiceCards({
  services,
  title = "Our Services",
  description,
  eyebrow,
  variant = "default",
  className = "",
}: ServiceCardsProps) {
  if (services.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
                quoteHref={service.quoteHref}
              />
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
