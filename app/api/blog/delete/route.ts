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

    await deleteSheetRowBySlug("Blog", slug);

    return NextResponse.json({
      ok: true,
      message: "Blog yazısı silindi.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Blog silinemedi.",
      },
      { status: 500 }
    );
  }
}