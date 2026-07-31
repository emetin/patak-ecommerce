import type { ContentType } from "../import-export";
import { parseCsvImportText } from "./csv-import";
import { parseJsonImportText } from "./json-import";
import { parseXmlImportText } from "./xml-import";

export const IMPORT_FORMATS = ["csv", "json", "xml"] as const;
export type ImportFormat = (typeof IMPORT_FORMATS)[number];

const XML_ITEM_NAMES: Record<ContentType, string> = {
  products: "product",
  collections: "collection",
  blog: "post",
};

export function parseImportText(type: ContentType, format: string, text: string) {
  if (!IMPORT_FORMATS.includes(format as ImportFormat)) {
    throw new Error('Invalid import format. Use "csv", "json", or "xml".');
  }

  if (format === "json") return parseJsonImportText(text);
  if (format === "xml") {
    return parseXmlImportText(text, XML_ITEM_NAMES[type]);
  }
  return parseCsvImportText(text);
}
