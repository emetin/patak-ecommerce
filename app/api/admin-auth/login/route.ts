import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "ptx_admin_auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = String(body?.password || "");

    const adminPassword = process.env.ADMIN_PORTAL_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { ok: false, error: "ADMIN_PORTAL_PASSWORD tanımlı değil." },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { ok: false, error: "Şifre hatalı." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      message: "Giriş başarılı.",
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: "ok",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Giriş sırasında bilinmeyen bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}