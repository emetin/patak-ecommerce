import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_SIZE_MB = 10;

function slugifyFileName(value: string) {
  return String(value || "image")
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeFolder(value: unknown) {
  const folder = String(value || "products")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return folder || "products";
}

function getSafeExtension(file: File, originalName: string) {
  const ext = path.extname(originalName).toLowerCase();

  if (ext) return ext;

  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  if (file.type === "image/gif") return ".gif";

  return ".jpg";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = normalizeFolder(formData.get("folder"));

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "No file uploaded." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Only JPG, PNG, WEBP, and GIF images are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        {
          ok: false,
          error: `Image must be smaller than ${MAX_SIZE_MB}MB.`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || "upload";
    const ext = getSafeExtension(file, originalName);
    const baseName = path.basename(originalName, path.extname(originalName));
    const safeBaseName = slugifyFileName(baseName) || "image";

    const uniquePart = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const fileName = `${uniquePart}-${safeBaseName}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${folder}/${fileName}`;

    return NextResponse.json(
      {
        ok: true,
        url: fileUrl,
        fileName,
        folder,
        size: file.size,
        type: file.type,
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
        error: error instanceof Error ? error.message : "Upload failed.",
      },
      { status: 500 }
    );
  }
}