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

type ProductRow = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  image?: string;
  gallery?: string;
  collection_slug?: string;
  status?: string;
  featured?: string;
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
    const shortDescription = String(body?.short_description || "").trim();
    const image = String(body?.image || "").trim();
    const gallery = String(body?.gallery || "").trim();
    const collectionSlug = String(body?.collection_slug || "").trim();
    const status = String(body?.status || "draft").trim().toLowerCase();
    const featured = String(body?.featured || "false").trim().toLowerCase();

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

    if (!["true", "false"].includes(featured)) {
      return NextResponse.json(
        { ok: false, error: "Featured yalnızca true veya false olabilir." },
        { status: 400 }
      );
    }

    const items = (await getSheetData("Products")) as ProductRow[];
    const currentItem = items.find(
      (item) =>
        String(item.slug || "").trim().toLowerCase() ===
        originalSlug.toLowerCase()
    );

    if (!currentItem) {
      return NextResponse.json(
        { ok: false, error: "Güncellenecek ürün bulunamadı." },
        { status: 404 }
      );
    }

    const slugExistsOnAnotherItem = items.some((item) => {
      const itemSlug = String(item.slug || "").trim().toLowerCase();
      return itemSlug === finalSlug && itemSlug !== originalSlug.toLowerCase();
    });

    if (slugExistsOnAnotherItem) {
      return NextResponse.json(
        { ok: false, error: "Bu slug başka bir üründe kullanılıyor." },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    await updateSheetRowBySlug("Products", originalSlug, [
      String(currentItem.id || ""),
      title,
      finalSlug,
      description,
      shortDescription,
      image,
      gallery,
      collectionSlug,
      status,
      featured,
      String(currentItem.created_at || now),
      now,
    ]);

    return NextResponse.json({
      ok: true,
      message: "Ürün başarıyla güncellendi.",
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
            : "Ürün güncellenirken hata oluştu.",
      },
      { status: 500 }
    );
  }
}