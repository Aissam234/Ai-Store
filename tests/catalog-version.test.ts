import test from "node:test";
import assert from "node:assert/strict";
import { catalogVersion } from "../src/lib/catalog-version";
test("catalog revision detects edits, visibility/removal, additions and category changes", () => {
  const a = { id: "a", updatedAt: new Date("2026-01-01") };
  const b = { id: "b", updatedAt: new Date("2026-01-02") };
  const original = catalogVersion([a, b], [a]);
  assert.equal(original, catalogVersion([b, a], [a]));
  assert.notEqual(original, catalogVersion([{ ...a, updatedAt: b.updatedAt }, b], [a]));
  assert.notEqual(original, catalogVersion([a], [a]));
  assert.notEqual(original, catalogVersion([a, b, { ...a, id: "c" }], [a]));
  assert.notEqual(original, catalogVersion([a, b], [b]));
  assert.match(original, /^[a-f0-9]{64}$/);
});
