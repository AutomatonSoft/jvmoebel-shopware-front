# `jv-home-editorial`

Long-form editorial content with an introduction and a native expandable
section.

## `slot.data`

```json
{
  "statement": "Unser Service steht für höchste Qualität.",
  "title": "Willkommen bei JVMöbel",
  "introduction": [
    "Entdecken Sie Möbel und Wohnideen für Ihr Zuhause.",
    "Unser Sortiment verbindet <strong>Design</strong>, Qualität und Komfort."
  ],
  "sections": [
    {
      "id": "schlafzimmer",
      "position": 0,
      "title": "Gesund und schön schlafen",
      "paragraphs": [
        "Finden Sie passende Betten, Schränke und Schlafzimmer-Sets."
      ]
    }
  ],
  "showMoreLabel": "Alles anzeigen",
  "showLessLabel": "Weniger anzeigen"
}
```

## Field contract

| Field           | Required | Rule                                                         |
| --------------- | -------- | ------------------------------------------------------------ |
| `statement`     | yes      | Non-empty introductory statement.                            |
| `title`         | yes      | Non-empty section heading.                                   |
| `introduction`  | yes      | Array or keyed object with at least one non-empty paragraph. |
| `sections`      | yes      | Array or keyed object with at least one valid section.       |
| `showMoreLabel` | yes      | Label shown while the details section is closed.             |
| `showLessLabel` | yes      | Label shown while the details section is open.               |

Each section requires at least one non-empty string in `paragraphs`. `title`
and `id` are optional; a missing ID falls back to the collection key. A finite
numeric `position` controls order; otherwise input order is used.

Paragraphs may contain supported rich-text HTML. The frontend sanitizes them
before rendering. Scripts, event handlers, unsafe protocols, and unsupported
markup are removed. Invalid paragraphs and sections are omitted. The whole
element is omitted if any required top-level string is missing, the
introduction is empty, or no valid sections remain.

Arrays are canonical; keyed objects are also accepted.

## Shopware Administration

Register the `jv-home-editorial` element and block. Editors should control the
statement, title, introduction paragraphs, expandable sections and their
order, and both disclosure labels. Rich-text controls must produce markup
supported by the storefront sanitizer.
