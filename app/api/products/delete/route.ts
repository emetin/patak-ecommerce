import { NextResponse } from "next/server";
import {
  deleteSheetRowBySlug,
  deleteSheetRowsByField,
} from "../../../../lib/sheets";

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
          error: "Product slug is required.",
        },
        { status: 400 }
      );
    }

    await deleteSheetRowBySlug("products", slug);
    await deleteSheetRowsByField("product_variants", "product_slug", slug);
    await deleteSheetRowsByField("product_images", "product_slug", slug);
    await deleteSheetRowsByField("collection_products", "product_slug", slug);

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