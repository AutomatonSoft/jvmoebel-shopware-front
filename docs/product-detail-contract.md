# Product detail frontend contract

The `/product/[slug]` route currently renders local mock data. This document
describes the normalized product detail model consumed by the frontend. It is
not the raw schema of a standard Shopware Store API response.

When the backend is ready, an integration layer must map the resolved Shopware
product, calculated sales-channel data, media, configurator settings, and
cross-selling associations into this model. The current mock is located in
`src/lib/shopware/mocks/product-detail.ts`.

The TypeScript contract is located in `src/lib/shopware/product-detail.ts`.
Runtime parsing of an unknown Store API response must be added together with
the backend adapter.

## Route resolution

- The current mock route is `/product/[slug]`, for example `/product/alba`.
- A known slug returns the normalized product detail page.
- An unknown slug must return HTTP `404` and must not be indexed.
- The mock currently uses the product ID as its slug only for convenience.
- Production must not assume that a Shopware product ID is its public slug.
- The backend integration should resolve Shopware SEO URLs and provide the
  canonical storefront URL.

## Page shape

```json
{
  "currency": "EUR",
  "locale": "de-DE",
  "product": {
    "id": "alba",
    "slug": "alba",
    "url": "/product/alba",
    "name": "Alba Modular Sofa",
    "productNumber": "JV-ALBA",
    "description": "Natural boucle, 4 seats",
    "longDescription": "A longer plain-text product description.",
    "unitPrice": 2490,
    "previousPrice": 2890,
    "badge": "Bestseller",
    "category": "sofas",
    "categoryLabel": "Sofas",
    "company": "JV Studio",
    "material": "Boucle",
    "rating": 4.9,
    "reviewCount": 128,
    "image": {
      "url": "/images/hero-living.webp",
      "alt": "Alba modular sofa in a warm living room"
    },
    "gallery": [
      {
        "url": "/images/hero-living.webp",
        "alt": "Alba modular sofa in a warm living room"
      }
    ],
    "dimensions": {
      "width": 286,
      "height": 82,
      "length": 178,
      "unit": "cm"
    },
    "optionGroups": [
      {
        "id": "colour",
        "label": "Colour",
        "displayType": "swatch",
        "selectedOptionId": "cream",
        "options": [
          {
            "id": "cream",
            "label": "Cream",
            "available": true,
            "swatch": "#ded6c8"
          }
        ]
      }
    ],
    "purchaseNotes": [
      {
        "id": "delivery",
        "kind": "delivery",
        "text": "Ready to ship in 2-3 weeks"
      }
    ],
    "specifications": [
      {
        "id": "material",
        "label": "Material",
        "value": "Boucle"
      }
    ]
  },
  "recommendations": []
}
```

## Top-level fields

| Field             | Required | Rule                                                                    |
| ----------------- | -------- | ----------------------------------------------------------------------- |
| `currency`        | Yes      | ISO 4217 currency code used for the price and option price differences. |
| `locale`          | Yes      | Locale used by `Intl.NumberFormat`, for example `de-DE`.                |
| `product`         | Yes      | Normalized active product detail.                                       |
| `recommendations` | Yes      | Array of normalized listing-card products. It may be empty.             |

The product detail extends the normalized `ShopProduct` documented in
`docs/product-listing-contract.md`. Shared fields such as prices, category,
manufacturer, colors, sizes, rating, badge, and card image must follow that
contract.

## Detail-only product fields

| Field             | Required | Rule                                                                                                      |
| ----------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `slug`            | Yes      | Resolved storefront route segment. It must not be derived from a translated name without collision rules. |
| `productNumber`   | Yes      | Shopware product number or another stable customer-facing identifier.                                     |
| `longDescription` | Yes      | Plain-text description displayed in the technical characteristics section.                                |
| `gallery`         | Yes      | Non-empty media array. The first item is the initially displayed image.                                   |
| `dimensions`      | Yes      | Structured numeric width, height, length, and their shared unit.                                          |
| `optionGroups`    | Yes      | Normalized variant/configurator groups. It may be empty.                                                  |
| `purchaseNotes`   | Yes      | Delivery, returns, and warranty messages. It may be empty.                                                |
| `specifications`  | Yes      | Flexible translated label/value characteristics. It may be empty.                                         |

### Gallery

Every gallery item requires:

- `url`: resolved media URL;
- `alt`: accessible translated media description.

