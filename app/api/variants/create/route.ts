import { NextResponse } from "next/server";
import { appendSheetRow, getSheetData } from "../../../../lib/sheets";

type VariantRecord = {
  id?: string;
  product_slug?: string;
  option1_name?: string;
  option1_value?: string;
  option2_name?: string;
  option2_value?: string;
  option3_name?: string;
  option3_value?: string;
  sku?: string;
  barcode?: string;
  price?: string;
  compare_at_price?: string;
  inventory_tracker?: string;
  inventory_policy?: string;
  fulfillment_service?: string;
  requires_shipping?: string;
  taxable?: string;
  variant_image?: string;
  weight?: string;
  weight_unit?: string;
  box_quantity?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

const SHEET_NAME = "product_variants";
const ALLOWED_STATUS = ["published", "draft", "archived"];

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeSlug(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function normalizeStatus(value: unknown) {
  return String(value || "published").trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const productSlug = normalizeSlug(body?.product_slug);
    const option1Name = normalizeText(body?.option1_name) || "Default";
    const option1Value = normalizeText(body?.option1_value) || "Default";
    const option2Name = normalizeText(body?.option2_name);
    const option2Value = normalizeText(body?.option2_value);
    const option3Name = normalizeText(body?.option3_name);
    const option3Value = normalizeText(body?.option3_value);
    const sku = normalizeText(body?.sku);
    const barcode = normalizeText(body?.barcode);
    const price = normalizeText(body?.price);
    const compareAtPrice = normalizeText(body?.compare_at_price);
    const inventoryTracker = normalizeText(body?.inventory_tracker) || "none";
    const inventoryPolicy = normalizeText(body?.inventory_policy) || "deny";
    const fulfillmentService = normalizeText(body?.fulfillment_service) || "manual";
    const requiresShipping = normalizeText(body?.requires_shipping) || "true";
    const taxable = normalizeText(body?.taxable) || "true";
    const variantImage = normalizeText(body?.variant_image);
    const weight = normalizeText(body?.weight);
    const weightUnit = normalizeText(body?.weight_unit) || "kg";
    const boxQuantity = normalizeText(body?.box_quantity);
    const status = normalizeStatus(body?.status);

    if (!productSlug) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product slug is required.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUS.includes(status)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Status must be one of: "published", "draft", or "archived".',
        },
        { status: 400 }
      );
    }

    const existingVariants = (await getSheetData(SHEET_NAME)) as VariantRecord[];

    const duplicate = existingVariants.some((item) => {
      return (
        normalizeSlug(item.product_slug) === productSlug &&
        normalizeText(item.option1_value).toLowerCase() ===
          option1Value.toLowerCase() &&
        normalizeText(item.option2_value).toLowerCase() ===
          option2Value.toLowerCase() &&
        normalizeText(item.option3_value).toLowerCase() ===
          option3Value.toLowerCase()
      );
    });

    if (duplicate) {
      return NextResponse.json(
        {
          ok: false,
          error: "A variant with the same option combination already exists.",
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const id = `var_${Date.now()}`;

    await appendSheetRow(SHEET_NAME, [
      id,
      productSlug,
      option1Name,
      option1Value,
      option2Name,
      option2Value,
      option3Name,
      option3Value,
      sku,
      barcode,
      price,
      compareAtPrice,
      inventoryTracker,
      inventoryPolicy,
      fulfillmentService,
      requiresShipping,
      taxable,
      variantImage,
      weight,
      weightUnit,
      boxQuantity,
      status,
      now,
      now,
    ]);

    return NextResponse.json(
      {
        ok: true,
        message: "Variant created successfully.",
        item: {
          id,
          product_slug: productSlug,
          option1_name: option1Name,
          option1_value: option1Value,
          option2_name: option2Name,
          option2_value: option2Value,
          option3_name: option3Name,
          option3_value: option3Value,
          sku,
          barcode,
          price,
          compare_at_price: compareAtPrice,
          inventory_tracker: inventoryTracker,
          inventory_policy: inventoryPolicy,
          fulfillment_service: fulfillmentService,
          requires_shipping: requiresShipping,
          taxable,
          variant_image: variantImage,
          weight,
          weight_unit: weightUnit,
          box_quantity: boxQuantity,
          status,
          created_at: now,
          updated_at: now,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while creating the variant.",
      },
      { status: 500 }
    );
  }
}