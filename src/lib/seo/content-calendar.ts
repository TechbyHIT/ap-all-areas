/**
 * §116–117 Content calendar + seasonal SEO — demand-led, not frequency-led.
 */

export type CalendarDriver =
  | "high-value-service"
  | "high-value-location"
  | "customer-question"
  | "seasonal-demand"
  | "new-project"
  | "gsc-gap"
  | "commercial-opportunity";

export type CalendarItem = {
  id: string;
  title: string;
  driver: CalendarDriver;
  pageType: string;
  priorityBand: "p0" | "p1" | "p2";
  justifiedByDemand: boolean;
  notes: string;
};

/** Seed priorities — expand only with real demand evidence. */
export const SEO_CONTENT_CALENDAR_SEED: CalendarItem[] = [
  {
    id: "svc-invisible-grills-hub",
    title: "Keep Invisible Grills hub decision-complete",
    driver: "high-value-service",
    pageType: "service",
    priorityBand: "p0",
    justifiedByDemand: true,
    notes: "Core commercial entity — not a blog cadence item.",
  },
  {
    id: "city-vizag-safety-nets",
    title: "Visakhapatnam safety nets city-service depth",
    driver: "high-value-location",
    pageType: "city-service",
    priorityBand: "p0",
    justifiedByDemand: true,
    notes: "Priority market + coastal install nuance.",
  },
  {
    id: "gsc-backlog",
    title: "Process Search Console gaps weekly",
    driver: "gsc-gap",
    pageType: "ops",
    priorityBand: "p1",
    justifiedByDemand: true,
    notes: "Only create pages when intent + unique value exist.",
  },
];

export type SeasonalTheme = {
  id: string;
  label: string;
  months: number[]; // 1–12
  contentKinds: Array<"guide" | "faq" | "maintenance" | "reminder" | "landing">;
  requiresDemandEvidence: true;
};

export const SEASONAL_THEMES: SeasonalTheme[] = [
  {
    id: "pre-monsoon-balcony",
    label: "Pre-monsoon balcony / net checks",
    months: [5, 6],
    contentKinds: ["maintenance", "faq", "reminder"],
    requiresDemandEvidence: true,
  },
  {
    id: "post-monsoon-tension",
    label: "Post-monsoon tension / debris checks",
    months: [10, 11],
    contentKinds: ["maintenance", "faq"],
    requiresDemandEvidence: true,
  },
];

export function seasonalThemesForMonth(month: number): SeasonalTheme[] {
  return SEASONAL_THEMES.filter((t) => t.months.includes(month));
}

export function allowCalendarArticle(item: {
  justifiedByDemand: boolean;
  postingForFrequencyOnly?: boolean;
}): boolean {
  if (item.postingForFrequencyOnly) return false;
  return item.justifiedByDemand;
}
