import { store } from "@/config/store";
export function whatsappOrderUrl(products: { name: string; price: number }[]) {
  const lines = products.map(product => `Produit : ${product.name}\nPrix : ${product.price.toFixed(2)} ${store.currency}`);
  return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent("Bonjour, je souhaite commander :\n\n" + lines.join("\n\n"))}`;
}
