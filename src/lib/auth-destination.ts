export function authDestination(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\s]/.test(value)) return "/account";
  try {
    const url = new URL(value, "https://store.invalid");
    if (url.origin !== "https://store.invalid" || /^\/(login|register)(\/|$)/.test(url.pathname)) return "/account";
    return url.pathname + url.search + url.hash;
  } catch { return "/account"; }
}
