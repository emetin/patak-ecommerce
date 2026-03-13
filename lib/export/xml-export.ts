import { createXml } from "../parsers/xml";

export function buildXmlExport(
  rootName: string,
  itemName: string,
  headers: readonly string[],
  items: Record<string, unknown>[]
) {
  return createXml(rootName, itemName, headers, items);
}