import { describe, expect, test } from "bun:test";

import { defaultStorefrontFooterContent } from "@/features/storefront-shell/fixtures/footer";
import { parseShopwareStorefrontConfig } from "@/integrations/shopware/mappers/storefront-config";
import type { ShopwareStorefrontConfigResponse } from "@/integrations/shopware/storefront-config-types";

const storefrontConfigResponse = {
  apiAlias: "jv_storefront_config",
  footer: {
    about: {
      apiAlias: "jv_storefront_footer_about",
      description: "Description",
      eyebrow: "About",
      title: "Footer title",
    },
    apiAlias: "jv_storefront_footer",
    categoryNavigation: [
      {
        apiAlias: "jv_storefront_navigation_item",
        children: [
          {
            apiAlias: "jv_storefront_navigation_item",
            children: [],
            href: "/Living-Room/Sofas/",
            id: "sofas",
            label: "Sofas",
          },
        ],
        href: "/Living-Room/",
        id: "living-room",
        label: "Living Room",
      },
    ],
    copyrightText: "Copyright",
    paymentBadges: [
      {
        apiAlias: "jv_storefront_footer_payment_badge",
        icon: { alt: "Second", url: "/second.png" },
        id: "second",
        label: "Second",
        position: 2,
      },
      {
        apiAlias: "jv_storefront_footer_payment_badge",
        icon: { alt: "First", url: "/first.png" },
        id: "first",
        label: "First",
        position: 1,
      },
    ],
    revocation: {
      apiAlias: "jv_storefront_footer_revocation",
      buttonLabel: "Revoke",
      enabled: false,
      recipientEmail: "shop@example.com",
    },
    serviceNavigation: [
      {
        apiAlias: "jv_storefront_navigation_item",
        children: [],
        href: "/contact/",
        id: "contact",
        label: "Contact",
      },
    ],
    socialLinks: [
      {
        apiAlias: "jv_storefront_footer_social_link",
        icon: { alt: "Second", url: "/second-social.png" },
        id: "second-social",
        label: "Second social",
        openInNewTab: true,
        position: 2,
        url: "https://example.com/second",
      },
      {
        apiAlias: "jv_storefront_footer_social_link",
        icon: { alt: "First", url: "/first-social.png" },
        id: "first-social",
        label: "First social",
        openInNewTab: false,
        position: 1,
        url: "https://example.com/first",
      },
    ],
  },
  header: {
    apiAlias: "jv_storefront_header",
    branding: {
      apiAlias: "jv_storefront_branding",
      logo: {
        alt: "Store logo",
        height: 48,
        url: "/logo.png",
        width: 180,
      },
      name: "Store",
    },
    navigation: [
      {
        apiAlias: "jv_storefront_navigation_item",
        children: [],
        href: "/Living-Room/",
        id: "living-room",
        label: "Living Room",
      },
    ],
  },
} satisfies ShopwareStorefrontConfigResponse;

describe("parseShopwareStorefrontConfig", () => {
  test("normalizes the aggregated storefront response", () => {
    const result = parseShopwareStorefrontConfig(storefrontConfigResponse);

    expect(result.issues).toEqual([]);
    expect(result.data.branding).toEqual({
      logo: {
        alt: "Store logo",
        height: 48,
        url: "/logo.png",
        width: 180,
      },
      name: "Store",
    });
    expect(result.data.navigation).toEqual([
      {
        children: [],
        href: "/Living-Room/",
        id: "living-room",
        label: "Living Room",
      },
    ]);
    expect(result.data.footerNavigation[0]?.children).toHaveLength(1);
    expect(result.data.footerContent).toEqual({
      ...defaultStorefrontFooterContent,
      about: {
        description: "Description",
        eyebrow: "About",
        title: "Footer title",
      },
      copyright: "Copyright",
      paymentMethods: [
        {
          id: "first",
          label: "First",
          media: { alt: "First", url: "/first.png" },
        },
        {
          id: "second",
          label: "Second",
          media: { alt: "Second", url: "/second.png" },
        },
      ],
      revocation: {
        ...defaultStorefrontFooterContent.revocation,
        buttonLabel: "Revoke",
        enabled: false,
        recipient: "shop@example.com",
      },
      socialLinks: [
        {
          id: "first-social",
          label: "First social",
          media: { alt: "First", url: "/first-social.png" },
          openInNewTab: false,
          url: "https://example.com/first",
        },
        {
          id: "second-social",
          label: "Second social",
          media: { alt: "Second", url: "/second-social.png" },
          openInNewTab: true,
          url: "https://example.com/second",
        },
      ],
    });
  });

  test("falls back safely and reports an invalid response", () => {
    const result = parseShopwareStorefrontConfig(null);

    expect(result.data.footerContent).toEqual(defaultStorefrontFooterContent);
    expect(result.data.navigation).toEqual([]);
    expect(result.issues).toContainEqual({
      message: "Storefront configuration must be an object.",
      path: "storefrontConfig",
    });
  });
});
