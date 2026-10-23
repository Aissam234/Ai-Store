"use client";
import { useLightTheme } from "./use-light-theme";
import { Skeleton } from "./skeleton";
import Image from "next/image";
import { useState } from "react";
export function ProductImage({ src: fallbackSrc, darkSrc, lightSrc, name, children }: { src?: string; darkSrc?: string; lightSrc?: string; name: string; children: React.ReactNode }) {
  const light = useLightTheme();
  const preferred = light ? lightSrc : darkSrc;
  const [loaded, setLoaded] = useState<string>();
  const [failed, setFailed] = useState<string[]>([]);
  const src = preferred && !failed.includes(preferred) ? preferred : fallbackSrc;
  return src && !failed.includes(src) ? <>{loaded !== src && <Skeleton className="image-loading"/>}<Image fill unoptimized sizes="(max-width: 600px) 100vw, 33vw" className={`product-photo ${loaded === src ? "image-ready" : "image-pending"}`} src={src} alt={name} loading="lazy" onLoad={() => setLoaded(src)} onError={() => setFailed(previous => [...previous, src])}/></> : children;
}
