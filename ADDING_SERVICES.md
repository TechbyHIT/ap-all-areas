# Adding Services

1. Add service data in `src/data/initial-services.ts` (or admin UI / database).
2. Include slug, name, summary, introduction, benefits, features, materials, keywords and FAQs.
3. Run seed or upsert into Prisma `Service` + `SubService`.
4. Create page records:

```bash
npm run pages:create -- --type=service --limit=50
```

5. Review content, set `contentReviewed` and `qualityScore ≥ 80`.
6. Publish in a controlled batch:

```bash
npm run pages:publish -- --batch-size=50
```

One published service automatically becomes available for city-service, area-service, property-type and solution combinations after page-record generation.
