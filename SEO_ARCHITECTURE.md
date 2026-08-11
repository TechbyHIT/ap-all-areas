# SEO Architecture

## Metadata

Reusable functions in `src/lib/seo/` generate unique titles, descriptions, canonical URLs and robots directives per page. Hub pages emit BreadcrumbList JSON-LD via `HubBreadcrumbs`.

## Structured Data

JSON-LD generators in `src/lib/schema/` for Organization, WebSite, Service, BreadcrumbList, FAQPage, WebPage. LocalBusiness schema is withheld until verified coordinates are supplied in `BUSINESS_CONFIG`.

## Sitemaps (live discovery)

**Source of truth:** `src/lib/seo/sitemap-registry.ts`, served by App Router `src/app/sitemap.ts` as a **single** `/sitemap.xml` urlset.

> Note: Next.js 16 `generateSitemaps()` can leave `/sitemap.xml` as HTTP 404 while only `/sitemap/0.xml` works. Do not re-enable it without a manual index route — Google Search Console will report "Couldn't fetch".

Rules enforced by the registry:

- Absolute HTTPS URLs with trailing slash
- Stable `lastmod` from `SEO_CONFIG.sitemapContentRevision` (and per-post dates for blog)
- No redirect-equivalent `/{service}-in-{city}/` URLs (those 308 to `/{city}/{service}/`)
- No thank-you / admin / noindex guide-detail URLs
- Deduplicated entries; chunked at ≤9000 URLs per file

Validate before deploy:

```bash
npm run seo:validate-sitemap                 # registry integrity (+ HTTP if BASE set)
SITEMAP_VALIDATE_HTTP=0 npm run seo:validate-sitemap
SITEMAP_VALIDATE_BASE=https://example.com npm run seo:validate-sitemap
```

`deploy/site-deploy.sh` runs registry validation before promote and an HTTP sample after health check.

## DB sitemap script (not production XML)

`npm run sitemaps:generate` (`scripts/generate-sitemaps.ts`) writes a **DB eligibility summary** to `reports/sitemap-summary.json` only. It does **not** emit the live XML search engines fetch. Prefer the App Router registry for discovery.

## robots.txt

`src/app/robots.ts` allows public pages, disallows `/admin/`, `/api/`, `/thank-you/`, references `/sitemap.xml`, and disallows all crawling on staging/non-production hosts.

## Internal Linking

Contextual links connect parent service, city, area, related services and guides. Orphan detection via `npm run links:audit` (DB graph).

## Duplicate Protection

Similarity scoring blocks publication when content exceeds 0.7 similarity threshold.
