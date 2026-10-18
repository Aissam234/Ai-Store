"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
export function CatalogSync() {
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    // Preserve unsaved admin edits; only customer pages refresh automatically.
    if (path.startsWith("/admin")) return;
    let stopped = false;
    let version: string | undefined;
    let timer: ReturnType<typeof setTimeout>;
    let controller: AbortController | undefined;
    let checking = false;
    let delay = 2000;
    async function check() {
      if (checking || stopped || document.hidden) return;
      clearTimeout(timer);
      checking = true;
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 8000);
      try {
        const response = await fetch("/api/catalog/version", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Unavailable");
        const data: unknown = await response.json();
        if (!data || typeof data !== "object" || !("version" in data) || typeof data.version !== "string") throw new Error("Invalid revision");
        if (!stopped && data.version !== version) {
          version = data.version;
          router.refresh();
        }
        delay = 2000;
      } catch { delay = Math.min(delay * 2, 30000); }
      finally {
        clearTimeout(timeout);
        checking = false;
        if (!stopped && !document.hidden) timer = setTimeout(check, delay);
      }
    }
    const resume = () => { clearTimeout(timer); if (!document.hidden) void check(); };
    void check();
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("focus", resume);
    window.addEventListener("online", resume);
    return () => {
      stopped = true;
      clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("focus", resume);
      window.removeEventListener("online", resume);
    };
  }, [path, router]);
  return null;
}
