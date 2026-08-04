import { prisma } from "../src/lib/prisma";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

async function main() {
  const pages = await prisma.page.findMany({
    where: { publicationStatus: "published" },
    select: { id: true, path: true, title: true, metaDescription: true, h1: true },
    take: 5000,
  });

  const duplicates: Array<{ field: string; value: string; paths: string[] }> = [];
  const fields = ["title", "metaDescription", "h1"] as const;

  for (const field of fields) {
    const map = new Map<string, string[]>();
    for (const page of pages) {
      const value = page[field];
      const list = map.get(value) ?? [];
      list.push(page.path);
      map.set(value, list);
    }
    for (const [value, paths] of map) {
      if (paths.length > 1) {
        duplicates.push({ field, value, paths });
      }
    }
  }

  const report = { duplicates, count: duplicates.length, generatedAt: new Date().toISOString() };
  const dir = path.join(process.cwd(), "reports");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "duplicate-content.json"), JSON.stringify(report, null, 2));
  console.log(`Duplicate audit: ${duplicates.length} duplicate groups found`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
