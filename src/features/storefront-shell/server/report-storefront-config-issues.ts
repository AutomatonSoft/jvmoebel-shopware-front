import "server-only";

import type { StorefrontConfigIssue } from "@/features/storefront-shell/model/storefront-config";

export function reportStorefrontConfigIssues(
  issues: readonly StorefrontConfigIssue[],
): void {
  if (issues.length === 0) {
    return;
  }

  console.error("Storefront configuration issue.", {
    code: "invalid-storefront-configuration",
    issues,
  });
}
