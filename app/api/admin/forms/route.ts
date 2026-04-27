import { NextRequest, NextResponse } from "next/server";
import { getFormSheetData } from "../../../../lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;


type FormType = "contact" | "newsletter" | "career";
type FormRecord = Record<string, string>;

const FORM_SHEETS: Record<FormType, string> = {
  contact: "contact_messages",
  newsletter: "newsletter_subscribers",
  career: "career_applications",
};

function normalize(value: unknown): string {
  return String(value || "").trim();
}

function normalizeLower(value: unknown): string {
  return normalize(value).toLowerCase();
}

function getSafeUrl(value: unknown): string {
  const url = normalize(value);

  if (!url) return "";

  if (
    url.startsWith("https://drive.google.com/") ||
    url.startsWith("https://docs.google.com/")
  ) {
    return url;
  }

  return "";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const typeParam = normalizeLower(searchParams.get("type"));
    const q = normalizeLower(searchParams.get("q"));
    const status = normalizeLower(searchParams.get("status"));

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      100,
      Math.max(10, Number(searchParams.get("limit") || 50))
    );

    if (
      typeParam !== "contact" &&
      typeParam !== "newsletter" &&
      typeParam !== "career"
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid form type." },
        { status: 400 }
      );
    }

    const type: FormType = typeParam;
    const sheetName = FORM_SHEETS[type];

    const rows = (await getFormSheetData(sheetName)) as FormRecord[];

    const normalizedRows: FormRecord[] = rows.map((item) => {
      const record: FormRecord = { ...item };

      record.resume_url = getSafeUrl(record.resume_url);
      record.resume_file_id = normalize(record.resume_file_id);
      record.resume_file_name = normalize(record.resume_file_name);
      record.status = normalize(record.status);
      record.created_at = normalize(record.created_at);

      return record;
    });

    const filteredRows = normalizedRows.filter((item) => {
      const searchable = Object.values(item).join(" ").toLowerCase();

      if (q && !searchable.includes(q)) {
        return false;
      }

      if (status && status !== "all" && normalizeLower(item.status) !== status) {
        return false;
      }

      return true;
    });

    const sortedRows = [...filteredRows].sort((a, b) =>
      normalize(b.created_at).localeCompare(normalize(a.created_at))
    );

    const start = (page - 1) * limit;
    const items = sortedRows.slice(start, start + limit);

    return NextResponse.json({
      ok: true,
      type,
      items,
      total: filteredRows.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(filteredRows.length / limit)),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load form records.",
      },
      { status: 500 }
    );
  }
}