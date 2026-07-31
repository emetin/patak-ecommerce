function normalizeText(value?: string) {
  return String(value || "").trim();
}

function isInvalidImageReference(value: string) {
  const normalized = value.trim().toLowerCase();

  if (!normalized) return true;

  if (normalized.startsWith("img_")) return true;
  if (normalized.startsWith("var_")) return true;
  if (normalized.startsWith("prd_")) return true;
  if (normalized.startsWith("col_")) return true;
  if (normalized.startsWith("blog_")) return true;

  if (normalized === "default") return true;
  if (normalized === "null") return true;
  if (normalized === "undefined") return true;
  if (normalized === "-") return true;

  return false;
}

function isProbablyImagePath(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized.startsWith("/uploads/")) return true;
  if (normalized.startsWith("/images/")) return true;
  if (normalized.startsWith("/assets/")) return true;
  if (normalized.startsWith("http://")) return true;
  if (normalized.startsWith("https://")) return true;
  if (normalized.startsWith("data:image/")) return true;

  return false;
}

export function extractGoogleDriveFileId(url: string) {
  const value = normalizeText(url);

  if (!value) {
    return "";
  }

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /\/thumbnail\?id=([a-zA-Z0-9_-]+)/,
    /\/uc\?(?:[^#]*&)?id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);

    if (match?.[1]) {
      return match[1];
    }
  }

  return "";
}

export function normalizeImageUrl(url?: string) {
  const value = normalizeText(url);

  if (!value) {
    return "";
  }

  if (isInvalidImageReference(value)) {
    return "";
  }

  if (
    value.includes("drive.google.com") ||
    value.includes("docs.google.com") ||
    value.includes("lh3.googleusercontent.com")
  ) {
    const fileId = extractGoogleDriveFileId(value);

    if (fileId) {
      return `https://lh3.googleusercontent.com/d/${fileId}=w2000`;
    }
  }

  if (!isProbablyImagePath(value)) {
    return "";
  }

  return value;
}

export function normalizeImageUrls(urls: string[]) {
  return urls
    .map((item) => normalizeImageUrl(item))
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getCanonicalImageKey(url?: string) {
  const normalized = normalizeImageUrl(url);

  if (!normalized) {
    return "";
  }

  const driveId = extractGoogleDriveFileId(normalized);

  if (driveId) {
    return `drive:${driveId}`;
  }

  return normalized.trim().toLowerCase();
}

export function areSameImageUrls(a?: string, b?: string) {
  const aKey = getCanonicalImageKey(a);
  const bKey = getCanonicalImageKey(b);

  if (!aKey || !bKey) {
    return false;
  }

  return aKey === bKey;
}

export function uniqueImageUrls(urls: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of urls) {
    const normalized = normalizeImageUrl(raw);
    const key = getCanonicalImageKey(normalized);

    if (!normalized || !key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(normalized);
  }

  return result;
}
