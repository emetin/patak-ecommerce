import { NextResponse } from "next/server";
import { getBackendReadiness } from "../../../lib/backend-health";

export const dynamic = "force-dynamic";

export async function GET() {
  const readiness = getBackendReadiness();

  return NextResponse.json(
    {
      ok: true,
      service: "patak-site",
      status: readiness.ready ? "ready" : "degraded",
      timestamp: new Date().toISOString(),
    },
    {
      status: readiness.ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
