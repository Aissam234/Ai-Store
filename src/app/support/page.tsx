import { Icon } from "@/components/icon";
import Link from "next/link";
import { PageIntro } from "@/components/ui";
import { SupportForm } from "@/components/support-form";
import { store } from "@/config/store";
export const metadata = { title: "Support" };
export default function SupportPage() { return <div className="container page-space"><PageIntro eyebrow="HERE TO HELP" title="Let’s make things clearer.">Questions about a product or the store? Start here.</PageIntro><div className="support-layout"><div><div className="panel"><span className="category-symbol"><Icon name="arrow"/></span><h2>A direct line.</h2><p>For product questions, licensing details, or feedback about the experience.</p><a className="button primary" href={`https://wa.me/${store.whatsappNumber}`} target="_blank" rel="noopener noreferrer">Contact us on WhatsApp <Icon name="arrow"/></a></div><div className="support-prompt"><h3>A quick answer might be here.</h3><p>Explore the most common questions about products and ordering.</p><Link href="/faq" className="text-link">Read the FAQ <Icon name="right"/></Link></div></div><section className="panel"><h2>Prepare a message</h2><SupportForm/></section></div></div>; }
