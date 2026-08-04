import type { ReactNode } from "react";
import { BenefitCard } from "@/components/cards/BenefitCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type BenefitsSectionItem = {
  title: string;
  description: string;
  icon?: ReactNode;
};

type BenefitsSectionProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  items: readonly BenefitsSectionItem[];
  variant?: "default" | "muted" | "brand";
  align?: "left" | "center";
  className?: string;
};

export function BenefitsSection({
  title = "Benefits",
  description,
  eyebrow,
  items,
  variant = "default",
  align = "left",
  className = "",
}: BenefitsSectionProps) {
  if (items.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align={align}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <BenefitCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
