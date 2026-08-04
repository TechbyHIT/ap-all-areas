# Architecture Overview

## Database-Driven Page Generation

Pages are stored as records in PostgreSQL, not as physical files. Dynamic App Router routes resolve slugs against seed data and database records.

## URL Structure

```
/services/[serviceSlug]/
/locations/[locationSlug]/
/locations/[locationSlug]/[areaSlug]/
/[locationSlug]/[serviceSlug]/
/[locationSlug]/[areaSlug]/[serviceSlug]/
```

## Indexability Rules

Pages must pass `isPageIndexable()` checks: published status, quality score ≥ 80, unique content, verified local data, valid schema, and similarity score ≤ 0.7.

## Publishing Workflow

Draft → Validation → Content audit → Local verification → Duplicate audit → SEO audit → Human review → Published → Sitemap inclusion

## Capacity

Architecture supports 400,000+ page records. Initial build pre-renders ~1,000 high-priority URLs via `generateStaticParams`. Remaining pages generate on first request with ISR (revalidate: 86400).
