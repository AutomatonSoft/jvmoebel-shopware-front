import { describe, expect, test } from "bun:test";

import { defaultStorefrontBranding } from "@/features/storefront-shell/model/branding";
import { parseStorefrontBranding } from "@/integrations/shopware/storefront-branding";

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
      logo: {
        alt: "JVMöbel home",
        height: 48,
        url: "/images/logo.svg",
        width: 180,
      },
      name: "JVMöbel",
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
      }).logo,
    ).toEqual({
      alt: "JVMöbel",
      height: 40,
      url: "https://media.example.com/logo.svg",
      width: 160,
    });
  });

  test("falls back when the logo data is incomplete or unsafe", () => {
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
    ).toEqual({ logo: undefined, name: "Configured sales channel" });

    expect(parseStorefrontBranding(undefined)).toEqual(
      defaultStorefrontBranding,
    );
  });
});
