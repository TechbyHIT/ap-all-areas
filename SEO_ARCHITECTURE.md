# SEO Architecture

## Metadata

Reusable functions in `src/lib/seo/` generate unique titles, descriptions, canonical URLs and robots directives per page. Hub pages emit BreadcrumbList JSON-LD via `HubBreadcrumbs`. Hierarchical builders: `src/lib/seo/breadcrumb-paths.ts` (§50).

Intent titles / meta: `title-meta-system.ts` + `generateTitle` / `generateDescription` (§78–79). Heading + readability helpers in the same module (§80–81).

## Structured Data

JSON-LD generators in `src/lib/schema/` for Organization, WebSite, Service, BreadcrumbList, FAQPage, WebPage, ImageObject, VideoObject (videos only when genuine). LocalBusiness schema is withheld until verified coordinates are supplied in `BUSINESS_CONFIG`. Validation: `src/lib/seo/schema-validation.ts` + `npm run schema:audit` / `npm run seo:canonical-schema`.

## Media, conversion & content systems (§62–81)

| Area | Module / behaviour |
|------|-------------------|
| Image alt | `image-alt.ts` — descriptive alts; reject stuffing |
| Image entities | `image-entities.ts` — Image → Project → Service → Location → Property |
| Video | `video-seo.ts` — empty until genuine videos exist |
| Gallery | `gallery-organization.ts` + `/gallery/` grouped by service |
| Reviews | `data/reviews.ts` — publish only approved genuine reviews |
| Contextual CTA | `contextual-cta.ts` — quote / availability / visit / photos / compare |
| Lead form | `QuoteForm` fields + page-context defaults (§70) |
| Conversion tracking | `conversion-tracking.ts` + `data-track-conversion` on CTAs |
| Analytics dims | pageType, service, city, locality, property, project, conversionType |
| GSC loop | `gsc-loop.ts` — opportunity heuristics from export rows |
| Content gaps | `content-gap.ts` against semantic model |
| Competitor lens | `competitor-analysis.ts` — opportunities only; never copy |
| SERP intent | `serp-intent.ts` — match page type to dominant intent |
| Zero-click | concise answer blocks → deeper content (natural writing) |

Honesty: no fake videos, no fabricated reviews, no invented photo cities.

## Final operating system (§113–130)

| Area | Module |
|------|--------|
| Priority score | `seo-priority.ts` — business + conversion, not traffic-only |
| Organic / content→conversion | `organic-conversion.ts` |
| Calendar / seasonal | `content-calendar.ts` |
| Project freshness | `project-freshness.ts` |
| New service/city/locality/property | `entity-workflows.ts` |
| Deletion strategy | `content-deletion.ts` |
| Red flags | `seo-red-flags.ts` |
| Site graph + publish principle | `site-graph.ts` |
| Representative test set | `representative-test-set.ts` · `npm run seo:test-set` |

**Deliverable doc:** `docs/SEO_FINAL_DELIVERABLE.md`  
**Principle:** Entity → Intent → Information → Location → Evidence → Link → Conversion  
**Scale rule:** systems first → audit representative test set → only then expand

## Local ops, content IA & SEO QA (§82–112)

| Area | Module / behaviour |
|------|-------------------|
| Comparison tables | `comparison-tables.ts` — standard factors; no City A vs City B spam |
| Nearby locations | `nearby-locations.ts` — curated geographic adjacency only |
| Service-area claims | `local-business-model.ts` — office vs service-area vs project |
| Availability matrix | `availability-matrix.ts` — service×city×locality status |
| Location/property gates | `location-property-gates.ts` + privacy blocklist |
| Content blocks | `content-blocks.ts` — modular blocks + page-type focus |
| UX / a11y checklists | `ux-a11y-policy.ts` |
| Crawl / URL / HTTP QA | `crawl-url-qa.ts` |
| Governance / changelog | `content-governance.ts` |
| Automated QA + dashboards | `seo-health.ts` · `npm run seo:qa` · `/admin/audits/` |

Main nav (§99): Home · Services · Areas · Projects · Guides · About · Contact  
Footer: key services + major cities only (no thousands of locality URLs). Genuine social links only.

```bash
npm run seo:qa
SEO_QA_STRICT=1 npm run seo:qa   # fail on critical
```

## Crawl governance (§41–60)

| Area | Module / command |
|------|------------------|
| Orphan detection | `src/lib/seo/orphan-detection.ts` · `npm run seo:orphans` |
| Broken links / chains | `src/lib/seo/link-health.ts` · `npm run seo:link-health` |
| Redirect registry | `src/lib/seo/redirect-registry.ts` (static + silo; prefer A→C) |
| Canonical validation | `src/lib/seo/canonical-validation.ts` |
| Hreflang / i18n | `src/lib/seo/hreflang-policy.ts` — **disabled** (en-IN only) |
| Indexability states | `src/lib/seo/indexability-states.ts` — draft → review → published → indexable / noindex / archived |
| Facet / search / pagination | `src/lib/seo/facet-seo.ts` — clean paths only; search/sort/filter noindex |
| JS SEO + CWV checklist | `src/lib/seo/js-seo-policy.ts` |

Honesty: no fabricated Review/aggregateRating schema; no hreflang until real language/region URLs exist.

## Comparisons, quality & programmatic safety (§23–40)

