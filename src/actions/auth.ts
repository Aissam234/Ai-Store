"use server";
import { redirect } from "next/navigation";
import { getDb } from "@/server/db";
import { createSession, destroySession } from "@/server/auth";
import { consumeLimit } from "@/server/rate-limit";
import { dummyPasswordHash, hashPassword, verifyPassword } from "@/lib/password";
import { loginSchema, registerSchema, type ActionState } from "@/lib/validation";

export async function login(_previous: ActionState, form: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Enter a valid email and password." };
  try {
    if (!await consumeLimit("login-global", "all", 60, 60) || !await consumeLimit("login", parsed.data.email, 5, 900)) return { error: "Too many attempts. Please try again in 15 minutes." };
    const user = await getDb().user.findUnique({ where: { email: parsed.data.email } });
    const valid = await verifyPassword(parsed.data.password, user?.passwordHash || dummyPasswordHash);
    if (!user || !valid) return { error: "Email or password is incorrect." };
    await createSession(user.id);
  } catch { return { error: "Sign-in is unavailable right now. Please try again later." }; }
  redirect("/account");
}
export async function register(_previous: ActionState, form: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    if (!await consumeLimit("register-global", "all", 10, 60) || !await consumeLimit("register", parsed.data.email, 3, 900)) return { error: "Too many attempts. Please try again in 15 minutes." };
    const passwordHash = await hashPassword(parsed.data.password);
    const user = await getDb().user.create({ data: { name: parsed.data.name, email: parsed.data.email, passwordHash, role: "CUSTOMER" } });
    await createSession(user.id);
  } catch { return { error: "Unable to create this account. Try signing in if you already registered, or try again later." }; }
  redirect("/account");
}
export async function logout() {
  await destroySession();
  redirect("/login");
}
