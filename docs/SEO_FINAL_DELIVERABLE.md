# Final SEO Architecture Deliverable (§129)

> Non-negotiable (§130): Never confuse more SEO pages with better SEO.  
> Journey: **Entity → Intent → Information → Location → Evidence → Internal link → Conversion**  
> User path: **Question → Answer → Service → Location → Evidence → Contact**

Generate live snapshots:

```bash
npm run seo:qa
npm run seo:test-set
npm run seo:keyword-ownership
```

---

## 1. Architecture

### Sitemap
- Index: `/sitemap.xml`
- Children: `/sitemaps/{name}.xml` (core, services, city-services, areas, area-services, societies, images, …)
- Source: `src/lib/seo/sitemap-registry.ts`
- Rules: absolute HTTPS, trailing slash, canonical only, no redirects/noindex/drafts/params

### URL hierarchy (live silo)
```
/                                 Home
/services/                        Service hub
/services/{family}/               Service family
/services/{service}/              Service
/locations/                       Areas hub
/locations/andhra-pradesh/        State
/locations/andhra-pradesh/{city}/ City
/locations/andhra-pradesh/{city}/{area}/
/locations/andhra-pradesh/{city}/{service}/
/locations/andhra-pradesh/{city}/{area}/{service}/
/projects/ · /projects/{slug}/
/guides/{slug}/ · /comparisons/{slug}/
/solutions/{slug}/ · /property-types/{type}/{service}/
```

Pretty aliases (e.g. `/{service}-in-{city}/`) **308 → silo canonical**.

### Page types
home · service-family · service · state · city · locality · city-service · locality-service · property-type · project · guide · comparison · solution · legal · contact

### Entity graph
```
BUSINESS
├── SERVICES → FAMILY → SERVICE → PROJECTS
├── AREAS → STATE → CITY → LOCALITY → PROPERTY → PROJECTS
└── GUIDES → TOPICS → QUESTIONS → COMMERCIAL PAGES
         ↓
   REAL EVIDENCE → CONVERSION
```

Module: `src/lib/seo/site-graph.ts` · business SoT: `local-business-model.ts`

---

## 2. SEO

| Concern | Strategy / module |
|---------|-------------------|
| Keyword clusters | `keyword-ownership.ts` — one owner URL per intent |
| Intent map | `serp-intent.ts` + page-decision |
| Metadata | `title-meta-system.ts` + `generatePageMetadata` — unique, intent-based |
| Canonical | absolute HTTPS self-URL; `canonical-validation.ts` |
| Robots | `robots.ts` allow `/`; disallow admin/api/thank-you/landings |
| Sitemap | registry + App Router routes |
| Schema | Organization, WebSite, Service, Breadcrumb, FAQ, WebPage, Image; LocalBusiness only with coords; Video only if genuine |
| Priority | `seo-priority.ts` — business value + conversion, not traffic alone |
| Red flags | `seo-red-flags.ts` |
| Indexability | draft → review → published → **indexable** / noindex / archived |

---

## 3. Content architecture

| Surface | Approach |
|---------|----------|
| Service | Advanced template + semantic model + family pillars |
| City | Coverage honesty + local facts; not a branch claim |
| Locality | Only with catalog facts + quality gate |
| Property | Property-type hubs only until named societies verified |
| Project | Photo evidence; city/customer null until verified |
| Guide | Informational → CTA to service |
| Comparison | Genuine pairs only + standard factor table |
| FAQ | Ownership map — no identical blocks everywhere |

Workflows: `entity-workflows.ts` · deletion: `content-deletion.ts` · calendar: `content-calendar.ts`

---

## 4. Internal linking

| From | To |
|------|----|
| Service | family, cities, guides, projects, related |
| City | services, city-service, localities, projects |
| Locality | city, locality-service, nearby localities, projects |
| Property type | service, contact |
| Project | service, projects hub |
| Guide | commercial service / comparison |

Engines: `internal-links.ts`, `nearby-locations.ts`, `contextual-cta.ts`, `organic-conversion.ts`  
Discoverability (§100): main nav + breadcrumbs + contextual links

**Main nav:** Home · Services · Areas · Projects · Guides · About · Contact

---

## 5. Technical (Next.js)

| Topic | Implementation |
|-------|----------------|
| Rendering | Server Components for SEO content; force-dynamic sitemaps where needed |
| Metadata API | `generatePageMetadata` |
| Images | `next/image` + descriptive alts (`image-alt.ts`) |
| CWV | `js-seo-policy.ts` checklist |
| Structured data | `src/lib/schema` + validation |
| Redirects | `proxy.ts` + `redirect-registry.ts` (308, flattened) |
| Indexability | publication gates + quality scores |
| Crawl controls | `facet-seo.ts`, robots, orphan/link health |
| Facets / search | noindex uncontrolled params; no internal-search landings |

---

## 6. Automation

| Job | Command / module |
|-----|------------------|
| Page generation gate | `page-decision.ts`, `canPublishProgrammaticPage` |
| Quality / cannibalization | `page-quality.ts`, `cannibalization.ts` |
| Orphans / broken links | `seo:orphans`, `seo:link-health` |
| Sitemap | registry + `seo:validate-sitemap` |
| Metadata / schema QA | `seo:canonical-schema`, `schema:audit` |
| Full SEO QA | `npm run seo:qa` |
| Test set before scale | `npm run seo:test-set` |
| Dashboards | `/admin/audits/` + `reports/*-dashboard.json` |

**§128 rule:** do not mass-generate until representative test set passes.

---

## 7. Business

| Capability | Module |
|------------|--------|
| Lead / conversion tracking | `conversion-tracking.ts`, QuoteForm dataLayer |
| Organic funnel | `organic-conversion.ts` |
| Service / location availability | `availability-matrix.ts` |
| Projects | `data/projects.ts` + freshness workflow |
| Reviews | `data/reviews.ts` — approved genuine only |
| Local entity SoT | `BUSINESS_CONFIG` / `local-business-model.ts` |

---

## 8. Representative test set (§128)

1 Homepage · 1 Service family · 2 Services · 1 City · 2 City+Service · 2 Localities · 2 Locality+Service · property-type pages · 1 Project · 2 Guides · 1 Comparison  

Audit: `npm run seo:test-set` → `reports/seo-test-set.json`

Scale only after: systems built **and** test set + quality gates pass.

---

## 9. Premium visual page system (§131–182)

| Requirement | Implementation |
|-------------|----------------|
| Unique page composition | `page-composition.ts` strategies + matrix |
| Dedicated heroes | `PremiumPageHero` / `LocationHero` / `ServiceHero` compositions |
| Image entity + priority | `hero-media.ts` (real install > stock/generated) |
| Page media bundle | `buildPageMediaBundle()` |
| WebP pipeline | `images:optimize` / `images:validate` |
| Visual quality gate | `runVisualQualityGate()` + unit tests |
| next/image | WebP formats in `next.config.ts`; LCP `priority` on heroes |

**Golden rule:** same design system, different page strategy — never city-name-swap templates.
