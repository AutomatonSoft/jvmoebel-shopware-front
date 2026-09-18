import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";

import { CmsCategoryName } from "@/features/cms/components/elements/cms-category-name";

describe("CmsCategoryName", () => {
  test("renders the category name as the page heading", () => {
    const element = CmsCategoryName({
      name: "Auto & Motorrad",
    }) as ReactElement<{ children: string }>;

    expect(element.type).toBe("h1");
    expect(element.props.children).toBe("Auto & Motorrad");
  });
});
