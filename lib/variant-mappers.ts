export type ShopifyCsvRow = Record<string, string>;

function normalizeBoolean(value: string) {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "true" ? "true" : "false";
}

function normalizeStatus(value: string) {
  const normalized = String(value || "").trim().toLowerCase();

  if (
    normalized === "true" ||
    normalized === "active" ||
    normalized === "published"
  ) {
    return "published";
  }

  if (normalized === "archived") {
    return "archived";
  }

  return "draft";
}

function makeVariantId(productSlug: string, row: ShopifyCsvRow, index: number) {
  const sku = String(row["Variant SKU"] || "").trim();
  const option1 = String(row["Option1 Value"] || "").trim();
  const option2 = String(row["Option2 Value"] || "").trim();
  const option3 = String(row["Option3 Value"] || "").trim();

  const base = [productSlug, sku, option1, option2, option3]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || `${productSlug}-variant-${index + 1}`;
}

export function buildVariantRecordsFromShopifyRows(rows: ShopifyCsvRow[]) {
  if (!rows.length) {
    return [];
  }

  return rows
    .filter((row) => {
      const sku = String(row["Variant SKU"] || "").trim();
      const option1 = String(row["Option1 Value"] || "").trim();
      const option2 = String(row["Option2 Value"] || "").trim();
      const option3 = String(row["Option3 Value"] || "").trim();
      const price = String(row["Variant Price"] || "").trim();

      return Boolean(sku || option1 || option2 || option3 || price);
    })
    .map((row, index) => {
      const productSlug = String(row["Handle"] || "").trim();

      return {
        id: makeVariantId(productSlug, row, index),
        product_slug: productSlug,

        option1_name: String(row["Option1 Name"] || "").trim(),
        option1_value: String(row["Option1 Value"] || "").trim(),

        option2_name: String(row["Option2 Name"] || "").trim(),
        option2_value: String(row["Option2 Value"] || "").trim(),

        option3_name: String(row["Option3 Name"] || "").trim(),
        option3_value: String(row["Option3 Value"] || "").trim(),

        sku: String(row["Variant SKU"] || "").trim(),
        barcode: String(row["Variant Barcode"] || "").trim(),

        price: String(row["Variant Price"] || "").trim(),
        compare_at_price: String(row["Variant Compare At Price"] || "").trim(),

        inventory_tracker: String(row["Variant Inventory Tracker"] || "").trim(),
        inventory_policy: String(row["Variant Inventory Policy"] || "").trim(),

        fulfillment_service: String(
          row["Variant Fulfillment Service"] || ""
        ).trim(),

        requires_shipping: normalizeBoolean(
          String(row["Variant Requires Shipping"] || "")
        ),

        taxable: normalizeBoolean(String(row["Variant Taxable"] || "")),

        variant_image: String(row["Variant Image"] || "").trim(),

        weight: String(row["Variant Grams"] || "").trim(),
        weight_unit: "g",

        box_quantity: String(
          row["Box Quantity (product.metafields.wholesale.box_quantity)"] || ""
        ).trim(),

        status: normalizeStatus(
          String(row["Status"] || row["Published"] || "").trim()
        ),

        created_at: "",
        updated_at: "",
      };
    });
}