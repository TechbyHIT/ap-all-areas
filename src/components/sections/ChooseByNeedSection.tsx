import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type NeedPath = {
  title: string;
  summary: string;
  href: string;
};

type ChooseByNeedSectionProps = {
  locationName: string;
  paths: NeedPath[];
  description?: string;
};

/**
 * Problem-first navigation (competitor pattern: need → service → locality),
 * with Hiranya-original copy — not a cloned EverSafe page.
 */
export function ChooseByNeedSection({
  locationName,
  paths,
  description,
}: ChooseByNeedSectionProps) {
  if (paths.length === 0) return null;

  return (
    <Section variant="muted">
      <Container>
        <SectionHeading
          title={`Start with the opening need in ${locationName}`}
          description={
            description ??
            `Pick the closest problem first, then open the matching service page. City and area pages confirm coverage after site review — they are not local branch claims.`
          }
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <li key={path.href}>
              <Link
                href={path.href}
                className="block h-full rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-[var(--primary-300)] hover:shadow-sm"
              >
                <h3 className="text-base font-semibold text-zinc-900">
                  {path.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {path.summary}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-[var(--primary-700)]">
                  View option →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
