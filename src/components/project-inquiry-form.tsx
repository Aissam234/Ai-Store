"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale } from "./locale-provider";
import { services, projectStatuses, budgetRanges } from "@/data/software-services";
import { inquirySchema, inquiryLabels, serviceInquiryMessage, serviceInquiryUrl, type ServiceInquiry } from "@/lib/service-inquiry";

export function ProjectInquiryForm() {
 const { t, locale } = useLocale();
 const [service, setService] = useState("1");
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [prepared, setPrepared] = useState<ServiceInquiry | null>(null);
 const result = useRef<HTMLDivElement>(null);
 const selection = useRef<HTMLSelectElement>(null);
 const mentorship = service === "4";

 useEffect(() => {
  function selectFromLink(hash = location.hash) {
   const match = services.find(item => hash === "#inquiry-" + item.id);
   if (match) {
    setService(match.id);
    setPrepared(null);
    document.getElementById("project-inquiry")?.scrollIntoView();
    selection.current?.focus({ preventScroll: true });
   }
  }
  selectFromLink();
  const onHashChange = () => selectFromLink();
  const onClick = (event: MouseEvent) => {
   const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#inquiry-"]') : null;
   if (anchor) selectFromLink(anchor.hash);
  };
  window.addEventListener("hashchange", onHashChange);
  document.addEventListener("click", onClick);
  return () => {
   window.removeEventListener("hashchange", onHashChange);
   document.removeEventListener("click", onClick);
  };
 }, []);
 useEffect(() => { if (prepared) result.current?.focus(); }, [prepared]);

 function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  if (data.get("website")) return;
  const parsed = inquirySchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) {
   const next: Record<string, string> = {};
   for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.code === "custom" ? "Check this field." : issue.message;
   setErrors(next);
   setPrepared(null);
   form.querySelector<HTMLElement>('[name="' + Object.keys(next)[0] + '"]')?.focus();
   return;
  }
  setErrors({});
  setPrepared(parsed.data);
 }
 function feedback(name: string) {
  return errors[name] ? <small id={"error-" + name} role="alert">{t(errors[name])}</small> : null;
 }
 function attrs(name: keyof typeof inquiryLabels) {
  return { name, id: "inquiry-" + name, "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? "error-" + name : undefined };
 }

 return <section id="project-inquiry" aria-labelledby="studio-inquiry-title">
  {services.map(item => <span key={item.id} id={"inquiry-" + item.id} className="studio-inquiry-anchor" aria-hidden="true"/>)}
  <form className="form" noValidate onSubmit={submit} onChange={() => setPrepared(null)}>
   <div hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
   <div className="services-fields">
    <label className="services-wide">{t(inquiryLabels.service)}
     <select ref={selection} {...attrs("service")} value={service} onChange={event => setService(event.target.value)}>
      {services.map(item => <option key={item.id} value={item.id}>{t(item.name)}</option>)}<option value="other">{t("Other")}</option>
     </select>{feedback("service")}
    </label>
    <label className="services-wide">{t(inquiryLabels.title)}<input {...attrs("title")} dir="auto" required minLength={2} maxLength={100}/>{feedback("title")}</label>
    <label className="services-wide">{t(inquiryLabels.description)}<textarea {...attrs("description")} dir="auto" required minLength={20} maxLength={2000} rows={5}/>{feedback("description")}</label>
    <label className="services-wide">{t(mentorship ? "What would you like to understand or improve?" : inquiryLabels.help)}
     <textarea {...attrs("help")} dir="auto" maxLength={800} rows={3}/>{feedback("help")}
    </label>
    <label>{t(inquiryLabels.status)}<select {...attrs("status")}>{projectStatuses.map(value => <option value={value} key={value}>{t(value)}</option>)}</select>{feedback("status")}</label>
    <label>{t(inquiryLabels.budget)}<select {...attrs("budget")}>{budgetRanges.map(value => <option value={value} key={value}>{t(value)}</option>)}</select>{feedback("budget")}</label>
    <label>{t(inquiryLabels.timeframe)}<input {...attrs("timeframe")} dir="auto" maxLength={100}/>{feedback("timeframe")}</label>
    <label>{t(inquiryLabels.contact)}<input {...attrs("contact")} dir="auto" maxLength={200}/>{feedback("contact")}</label>
   </div>
   <button className="button primary">{t("Discuss My Project")}</button>
  </form>
  {prepared && <div ref={result} tabIndex={-1} className="services-result" aria-label={t("Your message is ready. Review it, then send it in WhatsApp.")}>
   <p role="status">{t("Your message is ready. Review it, then send it in WhatsApp.")}</p>
   <pre dir="auto">{serviceInquiryMessage(prepared, locale)}</pre>
   <a className="button primary" href={serviceInquiryUrl(prepared, locale)} target="_blank" rel="noopener noreferrer">{t("Open WhatsApp")}</a>
   <button className="studio-link" type="button" onClick={() => { setPrepared(null); selection.current?.focus(); }}>{t("Edit request")}</button>
  </div>}
 </section>;
}
