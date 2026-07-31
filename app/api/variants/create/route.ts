import { NextResponse } from "next/server";
import {
  appendSheetRow,
  getSheetData,
  getSheetHeaders,
} from "../../../../lib/sheets";
import { findVariantConflict } from "../../../../lib/variant-validation";

type VariantRecord = Record<string, string>;

const SHEET_NAME = "product_variants";
const ALLOWED_STATUS = ["published", "draft", "archived"];

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeLower(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function normalizeStatus(value: unknown) {
  return String(value || "draft").trim().toLowerCase();
}

function buildVariantId() {
  return `var_${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function isDefaultValue(value: unknown) {
  const normalized = normalizeLower(value);
  return !normalized || normalized === "default";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const productSlug = normalizeLower(body?.product_slug);
    const option1Name = normalizeText(body?.option1_name || "Size");
    const option1Value = normalizeText(body?.option1_value);
    const option2Name = normalizeText(body?.option2_name);
    const option2Value = normalizeText(body?.option2_value);
    const option3Name = normalizeText(body?.option3_name);
    const option3Value = normalizeText(body?.option3_value);
    const sku = normalizeText(body?.sku);
    const barcode = normalizeText(body?.barcode);
    const variantImage = normalizeText(body?.variant_image || body?.image_id);
    const status = normalizeStatus(body?.status);

    if (!productSlug) {
      return NextResponse.json(
        { ok: false, error: "Product slug is required." },
        { status: 400 }
      );
    }

    if (isDefaultValue(option1Value) && isDefaultValue(option2Value) && isDefaultValue(option3Value)) {
      return NextResponse.json(
        { ok: false, error: "Default variants are not allowed. Please enter a real option value." },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUS.includes(status)) {
      return NextResponse.json(
        { ok: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    const existing = (await getSheetData(SHEET_NAME, {
      forceFresh: true,
      ttlSeconds: 30,
    })) as VariantRecord[];

    const conflict = findVariantConflict(existing, {
      product_slug: productSlug,
      option1_value: option1Value,
      option2_value: option2Value,
      option3_value: option3Value,
      sku,
      barcode,
    });

    if (conflict) {
      return NextResponse.json(
        { ok: false, error: conflict.message, field: conflict.field },
        { status: 409 }
      );
    }

    const headers = await getSheetHeaders(SHEET_NAME, {
      forceFresh: true,
      ttlSeconds: 30,
    });

    const now = new Date().toISOString();

    const item: Record<string, string> = {
      id: buildVariantId(),
      product_slug: productSlug,
      option1_name: option1Name,
      option1_value: option1Value,
      option2_name: option2Name,
      option2_value: option2Value,
      option3_name: option3Name,
      option3_value: option3Value,
      sku,
      barcode,
      variant_image: variantImage,
      image_id: variantImage,
      status,
      created_at: now,
      updated_at: now,
    };

    const rowValues = headers.map((header) => item[header] || "");

    await appendSheetRow(SHEET_NAME, rowValues);

    return NextResponse.json({
      ok: true,
      message: "Variant created successfully.",
      item,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to create variant.",
      },
      { status: 500 }
    );
  }
}
