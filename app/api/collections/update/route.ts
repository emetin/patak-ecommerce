import { NextResponse } from "next/server";
import {
  getSheetData,
  updateSheetRowBySlug,
} from "../../../../lib/sheets";

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
    .replace(/-+/g, "-");
}

type CollectionRow = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  image?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const originalSlug = String(body?.originalSlug || "").trim();
    const title = String(body?.title || "").trim();
    const slugInput = String(body?.slug || "").trim();
    const description = String(body?.description || "").trim();
    const image = String(body?.image || "").trim();
    const status = String(body?.status || "draft").trim().toLowerCase();

    if (!originalSlug) {
      return NextResponse.json(
        { ok: false, error: "originalSlug zorunludur." },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Title alanı zorunludur." },
        { status: 400 }
      );
    }

    const finalSlug = makeSlug(slugInput || title);

    if (!finalSlug) {
      return NextResponse.json(
        { ok: false, error: "Geçerli bir slug oluşturulamadı." },
        { status: 400 }
      );
    }

    if (!["published", "draft", "archived"].includes(status)) {
      return NextResponse.json(
        { ok: false, error: "Status yalnızca published, draft veya archived olabilir." },
        { status: 400 }
      );
    }

    const items = (await getSheetData("Collections")) as CollectionRow[];
    const currentItem = items.find(
      (item) =>
        String(item.slug || "").trim().toLowerCase() ===
        originalSlug.toLowerCase()
    );

    if (!currentItem) {
      return NextResponse.json(
        { ok: false, error: "Güncellenecek collection bulunamadı." },
        { status: 404 }
      );
    }

    const slugExistsOnAnotherItem = items.some((item) => {
      const itemSlug = String(item.slug || "").trim().toLowerCase();
      return itemSlug === finalSlug && itemSlug !== originalSlug.toLowerCase();
    });

    if (slugExistsOnAnotherItem) {
      return NextResponse.json(
        { ok: false, error: "Bu slug başka bir collection kaydında kullanılıyor." },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    await updateSheetRowBySlug("Collections", originalSlug, [
      String(currentItem.id || ""),
      title,
      finalSlug,
      description,
      image,
      status,
      String(currentItem.created_at || now),
      now,
    ]);

    return NextResponse.json({
      ok: true,
      message: "Collection başarıyla güncellendi.",
      item: {
        id: currentItem.id || "",
        slug: finalSlug,
        title,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Collection güncellenirken hata oluştu.",
      },
      { status: 500 }
    );
  }
}