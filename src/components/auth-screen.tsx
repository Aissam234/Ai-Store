"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { authDestination } from "@/lib/auth-destination";
import Link from "next/link";
import { Brand } from "./brand";
import { T } from "./locale-provider";
import { AuthForm } from "./auth-form";
import { GoogleButton } from "./google-button";
import "./auth-screen.css";

export function AuthScreen({ clientId }: { clientId?: string }) {
  const mode = usePathname() === "/register" ? "register" : "login";
  const destination = authDestination(useSearchParams().get("next"));
  const registering = mode === "register";
  const query = "?next=" + encodeURIComponent(destination);
  return <section className="auth-card" data-mode={mode} aria-labelledby="auth-heading">
    <Link href="/" className={"brand " + "auth-brand"}><Brand/></Link>
    <header className={"auth-heading"}>
      <h1 id="auth-heading" key={mode}><T text={registering ? "Create your account" : "Welcome back"}/></h1>
      <p><T text="Your account for orders, saved drafts and personal support."/></p>
    </header>
    <nav className={"auth-tabs"}>
      <Link href={"/login" + query} aria-current={!registering ? "page" : undefined}><T text="Sign in"/></Link>
      <Link href={"/register" + query} aria-current={registering ? "page" : undefined}><T text="Create account"/></Link>
    </nav>
    {clientId && <>
      <GoogleButton clientId={clientId} mode={mode} destination={destination} compact/>
      <p className={"auth-divider"}><T text="Or continue with email"/></p>
    </>}
    <AuthForm mode={mode} destination={destination}/>
  </section>;
}
