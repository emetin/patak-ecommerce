import { NextResponse } from "next/server";
import { getBackendReadiness } from "../../../../lib/backend-health";
import { getSheetData } from "../../../../lib/sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  const readiness = getBackendReadiness();
  let catalog: { reachable: boolean; productCount?: number; error?: string };

  try {
    const products = await getSheetData("products", { forceFresh: true });
    catalog = { reachable: true, productCount: products.length };
  } catch (error) {
    catalog = {
      reachable: false,
      error: error instanceof Error ? error.message : "Catalog connection failed.",
    };
  }

  const healthy = readiness.ready && catalog.reachable;

  return NextResponse.json(
    {
      ok: healthy,
      status: healthy ? "ready" : "degraded",
      configuration: readiness,
      dependencies: { catalog },
      responseTimeMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
