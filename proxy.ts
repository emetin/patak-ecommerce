import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ADMIN_COOKIE_NAME } from "./lib/admin-auth";

function isAuthDisabled() {
  return process.env.ADMIN_AUTH_DISABLED === "true";
}

function isProtectedApiRoute(pathname: string) {
  return (
    pathname.startsWith("/api/admin/") ||
    pathname.startsWith("/api/products/") ||
    pathname.startsWith("/api/variants/") ||
    pathname.startsWith("/api/product-images/") ||
    pathname.startsWith("/api/media/") ||
    pathname.startsWith("/api/blog/") ||
    pathname.startsWith("/api/collections/")
  );
}

function isAllowedAdminAuthRoute(pathname: string) {
  return (
    pathname === "/api/admin-auth/login" ||
    pathname === "/api/admin-auth/logout" ||
    pathname === "/api/admin-auth/csrf"
  );
}

function hasAdminCookie(request: NextRequest) {
  return Boolean(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isPortalRoute = pathname === "/portal-ptx-admin";
  const isAdminAuthRoute = pathname.startsWith("/api/admin-auth");
  const protectedApiRoute = isProtectedApiRoute(pathname);

  if (!isAdminRoute && !isPortalRoute && !isAdminAuthRoute && !protectedApiRoute) {
    return NextResponse.next();
  }

  if (isAuthDisabled()) {
    if (isPortalRoute) {
      return NextResponse.redirect(new URL("/admin/products", request.url));
    }

    return NextResponse.next();
  }

  if (isAdminAuthRoute && isAllowedAdminAuthRoute(pathname)) {
    return NextResponse.next();
  }

  const loggedIn = hasAdminCookie(request);

  if (isPortalRoute) {
    if (loggedIn) {
      return NextResponse.redirect(new URL("/admin/products", request.url));
    }

    return NextResponse.next();
  }

  if (!loggedIn) {
    if (protectedApiRoute) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    return NextResponse.redirect(new URL("/portal-ptx-admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/portal-ptx-admin",
    "/api/admin-auth/:path*",
    "/api/admin/:path*",
    "/api/products/:path*",
    "/api/variants/:path*",
    "/api/product-images/:path*",
    "/api/media/:path*",
    "/api/blog/:path*",
    "/api/collections/:path*",
  ],
};