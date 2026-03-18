import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_CSRF_COOKIE_NAME,
  getExpiredAdminCookieOptions,
  getExpiredCsrfCookieOptions,
} from "../../../../lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({
    ok: true,
    message: "Çıkış yapıldı.",
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    ...getExpiredAdminCookieOptions(),
  });

  response.cookies.set({
    name: ADMIN_CSRF_COOKIE_NAME,
    value: "",
    ...getExpiredCsrfCookieOptions(),
  });

  return response;
}