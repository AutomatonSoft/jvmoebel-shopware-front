import { describe, expect, test } from "bun:test";

import { parseCmsChipRailData } from "@/features/cms/contracts/chip-rail";

describe("parseCmsChipRailData", () => {
  test("parses and sorts the Store API chip rail", () => {
    const result = parseCmsChipRailData({
      chips: [
        { id: "betten", label: "Betten", position: 1, url: "/betten" },
        { id: "sofas", label: "Sofas", position: 0, url: "/sofas" },
      ],
      eyebrow: "Entdecken",
      title: "Stile",
    });

    expect(result.data).toEqual({
      chips: [
        { id: "sofas", label: "Sofas", position: 0, url: "/sofas" },
        { id: "betten", label: "Betten", position: 1, url: "/betten" },
      ],
      eyebrow: "Entdecken",
      title: "Stile",
    });
    expect(result.issues).toEqual([]);
  });

  test("omits incomplete chips and rejects an empty rail", () => {
    const result = parseCmsChipRailData({
      chips: [{ label: "Sofas" }],
      title: "Stile",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "chips.0.url",
      "chips",
    ]);
  });
});
