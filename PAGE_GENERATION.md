# Page Generation

## Dynamic Routes

Routes use App Router dynamic segments. No physical file is created per URL.

```ts
export const dynamicParams = true;
export const revalidate = 86400;
```

`generateStaticParams` is limited to high-priority URLs only.

## Combination Eligibility

Generate a page record only when the combination has:

- Real customer search intent
- Genuine service availability
- Distinct value from parent pages
- Unique metadata and content
- Strong internal-link opportunities

## Indexability Gate

`isPageIndexable()` in `src/lib/publishing/indexability.ts` gates robots and sitemap inclusion.
