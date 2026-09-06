import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { LandingQuickStart } from "@/lib/landing/types";

type QuickStartSectionProps = LandingQuickStart & {
  className?: string;
};

/**
 * "Start here" entry points for visitors who do not yet know what to ask for.
 * Options come from real pages, so this doubles as contextual internal linking.
 */
export function QuickStartSection({
  title = "Not sure where to start?",
  description,
  options,
  className = "",
}: QuickStartSectionProps) {
  if (options.length === 0) return null;

  return (
    <Section className={className}>
      <Container>
        <SectionHeading
          eyebrow="Quick start"
          title={title}
          description={description}
        />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((option) => (
            <li key={`${option.label}-${option.href}`}>
              <Link
                href={option.href}
                className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 transition hover:border-[var(--primary-300)] hover:shadow-[var(--shadow-soft)]"
              >
                <span className="text-base font-semibold text-[var(--color-text-primary)]">
                  {option.label}
                </span>
                {option.description ? (
                  <span className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {option.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
