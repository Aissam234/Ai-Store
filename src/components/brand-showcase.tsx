"use client";
import { T, useLocale } from "@/components/locale-provider";

import Image from "next/image";
import { DepthStage } from "./depth-stage";
import { store } from "@/config/store";

export function BrandShowcase() { const { t } = useLocale();
  return <aside className="brand-showcase" aria-label={t("AI STORE digital collection")}>
    
    <DepthStage><div className="brand-sculpture">
      <span className="brand-halo" aria-hidden="true"/>
      <span className="brand-orbit" aria-hidden="true"><span/></span>
      <Image className="brand-cutout" src={store.logoHero} alt="AI STORE" width={1024} height={1024} priority sizes="(max-width: 760px) 85vw, (max-width: 1200px) 45vw, 600px"/>
    </div></DepthStage>
    <span className="showcase-caption"><T text="INTELLIGENCE. WITH AN EDGE."/></span>
  </aside>;
}

