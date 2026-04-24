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

function sortImages(images: ImageRecord[]) {
  return [...images].sort((a, b) => {
    const aMain = isTrue(a.is_main);
    const bMain = isTrue(b.is_main);

    if (aMain !== bMain) return aMain ? -1 : 1;

    const byOrder = toSafeOrder(a.sort_order) - toSafeOrder(b.sort_order);
    if (byOrder !== 0) return byOrder;

    return normalizeText(a.id).localeCompare(normalizeText(b.id));
  });
}

function buildImagesByProduct(images: ImageRecord[]) {
  const map = new Map<string, ImageRecord[]>();

  for (const image of images) {
    const slug = normalizeLower(image.product_slug);
    if (!slug) continue;

    if (!map.has(slug)) {
      map.set(slug, []);
    }

    map.get(slug)!.push(image);
  }

  for (const [slug, items] of map.entries()) {
    map.set(slug, sortImages(items));
  }

  return map;
}

function getGalleryState(productSlug: string, imagesByProduct: Map<string, ImageRecord[]>) {
  const images = imagesByProduct.get(productSlug) || [];
  const mainImage = images.find((item) => isTrue(item.is_main)) || images[0] || null;
  const altCount = images.filter((item) => normalizeText(item.alt_text)).length;

  const issues: string[] = [];

  if (images.length === 0) issues.push("No gallery images");
  if (images.length > 0 && !images.find((item) => isTrue(item.is_main))) issues.push("No main image");
  if (images.length > 0 && altCount < images.length) issues.push("Missing alt text");
  if (images.length > 0 && images.length < 3) issues.push("Low image count");

  let score = 0;
  if (images.length > 0) score += 35;
  if (images.find((item) => isTrue(item.is_main))) score += 35;
  if (images.length >= 3) score += 15;
  if (images.length > 0 && altCount === images.length) score += 15;

  return {
    main_image: normalizeText(mainImage?.image_url),
    image_count: images.length,
    alt_count: altCount,
    main_image_exists: Boolean(images.find((item) => isTrue(item.is_main))),
    gallery_score: score,
    gallery_issues: issues,
  };
}

function toProductItem(
  item: ProductRecord,
  imagesByProduct: Map<string, ImageRecord[]>
) {
  const slug = normalizeLower(item.slug);
  const galleryState = getGalleryState(slug, imagesByProduct);
  const productImage = normalizeText(item.image);

  return {
    id: normalizeText(item.id),
    title: normalizeText(item.title),
    slug: normalizeText(item.slug),
    image: productImage,
    main_image: galleryState.main_image || productImage,
    collection_slug: normalizeText(item.collection_slug),
    status: normalizeText(item.status),
    featured: normalizeText(item.featured || "false"),
    short_description: normalizeText(item.short_description),
    updated_at: normalizeText(item.updated_at),
    image_count: galleryState.image_count,
    alt_count: galleryState.alt_count,
    main_image_exists: galleryState.main_image_exists,
    gallery_score: galleryState.gallery_score,
    gallery_issues: galleryState.gallery_issues,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const pageParam = Number(searchParams.get("page") || "1");
    const limitParam = Number(searchParams.get("limit") || "50");
    const statusParam = normalizeLower(searchParams.get("status"));
    const queryParam = normalizeLower(searchParams.get("q"));

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, 100)
        : 50;

    const [productRows, imageRows] = await Promise.all([
      getSheetData("products", { ttlSeconds: 300 }),
      getSheetData("product_images", { ttlSeconds: 300 }),
    ]);

    const imagesByProduct = buildImagesByProduct(
      (imageRows as ImageRecord[]).filter((item) => normalizeText(item.id))
    );

    let products = (productRows as ProductRecord[]).filter((item) =>
      normalizeText(item.slug)
    );

    if (statusParam && statusParam !== "all") {
      products = products.filter(
        (item) => normalizeLower(item.status) === statusParam
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

    const paginatedProducts = products
      .slice(start, start + limit)
      .map((item) => toProductItem(item, imagesByProduct));

    return NextResponse.json({
      ok: true,
      total,
      page: safePage,
      limit,
      totalPages,
      products: paginatedProducts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load products overview.",
      },
      { status: 500 }
    );
  }
}