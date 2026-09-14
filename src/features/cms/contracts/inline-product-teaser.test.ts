import { describe, expect, test } from "bun:test";

import { parseCmsInlineProductTeaserData } from "@/features/cms/contracts/inline-product-teaser";

describe("parseCmsInlineProductTeaserData", () => {
  test("parses the Store API inline product teaser contract", () => {
    const result = parseCmsInlineProductTeaserData({
      description: "Bouclé",
      image: { alt: "Noma Chair", url: "/media/noma.webp" },
      link: { label: "Noma Chair", url: "/product/noma" },
      name: "Noma Chair",
      productId: "019fef2fb9e87af48c6596097b5c43c1",
    });

    expect(result.data).toEqual({
      description: "Bouclé",
      image: { alt: "Noma Chair", url: "/media/noma.webp" },
      link: {
        label: "Noma Chair",
        size: "medium",
        url: "/product/noma",
      },
      name: "Noma Chair",
      productId: "019fef2fb9e87af48c6596097b5c43c1",
    });
    expect(result.issues).toEqual([]);
  });

  test("rejects incomplete product data", () => {
    const result = parseCmsInlineProductTeaserData({
      image: {},
      link: { label: "Noma Chair" },
      name: "Noma Chair",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "productId",
      "image.url",
      "link",
    ]);
  });
});
