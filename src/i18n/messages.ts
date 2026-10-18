import messages from "./messages.json";
import type { Locale } from "./config";
const normalize = (text: string) => text.trim().toLowerCase().replace(/[.?!]+$/, "");
const entries = new Map(Object.entries(messages).map(([key, value]) => [normalize(key), value]));
export function hasMessage(text: string) { return entries.has(normalize(text)) || text === "Commander sur WhatsApp"; }
export function translate(locale: Locale, text: string, values: Record<string, string | number> = {}): string {
 const source = text === "Commander sur WhatsApp" ? "Order on WhatsApp" : text;
 const key = source === "{count} products" && values.count === 1 ? "{count} product" : source;
 const translated = locale === "en" ? key : entries.get(normalize(key))?.[locale] || key;
 return translated.replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match));
}
