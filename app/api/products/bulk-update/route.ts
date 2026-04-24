import { NextResponse } from "next/server";
import {
  getSheetData,
  getSheetHeaders,
  updateSheetRowBySlug,
} from "../../../../lib/sheets";

type ProductRecord = Record<string, string>;

type BulkUpdateItem = {
  original_slug?: string;
  values?: Record<string, string>;
};

const SHEET_NAME = "products";
const READONLY_FIELDS = new Set(["id", "created_at"]);
const ALLOWED_STATUS = new Set(["published", "draft", "archived"]);
const ALLOWED_FEATURED = new Set(["true", "false"]);

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeLower(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function sanitizeValues(
  values: Record<string, string>,
  allowedHeaders: string[]
) {
  const clean: Record<string, string> = {};

  for (const header of allowedHeaders) {
    if (READONLY_FIELDS.has(header)) continue;

    if (Object.prototype.hasOwnProperty.call(values, header)) {
      clean[header] = normalizeText(values[header]);
    }
  }

  return clean;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!isRecord(body) || !Array.isArray(body.updates)) {
      return NextResponse.json(
        { ok: false, error: "Updates array is required." },
        { status: 400 }
      );
    }

    const incomingUpdates = body.updates as BulkUpdateItem[];

    if (incomingUpdates.length === 0) {
      return NextResponse.json({
        ok: true,
        updated: 0,
        message: "No changes to save.",
      });
    }

    if (incomingUpdates.length > 200) {
      return NextResponse.json(
        {
          ok: false,
          error: "You can save up to 200 rows at once.",
        },
        { status: 400 }
      );
    }

    const [headers, rows] = await Promise.all([
      getSheetHeaders(SHEET_NAME, { forceFresh: true, ttlSeconds: 30 }),
      getSheetData(SHEET_NAME, { forceFresh: true, ttlSeconds: 30 }),
    ]);

    const products = rows as ProductRecord[];
    const currentBySlug = new Map<string, ProductRecord>();

    for (const product of products) {
      const slug = normalizeLower(product.slug);
      if (slug) {
        currentBySlug.set(slug, product);
      }
    }

    const preparedUpdates: Array<{
      originalSlug: string;
      nextSlug: string;
      merged: ProductRecord;
    }> = [];

    const nextSlugsInBatch = new Set<string>();

    for (const update of incomingUpdates) {
      const originalSlug = normalizeLower(update.original_slug);

      if (!originalSlug) {
        return NextResponse.json(
          { ok: false, error: "Every row must include original_slug." },
          { status: 400 }
        );
      }

      if (!isRecord(update.values)) {
        return NextResponse.json(
          { ok: false, error: `Invalid values for ${originalSlug}.` },
          { status: 400 }
        );
      }

      const current = currentBySlug.get(originalSlug);

      if (!current) {
        return NextResponse.json(
          { ok: false, error: `Product not found: ${originalSlug}` },
          { status: 404 }
        );
      }

      const sanitized = sanitizeValues(
        update.values as Record<string, string>,
        headers
      );

      const merged: ProductRecord = {
        ...current,
        ...sanitized,
        updated_at: new Date().toISOString(),
      };

      const nextSlug = normalizeLower(merged.slug);

      if (!nextSlug) {
        return NextResponse.json(
          { ok: false, error: "Slug cannot be empty." },
          { status: 400 }
        );
      }

      if (!normalizeText(merged.title)) {
        return NextResponse.json(
          { ok: false, error: `Title cannot be empty for ${nextSlug}.` },
          { status: 400 }
        );
      }

      const normalizedStatus = normalizeLower(merged.status || "draft");
      const normalizedFeatured = normalizeLower(merged.featured || "false");

      if (merged.status && !ALLOWED_STATUS.has(normalizedStatus)) {
        return NextResponse.json(
          {
            ok: false,
            error: `Invalid status for ${nextSlug}. Use published, draft, or archived.`,
          },
          { status: 400 }
        );
      }

      if (merged.featured && !ALLOWED_FEATURED.has(normalizedFeatured)) {
        return NextResponse.json(
          {
            ok: false,
            error: `Invalid featured value for ${nextSlug}. Use true or false.`,
          },
          { status: 400 }
        );
      }

      merged.status = normalizedStatus || "draft";
      merged.featured = normalizedFeatured || "false";

      const existingWithNextSlug = currentBySlug.get(nextSlug);

      if (existingWithNextSlug && nextSlug !== originalSlug) {
        return NextResponse.json(
          {
            ok: false,
            error: `Slug already exists: ${nextSlug}`,
          },
          { status: 400 }
        );
      }

      if (nextSlugsInBatch.has(nextSlug)) {
        return NextResponse.json(
          {
            ok: false,
            error: `Duplicate slug in this save batch: ${nextSlug}`,
          },
          { status: 400 }
        );
      }

      nextSlugsInBatch.add(nextSlug);

      preparedUpdates.push({
        originalSlug,
        nextSlug,
        merged,
      });
    }

    for (const update of preparedUpdates) {
      const rowValues = headers.map((header) => update.merged[header] || "");
      await updateSheetRowBySlug(SHEET_NAME, update.originalSlug, rowValues);
    }

    return NextResponse.json({
      ok: true,
      updated: preparedUpdates.length,
      message: `${preparedUpdates.length} product rows updated successfully.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to bulk update products.",
      },
      { status: 500 }
    );
  }
}