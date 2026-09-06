import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { BUSINESS_CONFIG } from "@/config/business";
import { SEO_CONFIG } from "@/config/seo";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { Header } from "@/components/layout/Header";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { JsonLd } from "@/components/seo/JsonLd";
import { ResourceHints } from "@/components/seo/ResourceHints";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import {
  localBusinessSchema,
  organizationSchema,
  reviewsSchema,
  webSiteSchema,
} from "@/lib/schema";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";
import "./globals.css";

/** Fewer weights = less font bytes (CWV / GFG page-speed basics). */
const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const displayFont = Fraunces({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS_CONFIG.websiteUrl),
  ...generatePageMetadata({
    title: SEO_CONFIG.defaultTitle,
    metaDescription: SEO_CONFIG.defaultDescription,
    canonicalUrl: buildCanonicalUrl("/"),
    openGraphImage: BUSINESS_CONFIG.defaultOpenGraphImage,
    openGraphImageAlt: `${BUSINESS_CONFIG.name} — ${SEO_CONFIG.defaultTitle}`,
    ...staticPageIndexability(true),
  }),
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
      { url: "/images/hiranya-logo-circle.png", type: "image/png", sizes: "512x512" },
      { url: "/images/hiranya-favicon-circle-256.png", type: "image/png", sizes: "256x256" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const reviewLd = reviewsSchema();

  return (
    <html
      lang="en-IN"
      data-theme="light"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <head>
        <ResourceHints />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--color-bg-page)] font-sans text-[var(--color-text-primary)]">
        <JsonLd
          data={[
            organizationSchema(),
            webSiteSchema(),
            localBusinessSchema(),
            ...(reviewLd ? [reviewLd] : []),
          ]}
        />
        <SkipToContent />
        <ScrollToTop />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  );
}
