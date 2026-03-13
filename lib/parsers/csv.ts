export function parseCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);

  return result.map((value) => value.trim());
}

export function parseCsv(text: string) {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

  if (!normalized) {
    return [];
  }

  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    const next = normalized[i + 1];

    if (char === '"') {
      current += char;

      if (inQuotes && next === '"') {
        current += next;
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "\n" && !inQuotes) {
      rows.push(parseCsvLine(current));
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    rows.push(parseCsvLine(current));
  }

  return rows;
}

export function escapeCsvValue(value: unknown) {
  const stringValue = String(value ?? "");

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function createCsv(
  headers: readonly string[],
  items: Record<string, unknown>[]
) {
  const lines: string[] = [];

  lines.push(headers.map(escapeCsvValue).join(","));

  for (const item of items) {
    const row = headers.map((header) => escapeCsvValue(item[header] ?? ""));
    lines.push(row.join(","));
  }

  return lines.join("\n");
}