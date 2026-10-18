import { getDb } from "@/server/db";
import { getCurrentUser } from "@/server/auth";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getDb().product.findUnique({ where: { id }, select: { active: true, imageData: true } });
  if (!product?.imageData || (!product.active && (await getCurrentUser())?.role !== "ADMIN")) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(product.imageData), { headers: { "Content-Type": "image/webp", "Cache-Control": "private, no-cache", "X-Content-Type-Options": "nosniff" } });
}
