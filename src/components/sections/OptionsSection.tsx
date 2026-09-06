import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { LandingOption } from "@/lib/landing/types";

type OptionsSectionProps = {
  title: string;
  description?: string;
  items: LandingOption[];
  variant?: "default" | "muted";
  className?: string;
};

/**
 * Variations of an offering. Each option states who it suits and what it does
 * not solve — stating limitations is what makes a comparison useful rather
 * than promotional.
 */
export function OptionsSection({
  title,
  description,
  items,
  variant = "muted",
  className = "",
}: OptionsSectionProps) {
  if (items.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow="Compare options"
          title={title}
          description={description}
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-[var(--primary-700)]">
                Best for: {item.bestFor}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {item.description}
              </p>
              {item.considerations ? (
                <p className="mt-3 rounded-lg bg-[var(--color-bg-muted)] px-3 py-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  Consider: {item.considerations}
                </p>
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className="mt-4 inline-block text-sm font-semibold text-[var(--color-link)] hover:underline"
                >
                  View details →
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
