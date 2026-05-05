const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const ADMIN_COOKIE_NAME = "ptx_admin_auth";
export const ADMIN_CSRF_COOKIE_NAME = "ptx_admin_csrf";
export const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 8;
export const ADMIN_CSRF_DURATION_SECONDS = 60 * 30;

type AdminSessionPayload = {
  sub: "admin";
  exp: number;
  iat: number;
  nonce: string;
};

function isAdminAuthDisabled() {
  return process.env.ADMIN_AUTH_DISABLED === "true";
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  const base64 = btoa(binary);

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function stringToBase64Url(value: string) {
  return bytesToBase64Url(encoder.encode(value));
}

function base64UrlToBytes(base64Url: string) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function getSigningKey() {
  const secret = getRequiredEnv("ADMIN_SESSION_SECRET");

  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function signValue(value: string) {
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  return bytesToBase64Url(new Uint8Array(signature));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return result === 0;
}

function nowInSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function createNonce(size = 24) {
  const bytes = crypto.getRandomValues(new Uint8Array(size));

  return bytesToBase64Url(bytes);
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  };
}

export function getExpiredAdminCookieOptions() {
  return {
    ...getAdminCookieOptions(),
    maxAge: 0,
  };
}

export function getCsrfCookieOptions() {
  return {
    httpOnly: false,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_CSRF_DURATION_SECONDS,
  };
}

export function getExpiredCsrfCookieOptions() {
  return {
    ...getCsrfCookieOptions(),
    maxAge: 0,
  };
}

export async function createAdminSessionToken() {
  if (isAdminAuthDisabled()) {
    return "dev-admin-bypass-token";
  }

  const payload: AdminSessionPayload = {
    sub: "admin",
    iat: nowInSeconds(),
    exp: nowInSeconds() + ADMIN_SESSION_DURATION_SECONDS,
    nonce: createNonce(16),
  };

  const header = {
    alg: "HS256",
    typ: "PTX-AUTH",
  };

  const encodedHeader = stringToBase64Url(JSON.stringify(header));
  const encodedPayload = stringToBase64Url(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = await signValue(unsignedToken);

  return `${unsignedToken}.${signature}`;
}

export async function verifyAdminSessionToken(token?: string | null) {
  if (isAdminAuthDisabled()) {
    return true;
  }

  if (!token) {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  const [encodedHeader, encodedPayload, receivedSignature] = parts;
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = await signValue(unsignedToken);

  if (!safeEqual(receivedSignature, expectedSignature)) {
    return false;
  }

  try {
    const payloadJson = decoder.decode(base64UrlToBytes(encodedPayload));
    const payload = JSON.parse(payloadJson) as Partial<AdminSessionPayload>;

    if (payload.sub !== "admin") {
      return false;
    }

    if (typeof payload.exp !== "number" || payload.exp <= nowInSeconds()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function isAuthenticatedAdmin(cookieValue?: string | null) {
  if (isAdminAuthDisabled()) {
    return true;
  }

  return verifyAdminSessionToken(cookieValue);
}

export function createCsrfToken() {
  return createNonce(24);
}

export function verifyCsrfToken(
  cookieToken?: string | null,
  headerToken?: string | null
) {
  if (isAdminAuthDisabled()) {
    return true;
  }

  if (!cookieToken || !headerToken) {
    return false;
  }

  return safeEqual(cookieToken, headerToken);
}