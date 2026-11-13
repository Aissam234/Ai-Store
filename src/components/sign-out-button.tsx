"use client";
import { useFormStatus } from "react-dom";
import { logout } from "@/actions/auth";
import { T } from "./locale-provider";

function Submit() {
  const { pending } = useFormStatus();
  return <button className="profile-signout" type="submit" disabled={pending} aria-busy={pending}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 4H5v16h5m5-12 4 4-4 4m-6-4h10"/>
    </svg>
    <span aria-live="polite"><T text={pending ? "Please wait…" : "Sign out"}/></span>
  </button>;
}

export function SignOutButton() {
  return <form action={logout}><Submit/></form>;
}
