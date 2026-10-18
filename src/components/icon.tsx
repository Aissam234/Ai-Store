import type { CSSProperties } from "react";
const paths = {
  arrow: "M6 18 18 6M6 6h12v12", right: "M4 12h16m-6-6 6 6-6 6", left: "M20 12H4m6-6-6 6 6 6",
  check: "m5 12 4 4L19 6", menu: "M4 6h16M4 12h16M4 18h16", close: "m6 6 12 12M6 18 18 6",
  plus: "M12 5v14M5 12h14", diamond: "m12 3 9 9-9 9-9-9Z",
  spark: "m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6Z",
  headset: "M4 13v-1a8 8 0 0 1 16 0v1M4 12H3v6h4v-6Zm16 0h1v6h-4v-6Zm0 6v1a2 2 0 0 1-2 2h-5",
  tag: "M3 3h8l10 10-8 8L3 11Zm4 4h.01",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Zm-4 9 3 3 5-6",
  chip: "M7 7h10v10H7Zm3 3h4v4h-4ZM9 3v4m6-4v4M9 17v4m6-4v4M3 9h4m-4 6h4m10-6h4m-4 6h4",
  gamepad: "M7 7h10c3 0 4 2 4 5l1 6c0 2-2 3-4 1l-3-3H9l-3 3c-2 2-4 1-4-1l1-6c0-3 1-5 4-5Zm-2 4h6m-3-3v6m8-3h.01m3 2h.01",
  code: "m8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16",
  grid: "M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z",
  layers: "m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 17l10 5 10-5",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
};
export type IconName = keyof typeof paths;
export function Icon({ name, className = "", style }: { name: IconName; className?: string; style?: CSSProperties }) {
 return <svg className={`ui-icon ${className}`} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]}/></svg>;
}
export function SymbolIcon({ symbol }: { symbol: string }) {
 const map: Record<string, IconName> = { "✳":"chip", "⌘":"gamepad", "◈":"layers", "↗":"arrow", "✦":"spark", "◇":"diamond", "▦":"grid", "{}":"code", "{ }":"code", "✓":"shield" };
 return <Icon name={map[symbol] || "chip"}/>;
}

