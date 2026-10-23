import { getDb } from "@/server/db";
import { getCurrentUser } from "@/server/auth";
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const theme = new URL(request.url).searchParams.get("theme");
  const product = await getDb().product.findUnique({ where: { id }, select: { active: true, imageData: true, imageDarkData: theme === "dark", imageLightData: theme === "light" } });
  if (!product || (!product.active && (await getCurrentUser())?.role !== "ADMIN")) return new Response(null, { status: 404 });
  const data = (theme === "dark" ? product.imageDarkData : theme === "light" ? product.imageLightData : null) ?? product.imageData;
  if (!data) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(data), { headers: { "Content-Type": "image/webp", "Cache-Control": "private, no-cache", "X-Content-Type-Options": "nosniff" } });
}
