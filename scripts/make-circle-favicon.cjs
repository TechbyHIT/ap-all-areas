const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC =
  "C:/Users/karesuvartharaju/.cursor/projects/t-NEW-TRY-divya-safe/assets/c__Users_karesuvartharaju_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-00f93359-dfb0-41ae-9622-b08340639ccd.png";
const ROOT = path.resolve("T:/NEW TRY/divya safe/divya-safe-web");

async function makeCirclePng(size, options) {
  const apple = options && options.apple;
  const pad = Math.round(size * 0.14);
  const logoSize = size - pad * 2;

  const logo = await sharp(SRC)
    .resize(logoSize, logoSize, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();

  const stroke = Math.max(1, Math.round(size * 0.02));
  const svg = Buffer.from(
    '<svg width="' +
      size +
      '" height="' +
      size +
      '" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="' +
      size / 2 +
      '" cy="' +
      size / 2 +
      '" r="' +
      size / 2 +
      '" fill="#ffffff"/>' +
      (apple
        ? ""
        : '<circle cx="' +
          size / 2 +
          '" cy="' +
          size / 2 +
          '" r="' +
          (size / 2 - stroke) +
          '" fill="none" stroke="#e2e8f0" stroke-width="' +
          stroke +
          '"/>') +
      "</svg>",
  );

  const base = await sharp(svg).png().toBuffer();

  const composed = await sharp(base)
    .composite([{ input: logo, left: pad, top: pad }])
    .png()
    .toBuffer();

  const mask = Buffer.from(
    '<svg width="' +
      size +
      '" height="' +
      size +
      '" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="' +
      size / 2 +
      '" cy="' +
      size / 2 +
      '" r="' +
      size / 2 +
      '" fill="#fff"/></svg>',
  );

  return sharp(composed)
    .ensureAlpha()
    .composite([
      {
        input: await sharp(mask).png().toBuffer(),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
}

async function write(file, buf) {
  const full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, buf);
  console.log("wrote", file, buf.length);
}

(async function main() {
  const circle512 = await makeCirclePng(512);
  const circle256 = await makeCirclePng(256);
  const fav48 = await makeCirclePng(48);
  const apple180 = await makeCirclePng(180, { apple: true });
  const icon192 = await makeCirclePng(192);

  await write("public/images/hiranya-logo-circle.png", circle512);
  await write("public/images/hiranya-favicon-circle-256.png", circle256);
  await write("public/favicon.png", fav48);
  await write("public/apple-icon.png", apple180);
  await write("src/app/icon.png", icon192);
  await write("src/app/apple-icon.png", apple180);

  console.log("done");
})().catch(function (e) {
  console.error(e);
  process.exit(1);
});
