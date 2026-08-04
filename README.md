# SK Invisible Grills — Andhra Pradesh Programmatic SEO Website

Production-ready Next.js programmatic SEO platform for invisible grills, safety nets, sports nets and cloth drying hangers across Andhra Pradesh.

## Technology Stack

- Next.js 16 App Router, React 19, TypeScript (strict)
- Tailwind CSS 4
- PostgreSQL + Prisma ORM 7
- Zod validation, Vitest, Playwright, ESLint, Prettier

## Quick Start

```bash
cd divya-safe-web
cp .env.example .env
# Configure DATABASE_URL with your PostgreSQL connection

npm install
npm run db:push      # Create database schema
npm run db:seed      # Seed services, districts, locations
npm run dev
```

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Unit tests |
| `npm run db:seed` | Seed AP districts, services, locations |
| `npm run pages:create -- --type=service-location --limit=1000` | Create page records |
| `npm run pages:publish -- --batch-size=500` | Publish approved pages |
| `npm run pages:count` | Page count summary |
| `npm run seo:audit` | SEO audit report |

## Project Structure

- `src/app/` — App Router pages and API routes
- `src/components/` — UI, layout, sections, forms
- `src/config/` — Business, SEO, navigation configuration
- `src/data/` — Seed data (services, AP districts, areas)
- `src/lib/` — Prisma, SEO, schema, publishing logic
- `prisma/` — Database schema and seed
- `scripts/` — Publishing and audit scripts

## Before Production

1. Replace `[BUSINESS_NAME]`, address, email placeholders in `src/config/business.ts`
2. **Correct phone number** — current draft `807484593` has 9 digits; must be 10 digits for Call/WhatsApp links
3. Configure `NEXT_PUBLIC_SITE_URL` and analytics IDs
4. Run migrations and seed against production PostgreSQL
5. Review and publish pages in controlled batches

## Documentation

See also: `ARCHITECTURE.md`, `SEO_ARCHITECTURE.md`, `PUBLISHING_WORKFLOW.md`
