import { NextResponse } from "next/server";
import {
  deleteSheetRowBySlug,
  deleteSheetRowsByField,
} from "../../../../lib/sheets";

function normalizeSlug(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

async function safeDeleteRowsByField(
  sheetName: string,
  fieldName: string,
  fieldValue: string
) {
  try {
    return await deleteSheetRowsByField(sheetName, fieldName, fieldValue);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (
      message.includes("was not found") ||
      message.includes("Unable to parse range") ||
      message.includes("Sheet metadata was not found")
    ) {
      return { ok: true, deleted: 0, skipped: true };
    }

    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = normalizeSlug(body?.slug);

    if (!slug) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product slug is required.",
        },
        { status: 400 }
      );
    }

    await deleteSheetRowBySlug("products", slug);

    await safeDeleteRowsByField("product_variants", "product_slug", slug);
    await safeDeleteRowsByField("product_images", "product_slug", slug);

    return NextResponse.json({
      ok: true,
      message: "Product and related records deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to delete product.",
      },
      { status: 500 }
    );
  }
}