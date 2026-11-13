import { Suspense } from "react";
import { AuthScreen } from "@/components/auth-screen";
import { T } from "@/components/locale-provider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="auth-page">
    {children}
    <Suspense fallback={<p role="status"><T text="Please wait…"/></p>}>
      <AuthScreen clientId={process.env.GOOGLE_CLIENT_ID}/>
    </Suspense>
  </div>;
}
