import { pageMetadata } from "@/i18n/server";
import { T } from "@/components/locale-provider";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { PageIntro } from "@/components/ui";
import { getCurrentUser } from "@/server/auth";
export async function generateMetadata() { return pageMetadata("Create account"); }
async function RegisterContent() {
  if (await getCurrentUser()) redirect("/account");
  return <AuthForm mode="register"/>;
}
export default function RegisterPage() { return <div className="container auth-page page-space"><PageIntro eyebrow="MAKE ROOM FOR WHAT’S NEXT" title="A space for your toolkit."><T text="Create your customer account. Payments and downloads are not available yet."/></PageIntro><section className="panel"><h2><T text="Create account"/></h2><Suspense fallback={<p className="loading"><T text="Loading registration…"/></p>}><RegisterContent/></Suspense></section></div>; }
