import test from "node:test";
import assert from "node:assert/strict";
import { googleIdentity } from "../src/lib/google-identity";
const nonce = "a".repeat(64);
const claims = { sub: "123", email: "Person@example.com", email_verified: true, nonce };
test("Google identity binds the verified email and stable subject to the browser challenge", () => {
  assert.deepEqual(googleIdentity(claims, nonce), { email: "person@example.com", googleSub: "123", name: "person" });
  for (const change of [{ email_verified: false }, { sub: "" }, { nonce: "b".repeat(64) }, { email: "" }]) {
    assert.equal(googleIdentity({ ...claims, ...change }, nonce), null);
  }
});

import { authDestination } from "../src/lib/auth-destination";
test("return destinations remain on the store and avoid authentication loops", () => {
  for (const input of ["https://evil.test", "//evil.test", "/\\evil.test", "/login?next=/account", "/register", "javascript:alert(1)", null]) {
    assert.equal(authDestination(input), "/account");
  }
  assert.equal(authDestination("/checkout?review=1#details"), "/checkout?review=1#details");
});
