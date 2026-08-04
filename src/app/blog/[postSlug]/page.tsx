import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import {
  BulletListSection,
  ProseSection,
} from "@/components/sections/ContentBlocks";
import { HOME_BLOG_POSTS } from "@/data/blog-posts";
import { BLOG_ARTICLES, type BlogArticle } from "@/data/blog-articles";
import { buildCanonicalUrl } from "@/lib/routing/paths";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { staticPageIndexability } from "@/lib/seo/page-indexability";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{ postSlug: string }>;
};

function getBlogArticle(postSlug: string): BlogArticle | null {
  return BLOG_ARTICLES[postSlug] ?? null;
}

export async function generateStaticParams() {
  return HOME_BLOG_POSTS.map((post) => ({ postSlug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { postSlug } = await params;
  const post = HOME_BLOG_POSTS.find((p) => p.slug === postSlug);
  if (!post) return {};

  return generatePageMetadata({
    title: `${post.title} | Hiranya Enterprises`,
    metaDescription: post.summary,
    canonicalUrl: buildCanonicalUrl(`/blog/${post.slug}/`),
    openGraphImage: post.image,
    openGraphImageAlt: post.imageAlt,
    ...staticPageIndexability(true),
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { postSlug } = await params;
  const post = HOME_BLOG_POSTS.find((p) => p.slug === postSlug);
  if (!post) notFound();

  const article = getBlogArticle(postSlug);
  if (!article) notFound();

  return (
    <>
      <PageHero
        title={post.title}
        description={post.summary}
        eyebrow={post.publishedAt}
      />

      <ProseSection title="Introduction">
        <p>
          This article is written for families and property managers comparing
          practical safety and bird-control options in Andhra Pradesh. It expands the
          topic into structured sections you can use before requesting measurement.
          Coverage remains on a service-area basis and is confirmed after reviewing
          site access and requirements.
        </p>
      </ProseSection>

      {article.sections.map((section, index) => (
        <ProseSection
          key={section.title}
          title={section.title}
          variant={index % 2 === 0 ? "muted" : "default"}
        >
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 64)}>{paragraph}</p>
          ))}
        </ProseSection>
      ))}

      <BulletListSection title="Key Takeaways" items={article.takeaways} />

      <QuoteCTA
        title="Need Help Applying This to Your Balcony?"
        description="Share your location, photos and whether bird control, fall protection or both are the priority. We will outline measurement and quotation next steps."
        whatsappMessage={`Hello, I read "${post.title}" and would like advice for my property in Andhra Pradesh.`}
      />
    </>
  );
}
