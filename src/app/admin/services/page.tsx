import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

export default function AdminServicesPage() {
  return (
    <Section>
      <Container>
        <Heading as="h1">Services Management</Heading>
        <p className="mt-4 text-zinc-600">Manage primary services and sub-services. Authentication required for production.</p>
      </Container>
    </Section>
  );
}
