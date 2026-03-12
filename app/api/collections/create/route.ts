import { NextResponse } from "next/server";
import { appendSheetRow, getSheetData } from "../../../../lib/sheets";

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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = String(body?.title || "").trim();
    const slugInput = String(body?.slug || "").trim();
    const description = String(body?.description || "").trim();
    const image = String(body?.image || "").trim();
    const status = String(body?.status || "draft").trim().toLowerCase();

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

    const existingCollections = (await getSheetData("Collections")) as Array<{
      slug?: string;
    }>;

    const slugExists = existingCollections.some(
      (item) => String(item.slug || "").trim().toLowerCase() === finalSlug
    );

    if (slugExists) {
      return NextResponse.json(
        { ok: false, error: "Bu slug zaten kullanılıyor." },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const id = `col_${Date.now()}`;

    await appendSheetRow("Collections", [
      id,
      title,
      finalSlug,
      description,
      image,
      status,
      now,
      now,
    ]);

    return NextResponse.json({
      ok: true,
      message: "Collection başarıyla eklendi.",
      item: {
        id,
        title,
        slug: finalSlug,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Collection eklenirken bilinmeyen bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}