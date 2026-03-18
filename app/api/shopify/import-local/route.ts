import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { importShopifyCsv } from "../../../../lib/shopify-import";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "products_export_1.csv");
    const text = await fs.readFile(filePath, "utf8");

    if (!text.trim()) {
      return NextResponse.json(
        { ok: false, error: "CSV file is empty." },
        { status: 400 }
      );
    }

    const result = await importShopifyCsv(text);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Local Shopify import failed.",
      },
      { status: 500 }
    );
  }
}