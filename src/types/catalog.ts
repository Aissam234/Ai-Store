import type { ProductTranslations } from "@/i18n/config";
export type Product = ProductTranslations & {
  durationMonths?: number | null;
  apiCreditUsd?: number | null;
  activation?: string | null;
  oldPrice?: number;
  imageUrl?: string; imageDarkUrl?: string; imageLightUrl?: string;
  id: string; slug: string; name: string; category: string; description: string;
  fullDescription: string; price: number; badge: string; featured: boolean;
  released: string; symbol: string; color: string; features: string[]; format: string;
  availability: "AVAILABLE" | "LIMITED" | "ASK_AVAILABILITY";
};

export type Category = { id: string; name: string; slug: string; description: string; symbol: string; productCount: number };
