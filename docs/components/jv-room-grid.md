# `jv-room-grid`

Editorial grid of linked room cards.

## `slot.data`

```json
{
  "eyebrow": "Nach Raum einkaufen",
  "title": "Möbel für jeden Raum",
  "description": "Entdecken Sie aufeinander abgestimmte Wohnideen.",
  "rooms": [
    {
      "id": "living-room",
      "position": 0,
      "featured": true,
      "label": "Wohnzimmer",
      "title": "Sofas, Sessel und Tische",
      "url": "/Moebel-Wohnen/Wohnzimmer/",
      "image": {
        "url": "https://media.example.com/rooms/living-room.webp",
        "alt": "Modernes Wohnzimmer"
      }
    }
  ]
}
```

## Field contract

| Field         | Required | Rule                                                      |
| ------------- | -------- | --------------------------------------------------------- |
| `title`       | yes      | Non-empty section heading.                                |
| `rooms`       | yes      | Array or keyed object containing at least one valid room. |
| `eyebrow`     | no       | Short text above the heading.                             |
| `description` | no       | Supporting text.                                          |

Each room requires non-empty `label`, `title`, `url`, and `image.url`. `id` is
optional and generated when omitted. `image.alt` defaults to an empty string.
A finite numeric `position` controls order; otherwise input order is used.
`featured: true` or `featured: 1` makes the card span two desktop rows.

Invalid rooms are omitted. The whole element is omitted when the top-level
title is missing or no valid rooms remain. Arrays are canonical; keyed objects
are also accepted.

## Shopware Administration

Register the `jv-room-grid` element and block. Editors should control the
section copy and add, remove, reorder, feature, link, and assign media to room
cards. The resolver must expose public media URLs in `slot.data`.
