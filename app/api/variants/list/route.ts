import { NextResponse } from "next/server";
import { getSheetData } from "../../../../lib/sheets";

type VariantRecord = Record<string, string>;

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeLower(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function isPublishedLike(value: unknown) {
  const normalized = normalizeLower(value);
  return normalized === "" || normalized === "published" || normalized === "active";
}

function isDefaultValue(value: unknown) {
  const normalized = normalizeLower(value);
  return !normalized || normalized === "default";
}

function isRealVariant(item: VariantRecord) {
  return (
    !isDefaultValue(item.option1_value) ||
    !isDefaultValue(item.option2_value) ||
    !isDefaultValue(item.option3_value)
  );
}

function buildVariantSortKey(item: VariantRecord) {
  return [
    normalizeText(item.option1_value),
    normalizeText(item.option2_value),
    normalizeText(item.option3_value),
    normalizeText(item.sku),
    normalizeText(item.id),
  ].join(" | ");
}

function toOutputItem(item: VariantRecord) {
  return {
    id: normalizeText(item.id),
    product_slug: normalizeText(item.product_slug),
    option1_name: normalizeText(item.option1_name),
    option1_value: normalizeText(item.option1_value),
    option2_name: normalizeText(item.option2_name),
    option2_value: normalizeText(item.option2_value),
    option3_name: normalizeText(item.option3_name),
    option3_value: normalizeText(item.option3_value),
    sku: normalizeText(item.sku),
    barcode: normalizeText(item.barcode),
    image_id: normalizeText(item.image_id),
    variant_image: normalizeText(item.variant_image),
    status: normalizeText(item.status),
    created_at: normalizeText(item.created_at),
    updated_at: normalizeText(item.updated_at),
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const productSlug = normalizeLower(searchParams.get("product_slug"));
    const includeAll = normalizeLower(searchParams.get("include_all")) === "true";
    const includeDefault =
      normalizeLower(searchParams.get("include_default")) === "true";

    const rows = (await getSheetData("product_variants", {
      forceFresh: true,
      ttlSeconds: 30,
    })) as VariantRecord[];

    let items = rows.filter((item) => normalizeText(item.id));

    if (productSlug) {
      items = items.filter(
        (item) => normalizeLower(item.product_slug) === productSlug
      );
    }

    if (!includeDefault) {
      items = items.filter(isRealVariant);
    }

    if (!includeAll) {
      items = items.filter((item) => isPublishedLike(item.status));
    }

    items = [...items].sort((a, b) =>
      buildVariantSortKey(a).localeCompare(buildVariantSortKey(b))
    );

    return NextResponse.json(
      {
        ok: true,
        total: items.length,
        items: items.map(toOutputItem),
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to load variants.",
      },
      { status: 500 }
    );
  }
}