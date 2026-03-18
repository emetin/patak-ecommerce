import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_CSRF_COOKIE_NAME,
  createAdminSessionToken,
  getAdminCookieOptions,
  hasAdminCredentialsConfigured,
  verifyAdminCredentials,
  verifyCsrfToken,
} from "../../../../lib/admin-auth";
import {
  clearFailedAttempts,
  getClientIdentifier,
  getRateLimitStatus,
  registerFailedAttempt,
} from "../../../../lib/admin-rate-limit";

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    if (!hasAdminCredentialsConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "ADMIN_PORTAL_USERNAME, ADMIN_PASSWORD_HASH veya ADMIN_SESSION_SECRET tanımlı değil.",
        },
        { status: 500 }
      );
    }

    const clientKey = `admin-login:${getClientIdentifier(req)}`;
    const limitStatus = getRateLimitStatus(clientKey);

    if (!limitStatus.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: `Çok fazla başarısız giriş denemesi. Lütfen ${limitStatus.retryAfterSeconds} saniye sonra tekrar deneyin.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(limitStatus.retryAfterSeconds),
          },
        }
      );
    }

    const csrfHeader = req.headers.get("x-csrf-token");
    const csrfCookie = req.headers.get("cookie") || "";
    const csrfMatch = csrfCookie.match(/ptx_admin_csrf=([^;]+)/);
    const csrfCookieToken = csrfMatch ? decodeURIComponent(csrfMatch[1]) : null;

    if (!verifyCsrfToken(csrfCookieToken, csrfHeader)) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz güvenlik doğrulaması." },
        { status: 403 }
      );
    }

    const body = (await req.json()) as LoginBody;

    const username = String(body?.username || "");
    const password = String(body?.password || "");

    if (!username.trim() || !password) {
      return NextResponse.json(
        { ok: false, error: "Kullanıcı adı ve şifre zorunludur." },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminCredentials(username, password);

    if (!isValid) {
      registerFailedAttempt(clientKey);

      return NextResponse.json(
        { ok: false, error: "Kullanıcı adı veya şifre hatalı." },
        { status: 401 }
      );
    }

    clearFailedAttempts(clientKey);

    const token = await createAdminSessionToken();

    const response = NextResponse.json({
      ok: true,
      message: "Giriş başarılı.",
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      ...getAdminCookieOptions(),
    });

    response.cookies.set({
      name: ADMIN_CSRF_COOKIE_NAME,
      value: "",
      path: "/",
      maxAge: 0,
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