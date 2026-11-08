type ServiceArtworkProps = { variant: string; hero?: boolean };

// Abstract interface drawings are decorative; their service heading supplies the meaning.
export function ServiceArtwork({ variant, hero = false }: ServiceArtworkProps) {
 return <div className={hero ? "studio-art studio-art-hero" : "studio-art"} aria-hidden="true">
 <svg viewBox="0 0 560 360" fill="none" focusable="false">
  <ellipse cx="280" cy="310" rx="195" ry="24" className="art-shadow"/>
  <path d="M30 285 280 155 530 285 280 355Z" className="art-plane"/>
  <g className="art-layer">
  {variant === "1" && <>
   <rect x="64" y="62" width="390" height="236" rx="16" className="art-window"/>
   <path d="M64 96H454" className="art-line"/><circle cx="84" cy="80" r="4" className="art-accent"/><circle cx="98" cy="80" r="4" className="art-muted"/><circle cx="112" cy="80" r="4" className="art-muted"/>
   <rect x="90" y="120" width="65" height="8" rx="4" className="art-accent"/>
   <path d="M90 154H252M90 171H217" className="art-ink" strokeWidth="12" strokeLinecap="round"/>
   <path d="M90 200H226M90 211H204" className="art-line" strokeWidth="3"/>
   <rect x="90" y="236" width="90" height="26" rx="7" className="art-accent"/>
   <path d="M289 137 369 115 406 193 325 219Z" className="art-plane"/><path d="m299 147 46-12 25 51-47 13Z" className="art-accent"/>
   <rect x="400" y="161" width="94" height="159" rx="18" className="art-window"/><rect x="432" y="171" width="31" height="4" rx="2" className="art-muted"/>
   <rect x="414" y="191" width="66" height="55" rx="6" className="art-plane"/><path d="M417 262H473M417 273H455" className="art-line" strokeWidth="4"/><rect x="417" y="291" width="54" height="12" rx="4" className="art-accent"/>
  </>}
  {variant === "2" && <>
   <rect x="72" y="55" width="408" height="250" rx="18" className="art-window"/>
   <path d="M140 55V305M72 94H480" className="art-line"/><rect x="93" y="71" width="26" height="9" rx="4" className="art-accent"/>
   {[116,146,176,206].map(y=><rect key={y} x="92" y={y} width="27" height="6" rx="3" className="art-muted"/>)}
   {[165,261,357].map((x,i)=><g key={x}><rect x={x} y="114" width="77" height="52" rx="8" className="art-plane"/><path d={`M${x+14} 136h${22+i*7}`} className="art-accent" strokeWidth="7"/><path d={`M${x+14} 150h36`} className="art-line"/></g>)}
   <rect x="165" y="187" width="181" height="92" rx="9" className="art-plane"/><path d="m181 254 26-19 22 7 31-30 27 10 40-25" className="art-signal"/>
   <rect x="363" y="188" width="91" height="20" rx="5" className="art-accent"/>
   <path d="M366 230H444M366 247H429M366 264H439" className="art-line" strokeWidth="5"/>
  </>}
  {variant === "3" && <>
   <path d="M137 112H222Q245 112 245 136V180M137 264H224Q245 264 245 240V180M315 180H354Q375 180 375 152V106H425M315 180H382Q402 180 402 207V260H445" className="art-signal"/>
   {[[68,77],[68,229],[407,70],[424,227]].map(([x,y])=><g key={x+":"+y}><rect x={x} y={y} width="74" height="66" rx="13" className="art-window"/><path d={`m${x+27} ${y+24}-9 9 9 9m20-18 9 9-9 9`} className="art-ink" strokeWidth="3"/></g>)}
   <rect x="220" y="133" width="108" height="96" rx="22" className="art-window"/>
   <path d="m274 152 29 17v30l-29 17-29-17v-30Z" className="art-accent"/><path d="m250 171 24 14 24-14m-24 14v26" stroke="var(--surface)" strokeWidth="2"/>
   <circle cx="181" cy="112" r="5" className="art-accent"/><circle cx="375" cy="135" r="5" className="art-accent"/><circle cx="402" cy="224" r="5" className="art-accent"/>
  </>}
  {variant === "4" && <>
   <rect x="66" y="69" width="311" height="214" rx="15" className="art-window"/><path d="M66 103H377" className="art-line"/>
   <path d="M89 84H128" className="art-accent" strokeWidth="5"/>
   <path d="m117 143-17 17 17 17m63-34 17 17-17 17m-30-40-13 45" className="art-signal"/>
   <path d="M101 210H222M101 227H282M101 244H248" className="art-line" strokeWidth="6"/>
   <rect x="315" y="114" width="170" height="191" rx="15" className="art-window"/><path d="M340 148H455" className="art-line" strokeWidth="6"/><path d="M344 179V272" className="art-line"/>
   {[181,223,265].map((y,i)=><g key={y}><circle cx="344" cy={y} r="9" className={i<2?"art-accent":"art-plane"}/><path d={`M365 ${y}h${70-i*12}`} className="art-line" strokeWidth="5"/></g>)}
  </>}
  {variant === "5" && <>
   <rect x="66" y="64" width="394" height="236" rx="16" className="art-window"/><path d="M66 102H460M107 102V300" className="art-line"/>
   {[128,154,180,206,232,258].map((y,i)=><g key={y}><path d={`M82 ${y}h9`} className="art-line" strokeWidth="3"/><path d={`M126 ${y}h${[113,65,167,92,138,77][i]}`} className={i===2?"art-accent":"art-line"} strokeWidth="6"/></g>)}
   <rect x="323" y="181" width="166" height="126" rx="16" className="art-window"/><circle cx="359" cy="218" r="16" className="art-plane"/><path d="m351 217 6 6 11-12" className="art-signal"/><path d="M389 212H464M389 224H441M344 254H462M344 272H430" className="art-line" strokeWidth="5"/>
  </>}
  </g>
 </svg>
 </div>;
}
