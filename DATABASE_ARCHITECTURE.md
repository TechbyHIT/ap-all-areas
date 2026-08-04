# Database Architecture

PostgreSQL + Prisma ORM store all programmatic SEO entities. Pages are records, not physical files.

## Core Models

| Model | Purpose |
|-------|---------|
| Business | Central business config (phone, address, verification flags) |
| ServiceCategory / Service / SubService | Service hierarchy |
| Location / Area / Landmark | State → district → city → area hierarchy |
| PropertyType / Problem | Combination page dimensions |
| Page / PageContent / FAQ | Generated page records and content |
| BlogPost / BlogCategory / Author | Content clusters |
| Redirect / InternalLink / SitemapEntry | Technical SEO graph |
| PageAudit / PublishingBatch | Quality and publishing controls |

## Indexes

Indexed fields: `path`, `pageType`, `publicationStatus`, `allowIndexing`, `serviceId`, `locationId`, `areaId`, `qualityScore`, `crawlPriority`, `updatedAt`, `sitemapGroup`.

## Pagination

Always use cursor-based pagination. Never load all page records into memory.

## Seed Data

```bash
npm run db:push
npm run db:seed
```

Seeds: 4 primary services, 26 AP districts, priority cities/areas, property types, problems.
