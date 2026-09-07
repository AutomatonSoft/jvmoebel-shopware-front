# Storefront footer CMS contract

Contract version: 1

This document defines how the Shopware backend supplies global footer content
to the Next.js storefront. The footer is managed as a dedicated Shopware
Shopping Experience (`CmsPage`) containing one `jv-footer` element. It is not
part of the CMS page rendered as the main content of an individual route.

## Responsibility boundary

| Footer area                                                                            | Source                                             |
| -------------------------------------------------------------------------------------- | -------------------------------------------------- |
| About text, section headings, revocation CTA, payment methods, social links, copyright | Dedicated `jv-footer` CMS element                  |
| Category links                                                                         | Sales channel `main-navigation`                    |
| Service and legal links                                                                | Sales channel `service-navigation`                 |
| Store name and logo                                                                    | `jvStorefrontBranding` sales channel configuration |
| Layout, responsive behavior, colors and typography                                     | Next.js frontend                                   |

Navigation entries must not be duplicated in `jv-footer`. Their separate
contract is documented in
[`storefront-navigation-contract.md`](storefront-navigation-contract.md).

## Loading flow

```text
GET /store-api/context
â””â”€â”€ salesChannel.configuration.jvStorefrontFooterCmsPageId
    â””â”€â”€ POST /store-api/cms/{id}
        â””â”€â”€ CmsPage.sections[].blocks[].slots[]
            â””â”€â”€ first slot with type = "jv-footer"
                â””â”€â”€ slot.data
```

The context configuration must contain a 32-character hexadecimal Shopware
ID:

```json
{
  "jvStorefrontFooterCmsPageId": "0123456789abcdef0123456789abcdef"
}
```

The frontend loads the CMS page once from the root layout and uses the same
resolved footer on every storefront route. The context request is memoized
within the server render so branding and footer resolution share it.

## Required CMS hierarchy

The page may use any section and block IDs, but it must contain a slot whose
`type` is exactly `jv-footer`. Resolved data must be supplied in `slot.data`.

```json
{
  "id": "0123456789abcdef0123456789abcdef",
  "type": "page",
  "sections": [
    {
      "id": "footer-section",
      "position": 0,
      "type": "default",
      "blocks": [
        {
          "id": "footer-block",
          "position": 0,
          "type": "jv-footer",
          "slots": [
            {
              "id": "footer-slot",
              "slot": "content",
              "type": "jv-footer",
              "data": {}
            }
          ]
        }
      ]
    }
  ]
}
```

Only the first `jv-footer` slot is consumed. Page, section and block styling is
not rendered in the footer because the storefront owns the global layout.

## Complete `slot.data` example

```json
{
  "about": {
    "eyebrow": "Ãœber uns",
    "title": "MÃ¶bel mit Charakter, gemacht fÃ¼r das echte Leben.",
    "description": "Wir bieten unseren Kunden SchÃ¶nes und Praktisches fÃ¼r Haus und Garten."
  },
  "headings": {
    "categories": "Kategorien",
    "service": "Service",
    "paymentMethods": "Zahlungsarten",
    "socialLinks": "Soziale Netzwerke"
  },
  "revocation": {
    "buttonLabel": "Vertrag widerrufen",
    "title": "Vertrag widerrufen",
    "description": "Geben Sie Ihre Vertragsdaten ein. Wir bereiten daraus eine E-Mail an JVMÃ¶bel vor.",
    "submitLabel": "Widerruf per E-Mail vorbereiten",
    "disclaimer": "Der Widerruf wird erst versendet, wenn Sie die vorbereitete E-Mail in Ihrem E-Mail-Programm abschicken.",
    "recipient": "info@jvmoebel.de"
  },
  "paymentMethods": [
    {
      "id": "mastercard",
      "label": "Mastercard",
      "media": {
        "url": "https://media.example.com/footer/mastercard.svg",
        "alt": "Mastercard"
      }
    },
    {
      "id": "paypal",
      "label": "PayPal",
      "media": {
        "url": "https://media.example.com/footer/paypal.svg",
        "alt": "PayPal"
      }
    }
  ],
  "socialLinks": [
    {
      "id": "instagram",
      "label": "Instagram",
      "url": "https://www.instagram.com/example/",
      "media": {
        "url": "https://media.example.com/footer/instagram.svg",
        "alt": "Instagram"
      }
    }
  ],
  "copyright": "Â© {year} {storeName}. Alle Rechte vorbehalten."
}
```

Arrays are the canonical representation for `paymentMethods` and
`socialLinks`. Keyed objects are accepted for fixture and Administration
compatibility, but the backend should emit arrays so display order is explicit.

## Field contract

### `about`

| Field         | Type             | Required | Rendering rule                       |
| ------------- | ---------------- | -------- | ------------------------------------ |
| `eyebrow`     | non-empty string | yes      | Small heading above the statement.   |
| `title`       | non-empty string | yes      | Main footer statement.               |
| `description` | non-empty string | yes      | Plain text; HTML is not interpreted. |

### `headings`

All fields are required non-empty strings:

