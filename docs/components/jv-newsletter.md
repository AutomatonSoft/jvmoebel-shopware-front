# `jv-newsletter`

Newsletter callout and subscription form.

## `slot.data`

```json
{
  "eyebrow": "Newsletter",
  "title": "Wohnideen direkt ins Postfach",
  "description": "Erhalten Sie Neuigkeiten, Angebote und Einrichtungsideen.",
  "buttonLabel": "Anmelden",
  "buttonSize": "large",
  "placeholder": "Ihre E-Mail-Adresse",
  "successMessage": "Vielen Dank für Ihre Anmeldung.",
  "invalidEmailMessage": "Geben Sie eine gültige E-Mail-Adresse ein.",
  "errorMessage": "Die Anmeldung ist fehlgeschlagen. Versuchen Sie es erneut."
}
```

## Field contract

| Field                 | Required | Rule                                                 |
| --------------------- | -------- | ---------------------------------------------------- |
| `title`               | yes      | Non-empty section heading.                           |
| `description`         | yes      | Non-empty supporting text.                           |
| `buttonLabel`         | yes      | Subscription button label.                           |
| `placeholder`         | yes      | Email input placeholder.                             |
| `successMessage`      | yes      | Message displayed after a successful subscription.   |
| `invalidEmailMessage` | yes      | Message displayed for an invalid email address.      |
| `errorMessage`        | yes      | Message displayed when subscription fails.           |
| `eyebrow`             | no       | Short text above the heading.                        |
| `buttonSize`          | no       | `small`, `medium`, or `large`; defaults to `medium`. |

The whole element is omitted when any required field is missing. Email
validation and the Shopware newsletter request are handled by the frontend
integration. The confirmation URL is resolved from the current Shopware sales
channel domain.

The form sends a same-origin `POST` request to
`/store-api/newsletter/subscribe`. The Next.js route validates the email and
forwards the subscription to the configured Shopware Store API.

## Shopware Administration

Register the `jv-newsletter` element and block. Editors should control all
visible copy, result messages, and the button size. Use a select for button
size.
