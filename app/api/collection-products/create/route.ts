import { NextResponse } from "next/server";
import { appendSheetRow, getSheetData } from "../../../../lib/sheets";

type CollectionProductRecord = {
  id?: string;
  collection_slug?: string;
  product_slug?: string;
};

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeSlug(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function normalizeBool(value: unknown, fallback = "false") {
  return String(value || fallback).trim().toLowerCase();
}

function normalizeStatus(value: unknown, fallback = "published") {
  return String(value || fallback).trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const collectionSlug = normalizeSlug(body?.collection_slug);
    const productSlug = normalizeSlug(body?.product_slug);
    const sortOrder = normalizeText(body?.sort_order);
    const featured = normalizeBool(body?.featured, "false");
    const status = normalizeStatus(body?.status, "published");

    if (!collectionSlug) {
      return NextResponse.json(
        {
          ok: false,
          error: "Collection slug is required.",
        },
        { status: 400 }
      );
    }

    if (!productSlug) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product slug is required.",
        },
        { status: 400 }
      );
    }

    const existing = (await getSheetData(
      "collection_products"
    )) as CollectionProductRecord[];

    const duplicate = existing.some(
      (item) =>
        normalizeSlug(item.collection_slug) === collectionSlug &&
        normalizeSlug(item.product_slug) === productSlug
    );

    if (duplicate) {
      return NextResponse.json(
        {
          ok: false,
          error: "This product is already linked to the collection.",
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const id = `cp_${Date.now()}`;

    await appendSheetRow("collection_products", [
      id,
      collectionSlug,
      productSlug,
      sortOrder,
      featured,
      status,
      now,
      now,
    ]);

    return NextResponse.json(
      {
        ok: true,
        message: "Collection product link created successfully.",
        item: {
          id,
          collection_slug: collectionSlug,
          product_slug: productSlug,
          sort_order: sortOrder,
          featured,
          status,
          created_at: now,
          updated_at: now,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create collection product link.",
      },
      { status: 500 }
    );
  }
}