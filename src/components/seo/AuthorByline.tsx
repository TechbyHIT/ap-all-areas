import { DEFAULT_EDITORIAL_AUTHOR } from "@/lib/seo/content-governance";

type AuthorBylineProps = {
  author?: {
    name: string;
    role: string;
    reviewerName?: string;
    reviewerRole?: string;
  };
  updatedAt?: string;
  className?: string;
};

/**
 * E-E-A-T byline for guides/blog (GFG quality content + experience signals).
 */
export function AuthorByline({
  author = DEFAULT_EDITORIAL_AUTHOR,
  updatedAt,
  className = "",
}: AuthorBylineProps) {
  return (
    <footer
      className={`border-t border-zinc-200 pt-6 text-sm text-zinc-600 ${className}`.trim()}
    >
      <p>
        <span className="font-semibold text-zinc-800">{author.name}</span>
        {author.role ? ` · ${author.role}` : null}
      </p>
      {author.reviewerName ? (
        <p className="mt-1 text-zinc-500">
          Reviewed by {author.reviewerName}
          {author.reviewerRole ? ` (${author.reviewerRole})` : null}
        </p>
      ) : null}
      {updatedAt ? (
        <p className="mt-1 text-zinc-500">
          Last updated{" "}
          <time dateTime={updatedAt}>{updatedAt}</time>
        </p>
      ) : null}
    </footer>
  );
}
