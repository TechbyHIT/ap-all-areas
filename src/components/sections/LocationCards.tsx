import { LocationCard, type LocationCardProps } from "@/components/cards/LocationCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type LocationCardsProps = {
  locations: readonly LocationCardProps[];
  title?: string;
  description?: string;
  eyebrow?: string;
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function LocationCards({
  locations,
  title = "Service Locations",
  description,
  eyebrow,
  variant = "default",
  className = "",
}: LocationCardsProps) {
  if (locations.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <LocationCard key={location.href} {...location} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
