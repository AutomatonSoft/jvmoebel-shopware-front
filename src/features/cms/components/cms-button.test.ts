import { describe, expect, test } from "bun:test";

import {
  type CmsButtonSize,
  resolveCmsButtonSize,
} from "@/features/cms/model/button-size";

describe("resolveCmsButtonSize", () => {
  const cases: [unknown, CmsButtonSize][] = [
    ["small", "small"],
    ["medium", "medium"],
    ["large", "large"],
    ["unexpected", "medium"],
    [undefined, "medium"],
  ];

  test.each(cases)("resolves %s as %s", (value, expected) => {
    expect(resolveCmsButtonSize(value)).toBe(expected);
  });
});
