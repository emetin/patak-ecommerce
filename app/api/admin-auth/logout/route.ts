import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_CSRF_COOKIE_NAME,
  getExpiredAdminCookieOptions,
  getExpiredCsrfCookieOptions,
} from "../../../../lib/admin-auth";

function createLogoutResponse(request: Request) {
  const response = NextResponse.redirect(
    new URL("/portal-ptx-admin", request.url),
    { status: 303 }
  );

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

export async function POST(request: Request) {
  return createLogoutResponse(request);
}

export async function GET(request: Request) {
  return createLogoutResponse(request);
}