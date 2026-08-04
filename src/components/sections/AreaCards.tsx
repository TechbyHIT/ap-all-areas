import { AreaCard, type AreaCardProps } from "@/components/cards/AreaCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type AreaCardsProps = {
  areas: readonly AreaCardProps[];
  title?: string;
  description?: string;
  eyebrow?: string;
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function AreaCards({
  areas,
  title = "Areas We Cover",
  description,
  eyebrow,
  variant = "default",
  className = "",
}: AreaCardsProps) {
  if (areas.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <AreaCard key={area.href} {...area} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
