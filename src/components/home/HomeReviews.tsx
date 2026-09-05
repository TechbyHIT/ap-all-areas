import { ReviewsSection } from "@/components/sections/ReviewsSection";

/** Homepage reviews — empty-state safe, schema-ready via ReviewsSection. */
export function HomeReviews() {
  return (
    <ReviewsSection
      title="Customer reviews"
      description="Verified customer reviews appear here once authorized for publication. We never fabricate ratings or city-specific testimonials."
    />
  );
}
