import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans, Sora, Geist_Mono } from "next/font/google";
import { BUSINESS_CONFIG } from "@/config/business";
import { SEO_CONFIG } from "@/config/seo";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { Header } from "@/components/layout/Header";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { organizationSchema, webSiteSchema } from "@/lib/schema";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";
import "./globals.css";

const bodyFont = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const displayFont = Sora({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
  return (
    <html
      lang="en-IN"
      data-theme="light"
      className={`${bodyFont.variable} ${displayFont.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--color-bg-page)] font-sans text-[var(--color-text-primary)]">
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
        <SkipToContent />
        <ScrollProgress />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <BlogTeaser limit={3} />
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  );
}
