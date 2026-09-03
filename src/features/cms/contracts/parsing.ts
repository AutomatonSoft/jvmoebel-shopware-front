export type CmsDataRecord = Record<string, unknown>;

export function getCmsRecord(value: unknown): CmsDataRecord | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }

  return value as CmsDataRecord;
}

export function getCmsString(
  record: CmsDataRecord | undefined,
  key: string,
): string | undefined {
  const value = record?.[key];

  return typeof value === "string" && value.trim() ? value : undefined;
}

export function getCmsNumber(
  record: CmsDataRecord | undefined,
  key: string,
): number | undefined {
  const value = record?.[key];

  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}
