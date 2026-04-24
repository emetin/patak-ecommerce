import { NextResponse } from "next/server";
import {
  getSheetData,
  getSheetHeaders,
  updateSheetRowBySlug,
} from "../../../../lib/sheets";

type BlogRow = Record<string, string>;

const SHEET_NAME = "blog";
const ALLOWED_STATUS = ["published", "draft", "scheduled", "archived"];
const ALLOWED_FEATURED = ["true", "false"];

function makeSlug(text: string) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeSlug(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function normalizeStatus(value: unknown) {
  return String(value || "draft").trim().toLowerCase();
}

function normalizeBooleanString(value: unknown, fallback = "false") {
  return String(value || fallback).trim().toLowerCase();
}

function normalizeDateTime(value: unknown) {
  const raw = normalizeText(value);

  if (!raw) {
    return "";
  }

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const originalSlug = normalizeSlug(body?.originalSlug || body?.slug);
    const title = normalizeText(body?.title);
    const slugInput = normalizeText(body?.slug);
    const excerpt = normalizeText(body?.excerpt);
    const content = normalizeText(body?.content);
    const image = normalizeText(body?.image);
    const author = normalizeText(body?.author);
    const status = normalizeStatus(body?.status);
    const featured = normalizeBooleanString(body?.featured, "false");
    const publishedAt = normalizeDateTime(body?.published_at);
    const seoTitle = normalizeText(body?.seo_title);
    const seoDescription = normalizeText(body?.seo_description);

    if (!originalSlug) {
      return NextResponse.json(
        { ok: false, error: "Original slug is required." },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Title is required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUS.includes(status)) {
      return NextResponse.json(
        { ok: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    if (!ALLOWED_FEATURED.includes(featured)) {
      return NextResponse.json(
        { ok: false, error: "Invalid featured value." },
        { status: 400 }
      );
    }

    if (status === "scheduled" && !publishedAt) {
      return NextResponse.json(
        { ok: false, error: "Published date is required for scheduled posts." },
        { status: 400 }
      );
    }

    const finalSlug = makeSlug(slugInput || title);

    if (!finalSlug) {
      return NextResponse.json(
        { ok: false, error: "A valid slug could not be generated." },
        { status: 400 }
      );
    }

    const items = (await getSheetData(SHEET_NAME, {
      forceFresh: true,
      ttlSeconds: 30,
    })) as BlogRow[];

    const currentItem =
      items.find((item) => normalizeSlug(item.slug) === originalSlug) || null;

    if (!currentItem) {
      return NextResponse.json(
        { ok: false, error: "Blog post was not found." },
        { status: 404 }
      );
    }

    const slugExistsOnAnotherItem = items.some((item) => {
      const itemSlug = normalizeSlug(item.slug);
      return itemSlug === finalSlug && itemSlug !== originalSlug;
    });

    if (slugExistsOnAnotherItem) {
      return NextResponse.json(
        { ok: false, error: "This slug is already used by another blog post." },
        { status: 400 }
      );
    }

    const headers = await getSheetHeaders(SHEET_NAME, {
      forceFresh: true,
      ttlSeconds: 30,
    });

    const now = new Date().toISOString();

    const updatedItem: BlogRow = {
      ...currentItem,
      title,
      slug: finalSlug,
      excerpt,
      content,
      image,
      author,
      status,
      featured,
      published_at: publishedAt,
      seo_title: seoTitle,
      seo_description: seoDescription,
      created_at: currentItem.created_at || now,
      updated_at: now,
    };

    const rowValues = headers.map((header) => updatedItem[header] || "");

    await updateSheetRowBySlug(SHEET_NAME, originalSlug, rowValues);

    return NextResponse.json({
      ok: true,
      message: "Blog post updated successfully.",
      item: updatedItem,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to update blog post.",
      },
      { status: 500 }
    );
  }
}