import { createCsv } from "../parsers/csv";

export function buildCsvExport(
  headers: string[],
  items: Record<string, unknown>[]
) {
  return createCsv(headers, items);
}