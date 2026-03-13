import { parseJsonText } from "../parsers/json";

export function parseJsonImportText(text: string) {
  const items = parseJsonText(text);

  return items.map((item) => {
    const normalized: Record<string, string> = {};

    Object.entries(item).forEach(([key, value]) => {
      normalized[key] = String(value ?? "").trim();
    });

    return normalized;
  });
}