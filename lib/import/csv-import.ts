import { parseCsv } from "../parsers/csv";

export function parseCsvImportText(text: string) {
  const rows = parseCsv(text);

  if (!rows.length) {
    throw new Error("CSV file is empty.");
  }

  const headers = rows[0].map((item) => String(item).trim());
  const dataRows = rows.slice(1);

  return dataRows.map((row) => {
    const item: Record<string, string> = {};

    headers.forEach((header, index) => {
      item[header] = String(row[index] ?? "").trim();
    });

    return item;
  });
}