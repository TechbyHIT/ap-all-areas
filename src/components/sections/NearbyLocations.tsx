import { AreaCard, type AreaCardProps } from "@/components/cards/AreaCard";
import {
  LocationCard,
  type LocationCardProps,
} from "@/components/cards/LocationCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type NearbyLocationsProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  locations?: readonly LocationCardProps[];
  areas?: readonly AreaCardProps[];
  variant?: "default" | "muted" | "brand";
  className?: string;
};

export function NearbyLocations({
  title = "Nearby Locations",
  description,
  eyebrow,
  locations = [],
  areas = [],
  variant = "muted",
  className = "",
}: NearbyLocationsProps) {
  if (locations.length === 0 && areas.length === 0) return null;

  return (
    <Section variant={variant} className={className}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        {locations.length > 0 ? (
          <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <LocationCard key={location.href} {...location} />
            ))}
          </div>
        ) : null}

        {areas.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <AreaCard key={area.href} {...area} />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
