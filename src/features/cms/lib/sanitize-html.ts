import sanitizeHtml from "sanitize-html";

export function sanitizeCmsHtml(content: string): string {
  return sanitizeHtml(content, {
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
}
