# `jv-benefit-strip`

Compact list of service or shopping benefits.

## `slot.data`

```json
{
  "items": [
    {
      "id": "delivery",
      "position": 0,
      "icon": "delivery",
      "title": "Möbelspedition und Aufbauservice",
      "description": "Große Möbel liefern wir bequem bis zum Wunschort."
    }
  ]
}
```

## Field contract

`items` is required and must contain at least one valid entry. Arrays are
canonical; keyed objects are also accepted.

| Item field    | Required | Rule                                                                |
| ------------- | -------- | ------------------------------------------------------------------- |
| `title`       | yes      | Non-empty benefit heading.                                          |
| `description` | yes      | Non-empty supporting text.                                          |
| `icon`        | yes      | One of `delivery`, `price`, or `returns`.                           |
| `id`          | no       | Stable identifier; generated from the title and index when omitted. |
| `position`    | no       | Finite number used for ordering; input order is the fallback.       |

Invalid entries are omitted. The whole element is omitted when no valid entry
remains.

## Shopware Administration

Register the `jv-benefit-strip` element and block. Editors should add, remove,
reorder, and edit benefits and choose an icon from the three supported values.
The frontend owns icon artwork, layout, responsive behavior, and styling.
