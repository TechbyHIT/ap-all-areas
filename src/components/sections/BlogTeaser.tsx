import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { HOME_BLOG_POSTS } from "@/data/blog-posts";

type BlogTeaserProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  limit?: number;
  className?: string;
};

/**
 * Image-above blog cards — used on homepage and sitewide before footer.
 */
export function BlogTeaser({
  title = "Safety tips & installation guides",
  description = "Practical articles from Hiranya Enterprises on balcony safety, bird control and choosing the right product for your opening.",
  eyebrow = "Blog",
  limit = 3,
  className = "",
}: BlogTeaserProps) {
  const posts = HOME_BLOG_POSTS.slice(0, limit);

  if (posts.length === 0) return null;

  return (
    <section
      className={`home-section home-section--white blog-teaser ${className}`.trim()}
      id="blog"
    >
      <div className="home-container">
        <header className="home-section-head home-section-head--center">
          <p className="home-eyebrow">{eyebrow}</p>
          <h2 className="home-h2">{title}</h2>
          <p className="home-lead">{description}</p>
        </header>

        <div className="blog-teaser-grid">
          {posts.map((post) => (
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

        <div className="home-all-services-cta">
          <Link href={ROUTES.blog} className="home-all-services-all">
            View all articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
