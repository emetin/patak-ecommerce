import { NextResponse } from "next/server";
import { getSheetData } from "../../../../lib/sheets";

type BlogItem = Record<string, string>;

const ALLOWED_STATUS = ["published", "draft", "scheduled", "archived"];

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeLower(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function isPubliclyVisible(item: BlogItem) {
  const status = normalizeLower(item.status);

  if (status !== "published") {
    return false;
  }

  const publishedAt = normalizeText(item.published_at);

  if (!publishedAt) {
    return true;
  }

  const publishDate = new Date(publishedAt);

  if (Number.isNaN(publishDate.getTime())) {
    return false;
  }

  return publishDate.getTime() <= Date.now();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const statusParam = normalizeLower(searchParams.get("status"));
    const publicOnly = normalizeLower(searchParams.get("public")) === "true";

    const posts = (await getSheetData("blog", {
      ttlSeconds: 300,
    })) as BlogItem[];

    let items = posts.filter((item) => item && normalizeText(item.slug));

    if (publicOnly) {
      items = items.filter(isPubliclyVisible);
    } else if (statusParam) {
      if (!ALLOWED_STATUS.includes(statusParam)) {
        return NextResponse.json(
          { ok: false, error: "Invalid status filter." },
          { status: 400 }
        );
      }

      items = items.filter((item) => normalizeLower(item.status) === statusParam);
    }

    items = [...items].sort((a, b) => {
      const aDate = normalizeText(a.published_at || a.updated_at || a.created_at);
      const bDate = normalizeText(b.published_at || b.updated_at || b.created_at);

      return bDate.localeCompare(aDate);
    });

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
          error instanceof Error ? error.message : "Failed to fetch blog posts.",
      },
      { status: 500 }
    );
  }
}