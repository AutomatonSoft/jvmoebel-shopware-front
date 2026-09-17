import { describe, expect, test } from "bun:test";

import {
  getCmsBackgroundStyle,
  getCmsVisibilityClassName,
  isPassiveCmsBlock,
} from "@/features/cms/model/layout";

describe("CMS layout", () => {
  test("maps backgrounds and responsive visibility to render properties", () => {
    expect(
      getCmsBackgroundStyle({
        backgroundColor: "#f0efe7",
        backgroundMediaMode: "cover",
        backgroundMediaUrl: "https://example.com/section.jpg",
      }),
    ).toEqual({
      backgroundColor: "#f0efe7",
      backgroundImage: 'url("https://example.com/section.jpg")',
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    });
    expect(
      getCmsVisibilityClassName({
        desktop: false,
        mobile: false,
        tablet: false,
      }),
    ).toBe("max-md:hidden md:max-lg:hidden lg:hidden");
  });

  test("recognizes the Shopware sidebar filter handled by the catalog", () => {
    expect(
      isPassiveCmsBlock({
        id: "filter-block",
        position: 0,
        sectionPosition: "sidebar",
        slots: [
          {
            id: "filter-slot",
            slot: "content",
            type: "sidebar-filter",
          },
        ],
        type: "sidebar-filter",
      }),
    ).toBe(true);
  });
});
