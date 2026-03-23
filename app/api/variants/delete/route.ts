import { NextResponse } from "next/server";
import { deleteSheetRowsByField } from "../../../../lib/sheets";

const SHEET_NAME = "product_variants";

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const variantId = normalizeText(body?.id);

    if (!variantId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Variant id is required.",
        },
        { status: 400 }
      );
    }

    const deletedCount = await deleteSheetRowsByField(
      SHEET_NAME,
      "id",
      variantId
    );

    if (!deletedCount) {
      return NextResponse.json(
        {
          ok: false,
          error: "Variant not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Variant deleted successfully.",
      deletedCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to delete variant.",
      },
      { status: 500 }
    );
  }
}