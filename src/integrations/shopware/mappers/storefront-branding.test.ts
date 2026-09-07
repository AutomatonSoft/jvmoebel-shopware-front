import { describe, expect, test } from "bun:test";

import { defaultStorefrontBranding } from "@/features/storefront-shell/model/branding";
import { parseStorefrontBranding } from "@/integrations/shopware/mappers/storefront-branding";

describe("parseStorefrontBranding", () => {
  test("parses a configured storefront logo", () => {
    expect(
      parseStorefrontBranding({
        jvStorefrontBranding: {
          logo: {
            alt: "JVMöbel home",
            height: 48,
            url: "/images/logo.svg",
            width: 180,
          },
          name: "JVMöbel",
        },
      }),
    ).toEqual({
      data: {
        logo: {
          alt: "JVMöbel home",
          height: 48,
          url: "/images/logo.svg",
          width: 180,
        },
        name: "JVMöbel",
      },
      issues: [],
    });
  });

  test("supports an HTTP media URL without changing Next image settings", () => {
    expect(
      parseStorefrontBranding({
        jvStorefrontBranding: {
          logo: {
            height: 40,
            url: "https://media.example.com/logo.svg",
            width: 160,
          },
        },
      }).data.logo,
    ).toEqual({
      alt: "JVMöbel",
      height: 40,
      url: "https://media.example.com/logo.svg",
      width: 160,
    });
  });

  test("falls back and reports incomplete or unsafe logo data", () => {
    expect(
      parseStorefrontBranding(
        {
          jvStorefrontBranding: {
            logo: {
              height: 40,
              url: "javascript:alert(1)",
            },
          },
        },
        "Configured sales channel",
      ),
    ).toEqual({
      data: { logo: undefined, name: "Configured sales channel" },
      issues: [
        {
          message:
            "Configured logo URL must be root-relative or use HTTP or HTTPS.",
          path: "jvStorefrontBranding.logo.url",
        },
        {
          message: "Configured logo width must be a positive finite number.",
          path: "jvStorefrontBranding.logo.width",
        },
      ],
    });
  });

  test("uses the documented fallback without reporting absent branding", () => {
    expect(parseStorefrontBranding(undefined)).toEqual({
      data: defaultStorefrontBranding,
      issues: [],
    });
  });
});
