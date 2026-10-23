export type PaymentMethod = {
  id: string;
  name: string;
  image: string | null;
  description: string;
  instructions: string;
  available: boolean;
  order: number;
  details: { label: string; value: string }[];
};

// PUBLIC customer payment instructions only. Never put passwords, API keys,
// private keys or recovery phrases here. Empty details are intentional placeholders.
// Images: add files to public/payments and set image to /payments/filename.webp.
export const paymentMethods: PaymentMethod[] = [
  { id: "cih", name: "CIH Bank", image: null, description: "Manual bank transfer", instructions: "Confirm the beneficiary and transfer details with us on WhatsApp before sending payment.", available: true, order: 1, details: [{ label: "Account holder", value: "" }, { label: "Bank account / RIB", value: "" }] },
  { id: "al-barid", name: "Al Barid Bank", image: null, description: "Manual bank transfer", instructions: "Confirm the beneficiary and transfer details with us on WhatsApp before sending payment.", available: true, order: 2, details: [{ label: "Account holder", value: "" }, { label: "Bank account / RIB", value: "" }] },
  { id: "cash-plus", name: "Cash Plus", image: null, description: "Manual money transfer", instructions: "Contact us on WhatsApp to confirm the recipient and transfer instructions before visiting an agency.", available: true, order: 3, details: [{ label: "Recipient", value: "" }, { label: "Transfer information", value: "" }] },
  { id: "binance", name: "Binance", image: null, description: "Manual crypto payment", instructions: "Confirm the asset, network, amount and destination with us on WhatsApp before any transfer. No automatic processing.", available: true, order: 4, details: [{ label: "Payment destination", value: "" }, { label: "Asset / network", value: "" }] },
  { id: "other", name: "Other payment method", image: null, description: "Arrange an alternative on WhatsApp", instructions: "Tell us your preferred payment method on WhatsApp. We will confirm whether it is available and agree on the details before you pay.", available: true, order: 5, details: [] },
];
export function availablePaymentMethods() { return paymentMethods.filter(method => method.available).sort((a, b) => a.order - b.order); }
