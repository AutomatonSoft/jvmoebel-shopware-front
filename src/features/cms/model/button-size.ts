export type CmsButtonSize = "small" | "medium" | "large";

export function resolveCmsButtonSize(value: unknown): CmsButtonSize {
  return value === "small" || value === "large" ? value : "medium";
}
