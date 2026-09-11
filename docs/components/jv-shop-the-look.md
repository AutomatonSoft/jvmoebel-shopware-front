# `jv-shop-the-look`

Editorial image with numbered, linked hotspots and a matching product list.

## `slot.data`

```json
{
  "eyebrow": "Shop the look",
  "title": "Ein Wohnzimmer zum Ankommen",
  "description": "Entdecken Sie die Möbel aus diesem Raum.",
  "image": {
    "url": "https://media.example.com/looks/living-room.webp",
    "alt": "Wohnzimmer mit markierten Möbeln"
  },
  "items": [
    {
      "id": "sofa",
      "position": 0,
      "name": "Alba Sofa",
      "description": "Vier Sitzplätze in Bouclé",
      "url": "/produkt/0123456789abcdef0123456789abcdef",
      "hotspot": {
        "x": 42,
        "y": 64
      }
    }
  ],
  "viewAll": {
    "label": "Alle Produkte ansehen",
    "url": "/moebel-sortiment"
  }
}
```

## Field contract

| Field         | Required | Rule                                                      |
| ------------- | -------- | --------------------------------------------------------- |
| `title`       | yes      | Non-empty section heading.                                |
| `image.url`   | yes      | Non-empty background image URL.                           |
| `items`       | yes      | Array or keyed object containing at least one valid item. |
| `image.alt`   | no       | Defaults to the section title.                            |
| `eyebrow`     | no       | Short text above the heading.                             |
| `description` | no       | Supporting text.                                          |
| `viewAll`     | no       | Rendered only when both `label` and `url` are present.    |

Each item requires non-empty `name` and `url`. `hotspot.x` and `hotspot.y`
must be finite numbers from `0` through `100`, representing percentages from
the image's left and top edges. `description` and `id` are optional. A finite
numeric `position` controls display order; otherwise input order is used.

Invalid items are omitted. The whole element is omitted when the title or
image is missing or no valid items remain. Arrays are canonical; keyed objects
are also accepted.

## Shopware Administration

Register the `jv-shop-the-look` element and block. Editors should select the
main image, add and reorder items, choose their product or URL, and place each
hotspot using percentage coordinates. A visual hotspot picker is recommended.
The resolver must convert selected media and products to the documented values
in `slot.data`.