- `categories` labels the `main-navigation` section.
- `service` labels the `service-navigation` section.
- `paymentMethods` labels the payment logo list.
- `socialLinks` labels the social link list.

### `revocation`

| Field         | Type               | Required | Rendering rule                                          |
| ------------- | ------------------ | -------- | ------------------------------------------------------- |
| `buttonLabel` | non-empty string   | yes      | Opens the revocation dialog.                            |
| `title`       | non-empty string   | yes      | Dialog title.                                           |
| `description` | non-empty string   | yes      | Dialog introduction.                                    |
| `submitLabel` | non-empty string   | yes      | Form submit label.                                      |
| `disclaimer`  | non-empty string   | yes      | Explains that the visitor must send the prepared email. |
| `recipient`   | valid email string | yes      | Recipient used in the generated `mailto:` URL.          |

The form field labels and mail body structure are application behavior and
remain owned by the frontend. CMS controls the visible CTA content and email
recipient, but it cannot inject HTML or JavaScript.

### `paymentMethods`

The field is required and may be an empty array. An empty array hides the
payment section. Every valid item requires:

| Field       | Type             | Required | Rule                                           |
| ----------- | ---------------- | -------- | ---------------------------------------------- |
| `id`        | non-empty string | yes      | Must be unique inside the array.               |
| `label`     | non-empty string | yes      | Accessible name and tooltip.                   |
| `media.url` | URL string       | yes      | Root-relative path or absolute HTTP/HTTPS URL. |
| `media.alt` | string           | no       | Defaults to `label`.                           |

Array order is display order. An invalid item is omitted without removing
other valid payment methods.

### `socialLinks`

The field is required and may be an empty array. An empty array hides the
social section. Every valid item requires:

| Field       | Type                | Required | Rule                                           |
| ----------- | ------------------- | -------- | ---------------------------------------------- |
| `id`        | non-empty string    | yes      | Must be unique inside the array.               |
| `label`     | non-empty string    | yes      | Accessible link name.                          |
| `url`       | absolute URL string | yes      | Only HTTP and HTTPS are accepted.              |
| `media.url` | URL string          | yes      | Root-relative path or absolute HTTP/HTTPS URL. |
| `media.alt` | string              | no       | Defaults to `label`.                           |

Social links always open in a new tab and receive `rel="noreferrer"`. Invalid
protocols such as `javascript:` and protocol-relative URLs are rejected.

### `copyright`

`copyright` is a required non-empty plain-text string. Two placeholders are
supported:

- `{year}` is replaced with the current server year.
- `{storeName}` is replaced with the resolved storefront branding name.

Unknown placeholders remain unchanged.

## Media resolution

Shopware Administration should store a media ID, while the Store API extension
must resolve it into the public `media.url` returned in `slot.data`. Local file
paths are only frontend fallbacks. Production CMS data should use Shopware
media URLs.

The backend is responsible for ensuring that media is publicly reachable and
appropriate for its fixed visual container. Payment logos are displayed inside
a 72 by 40 pixel tile; social icons use a 20 by 20 pixel area. SVG, WebP and
PNG are suitable formats.

## Validation and fallback behavior

- A missing `jvStorefrontFooterCmsPageId` uses the complete local fallback.
- An invalid page ID, failed `/cms/{id}` request or missing `jv-footer` slot
  uses the complete local fallback and reports a server-side issue.
- A missing required content field makes the CMS element invalid and uses the
  complete local fallback.
- Invalid individual payment or social items are reported and omitted while
  valid items continue rendering.
- Empty payment and social arrays are valid and intentionally hide their
  sections.
- Rendering never exposes raw CMS HTML.

The fallback preserves the current storefront footer while backend setup is in
progress. It should remain available until the CMS contract has been verified
in every production sales channel and language.

## Shopware Administration implementation

The backend extension must:

1. Register a CMS element and block named exactly `jv-footer`.
2. Provide Administration controls for every field in this contract.
3. Resolve media selections into `{ url, alt }` objects in `slot.data`.
4. Preserve the configured array order for payment methods and social links.
5. Create a dedicated Shopping Experience containing one `jv-footer` element.
6. Expose that page ID as
   `salesChannel.configuration.jvStorefrontFooterCmsPageId` in the Store API
   context response.
7. Configure the footer independently for every applicable sales channel and
   language.

Registering the frontend renderer does not add Administration controls by
itself; the Shopware extension is required.

## Acceptance checklist

1. `GET /store-api/context` returns a valid footer CMS page ID.
2. `POST /store-api/cms/{id}` returns one resolved `jv-footer` slot.
3. Every required string is non-empty and `recipient` is a valid email.
4. Every item has a unique ID and a reachable media URL.
5. Social URLs use HTTP or HTTPS.
6. Category and service navigation remain configured through their standard
   sales channel entry points.
7. The footer renders correctly on an arbitrary content page, product page and
   error page.
8. Removing the CMS page ID produces the documented fallback without breaking
   the storefront.

## Current migration state

At the time this contract was introduced, the live backend returned the main
navigation and storefront name, but no `service-navigation`, configured logo or
footer CMS page ID. Until those values are configured, the storefront renders
the local footer fallback.
