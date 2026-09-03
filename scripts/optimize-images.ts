/**
 * §139–140 / §173–174 Image optimization pipeline.
 *
 *   npm run images:optimize
 *   npm run images:validate
 *
 * Converts jpg/jpeg/png under public/images to WebP (encode, not rename),
 * writes responsive variants for useful widths, and emits metadata JSON.
 */

import { mkdirSync, readdirSync, statSync, writeFileSync, existsSync } from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images");
const REPORT_DIR = path.join(process.cwd(), "reports");
const WIDTHS = [320, 480, 640, 768, 1024, 1280] as const;

const RASTER_RE = /\.(jpe?g|png)$/i;

type ImageMeta = {
  original: string;
  webp: string;
  width: number;
  height: number;
  bytesOriginal: number;
  bytesWebp: number;
  variants: Array<{ width: number; path: string; bytes: number }>;
};

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (RASTER_RE.test(entry) && !entry.includes("-w")) out.push(full);
  }
  return out;
}

function toPublicPath(abs: string): string {
  const rel = path.relative(path.join(process.cwd(), "public"), abs);
  return `/${rel.replace(/\\/g, "/")}`;
}

async function convertOne(abs: string): Promise<ImageMeta> {
  const dir = path.dirname(abs);
  const base = path.basename(abs).replace(RASTER_RE, "");
  const webpAbs = path.join(dir, `${base}.webp`);
  const originalStat = statSync(abs);
  const image = sharp(abs).rotate();
  const meta = await image.metadata();

  await sharp(abs)
    .rotate()
    .webp({ quality: 82, effort: 4 })
    .toFile(webpAbs);

  const webpStat = statSync(webpAbs);
  const variants: ImageMeta["variants"] = [];

  const variantDir = path.join(dir, "responsive");
  mkdirSync(variantDir, { recursive: true });

  for (const width of WIDTHS) {
    if ((meta.width ?? 0) > 0 && width >= (meta.width ?? 0)) continue;
    const outPath = path.join(variantDir, `${base}-w${width}.webp`);
    await sharp(abs)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 4 })
      .toFile(outPath);
    variants.push({
      width,
      path: toPublicPath(outPath),
      bytes: statSync(outPath).size,
    });
  }

  // Hero + card convenience sizes
  const heroPath = path.join(variantDir, `${base}-hero.webp`);
  await sharp(abs)
    .rotate()
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 84, effort: 4 })
    .toFile(heroPath);
  variants.push({
    width: 1280,
    path: toPublicPath(heroPath),
    bytes: statSync(heroPath).size,
  });

  const cardPath = path.join(variantDir, `${base}-card.webp`);
  await sharp(abs)
    .rotate()
    .resize({ width: 640, height: 480, fit: "cover" })
    .webp({ quality: 80, effort: 4 })
    .toFile(cardPath);
  variants.push({
    width: 640,
    path: toPublicPath(cardPath),
    bytes: statSync(cardPath).size,
  });

  return {
    original: toPublicPath(abs),
    webp: toPublicPath(webpAbs),
    width: meta.width ?? 0,
    height: meta.height ?? 0,
    bytesOriginal: originalStat.size,
    bytesWebp: webpStat.size,
    variants,
  };
}

async function main() {
  const files = walk(ROOT);
  const results: ImageMeta[] = [];
  const errors: Array<{ file: string; error: string }> = [];

  for (const file of files) {
    try {
      results.push(await convertOne(file));
      process.stdout.write(`✓ ${path.basename(file)}\n`);
    } catch (error) {
      errors.push({
        file,
        error: error instanceof Error ? error.message : String(error),
      });
      process.stderr.write(`✗ ${path.basename(file)}\n`);
    }
  }

  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(
    path.join(REPORT_DIR, "image-optimize.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        converted: results.length,
        errors,
        results,
      },
      null,
      2,
    ),
  );

  console.log(
    `Converted ${results.length} rasters → WebP (${errors.length} errors)`,
  );
  if (errors.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
