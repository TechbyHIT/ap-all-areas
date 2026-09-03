/**
 * §66–67 Review / testimonial system — genuine reviews only.
 * Do not fabricate location-specific reviews.
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
  date: string; // ISO date
  serviceSlug: string | null;
  citySlug: string | null;
  localitySlug: string | null;
  projectSlug: string | null;
  source: "google" | "whatsapp" | "email" | "written" | "other";
  permissionStatus: ReviewPermissionStatus;
  /** Customer entity label only when authorized to publish */
  customerLabel: string | null;
};

/** Published set stays empty until verified reviews are approved. */
export const GENUINE_REVIEWS: GenuineReview[] = [];

export function listPublishableReviews(): GenuineReview[] {
  return GENUINE_REVIEWS.filter((r) => r.permissionStatus === "approved");
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
