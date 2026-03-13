import { parseCsv } from "./parsers/csv";
import {
  appendSheetRows,
  getSheetData,
  getSheetHeaders,
  getSheetRowNumberMapByField,
  updateSheetRowByRowNumber,
  deleteSheetRowsByField,
} from "./sheets";
import { buildProductRecordFromShopifyRows } from "./product-mappers";
import { buildVariantRecordsFromShopifyRows } from "./variant-mappers";

const PRODUCT_HEADERS = [
  "id",
  "title",
  "slug",
  "description",
  "short_description",
  "image",
  "gallery",
  "collection_slug",
  "status",
  "featured",
  "seo_title",
  "seo_description",
  "created_at",
  "updated_at",
] as const;

const VARIANT_HEADERS = [
  "id",
  "product_slug",
  "option1_name",
  "option1_value",
  "option2_name",
  "option2_value",
  "option3_name",
  "option3_value",
  "sku",
  "barcode",
  "price",
  "compare_at_price",
  "inventory_tracker",
  "inventory_policy",
  "fulfillment_service",
  "requires_shipping",
  "taxable",
  "variant_image",
  "weight",
  "weight_unit",
  "box_quantity",
  "status",
  "created_at",
  "updated_at",
] as const;

type ShopifyCsvRow = Record<string, string>;

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function objectToRow(headers: readonly string[], item: Record<string, string>) {
  return headers.map((header) => String(item[header] ?? ""));
}

function rowsToObjects(rows: string[][]) {
  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) => String(header).trim());

  return rows.slice(1).map((row) => {
    const item: Record<string, string> = {};

    headers.forEach((header, index) => {
      item[header] = String(row[index] ?? "").trim();
    });

    return item;
  });
}

function validateHeaders(actualHeaders: string[], expectedHeaders: readonly string[], sheetName: string) {
  const actual = actualHeaders.join("|");
  const expected = [...expectedHeaders].join("|");

  if (actual !== expected) {
    throw new Error(
      `Sheet headers mismatch for "${sheetName}". Expected: ${expectedHeaders.join(", ")}`
    );
  }
}

function normalizeProductRecord(
  incoming: Record<string, string>,
  existing?: Record<string, string>
) {
  const now = nowIso();

  return {
    id: incoming.id || existing?.id || makeId(),
    title: incoming.title || existing?.title || "",
    slug: incoming.slug || existing?.slug || "",
    description: incoming.description || existing?.description || "",
    short_description:
      incoming.short_description || existing?.short_description || "",
    image: incoming.image || existing?.image || "",
    gallery: incoming.gallery || existing?.gallery || "",
    collection_slug: incoming.collection_slug || existing?.collection_slug || "",
    status: incoming.status || existing?.status || "draft",
    featured: incoming.featured || existing?.featured || "false",
    seo_title: incoming.seo_title || existing?.seo_title || "",
    seo_description: incoming.seo_description || existing?.seo_description || "",
    created_at: existing?.created_at || incoming.created_at || now,
    updated_at: now,
  };
}

function normalizeVariantRecord(
  incoming: Record<string, string>,
  existing?: Record<string, string>
) {
  const now = nowIso();

  return {
    id: incoming.id || existing?.id || makeId(),
    product_slug: incoming.product_slug || existing?.product_slug || "",
    option1_name: incoming.option1_name || existing?.option1_name || "",
    option1_value: incoming.option1_value || existing?.option1_value || "",
    option2_name: incoming.option2_name || existing?.option2_name || "",
    option2_value: incoming.option2_value || existing?.option2_value || "",
    option3_name: incoming.option3_name || existing?.option3_name || "",
    option3_value: incoming.option3_value || existing?.option3_value || "",
    sku: incoming.sku || existing?.sku || "",
    barcode: incoming.barcode || existing?.barcode || "",
    price: incoming.price || existing?.price || "",
    compare_at_price: incoming.compare_at_price || existing?.compare_at_price || "",
    inventory_tracker: incoming.inventory_tracker || existing?.inventory_tracker || "",
    inventory_policy: incoming.inventory_policy || existing?.inventory_policy || "",
    fulfillment_service:
      incoming.fulfillment_service || existing?.fulfillment_service || "",
    requires_shipping:
      incoming.requires_shipping || existing?.requires_shipping || "false",
    taxable: incoming.taxable || existing?.taxable || "false",
    variant_image: incoming.variant_image || existing?.variant_image || "",
    weight: incoming.weight || existing?.weight || "",
    weight_unit: incoming.weight_unit || existing?.weight_unit || "",
    box_quantity: incoming.box_quantity || existing?.box_quantity || "",
    status: incoming.status || existing?.status || "draft",
    created_at: existing?.created_at || incoming.created_at || now,
    updated_at: now,
  };
}

