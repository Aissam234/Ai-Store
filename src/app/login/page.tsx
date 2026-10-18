import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { PageIntro } from "@/components/ui";
import { getCurrentUser } from "@/server/auth";
export const metadata = { title: "Sign in" };
async function LoginContent() {
  if (await getCurrentUser()) redirect("/account");
  return <AuthForm mode="login"/>;
}
export default function LoginPage() { return <div className="container auth-page page-space"><PageIntro eyebrow="WELCOME BACK" title="Your next chapter awaits.">Sign in to manage your account and unpaid checkout drafts.</PageIntro><section className="panel"><h2>Sign in</h2><Suspense fallback={<p className="loading">Loading sign-in…</p>}><LoginContent/></Suspense></section></div>; }
