export function parseWishlistProductIds(value: string | null) {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return Array.from(
      new Set(
        parsed.filter(
          (productId): productId is string =>
            typeof productId === "string" && productId.trim().length > 0,
        ),
      ),
    );
  } catch {
    return [];
  }
}
