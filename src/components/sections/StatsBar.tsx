import { Container } from "@/components/ui/Container";

const STATS = [
  { value: "Photo-led", label: "Estimate start" },
  { value: "Measured", label: "Final quotation" },
  { value: "AP-wide", label: "Service coverage" },
  { value: "4 steps", label: "From photo to fitting" },
  { value: "Clear scope", label: "Written inclusions" },
] as const;

export function StatsBar() {
  return (
    <section className="border-y border-zinc-200 bg-[var(--brand-soft)]">
      <Container className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-3 lg:grid-cols-5">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold text-[var(--primary-700)] sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-zinc-600">{stat.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
