import type { ReactNode } from "react";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type MaterialsSectionCard = {
  title: string;
  description: string;
};

type MaterialsSectionProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  prose?: ReactNode;
  note?: string;
  cards?: readonly MaterialsSectionCard[];
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function MaterialsSection({
  title = "Materials & Specifications",
  description,
  eyebrow,
  prose,
  note = "Exact material grade, cable or net spacing, fixing hardware and finish options are confirmed after on-site measurement. Published specs are indicative and may change based on building condition and safety requirements.",
  cards = [],
  variant = "default",
  className = "",
}: MaterialsSectionProps) {
  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        {prose ? (
          <div className="mb-6 max-w-3xl space-y-4 text-base leading-relaxed text-zinc-700">
            {prose}
          </div>
        ) : null}

        <p className="mb-8 max-w-3xl rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-600">
          {note}
        </p>

        {cards.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <FeatureCard
                key={card.title}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
