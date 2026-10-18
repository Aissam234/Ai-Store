"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
const validId = (id: unknown): id is string => typeof id === "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(id);
const KEY = "nexora-cart-v1";
type CartContext = { ids: string[]; ready: boolean; notice: string; add: (id: string) => void; remove: (id: string) => void; clear: () => void };
const Context = createContext<CartContext | null>(null);
function readCart(): string[] {
  try { const data: unknown = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(data) ? [...new Set(data.filter(validId).slice(0, 50))] : []; } catch { return []; }
}
export function CartProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => { const hydrate = () => { setIds(readCart()); setReady(true); }; hydrate(); const sync = (event: StorageEvent) => { if (event.key === KEY || event.key === null) hydrate(); }; window.addEventListener("storage", sync); return () => window.removeEventListener("storage", sync); }, []);
  function save(next: string[]) { setIds(next); try { localStorage.setItem(KEY, JSON.stringify(next)); setNotice(""); } catch { setNotice("Your browser could not save this cart. It will remain available during this visit."); } }
  return <Context.Provider value={{ ids, ready, notice, add: id => { if (ready && !ids.includes(id) && validId(id) && ids.length < 50) save([...ids, id]); }, remove: id => save(ids.filter(item => item !== id)), clear: () => save([]) }}>{children}</Context.Provider>;
}
export function useCart() { const value = useContext(Context); if (!value) throw new Error("Cart provider missing"); return value; }

