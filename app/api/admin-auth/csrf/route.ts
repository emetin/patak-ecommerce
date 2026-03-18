import { NextResponse } from "next/server";
import {
  ADMIN_CSRF_COOKIE_NAME,
  createCsrfToken,
  getCsrfCookieOptions,
} from "../../../../lib/admin-auth";

export async function GET() {
  const csrfToken = createCsrfToken();

  const response = NextResponse.json({
    ok: true,
    csrfToken,
  });

  response.cookies.set({
    name: ADMIN_CSRF_COOKIE_NAME,
    value: csrfToken,
    ...getCsrfCookieOptions(),
  });

  return response;
}