# `jv-offer-rail`

Linked promotional cards displayed as a responsive horizontal carousel. Each
offer can optionally show a live countdown.

## `slot.data`

```json
{
  "ariaLabel": "Aktuelle Möbelaktionen",
  "eyebrow": "Nur für kurze Zeit",
  "title": "Aktuelle Aktionen",
  "description": "Zeitlich begrenzte Preisvorteile.",
  "offers": [
    {
      "id": "living-room-weeks",
      "position": 0,
      "title": "Wohnwochen",
      "subtitle": "Bis zu 20 % auf ausgewählte Wohnzimmermöbel",
      "ctaLabel": "Jetzt sparen",
      "url": "/rabatt-angebote",
      "endsAt": "2026-09-30T23:59:59+02:00",
      "legalText": "*Gültig für ausgewählte Artikel.",
      "image": {
        "url": "https://media.example.com/offers/living-room.webp",
        "alt": "Helles Wohnzimmer mit Sofa"
      }
    }
  ]
}
```

## Field contract

| Field         | Required | Rule                                                       |
| ------------- | -------- | ---------------------------------------------------------- |
| `title`       | yes      | Non-empty section heading.                                 |
| `offers`      | yes      | Array or keyed object containing at least one valid offer. |
| `ariaLabel`   | no       | Defaults to `title`.                                       |
| `eyebrow`     | no       | Short text above the heading.                              |
| `description` | no       | Supporting section text.                                   |

Each offer requires non-empty `title`, `ctaLabel`, `url`, and `image.url`.
`id` is optional and generated from the title and index when omitted.
`image.alt` defaults to the offer title. A finite numeric `position` controls
order; otherwise input order is used. `subtitle` and `legalText` are optional.

`endsAt` is optional. When present, it must be a complete ISO timestamp with a
timezone, for example `2026-09-30T23:59:59+02:00`. Invalid values are reported
and the offer remains visible without a timer. Expired timed offers are removed
in the browser. Arrays are canonical; keyed objects are also accepted.

## Shopware Administration

Register the `jv-offer-rail` element and block. Editors should control the
section copy, offer order, links, media, call-to-action labels, optional legal
copy, and optional end date. The end-date control must store a timezone-aware
ISO timestamp. The resolver must return selected media as resolved
`{ "url", "alt" }` objects in `slot.data`.

The frontend owns responsive image cropping, carousel behavior, countdown
formatting, expiry handling, accessibility, and visual styling.
