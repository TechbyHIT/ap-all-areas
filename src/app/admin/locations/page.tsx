import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

export default function AdminLocationsPage() {
  return (
    <Section>
      <Container>
        <Heading as="h1">Locations Management</Heading>
        <p className="mt-4 text-zinc-600">Manage districts, cities, areas and localities. Bulk import available for verified Andhra Pradesh data.</p>
      </Container>
    </Section>
  );
}
