import { NextResponse } from "next/server";
import {
  deleteSheetRowBySlug,
  deleteSheetRowsByField,
} from "../../../../lib/sheets";

const PRODUCT_SHEET_NAME = "products";
const VARIANT_SHEET_NAME = "product_variants";

function normalizeSlug(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = normalizeSlug(body?.slug);

    if (!slug) {
      return NextResponse.json(
        {
          ok: false,
          error: "Slug is required.",
        },
        { status: 400 }
      );
    }

    await deleteSheetRowBySlug(PRODUCT_SHEET_NAME, slug);
    await deleteSheetRowsByField(VARIANT_SHEET_NAME, "product_slug", slug);

    return NextResponse.json({
      ok: true,
      message: "Product and related variants deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete the product.",
      },
      { status: 500 }
    );
  }
}