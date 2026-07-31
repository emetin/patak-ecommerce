import { NextRequest, NextResponse } from "next/server";
import { parseImportText } from "../../../../lib/import/parse-import";
import {
  importRecords,
  validateSheetHeaders,
} from "../../../../lib/import-export";

export async function POST(req: NextRequest) {
  try {
    await validateSheetHeaders("blog");

    const body = await req.json();
    const format = String(body?.format || "csv").toLowerCase();
    const text = String(body?.text || "");
    const dryRun = body?.dry_run === true;

    if (!text.trim()) {
      return NextResponse.json(
        { ok: false, error: "Import content is empty." },
        { status: 400 }
      );
    }

    const items = parseImportText("blog", format, text);

    if (items.length > 2000) {
      return NextResponse.json(
        { ok: false, error: "A maximum of 2000 records can be imported at once." },
        { status: 400 }
      );
    }

    const result = await importRecords("blog", items, { dryRun });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Import failed.",
      },
      { status: 500 }
    );
  }
}
