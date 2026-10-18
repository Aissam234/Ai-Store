import { pageMetadata } from "@/i18n/server";
import { T } from "@/components/locale-provider";
import { Icon } from "@/components/icon";
import Link from "next/link";
import { FaqList, PageIntro } from "@/components/ui";
import { faqs } from "@/data/faqs";
export async function generateMetadata() { return pageMetadata("Frequently asked questions"); }
export default function FaqPage() { return <div className="container narrow page-space"><PageIntro eyebrow="A LITTLE CLARITY" title="Good questions. Straight answers."><T text="Everything you need to know about the collection and this preview."/></PageIntro><FaqList items={faqs}/><div className="panel support-prompt"><h2><T text="Still have something in mind?"/></h2><p><T text="Find contact information and help on our support page."/></p><Link className="button secondary" href="/support"><T text="Visit support"/> <Icon name="arrow"/></Link></div></div>; }

