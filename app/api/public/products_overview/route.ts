import { NextResponse } from "next/server";
import { getSheetData } from "../../../../lib/sheets";

type ProductRecord = Record<string, string>;
type ImageRecord = Record<string, string>;

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeLower(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function isTrue(value: unknown) {
  return normalizeLower(value) === "true";
}

function toSafeOrder(value: unknown) {
  const num = Number(normalizeText(value));
  return Number.isFinite(num) ? num : 999999;
}

function buildImagesByProduct(images: ImageRecord[]) {
  const map = new Map<string, ImageRecord[]>();

  for (const image of images) {
    const slug = normalizeLower(image.product_slug);

    if (!slug) {
      continue;
    }

    if (!map.has(slug)) {
      map.set(slug, []);
    }

    map.get(slug)!.push(image);
  }

  for (const [slug, items] of map.entries()) {
    map.set(
      slug,
      [...items].sort((a, b) => {
        const aMain = isTrue(a.is_main);
        const bMain = isTrue(b.is_main);

        if (aMain !== bMain) {
          return aMain ? -1 : 1;
        }

        const byOrder = toSafeOrder(a.sort_order) - toSafeOrder(b.sort_order);

        if (byOrder !== 0) {
          return byOrder;
        }

        return normalizeText(a.id).localeCompare(normalizeText(b.id));
      })
    );
  }

  return map;
}

function getMainImage(productSlug: string, imagesByProduct: Map<string, ImageRecord[]>) {
  const images = imagesByProduct.get(productSlug) || [];
  return normalizeText(images[0]?.image_url || "");
}

function toPublicProduct(
  product: ProductRecord,
  imagesByProduct: Map<string, ImageRecord[]>
) {
  const slug = normalizeLower(product.slug);
  const sheetImage = normalizeText(product.image);
  const mainImage = getMainImage(slug, imagesByProduct) || sheetImage;

  return {
    id: normalizeText(product.id),
    title: normalizeText(product.title),
    slug: normalizeText(product.slug),
    image: mainImage,
    collection_slug: normalizeText(product.collection_slug),
    short_description: normalizeText(product.short_description),
    featured: normalizeText(product.featured || "false"),
    updated_at: normalizeText(product.updated_at),
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const pageParam = Number(searchParams.get("page") || "1");
    const limitParam = Number(searchParams.get("limit") || "24");
    const collectionParam = normalizeLower(searchParams.get("collection"));
    const queryParam = normalizeLower(searchParams.get("q"));

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, 100)
        : 24;

    const [productRows, imageRows] = await Promise.all([
      getSheetData("products", { ttlSeconds: 300 }),
      getSheetData("product_images", { ttlSeconds: 300 }),
    ]);

    const imagesByProduct = buildImagesByProduct(
      (imageRows as ImageRecord[]).filter((item) => normalizeText(item.id))
    );

    let products = (productRows as ProductRecord[]).filter((item) => {
      return (
        normalizeText(item.slug) &&
        normalizeLower(item.status) === "published"
      );
    });

    if (collectionParam) {
      products = products.filter(
        (item) => normalizeLower(item.collection_slug) === collectionParam
      );
    }

    if (queryParam) {
      products = products.filter((item) => {
        const searchable = [
          item.title,
          item.slug,
          item.collection_slug,
          item.short_description,
        ]
          .map((value) => normalizeLower(value))
          .join(" ");

        return searchable.includes(queryParam);
      });
    }

    products = products.sort((a, b) =>
      normalizeText(b.updated_at).localeCompare(normalizeText(a.updated_at))
    );

    const total = products.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;

    const items = products
      .slice(start, start + limit)
      .map((item) => toPublicProduct(item, imagesByProduct));

    return NextResponse.json({
      ok: true,
      total,
      page: safePage,
      limit,
      totalPages,
      items,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load public products.",
      },
      { status: 500 }
    );
  }
}