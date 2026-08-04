# Publishing Workflow

## Phases

1. **Core launch** — Homepage, services, main cities, contact/trust pages
2. **Areas and solutions** — Verified areas, area-service pages, solutions
3. **Content expansion** — Guides, blog clusters
4. **Controlled expansion** — Monitor GSC before scaling

## CLI Commands

```bash
npm run pages:create -- --type=service-location --limit=1000
npm run pages:audit -- --status=review --limit=1000
npm run pages:publish -- --batch-size=500
npm run pages:noindex -- --quality-below=80
npm run pages:count
```

## Safety Controls

- Maximum batch size: 500
- Pages default to draft with `allowIndexing: false`
- Phone/WhatsApp links blocked until 10-digit number verified
- Noindex pages excluded from sitemaps
