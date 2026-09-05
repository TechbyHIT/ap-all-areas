/**
 * §66–67 Review / testimonial system — genuine reviews only.
 * Do not fabricate location-specific reviews or star ratings.
 */

export type ReviewPermissionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "revoked";

export type GenuineReview = {
  id: string;
  reviewerName: string;
  reviewText: string;
  /** 1–5 stars; only publish when customer-authorized */
  rating: 1 | 2 | 3 | 4 | 5;
  date: string; // ISO date
  serviceSlug: string | null;
  citySlug: string | null;
  localitySlug: string | null;
  projectSlug: string | null;
  source: "google" | "whatsapp" | "email" | "written" | "other";
  permissionStatus: ReviewPermissionStatus;
  /** Customer entity label only when authorized to publish */
  customerLabel: string | null;
  photoSrc?: string | null;
};

/**
 * Add approved reviews here (or via CMS later).
 * Example shape:
 * {
 *   id: "r-2026-001",
 *   reviewerName: "Verified customer",
 *   reviewText: "…",
 *   rating: 5,
 *   date: "2026-08-01",
 *   serviceSlug: "safety-nets",
 *   citySlug: "visakhapatnam",
 *   localitySlug: null,
 *   projectSlug: null,
 *   source: "whatsapp",
 *   permissionStatus: "approved",
 *   customerLabel: null,
 *   photoSrc: null,
 * }
 */
export const GENUINE_REVIEWS: GenuineReview[] = [];

export function listPublishableReviews(filter?: {
  citySlug?: string;
  serviceSlug?: string;
}): GenuineReview[] {
  return GENUINE_REVIEWS.filter((r) => {
    if (r.permissionStatus !== "approved") return false;
    if (filter?.citySlug && r.citySlug !== filter.citySlug) return false;
    if (filter?.serviceSlug && r.serviceSlug !== filter.serviceSlug) {
      return false;
    }
    return true;
  });
}

export function aggregateRatingFromReviews(reviews: GenuineReview[]): {
  ratingValue: number;
  reviewCount: number;
} | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    ratingValue: Math.round((sum / reviews.length) * 10) / 10,
    reviewCount: reviews.length,
  };
}

export function reviewEntityLinks(review: GenuineReview) {
  return {
    reviewId: review.id,
    customer: review.customerLabel,
    service: review.serviceSlug,
    project: review.projectSlug,
    location: review.citySlug,
    locality: review.localitySlug,
  };
}

/** Reject artificial “reviews in every locality” generation. */
export function canSynthesizeLocalityReview(): false {
  return false;
}
