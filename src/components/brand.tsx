import Image from "next/image";
import { store } from "@/config/store";
export function Brand() { return <><span className="brand-emblem"><Image className="ai-brand-image logo-dark" src={store.logoDark} alt="" width={64} height={64}/><Image className="ai-brand-image logo-light" src={store.logoLight} alt="" width={64} height={64}/></span><span><b>AI</b> STORE<small className="brand-caption">DIGITAL. INTELLIGENT.</small></span></>; }
