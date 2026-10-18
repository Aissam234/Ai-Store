import { store } from "@/config/store";
import { localizeProduct, type Locale, type ProductTranslations } from "@/i18n/config";
import { translate } from "@/i18n/messages";
export function whatsappOrderUrl(products: ({ name: string; price: number; description?: string } & ProductTranslations)[], locale: Locale = "en") {
 const t = (text: string) => translate(locale, text);
 const lines = products.map(product => t("Product") + " : " + localizeProduct({ ...product, description: product.description || "" }, locale).name + "\n" + t("Price") + " : " + product.price.toFixed(2) + " " + store.currency);
 return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(t("Hello, I would like to order:") + "\n\n" + lines.join("\n\n"))}`;
}
