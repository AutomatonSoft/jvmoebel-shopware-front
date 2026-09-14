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
    internationalLinks: [
      {
        apiAlias: "jv_storefront_footer_international_link",
        icon: { alt: "Austria", url: "/austria.png" },
        id: "austria",
        label: "AT",
        openInNewTab: true,
        position: 1,
        targetSalesChannelId: "austria-sales-channel",
        url: "https://example.at",
      },
    ],
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
    shippingBadges: [
      {
        apiAlias: "jv_storefront_footer_shipping_badge",
        icon: { alt: "Freight delivery", url: "/freight.png" },
        id: "freight",
        label: null,
        position: 1,
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
      internationalLinks: [
        {
          id: "austria",
          label: "AT",
          media: { alt: "Austria", url: "/austria.png" },
          openInNewTab: true,
          targetSalesChannelId: "austria-sales-channel",
          url: "https://example.at",
        },
      ],
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
      shippingBadges: [
        {
          id: "freight",
          label: "Freight delivery",
          media: { alt: "Freight delivery", url: "/freight.png" },
        },
      ],
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

  test("requires revocation contact fields only when revocation is enabled", () => {
    const revocationWithoutContact = {
      ...storefrontConfigResponse,
      footer: {
        ...storefrontConfigResponse.footer,
        revocation: {
          ...storefrontConfigResponse.footer.revocation,
          buttonLabel: null,
          recipientEmail: null,
        },
      },
    } satisfies ShopwareStorefrontConfigResponse;

    const disabledResult = parseShopwareStorefrontConfig(
      revocationWithoutContact,
    );
    const enabledResult = parseShopwareStorefrontConfig({
      ...revocationWithoutContact,
      footer: {
        ...revocationWithoutContact.footer,
        revocation: {
          ...revocationWithoutContact.footer.revocation,
          enabled: true,
        },
      },
    });

    expect(disabledResult.issues).toEqual([]);
    expect(disabledResult.data.footerContent.revocation.enabled).toBe(false);
    expect(enabledResult.issues.map(({ path }) => path)).toEqual(
      expect.arrayContaining([
        "footer.revocation.buttonLabel",
        "footer.revocation.recipientEmail",
      ]),
    );
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
