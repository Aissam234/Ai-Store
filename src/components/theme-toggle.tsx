"use client";

import { useSyncExternalStore } from "react";

const key = "ai-store-theme";
function subscribe(callback: () => void) {
  window.addEventListener("store-theme", callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener("store-theme", callback); window.removeEventListener("storage", callback); };
}
function snapshot() { return document.documentElement.dataset.storeTheme === "light"; }

export function ThemeToggle() {
  const light = useSyncExternalStore(subscribe, snapshot, () => false);
  function toggle() {
    const next = light ? "dark" : "light";
    document.documentElement.dataset.storeTheme = next;
    try { localStorage.setItem(key, next); } catch { /* Theme still works without storage. */ }
    window.dispatchEvent(new Event("store-theme"));
  }
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={light ? "Switch to dark mode" : "Switch to light mode"} aria-pressed={light}>
    <svg viewBox="0 0 24 24" aria-hidden="true" className="theme-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>
    <svg viewBox="0 0 24 24" aria-hidden="true" className="theme-moon"><path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z"/></svg>
  </button>;
}
