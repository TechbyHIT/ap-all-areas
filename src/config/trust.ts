/**
 * Site-wide trust metrics — honest values only.
 * Never invent years, star ratings, or installation counts.
 */

export type TrustStat = {
  value: string;
  label: string;
  detail?: string;
};

/**
 * Wire real numbers here only when verified in BUSINESS_CONFIG / ops data.
 * Until then, use process claims (not vanity metrics).
 */
export const SITE_TRUST_STATS: TrustStat[] = [
  {
    value: "Photo estimate",
    label: "First step",
    detail: "Send opening photos for early guidance",
  },
  {
    value: "Measured quote",
    label: "Before work",
    detail: "Final price after site measurement",
  },
  {
    value: "Andhra Pradesh",
    label: "Service area",
    detail: "Statewide installation support",
  },
  {
    value: "Clear scope",
    label: "Written quote",
    detail: "Material, fixing and finish itemised",
  },
];
