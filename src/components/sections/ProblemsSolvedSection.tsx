import type { ReactNode } from "react";
import { BenefitCard } from "@/components/cards/BenefitCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type ProblemsSolvedItem = {
  title: string;
  description: string;
  icon?: ReactNode;
};

type ProblemsSolvedSectionProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  items: readonly ProblemsSolvedItem[];
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function ProblemsSolvedSection({
  title = "Problems We Help Solve",
  description,
  eyebrow,
  items,
  variant = "muted",
  className = "",
}: ProblemsSolvedSectionProps) {
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
