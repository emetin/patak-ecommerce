type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitPolicy = {
  limit: number;
  windowMs: number;
  maxBodyBytes: number;
};

const entries = new Map<string, RateLimitEntry>();

const POLICIES: Record<string, RateLimitPolicy> = {
  contact: { limit: 5, windowMs: 10 * 60_000, maxBodyBytes: 32_000 },
  newsletter: { limit: 10, windowMs: 10 * 60_000, maxBodyBytes: 8_000 },
  career: { limit: 3, windowMs: 30 * 60_000, maxBodyBytes: 6 * 1024 * 1024 },
};

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function guardPublicRequest(
  request: Request,
  scope: keyof typeof POLICIES,
  currentTime = Date.now()
) {
  const policy = POLICIES[scope];
  const contentLength = Number(request.headers.get("content-length") || "0");

  if (Number.isFinite(contentLength) && contentLength > policy.maxBodyBytes) {
    return {
      allowed: false,
      status: 413,
      error: "Request body is too large.",
      retryAfterSeconds: 0,
      remaining: 0,
    };
  }

  const key = `${scope}:${getClientIp(request)}`;
  const current = entries.get(key);
  const entry = !current || currentTime >= current.resetAt
    ? { count: 0, resetAt: currentTime + policy.windowMs }
    : current;

  if (entry.count >= policy.limit) {
    return {
      allowed: false,
      status: 429,
      error: "Too many requests. Please try again later.",
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - currentTime) / 1000)),
      remaining: 0,
    };
  }

  entry.count += 1;
  entries.set(key, entry);

  return {
    allowed: true,
    status: 200,
    error: "",
    retryAfterSeconds: 0,
    remaining: policy.limit - entry.count,
  };
}

export function resetPublicRequestGuards() {
  entries.clear();
}
