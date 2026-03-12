import { NextResponse } from "next/server";
import { deleteSheetRowBySlug } from "../../../../lib/sheets";

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

    await deleteSheetRowBySlug("Products", slug);

    return NextResponse.json({
      ok: true,
      message: "Product deleted successfully.",
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