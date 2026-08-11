import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { breadcrumbSchema } from "@/lib/schema";

export type HubCrumb = {
  name: string;
  /** Path with trailing slash; omit href on the current page crumb. */
  path?: string;
};

/**
 * Visible breadcrumbs + BreadcrumbList JSON-LD for indexable hub pages.
 */
export function HubBreadcrumbs({ crumbs }: { crumbs: HubCrumb[] }) {
  if (crumbs.length === 0) return null;

  const schemaItems = crumbs.map((crumb) => ({
    name: crumb.name,
    url: buildCanonicalUrl(crumb.path ?? "/"),
  }));

  // Last crumb is current page — use its path when provided for schema item URL.
  const last = crumbs[crumbs.length - 1];
  if (last?.path) {
    schemaItems[schemaItems.length - 1] = {
      name: last.name,
      url: buildCanonicalUrl(last.path),
    };
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema(schemaItems)} />
      <Breadcrumbs
        items={crumbs.map((crumb, index) => ({
          label: crumb.name,
          href:
            index === crumbs.length - 1
              ? undefined
              : crumb.path ?? undefined,
        }))}
      />
    </>
  );
}
