# `jv-promo-banner`

Wide media banner with promotional copy and an optional call to action.

## `slot.data`

```json
{
  "eyebrow": "Persönlich geplant",
  "title": "Unsicher bei Material oder Maß?",
  "description": "Wir helfen bei der Auswahl der passenden Ausführung.",
  "contentPosition": "right",
  "image": {
    "url": "https://media.example.com/campaigns/consultation.webp",
    "alt": "Materialmuster auf einem Beratungstisch"
  },
  "link": {
    "label": "Beratung anfragen",
    "url": "mailto:info@example.com",
    "size": "large"
  }
}
```

## Field contract

| Field             | Required | Rule                                                             |
| ----------------- | -------- | ---------------------------------------------------------------- |
| `title`           | yes      | Non-empty banner heading.                                        |
| `image.url`       | yes      | Resolved public media URL.                                       |
| `image.alt`       | no       | Defaults to `title`.                                             |
| `eyebrow`         | no       | Short text above the heading.                                    |
| `description`     | no       | Supporting text.                                                 |
| `contentPosition` | no       | `left` or `right`. Invalid or missing values default to `right`. |
| `link`            | no       | Rendered only when both `label` and `url` are present.           |

Link `size` accepts `small`, `medium`, or `large` and defaults to `medium`.
The whole element is omitted when `title` or `image.url` is missing.

## Shopware Administration

Register the `jv-promo-banner` element and block. Editors should control all
copy, select one media item, place the copy on the left or right, and optionally
configure the call to action. The resolver must return the selected media as a
resolved `{ "url", "alt" }` object in `slot.data`. Responsive cropping and
visual styling remain owned by the frontend.
