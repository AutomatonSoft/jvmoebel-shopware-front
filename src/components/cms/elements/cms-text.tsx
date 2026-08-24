import sanitizeHtml from "sanitize-html";

import type { CmsSlotComponentProps } from "@/components/cms/cms-page-renderer";

function getRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function getTextContent(slot: CmsSlotComponentProps["slot"]): string | null {
  const data = getRecord(slot.data);
  const resolvedContent = data?.content;

  if (typeof resolvedContent === "string" && resolvedContent.trim()) {
    return resolvedContent;
  }

  const config = getRecord(slot.config);
  const contentConfig = getRecord(config?.content);

  if (
    contentConfig?.source === "static" &&
    typeof contentConfig.value === "string" &&
    contentConfig.value.trim()
  ) {
    return contentConfig.value;
  }

  return null;
}

export function CmsText({ slot }: CmsSlotComponentProps) {
  const content = getTextContent(slot);

  if (!content) {
    return null;
  }

  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: [
      "a",
      "b",
      "blockquote",
      "br",
      "em",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "hr",
      "i",
      "li",
      "ol",
      "p",
      "s",
      "span",
      "strong",
      "sub",
      "sup",
      "table",
      "tbody",
      "td",
      "th",
      "thead",
      "tr",
      "u",
      "ul",
    ],
    allowedAttributes: {
      a: ["href", "rel", "target", "title"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attributes) => ({
        tagName,
        attribs:
          attributes.target === "_blank"
            ? { ...attributes, rel: "noopener noreferrer" }
            : attributes,
      }),
    },
  });

  if (!sanitizedContent.trim()) {
    return null;
  }

  return (
    <div
      className="cms-rich-text text-foreground [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_h1]:text-4xl [&_h1]:font-semibold [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:text-2xl [&_h3]:font-semibold [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:leading-7 [&_p:not(:first-child)]:mt-4 [&_table]:w-full [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
      data-cms-element="text"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
