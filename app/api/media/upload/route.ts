import { NextResponse } from "next/server";
import { appendSheetRow } from "../../../../lib/sheets";

const SHEET_NAME = "media";

const APPS_SCRIPT_MEDIA_URL = process.env.GOOGLE_APPS_SCRIPT_MEDIA_URL;
const APPS_SCRIPT_MEDIA_SECRET = process.env.GOOGLE_APPS_SCRIPT_MEDIA_SECRET;

async function fileToBase64(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}

export async function POST(req: Request) {
  try {
    if (!APPS_SCRIPT_MEDIA_URL) {
      throw new Error("Missing GOOGLE_APPS_SCRIPT_MEDIA_URL.");
    }

    if (!APPS_SCRIPT_MEDIA_SECRET) {
      throw new Error("Missing GOOGLE_APPS_SCRIPT_MEDIA_SECRET.");
    }

    const formData = await req.formData();

    const file = formData.get("file");
    const folder = String(formData.get("folder") || "general").trim();
    const altText = String(formData.get("alt_text") || "").trim();

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Image file is required.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Unsupported file type. Please upload JPG, PNG, WEBP, or GIF.",
        },
        {
          status: 400,
        }
      );
    }

    const fileBase64 = await fileToBase64(file);

    const scriptResponse = await fetch(APPS_SCRIPT_MEDIA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "upload",
        secret: APPS_SCRIPT_MEDIA_SECRET,
        fileBase64,
        fileName: file.name,
        mimeType: file.type,
      }),
    });

    const scriptData = await scriptResponse.json();

    if (!scriptResponse.ok || !scriptData.ok) {
      throw new Error(
        scriptData.message ||
          scriptData.error ||
          "Apps Script upload failed."
      );
    }

    const now = new Date().toISOString();
    const id = `media_${Date.now()}`;

    const item = {
      id,
      file_name: String(scriptData.fileName || file.name),
      file_id: String(scriptData.fileId || ""),
      image_url: String(scriptData.url || ""),
      mime_type: file.type,
      size_bytes: String(file.size || 0),
      folder: folder || "general",
      alt_text: altText,
      created_at: now,
    };

    await appendSheetRow(SHEET_NAME, [
      item.id,
      item.file_name,
      item.file_id,
      item.image_url,
      item.mime_type,
      item.size_bytes,
      item.folder,
      item.alt_text,
      item.created_at,
    ]);

    return NextResponse.json({
      ok: true,
      message: "Media uploaded successfully.",
      item,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload media.",
      },
      {
        status: 500,
      }
    );
  }
}