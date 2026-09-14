import { describe, expect, test } from "bun:test";

import { parseCmsLookSceneData } from "@/features/cms/contracts/look-scene";

describe("parseCmsLookSceneData", () => {
  test("parses and sorts a look scene", () => {
    const result = parseCmsLookSceneData({
      description: "Kuratiert",
      image: { alt: "Wohnzimmer", url: "/media/living-scene.webp" },
      products: [
        { id: "table", name: "Luna Tisch", position: 2, url: "/tisch" },
        { id: "sofa", name: "Alba Sofa", position: 0, url: "/sofa" },
      ],
      title: "Wohnzimmer",
      viewAll: { label: "Alle ansehen", url: "/living" },
    });

    expect(result.data?.products.map((product) => product.id)).toEqual([
      "sofa",
      "table",
    ]);
    expect(result.data?.viewAll).toEqual({
      label: "Alle ansehen",
      size: "medium",
      url: "/living",
    });
    expect(result.issues).toEqual([]);
  });

  test("rejects a scene without an image and valid products", () => {
    const result = parseCmsLookSceneData({
      image: {},
      products: [{ name: "Alba Sofa" }],
      title: "Wohnzimmer",
      viewAll: { label: "Alle ansehen" },
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "image.url",
      "products.0.url",
      "viewAll",
      "products",
    ]);
  });
});
