import Image from "next/image";
import { DepthStage } from "./depth-stage";
import { store } from "@/config/store";
import { Icon } from "./icon";

export function BrandShowcase() {
  return <aside className="brand-showcase" aria-label="AI STORE digital collection">
    <span className="showcase-orbit" aria-hidden="true"/>
    <DepthStage><div className="brand-monolith">
      <Image className="logo-dark" src={store.logoDark} alt="AI STORE" width={600} height={600} priority sizes="(max-width: 760px) 75vw, 42vw"/>
      <Image className="logo-light" src={store.logoLight} alt="AI STORE" width={600} height={600} sizes="(max-width: 760px) 75vw, 42vw"/>
    </div></DepthStage>
    <span className="showcase-chip chip-one"><Icon name="chip"/> AI & automation</span>
    <span className="showcase-chip chip-two"><Icon name="layers"/> Built for your next move</span>
    <span className="showcase-caption">INTELLIGENCE. WITH AN EDGE.</span>
  </aside>;
}
