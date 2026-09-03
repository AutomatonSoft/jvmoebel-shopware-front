import "server-only";

import type { StorefrontBrandingIssue } from "@/features/storefront-shell/model/branding";

export function reportStorefrontBrandingIssues(
  issues: readonly StorefrontBrandingIssue[],
): void {
  if (issues.length === 0) {
    return;
  }

  console.error("Storefront branding issue.", {
    code: "invalid-branding-configuration",
    issues,
  });
}
