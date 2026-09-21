import type { ProductFilterOption } from "@/features/catalog/model/filter-options";

function normalizeLabel(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function findExactSearchCategory(
  query: string,
  categories: readonly ProductFilterOption[],
) {
  const normalizedQuery = normalizeLabel(query);

  return categories.find(
    (category) =>
      category.count > 0 && normalizeLabel(category.label) === normalizedQuery,
  );
}
