"use client";
import { useSyncExternalStore } from "react";
function subscribe(callback: () => void) {
  window.addEventListener("store-theme", callback);
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-store-theme"] });
  return () => { window.removeEventListener("store-theme", callback); observer.disconnect(); };
}
export function useLightTheme() { return useSyncExternalStore(subscribe, () => document.documentElement.dataset.storeTheme === "light", () => false); }
