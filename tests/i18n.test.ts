import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { direction, htmlLanguage, localizeProduct, locales, resolveLocale } from "../src/i18n/config";
import { hasMessage, translate } from "../src/i18n/messages";
import messages from "../src/i18n/messages.json";
import { whatsappOrderUrl } from "../src/lib/whatsapp";
import { productSchema } from "../src/lib/validation";
import { seedProducts } from "../prisma/seed-data";
test("locale validation, BCP47 tags and direction are explicit", () => {
 for (const bad of [undefined, "", "de", "__proto__", "ar;path=/"]) assert.equal(resolveLocale(bad), "en");
 for (const locale of locales) assert.equal(resolveLocale(locale), locale);
 assert.equal(direction("ar"), "rtl"); assert.equal(direction("ma"), "rtl"); assert.equal(direction("fr"), "ltr"); assert.equal(direction("en"), "ltr"); assert.equal(htmlLanguage("ma"), "ary");
});
test("product translation fallback preserves originals and works across locale changes", () => {
 const original = { name: "Original", description: "Original description", nameFr: "Français", descriptionAr: "وصف عربي", price: 100 };
 assert.equal(localizeProduct(original, "fr").name, "Français");
 assert.equal(localizeProduct(original, "ar").description, "وصف عربي");
 assert.equal(localizeProduct(original, "ma").name, "Original");
 assert.equal(localizeProduct(localizeProduct(original, "fr"), "en").name, "Original");
 assert.equal(localizeProduct({...original,nameEn:"English",nameMa:"  "}, "ma").name, "English");
 assert.equal(original.name, "Original");
});
test("translation mutations accept four languages, reject oversized values and preserve absent fields", () => {
 const base = {...seedProducts[0], categoryId:"category-1", price:"100.25", active:true, features:"Useful feature"};
 const translated = productSchema.parse({...base,nameAr:"اسم المنتج",descriptionMa:"وصف المنتوج بالدارجة",nameFr:"",descriptionEn:"English description"});
 assert.equal(translated.nameAr,"اسم المنتج"); assert.equal(translated.nameFr,null); assert.equal(translated.nameEn,undefined);
 assert.equal(productSchema.safeParse({...base,nameFr:"a".repeat(121)}).success,false);
 assert.equal(productSchema.safeParse({...base,descriptionAr:"a".repeat(501)}).success,false);
});
test("all dictionaries have complete translations and matching placeholders", () => {
 for(const [key, entries] of Object.entries(messages)) for(const locale of ["fr","ar","ma"] as const) {
  assert.ok(entries[locale].trim(), key+" / "+locale);
  assert.deepEqual(entries[locale].match(/\{\w+\}/g)?.sort() || [], key.match(/\{\w+\}/g)?.sort() || [], key);
 }
 assert.equal(translate("fr","{count} products",{count:1}),"1 produit");
 assert.equal(translate("ma","Unknown custom category"),"Unknown custom category");
});
test("WhatsApp messages retain exact MAD prices and recipient in every language", () => {
 const product={name:"Base & +",description:"Base",nameFr:"Français & +",nameAr:"عربي",nameMa:"دارجة",price:100.25};
 for(const locale of locales) {
  const url=new URL(whatsappOrderUrl([product],locale)); const text=url.searchParams.get("text")!;
  assert.equal(url.hostname,"wa.me"); assert.equal(url.pathname,"/212607144420");
  assert.ok(text.includes(localizeProduct(product,locale).name)); assert.ok(text.includes("100.25 MAD"));
  assert.ok(text.startsWith(translate(locale,"Hello, I would like to order:")));
 }
});
test("static storefront translation references are present in the shared catalog", () => {
 function walk(dir:string):string[] {return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory() ? (e.name==='admin'||e.name==='api'?[]:walk(join(dir,e.name))) : e.name.endsWith('.tsx')?[join(dir,e.name)]:[]);}
 const files=[...walk('src/app'),...walk('src/components')]; const missing=new Set<string>();
 for(const file of files){const source=readFileSync(file,'utf8');const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  function visit(node:ts.Node){
   if(ts.isJsxAttribute(node)&&['text','eyebrow'].includes(node.name.getText(tree))&&node.initializer&&ts.isStringLiteral(node.initializer)&&!hasMessage(node.initializer.text))missing.add(node.initializer.text);
   if(ts.isJsxOpeningElement(node)&&node.tagName.getText(tree)==='PageIntro')for(const attr of node.attributes.properties)if(ts.isJsxAttribute(attr)&&attr.name.getText(tree)==='title'&&attr.initializer&&ts.isStringLiteral(attr.initializer)&&!hasMessage(attr.initializer.text))missing.add(attr.initializer.text);
   if(ts.isCallExpression(node)&&['t','pageMetadata'].includes(node.expression.getText(tree))&&node.arguments[0]&&ts.isStringLiteral(node.arguments[0])&&!hasMessage(node.arguments[0].text))missing.add(node.arguments[0].text);
   ts.forEachChild(node,visit);
  }visit(tree);
 }assert.deepEqual([...missing],[]);
});
