/**
 * §106–109 Legal pages, authorship, content governance, SEO changelog.
 */

export type LegalPageSlug =
  | "privacy-policy"
  | "terms-and-conditions"
  | "disclaimer"
  | "refund-policy"
  | "cancellation-policy"
  | "warranty";

export const LEGAL_PAGE_INVENTORY: Array<{
  slug: LegalPageSlug;
  path: string;
  relevant: boolean;
  note: string;
}> = [
  {
    slug: "privacy-policy",
    path: "/privacy-policy/",
    relevant: true,
    note: "Required for forms / contact data.",
  },
  {
    slug: "terms-and-conditions",
    path: "/terms-and-conditions/",
    relevant: true,
    note: "Service engagement terms.",
  },
  {
    slug: "disclaimer",
    path: "/disclaimer/",
    relevant: true,
    note: "Coverage / measurement honesty.",
  },
  {
    slug: "refund-policy",
    path: "/refund-policy/",
    relevant: false,
    note: "Add only if the business publishes a real refund policy.",
  },
  {
    slug: "cancellation-policy",
    path: "/cancellation-policy/",
    relevant: false,
    note: "Add only if cancellations are a real published policy.",
  },
  {
    slug: "warranty",
    path: "/warranty/",
    relevant: false,
    note: "Add only with real warranty terms — never invent.",
  },
];

export type GuideAuthor = {
  name: string;
  role: string;
  reviewerName?: string;
  reviewerRole?: string;
};

/** Empty until real editorial roles are confirmed. */
export const GUIDE_AUTHORS: GuideAuthor[] = [];

export function authorshipAllowed(author: GuideAuthor): boolean {
  return Boolean(author.name.trim() && author.role.trim());
}

export type ContentGovernanceRecord = {
  path: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  reviewDate: string | null;
  status: "draft" | "review" | "published" | "archived";
  indexable: boolean;
  canonical: string;
  pageType: string;
};

export type SeoChangeLogEntry = {
  id: string;
  at: string;
  kind:
    | "url-change"
    | "redirect"
    | "title-change"
    | "content-update"
    | "canonical-change"
    | "schema-change"
    | "indexability-change";
  path: string;
  detail: string;
};

/** In-repo changelog seed — append via seo:changelog / PRs. */
export const SEO_CHANGE_LOG: SeoChangeLogEntry[] = [
  {
    id: "2026-09-seo-architecture-batch",
    at: "2026-09-03",
    kind: "content-update",
    path: "/",
    detail:
      "Enterprise SEO architecture §§1–112 systems landed (ownership, gates, QA).",
  },
];

export function listRelevantLegalPages() {
  return LEGAL_PAGE_INVENTORY.filter((p) => p.relevant);
}
