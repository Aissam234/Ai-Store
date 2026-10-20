"use client";
import { Skeleton } from "./skeleton";
import Image from "next/image";
import { useState } from "react";
export function ProductImage({ src, name, children }: { src?: string; name: string; children: React.ReactNode }) {
  const [loaded, setLoaded] = useState<string>();
  const [failed, setFailed] = useState<string>();
  return src && failed !== src ? <>{loaded !== src && <Skeleton className="image-loading"/>}<Image fill unoptimized sizes="(max-width: 600px) 100vw, 33vw" className={`product-photo ${loaded === src ? "image-ready" : "image-pending"}`} src={src} alt={name} loading="lazy" onLoad={() => setLoaded(src)} onError={() => setFailed(src)}/></> : children;
}