- Comparisons: `/comparisons/` + genuine pairs only (`src/data/comparisons.ts`)
- Problem journey: solutions pages follow Problem → Possible solutions → Comparison → Recommended → Location → Quote
- Quality QC: `src/lib/seo/page-quality.ts` (80+ publish / 65 review / 50 rewrite / below noindex)
- Cannibalization: `src/lib/seo/cannibalization.ts`
- Programmatic gate: `canPublishProgrammaticPage()` in `page-decision.ts`
- Semantic model: `src/data/service-semantic-model.ts`
- FAQ ownership map: `src/lib/seo/faq-ownership.ts`
- Local entity + freshness flags: `src/lib/seo/local-entity.ts`
- Internal link priority: `prioritizeInternalLinks()` / `serviceHubLinkGraph()`

## Service page advanced template (§13)

Core `/services/[slug]/` pages follow the choose/trust/convert H2 set: What Is, Who Needs, Problems, Where Used, Types, Materials, How to Choose, Installation, Cost, Maintenance, Mistakes, Limitations, When Another Service Is Better, Service Areas, Projects (photos), Related, Guides, FAQs, Quote.

Extra sections live in `src/data/service-advanced-sections.ts`.

## Projects (§22)

Photo-led records in `src/data/projects.ts` → `/projects/` and `/projects/[slug]/`.
City/customer/review fields stay null until verified — no invented case studies.

## Service family pillars

Choose/compare hubs under `/services/{family}/` (no collision with core or sub-service slugs):

| Family | Path |
|--------|------|
| Balcony Safety | `/services/balcony-safety/` |
| Bird Control | `/services/bird-control/` |
| Sports Enclosures | `/services/sports-enclosures/` |
| Cloth Drying | `/services/cloth-drying/` |

Data: `src/data/service-families.ts`. Linked from `/services/`, mega menu category hubs, and sitemap.

## Keyword ownership (one URL per intent cluster)

**Module:** `src/lib/seo/keyword-ownership.ts`  
**Types:** `src/types/keyword-ownership.ts`

Each keyword × curated city maps to a single `canonicalURL` (often the silo city×service page). Status values: `owner` | `redirect-to-owner` | `supporting` | `deferred`.

```bash
npm run seo:keyword-ownership   # writes reports/keyword-ownership-summary.json
```

Keyword×city landings set `rel=canonical` (and noindex when consolidated) via `getKeywordOwnerPath`.

## Sitemaps (live discovery) (§51–52)

**Source of truth:** `src/lib/seo/sitemap-registry.ts`

- Index: `/sitemap.xml` → `src/app/sitemap.xml/route.ts`
- Children: `/sitemaps/{name}.xml` → `src/app/sitemaps/[name]/route.ts`  
  (core, services, city-services, areas, area-services, societies, images, …)

> Note: Next.js 16 `generateSitemaps()` can leave `/sitemap.xml` as HTTP 404 while only `/sitemap/0.xml` works. Keep the manual index + child routes.

Rules:

- Absolute HTTPS URLs with trailing slash
- Stable `lastmod` from `SEO_CONFIG.sitemapContentRevision`
- Only canonical, indexable, non-redirect paths
- No thank-you / admin / noindex drafts / parameter URLs
- Deduplicated entries

Validate before deploy:

```bash
npm run seo:validate-sitemap
SITEMAP_VALIDATE_HTTP=0 npm run seo:validate-sitemap
SITEMAP_VALIDATE_BASE=https://example.com npm run seo:validate-sitemap
```

## DB sitemap script (not production XML)

`npm run sitemaps:generate` writes a **DB eligibility summary** to `reports/sitemap-summary.json` only.

## robots.txt (§53)

`src/app/robots.ts` allows public pages (including CSS/JS/images via `/`), disallows `/admin/`, `/api/`, `/thank-you/`, `/landings/` (internal rewrite targets), references `/sitemap.xml`. Facet/query sprawl is controlled in app logic via `facet-seo.ts`, not by blocking static assets.

## Internal Linking

Contextual links connect parent service, city, area, related services and guides.

```bash
npm run seo:orphans          # static orphan report → reports/orphan-pages.json
npm run links:audit          # DB inbound-link orphans (if page records exist)
npm run seo:link-health      # static broken/redirect issues (+ HTTP if LINK_HEALTH_BASE set)
```

## Duplicate Protection

Similarity scoring blocks publication when content exceeds 0.7 similarity threshold.

## Premium page visual system (§131–182)

Every indexable money/editorial URL uses a **page-type visual strategy**, not a single cloned template.

| Layer | Location |
|-------|----------|
| Layout / section matrix | `src/lib/visual/page-composition.ts` |
| Hero media + image entities | `src/lib/visual/hero-media.ts` |
| Page media bundle | `src/lib/visual/page-media.ts` |
| Quality gate / WebP helpers | `src/lib/visual/visual-quality.ts` |
| Premium heroes | `PremiumPageHero`, `LocationHero`, `ServiceHero` |

Rules enforced in code + scripts:

- Distinct hero compositions per page type (service / city / locality / project / guide / comparison)
- Genuine installation photos preferred; never invent city/customer claims on images
- Raster delivery paths prefer `.webp` (`preferWebpPath`, media configs)
- Pipeline: `npm run images:optimize` → `npm run images:validate`
- Logo PNGs are documented exceptions in `validate-images.ts`
- Visual gate tests: `src/tests/unit/visual-page-system.test.ts`

```bash
npm run images:optimize
npm run images:validate
# optional strict fail on critical:
IMAGES_VALIDATE_STRICT=1 npm run images:validate
```
