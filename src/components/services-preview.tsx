import Link from "next/link";
import { T } from "./locale-provider";
import styles from "./services-preview.module.css";
export function ServicesPreview() {
 return <section className={"container section " + styles.preview}><div><span className="eyebrow"><T text="Software Services"/></span><h2><T text="From your first website to your next custom tool."/></h2></div><Link href="/software-services" className="button secondary"><T text="Explore Services"/><span aria-hidden="true">↗</span></Link></section>;
}
