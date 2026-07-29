import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, "..", "public");
const src = join(pub, "logo.png");

// Brand abyss background (#06060c)
const bg = { r: 6, g: 6, b: 12, alpha: 1 };

// size, output filename, logo scale (fraction of canvas the mark occupies)
const targets = [
  [16, "favicon-16.png", 0.86],
  [32, "favicon-32.png", 0.84],
  [180, "apple-touch-icon.png", 0.72],
  [192, "icon-192.png", 0.72],
  [512, "icon-512.png", 0.72],
];

for (const [size, name, scale] of targets) {
  const inner = Math.round(size * scale);
  const mark = await sharp(src)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(join(pub, name));

  console.log(`[v0] wrote ${name} (${size}x${size})`);
}
