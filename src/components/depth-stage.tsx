"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

export function DepthStage({ children, card = false }: { children: ReactNode; card?: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<number>(0);
  const enabled = useRef(false);

  function reset() {
    cancelAnimationFrame(frame.current);
    const element = stage.current;
    if (!element) return;
    element.removeAttribute("data-tracking");
    element.style.removeProperty("--depth-x");
    element.style.removeProperty("--depth-y");
    element.style.removeProperty("--light-x");
    element.style.removeProperty("--light-y");
  }

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const preference = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => { enabled.current = preference.matches && !element.closest(".cart-item"); reset(); };
    update();
    preference.addEventListener("change", update);
    let inView = false;
    const updateVisibility = () => {
      element.dataset.visible = String(inView && !document.hidden);
      if (document.hidden) reset();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateVisibility();
      if (!entry.isIntersecting) reset();
    }, { threshold: 0.1 });
    observer.observe(element);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, []);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!enabled.current || event.pointerType === "touch" || stage.current?.dataset.visible !== "true") return;
    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();
    const horizontal = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const vertical = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      element.dataset.tracking = "true";
      element.style.setProperty("--depth-x", `${-vertical * (card ? 2.2 : 2.6)}deg`);
      element.style.setProperty("--depth-y", `${horizontal * (card ? 2.8 : 3.2)}deg`);
      element.style.setProperty("--light-x", `${horizontal * 12}%`);
      element.style.setProperty("--light-y", `${vertical * 9}%`);
    });
  }

  return <div ref={stage} className={card ? "depth-stage card-depth" : "depth-stage"} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
    <div className="depth-float"><div className="depth-object"><span className="depth-edge" aria-hidden="true"/>{children}</div></div>
  </div>;
}

