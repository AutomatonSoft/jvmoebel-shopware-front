# Shopware CMS frontend contract

Contract version: 1

This document describes the CMS data currently supported by the Next.js
storefront. The Shopware backend should return the standard Store API CMS page
structure and place resolved custom element data in `slot.data`.

## Page structure

The renderer processes the following hierarchy:

```text
CMS page
└── sections (sorted by position)
    └── blocks (sorted by position)
        └── slots
            └── element selected by slot.type
```

Minimal example:

```json
{
  "id": "page-id",
  "type": "page",
  "sections": [
    {
      "id": "section-id",
      "position": 0,
      "sizingMode": "full_width",
      "type": "default",
      "blocks": [
        {
          "id": "block-id",
          "position": 0,
          "type": "jv-hero",
          "slots": [
            {
              "id": "slot-id",
              "slot": "content",
              "type": "jv-hero",
              "data": {}
            }
          ]
        }
      ]
    }
  ]
}
```

The frontend also passes through optional page, section, and block `cssClass`
values. Block margins are read from `marginTop`, `marginRight`, `marginBottom`,
and `marginLeft`.

Supported `slot.type` values:

- `jv-hero`
- `jv-room-grid`
- `jv-product-grid`
- `jv-home-editorial`
- `jv-newsletter`
- `text`

An unknown element is shown as an unsupported-element marker in development
and omitted in production. A known element with invalid required data is
omitted without breaking the rest of the page.

## `jv-hero`

Required fields:

- `slides`: non-empty array or keyed object containing at least one valid
  slide.
- Each slide requires:
  - `position`: unique non-negative integer used to order banners. The admin
    integration must assign a number to every banner.
  - `title` and `image.url` as non-empty strings.

Optional carousel fields:

- `ariaLabel`: accessible carousel label.
- `autoplay`: boolean or `0`/`1`; defaults to enabled.
- `autoplayIntervalMs`: milliseconds between slides, clamped to the range from
  `4000` to `15000`; defaults to `7000`.

Optional slide fields:

- `id`: falls back to a generated frontend key.
- `url`: makes the whole banner clickable and navigates to this URL. Buttons
  inside the banner keep their own configured URLs.
- `layout`: `featured` for the full Hero composition or `caption` for a
  bottom-aligned advertising caption; defaults to `featured`.
- `eyebrow`, `description`, and `image.alt`.
- `primaryLink`, `secondaryLink`: rendered only when both `label` and `url` are
  present. Link `size` supports `small`, `medium`, or `large` and defaults to
  `medium`.
- `promotion.value`: prominent discount, price, or campaign value.
- `promotion.label`: optional context shown above the promotion value.

The previous single-slide payload with `title`, `image`, and optional content
at the root remains supported for backward compatibility. New CMS integrations
should use `slides`; arrays are canonical and keyed objects are supported for
fixture compatibility.

The carousel accepts any positive number of valid slides. Slides are always
rendered in ascending `position` order; the order received from the API is not
used. A slide with a missing, invalid, or duplicate `position` is omitted and
reported as a CMS contract issue.

```json
{
  "ariaLabel": "Aktuelle Angebote und Wohnideen",
  "autoplay": true,
  "autoplayIntervalMs": 6500,
  "slides": [
    {
      "id": "living-room",
      "position": 0,
      "layout": "featured",
      "title": "Wohnzimmer, die sich nach Ihnen anfühlen.",
      "url": "/living",
      "eyebrow": "Neue Wohnideen",
      "description": "Entdecken Sie ausgewählte Möbel für Ihr Zuhause.",
      "image": {
        "url": "/images/hero-editorial.webp",
        "alt": "Helles Wohnzimmer mit Sofa"
      },
      "promotion": {
        "label": "Ausgewählte Kollektionen",
        "value": "Bis zu 20 %"
      },
      "primaryLink": {
        "label": "Wohnzimmer entdecken",
        "url": "/living",
        "size": "large"
      }
    }
  ]
}
```

The carousel provides centered direct slide indicators for manual navigation.
Autoplay pauses while the carousel is hovered or focused and is disabled when
the visitor prefers reduced motion.

With `layout: "caption"`, the title is anchored to the lower-left corner and
the optional `promotion.value` continues the title with stronger emphasis. A
configured primary link is rendered as a light outline button. Buttons,
description, eyebrow, and promotion remain independently optional per slide.

## `jv-room-grid`

Required fields:

- `title`: non-empty string.
- `rooms`: non-empty array or keyed object containing at least one valid room.
- Each room requires `label`, `title`, `url`, and `image.url`.

Optional room fields:

- `id`: falls back to a generated frontend key.
- `position`: finite number; otherwise the input order is used.
- `featured`: `true` or `1` makes the card span two desktop rows.
- `image.alt`: defaults to an empty string.

The canonical backend representation should be an array. Keyed objects remain
supported for compatibility with the current mock.

