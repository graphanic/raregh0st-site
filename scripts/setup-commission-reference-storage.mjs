import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import { resolveSupabaseUrl } from "../config/supabase.js";
import {
  COMMISSION_REFERENCE_BUCKET,
  MAX_REFERENCE_FILE_BYTES,
} from "../src/lib/commissionReferences.js";

for (const path of [".env.local", ".env"]) {
  try {
    process.loadEnvFile?.(path);
  } catch {
    // Environment files are optional; deployed environments inject variables.
  }
}

const url = resolveSupabaseUrl(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "");
const secretKey = String(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

if (!url || !secretKey) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY before provisioning commission reference storage.");
}

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const options = {
  public: false,
  allowedMimeTypes: ["image/webp"],
  fileSizeLimit: MAX_REFERENCE_FILE_BYTES,
};

const { data: buckets, error: listError } = await supabase.storage.listBuckets();
if (listError) throw listError;

const exists = (buckets || []).some((bucket) => bucket.id === COMMISSION_REFERENCE_BUCKET);
const result = exists
  ? await supabase.storage.updateBucket(COMMISSION_REFERENCE_BUCKET, options)
  : await supabase.storage.createBucket(COMMISSION_REFERENCE_BUCKET, options);

if (result.error) throw result.error;
console.log(`${exists ? "Updated" : "Created"} private bucket: ${COMMISSION_REFERENCE_BUCKET}`);
