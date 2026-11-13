"use server";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { OAuth2Client } from "google-auth-library";
import { getDb } from "@/server/db";
import { createSession, getCurrentUser } from "@/server/auth";
import { consumeLimit } from "@/server/rate-limit";
import { googleIdentity } from "@/lib/google-identity";

const verifier = new OAuth2Client();
const cookieName = "ai_google_challenge";
const failed = "Google sign-in could not finish. Please try again.";
export async function beginGoogle() {
  try {
  if (!process.env.GOOGLE_CLIENT_ID || !await consumeLimit("google-start", "all", 300, 60)) return null;
  const nonce = randomBytes(32).toString("hex");
  const db = getDb();
  await db.googleChallenge.deleteMany({ where: { expiresAt: { lte: new Date() } } });
  await db.googleChallenge.create({ data: { nonce, expiresAt: new Date(Date.now() + 600_000) } });
  (await cookies()).set(cookieName, nonce, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 600 });
  return nonce;
  } catch (error) {
    console.error("Google challenge unavailable", error instanceof Error ? error.name : "UnknownError");
    return null;
  }
}

export async function finishGoogle(token: string, link: boolean) {
  const audience = process.env.GOOGLE_CLIENT_ID;
  const jar = await cookies();
  const nonce = jar.get(cookieName)?.value;
  if (!audience || !nonce || !/^[a-f0-9]{64}$/.test(nonce) || typeof link !== "boolean" || typeof token !== "string" || token.length > 16384) return failed;
  try {
    const claimed = await getDb().googleChallenge.deleteMany({ where: { nonce, expiresAt: { gt: new Date() } } });
    if (!claimed.count) return failed;
    jar.delete(cookieName);
    const ticket = await verifier.verifyIdToken({ idToken: token, audience });
    const identity = googleIdentity(ticket.getPayload(), nonce);
    if (!identity) return failed;
    const users = getDb().user;
    let user = await users.findUnique({ where: { googleSub: identity.googleSub } });
    if (link) {
      const current = await getCurrentUser();
      if (!current || current.email !== identity.email || (user && user.id !== current.id)) return failed;
      if (!user) {
        const updated = await users.updateMany({ where: { id: current.id, email: identity.email, googleSub: null }, data: { googleSub: identity.googleSub } });
        if (updated.count !== 1) return failed;
      }
      await createSession(current.id);
    } else {
      if (!user) {
        if (await users.findUnique({ where: { email: identity.email } })) return "link-required";
        try {
          user = await users.create({ data: { ...identity, role: "CUSTOMER" } });
        } catch (error) {
          // A concurrent verified Google request may already have created this identity.
          if (!(error instanceof Error) || !("code" in error) || error.code !== "P2002") throw error;
          user = await users.findUnique({ where: { googleSub: identity.googleSub } });
          if (!user) return "link-required";
        }
      }
      await createSession(user.id);
    }
    return null;
  } catch (error) {
    console.error("Google authentication failed", error instanceof Error ? error.name : "UnknownError");
    return failed;
  }
}
