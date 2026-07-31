import assert from "node:assert/strict";
import test from "node:test";

import { findVariantConflict } from "../lib/variant-validation.ts";

const variants = [
  {
    id: "var_1",
    product_slug: "hotel-towel",
    option1_value: "Large",
    option2_value: "White",
    option3_value: "",
    sku: "PTX-TWL-L-WHT",
    barcode: "100000000001",
  },
];

test("detects option combinations case-insensitively", () => {
  const conflict = findVariantConflict(variants, {
    product_slug: "HOTEL-TOWEL",
    option1_value: " large ",
    option2_value: "white",
    option3_value: "",
  });

  assert.equal(conflict?.field, "options");
});

test("enforces globally unique non-empty SKU and barcode values", () => {
  assert.equal(
    findVariantConflict(variants, { product_slug: "robe", sku: "ptx-twl-l-wht" })
      ?.field,
    "sku"
  );
  assert.equal(
    findVariantConflict(variants, { product_slug: "robe", barcode: "100000000001" })
      ?.field,
    "barcode"
  );
});

test("excludes the current row during updates", () => {
  const conflict = findVariantConflict(variants, variants[0], "var_1");
  assert.equal(conflict, null);
});

test("permits blank SKU and barcode values", () => {
  const conflict = findVariantConflict(variants, {
    product_slug: "hotel-towel",
    option1_value: "Small",
    option2_value: "White",
    sku: "",
    barcode: "",
  });
  assert.equal(conflict, null);
});
