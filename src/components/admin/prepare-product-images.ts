// Keep a three-image save below 1 MiB of image data, including on mobile connections.
const uploadBudget = 280 * 1024;
export const imageInputHint = "JPEG, PNG or WebP · up to 20 MB each";
const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function imageSelectionError(file?: File) {
  if (!file) return "";
  if (!supportedTypes.has(file.type)) return "Choose a JPEG, PNG or WebP image. On iPhone, export HEIC photos as JPEG first.";
  return file.size > 20 * 1024 * 1024 ? "Choose an image up to 20 MB." : "";
}

async function prepareImage(file: File): Promise<Blob> {
  if (file.size <= uploadBudget) return file;

  const url = URL.createObjectURL(file);
  const canvas = document.createElement("canvas");
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
    for (const maxSide of [1600, 1280, 960, 720, 512]) {
      const scale = Math.min(1, maxSide / longestSide);
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      // Browsers without a WebP encoder return PNG, which the server also accepts.
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", 0.86));
      if (blob && blob.size <= uploadBudget) return blob;
    }
    throw new Error("Image too large");
  } finally {
    canvas.width = canvas.height = 0;
    URL.revokeObjectURL(url);
  }
}

export async function prepareProductImages(form: FormData): Promise<string | undefined> {
  for (const [key, label] of [["image", "Default image"], ["imageDark", "Night image"], ["imageLight", "Light image"]]) {
    const file = form.get(key);
    if (!(file instanceof File) || !file.size) continue;
    const error = imageSelectionError(file);
    if (error) return label + ": " + error;
    try {
      const blob = await prepareImage(file);
      if (blob !== file) form.set(key, blob, blob.type === "image/webp" ? "product.webp" : "product.png");
    } catch {
      return label + ": This image could not be prepared. Export a smaller JPEG or PNG and try again.";
    }
  }
}
