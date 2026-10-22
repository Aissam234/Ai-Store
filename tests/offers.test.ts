import { test } from "node:test";
import assert from "node:assert/strict";
import { seedProducts } from "../prisma/seed-data";
import { localizeProduct, locales } from "../src/i18n/config";
import { offerDetails } from "../src/lib/offer-details";
import { whatsappOrderUrl } from "../src/lib/whatsapp";
import { productSchema } from "../src/lib/validation";

test("catalog contains exactly the eight approved offers with exact prices and terms", () => {
  assert.deepEqual(seedProducts.map(p => [p.name,p.price,p.durationMonths ?? null,p.apiCreditUsd ?? null,p.badge]), [
    ["ChatGPT Plus",119,1,null,"Popular"], ["Claude API $100",140,null,100,"Developer"], ["Claude API $500",490,null,500,"Best Value"],
    ["CapCut Pro",49,1,null,"Creator"], ["Duolingo Super",49,12,null,"1 Year"], ["Netflix Premium",29,1,null,"Entertainment"],
    ["Canva Student",23,36,null,"3 Years"], ["Spotify",50,1,null,"Music"],
  ]);
  assert.equal(seedProducts[6].activation,"Via invitation");
  assert.ok(seedProducts.every(p => p.features.length === 0 && p.oldPrice === undefined));
});
test("each offer renders one exact localized description with a localized full-description fallback", () => {
  for (const p of seedProducts) for (const locale of locales) {
    const suffix = {en:"En",fr:"Fr",ar:"Ar",ma:"Ma"}[locale] as "En"|"Fr"|"Ar"|"Ma";
    const copy=p[`description${suffix}`];
    assert.ok(copy);
    assert.equal(localizeProduct(p,locale).description,copy);
    assert.equal(localizeProduct(p,locale).fullDescription,copy);
    const message=new URL(whatsappOrderUrl([p],locale)).searchParams.get("text")!;
    assert.ok(message.includes(p.name)); assert.ok(message.includes(p.price.toFixed(2)+" MAD"));
    for (const detail of offerDetails(p,locale)) assert.ok(message.includes(detail.label+" : "+detail.value));
  }
  assert.equal(offerDetails(seedProducts[4],"en")[0].value,"1 year");
  assert.equal(offerDetails(seedProducts[6],"en")[0].value,"3 years");
  assert.equal(offerDetails(seedProducts[1],"en")[0].value,"$100 API");
});
test("admin terms validate positive integers, optional fields and unaltered localized descriptions", () => {
  const base={...seedProducts[0],categoryId:"category-1",price:"119",active:true,features:""};
  const parsed=productSchema.parse({...base,durationMonths:"36",apiCreditUsd:"500",activation:"Via invitation"});
  assert.equal(parsed.durationMonths,36); assert.equal(parsed.apiCreditUsd,500); assert.equal(parsed.descriptionAr,base.descriptionAr);
  assert.equal(productSchema.parse({...base,durationMonths:"",apiCreditUsd:""}).durationMonths,null);
  for(const value of ["0","-1","1.5","NaN",true,"9999999999"]) {
    assert.equal(productSchema.safeParse({...base,durationMonths:value}).success,false);
    assert.equal(productSchema.safeParse({...base,apiCreditUsd:value}).success,false);
  }
});
