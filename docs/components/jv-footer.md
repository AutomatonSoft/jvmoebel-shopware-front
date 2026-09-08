# `jv-footer`

Global storefront footer content. Unlike page-body elements, `jv-footer` is
loaded from a dedicated Shopping Experience and rendered by the root layout on
every route.

## Loading contract

The Store API context must expose a 32-character hexadecimal CMS page ID:

```json
{
  "jvStorefrontFooterCmsPageId": "0123456789abcdef0123456789abcdef"
}
```

The frontend then loads `POST /store-api/cms/{id}` and consumes the first slot
whose `type` is `jv-footer`. Resolved content must be present in `slot.data`.
Page, section and block styling from this dedicated CMS page is not rendered.

## `slot.data`

```json
{
  "about": {
    "eyebrow": "Über uns",
    "title": "Möbel mit Charakter, gemacht für das echte Leben.",
    "description": "Wir bieten Schönes und Praktisches für Haus und Garten."
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
    "description": "Geben Sie Ihre Vertragsdaten ein.",
    "submitLabel": "Widerruf per E-Mail vorbereiten",
    "disclaimer": "Der Widerruf wird erst versendet, wenn Sie die vorbereitete E-Mail abschicken.",
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
  "copyright": "© {year} {storeName}. Alle Rechte vorbehalten."
}
```

## Field contract

All `about` fields are required non-empty plain-text strings:

- `eyebrow`;
- `title`;
- `description`.

All `headings` fields are required non-empty strings:

- `categories` labels the main-navigation links;
- `service` labels the service-navigation links;
- `paymentMethods` labels the payment logo list;
- `socialLinks` labels the social link list.

All `revocation` fields are required. `buttonLabel`, `title`, `description`,
`submitLabel`, and `disclaimer` must be non-empty strings. `recipient` must be
a valid email address. The frontend owns the form fields and generated email
body.

`paymentMethods` and `socialLinks` are required arrays or keyed objects and may
be empty. Empty collections hide their sections. Every item needs a unique,
non-empty `id`, a non-empty `label`, and `media.url`. Media URLs may be
root-relative or absolute HTTP/HTTPS URLs; `media.alt` defaults to `label`.
Every social link additionally requires an absolute HTTP/HTTPS `url` and opens
in a new tab.

`copyright` is a required non-empty plain-text string. `{year}` is replaced
with the current server year and `{storeName}` with the resolved storefront
name. Unknown placeholders remain unchanged.

Invalid individual payment methods and social links are omitted while valid
items remain. Missing required top-level content invalidates the complete CMS
payload and activates the local footer fallback. A missing or invalid page ID,
failed CMS request, or missing `jv-footer` slot also activates that fallback
and reports a server-side issue.

## Content ownership

The `jv-footer` element controls about copy, headings, revocation copy and
recipient, payment methods, social links, and copyright. Category links come
from the sales channel main navigation. Service and legal links come from the
service navigation. Store name and logo come from storefront branding
configuration. Layout and styling remain frontend-owned.

## Shopware Administration

The Shopware extension must:

1. Register the `jv-footer` element and block.
2. Provide controls for every documented content field.
3. Allow payment methods and social links to be added, removed and reordered.
4. Resolve selected media to `{ "url", "alt" }` objects in `slot.data`.
5. Create a dedicated Shopping Experience containing one `jv-footer` slot.
6. Expose its ID as
   `salesChannel.configuration.jvStorefrontFooterCmsPageId`.
7. Support separate configuration for every applicable sales channel and
   language.