```json
{
  "title": "Furniture for every room.",
  "eyebrow": "Shop by room",
  "description": "Discover pieces selected to work together.",
  "rooms": [
    {
      "id": "living-room",
      "position": 0,
      "featured": true,
      "label": "Living room",
      "title": "Sofas, armchairs and tables",
      "url": "/living",
      "image": {
        "url": "/images/hero-living.webp",
        "alt": "Contemporary living room"
      }
    }
  ]
}
```

## `jv-product-grid`

Required fields:

- `title`, `locale`, `currency`: non-empty strings.
- `products`: non-empty array or keyed object containing at least one valid
  product.
- Each product requires `id`, `url`, `cover.media.url`,
  `calculatedPrice.unitPrice`, and a name from either `translated.name` or
  `name`.

Optional product fields:

- `position`: finite number; otherwise the input order is used.
- `badge`, `ratingAverage`, and `reviewCount`.
- Description from `translated.description` or `description`.
- Image alt text from `cover.media.alt`; the product name is the fallback.
- Previous price from `calculatedPrice.listPrice.price`.
- `viewAll` is rendered only when both `label` and `url` are present.

Prices are numeric amounts in the currency's major unit, not integer cents.
The current UI formats prices without fractional digits.

```json
{
  "title": "Featured pieces",
  "eyebrow": "Selected for you",
  "locale": "de-DE",
  "currency": "EUR",
  "products": [
    {
      "id": "alba",
      "position": 0,
      "url": "/product/alba",
      "badge": "Bestseller",
      "ratingAverage": 4.9,
      "reviewCount": 128,
      "translated": {
        "name": "Alba Modular Sofa",
        "description": "Natural boucle, four seats"
      },
      "cover": {
        "media": {
          "url": "/images/hero-living.webp",
          "alt": "Alba modular sofa"
        }
      },
      "calculatedPrice": {
        "unitPrice": 2490,
        "listPrice": {
          "price": 2890
        }
      }
    }
  ],
  "viewAll": {
    "label": "View all products",
    "url": "/shop"
  }
}
```

## `jv-home-editorial`

The home editorial element presents a prominent service statement, an
introduction, and additional long-form content in a native expandable section.

Required fields:

- `statement`, `title`, `showMoreLabel`, and `showLessLabel`: non-empty strings.
- `introduction`: non-empty array or keyed object of non-empty paragraph
  strings.
- `sections`: non-empty array or keyed object containing at least one valid
  section.
- Each section requires at least one non-empty string in `paragraphs`.

Optional section fields:

- `id`: falls back to the keyed-object key or array index.
- `position`: finite number; otherwise the input order is used.
- `title`: non-empty string when provided.

Arrays are the canonical backend representation. Keyed objects remain
supported for compatibility with frontend fixtures.

```json
{
  "statement": "Unser Service steht für höchste Qualität.",
  "title": "Willkommen bei JV Möbel",
  "introduction": [
    "Entdecken Sie Möbel und Wohnideen für Ihr Zuhause.",
    "Unser Sortiment verbindet Design, Qualität und Komfort."
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

The Next.js storefront already parses and renders this element. Editing it in
Shopware Administration additionally requires a Shopware extension that
registers the `jv-home-editorial` CMS element and block, exposes the documented
fields, and resolves their values into `slot.data` for the Store API response.
The frontend implementation alone does not add controls to Shopware
Administration.

## `jv-newsletter`

All fields below are required except `eyebrow` and `buttonSize`:

- `title`, `description`, `buttonLabel`, `placeholder`.
- `successMessage`, `invalidEmailMessage`, `errorMessage`.
- `storefrontUrl`: absolute HTTP or HTTPS URL.
- `buttonSize`: `small`, `medium`, or `large`; defaults to `medium`.

```json
{
  "title": "Useful ideas, occasionally.",
  "eyebrow": "The good-room letter",
  "description": "Room guides, material care and new pieces.",
  "buttonLabel": "Join us",
  "buttonSize": "large",
  "placeholder": "Your email address",
  "storefrontUrl": "http://localhost:3000",
  "successMessage": "You are on the list.",
  "invalidEmailMessage": "Enter a valid email address.",
  "errorMessage": "Subscription failed. Please try again."
}
```

## `text`

The standard Shopware text element is supported. Resolved HTML should be
provided in `slot.data.content`. As a fallback, static HTML is read from
`slot.config.content` when its `source` is `static`.

HTML is sanitized by the frontend before rendering. Scripts, event handlers,
JavaScript URLs, and other unsupported markup are removed.

## URL and media notes

- Internal links should use root-relative paths such as `/living`.
- During frontend development, image URLs point to files under `public/images`
  and use paths such as `/images/hero-living.webp`.
- The production media host and delivery strategy are intentionally not part
  of contract version 1 and must be agreed when the backend is ready.

## Backend implementation checklist

1. Return the standard Store API `CmsPage` hierarchy.
2. Register the custom element names exactly as documented.
3. Resolve custom element values into `slot.data`, not only `slot.config`.
4. Return stable IDs and numeric positions for pages, sections, blocks, slots,
   rooms, and products where applicable.
5. Follow the required-field rules so an entire element is not omitted.
6. Test the final Store API response against the examples in this document.
