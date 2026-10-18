import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getDb } from "./db";

const cookieName = "nexora_session";
const duration = 7 * 24 * 60 * 60;
const digest = (token: string) => createHash("sha256").update(token).digest("hex");
export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await getDb().session.findUnique({
    where: { tokenHash: digest(token) },
    select: { expiresAt: true, user: { select: { id: true, name: true, email: true, role: true } } },
  });
  return session && session.expiresAt > new Date() ? session.user : null;
});
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") notFound();
  return user;
}
export async function createSession(userId: string) {
  const jar = await cookies();
  const previous = jar.get(cookieName)?.value;
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + duration * 1000);
  await getDb().$transaction(async tx => {
    await tx.session.deleteMany({ where: { OR: [{ expiresAt: { lt: new Date() } }, ...(previous ? [{ tokenHash: digest(previous) }] : [])] } });
    await tx.session.create({ data: { userId, tokenHash: digest(token), expiresAt } });
  });
  jar.set(cookieName, token, { httpOnly: true, secure: process.env.SESSION_COOKIE_SECURE === "false" ? false : process.env.SESSION_COOKIE_SECURE === "true" || process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: duration, expires: expiresAt });
}
export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) await getDb().session.deleteMany({ where: { tokenHash: digest(token) } });
  jar.delete(cookieName);
}
