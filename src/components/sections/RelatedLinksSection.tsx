import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { LandingRelatedGroup } from "@/lib/landing/types";

type RelatedLinksSectionProps = {
  groups: LandingRelatedGroup[];
  title?: string;
  description?: string;
  variant?: "default" | "muted";
  className?: string;
};

/**
 * Contextual internal links grouped by relationship. Deliberately grouped and
 * capped rather than a single flat link dump.
 */
export function RelatedLinksSection({
  groups,
  title = "Continue exploring",
  description,
  variant = "muted",
  className = "",
}: RelatedLinksSectionProps) {
  const usable = groups.filter((group) => group.links.length > 0);
  if (usable.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading title={title} description={description} />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {usable.map((group) => (
            <div key={group.title}>
              <h3 className="border-b border-[var(--color-border)] pb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-primary)]">
                {group.title}
              </h3>
              {group.description ? (
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {group.description}
                </p>
              ) : null}
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-link)] hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
