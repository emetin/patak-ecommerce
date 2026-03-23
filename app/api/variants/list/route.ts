import { NextResponse } from "next/server";
import { getSheetData } from "../../../../lib/sheets";

type VariantItem = Record<string, string>;

const SHEET_NAME = "product_variants";
const ALLOWED_STATUS = ["published", "active", "draft", "archived"];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const productSlug = String(searchParams.get("product_slug") || "")
      .trim()
      .toLowerCase();

    const statusParam = String(searchParams.get("status") || "")
      .trim()
      .toLowerCase();

    let items = (await getSheetData(SHEET_NAME)) as VariantItem[];

    items = items.filter((item) => item && item.product_slug);

    if (productSlug) {
      items = items.filter(
        (item) =>
          String(item.product_slug || "").trim().toLowerCase() === productSlug
      );
    }

    if (statusParam) {
      if (!ALLOWED_STATUS.includes(statusParam)) {
        return NextResponse.json(
          {
            ok: false,
            error: "Invalid status filter.",
          },
          { status: 400 }
        );
      }

      items = items.filter(
        (item) => String(item.status || "").trim().toLowerCase() === statusParam
      );
    }

    return NextResponse.json(
      {
        ok: true,
        total: items.length,
        items,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch variants.",
      },
      { status: 500 }
    );
  }
}