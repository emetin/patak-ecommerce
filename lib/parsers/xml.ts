function escapeXml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function createXml(
  rootName: string,
  itemName: string,
  headers: readonly string[],
  items: Record<string, unknown>[]
) {
  const rows = items
    .map((item) => {
      const fields = headers
        .map((header) => {
          return `    <${header}>${escapeXml(item[header] ?? "")}</${header}>`;
        })
        .join("\n");

      return `  <${itemName}>\n${fields}\n  </${itemName}>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${rows}\n</${rootName}>`;
}