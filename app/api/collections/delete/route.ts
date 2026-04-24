import { NextResponse } from "next/server";
import {
  deleteSheetRowBySlug,
  getSheetData,
  getSheetHeaders,
  updateSheetRowBySlug,
} from "../../../../lib/sheets";

type ProductRecord = Record<string, string>;

function normalizeSlug(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = normalizeSlug(body?.slug);

    if (!slug) {
      return NextResponse.json(
        {
          ok: false,
          error: "Collection slug is required.",
        },
        { status: 400 }
      );
    }

    await deleteSheetRowBySlug("collections", slug);

    const products = (await getSheetData("products", {
      forceFresh: true,
      ttlSeconds: 30,
    })) as ProductRecord[];

    const headers = await getSheetHeaders("products", {
      forceFresh: true,
      ttlSeconds: 30,
    });

    const affectedProducts = products.filter(
      (product) => normalizeSlug(product.collection_slug) === slug
    );

    for (const product of affectedProducts) {
      const productSlug = normalizeSlug(product.slug);

      if (!productSlug) {
        continue;
      }

      const updatedProduct: ProductRecord = {
        ...product,
        collection_slug: "",
        updated_at: new Date().toISOString(),
      };

      const rowValues = headers.map((header) => updatedProduct[header] || "");

      await updateSheetRowBySlug("products", productSlug, rowValues);
    }

    return NextResponse.json({
      ok: true,
      affectedProducts: affectedProducts.length,
      message: "Collection deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete collection.",
      },
      { status: 500 }
    );
  }
}