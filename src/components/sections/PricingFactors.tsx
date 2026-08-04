import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type PricingFactorsProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  items: readonly string[];
  honestStatement?: string;
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function PricingFactors({
  title = "Pricing Factors",
  description,
  eyebrow,
  items,
  honestStatement = "We do not publish fixed package prices because every site differs. Final quotation depends on measurements, material grade, required spacing, installation height, access conditions and total quantity. Any estimate shared before measurement is indicative only.",
  variant = "muted",
  className = "",
}: PricingFactorsProps) {
  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <p className="mb-6 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
          {honestStatement}
        </p>

        {items.length > 0 ? (
          <ul className="grid max-w-3xl gap-3 sm:grid-cols-1">
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
        ) : null}
      </Container>
    </Section>
  );
}
