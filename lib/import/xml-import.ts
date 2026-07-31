function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseXmlImportText(text: string, itemName: string) {
  const source = String(text || "").trim();
  if (!source) throw new Error("XML file is empty.");
  if (/<!DOCTYPE|<!ENTITY/i.test(source)) {
    throw new Error("XML document type and entity declarations are not allowed.");
  }

  const safeItemName = escapeRegExp(itemName);
  const itemPattern = new RegExp(
    `<${safeItemName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${safeItemName}>`,
    "gi"
  );
  const items: Record<string, string>[] = [];
  let itemMatch: RegExpExecArray | null;

  while ((itemMatch = itemPattern.exec(source))) {
    const record: Record<string, string> = {};
    const fieldPattern = /<([A-Za-z_][\w.-]*)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g;
    let fieldMatch: RegExpExecArray | null;

    while ((fieldMatch = fieldPattern.exec(itemMatch[1]))) {
      record[fieldMatch[1]] = decodeXml(fieldMatch[2]).trim();
    }

    if (Object.keys(record).length) items.push(record);
  }

  if (!items.length) {
    throw new Error(`XML does not contain any <${itemName}> records.`);
  }

  return items;
}
