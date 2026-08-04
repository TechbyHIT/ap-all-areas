import { PropertyTypeCard } from "@/components/cards/PropertyTypeCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type PropertyTypesItem = {
  title: string;
  description: string;
  href?: string;
};

type PropertyTypesSectionProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  items: readonly PropertyTypesItem[];
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function PropertyTypesSection({
  title = "Property Types We Serve",
  description,
  eyebrow,
  items,
  variant = "default",
  className = "",
}: PropertyTypesSectionProps) {
  if (items.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <PropertyTypeCard
              key={item.title}
              title={item.title}
              description={item.description}
              href={item.href}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
