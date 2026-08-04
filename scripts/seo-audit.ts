import { prisma } from "../src/lib/prisma";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

async function main() {
  const issues: Array<{ type: string; pageId: string; path: string; message: string }> = [];

  const pages = await prisma.page.findMany({
    where: { publicationStatus: "published" },
    take: 5000,
  });

  const titles = new Map<string, string[]>();
  for (const page of pages) {
    if (!page.title) {
      issues.push({ type: "missing-title", pageId: page.id, path: page.path, message: "Missing title" });
    }
    if (!page.metaDescription) {
      issues.push({ type: "missing-description", pageId: page.id, path: page.path, message: "Missing meta description" });
    }
    if (!page.allowIndexing && page.publicationStatus === "published") {
      issues.push({ type: "noindex-published", pageId: page.id, path: page.path, message: "Published but not indexable" });
    }
    const existing = titles.get(page.title) ?? [];
    existing.push(page.path);
    titles.set(page.title, existing);
  }

  for (const [title, paths] of titles) {
    if (paths.length > 1) {
      issues.push({ type: "duplicate-title", pageId: "", path: paths.join(", "), message: `Duplicate title: ${title}` });
    }
  }

  const report = { issues, count: issues.length, generatedAt: new Date().toISOString() };
  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "seo-audit.json"), JSON.stringify(report, null, 2));
  console.log(`SEO audit: ${issues.length} issues found`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
