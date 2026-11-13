"use client";
import { useRouter } from "next/navigation";
import { useLightTheme } from "./use-light-theme";
import "./google-button.css";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { beginGoogle, finishGoogle } from "@/actions/google";
import { useLocale } from "./locale-provider";

type IdentityApi = {
  initialize(options: { client_id: string; nonce: string; callback(result: { credential: string }): void }): void;
  renderButton(target: HTMLElement, options: Record<string, string>): void;
};
const failure = "Google sign-in could not finish. Please try again.";
export function GoogleButton({ clientId, mode, destination = "/account", compact = false }: { destination?: string; compact?: boolean; clientId: string; mode: "login" | "register" | "link" }) {
  const light = useLightTheme();
  const router = useRouter();
  const { locale, t } = useLocale();
  const processing = useRef(false);
  const target = useRef<HTMLDivElement>(null);
  const challengeCreated = useRef(0);
  const challenge = useRef<ReturnType<typeof beginGoogle> | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (ready) return;
    const timer = setTimeout(() => setError(failure), 15000);
    return () => clearTimeout(timer);
  }, [ready]);
  useEffect(() => {
    if (!ready || !target.current) return;
    const node = target.current;
    let active = true;
    let observer: ResizeObserver | undefined;
    async function render() {
      if (!challenge.current) { challengeCreated.current = Date.now(); challenge.current = beginGoogle(); }
      const nonce = await challenge.current;
      if (!active) return;
      const api = (window as Window & { google?: { accounts: { id: IdentityApi } } }).google?.accounts.id;
      if (!nonce || !api) throw new Error();
      api.initialize({ client_id: clientId, nonce, callback: async ({ credential }) => {
        if (!active || processing.current) return;
        processing.current = true;
        setBusy(true);
        let expired = false;
        const timeout = setTimeout(() => {
          expired = true;
          if (active) { setError(failure); setBusy(false); }
        }, 30000);
        try {
          const result = await finishGoogle(credential, mode === "link");
          if (!active || expired) return;
          if (result) setError(result);
          else { router.replace(destination); router.refresh(); }
        } catch { setError(failure); }
        finally { clearTimeout(timeout); processing.current = false; if (active) setBusy(false); }
      } });
      let previousWidth = 0;
      function draw() {
        const width = Math.floor(node.clientWidth);
        if (!width || width === previousWidth) return;
        previousWidth = width;
        node.replaceChildren();
        api!.renderButton(node, {
          type: "standard", theme: light ? "outline" : "filled_black", size: "large",
          shape: "pill", width: String(width),
          text: mode === "register" ? "signup_with" : "continue_with",
          locale: locale === "ma" ? "ar" : locale
        });
      }
      draw();
      observer = new ResizeObserver(draw);
      observer.observe(node);
    }
    function refreshExpired() {
      if (document.visibilityState === "visible" && !processing.current && Date.now() - challengeCreated.current > 540000) {
        challenge.current = null;
        setAttempt(previous => previous + 1);
      }
    }
    const refreshTimer = setInterval(refreshExpired, 30000);
    document.addEventListener("visibilitychange", refreshExpired);
    render().catch(() => { if (active) setError(failure); });
    return () => { active = false; clearInterval(refreshTimer); document.removeEventListener("visibilitychange", refreshExpired); observer?.disconnect(); node.replaceChildren(); };
  }, [attempt, clientId, destination, light, locale, mode, ready, router]);
  function retry() {
    if (processing.current || !ready) { window.location.reload(); return; }
    challenge.current = null;
    setError("");
    setAttempt(previous => previous + 1);
  }
  return <div className={compact ? "google-auth-compact" : "google-auth-group"} aria-busy={busy}>
    <Script src="https://accounts.google.com/gsi/client" onReady={() => setReady(true)} onError={() => setError(failure)}/>
    {!compact && <p className={"google-auth-divider"}>{t(mode === "link" ? "Link your Google account" : "Or continue with Google")}</p>}
    <div className={"google-auth-control"} ref={target} hidden={!!error || busy}/>
    {busy && <p role="status">{t("Please wait…")}</p>}
    {error && <div className={"google-auth-feedback"} role="alert">
      {error === "link-required" ? <>
        <p>{t("Sign in with your password, then link Google from your account.")}</p>
        {mode === "login"
          ? <button type="button" className="button secondary" onClick={() => document.getElementById("auth-email")?.focus()}>{t("Sign in")}</button>
          : <Link className="button secondary" href="/login#auth-email">{t("Sign in")}</Link>}
      </> : <>
        <p>{t(error)}</p>
        <button type="button" className="button secondary" onClick={retry}>{t("Try again")}</button>
      </>}
    </div>}
  </div>;
}
