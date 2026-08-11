export const MAX_PORTFOLIO_REFERENCES = 5;
export const MAX_UPLOAD_REFERENCES = 3;
export const MAX_REFERENCE_NOTE_LENGTH = 500;
export const MAX_REFERENCE_FILE_BYTES = 8 * 1024 * 1024;
export const MAX_REFERENCE_SOURCE_BYTES = 25 * 1024 * 1024;
export const COMMISSION_REFERENCE_BUCKET = "commission-references";

export const ACCEPTED_REFERENCE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_REFERENCE_EDGE = 2400;

export function createPortfolioReference(work, note = "") {
  if (!work) return null;
  return {
    type: "portfolio",
    workId: String(work.id),
    title: work.title,
    img: work.img || null,
    mediaType: work.mediaType || "image",
    primaryCategory: work.primaryCategory || null,
    note: String(note || "").slice(0, MAX_REFERENCE_NOTE_LENGTH),
  };
}

export function createReferenceClientId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `reference-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function validateReferenceSourceFile(file) {
  if (!file) return "Choose an image to continue.";
  if (!ACCEPTED_REFERENCE_MIME_TYPES.includes(file.type)) {
    return "Reference photos must be JPEG, PNG, or WebP images.";
  }
  if (!Number.isFinite(file.size) || file.size <= 0) {
    return "That image appears to be empty.";
  }
  if (file.size > MAX_REFERENCE_SOURCE_BYTES) {
    return "Reference photos must be smaller than 25 MB before preparation.";
  }
  return null;
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("Could not prepare that reference photo.")),
      "image/webp",
      quality,
    );
  });
}

async function decodeReferenceImage(file) {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    return {
      image: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      release: () => bitmap.close?.(),
    };
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("That image could not be decoded."));
      element.src = objectUrl;
    });
    return {
      image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

function preparedFilename(filename = "reference") {
  const base = filename.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/(^-|-$)/g, "");
  return `${base || "reference"}.webp`;
}

export async function prepareReferenceImage(file) {
  const validationError = validateReferenceSourceFile(file);
  if (validationError) throw new Error(validationError);
  if (typeof document === "undefined") throw new Error("Reference photos can only be prepared in a browser.");

  let decoded;
  try {
    decoded = await decodeReferenceImage(file);
  } catch {
    throw new Error("That image could not be prepared. Please try another JPEG, PNG, or WebP file.");
  }

  try {
    let edge = MAX_REFERENCE_EDGE;
    let quality = 0.9;
    let prepared = null;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const scale = Math.min(1, edge / Math.max(decoded.width, decoded.height));
      const width = Math.max(1, Math.round(decoded.width * scale));
      const height = Math.max(1, Math.round(decoded.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { alpha: true });
      if (!context) throw new Error("Could not prepare that reference photo.");
      context.drawImage(decoded.image, 0, 0, width, height);
      prepared = await canvasToBlob(canvas, quality);
      if (prepared.size <= MAX_REFERENCE_FILE_BYTES) break;
      edge = Math.round(edge * 0.82);
      quality = Math.max(0.65, quality - 0.07);
    }

    if (!prepared || prepared.size > MAX_REFERENCE_FILE_BYTES) {
      throw new Error("That image is still larger than 8 MB after preparation. Please choose a smaller image.");
    }

    const normalizedFile = new File([prepared], preparedFilename(file.name), {
      type: "image/webp",
      lastModified: Date.now(),
    });
    return {
      type: "upload",
      clientId: createReferenceClientId(),
      file: normalizedFile,
      previewUrl: URL.createObjectURL(normalizedFile),
      originalName: file.name || normalizedFile.name,
      mimeType: normalizedFile.type,
      size: normalizedFile.size,
      note: "",
    };
  } finally {
    decoded.release();
  }
}

export function releaseReferencePreview(reference) {
  if (reference?.type === "upload" && reference.previewUrl) {
    URL.revokeObjectURL(reference.previewUrl);
  }
}

export function referenceKey(reference) {
  if (reference?.type === "portfolio") return `portfolio:${reference.workId}`;
  if (reference?.type === "upload") return `upload:${reference.clientId || reference.storagePath || reference.originalName}`;
  return "unknown";
}
