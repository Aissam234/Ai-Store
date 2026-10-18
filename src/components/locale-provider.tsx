"use client";
import { createContext, useContext, useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { direction, htmlLanguage, localeCookie, localeLabels, locales, resolveLocale, type Locale } from "@/i18n/config";
import { translate } from "@/i18n/messages";
const Context = createContext<{ locale: Locale; setLocale: (locale: Locale) => void; pending: boolean }>({ locale: "en", setLocale: () => {}, pending: false });
export function LocaleProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
 const [locale, update] = useState(initialLocale);
 const [pending, startTransition] = useTransition();
 const router = useRouter();
 useEffect(() => { document.documentElement.lang = htmlLanguage(locale); document.documentElement.dir = direction(locale); }, [locale]);
 function setLocale(next: Locale) {
  const selected = resolveLocale(next);
  document.cookie = localeCookie + "=" + selected + "; Path=/; Max-Age=31536000; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
  document.documentElement.lang = htmlLanguage(selected); document.documentElement.dir = direction(selected);
  update(selected); startTransition(() => router.refresh());
 }
 return <Context.Provider value={{ locale, setLocale, pending }}>{children}</Context.Provider>;
}
export function useLocale() { const value = useContext(Context); const t = useMemo(() => (text: string, values?: Record<string, string | number>) => translate(value.locale, text, values), [value.locale]); return { ...value, t }; }
export function T({ text, values }: { text: string; values?: Record<string, string | number> }) { const { t } = useLocale(); return <>{t(text, values)}</>; }
export function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
 const { locale, setLocale, pending, t } = useLocale();
 return <div className={mobile ? "language-switcher mobile-language" : "language-switcher desktop-language"} role="group" aria-label={t("Language")} aria-busy={pending} dir="ltr">{locales.map(code => <button key={code} type="button" lang={htmlLanguage(code)} aria-pressed={locale === code} onClick={() => setLocale(code)}>{localeLabels[code]}</button>)}</div>;
}
