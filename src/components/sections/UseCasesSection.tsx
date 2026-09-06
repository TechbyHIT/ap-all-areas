import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { LandingUseCase } from "@/lib/landing/types";

type UseCasesSectionProps = {
  title: string;
  description?: string;
  items: LandingUseCase[];
  variant?: "default" | "muted";
  className?: string;
};

/** Who the offering suits — audiences, property types, segments. */
export function UseCasesSection({
  title,
  description,
  items,
  variant = "default",
  className = "",
}: UseCasesSectionProps) {
  if (items.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow="Where it fits"
          title={title}
          description={description}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const body = (
              <>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {item.description}
                </p>
              </>
            );

            return (
              <li
                key={item.title}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
              >
                {item.href ? (
                  <Link href={item.href} className="block hover:underline">
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
