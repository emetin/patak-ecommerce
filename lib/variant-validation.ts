export type VariantRecord = Record<string, string>;

export function normalizeVariantValue(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

export function findVariantConflict(
  variants: VariantRecord[],
  candidate: VariantRecord,
  excludeId = ""
) {
  const candidateId = normalizeVariantValue(excludeId);
  const productSlug = normalizeVariantValue(candidate.product_slug);
  const sku = normalizeVariantValue(candidate.sku);
  const barcode = normalizeVariantValue(candidate.barcode);
  const optionKey = [
    candidate.option1_value,
    candidate.option2_value,
    candidate.option3_value,
  ]
    .map(normalizeVariantValue)
    .join("|");

  for (const item of variants) {
    if (candidateId && normalizeVariantValue(item.id) === candidateId) continue;

    if (sku && normalizeVariantValue(item.sku) === sku) {
      return { field: "sku", message: "This SKU is already in use." };
    }

    if (barcode && normalizeVariantValue(item.barcode) === barcode) {
      return { field: "barcode", message: "This barcode is already in use." };
    }

    const existingOptionKey = [
      item.option1_value,
      item.option2_value,
      item.option3_value,
    ]
      .map(normalizeVariantValue)
      .join("|");

    if (
      normalizeVariantValue(item.product_slug) === productSlug &&
      existingOptionKey === optionKey
    ) {
      return {
        field: "options",
        message: "A variant with the same option combination already exists.",
      };
    }
  }

  return null;
}
