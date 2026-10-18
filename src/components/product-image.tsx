"use client";
import Image from "next/image";
import { useState } from "react";
export function ProductImage({ src, name, children }: { src?: string; name: string; children: React.ReactNode }) {
  const [failed, setFailed] = useState<string>();
  return src && failed !== src ? <Image fill unoptimized sizes="(max-width: 600px) 100vw, 33vw" className="product-photo" src={src} alt={name} loading="lazy" onError={() => setFailed(src)}/> : children;
}
