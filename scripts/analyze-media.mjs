import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(jpe?g|png)$/i.test(e.name)) acc.push(p);
  }
  return acc;
}

const files = walk("public");
const rows = [];
for (const f of files) {
  try {
    const m = await sharp(f).metadata();
    const st = fs.statSync(f);
    rows.push({ f, w: m.width, h: m.height, mb: st.size / 1048576, fmt: m.format });
  } catch {}
}
rows.sort((a, b) => b.mb - a.mb);
for (const r of rows.slice(0, 24)) {
  const dim = `${r.w}x${r.h}`;
  console.log(`${r.mb.toFixed(1)}MB  ${dim.padEnd(11)}  ${r.fmt.padEnd(4)}  ${r.f.replace("public/", "")}`);
}
console.log("---");
console.log("total image MB:", rows.reduce((s, r) => s + r.mb, 0).toFixed(0), " count:", rows.length);
