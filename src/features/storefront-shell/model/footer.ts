export type StorefrontFooterMedia = Readonly<{
  alt: string;
  url: string;
}>;

export type StorefrontFooterLink = Readonly<{
  id: string;
  label: string;
  media: StorefrontFooterMedia;
  url: string;
}>;

export type StorefrontFooterPaymentMethod = Readonly<{
  id: string;
  label: string;
  media: StorefrontFooterMedia;
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
    paymentMethods: string;
    service: string;
    socialLinks: string;
  }>;
  paymentMethods: readonly StorefrontFooterPaymentMethod[];
  revocation: Readonly<{
    buttonLabel: string;
    description: string;
    disclaimer: string;
    recipient: string;
    submitLabel: string;
    title: string;
  }>;
  socialLinks: readonly StorefrontFooterLink[];
}>;
