import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

export function ProseSection({
  title,
  children,
  id,
  variant = "default",
}: {
  title?: string;
  children: ReactNode;
  id?: string;
  variant?: "default" | "muted" | "brand";
}) {
  return (
    <Section id={id} variant={variant}>
      <Container>
        {title ? (
          <Heading as="h2" className="mb-6">
            {title}
          </Heading>
        ) : null}
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-zinc-700">
          {children}
        </div>
      </Container>
    </Section>
  );
}

export function BulletListSection({
  title,
  items,
  id,
  variant = "default",
}: {
  title: string;
  items: readonly string[];
  id?: string;
  variant?: "default" | "muted" | "brand";
}) {
  if (items.length === 0) return null;
  return (
    <Section id={id} variant={variant}>
      <Container>
        <Heading as="h2" className="mb-6">
          {title}
        </Heading>
        <ul className="grid max-w-3xl gap-3 text-base leading-relaxed text-zinc-700 sm:grid-cols-1">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary-700)]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export function CardGridSection({
  title,
  subtitle,
  items,
  id,
  variant = "default",
}: {
  title: string;
  subtitle?: string;
  items: readonly { title: string; description: string }[];
  id?: string;
  variant?: "default" | "muted" | "brand";
}) {
  if (items.length === 0) return null;
  return (
    <Section id={id} variant={variant}>
      <Container>
        <Heading as="h2" subtitle={subtitle} className="mb-8">
          {title}
        </Heading>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <h3 className="text-lg font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function NumberedStepsSection({
  title,
  steps,
  id,
}: {
  title: string;
  steps: readonly string[];
  id?: string;
}) {
  if (steps.length === 0) return null;
  return (
    <Section id={id} variant="muted">
      <Container>
        <Heading as="h2" className="mb-8">
          {title}
        </Heading>
        <ol className="mx-auto max-w-3xl space-y-4">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-700)] text-sm font-semibold text-white">
                {index + 1}
              </span>
              <p className="pt-1 text-base leading-relaxed text-zinc-700">{step}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

export function TwoColumnListSection({
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
}: {
  leftTitle: string;
  leftItems: readonly string[];
  rightTitle: string;
  rightItems: readonly string[];
}) {
  return (
    <Section variant="default">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Heading as="h2" className="mb-4">
              {leftTitle}
            </Heading>
            <ul className="space-y-3 text-zinc-700">
              {leftItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Heading as="h2" className="mb-4">
              {rightTitle}
            </Heading>
            <ul className="space-y-3 text-zinc-700">
              {rightItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary-700)]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
