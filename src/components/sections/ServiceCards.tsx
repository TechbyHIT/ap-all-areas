import { SERVICE_MEDIA, HERO_FALLBACK } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pickDistinctServiceCardImages } from "@/lib/visual/page-image-pick";
import { preferWebpPath } from "@/lib/visual/visual-quality";

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
  pageKey?: string;
};

export function ServiceCards({
  services,
  title = "Our Services",
  description,
  eyebrow,
  variant = "default",
  className = "",
  pageKey = "services",
}: ServiceCardsProps) {
  if (services.length === 0) return null;

  const distinct = pickDistinctServiceCardImages(
    pageKey,
    services.map((s) => s.slug),
  );

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
            const picked = distinct[service.slug];
            const image =
              service.image ?? picked?.src ?? media?.image ?? HERO_FALLBACK;
            return (
              <ServiceCard
                key={service.slug}
                name={service.name}
                slug={service.slug}
                summary={service.summary}
                benefits={service.benefits}
                image={preferWebpPath(image)}
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
