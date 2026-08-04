import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type MaintenanceSectionProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  items: readonly string[];
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function MaintenanceSection({
  title = "Maintenance Guidance",
  description,
  eyebrow,
  items,
  variant = "default",
  className = "",
}: MaintenanceSectionProps) {
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
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary-700)]"
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
