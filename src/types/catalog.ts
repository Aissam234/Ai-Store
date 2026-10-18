export type Product = {
  oldPrice?: number;
  imageUrl?: string;
  id: string; slug: string; name: string; category: string; description: string;
  fullDescription: string; price: number; badge: string; featured: boolean;
  released: string; symbol: string; color: string; features: string[]; format: string;
};

export type Category = { id: string; name: string; slug: string; description: string; symbol: string; productCount: number };
