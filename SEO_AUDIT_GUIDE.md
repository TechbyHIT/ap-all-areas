# SEO Audit Guide

## Commands

```bash
npm run seo:audit
npm run content:audit
npm run duplicates:audit
npm run links:audit
npm run schema:audit
npm run pages:count
```

## Reports

Written to `reports/`:

- `seo-audit.json`
- `content-quality.json`
- `duplicate-content.json`
- `internal-links.json`
- `schema-audit.json`

## Critical Failures

Block production publishing when pages have missing titles, duplicate metadata, thin content, unresolved placeholders, unverified phone/address claims, or similarity above 0.7.
