export const store = {
  whatsappNumber: "212607144420",
  name: "AI STORE",
  copyrightYear: 2026,
  description: "Premium digital tools and AI services. Explore the collection and order personally on WhatsApp.",
  currency: "MAD",
  logoDark: "/ai-store-dark.jpg",
  logoLight: "/ai-store-light.jpg",
  socialLinks: [] as { label: string; href: string }[],
};
export const formatPrice = (value: number) => `${new Intl.NumberFormat("en-MA").format(value)} ${store.currency}`;


