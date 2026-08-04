import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type SafetySectionProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  items: readonly string[];
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function SafetySection({
  title = "Safety Assurance",
  description,
  eyebrow,
  items,
  variant = "muted",
  className = "",
}: SafetySectionProps) {
  if (items.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <ul className="grid max-w-3xl gap-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-700 shadow-sm sm:text-base"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
