import { describe, expect, test } from "bun:test";

import { parseCmsHomeEditorialData } from "@/features/cms/contracts/home-editorial";

describe("parseCmsHomeEditorialData", () => {
  test("parses paragraphs and sorts editorial sections", () => {
    const result = parseCmsHomeEditorialData({
      introduction: ["First introduction.", "Second introduction."],
      sections: {
        second: {
          paragraphs: ["Second section."],
          position: 1,
          title: "Second",
        },
        first: {
          id: "first-section",
          paragraphs: ["First section."],
          position: 0,
          title: "First",
        },
      },
      showLessLabel: "Show less",
      showMoreLabel: "Show more",
      statement: "Our service promise.",
      title: "Welcome",
    });

    expect(result.issues).toEqual([]);
    expect(result.data?.sections.map((section) => section.id)).toEqual([
      "first-section",
      "second",
    ]);
    expect(result.data?.introduction).toEqual([
      "First introduction.",
      "Second introduction.",
    ]);
  });

  test("omits invalid paragraphs and sections", () => {
    const result = parseCmsHomeEditorialData({
      introduction: ["Valid introduction.", ""],
      sections: [{ paragraphs: ["Valid section."] }, { paragraphs: [] }],
      showLessLabel: "Show less",
      showMoreLabel: "Show more",
      statement: "Our service promise.",
      title: "Welcome",
    });

    expect(result.data?.sections).toHaveLength(1);
    expect(result.data?.introduction).toEqual(["Valid introduction."]);
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "introduction.1",
      "sections.1.paragraphs",
    ]);
  });

  test("rejects incomplete editorial content", () => {
    const result = parseCmsHomeEditorialData({
      introduction: [],
      sections: [],
      title: "Welcome",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "introduction",
      "sections",
      "showLessLabel",
      "showMoreLabel",
      "statement",
    ]);
  });
});
