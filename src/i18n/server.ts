import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { localeCookie, resolveLocale } from "./config";
import { translate } from "./messages";
export const getLocale = cache(async () => resolveLocale((await cookies()).get(localeCookie)?.value));
export async function pageMetadata(title: string) { const locale = await getLocale(); return { title: translate(locale, title) }; }
