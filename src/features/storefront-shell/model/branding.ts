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

export const defaultStorefrontBranding: StorefrontBranding = {
  name: "JVMöbel",
};
