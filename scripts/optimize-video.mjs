import { execFileSync } from "node:child_process";
import { statSync, readdirSync, renameSync, unlinkSync, existsSync } from "node:fs";
import { join, extname, dirname, basename } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const FFMPEG = require("ffmpeg-static");
const FFPROBE = require("ffprobe-static").path;

const ROOT = "public";
const MAX_DIM = 1080;      // cap longest side
const CRF = 23;            // visually-lossless-ish for H.264
const mb = (b) => (b / 1048576).toFixed(1);

function walk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (extname(e.name).toLowerCase() === ".mp4") acc.push(p);
  }
  return acc;
}

function probe(file) {
  const out = execFileSync(FFPROBE, [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "csv=p=0:s=x", file,
  ]).toString().trim();
  const [w, h] = out.split("x").map(Number);
  return { w, h };
}

const files = walk(ROOT);
let before = 0, after = 0;
console.log(`Found ${files.length} mp4 files\n`);

for (const file of files) {
  const origSize = statSync(file).size;
  before += origSize;
  const { w, h } = probe(file);

  // scale so the longest side <= MAX_DIM, keep even dims, never upscale.
  // Works for landscape, portrait, AND square (uses force_original_aspect_ratio).
  const scale = `scale=w=${MAX_DIM}:h=${MAX_DIM}:force_original_aspect_ratio=decrease:force_divisible_by=2`;
  const tmp = join(dirname(file), `.opt_${basename(file)}`);

  try {
    execFileSync(FFMPEG, [
      "-y", "-i", file,
      "-vf", scale,
      "-c:v", "libx264", "-preset", "medium", "-crf", String(CRF),
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-an",                       // strip audio (all are muted loops)
      tmp,
    ], { stdio: ["ignore", "ignore", "ignore"] });

    const newSize = statSync(tmp).size;
    if (newSize < origSize) {
      renameSync(tmp, file);
      after += newSize;
      console.log(`✓ ${basename(file).padEnd(38)} ${mb(origSize)}MB → ${mb(newSize)}MB  (${w}x${h})`);
    } else {
      unlinkSync(tmp);
      after += origSize;
      console.log(`· ${basename(file).padEnd(38)} kept original (${mb(origSize)}MB)`);
    }

    // poster frame (first frame) next to the video
    const poster = file.replace(/\.mp4$/i, ".jpg");
    if (!existsSync(poster)) {
      execFileSync(FFMPEG, [
        "-y", "-i", file, "-vf", `${scale},thumbnail`, "-frames:v", "1", "-q:v", "4", poster,
      ], { stdio: ["ignore", "ignore", "ignore"] });
    }
  } catch (err) {
    if (existsSync(tmp)) unlinkSync(tmp);
    after += origSize;
    console.log(`✗ ${basename(file)} — ${err.message.split("\n")[0]}`);
  }
}

console.log(`\nTOTAL: ${mb(before)}MB → ${mb(after)}MB  (saved ${mb(before - after)}MB, ${(100 * (before - after) / before).toFixed(0)}%)`);
