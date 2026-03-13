import { NextRequest, NextResponse } from "next/server";
import { importShopifyCsv } from "../../../../lib/shopify-import";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = String(body?.text || "");

    if (!text.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Shopify CSV content is empty.",
        },
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
            : "Shopify import failed unexpectedly.",
      },
      { status: 500 }
    );
  }
}