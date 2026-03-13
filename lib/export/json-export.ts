export function buildJsonExport(items: Record<string, unknown>[]) {
  return JSON.stringify(items, null, 2);
}