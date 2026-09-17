import { describe, expect, spyOn, test } from "bun:test";
import type { ReactElement } from "react";

import {
  createCmsElementRenderer,
  type CmsElementProps,
} from "@/features/cms/components/cms-element";
import type { CmsSlot } from "@/features/cms/model/page";

type TestData = Readonly<{ label: string }>;

const slot: CmsSlot = {
  config: null,
  data: { label: "Valid" },
  id: "test-slot",
  slot: "content",
  type: "test",
};

function TestElement({ data, id }: CmsElementProps<TestData>) {
  return <div data-id={id}>{data.label}</div>;
}

describe("createCmsElementRenderer", () => {
  test("passes validated data and the slot ID to the element", () => {
    const Renderer = createCmsElementRenderer(
      () => ({ data: { label: "Valid" }, issues: [] }),
      TestElement,
    );
    const element = Renderer({ slot }) as ReactElement<
      CmsElementProps<TestData>
    >;

    expect(element.type).toBe(TestElement);
    expect(element.props).toEqual({
      data: { label: "Valid" },
      id: "test-slot",
    });
  });

  test("reports invalid data before skipping the element", () => {
    const consoleError = spyOn(console, "error").mockImplementation(() => {});
    const Renderer = createCmsElementRenderer<TestData>(
      () => ({
        data: null,
        issues: [{ message: "Invalid test data.", path: "label" }],
      }),
      TestElement,
    );

    try {
      expect(Renderer({ slot })).toBeNull();
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(
        "CMS rendering issue.",
        expect.objectContaining({
          code: "invalid-element-data",
          slot: { id: "test-slot", name: "content", type: "test" },
        }),
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});
