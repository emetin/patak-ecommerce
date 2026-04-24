import { NextResponse } from "next/server";
import {
  getSheetRows,
  updateSheetRowByRowNumber,
} from "../../../../lib/sheets";

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

function isDefaultValue(value: unknown) {
  const normalized = normalizeLower(value);
  return !normalized || normalized === "default";
}

function rowToObject(headers: string[], row: string[]) {
  const item: VariantRecord = {};

  headers.forEach((header, index) => {
    item[header] = row[index] ? String(row[index]) : "";
  });

  return item;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const id = normalizeText(body?.id);

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Variant id is required." },
        { status: 400 }
      );
    }

    const rows = await getSheetRows(SHEET_NAME, {
      forceFresh: true,
      ttlSeconds: 30,
    });

    if (rows.length <= 1) {
      return NextResponse.json(
        { ok: false, error: "No variants found." },
        { status: 404 }
      );
    }

    const headers = rows[0].map((item) => String(item).trim());

    let foundRowNumber: number | null = null;
    let existingItem: VariantRecord | null = null;

    for (let i = 1; i < rows.length; i += 1) {
      const rowObject = rowToObject(headers, rows[i]);

      if (normalizeText(rowObject.id) === id) {
        foundRowNumber = i + 1;
        existingItem = rowObject;
        break;
      }
    }

    if (!foundRowNumber || !existingItem) {
      return NextResponse.json(
        { ok: false, error: "Variant not found." },
        { status: 404 }
      );
    }

    const option1Name =
      body?.option1_name !== undefined
        ? normalizeText(body.option1_name)
        : existingItem.option1_name || "";

    const option1Value =
      body?.option1_value !== undefined
        ? normalizeText(body.option1_value)
        : existingItem.option1_value || "";

    const option2Name =
      body?.option2_name !== undefined
        ? normalizeText(body.option2_name)
        : existingItem.option2_name || "";

    const option2Value =
      body?.option2_value !== undefined
        ? normalizeText(body.option2_value)
        : existingItem.option2_value || "";

    const option3Name =
      body?.option3_name !== undefined
        ? normalizeText(body.option3_name)
        : existingItem.option3_name || "";

    const option3Value =
      body?.option3_value !== undefined
        ? normalizeText(body.option3_value)
        : existingItem.option3_value || "";

    const status =
      body?.status !== undefined
        ? normalizeStatus(body.status)
        : normalizeStatus(existingItem.status || "draft");

    if (
      isDefaultValue(option1Value) &&
      isDefaultValue(option2Value) &&
      isDefaultValue(option3Value)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Default variants are not allowed. Please enter a real option value.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUS.includes(status)) {
      return NextResponse.json(
        { ok: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    const updatedItem: VariantRecord = {
      ...existingItem,
      option1_name: option1Name,
      option1_value: option1Value,
      option2_name: option2Name,
      option2_value: option2Value,
      option3_name: option3Name,
      option3_value: option3Value,
      sku:
        body?.sku !== undefined
          ? normalizeText(body.sku)
          : existingItem.sku || "",
      barcode:
        body?.barcode !== undefined
          ? normalizeText(body.barcode)
          : existingItem.barcode || "",
      variant_image:
        body?.variant_image !== undefined
          ? normalizeText(body.variant_image)
          : existingItem.variant_image || "",
      image_id:
        body?.image_id !== undefined
          ? normalizeText(body.image_id)
          : existingItem.image_id || "",
      status,
      updated_at: new Date().toISOString(),
    };

    const rowValues = headers.map((header) => updatedItem[header] || "");

    await updateSheetRowByRowNumber(SHEET_NAME, foundRowNumber, rowValues);

    return NextResponse.json({
      ok: true,
      message: "Variant updated successfully.",
      item: updatedItem,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to update variant.",
      },
      { status: 500 }
    );
  }
}