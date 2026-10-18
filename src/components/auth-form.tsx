"use client";
import { Icon } from "./icon";
import Link from "next/link";
import { useActionState } from "react";
import { login, register } from "@/actions/auth";
import type { ActionState } from "@/lib/validation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const registering = mode === "register";
  const [state, action, pending] = useActionState<ActionState, FormData>(registering ? register : login, {});
  return <form action={action} className="form">
    {registering && <label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={100}/></label>}
    <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
    <label>Password<input name="password" type="password" autoComplete={registering ? "new-password" : "current-password"} required minLength={registering ? 15 : 1} maxLength={128}/></label>
    {registering && <p className="small">Use a unique passphrase of 15–128 characters.</p>}
    {state.error && <p className="form-error" role="alert">{state.error}</p>}
    <button className="button primary" disabled={pending}>{pending ? "Please wait…" : registering ? "Create account" : "Sign in"}{!pending && <Icon name="right"/>}</button>
    <p className="small">{registering ? "Already have an account? " : "New here? "}<Link className="text-link" href={registering ? "/login" : "/register"}>{registering ? "Sign in" : "Create an account"}</Link></p>
  </form>;
}

