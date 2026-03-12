import { NextResponse } from "next/server";
import { getSheetData } from "../../../../lib/sheets";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = String(searchParams.get("status") || "").trim().toLowerCase();

    let items = (await getSheetData("Products")) as Record<string, string>[];

    if (status) {
      items = items.filter(
        (item) => String(item.status || "").trim().toLowerCase() === status
      );
    }

    return NextResponse.json({
      ok: true,
      total: items.length,
      items,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Products list alınamadı.",
      },
      { status: 500 }
    );
  }
}