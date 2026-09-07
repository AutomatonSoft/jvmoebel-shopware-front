# `jv-category-rail`

Horizontal rail of linked category cards.

## `slot.data`

```json
{
  "eyebrow": "Räume entdecken",
  "title": "Möbel für jeden Raum",
  "description": "Finden Sie passende Möbel nach Wohnbereich.",
  "categories": [
    {
      "id": "living-room",
      "position": 0,
      "label": "Wohnzimmer",
      "url": "/Moebel-Wohnen/Wohnzimmer/",
      "image": {
        "url": "https://media.example.com/categories/living-room.webp",
        "alt": "Modernes Wohnzimmer"
      }
    }
  ],
  "viewAll": {
    "label": "Alle Kategorien",
    "url": "/moebel-sortiment"
  }
}
```

## Field contract

| Field         | Required | Rule                                                          |
| ------------- | -------- | ------------------------------------------------------------- |
| `title`       | yes      | Non-empty section heading.                                    |
| `categories`  | yes      | Array or keyed object containing at least one valid category. |
| `eyebrow`     | no       | Short text above the heading.                                 |
| `description` | no       | Supporting text.                                              |
| `viewAll`     | no       | Rendered only when both `label` and `url` are present.        |

Each category requires non-empty `label`, `url`, and `image.url`. `id` is
optional and generated from the label and index when omitted. `image.alt`
defaults to the category label. A finite numeric `position` controls order;
otherwise input order is used.

Invalid categories are omitted. The whole element is omitted when `title` is
missing or no valid categories remain. Arrays are canonical; keyed objects are
also accepted.

## Shopware Administration

Register the `jv-category-rail` element and block. Editors should control the
heading copy, category cards, their order, links and media, and the optional
view-all link. A category selector may be used, but the Store API resolver must
still return the documented strings and resolved `{ "url", "alt" }` media
object in `slot.data`.
