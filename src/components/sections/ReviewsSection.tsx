import { listPublishableReviews, type GenuineReview } from "@/data/reviews";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

type ReviewsSectionProps = {
  title?: string;
  description?: string;
  citySlug?: string;
  serviceSlug?: string;
  limit?: number;
  className?: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < rating ? "text-[var(--accent-500)]" : "text-zinc-300"}
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: GenuineReview }) {
  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
      <Stars rating={review.rating} />
      <blockquote className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        “{review.reviewText}”
      </blockquote>
      <footer className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
        <span className="font-semibold text-[var(--color-text-primary)]">
          {review.customerLabel ?? review.reviewerName}
        </span>
        {review.citySlug ? (
          <span className="rounded-full bg-[var(--color-bg-muted)] px-2 py-0.5 capitalize">
            {review.citySlug.replace(/-/g, " ")}
          </span>
        ) : null}
        {review.serviceSlug ? (
          <span className="rounded-full bg-[var(--color-bg-muted)] px-2 py-0.5 capitalize">
            {review.serviceSlug.replace(/-/g, " ")}
          </span>
        ) : null}
      </footer>
    </article>
  );
}

/**
 * Real reviews only. Empty-state when none approved — never fabricate ratings.
 */
export function ReviewsSection({
  title = "Customer reviews",
  description = "We publish verified customer reviews only — never fabricated ratings or location-specific testimonials.",
  citySlug,
  serviceSlug,
  limit = 6,
  className = "",
}: ReviewsSectionProps) {
  const reviews = listPublishableReviews({ citySlug, serviceSlug }).slice(
    0,
    limit,
  );

  if (reviews.length === 0) {
    return (
      <Section className={className} variant="muted">
        <Container>
          <SectionHeading title={title} description={description} />
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8 text-center">
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Verified reviews will appear here once customers authorize
              publication. Until then, use installation photos and a measured
              quotation conversation to evaluate fit.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href={ROUTES.gallery}
                className="inline-flex min-h-11 items-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
              >
                View installation photos
              </Link>
              <Link
                href={ROUTES.contact}
                className="inline-flex min-h-11 items-center rounded-xl bg-[var(--accent-500)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] transition hover:bg-[var(--accent-600)]"
              >
                Request a photo estimate
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className={className}>
      <Container>
        <SectionHeading title={title} description={description} />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
