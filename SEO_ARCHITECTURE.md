# SEO Architecture

## Metadata

Reusable functions in `src/lib/seo/` generate unique titles, descriptions, canonical URLs and robots directives per page.

## Structured Data

JSON-LD generators in `src/lib/schema/` for Organization, WebSite, Service, BreadcrumbList, FAQPage, WebPage. LocalBusiness schema is withheld until verified address is supplied.

## Sitemaps

`/sitemap.xml` includes core pages, services and high-priority locations. Expand to grouped sitemaps via database-backed generation as pages are published.

## Internal Linking

Contextual links connect parent service, city, area, related services and guides. Orphan detection via `npm run links:audit`.

## Duplicate Protection

Similarity scoring blocks publication when content exceeds 0.7 similarity threshold.
