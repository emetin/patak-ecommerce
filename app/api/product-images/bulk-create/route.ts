import { NextResponse } from "next/server";
import {
  appendSheetRows,
  getSheetData,
  getSheetHeaders,
  updateSheetRowBySlug,
} from "../../../../lib/sheets";

type ProductImageItem = Record<string, string>;
type ProductItem = Record<string, string>;

type BulkImageInput = {
  image_url?: string;
  alt_text?: string;
  is_main?: string | boolean;
};

const SHEET_NAME = "product_images";
const PRODUCTS_SHEET_NAME = "products";

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeLower(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function buildImageId(index: number) {
  return `img_${Date.now()}_${index}_${Math.floor(Math.random() * 1000)}`;
}

async function syncMainProductImage(productSlug: string, imageUrl: string) {
  const products = (await getSheetData(PRODUCTS_SHEET_NAME, {
    forceFresh: true,
    ttlSeconds: 0,
  })) as ProductItem[];

  const product = products.find(
    (item) => normalizeLower(item.slug) === normalizeLower(productSlug)
  );

  if (!product) return;

  const headers = await getSheetHeaders(PRODUCTS_SHEET_NAME, {
    forceFresh: true,
    ttlSeconds: 0,
  });

  const updatedProduct: ProductItem = {
    ...product,
    image: imageUrl,
    updated_at: new Date().toISOString(),
  };

  const rowValues = headers.map((header) => updatedProduct[header] || "");
  await updateSheetRowBySlug(PRODUCTS_SHEET_NAME, productSlug, rowValues);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const productSlug = normalizeLower(body?.product_slug);
    const images: BulkImageInput[] = Array.isArray(body?.images)
      ? body.images
      : [];

    if (!productSlug) {
      return NextResponse.json(
        { ok: false, error: "Product slug is required." },
        { status: 400 }
      );
    }

    if (!images.length) {
      return NextResponse.json(
        { ok: false, error: "Images are required." },
        { status: 400 }
      );
    }

    const existingImages = (await getSheetData(SHEET_NAME, {
      forceFresh: true,
      ttlSeconds: 0,
    })) as ProductImageItem[];

    const sameProductImages = existingImages.filter(
      (item) => normalizeLower(item.product_slug) === productSlug
    );

    const headers = await getSheetHeaders(SHEET_NAME, {
      forceFresh: true,
      ttlSeconds: 0,
    });

    const now = new Date().toISOString();
    const startOrder = sameProductImages.length + 1;

    const items: ProductImageItem[] = images
      .map((image: BulkImageInput, index: number) => {
        const isFirstImageForProduct =
          sameProductImages.length === 0 && index === 0;

        const imageUrl = normalizeText(image.image_url);

        return {
          id: buildImageId(index),
          product_slug: productSlug,
          image_url: imageUrl,
          alt_text: normalizeText(image.alt_text),
          is_main:
            image.is_main === "true" ||
            image.is_main === true ||
            isFirstImageForProduct
              ? "true"
              : "false",
          sort_order: String(startOrder + index),
          created_at: now,
          updated_at: now,
        };
      })
      .filter((item) => normalizeText(item.image_url));

    if (!items.length) {
      return NextResponse.json(
        { ok: false, error: "No valid image URL found." },
        { status: 400 }
      );
    }

    const rowValues = items.map((item) =>
      headers.map((header) => item[header] || "")
    );

    await appendSheetRows(SHEET_NAME, rowValues);

    const mainItem =
      items.find((item) => item.is_main === "true") || items[0];

    if (mainItem?.image_url) {
      await syncMainProductImage(productSlug, mainItem.image_url);
    }

    return NextResponse.json({
      ok: true,
      message: "Product images created successfully.",
      count: items.length,
      items,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to bulk create product images.",
      },
      { status: 500 }
    );
  }
}