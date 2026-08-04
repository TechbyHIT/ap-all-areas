import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Smaller production artifact for PM2 / nginx (no Docker). */
  output: "standalone",

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

  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
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
