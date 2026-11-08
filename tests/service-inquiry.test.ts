import { test } from "node:test";
import assert from "node:assert/strict";
import { inquirySchema, serviceInquiryMessage, serviceInquiryUrl } from "../src/lib/service-inquiry";
import { services, serviceFaqs } from "../src/data/software-services";
import { locales } from "../src/i18n/config";
import { translate } from "../src/i18n/messages";
import messages from "../src/i18n/messages.json";
import { store } from "../src/config/store";
const valid = {service:"4",title:"Mon projet & بحث",description:"A project description with enough detail.\nSecond line.",status:"Already started",help:"Explain authentication",timeframe:"",budget:"Discuss together",contact:""};
test("inquiries validate required details, allow optional contact and reject invalid services and oversized input", () => {
 assert.equal(inquirySchema.safeParse(valid).success,true);
 for (const patch of [{title:""},{description:"short"},{service:"999"},{status:"invalid"},{contact:"x".repeat(201)},{help:"x".repeat(801)}]) assert.equal(inquirySchema.safeParse({...valid,...patch}).success,false);
});
test("WhatsApp preserves entered text, line breaks and the chosen localized service across languages", () => {
 for(const locale of locales) {
  const text=serviceInquiryMessage(valid,locale);
  assert.ok(text.includes(valid.title)); assert.ok(text.includes(valid.description));
  assert.ok(text.includes(translate(locale,services[3].name)));
  const url=new URL(serviceInquiryUrl(valid,locale));
  assert.equal(url.pathname,"/"+store.whatsappNumber); assert.equal(url.searchParams.get("text"),text);
  assert.ok(text.includes("\n\n")); assert.ok(!text.includes("undefined"));
 }
});
test("each service, capability and FAQ has complete localized content", () => {
 const dictionary=messages as Record<string,Record<string,string>>;
 for(const text of [...services.flatMap(s=>[s.name,s.description,s.cta,...s.capabilities]),...serviceFaqs.flatMap(f=>[f.question,f.answer])]) for(const locale of ["fr","ar","ma"]) assert.ok(dictionary[text]?.[locale],text+" "+locale);
});
