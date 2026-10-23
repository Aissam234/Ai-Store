"use client";
import { T, useLocale } from "@/components/locale-provider";

import { Icon } from "@/components/icon";

import { useState } from "react";
import { store } from "@/config/store";
export function SupportForm() {
 const { t } = useLocale();
  const [prepared, setPrepared] = useState(false);
  // iOS Chrome adds autofill attributes before hydration; retain native autofill.
  return <form suppressHydrationWarning className="form" onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); const body = `${t("Your name")}: ${data.get("name")}\n${t("Email address")}: ${data.get("email")}\n\n${data.get("message")}`; window.location.href = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(String(data.get("topic")) + "\n\n" + body)}`; setPrepared(true); }}><label><T text="Your name"/><input suppressHydrationWarning name="name" autoComplete="name" required maxLength={100}/></label><label><T text="Email address"/><input suppressHydrationWarning type="email" name="email" autoComplete="email" required maxLength={254}/></label><label><T text="What’s on your mind?"/><select suppressHydrationWarning name="topic"><option value={t("Product question")}>{t("Product question")}</option><option value={t("License question")}>{t("License question")}</option><option value={t("Store feedback")}>{t("Store feedback")}</option><option value={t("Something else")}>{t("Something else")}</option></select></label><label><T text="Your message"/><textarea suppressHydrationWarning name="message" required rows={5} maxLength={3000} placeholder={t("Tell us a little about what you need…")}/></label><p className="small"><T text="This prepares your message in WhatsApp. You review and send it there."/></p><button className="button primary" type="submit"><T text="Continue on WhatsApp"/> <Icon name="arrow"/></button>{prepared && <p role="status" className="preview-notice"><T text="WhatsApp was requested. No message has been sent by this website."/></p>}</form>;
}
