import { put } from "@vercel/blob";
import { requireAdmin } from "../_lib/auth.js";

// POST /api/admin/portfolio-upload
// Uploads a portfolio image/video to Vercel Blob (public access) and returns its public URL.
//
// Headers:
//   x-admin-token   — admin session token (issued by /api/auth)
//   x-filename      — original filename (used for the blob key)
//   x-folder        — category folder name (e.g. "photography", "design", "ai", "motion", "curated")
//   content-type    — file mime type
// Body: raw file bytes
//
// Response: { url, pathname }
//   `url` is the publicly accessible blob URL — paste this directly into portfolio data files.

export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    const MAX = 50 * 1024 * 1024; // 50 MB hard cap
    req.on("data", (c) => {
      total += c.length;
      if (total > MAX) {
        reject(new Error("File too large (max 50 MB)"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const filename = String(req.headers["x-filename"] || "").trim();
    const folderRaw = String(req.headers["x-folder"] || "misc").trim();
    if (!filename) {
      return res.status(400).json({ error: "Missing X-Filename header" });
    }

    // Whitelist folder names so callers can't write to arbitrary blob paths.
    const ALLOWED_FOLDERS = ["photography", "design", "ai", "motion", "curated", "misc"];
    const folder = ALLOWED_FOLDERS.includes(folderRaw) ? folderRaw : "misc";

    const body = await readRawBody(req);
    if (!body || body.length === 0) {
      return res.status(400).json({ error: "Empty body" });
    }

    // Sanitize filename to keep blob keys clean.
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `portfolio/${folder}/${Date.now()}-${safeName}`;

    const blob = await put(key, body, {
      access: "public",
      contentType: req.headers["content-type"] || "application/octet-stream",
      addRandomSuffix: false,
    });

    return res.status(200).json({ url: blob.url, pathname: blob.pathname });
  } catch (err) {
    console.error("[v0] portfolio-upload error:", err);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
}

export default requireAdmin(handler);
