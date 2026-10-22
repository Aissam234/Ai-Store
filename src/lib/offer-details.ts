import type { Locale } from "@/i18n/config";
import { translate } from "@/i18n/messages";
export type OfferDetails = { durationMonths?: number | null; apiCreditUsd?: number | null; activation?: string | null };
export function offerDetails(product: OfferDetails, locale: Locale) {
  const details: { label: string; value: string; latin?: boolean }[] = [];
  const t = (text: string, values?: Record<string, string | number>) => translate(locale, text, values);
  if (product.durationMonths) {
    const months = product.durationMonths;
    const years = months / 12;
    const value = months === 1 ? t("1 month") : months === 12 ? t("1 year") : months % 12 === 0 ? t("{count} years", { count: years }) : t("{count} months", { count: months });
    details.push({ label: t("Duration"), value });
  }
  if (product.apiCreditUsd) details.push({ label: t("Package"), value: `$${product.apiCreditUsd} API`, latin: true });
  if (product.activation) details.push({ label: t("Activation"), value: t(product.activation) });
  return details;
}
export function availabilityLabel(availability: string) {
  return availability === "AVAILABLE" ? "Available now" : availability === "LIMITED" ? "Limited availability" : "Confirm availability";
}