The first gallery item should normally represent the Shopware product cover.
Duplicate media URLs should be removed without replacing the cover alt text.

### Dimensions

`width`, `height`, and `length` are numbers. `unit` is a short translated or
standardized unit such as `cm`. The backend must normalize all three numbers to
the same unit before returning the contract.

The frontend controls the visual order: width, height, then length.

### Option groups

Each option group contains:

| Field              | Required | Rule                                                    |
| ------------------ | -------- | ------------------------------------------------------- |
| `id`               | Yes      | Stable Shopware property/configurator group identifier. |
| `label`            | Yes      | Translated group label.                                 |
| `displayType`      | Yes      | One of `swatch`, `button`, or `select`.                 |
| `selectedOptionId` | Yes      | Must match one option in the group.                     |
| `options`          | Yes      | Available and unavailable normalized options.           |

Each option contains a stable `id`, translated `label`, and boolean
`available`. `swatch` is optional and should contain a valid CSS color.
`priceDifference` is optional and uses major currency units.

The current UI displays the resolved selection but does not implement variant
switching or local price calculations. Production variant selection must
resolve a valid Shopware variant and use its calculated price, availability,
media, and canonical URL. The frontend must not calculate a final variant price
by summing `priceDifference` values.

### Purchase notes

`kind` must be one of:

- `delivery`;
- `returns`;
- `warranty`.

The frontend maps these semantic values to icons. `text` must be translated
plain text. The Administration source has not been selected yet; suitable
sources include custom fields, sales-channel configuration, or backend-derived
delivery information.

### Specifications

Specifications are an ordered array of stable `id`, translated `label`, and
plain-text `value` fields. The backend may map them from Shopware properties,
custom fields, or product data. Labels and values may be long, but must not
contain HTML.

Dimensions should remain in the structured `dimensions` object instead of
being duplicated as specification strings.

## Recommendations

The current mock returns up to three products and ranks them by matching
category, material, colors, and sizes. The active product is always excluded.

Production should preferably use Shopware cross-selling or an agreed product
stream configured in Administration. Each recommendation must use the shared
`ShopProduct` card contract.

## Images and links

- Mock media uses root-relative paths from `public/images`.
- The production media host is intentionally not configured yet.
- Do not change `next.config.ts` or Next.js image settings until the Shopware
  media storage and delivery host are agreed.
- Product and recommendation URLs should be internal storefront paths unless
  the backend explicitly marks a destination as external.
- Canonical product URLs should be resolved from Shopware SEO URL data.

## Current interaction boundary

The following controls are visual only in the current implementation:

- product option selection;
- `Add to bag`;
- `Ask about this product`.

The frontend does not display a fake success state, mutate a cart, or add an
artificial request delay. These interactions must be connected only when the
corresponding Store API and error states are implemented.

## Administration responsibility boundary

Once the Store API adapter exists, Shopware Administration is expected to
control:

- product activation, sales-channel visibility, name, and descriptions;
- product number and canonical SEO URL;
- calculated price and list price;
- cover and gallery media with accessible metadata;
- manufacturer and category associations;
- variant/configurator groups and option availability;
- properties used for colors, materials, sizes, and specifications;
- dimensions through agreed property groups or custom fields;
- cross-selling products or product streams;
- review data when Shopware reviews are enabled.

The frontend continues to control:

- page layout and responsive styling;
- gallery interaction and thumbnail layout;
- dimension display order;
- mapping of option display types to UI components;
- purchase-note icons;
- fixed section headings and CTA labels;
- formatting rules for prices, discounts, dimensions, and ratings.

The Administration sources for badges, dimension fields, purchase notes, and
the option `displayType` mapping must be agreed before the production adapter is
implemented.

## Backend checklist

1. Resolve the requested product from a canonical Shopware SEO URL or stable
   internal route mapping.
2. Return `404` for an inactive, invisible, missing, or sales-channel-invalid
   product.
3. Map translated product data, product number, calculated price, list price,
   manufacturer, category, cover, gallery, properties, and reviews.
4. Agree which property groups or custom fields contain width, height, length,
   material, colors, and other specifications.
5. Normalize width, height, and length to one unit.
6. Map configurator groups, the resolved selection, availability, swatches, and
   optional price differences.
7. Define sources for badges, delivery, returns, and warranty messages.
8. Provide cross-selling products or an agreed product stream.
9. Agree the production media host before changing Next.js image settings.
10. Add runtime parsing, loading, and error handling before removing the mock.
