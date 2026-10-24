import test from "node:test";
import assert from "node:assert/strict";
import { saveProductWithFeedback } from "../src/lib/product-save-feedback";

test("upload transport failures return inline feedback without throwing or exposing internals", async () => {
 const form = new FormData(); form.set("name", "Duolingo Super");
 const result = await saveProductWithFeedback(async () => { throw new Error("private server diagnostic"); }, {}, form);
 assert.ok(result.error?.includes("Your edits are still here"));
 assert.ok(!result.error?.includes("private server diagnostic"));
 assert.equal(form.get("name"), "Duolingo Super");
});
test("product validation feedback and successful saves pass through", async () => {
 const state = {error:"Invalid image"};
 assert.equal(await saveProductWithFeedback(async () => state, {}, new FormData()), state);
 assert.deepEqual(await saveProductWithFeedback(async () => ({}), {}, new FormData()), {});
});
test("save and authentication navigation signals are not swallowed", async () => {
 for (const digest of ["NEXT_REDIRECT;replace;/admin/products;303;", "NEXT_HTTP_ERROR_FALLBACK;404"]) {
 const signal = {digest};
 await assert.rejects(saveProductWithFeedback(async () => {throw signal;}, {}, new FormData()), error => error === signal);
 }
});
