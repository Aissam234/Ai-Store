export const locales = ["en", "fr", "ar", "ma"] as const;
export type Locale = typeof locales[number];
export const localeCookie = "ai-store-locale";
export const localeLabels: Record<Locale, string> = { en: "EN", fr: "FR", ar: "العربية", ma: "الدارجة" };
export function resolveLocale(value: unknown): Locale { return locales.includes(value as Locale) ? value as Locale : "en"; }
export function direction(locale: Locale) { return locale === "ar" || locale === "ma" ? "rtl" : "ltr"; }
// ma is the store locale key; ary is the BCP 47 language code for Moroccan Arabic.
export function htmlLanguage(locale: Locale) { return locale === "ma" ? "ary" : locale; }
export type ProductTranslations = Partial<Record<`name${"En" | "Fr" | "Ar" | "Ma"}` | `description${"En" | "Fr" | "Ar" | "Ma"}`, string | null>>;
export function localizeProduct<T extends { name: string; description: string } & ProductTranslations>(product: T, locale: Locale): T {
 const suffix = { en: "En", fr: "Fr", ar: "Ar", ma: "Ma" }[locale] as "En" | "Fr" | "Ar" | "Ma";
 return { ...product, nameEn: product.nameEn?.trim() || product.name, descriptionEn: product.descriptionEn?.trim() || product.description, name: product[`name${suffix}`]?.trim() || product.nameEn?.trim() || product.name, description: product[`description${suffix}`]?.trim() || product.descriptionEn?.trim() || product.description };
}
