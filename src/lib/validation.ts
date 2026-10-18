import { z } from "zod";

export const idSchema = z.string().min(1).max(128).regex(/^[a-zA-Z0-9_-]+$/);
export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const passwordSchema = z.string().min(15, "Use at least 15 characters.").max(128, "Use at most 128 characters.");
export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1).max(128) });
export const registerSchema = loginSchema.extend({ name: z.string().trim().min(2).max(100), password: passwordSchema });
const slugSchema = z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens.");
export const categorySchema = z.object({
  name: z.string().trim().min(2).max(80), slug: slugSchema,
  description: z.string().trim().min(5).max(500), symbol: z.string().trim().min(1).max(12),
});
export const priceSchema = z.string().regex(/^(0|[1-9]\d{0,5})(\.\d{1,2})?$/, "Enter a price from 0 to 999999.99 MAD, with at most two decimals.")
  .transform(value => { const [whole, fraction = ""] = value.split("."); return Number(whole) * 100 + Number(fraction.padEnd(2, "0")); });
export const productSchema = z.object({
  name: z.string().trim().min(2).max(120), slug: slugSchema,
  categoryId: idSchema, description: z.string().trim().min(10).max(500),
  fullDescription: z.string().trim().min(10).max(10000), price: priceSchema,
  oldPrice: z.union([z.literal(""), priceSchema]).optional().transform(value => typeof value === "number" ? value : null),
  badge: z.string().trim().max(40), featured: z.boolean(), active: z.boolean(),
  released: z.iso.date(), symbol: z.string().trim().min(1).max(12),
  color: z.enum(["mint", "violet", "peach", "blue"]), format: z.string().trim().min(1).max(80),
  features: z.string().max(5000).transform(value => value.split(/\r?\n/).map(line => line.trim()).filter(Boolean))
    .pipe(z.array(z.string().min(1).max(300)).min(1).max(20)),
}).refine(value => value.oldPrice === null || value.oldPrice > value.price, { message: "Old price must be higher than the current price.", path: ["oldPrice"] });
export const checkoutSchema = z.object({
  ids: z.array(idSchema).min(1, "Your cart is empty.").max(50).refine(ids => new Set(ids).size === ids.length, "Only one license per product is allowed."),
  firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80),
  email: emailSchema, company: z.string().trim().max(120), idempotencyKey: z.uuid(),
}).strict();
export type ActionState = { error?: string; success?: string };
