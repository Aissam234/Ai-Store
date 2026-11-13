"use client";
import { useLocale } from "./locale-provider";
import type { Locale } from "@/i18n/config";

// Accent a complete phrase in the existing translation. Counts are in reading order.
const phraseLengths: Record<string, Record<Locale, number>> = {
  "Tools for your next chapter.": { en: 2, fr: 2, ar: 2, ma: 2 },
  "Good questions. Straight answers.": { en: 2, fr: 3, ar: 2, ma: 2 },
  "One step closer to what’s next.": { en: 2, fr: 2, ar: 1, ma: 2 },
  "A few good choices.": { en: 2, fr: 2, ar: 1, ma: 1 },
  "Create your account": { en: 2, fr: 2, ar: 1, ma: 1 },
};

export function IntroTitle({ title, values }: { title: string; values?: Record<string, string | number> }) {
  const { t, locale } = useLocale();
  const text = t(title, values);
  const words = text.split(" ");
  const count = phraseLengths[title]?.[locale] ?? 1;
  const accent = values?.name && text.endsWith(values.name + ".")
    ? values.name + "." : words.slice(-count).join(" ");
  const lead = text.slice(0, text.length - accent.length).trimEnd();
  return <>{lead && <><span className="intro-shine">{lead}</span>{" "}</>}
    <span className="intro-shine intro-shine-accent">{accent}</span></>;
}
