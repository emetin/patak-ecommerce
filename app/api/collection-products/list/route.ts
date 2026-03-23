import { NextResponse } from "next/server";
import { getSheetData } from "../../../../lib/sheets";

type CollectionProductItem = Record<string, string>;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const collectionSlug = String(searchParams.get("collection_slug") || "")
      .trim()
      .toLowerCase();

    const items = (await getSheetData(
      "collection_products"
    )) as CollectionProductItem[];

    let filtered = items.filter((item) => item && item.id);

    if (collectionSlug) {
      filtered = filtered.filter(
        (item) =>
          String(item.collection_slug || "").trim().toLowerCase() ===
          collectionSlug
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
            : "Failed to fetch collection products.",
      },
      { status: 500 }
    );
  }
}