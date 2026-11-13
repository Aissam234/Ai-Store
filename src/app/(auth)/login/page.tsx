import { Suspense } from "react";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/i18n/server";
import { getCurrentUser } from "@/server/auth";
import { authDestination } from "@/lib/auth-destination";

export async function generateMetadata() { return pageMetadata("Sign in"); }
type Props = { searchParams: Promise<{ next?: string }> };
async function Content({ searchParams }: Props) {
  const destination = authDestination((await searchParams).next);
  if (await getCurrentUser()) redirect(destination);
  return null;
}
export default function Page(props: Props) {
  return <Suspense fallback={null}><Content {...props}/></Suspense>;
}
