# `jv-product-grid`

Curated grid of product cards inside a CMS page. This is a CMS element
contract, not the full catalog listing contract.

## `slot.data`

```json
{
  "eyebrow": "Für Sie ausgewählt",
  "title": "Beliebte Möbel",
  "locale": "de-DE",
  "currency": "EUR",
  "products": [
    {
      "id": "0123456789abcdef0123456789abcdef",
      "position": 0,
      "url": "/produkt/0123456789abcdef0123456789abcdef",
      "badge": "Bestseller",
      "ratingAverage": 4.9,
      "reviewCount": 128,
      "translated": {
        "name": "Alba Modular Sofa",
        "description": "Natürliches Bouclé, vier Sitzplätze"
      },
      "cover": {
        "media": {
          "url": "https://media.example.com/products/alba.webp",
          "alt": "Alba Modular Sofa"
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
    "label": "Alle Möbel",
    "url": "/moebel-sortiment"
  }
}
```

## Field contract

| Field      | Required | Rule                                                         |
| ---------- | -------- | ------------------------------------------------------------ |
| `title`    | yes      | Non-empty section heading.                                   |
| `locale`   | yes      | Locale used by `Intl.NumberFormat`, for example `de-DE`.     |
| `currency` | yes      | Currency code used to format prices, for example `EUR`.      |
| `products` | yes      | Array or keyed object containing at least one valid product. |
| `eyebrow`  | no       | Short text above the heading.                                |
| `viewAll`  | no       | Rendered only when both `label` and `url` are present.       |

Each product requires:

- non-empty `id` and `url`;
- a name from `translated.name` or `name`;
- non-empty `cover.media.url`;
- finite numeric `calculatedPrice.unitPrice`.

Optional product fields:

| Field                                    | Rule                                                          |
| ---------------------------------------- | ------------------------------------------------------------- |
| `position`                               | Finite number used for ordering; input order is the fallback. |
| `badge`                                  | Short merchandising label.                                    |
| `translated.description` / `description` | Translated value has priority.                                |
| `cover.media.alt`                        | Defaults to the resolved product name.                        |
| `calculatedPrice.listPrice.price`        | Previous price.                                               |
| `ratingAverage`                          | Numeric rating.                                               |
| `reviewCount`                            | Numeric review count.                                         |

Prices use the currency's major unit rather than integer cents. The current UI
formats prices without fractional digits. Invalid products are omitted; the
whole element is omitted when no valid products remain. Arrays are canonical;
keyed objects are also accepted.

## Shopware Administration

Register the `jv-product-grid` element and block. Editors should control the
section copy, product selection and order, and the optional view-all link.
Product name, description, cover media, prices and reviews should normally be
resolved from the selected Shopware products rather than copied into CMS
configuration. The resolver must return the documented normalized product
objects and sales-channel prices in `slot.data`.
