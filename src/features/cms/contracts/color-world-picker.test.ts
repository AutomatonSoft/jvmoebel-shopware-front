import { describe, expect, test } from "bun:test";

import { parseCmsColorWorldPickerData } from "@/features/cms/contracts/color-world-picker";

describe("parseCmsColorWorldPickerData", () => {
  test("parses and sorts color worlds", () => {
    const result = parseCmsColorWorldPickerData({
      colors: [
        {
          hex: "#223344",
          id: "blue",
          image: { url: "/media/blue.webp" },
          name: "Nachtblau",
          position: 2,
          url: "/farben/blau",
        },
        {
          hex: "#E8DCC8",
          id: "sand",
          image: { alt: "Sand", url: "/media/sand.webp" },
          name: "Sand",
          position: 0,
          url: "/farben/sand",
        },
      ],
      description: "Warme Töne",
      title: "Farben entdecken",
    });

    expect(result.data?.colors.map((color) => color.id)).toEqual([
      "sand",
      "blue",
    ]);
    expect(result.data?.colors[1]?.image.alt).toBe("Nachtblau");
    expect(result.issues).toEqual([]);
  });

  test("rejects invalid colors", () => {
    const result = parseCmsColorWorldPickerData({
      colors: [
        {
          hex: "sand",
          image: { url: "/media/sand.webp" },
          name: "Sand",
          url: "/farben/sand",
        },
      ],
      title: "Farben entdecken",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "colors.0.hex",
      "colors",
    ]);
  });
});
