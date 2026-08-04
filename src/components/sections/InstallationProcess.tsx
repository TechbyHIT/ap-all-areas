import { ProcessCard } from "@/components/cards/ProcessCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type InstallationProcessStep = {
  title: string;
  description: string;
};

type InstallationProcessProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  steps: readonly InstallationProcessStep[];
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function InstallationProcess({
  title = "Installation Process",
  description,
  eyebrow,
  steps,
  variant = "default",
  className = "",
}: InstallationProcessProps) {
  if (steps.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <ol className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="h-full">
              <ProcessCard
                step={index + 1}
                title={step.title}
                description={step.description}
              />
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
