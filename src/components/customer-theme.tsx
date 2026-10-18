"use client";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { CatalogSync } from "./catalog-sync";

function AmbientEnvironment() {
  return <div className="ambient-environment" aria-hidden="true"/>;
}

function StorefrontFrame({ children }: { children: React.ReactNode }) {
  return <div className="customer-ui"><AmbientEnvironment/><div className="customer-content">{children}</div></div>;
}

function RouteTheme({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return path.startsWith("/admin") ? <div className="customer-ui admin-ui"><AmbientEnvironment/><div className="customer-content">{children}</div></div> : <StorefrontFrame>{children}</StorefrontFrame>;
}

export function CustomerTheme({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<StorefrontFrame>{children}</StorefrontFrame>}><CatalogSync/><RouteTheme>{children}</RouteTheme></Suspense>;
}
