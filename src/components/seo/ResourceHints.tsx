/**
 * Critical origin hints for faster first paint (GFG technical SEO / page speed).
 */
export function ResourceHints() {
  return (
    <>
      <link rel="dns-prefetch" href="//wa.me" />
      <link rel="preconnect" href="https://wa.me" crossOrigin="" />
    </>
  );
}
