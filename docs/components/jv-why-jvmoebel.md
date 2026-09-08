# `jv-why-jvmoebel`

Brand statement with a decorative mark and linked customer benefits.

## `slot.data`

```json
{
  "eyebrow": "Warum JVMöbel",
  "title": "Service, der zu Ihrem Zuhause passt",
  "description": "Wir begleiten Sie von der Idee bis zur Lieferung.",
  "mark": "JV",
  "tagline": "Möbel mit Charakter",
  "benefits": [
    {
      "id": "advice",
      "position": 0,
      "icon": "advice",
      "title": "Persönliche Beratung",
      "description": "Wir planen gemeinsam mit Ihnen.",
      "url": "/beratung"
    }
  ],
  "viewAll": {
    "label": "Unser Service",
    "url": "/service"
  }
}
```

## Field contract

| Field         | Required | Rule                                                         |
| ------------- | -------- | ------------------------------------------------------------ |
| `title`       | yes      | Non-empty section heading.                                   |
| `mark`        | yes      | Short decorative brand mark.                                 |
| `tagline`     | yes      | Text displayed below the mark.                               |
| `benefits`    | yes      | Array or keyed object containing at least one valid benefit. |
| `eyebrow`     | no       | Short text above the heading.                                |
| `description` | no       | Supporting text.                                             |
| `viewAll`     | no       | Rendered only when both `label` and `url` are present.       |

Each benefit requires non-empty `title`, `description`, and `url`. `icon` must
be one of `advice`, `design`, or `payment`. `id` is optional and generated when
omitted. A finite numeric `position` controls order; otherwise input order is
used.

Invalid benefits are omitted. The whole element is omitted when `title`,
`mark`, or `tagline` is missing or no valid benefits remain. Arrays are
canonical; keyed objects are also accepted.

## Shopware Administration

Register the `jv-why-jvmoebel` element and block. Editors should control the
section copy, mark, tagline, benefit list, benefit links and one of the three
supported icon choices. The icon field should be a select rather than free
text so invalid values cannot be saved.
