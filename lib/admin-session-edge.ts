const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const ADMIN_COOKIE_NAME = "ptx_admin_auth";

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

export async function verifyAdminSessionTokenForProxy(
  token?: string | null
) {
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