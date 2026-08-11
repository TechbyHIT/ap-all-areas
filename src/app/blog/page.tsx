import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { HubBreadcrumbs } from "@/components/seo/HubBreadcrumbs";
import { Container } from "@/components/ui/Container";
import { HOME_BLOG_POSTS } from "@/data/blog-posts";
import { ROUTES } from "@/config/routes";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog — Safety & Installation Tips | Hiranya Enterprises",
  metaDescription:
    "Articles about balcony safety, bird control, sports nets and home utility solutions in Andhra Pradesh from Hiranya Enterprises.",
  canonicalUrl: buildCanonicalUrl("/blog/"),
  ...staticPageIndexability(true),
});

export default function BlogPage() {
  return (
    <>
      <HubBreadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog/" },
        ]}
      />
      <PageHero
        title="Blog"
        description="Tips, comparisons and updates about safety and utility installations from Hiranya Enterprises."
      />
      <Container className="py-10 md:py-14">
        <div className="blog-teaser-grid">
          {HOME_BLOG_POSTS.map((post) => (
            <article key={post.slug} className="blog-teaser-card">
              <Link
                href={ROUTES.blogPost(post.slug)}
                className="blog-teaser-media"
                tabIndex={-1}
                aria-hidden
              >
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  width={640}
                  height={400}
                  loading="lazy"
                  sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                />
              </Link>
              <div className="blog-teaser-body">
                <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                <h3>
                  <Link href={ROUTES.blogPost(post.slug)}>{post.title}</Link>
                </h3>
                <p>{post.summary}</p>
                <Link
                  href={ROUTES.blogPost(post.slug)}
                  className="blog-teaser-link"
                >
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
