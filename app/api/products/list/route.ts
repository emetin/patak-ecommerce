import { NextResponse } from "next/server";
import { getSheetData } from "../../../../lib/sheets";

type ProductItem = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  featured_image?: string;
  image_gallery?: string;

  variant_1?: string;
  variant_data_1?: string;
  variant_image_1?: string;
  variant_sku_1?: string;
  variant_barcode_1?: string;
  variant_price_1?: string;
  variant_compare_at_price_1?: string;
  variant_stock_1?: string;

  variant_2?: string;
  variant_data_2?: string;
  variant_image_2?: string;
  variant_sku_2?: string;
  variant_barcode_2?: string;
  variant_price_2?: string;
  variant_compare_at_price_2?: string;
  variant_stock_2?: string;

  variant_3?: string;
  variant_data_3?: string;
  variant_image_3?: string;
  variant_sku_3?: string;
  variant_barcode_3?: string;
  variant_price_3?: string;
  variant_compare_at_price_3?: string;
  variant_stock_3?: string;

  collection?: string;
  vendor?: string;
  tags?: string;
  seo_title?: string;
  seo_description?: string;
  status?: string;
  url?: string;
  created_at?: string;
  updated_at?: string;
};

const SHEET_NAME = "products";
const ALLOWED_STATUS = ["active", "draft", "archived"];

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeStatus(value: unknown) {
  const normalized = normalizeText(value).toLowerCase();

  if (normalized === "published") {
    return "active";
  }

  return normalized;
}

function hasAtLeastOneVariant(item: ProductItem) {
  return Boolean(
    normalizeText(item.variant_data_1) ||
      normalizeText(item.variant_data_2) ||
      normalizeText(item.variant_data_3) ||
      normalizeText(item.variant_price_1) ||
      normalizeText(item.variant_price_2) ||
      normalizeText(item.variant_price_3)
  );
}

function mapProduct(item: ProductItem) {
  return {
    id: normalizeText(item.id),
    title: normalizeText(item.title),
    slug: normalizeText(item.slug),
    description: normalizeText(item.description),
    short_description: normalizeText(item.short_description),
    featured_image: normalizeText(item.featured_image),
    image_gallery: normalizeText(item.image_gallery),

    variant_1: normalizeText(item.variant_1),
    variant_data_1: normalizeText(item.variant_data_1),
    variant_image_1: normalizeText(item.variant_image_1),
    variant_sku_1: normalizeText(item.variant_sku_1),
    variant_barcode_1: normalizeText(item.variant_barcode_1),
    variant_price_1: normalizeText(item.variant_price_1),
    variant_compare_at_price_1: normalizeText(item.variant_compare_at_price_1),
    variant_stock_1: normalizeText(item.variant_stock_1),

    variant_2: normalizeText(item.variant_2),
    variant_data_2: normalizeText(item.variant_data_2),
    variant_image_2: normalizeText(item.variant_image_2),
    variant_sku_2: normalizeText(item.variant_sku_2),
    variant_barcode_2: normalizeText(item.variant_barcode_2),
    variant_price_2: normalizeText(item.variant_price_2),
    variant_compare_at_price_2: normalizeText(item.variant_compare_at_price_2),
    variant_stock_2: normalizeText(item.variant_stock_2),

    variant_3: normalizeText(item.variant_3),
    variant_data_3: normalizeText(item.variant_data_3),
    variant_image_3: normalizeText(item.variant_image_3),
    variant_sku_3: normalizeText(item.variant_sku_3),
    variant_barcode_3: normalizeText(item.variant_barcode_3),
    variant_price_3: normalizeText(item.variant_price_3),
    variant_compare_at_price_3: normalizeText(item.variant_compare_at_price_3),
    variant_stock_3: normalizeText(item.variant_stock_3),

    collection: normalizeText(item.collection),
    vendor: normalizeText(item.vendor),
    tags: normalizeText(item.tags),
    seo_title: normalizeText(item.seo_title),
    seo_description: normalizeText(item.seo_description),
    status: normalizeStatus(item.status),
    url: normalizeText(item.url),
    created_at: normalizeText(item.created_at),
    updated_at: normalizeText(item.updated_at),

    variant_count: [
      normalizeText(item.variant_data_1),
      normalizeText(item.variant_data_2),
      normalizeText(item.variant_data_3),
    ].filter(Boolean).length,

    has_variants: hasAtLeastOneVariant(item),
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const statusParam = normalizeStatus(searchParams.get("status"));
    const searchParam = normalizeText(searchParams.get("search")).toLowerCase();

    const products = (await getSheetData(SHEET_NAME)) as ProductItem[];

    let items = products
      .filter((item) => item && normalizeText(item.slug))
      .map(mapProduct);

    if (statusParam) {
      if (!ALLOWED_STATUS.includes(statusParam)) {
        return NextResponse.json(
          {
            ok: false,
            error: 'Invalid status filter. Use "active", "draft", or "archived".',
          },
          { status: 400 }
        );
      }

      items = items.filter((item) => item.status === statusParam);
    }

    if (searchParam) {
      items = items.filter((item) => {
        const title = item.title.toLowerCase();
        const slug = item.slug.toLowerCase();
        const description = item.description.toLowerCase();
        const shortDescription = item.short_description.toLowerCase();
        const collection = item.collection.toLowerCase();
        const vendor = item.vendor.toLowerCase();
        const tags = item.tags.toLowerCase();

        return (
          title.includes(searchParam) ||
          slug.includes(searchParam) ||
          description.includes(searchParam) ||
          shortDescription.includes(searchParam) ||
          collection.includes(searchParam) ||
          vendor.includes(searchParam) ||
          tags.includes(searchParam)
        );
      });
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
          error instanceof Error ? error.message : "Failed to fetch products.",
      },
      { status: 500 }
    );
  }
}