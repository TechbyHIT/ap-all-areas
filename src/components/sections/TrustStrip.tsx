import { SITE_TRUST_STATS, type TrustStat } from "@/config/trust";
import { Container } from "@/components/ui/Container";

type TrustStripProps = {
  stats?: readonly TrustStat[];
  className?: string;
  /** Optional city label for city hubs — does not invent local stats */
  contextLabel?: string;
};

/**
 * Persistent trust strip — config-driven, never hardcoded fake ratings.
 */
export function TrustStrip({
  stats = SITE_TRUST_STATS,
  className = "",
  contextLabel,
}: TrustStripProps) {
  return (
    <section
      className={`border-b border-[var(--color-border)] bg-[var(--color-bg-muted)] ${className}`.trim()}
      aria-label={contextLabel ? `Trust points for ${contextLabel}` : "Trust points"}
    >
      <Container className="py-4 md:py-5">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <li key={`${stat.value}-${stat.label}`} className="min-w-0">
              <p className="font-display text-sm font-semibold tracking-tight text-[var(--color-text-primary)] md:text-base">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                {stat.label}
              </p>
              {stat.detail ? (
                <p className="mt-1 text-xs leading-snug text-[var(--color-text-secondary)]">
                  {stat.detail}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
