import { NextResponse } from "next/server";
import { getSheetData, getSheetHeaders } from "../../../../lib/sheets";

type ProductRecord = Record<string, string>;

const SHEET_NAME = "products";

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeLower(value: unknown) {
  return normalizeText(value).toLowerCase();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const query = normalizeLower(searchParams.get("q"));
    const status = normalizeLower(searchParams.get("status"));
    const limitParam = Number(searchParams.get("limit") || "250");

    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, 500)
        : 250;

    const [headers, rows] = await Promise.all([
      getSheetHeaders(SHEET_NAME, { ttlSeconds: 120 }),
      getSheetData(SHEET_NAME, { ttlSeconds: 120 }),
    ]);

    let items = (rows as ProductRecord[]).filter((item) =>
      normalizeText(item.slug)
    );

    if (status && status !== "all") {
      items = items.filter((item) => normalizeLower(item.status) === status);
    }

    if (query) {
      items = items.filter((item) => {
        const searchable = headers
          .map((header) => normalizeLower(item[header]))
          .join(" ");

        return searchable.includes(query);
      });
    }

    items = items
      .sort((a, b) =>
        normalizeText(b.updated_at).localeCompare(normalizeText(a.updated_at))
      )
      .slice(0, limit);

    return NextResponse.json(
      {
        ok: true,
        headers,
        items,
        total: items.length,
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
            : "Failed to load bulk products.",
      },
      { status: 500 }
    );
  }
}