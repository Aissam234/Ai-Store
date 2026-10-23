"use client";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

export function SurfaceCard({ children, className, href }: { children: ReactNode; className?: string; href?: string }) {
  const element = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const card = element.current;
    if (!card) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => { card.dataset.motionVisible = String(visible && !document.hidden && !preference.matches); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.1 });
    observer.observe(card);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); preference.removeEventListener("change", sync); };
  }, []);
  return href
    ? <Link ref={node => { element.current = node; }} href={href} className={className} data-surface-motion="true">{children}</Link>
    : <div ref={node => { element.current = node; }} className={className} data-surface-motion="true">{children}</div>;
}
