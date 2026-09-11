export type ShopwareStorefrontMedia = Readonly<{
  alt?: string;
  apiAlias?: string;
  height?: number;
  url: string;
  width?: number;
}>;

export type ShopwareStorefrontNavigationItem = Readonly<{
  apiAlias?: string;
  childCount?: number;
  children: readonly ShopwareStorefrontNavigationItem[];
  href: string;
  id: string;
  label: string;
  type?: "folder" | "link" | "page";
}>;

export type ShopwareStorefrontConfigResponse = Readonly<{
  apiAlias?: string;
  footer: Readonly<{
    about: Readonly<{
      apiAlias?: string;
      description: string;
      eyebrow: string;
      title: string;
    }>;
    apiAlias?: string;
    categoryNavigation: readonly ShopwareStorefrontNavigationItem[];
    copyrightText: string;
    paymentBadges: readonly Readonly<{
      apiAlias?: string;
      icon: ShopwareStorefrontMedia;
      id: string;
      label: string;
      position: number;
    }>[];
    revocation: Readonly<{
      apiAlias?: string;
      buttonLabel: string | null;
      description?: string;
      disclaimer?: string;
      enabled: boolean;
      recipientEmail: string | null;
      submitLabel?: string;
      title?: string;
    }>;
    serviceNavigation: readonly ShopwareStorefrontNavigationItem[];
    socialLinks: readonly Readonly<{
      apiAlias?: string;
      icon: ShopwareStorefrontMedia;
      id: string;
      label: string;
      openInNewTab: boolean;
      position: number;
      url: string;
    }>[];
  }>;
  header: Readonly<{
    apiAlias?: string;
    branding: Readonly<{
      apiAlias?: string;
      logo?: ShopwareStorefrontMedia &
        Readonly<{
          height: number;
          width: number;
        }>;
      name: string;
    }>;
    navigation: readonly ShopwareStorefrontNavigationItem[];
  }>;
}>;
