import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { readThemeImages } from "../src/server/theme-images";

test("theme uploads preserve absent images and remove only the selected variant", async () => {
 assert.deepEqual(await readThemeImages(new FormData()), {});
 const form = new FormData(); form.set("removeDarkImage", "on");
 assert.deepEqual(await readThemeImages(form), {imageDarkData: null, hasDarkImage: false});
});
test("both theme images normalize to WebP and uploads take precedence over removal", async () => {
 const png = await sharp({create:{width:2,height:2,channels:4,background:"red"}}).png().toBuffer();
 const form = new FormData();
 for (const theme of ["Dark", "Light"]) { form.set(`image${theme}`, new File([new Uint8Array(png)], "theme.png", {type:"image/png"})); form.set(`remove${theme}Image`,"on"); }
 const result = await readThemeImages(form);
 assert.equal(result.hasDarkImage,true); assert.equal(result.hasLightImage,true);
 assert.equal((await sharp(result.imageDarkData!).metadata()).format,"webp");
 assert.equal((await sharp(result.imageLightData!).metadata()).format,"webp");
});
test("theme images reject invalid content and oversized uploads", async () => {
 for (const file of [new File(["invalid"],"bad.png",{type:"image/png"}),new File([new Uint8Array(3*1024*1024+1)],"large.png",{type:"image/png"})]) {
 const form = new FormData(); form.set("imageLight",file);
 await assert.rejects(readThemeImages(form),/Invalid theme image/);
 }
});
