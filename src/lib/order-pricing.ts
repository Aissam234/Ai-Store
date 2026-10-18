export type PricedProduct = { id: string; slug: string; name: string; priceMinor: number; active: boolean };
export function calculateOrder(ids: string[], products: PricedProduct[]) {
  if (!ids.length || ids.length > 50 || new Set(ids).size !== ids.length) throw new Error("Choose between 1 and 50 unique products.");
  const byId = new Map(products.map(product => [product.id, product]));
  const items = ids.map(id => {
    const product = byId.get(id);
    if (!product || !product.active) throw new Error("A product is no longer available. Please refresh your cart.");
    if (!Number.isSafeInteger(product.priceMinor) || product.priceMinor < 0) throw new Error("A product price is invalid. Please contact support.");
    return { productId: product.id, productName: product.name, productSlug: product.slug, unitPriceMinor: product.priceMinor, quantity: 1 };
  });
  const totalMinor = items.reduce((total, item) => total + item.unitPriceMinor, 0);
  if (!Number.isSafeInteger(totalMinor) || totalMinor > 2_000_000_000) throw new Error("This cart exceeds the supported order total.");
  return { items, totalMinor };
}
