import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "ptx_admin_auth";

export async function POST() {
  const response = NextResponse.json({
    ok: true,
    message: "Çıkış yapıldı.",
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}