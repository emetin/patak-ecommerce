import { NextResponse } from "next/server";
import { getSheetData } from "../../../../lib/sheets";

type ProductImageItem = Record<string, string>;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productSlug = String(searchParams.get("product_slug") || "")
      .trim()
      .toLowerCase();

    const items = (await getSheetData("product_images")) as ProductImageItem[];

    let filtered = items.filter((item) => item && item.id);

    if (productSlug) {
      filtered = filtered.filter(
        (item) =>
          String(item.product_slug || "").trim().toLowerCase() === productSlug
      );
    }

    filtered = filtered.sort((a, b) => {
      const aOrder = Number(String(a.sort_order || "").trim());
      const bOrder = Number(String(b.sort_order || "").trim());

      const aValue = Number.isFinite(aOrder) ? aOrder : 999999;
      const bValue = Number.isFinite(bOrder) ? bOrder : 999999;

      return aValue - bValue;
    });

    return NextResponse.json(
      {
        ok: true,
        total: filtered.length,
        items: filtered,
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
          error instanceof Error
            ? error.message
            : "Failed to fetch product images.",
      },
      { status: 500 }
    );
  }
}