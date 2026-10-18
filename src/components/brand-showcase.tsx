"use client";
import { T, useLocale } from "@/components/locale-provider";

import Image from "next/image";
import { DepthStage } from "./depth-stage";
import { store } from "@/config/store";
import { Icon } from "./icon";

export function BrandShowcase() { const { t } = useLocale();
  return <aside className="brand-showcase" aria-label={t("AI STORE digital collection")}>
    <span className="showcase-orbit" aria-hidden="true"/>
    <DepthStage><div className="brand-monolith">
      <Image className="logo-dark" src={store.logoDark} alt="AI STORE" width={600} height={600} priority sizes="(max-width: 760px) 75vw, 42vw"/>
      <Image className="logo-light" src={store.logoLight} alt="AI STORE" width={600} height={600} sizes="(max-width: 760px) 75vw, 42vw"/>
    </div></DepthStage>
    <span className="showcase-chip chip-one"><Icon name="chip"/> <T text="AI & automation"/></span>
    <span className="showcase-chip chip-two"><Icon name="layers"/> <T text="Built for your next move"/></span>
    <span className="showcase-caption"><T text="INTELLIGENCE. WITH AN EDGE."/></span>
  </aside>;
}
