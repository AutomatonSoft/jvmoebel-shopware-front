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
- `jv-newsletter`
- `text`

An unknown element is shown as an unsupported-element marker in development
and omitted in production. A known element with invalid required data is
omitted without breaking the rest of the page.

## `jv-hero`

Required fields:

- `title`: non-empty string.
- `image.url`: non-empty image path.

Optional fields:

- `eyebrow`, `description`: non-empty strings when provided.
- `image.alt`: defaults to an empty string.
- `primaryLink`, `secondaryLink`: rendered only when both `label` and `url` are
  present.
- Link `size`: `small`, `medium`, or `large`; defaults to `medium`.

```json
{
  "title": "A home that feels like you.",
  "eyebrow": "The new living collection",
  "description": "Furniture selected for everyday living.",
  "image": {
    "url": "/images/hero-editorial.webp",
    "alt": "Contemporary living room"
  },
  "primaryLink": {
    "label": "Shop new arrivals",
    "url": "/new-in",
    "size": "large"
  },
  "secondaryLink": {
    "label": "Explore the collection",
    "url": "/living",
    "size": "medium"
  }
}
```

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
2. Register the four custom element names exactly as documented.
3. Resolve custom element values into `slot.data`, not only `slot.config`.
4. Return stable IDs and numeric positions for pages, sections, blocks, slots,
   rooms, and products where applicable.
5. Follow the required-field rules so an entire element is not omitted.
6. Test the final Store API response against the examples in this document.
