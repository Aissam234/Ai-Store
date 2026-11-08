import { z } from "zod";
import { services, projectStatuses, budgetRanges } from "@/data/software-services";
import { translate } from "@/i18n/messages";
import type { Locale } from "@/i18n/config";
import { store } from "@/config/store";

export const inquirySchema = z.object({
 service: z.string().refine(value => services.some(service => service.id === value) || value === "other"),
 title: z.string().trim().min(2, "Please enter a project title (2–100 characters).").max(100, "Please enter a project title (2–100 characters)."),
 description: z.string().trim().min(20, "Describe your project in 20–2000 characters.").max(2000, "Describe your project in 20–2000 characters."),
 status: z.string().refine(value => projectStatuses.includes(value)),
 help: z.string().trim().max(800, "Keep this field within the indicated limit."),
 timeframe: z.string().trim().max(100, "Keep this field within the indicated limit."),
 budget: z.string().refine(value => budgetRanges.includes(value)),
 contact: z.string().trim().max(200, "Keep this field within the indicated limit."),
});
export type ServiceInquiry = z.infer<typeof inquirySchema>;
export const inquiryLabels = {
 service: "Service type", title: "Project title", description: "Project description", status: "Project status",
 help: "Desired features or help (optional)", timeframe: "Preferred timeframe (optional)",
 budget: "Optional budget range", contact: "Contact details (optional)",
} as const;

export function serviceInquiryMessage(inquiry: ServiceInquiry, locale: Locale) {
 const t = (value: string) => translate(locale, value);
 const selected = services.find(service => service.id === inquiry.service);
 const values = { ...inquiry, service: t(selected?.name || "Other"), status: t(inquiry.status), budget: t(inquiry.budget) };
 const lines = (Object.keys(inquiryLabels) as (keyof typeof inquiryLabels)[])
  .filter(key => values[key])
  .map(key => t(inquiryLabels[key]) + " : " + values[key]);
 return t("Request a Quote") + "\n\n" + lines.join("\n\n");
}
export function serviceInquiryUrl(inquiry: ServiceInquiry, locale: Locale) {
 return "https://wa.me/" + store.whatsappNumber + "?text=" + encodeURIComponent(serviceInquiryMessage(inquiry, locale));
}
