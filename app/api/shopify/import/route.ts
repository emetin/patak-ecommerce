import { NextRequest, NextResponse } from "next/server";
import { importShopifyCsv } from "../../../../lib/shopify-import";

export async function POST(req: NextRequest) {
  try {

    let csvText = "";

    const contentType = req.headers.get("content-type") || "";

    // 1️⃣ JSON gönderilirse
    if (contentType.includes("application/json")) {
      const body = await req.json();
      csvText = String(body?.text || "");
    }

    // 2️⃣ Form-data ile CSV gönderilirse
    else if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");

      if (file && typeof file !== "string") {
        csvText = await file.text();
      }
    }

    if (!csvText.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Shopify CSV content is empty.",
        },
        { status: 400 }
      );
    }

    const result = await importShopifyCsv(csvText);

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