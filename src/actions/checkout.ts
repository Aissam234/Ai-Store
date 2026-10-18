"use server";
import { Prisma } from "@/generated/prisma/client";
import { getCurrentUser } from "@/server/auth";
import { getDb } from "@/server/db";
import { consumeLimit } from "@/server/rate-limit";
import { checkoutSchema } from "@/lib/validation";
import { calculateOrder } from "@/lib/order-pricing";
import { store } from "@/config/store";
import { revalidatePath } from "next/cache";

export type CheckoutResult = { error: string; loginRequired?: boolean } | { orderId: string; totalMinor: number; currency: string };
export async function createCheckoutDraft(input: unknown): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to save an unpaid checkout draft. Your cart will stay saved.", loginRequired: true };
  const data = parsed.data;
  try {
    if (!await consumeLimit("checkout", user.id, 20, 60)) return { error: "Please wait a minute before trying again." };
    const db = getDb();
    const unique = { userId_idempotencyKey: { userId: user.id, idempotencyKey: data.idempotencyKey } };
    const result = await db.$transaction(async tx => {
      const previous = await tx.order.findUnique({ where: unique });
      if (previous) return previous;
      const products = await tx.product.findMany({ where: { id: { in: data.ids }, active: true }, select: { id: true, name: true, slug: true, priceMinor: true, active: true } });
      const { totalMinor, items } = calculateOrder(data.ids, products);
      return tx.order.create({ data: {
        userId: user.id, idempotencyKey: data.idempotencyKey, status: "DRAFT", currency: store.currency,
        customerName: `${data.firstName} ${data.lastName}`, customerEmail: data.email,
        company: data.company || null, totalMinor, items: { create: items },
      } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    revalidatePath("/account"); revalidatePath("/admin"); revalidatePath("/admin/orders");
    return { orderId: result.id, totalMinor: result.totalMinor, currency: result.currency };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const previous = await getDb().order.findUnique({ where: { userId_idempotencyKey: { userId: user.id, idempotencyKey: data.idempotencyKey } } });
      if (previous) return { orderId: previous.id, totalMinor: previous.totalMinor, currency: previous.currency };
    }
    return { error: "Could not save this draft. A product may have changed or become unavailable. Refresh your cart and try again. No payment was taken." };
  }
}
