import { NextResponse } from "next/server";
import { appendSheetRow } from "../../../../lib/sheets";

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeSlug(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const productSlug = normalizeSlug(body?.product_slug);
    const imageUrl = normalizeText(body?.image_url);
    const sortOrder = normalizeText(body?.sort_order);
    const altText = normalizeText(body?.alt_text);

    if (!productSlug) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product slug is required.",
        },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        {
          ok: false,
          error: "Image URL is required.",
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const id = `img_${Date.now()}`;

    await appendSheetRow("product_images", [
      id,
      productSlug,
      imageUrl,
      sortOrder,
      altText,
      now,
      now,
    ]);

    return NextResponse.json(
      {
        ok: true,
        message: "Product image created successfully.",
        item: {
          id,
          product_slug: productSlug,
          image_url: imageUrl,
          sort_order: sortOrder,
          alt_text: altText,
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
            : "Failed to create product image.",
      },
      { status: 500 }
    );
  }
}