export function parseJsonText(text: string) {
  const parsed = JSON.parse(text);

  if (!Array.isArray(parsed)) {
    throw new Error("JSON import payload must be an array.");
  }

  return parsed as Record<string, unknown>[];
}