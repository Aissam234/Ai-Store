export function googleIdentity(payload: { sub?: string; email?: string; email_verified?: boolean; name?: string; nonce?: string } | undefined, nonce: string) {
  if (!payload || payload.nonce !== nonce || !/^[a-f0-9]{64}$/.test(nonce) || !payload.sub || payload.sub.length > 255 || payload.email_verified !== true) return null;
  const email = payload.email?.trim().toLowerCase();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+$/.test(email)) return null;
  return { googleSub: payload.sub, email, name: (payload.name?.trim() || email.split("@")[0]).slice(0, 100) };
}
