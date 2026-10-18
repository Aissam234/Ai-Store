import "server-only";
import { createHash } from "node:crypto";
import { getDb } from "./db";

export async function consumeLimit(scope: string, subject: string, limit: number, seconds: number) {
  const bucket = Math.floor(Date.now() / (seconds * 1000));
  const key = createHash("sha256").update(`${scope}:${subject}:${bucket}`).digest("hex");
  const db = getDb();
  await db.authRateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  const row = await db.authRateLimit.upsert({
    where: { key }, create: { key, expiresAt: new Date((bucket + 1) * seconds * 1000) },
    update: { attempts: { increment: 1 } }, select: { attempts: true },
  });
  return row.attempts <= limit;
}
