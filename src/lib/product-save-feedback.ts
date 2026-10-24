import type { ActionState } from "./validation";

// Next.js uses thrown control-flow errors for redirects and access fallbacks.
export function isNavigationSignal(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("digest" in error)) return false;
  const digest = error.digest;
  return typeof digest === "string" && (digest.startsWith("NEXT_REDIRECT;") || digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;"));
}

export async function saveProductWithFeedback(
  save: (previous: ActionState, form: FormData) => Promise<ActionState>,
  previous: ActionState,
  form: FormData,
): Promise<ActionState> {
  try { return await save(previous, form); }
  catch (error) {
    if (isNavigationSignal(error)) throw error;
    return { error: "The upload request could not be completed. Your edits are still here. Check your connection, use JPEG, PNG or WebP images up to 3 MB each, and try saving again. If it continues, refresh after checking the deployment logs." };
  }
}
