export const BUSINESS_CONFIG = {
  name: "Hiranya Enterprises",
  legalName: "Hiranya Enterprises",
  description:
    "Balcony safety nets, pigeon nets, invisible grills, bird protection, cloth hangers and sports nets installation across Andhra Pradesh—measured quotes from opening photos.",
  websiteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiranayaenterprises.in",
  domain: "hiranayaenterprises.in",
  tagline: "Measured fit · Clear view · Strong protection",

  phone: {
    display: "8074284593",
    raw: "8074284593",
    displayFormatted: "+91 80742 84593",
  },

  whatsapp: {
    display: "8074284593",
    raw: "8074284593",
  },

  email: "hiranyaenterprises02@gmail.com",

  address: {
    street: "1st, 605, 4th Main Cross, MES Rd, near Humming Bird School, Muthyala Nagar",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    postalCode: "560054",
    country: "India",
  },

  coordinates: {
    latitude: null as number | null,
    longitude: null as number | null,
  },

  logo: "/images/hiranya-enterprises-logo.png",
  logoCircle: "/images/hiranya-logo-circle.png",
  defaultOpenGraphImage: "/images/projects/balcony-invisible-grills-8.jpg",

  serviceArea: {
    primaryCity: "Visakhapatnam",
    state: "Andhra Pradesh",
    country: "India",
    statewideCoverage: true,
    displayText:
      "Serving Visakhapatnam, Vijayawada, Kakinada, Rajahmundry, Eluru & nearby Andhra Pradesh",
  },

  socialLinks: {
    instagram: "[INSTAGRAM_URL]",
    facebook: "[FACEBOOK_URL]",
    youtube: "[YOUTUBE_URL]",
  },

  analytics: {
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID,
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
  },
} as const;

/** Indian mobile numbers require 10 digits. */
export function isPhoneValidForProduction(): boolean {
  const digits = BUSINESS_CONFIG.phone.raw.replace(/\D/g, "");
  return digits.length === 10 && /^[6-9]/.test(digits);
}

export function getTelLink(): string | null {
  if (!isPhoneValidForProduction()) return null;
  return `tel:+91${BUSINESS_CONFIG.phone.raw.replace(/\D/g, "")}`;
}

export function getWhatsAppLink(message?: string): string | null {
  if (!isPhoneValidForProduction()) return null;
  const number = `91${BUSINESS_CONFIG.whatsapp.raw.replace(/\D/g, "")}`;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${text}`;
}

export function getEmailLink(): string {
  return `mailto:${BUSINESS_CONFIG.email}`;
}

/** Build a pre-filled WhatsApp enquiry from contact / quote form fields. */
export function buildWhatsAppEnquiryMessage(fields: {
  name?: string;
  phone?: string;
  whatsapp?: string;
  service?: string;
  city?: string;
  area?: string;
  district?: string;
  propertyType?: string;
  message?: string;
}): string {
  const lines = [
    `Hello ${BUSINESS_CONFIG.name}, I need a free estimate.`,
    fields.name ? `Name: ${fields.name}` : null,
    fields.phone ? `Phone: ${fields.phone}` : null,
    fields.whatsapp ? `WhatsApp: ${fields.whatsapp}` : null,
    fields.service ? `Service: ${fields.service}` : null,
    fields.city ? `City: ${fields.city}` : null,
    fields.area ? `Area: ${fields.area}` : null,
    fields.district ? `District: ${fields.district}` : null,
    fields.propertyType ? `Property: ${fields.propertyType}` : null,
    fields.message ? `Message: ${fields.message}` : null,
    "I can share opening photos for a measured quotation.",
  ].filter(Boolean);

  return lines.join("\n");
}

/** Open WhatsApp with a pre-filled enquiry (returns false if WhatsApp is unavailable). */
export function openWhatsAppEnquiry(message: string): boolean {
  const link = getWhatsAppLink(message);
  if (!link || typeof window === "undefined") return false;
  window.open(link, "_blank", "noopener,noreferrer");
  return true;
}
