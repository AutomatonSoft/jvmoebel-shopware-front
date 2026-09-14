import { describe, expect, test } from "bun:test";

import { parseCmsExpertTipData } from "@/features/cms/contracts/expert-tip";

describe("parseCmsExpertTipData", () => {
  test("parses the Store API expert tip contract", () => {
    const result = parseCmsExpertTipData({
      apiAlias: "cms_jv_expert_tip",
      body: "Nutzen Sie warmes Licht am Abend.",
      label: "Tipp",
      title: "Licht",
    });

    expect(result.data).toEqual({
      body: "Nutzen Sie warmes Licht am Abend.",
      label: "Tipp",
      title: "Licht",
    });
    expect(result.issues).toEqual([]);
  });

  test("rejects incomplete expert tips", () => {
    const result = parseCmsExpertTipData({ label: "Tipp", title: "" });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual(["title", "body"]);
  });
});
