export type StorefrontLogo = Readonly<{
  alt: string;
  height: number;
  url: string;
  width: number;
}>;

export type StorefrontBranding = Readonly<{
  logo?: StorefrontLogo;
  name: string;
}>;

export type StorefrontBrandingIssue = Readonly<{
  message: string;
  path: string;
}>;

export type StorefrontBrandingResult = Readonly<{
  data: StorefrontBranding;
  issues: readonly StorefrontBrandingIssue[];
}>;

export const defaultStorefrontBranding: StorefrontBranding = {
  name: "JVMöbel",
};
