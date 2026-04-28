import { NextResponse } from "next/server";
import { getSheetData } from "../../../../lib/sheets";

const SHEET_NAME = "media";

export async function GET() {
  try {
    const items = await getSheetData(SHEET_NAME, { forceFresh: true });

    return NextResponse.json({
      ok: true,
      items: [...items].reverse(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to load media.",
      },
      { status: 500 }
    );
  }
}