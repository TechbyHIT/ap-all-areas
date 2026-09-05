# Google Search Console Setup

1. Verify ownership of `https://hiranayaenterprises.in` (URL-prefix property preferred).
2. Submit **only** the master index:
   `https://hiranayaenterprises.in/sitemap.xml`
3. Do **not** submit the keyword mega-index (`/sitemaps/keywords/` or `andhra-pradesh-keywords-*`) to the main property — that matrix is scale/experimental and is intentionally excluded from the master index.
4. Monitor Pages → indexed vs excluded. Expand publishing only after Phase 1 URLs look healthy.

## Why sitemap submission failed (fixed Sep 2026)

Child locs used to be listed as `/sitemaps/{name}.xml`. With `trailingSlash: true`, those URLs returned **HTTP 308** to `/sitemaps/{name}/`. Search Console often rejects sitemap children that redirect.

**Fix:** the master index now lists slash URLs that already return `200` + `application/xml`:

- `https://hiranayaenterprises.in/sitemaps/core/`
- `https://hiranayaenterprises.in/sitemaps/services/`
- `https://hiranayaenterprises.in/sitemaps/city-services/`
- `https://hiranayaenterprises.in/sitemaps/societies/`
- `https://hiranayaenterprises.in/sitemaps/images/`
- `https://hiranayaenterprises.in/sitemaps/areas/`
- `https://hiranayaenterprises.in/sitemaps/area-services/`

After deploy, in GSC: remove the old sitemap if stuck, wait a few minutes, then resubmit `https://hiranayaenterprises.in/sitemap.xml`.

### Quick VPS checks

```bash
curl -sI https://hiranayaenterprises.in/sitemap.xml | head
curl -sI https://hiranayaenterprises.in/sitemaps/core/ | head
curl -s https://hiranayaenterprises.in/sitemap.xml | head -40
```

Expect: index and every child `HTTP/2 200` and `content-type: application/xml` — **no 308** on the locs inside the index.

## Quality rules

- Do not force tens of thousands of thin locality doorways into the master sitemap.
- Master index ≈ curated hubs + P0 city/area/service money pages (~1k URLs).
- Watch duplicate title/description and soft-404 warnings before scaling further.
