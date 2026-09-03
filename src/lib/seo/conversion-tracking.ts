/**
 * §71–72 Conversion tracking + analytics dimensions.
 * Pushes to window.dataLayer when GTM/GA is configured — no invented events.
 */

export type ConversionType =
  | "phone_click"
  | "whatsapp_click"
  | "form_submit"
  | "quote_request"
  | "booking_request"
  | "email_click"
  | "photo_upload"
  | "cta_click";

export type AnalyticsDimensions = {
  pageType: string;
  service?: string | null;
  serviceFamily?: string | null;
  city?: string | null;
  locality?: string | null;
  property?: string | null;
  project?: string | null;
  trafficSource?: string | null;
  conversionType?: ConversionType | null;
};

export type ConversionEvent = {
  event: "conversion";
  conversionType: ConversionType;
  landingPage?: string;
  dimensions: AnalyticsDimensions;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function buildConversionEvent(input: {
  conversionType: ConversionType;
  landingPage?: string;
  dimensions: AnalyticsDimensions;
}): ConversionEvent {
  return {
    event: "conversion",
    conversionType: input.conversionType,
    landingPage: input.landingPage,
    dimensions: {
      ...input.dimensions,
      conversionType: input.conversionType,
    },
  };
}

/** Client-safe push — no-ops when dataLayer is absent. */
export function trackConversion(event: ConversionEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ ...event });
}

export const TRACKING_DATA_ATTR = {
  phone: "data-track-conversion",
  valuePhone: "phone_click",
  valueWhatsapp: "whatsapp_click",
  valueCta: "cta_click",
  valueEmail: "email_click",
  valueForm: "form_submit",
} as const;
