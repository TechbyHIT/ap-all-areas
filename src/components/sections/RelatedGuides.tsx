import { GuideCard } from "@/components/cards/GuideCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type RelatedGuideItem = {
  title: string;
  href: string;
  summary: string;
};

type RelatedGuidesProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  guides: readonly RelatedGuideItem[];
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function RelatedGuides({
  title = "Related Guides",
  description,
  eyebrow,
  guides,
  variant = "muted",
  className = "",
}: RelatedGuidesProps) {
  if (guides.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <GuideCard
              key={guide.href}
              title={guide.title}
              href={guide.href}
              summary={guide.summary}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
