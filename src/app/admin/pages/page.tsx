import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

export default function AdminPagesPage() {
  return (
    <Section>
      <Container>
        <Heading as="h1">Page Records</Heading>
        <p className="mt-4 text-zinc-600">View and manage programmatic page records with pagination.</p>
      </Container>
    </Section>
  );
}
