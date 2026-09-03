import { describe, expect, spyOn, test } from "bun:test";
import type { ReactElement } from "react";

import type { CmsSlotComponentProps } from "@/features/cms/components/cms-page-renderer";
import { CmsText } from "@/features/cms/components/elements/cms-text";

type CmsTextElement = ReactElement<{
  dangerouslySetInnerHTML: { __html: string };
}>;

function createTextSlot({
  config,
  data,
}: {
  config?: unknown;
  data?: unknown;
} = {}) {
  return {
    id: "text-slot",
    slot: "content",
    type: "text",
    config,
    data,
  } as unknown as CmsSlotComponentProps["slot"];
}

function renderTextHtml(slot: CmsSlotComponentProps["slot"]): string | null {
  const element = CmsText({ slot }) as CmsTextElement | null;

  return element?.props.dangerouslySetInnerHTML.__html ?? null;
}

describe("CMS text sanitization", () => {
  test("removes script elements", () => {
    const html = renderTextHtml(
      createTextSlot({
        data: { content: "<script>alert('xss')</script><p>Safe</p>" },
      }),
    );

    expect(html).toBe("<p>Safe</p>");
  });

  test("removes event handler attributes", () => {
    const html = renderTextHtml(
      createTextSlot({
        data: { content: '<p onclick="alert(1)">Safe</p>' },
      }),
    );

    expect(html).toBe("<p>Safe</p>");
  });

  test("removes JavaScript links", () => {
    const html = renderTextHtml(
      createTextSlot({
        data: { content: '<a href="javascript:alert(1)">Open</a>' },
      }),
    );

    expect(html).toBe("<a>Open</a>");
  });

  test("secures links that open in a new tab", () => {
    const html = renderTextHtml(
      createTextSlot({
        data: {
          content: '<a href="https://example.com" target="_blank">Open</a>',
        },
      }),
    );

    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  test("preserves allowed rich HTML", () => {
    const content =
      "<h2>Title</h2><p><strong>Body</strong> <em>copy</em></p><ul><li>One</li></ul>";

    expect(renderTextHtml(createTextSlot({ data: { content } }))).toBe(content);
  });
});

describe("CmsText", () => {
  test("uses resolved data content", () => {
    const html = renderTextHtml(
      createTextSlot({
        data: { content: "<p>Resolved content</p>" },
        config: {
          content: { source: "static", value: "<p>Static content</p>" },
        },
      }),
    );

    expect(html).toBe("<p>Resolved content</p>");
  });

  test("falls back to static config content", () => {
    const html = renderTextHtml(
      createTextSlot({
        config: {
          content: { source: "static", value: "<p>Static content</p>" },
        },
      }),
    );

    expect(html).toBe("<p>Static content</p>");
  });

  test("renders nothing for empty content", () => {
    const consoleError = spyOn(console, "error").mockImplementation(() => {});

    try {
      const element = CmsText({
        slot: createTextSlot({
          data: { content: "   " },
          config: { content: { source: "static", value: "   " } },
        }),
      });

      expect(element).toBeNull();
      expect(consoleError).toHaveBeenCalledTimes(1);
    } finally {
      consoleError.mockRestore();
    }
  });
});
