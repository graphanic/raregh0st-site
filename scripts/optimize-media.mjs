import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

// In-place, visually-lossless media optimization.
// - Preserves every filename + extension (zero code/reference changes).
// - Caps the longest edge at MAX_EDGE (retina-safe for all display use here).
// - Re-encodes JPG (mozjpeg q82) and PNG (max lossless compression).
// - Non-destructive: writes a temp file and only replaces the original if smaller.

const MAX_EDGE = 2048;
const JPG_QUALITY = 82;
const MIN_BYTES = 200 * 1024; // skip files already under 200KB
const SKIP = new Set([
  "public/logo.png",
  "public/favicon-16.png",
  "public/favicon-32.png",
  "public/apple-touch-icon.png",
  "public/icon-192.png",
  "public/icon-512.png",
]);

sharp.cache(false);
sharp.concurrency(2);

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(jpe?g|png)$/i.test(e.name)) acc.push(p);
  }
  return acc;
}

const files = walk("public").filter((f) => !SKIP.has(f.split(path.sep).join("/")));
let before = 0, after = 0, changed = 0, skipped = 0;

for (const f of files) {
  const st = fs.statSync(f);
  before += st.size;
  if (st.size < MIN_BYTES) { after += st.size; skipped++; continue; }

  try {
    const isPng = /\.png$/i.test(f);
    const img = sharp(f, { failOn: "none" });
    const meta = await img.metadata();
    const longest = Math.max(meta.width || 0, meta.height || 0);

    let pipeline = sharp(f, { failOn: "none" }).rotate();
    if (longest > MAX_EDGE) {
      pipeline = pipeline.resize({
        width: meta.width >= meta.height ? MAX_EDGE : null,
        height: meta.height > meta.width ? MAX_EDGE : null,
        withoutEnlargement: true,
      });
    }
    pipeline = isPng
      ? pipeline.png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
      : pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true });

    const tmp = f + ".tmp";
    await pipeline.toFile(tmp);
    const newSize = fs.statSync(tmp).size;

    if (newSize < st.size) {
      fs.renameSync(tmp, f);
      after += newSize;
      changed++;
      const saved = ((1 - newSize / st.size) * 100).toFixed(0);
      console.log(`${(st.size/1048576).toFixed(1)}→${(newSize/1048576).toFixed(2)}MB  -${saved}%  ${f.replace("public/","")}`);
    } else {
      fs.unlinkSync(tmp);
      after += st.size;
      skipped++;
    }
  } catch (e) {
    after += st.size;
    console.log(`SKIP (error): ${f} — ${e.message}`);
  }
}

console.log("─".repeat(50));
console.log(`Files changed: ${changed}   unchanged/skipped: ${skipped}`);
console.log(`Total: ${(before/1048576).toFixed(0)}MB → ${(after/1048576).toFixed(0)}MB  (saved ${((1-after/before)*100).toFixed(0)}%)`);
