import assert from "node:assert/strict";
import test from "node:test";

import { findDuplicateImportSlugs } from "../lib/import/batch-validation.ts";

test("finds duplicate slugs case-insensitively with CSV row numbers", () => {
  const duplicates = findDuplicateImportSlugs([
    { slug: "hotel-towel" },
    { slug: "bathrobe" },
    { slug: " Hotel-Towel " },
  ]);

  assert.deepEqual(duplicates, [
    { slug: "hotel-towel", firstRow: 2, duplicateRow: 4 },
  ]);
});

test("ignores blank slugs because title-based generation happens later", () => {
  assert.deepEqual(findDuplicateImportSlugs([{ title: "A" }, { title: "B" }]), []);
});
