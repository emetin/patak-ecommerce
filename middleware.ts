import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "ptx_admin_auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isPortalRoute = pathname.startsWith("/portal-ptx-admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin-auth");

  if (!isAdminRoute && !isPortalRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value === "ok";

  if (isAdminRoute && !authCookie) {
    return NextResponse.redirect(new URL("/portal-ptx-admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal-ptx-admin", "/api/admin-auth/:path*"],
};