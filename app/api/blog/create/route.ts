import { NextResponse } from "next/server";
import { appendSheetRow, getSheetData } from "../../../../lib/sheets";

type BlogRecord = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  author?: string;
  status?: string;
  featured?: string;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  created_at?: string;
  updated_at?: string;
};

const ALLOWED_STATUS = ["published", "draft", "scheduled", "archived"];
const ALLOWED_FEATURED = ["true", "false"];

function makeSlug(text: string) {
  return text
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

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Title is required." },
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

    if (!ALLOWED_STATUS.includes(status)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Status must be one of: "published", "scheduled", "draft", or "archived".',
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_FEATURED.includes(featured)) {
      return NextResponse.json(
        { ok: false, error: 'Featured must be either "true" or "false".' },
        { status: 400 }
      );
    }

    if (status === "scheduled" && !publishedAt) {
      return NextResponse.json(
        { ok: false, error: "Published date is required for scheduled posts." },
        { status: 400 }
      );
    }

    const existingPosts = (await getSheetData("blog", {
      forceFresh: true,
      ttlSeconds: 30,
    })) as BlogRecord[];

    const normalizedTitle = title.toLowerCase();
    const normalizedSlug = finalSlug.toLowerCase();

    const slugExists = existingPosts.some(
      (item) => String(item.slug || "").trim().toLowerCase() === normalizedSlug
    );

    if (slugExists) {
      return NextResponse.json(
        { ok: false, error: "This slug is already in use." },
        { status: 400 }
      );
    }

    const titleExists = existingPosts.some(
      (item) => String(item.title || "").trim().toLowerCase() === normalizedTitle
    );

    if (titleExists) {
      return NextResponse.json(
        { ok: false, error: "A blog post with this title already exists." },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const id = `blog_${Date.now()}`;

    await appendSheetRow("blog", [
      id,
      title,
      finalSlug,
      excerpt,
      content,
      image,
      author,
      status,
      featured,
      publishedAt,
      seoTitle,
      seoDescription,
      now,
      now,
    ]);

    return NextResponse.json(
      {
        ok: true,
        message: "Blog post created successfully.",
        item: {
          id,
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
            : "An unexpected error occurred while creating the blog post.",
      },
      { status: 500 }
    );
  }
}