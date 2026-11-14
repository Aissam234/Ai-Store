import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/skeleton";
import { DepthStage } from '@/components/depth-stage';
import { Icon } from '@/components/icon';
import { ServiceImage } from '@/components/service-image';
import { serviceImageSources } from '@/server/service-images';
import { connection } from 'next/server';
import { T } from "@/components/locale-provider";
import { getLocale } from "@/i18n/server";
import { translate } from "@/i18n/messages";
import { services, serviceFaqs } from "@/data/software-services";
import { ProjectInquiryForm } from "@/components/project-inquiry-form";
import "./services.css";

export async function generateMetadata() {
 const locale = await getLocale();
 const title = translate(locale, "Software Services");
 const description = translate(locale, "From modern websites to custom software and technical mentorship, we help turn ambitious ideas into reliable digital experiences.");
 return { title, description, openGraph: { title: title + " | AI STORE", description } };
}

function ServiceShowcase({ service, src }: { service: typeof services[number]; src?:string }) {
 return <DepthStage card><article className={"studio-service studio-service-" + service.id} id={"service-" + service.id} aria-labelledby={"service-title-" + service.id}>
  <ServiceImage id={service.id} src={src} name={service.name}/>
  <div className="studio-service-copy"><span className="studio-number" aria-hidden="true">0{service.id} /</span>
   <h3 id={"service-title-" + service.id} className="studio-service-title"><T text={service.name}/></h3><p><T text={service.description}/></p>
   <ul>{service.capabilities.map(capability => <li key={capability}><T text={capability}/></li>)}</ul>
   <a className="button secondary" href={"#inquiry-" + service.id}><T text={service.cta}/><Icon name="arrow" className="studio-arrow"/></a>
  </div>
 </article></DepthStage>;
}

async function SoftwareServicesContent() {
 await connection();
 const sources=await serviceImageSources();
 const steps = [
  ["Discovery", "Understand your idea, objectives and requirements."],
  ["Planning", "Define scope, architecture, priorities and approach."],
  ["Development", "Build through iterative reviews and clear communication."],
  ["Review & Delivery", "Test, refine and prepare the agreed deliverables."],
 ];
 return <div className="container page-space services-page">
  <section className="studio-hero">
   <div className="studio-hero-copy"><span className="eyebrow"><T text="Software Services"/></span>
    <h1><span className="intro-shine"><T text="Your Idea."/></span><br/><span className="intro-shine intro-shine-accent"><T text="Our Engineering."/></span></h1>
    <p><T text="From modern websites to custom software and technical mentorship, we help turn ambitious ideas into reliable digital experiences."/></p>
    <div className="button-row"><a href="#project-inquiry" className="button primary"><T text="Discuss Your Project"/></a><a href="#services" className="studio-link"><T text="Explore Services"/><span aria-hidden="true">↓</span></a></div>
   </div>
  </section>
  <section id="services" className="studio-section">
   <div className="studio-section-heading"><h2><T text="One clear brief. The right solution."/></h2></div>
   <div className="studio-services">{services.map(service => <ServiceShowcase key={service.id} service={service} src={sources[service.id]}/>)}</div>
  </section>
  <section className="studio-section studio-work">
   <div className="studio-section-heading"><span className="eyebrow"><T text="How we work"/></span><h2><T text="Start with a conversation."/></h2></div>
   <ol>{steps.map(([title,description],index) => <li key={title}><span aria-hidden="true">0{index+1}</span><h3><T text={title}/></h3><p><T text={description}/></p></li>)}</ol>
   <p className="studio-work-note"><T text="For mentorship, these steps become a shared learning plan, guided practice and a review of your progress."/></p>
  </section>
  <div className="studio-section studio-inquiry"><div className="studio-inquiry-copy"><span className="eyebrow"><T text="Request a Quote"/></span><h2 id="studio-inquiry-title"><T text="Have something in mind?"/></h2><p><T text="Your details are only shared when you send the message on WhatsApp. Do not include passwords or private credentials."/></p></div><ProjectInquiryForm/></div>
  <section className="studio-section studio-faq"><h2><T text="A few things before we begin."/></h2><div>{serviceFaqs.map(item => <details key={item.question}><summary><T text={item.question}/><span aria-hidden="true">+</span></summary><p><T text={item.answer}/></p></details>)}</div></section>
 </div>;
}

export default function SoftwareServices() {
 return <Suspense fallback={<div className="container page-space"><ProductGridSkeleton count={5}/></div>}><SoftwareServicesContent/></Suspense>;
}