function groupRowsByHandle(items: ShopifyCsvRow[]) {
  const map = new Map<string, ShopifyCsvRow[]>();

  for (const item of items) {
    const handle = String(item["Handle"] || "").trim();

    if (!handle) {
      continue;
    }

    const current = map.get(handle) || [];
    current.push(item);
    map.set(handle, current);
  }

  return map;
}

function parseShopifyCsvText(text: string) {
  const rows = parseCsv(text);

  if (!rows.length) {
    throw new Error("CSV file is empty.");
  }

  const objects = rowsToObjects(rows);

  if (!objects.length) {
    throw new Error("CSV contains no product rows.");
  }

  return objects;
}

export async function importShopifyCsv(text: string) {
  const productHeaders = await getSheetHeaders("products", { forceFresh: true });
  const variantHeaders = await getSheetHeaders("product_variants", {
    forceFresh: true,
  });

  validateHeaders(productHeaders, PRODUCT_HEADERS, "products");
  validateHeaders(variantHeaders, VARIANT_HEADERS, "product_variants");

  const parsedRows = parseShopifyCsvText(text);
  const grouped = groupRowsByHandle(parsedRows);

  const existingProducts = await getSheetData("products", { forceFresh: true });
  const productRowMap = await getSheetRowNumberMapByField("products", "slug");

  const existingProductsBySlug = new Map<string, Record<string, string>>();
  for (const item of existingProducts) {
    const slug = String(item.slug || "").trim().toLowerCase();
    if (slug) {
      existingProductsBySlug.set(slug, item);
    }
  }

  let insertedProducts = 0;
  let updatedProducts = 0;
  let insertedVariants = 0;
  const errors: string[] = [];

  for (const [handle, handleRows] of grouped.entries()) {
    try {
      const baseProduct = buildProductRecordFromShopifyRows(handleRows);
      const variantRecords = buildVariantRecordsFromShopifyRows(handleRows);

      const existingProduct = existingProductsBySlug.get(handle.toLowerCase());
      const normalizedProduct = normalizeProductRecord(baseProduct, existingProduct);
      const productRow = objectToRow(PRODUCT_HEADERS, normalizedProduct);

      if (existingProduct) {
        const rowNumber = productRowMap.get(handle.toLowerCase());

        if (!rowNumber) {
          throw new Error(`Product row was not found for slug "${handle}".`);
        }

        await updateSheetRowByRowNumber("products", rowNumber, productRow);
        updatedProducts += 1;
      } else {
        await appendSheetRows("products", [productRow]);
        insertedProducts += 1;
      }

      await deleteSheetRowsByField("product_variants", "product_slug", handle);

      if (variantRecords.length) {
        const normalizedVariantRows = variantRecords.map((variant) => {
          const normalized = normalizeVariantRecord(variant);
          return objectToRow(VARIANT_HEADERS, normalized);
        });

        await appendSheetRows("product_variants", normalizedVariantRows);
        insertedVariants += normalizedVariantRows.length;
      }
    } catch (error) {
      errors.push(
        `Handle "${handle}": ${
          error instanceof Error ? error.message : "Unknown Shopify import error."
        }`
      );
    }
  }

  return {
    ok: true,
    insertedProducts,
    updatedProducts,
    insertedVariants,
    groupedProducts: grouped.size,
    errors,
  };
}