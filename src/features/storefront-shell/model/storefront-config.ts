import type { StorefrontBranding } from "@/features/storefront-shell/model/branding";
import type { StorefrontFooterContent } from "@/features/storefront-shell/model/footer";
import type { MainNavigation } from "@/features/storefront-shell/model/navigation";

export type StorefrontShellData = Readonly<{
  branding: StorefrontBranding;
  footerContent: StorefrontFooterContent;
  footerNavigation: MainNavigation;
  navigation: MainNavigation;
  serviceNavigation: MainNavigation;
}>;

export type StorefrontConfigIssue = Readonly<{
  message: string;
  path: string;
}>;

export type StorefrontConfigResult = Readonly<{
  data: StorefrontShellData;
  issues: readonly StorefrontConfigIssue[];
}>;
