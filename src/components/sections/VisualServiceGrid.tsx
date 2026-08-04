import Image from "next/image";
import Link from "next/link";
import {
  HOME_VISUAL_SERVICES,
  type VisualServiceItem,
} from "@/config/design";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type VisualServiceGridProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  services?: readonly VisualServiceItem[];
  variant?: "default" | "muted" | "brand";
};

export function VisualServiceGrid({
  title = "All safety & utility services",
  description = "Every major offering on one page—each card uses a real installation photograph so you can compare finishes before you enquire.",
  eyebrow = "Complete service picture guide",
  services = HOME_VISUAL_SERVICES,
  variant = "default",
}: VisualServiceGridProps) {
  return (
    <Section variant={variant}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.name}
              className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card)]"
            >
              <Link href={service.href} className="relative block aspect-[4/3] bg-zinc-100">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  <Link
                    href={service.href}
                    className="hover:text-[var(--primary-700)]"
                  >
                    {service.name}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {service.summary}
                </p>
                <Link
                  href={service.href}
                  className="mt-3 text-sm font-semibold text-[var(--primary-700)] hover:underline"
                >
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
