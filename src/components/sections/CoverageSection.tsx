import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type CoverageLink = {
  label: string;
  href: string;
};

type CoverageSectionProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  coverageText: string;
  links?: readonly CoverageLink[];
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function CoverageSection({
  title = "Service Coverage",
  description,
  eyebrow,
  coverageText,
  links = [],
  variant = "default",
  className = "",
}: CoverageSectionProps) {
  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <p className="max-w-3xl text-base leading-relaxed text-zinc-700">
          {coverageText}
        </p>

        {links.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-10 items-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-[var(--primary-300)] hover:text-[var(--primary-700)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </Section>
  );
}
