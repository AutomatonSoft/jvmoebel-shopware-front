# `jv-faq`

Expandable questions and answers with optional section copy.

## `slot.data`

```json
{
  "eyebrow": "Gut zu wissen",
  "title": "Häufige Fragen zu Rabattcodes",
  "description": "Informationen zu Aktionen, Codes und reduzierten Artikeln.",
  "items": [
    {
      "id": "redeem-code",
      "position": 0,
      "question": "Wie kann ich einen Rabattcode einlösen?",
      "answer": "<p>Gib den Code im Warenkorb ein.</p>"
    }
  ]
}
```

## Field contract

| Field         | Required | Rule                                                     |
| ------------- | -------- | -------------------------------------------------------- |
| `title`       | yes      | Non-empty section heading.                               |
| `items`       | yes      | Array or keyed object with at least one valid FAQ entry. |
| `eyebrow`     | no       | Short text above the heading.                            |
| `description` | no       | Supporting text.                                         |

Each item requires non-empty `question` and `answer`. `id` is optional and is
generated from the question and index when omitted. A finite numeric `position`
controls order; otherwise input order is used. Invalid items are omitted, and
the whole element is omitted when `title` is missing or no valid item remains.

Answers may contain the same sanitized rich text supported by the standard
[`text`](text.md) element. Scripts, event handlers, unsupported attributes, and
unsafe link protocols are removed by the frontend.

## Shopware Administration

Register the `jv-faq` element and block. Editors should control the section
copy and add, remove, reorder, and edit questions and rich-text answers. The
frontend owns the accordion behavior, sanitization, responsive layout, and
styling.
