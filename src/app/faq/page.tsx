import { Icon } from "@/components/icon";
import Link from "next/link";
import { FaqList, PageIntro } from "@/components/ui";
import { faqs } from "@/data/faqs";
export const metadata = { title: "Frequently asked questions" };
export default function FaqPage() { return <div className="container narrow page-space"><PageIntro eyebrow="A LITTLE CLARITY" title="Good questions. Straight answers.">Everything you need to know about the collection and this preview.</PageIntro><FaqList items={faqs}/><div className="panel support-prompt"><h2>Still have something in mind?</h2><p>Find contact information and help on our support page.</p><Link className="button secondary" href="/support">Visit support <Icon name="arrow"/></Link></div></div>; }

