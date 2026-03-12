import { NextResponse } from "next/server";
import { deleteSheetRowBySlug } from "../../../../lib/sheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = String(body?.slug || "").trim();

    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "Slug zorunludur." },
        { status: 400 }
      );
    }

    await deleteSheetRowBySlug("Collections", slug);

    return NextResponse.json({
      ok: true,
      message: "Collection silindi.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Collection silinemedi.",
      },
      { status: 500 }
    );
  }
}