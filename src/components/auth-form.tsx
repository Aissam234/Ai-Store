"use client";
import { T, useLocale } from "@/components/locale-provider";

import { hasMessage } from "@/i18n/messages";
import { Icon } from "./icon";
import Link from "next/link";
import "./auth-screen.css";
import { useActionState, useState } from "react";
import { login, register } from "@/actions/auth";
import type { ActionState } from "@/lib/validation";

export function AuthForm({ mode, destination = "/account" }: { mode: "login" | "register"; destination?: string }) {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);
  const registering = mode === "register";
  const loginAction = useActionState<ActionState, FormData>(login, {});
  const registerAction = useActionState<ActionState, FormData>(register, {});
  const [state, action, pending] = registering ? registerAction : loginAction;
  // iOS Chrome autofill adds __gCrUniqueID attributes before hydration. Keep autofill enabled.
  return <form action={action} className="form" suppressHydrationWarning>
    <input type="hidden" name="next" value={destination}/>
    <div className="auth-extra" inert={!registering}><div><label><T text="Your name"/><input suppressHydrationWarning name="name" disabled={!registering} autoComplete="name" required minLength={2} maxLength={100}/></label></div></div>
    <label><T text="Email address"/><input suppressHydrationWarning id="auth-email" name="email" type="email" autoComplete="email" required maxLength={254}/></label>
    <label><T text="Password"/><div className={"auth-password"}><input suppressHydrationWarning name="password" type={visible ? "text" : "password"} autoComplete={registering ? "new-password" : "current-password"} required minLength={registering ? 15 : 1} maxLength={128}/><button type="button" aria-pressed={visible} onClick={() => setVisible(!visible)}>{t(visible ? "Hide" : "Show")}</button></div></label>
    <div className="auth-extra" inert={!registering}><div><p className="small"><T text="Use a unique passphrase of 15–128 characters."/></p></div></div>
    {state.error && <p className="form-error" role="alert">{t(hasMessage(state.error) ? state.error : "Please check your details and try again.")}</p>}
    <button type="submit" className="button primary" disabled={pending}><span key={mode} className="auth-submit-label">{t(pending ? "Please wait…" : registering ? "Create account" : "Sign in")}</span>{!pending && <Icon name="right"/>}</button>
    <p className="small">{t(registering ? "Already have an account?" : "New here?")} <Link className="text-link" href={(registering ? "/login" : "/register") + "?next=" + encodeURIComponent(destination)}>{t(registering ? "Sign in" : "Create an account")}</Link></p>
  </form>;
}

