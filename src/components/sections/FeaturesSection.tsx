import { FeatureCard } from "@/components/cards/FeatureCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type FeaturesSectionItem = {
  title: string;
  description: string;
};

type FeaturesSectionProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  items: readonly FeaturesSectionItem[];
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function FeaturesSection({
  title = "Key Features",
  description,
  eyebrow,
  items,
  variant = "default",
  className = "",
}: FeaturesSectionProps) {
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
            <FeatureCard
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
