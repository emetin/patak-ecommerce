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
          error: "Collection slug is required.",
        },
        { status: 400 }
      );
    }

    await deleteSheetRowBySlug("collections", slug);
    await deleteSheetRowsByField("collection_products", "collection_slug", slug);

    return NextResponse.json({
      ok: true,
      message: "Collection and related links deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to delete collection.",
      },
      { status: 500 }
    );
  }
}