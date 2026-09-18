import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";

import { CmsText } from "@/features/cms/components/elements/cms-text";
import { parseCmsTextData } from "@/features/cms/contracts/text";
import type { CmsSlot } from "@/features/cms/model/page";

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
  } as unknown as CmsSlot;
}

function renderTextHtml(slot: CmsSlot): string | null {
  const result = parseCmsTextData(slot);

  if (!result.data) {
    return null;
  }

  const element = CmsText({ data: result.data, id: slot.id }) as CmsTextElement;

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
    const result = parseCmsTextData(
      createTextSlot({
        data: { content: "   " },
        config: { content: { source: "static", value: "   " } },
      }),
    );

    expect(result.data).toBeNull();
    expect(result.issues).toHaveLength(1);
  });
});
