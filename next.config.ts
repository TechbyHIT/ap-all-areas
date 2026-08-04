import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Smaller production artifact for PM2 / nginx (no Docker). */
  output: "standalone",

  /** Ensure Prisma generated client is included in the standalone trace. */
  outputFileTracingIncludes: {
    "/**": ["./src/generated/prisma/**/*"],
  },

  images: {
    /*
      WebP only. AVIF compresses ~20% smaller but is far slower to encode, and
      every size in deviceSizes is encoded on the first request for it. On a VPS
      shared with other sites that shows up as images that take seconds to
      appear until the cache fills.
    */
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  compress: true,

  poweredByHeader: false,

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
    ];
  },
};

export default nextConfig;
