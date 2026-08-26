import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Smaller production artifact for PM2 / nginx (no Docker). */
  output: "standalone",

  /** Match SITE_CONFIG / canonical URLs (trailing slash on). */
  trailingSlash: true,

  /** Ensure Prisma generated client is included in the standalone trace. */
  outputFileTracingIncludes: {
    "/**": ["./src/generated/prisma/**/*"],
  },

  /**
   * Source maps are developer tooling. Shipping them doubles JS weight on disk
   * and gives strangers a map of your bundle. Keep them off in production.
   */
  productionBrowserSourceMaps: false,

  images: {
    /*
      WebP only. AVIF compresses ~20% smaller but is far slower to encode, and
      every size in deviceSizes is encoded on the first request for it. On a VPS
      shared with other sites that shows up as images that take seconds to
      appear until the cache fills.
    */
    formats: ["image/webp"],
    // Dropped 1920: hero/CSS rarely needs it on this site and every width is
    // another on-demand encode + cache entry per image.
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [32, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  compress: true,

  poweredByHeader: false,

  experimental: {
    // Tree-shake icon/util barrels when present; no-op for unused packages.
    optimizePackageImports: ["zod"],
  },

  /**
   * Serve `/sitemaps/{name}.xml` through the App Router handler at
   * `/sitemaps/{name}` so Google gets XML even if the network proxy is stale.
   * Slash variants rewrite internally — no redirect chain for Googlebot.
   */
  async rewrites() {
    return [
      {
        source: "/sitemap.xml/",
        destination: "/sitemap.xml",
      },
      {
        source: "/sitemaps/:name.xml/",
        destination: "/sitemaps/:name",
      },
      {
        source: "/sitemaps/:name.xml",
        destination: "/sitemaps/:name",
      },
    ];
  },

  async headers() {
    const imageHeaders = {
      source: "/images/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    };

    // Next.js owns Cache-Control for /_next/static in `next dev`. Overriding
    // it there breaks HMR; only set the immutable header in production.
    if (process.env.NODE_ENV !== "production") {
      return [imageHeaders];
    }

    return [
      imageHeaders,
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
