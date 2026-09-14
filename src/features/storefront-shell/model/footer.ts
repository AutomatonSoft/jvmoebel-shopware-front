export type StorefrontFooterMedia = Readonly<{
  alt: string;
  url: string;
}>;

export type StorefrontFooterLink = Readonly<{
  id: string;
  label: string;
  media: StorefrontFooterMedia;
  openInNewTab: boolean;
  url: string;
}>;

export type StorefrontFooterPaymentMethod = Readonly<{
  id: string;
  label: string;
  media: StorefrontFooterMedia;
}>;

export type StorefrontFooterShippingBadge = Readonly<{
  id: string;
  label: string;
  media: StorefrontFooterMedia;
}>;

export type StorefrontFooterInternationalLink = Readonly<{
  id: string;
  label: string;
  media: StorefrontFooterMedia;
  openInNewTab: boolean;
  targetSalesChannelId: string;
  url: string;
}>;

export type StorefrontFooterContent = Readonly<{
  about: Readonly<{
    description: string;
    eyebrow: string;
    title: string;
  }>;
  copyright: string;
  headings: Readonly<{
    categories: string;
    internationalLinks: string;
    paymentMethods: string;
    service: string;
    shippingBadges: string;
    socialLinks: string;
  }>;
  internationalLinks: readonly StorefrontFooterInternationalLink[];
  paymentMethods: readonly StorefrontFooterPaymentMethod[];
  revocation: Readonly<{
    buttonLabel: string;
    description: string;
    disclaimer: string;
    enabled: boolean;
    recipient: string;
    submitLabel: string;
    title: string;
  }>;
  shippingBadges: readonly StorefrontFooterShippingBadge[];
  socialLinks: readonly StorefrontFooterLink[];
}>;
