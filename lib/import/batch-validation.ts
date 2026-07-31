export function findDuplicateImportSlugs(items: Record<string, string>[]) {
  const firstIndexBySlug = new Map<string, number>();
  const duplicates: Array<{ slug: string; firstRow: number; duplicateRow: number }> = [];

  items.forEach((item, index) => {
    const slug = String(item.slug || "").trim().toLowerCase();
    if (!slug) return;

    const firstIndex = firstIndexBySlug.get(slug);
    if (firstIndex !== undefined) {
      duplicates.push({
        slug,
        firstRow: firstIndex + 2,
        duplicateRow: index + 2,
      });
      return;
    }

    firstIndexBySlug.set(slug, index);
  });

  return duplicates;
}
